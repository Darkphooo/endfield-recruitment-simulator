import { useState } from 'react';
import { useGachaSystem } from './hooks/useGachaSystem';
import { ResultModal } from './components/ResultModal';
import { HistoryArchive } from './components/HistoryArchive';
import { ConfirmModal } from './components/ConfirmModal';
import type { PullResult } from './types';
import {
  Layers,
  RotateCcw,
  ChevronRight,
  History,
  Ticket,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { getOperatorFull } from './utils/imageUtils';
import bgImage from './assets/images/bg.jpg';

function App() {
  const { state, pull, nextBanner, resetAll, currentBanner } = useGachaSystem();
  const [modalResults, setModalResults] = useState<PullResult[] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'NEXT' | 'RESET';
    title: string;
    message: string;
  } | null>(null);

  const handlePull = (count: number, isSpecial: boolean = false) => {
    const results = pull(count, isSpecial);
    if (results && results.length > 0) {
      setModalResults(results);
    }
  };

  const requestNextBanner = () => {
    setConfirmAction({
      type: 'NEXT',
      title: '切换卡池',
      message:
        '是否切换到下一期卡池？这将重置限定保底（120抽），但保留6星水位。此操作不可逆。',
    });
  };

  const requestReset = () => {
    setConfirmAction({
      type: 'RESET',
      title: '系统重置',
      message: '确认重置所有数据（包括干员、记录、水位）？此操作不可撤销。',
    });
  };

  const executeConfirm = () => {
    if (confirmAction?.type === 'NEXT') {
      nextBanner();
    } else if (confirmAction?.type === 'RESET') {
      resetAll();
    }
    setConfirmAction(null);
  };

  // Calculate stats for display
  const prob6Current =
    state.pity6 >= 65 ? (0.8 + (state.pity6 - 65) * 2.5).toFixed(1) : '0.8';

  // Current UP Operator Name Map for Display
  const upOpNameMap: Record<string, { cn: string }> = {
    laevatain: { cn: '莱万汀' },
    djelpeta: { cn: '洁尔佩塔' },
    yvonne: { cn: '伊冯' },
  };

  const currentUpNames = upOpNameMap[currentBanner.upOperatorId] || {
    cn: '未知',
  };

  return (
    <div
      className="min-h-screen bg-endfield-black text-white font-mono bg-repeat opacity-95"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5" />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-endfield-gray flex justify-between items-center bg-endfield-black/90 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-endfield-yellow text-black flex items-center justify-center font-bold text-xl">
            E
          </div>
          <h1 className="text-2xl font-bold tracking-tighter">
            明日方舟：终末地 寻访模拟
          </h1>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Ticket className="text-endfield-yellow" size={18} />
            <span className="text-gray-400">下期十连券:</span>
            <span className="text-xl font-bold">
              {state.tickets.nextBannerTenPull}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="text-blue-400" size={18} />
            <span className="text-gray-400">特殊十连券:</span>
            <span className="text-xl font-bold">
              {state.tickets.specialTenPull}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Stats & Info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-endfield-gray/30 p-6 border-l-4 border-endfield-yellow">
            <h3 className="text-endfield-yellow font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} />
              监测数据
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">6★ 保底:</span>
                <span
                  className={`${
                    state.pity6 > 50 ? 'text-red-500' : 'text-white'
                  }`}
                >
                  {state.pity6} / 80
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">当前概率:</span>
                <span className="text-endfield-yellow">{prob6Current}%</span>
              </div>
              <div className="h-px bg-gray-700 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-400">限定保底:</span>
                <span className="text-blue-400">{state.pityLimited} / 120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">5★ 保底:</span>
                <span>{state.pity5} / 10</span>
              </div>
              <div className="h-px bg-gray-700 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-400">总寻访次数:</span>
                <span>{state.totalPulls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">奖励进度:</span>
                <span>
                  {Math.min(state.accumulatedPullsForRewards, 60)} / 60
                </span>
              </div>
            </div>
          </div>

          <div className="bg-endfield-gray/30 p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 font-bold flex items-center gap-2">
                <History size={18} />
                近期记录
              </h3>
              <button
                onClick={() => setShowHistory(true)}
                className="text-xs bg-gray-800 hover:bg-endfield-yellow hover:text-black px-2 py-1 transition-colors flex items-center gap-1"
              >
                <Menu size={12} />
                查看全部
              </button>
            </div>

            <div className="space-y-2 text-xs h-64 overflow-y-auto custom-scrollbar">
              {state.history.slice(0, 20).map((res, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 bg-black/50 border-l-2 border-transparent hover:border-endfield-yellow"
                >
                  <span
                    className={`${
                      res.operator.rarity === 6
                        ? 'text-endfield-yellow font-bold'
                        : res.operator.rarity === 5
                        ? 'text-purple-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {res.operator.name}
                  </span>
                  <span className="opacity-50">{res.operator.rarity}★</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Banner Visual */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex-1 bg-linear-to-br from-gray-900 to-black border border-gray-700 relative overflow-hidden group">
            {/* Operator Full Image Background */}
            <div className="absolute inset-0 z-0 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-80 transition-all duration-700">
              <img
                src={getOperatorFull(currentUpNames.cn)}
                className="w-full h-full object-cover object-top"
                alt="Banner Character"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Banner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <div className="text-endfield-yellow/20 text-9xl font-bold absolute top-10 opacity-50 select-none">
                0{state.currentBannerIndex + 1}
              </div>

              <div className="relative z-20 text-center space-y-2 mt-auto mb-20">
                <div className="text-xl text-gray-300 tracking-[0.5em] uppercase mb-2 text-shadow">
                  概率提升
                </div>
                <div className="text-6xl md:text-7xl font-bold text-endfield-yellow text-shadow uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,225,0,0.5)]">
                  {currentUpNames.cn}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-10 left-0 w-full flex justify-center gap-4 text-xs text-gray-400 uppercase tracking-widest bg-black/50 py-2 backdrop-blur-sm">
                <span>概率提升</span>
                <span>::</span>
                <span>限定寻访</span>
                <span>::</span>
                <span>终末地工业</span>
              </div>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px] pointer-events-none" />
          </div>

          {/* Action Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handlePull(1)}
              className="bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-endfield-yellow text-white py-4 font-bold transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">单次寻访</span>
              <div className="absolute inset-0 bg-endfield-yellow/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            </button>

            <button
              onClick={() => handlePull(10)}
              className="col-span-1 bg-endfield-yellow text-black border border-endfield-yellow hover:bg-white hover:text-black py-4 font-bold transition-all relative overflow-hidden shadow-[0_0_20px_rgba(255,225,0,0.2)]"
            >
              十连寻访 / x10
            </button>

            <button
              onClick={() => handlePull(10, true)}
              disabled={state.tickets.specialTenPull < 1}
              className="col-span-2 bg-blue-900/50 border border-blue-500/50 text-blue-200 py-4 font-bold transition-all hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Ticket size={18} />
              特殊十连 ({state.tickets.specialTenPull})
            </button>
          </div>
        </div>

        {/* Right: Controls & Nav */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-endfield-gray/30 p-6 border border-gray-700 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-gray-300 font-bold mb-6 flex items-center gap-2">
                <Layers size={18} />
                系统操作
              </h3>

              <div className="space-y-4">
                <button
                  onClick={requestNextBanner}
                  className="w-full flex items-center justify-between p-4 bg-black border border-gray-600 hover:border-endfield-yellow hover:text-endfield-yellow transition-all group"
                >
                  <span className="font-bold">切换下一期</span>
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-xs text-gray-500 px-2 leading-relaxed">
                  切换卡池将重置限定保底 (120抽)，但保留 6★ 概率提升水位。
                </div>

                <button
                  onClick={requestReset}
                  className="w-full flex items-center justify-between p-4 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 hover:border-red-500 text-red-500 transition-all mt-8"
                >
                  <span className="font-bold">系统重置</span>
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4">
              <div className="text-xs text-gray-500 mb-2">当前周期</div>
              <div className="text-xl font-bold text-endfield-yellow">
                {currentBanner.name}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modalResults && (
        <ResultModal
          results={modalResults}
          onClose={() => setModalResults(null)}
        />
      )}

      {showHistory && (
        <HistoryArchive state={state} onClose={() => setShowHistory(false)} />
      )}

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={executeConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

export default App;
