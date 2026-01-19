export interface Operator {
  id: string;
  name: string;
  rarity: 4 | 5 | 6;
  isLimited: boolean;
}

export interface Banner {
  id: number;
  name: string;
  upOperatorId: string;
}

export interface PullResult {
  operator: Operator;
  isNew: boolean; // Not strictly tracked in requirement but good for UI
  pullIndex: number; // For animation order
}

export interface GachaState {
  currentBannerIndex: number; // 0, 1, 2 for array access (Banner ID - 1)
  
  // Pity Counters
  pity6: number; // Accumulated non-6* pulls
  pity5: number; // Accumulated non-5* pulls
  pityLimited: number; // Accumulated non-UP pulls (resets per banner)
  
  // Stats
  totalPulls: number; // Total pulls done across all banners (for 60 pull reward logic?) 
  // Wait, "Accumulate 60 pulls, get next period 10-pull".
  // "Accumulate 30 pulls, get 10-pull (not participating in ...)"
  // So we need a "Total Pulls Counter" that persists? Or resets?
  // Usually "Accumulate X pulls" implies a lifetime or event-long counter.
  // Since it says "Next period", it implies across the event.
  
  accumulatedPullsForRewards: number; 

  // Inventory / History
  inventory: Record<string, number>; // ID -> Count
  history: PullResult[];
  
  // Resources
  tickets: {
    nextBannerTenPull: number; // "Next Period 10-pull"
    specialTenPull: number; // "30 pull reward"
  };

  // Flags
  hasClaimed30Reward: boolean; // To prevent multiple claims if logic is "at 30"
  // Actually logic is "Accumulate 30, get one". Simple check.
}
