import { useState, useCallback, useMemo } from 'react';
import operatorsData from '../data/operators.json';
import bannersData from '../data/banners.json';
import type { Operator, Banner, GachaState, PullResult } from '../types';

const INITIAL_STATE: GachaState = {
  currentBannerIndex: 0,
  pity6: 0,
  pity5: 0,
  pityLimited: 0,
  totalPulls: 0,
  accumulatedPullsForRewards: 0,
  inventory: {},
  history: [],
  tickets: {
    nextBannerTenPull: 0,
    specialTenPull: 0,
  },
  hasClaimed30Reward: false,
};

export const useGachaSystem = () => {
  const [state, setState] = useState<GachaState>(INITIAL_STATE);

  const currentBanner = useMemo(
    () => bannersData[state.currentBannerIndex],
    [state.currentBannerIndex]
  );

  // Helpers to get pools
  const getPools = useCallback((banner: Banner) => {
    const ops = operatorsData as Operator[];

    const upOp = ops.find((o) => o.id === banner.upOperatorId)!;

    // 6 Stars
    // Standard Pool (Non-Limited)
    const standard6 = ops.filter((o) => o.rarity === 6 && !o.isLimited);
    // Other Limiteds (Limited but not current UP)
    const otherLimited6 = ops.filter(
      (o) => o.rarity === 6 && o.isLimited && o.id !== banner.upOperatorId
    );

    const offRate6 = [...standard6, ...otherLimited6];

    const pool5 = ops.filter((o) => o.rarity === 5);
    const pool4 = ops.filter((o) => o.rarity === 4);

    return { upOp, offRate6, pool5, pool4 };
  }, []);

  const performSinglePull = useCallback(
    (
      currentState: GachaState,
      isSpecial: boolean
    ): { result: PullResult; newState: GachaState } => {
      const newState = { ...currentState };

      // If not special, increment total counters
      if (!isSpecial) {
        newState.totalPulls += 1;
        newState.accumulatedPullsForRewards += 1;
      }

      // Check Rewards
      if (!isSpecial) {
        // 30 Pull Reward
        if (
          newState.accumulatedPullsForRewards >= 30 &&
          !newState.hasClaimed30Reward
        ) {
          newState.tickets.specialTenPull += 1;
          newState.hasClaimed30Reward = true;
        }
        // 60 Pull Reward
        if (newState.accumulatedPullsForRewards === 60) {
          newState.tickets.nextBannerTenPull += 1;
        }
      }

      const banner = bannersData[newState.currentBannerIndex];
      const { upOp, offRate6, pool5, pool4 } = getPools(banner);

      let selectedOp: Operator;
      let isUp = false;

      // Logic:
      // 1. Check Hard Limited Guarantee (120 pulls)
      // 2. Else Check 6* (RNG + Soft/Hard Pity)
      // 3. Else Check 5* (RNG + Pity)
      // 4. Else 4*

      // 1. Hard Limited Guarantee
      if (!isSpecial && newState.pityLimited >= 119) {
        selectedOp = upOp;
        // Reset Pities
        newState.pityLimited = 0;
        newState.pity6 = 0;
        newState.pity5 = 0;
      } else {
        // 2. Check 6* Probability
        let prob6 = 0.008;
        if (!isSpecial) {
          if (newState.pity6 >= 65) {
            prob6 += (newState.pity6 - 65) * 0.025;
          }
          if (newState.pity6 >= 79) prob6 = 1.0;
        }

        const rng = Math.random();

        if (rng < prob6) {
          // 6* Obtained. Determine UP vs Off-Rate.
          // Note: Limited Guarantee (120) handled above.
          // Here we use 50/50.
          isUp = Math.random() < 0.5;

          if (isUp) {
            selectedOp = upOp;
            if (!isSpecial) newState.pityLimited = 0;
          } else {
            const randIndex = Math.floor(Math.random() * offRate6.length);
            selectedOp = offRate6[randIndex];
            if (!isSpecial) newState.pityLimited += 1;
          }

          if (!isSpecial) {
            newState.pity6 = 0;
            newState.pity5 = 0;
          }
        } else {
          // No 6*
          if (!isSpecial) newState.pity6 += 1;

          // 3. Check 5* Probability
          let prob5 = 0.08;
          if (!isSpecial && newState.pity5 >= 9) prob5 = 1.0;

          // Single RNG Logic for consistency with previous thought:
          // If rng < prob6 -> 6* (Handled)
          // Else -> Check 5*
          // But we already used 'rng' for 6*.
          // The range [prob6 ... prob6+prob5] logic.

          const threshold5 = prob6 + prob5;

          if (rng < threshold5) {
            const randIndex = Math.floor(Math.random() * pool5.length);
            selectedOp = pool5[randIndex];
            if (!isSpecial) newState.pity5 = 0;
          } else {
            // 4. 4*
            const randIndex = Math.floor(Math.random() * pool4.length);
            selectedOp = pool4[randIndex];
            if (!isSpecial) newState.pity5 += 1;
          }

          // Note: If we missed 6*, we definitely incremented pityLimited?
          // "Every 120 pulls must get...".
          // Yes, every pull that isn't the UP Limited counts towards the 120.
          // If I got a 6* Off-Rate, I incremented it (above).
          // If I got a 5* or 4*, I must increment it too.
          if (!isSpecial) newState.pityLimited += 1;
        }
      }

      // Update Inventory
      newState.inventory[selectedOp!.id] =
        (newState.inventory[selectedOp!.id] || 0) + 1;

      // Add to History
      const result: PullResult = {
        operator: selectedOp!,
        isNew: newState.inventory[selectedOp!.id] === 1,
        pullIndex: newState.history.length + 1,
      };
      newState.history = [result, ...newState.history];

      return { result, newState };
    },
    [getPools]
  );

  const pull = useCallback(
    (count: number, isSpecial: boolean = false) => {
      // Check Resources
      if (isSpecial) {
        if (state.tickets.specialTenPull < 1 && count === 10) return; // Only have 10-pull special
        if (count !== 10) return; // Special is only 10-pull
      }

      // Process Pulls
      let currentState = { ...state };
      if (isSpecial) {
        currentState.tickets.specialTenPull -= 1;
      }

      const results: PullResult[] = [];

      for (let i = 0; i < count; i++) {
        const { result, newState } = performSinglePull(currentState, isSpecial);
        currentState = newState;
        results.push(result);
      }

      setState(currentState);
      return results;
    },
    [state, performSinglePull]
  );

  const nextBanner = useCallback(() => {
    setState((prev) => {
      const nextIndex = (prev.currentBannerIndex + 1) % bannersData.length;

      // Grant Ticket Logic: "Accumulated 60 pulls, get NEXT period 10-pull".
      // The ticket is in `prev.tickets.nextBannerTenPull`.
      // We shouldn't "grant" it here, it was granted when 60 was reached.
      // We just ensure it's usable?
      // Logic: The ticket allows a free 10-pull on the *next* banner.
      // So if I have it, I can use it now that I switched?
      // Actually, maybe I should convert "Next Banner Ticket" to "Current Pulls"?
      // Or just keep it as a ticket item that UI shows "Free 10 Pull" button if available.
      // I'll keep it as is.

      return {
        ...prev,
        currentBannerIndex: nextIndex,
        pityLimited: 0, // Resets per banner
        // pity6 Maintains
        // pity5 Maintains
        // accumulatedPullsForRewards: Resets? "Accumulated 60 pulls... get next".
        // Usually events reset accumulation per phase.
        // "Accumulate 30/60 pulls" -> likely resets.
        accumulatedPullsForRewards: 0,
        hasClaimed30Reward: false,
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    pull,
    nextBanner,
    resetAll,
    currentBanner,
  };
};
