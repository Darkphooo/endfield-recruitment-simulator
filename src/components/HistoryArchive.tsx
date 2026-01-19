import React, { useState, useMemo } from 'react';
import { X, Grid, List } from 'lucide-react';
import type { GachaState } from '../types';
import operatorsData from '../data/operators.json';
import { getOperatorAvatar } from '../utils/imageUtils';

interface HistoryArchiveProps {
  state: GachaState;
  onClose: () => void;
}

type TabMode = 'list' | 'stats';

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({ state, onClose }) => {
  const [mode, setMode] = useState<TabMode>('list');

  // Prepare stats data
  const statsData = useMemo(() => {
    // Group operators by rarity
    const allOps = operatorsData as { id: string; name: string; rarity: number }[];
    const grouped = {
      6: allOps.filter(op => op.rarity === 6),
      5: allOps.filter(op => op.rarity === 5),
      4: allOps.filter(op => op.rarity === 4),
    };

    return grouped;
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-full md:h-[90vh] flex flex-col bg-endfield-black border border-gray-700 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700 bg-gray-900/50 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-endfield-yellow tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-6 md:h-8 bg-endfield-yellow block mr-2" />
              人事档案
            </h2>
            <div className="flex bg-black border border-gray-700 p-1 rounded-lg self-start md:self-auto">
              <button
                onClick={() => setMode('list')}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 text-sm font-bold transition-all min-h-[32px] ${
                  mode === 'list' 
                    ? 'bg-endfield-gray text-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <List size={16} />
                寻访记录
              </button>
              <button
                onClick={() => setMode('stats')}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 text-sm font-bold transition-all min-h-[32px] ${
                  mode === 'stats' 
                    ? 'bg-endfield-gray text-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Grid size={16} />
                干员名册
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* LIST MODE */}
          {mode === 'list' && (
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 md:p-6">
              {/* Desktop Table */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead className="sticky top-0 bg-endfield-black z-10">
                  <tr className="text-gray-500 border-b border-gray-700 text-sm uppercase tracking-wider">
                    <th className="p-4 font-normal">序号</th>
                    <th className="p-4 font-normal">干员名称</th>
                    <th className="p-4 font-normal">稀有度</th>
                    <th className="p-4 font-normal">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {state.history.map((record, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-500 font-mono">
                        {String(state.history.length - idx).padStart(4, '0')}
                      </td>
                      <td className="p-4 flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${
                             record.operator.rarity === 6 ? 'bg-endfield-yellow shadow-[0_0_8px_#FFE100]' :
                             record.operator.rarity === 5 ? 'bg-purple-500' : 'bg-gray-500'
                         }`} />
                         <span className={`font-bold ${
                             record.operator.rarity === 6 ? 'text-endfield-yellow' :
                             record.operator.rarity === 5 ? 'text-purple-300' : 'text-gray-300'
                         }`}>
                             {record.operator.name}
                         </span>
                      </td>
                      <td className="p-4 font-mono">
                        {Array(record.operator.rarity).fill('★').join('')}
                      </td>
                      <td className="p-4">
                         {record.isNew && (
                             <span className="px-2 py-0.5 text-xs bg-red-900/50 text-red-400 border border-red-900 rounded">
                                 NEW
                             </span>
                         )}
                      </td>
                    </tr>
                  ))}
                  {state.history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-600">
                        暂无寻访记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Mobile List View */}
              <div className="md:hidden space-y-3">
                  {state.history.map((record, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-800 p-3 rounded flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <div className="text-xs text-gray-600 font-mono w-8">
                                #{state.history.length - idx}
                             </div>
                             <div className="flex flex-col">
                                <span className={`font-bold ${
                                     record.operator.rarity === 6 ? 'text-endfield-yellow' :
                                     record.operator.rarity === 5 ? 'text-purple-300' : 'text-gray-300'
                                 }`}>
                                     {record.operator.name}
                                 </span>
                                 <span className="text-xs text-gray-500">
                                    {Array(record.operator.rarity).fill('★').join('')}
                                 </span>
                             </div>
                        </div>
                        
                        {record.isNew && (
                             <span className="px-2 py-0.5 text-xs bg-red-900/50 text-red-400 border border-red-900 rounded">
                                 NEW
                             </span>
                        )}
                    </div>
                  ))}
                  {state.history.length === 0 && (
                    <div className="p-8 text-center text-gray-600">
                        暂无寻访记录
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* STATS MODE */}
          {mode === 'stats' && (
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-8 md:space-y-12">
              
              {/* 6 Stars */}
              <section>
                <h3 className="text-endfield-yellow text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-4 border-b border-gray-800 pb-2">
                  <span className="text-3xl md:text-4xl">6★</span>
                  <span className="text-sm opacity-50 tracking-widest uppercase">六星干员</span>
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
                  {statsData[6].map(op => {
                    const count = state.inventory[op.id] || 0;
                    const isOwned = count > 0;
                    return (
                      <OperatorCard key={op.id} op={op} count={count} isOwned={isOwned} />
                    );
                  })}
                </div>
              </section>

              {/* 5 Stars */}
              <section>
                <h3 className="text-purple-400 text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-4 border-b border-gray-800 pb-2">
                  <span className="text-3xl md:text-4xl">5★</span>
                  <span className="text-sm opacity-50 tracking-widest uppercase">五星干员</span>
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
                  {statsData[5].map(op => {
                    const count = state.inventory[op.id] || 0;
                    const isOwned = count > 0;
                    return (
                      <OperatorCard key={op.id} op={op} count={count} isOwned={isOwned} />
                    );
                  })}
                </div>
              </section>

              {/* 4 Stars */}
              <section>
                <h3 className="text-gray-400 text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-4 border-b border-gray-800 pb-2">
                  <span className="text-3xl md:text-4xl">4★</span>
                  <span className="text-sm opacity-50 tracking-widest uppercase">四星干员</span>
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
                  {statsData[4].map(op => {
                    const count = state.inventory[op.id] || 0;
                    const isOwned = count > 0;
                    return (
                      <OperatorCard key={op.id} op={op} count={count} isOwned={isOwned} />
                    );
                  })}
                </div>
              </section>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const OperatorCard = ({ op, count, isOwned }: { op: { id: string; name: string; rarity: number }, count: number, isOwned: boolean }) => (
  <div className={`relative group border ${isOwned ? 'border-gray-700 bg-gray-800/30' : 'border-dashed border-gray-800 bg-transparent'} transition-all hover:border-endfield-yellow overflow-hidden`}>
    <div className={`aspect-square relative ${isOwned ? '' : 'grayscale opacity-30'}`}>
        {/* Placeholder for now if image load fails, but we assume it works */}
        <img 
            src={getOperatorAvatar(op.name)} 
            alt={op.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onError={(e) => {
                // Fallback styling if image missing
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
        {/* Fallback Text if Image Hidden */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold pointer-events-none z-[-1]">
            {op.name}
        </div>
    </div>
    
    <div className="p-2 text-center bg-black/50 backdrop-blur-sm border-t border-gray-800 absolute bottom-0 w-full">
       <div className={`text-sm font-bold truncate ${isOwned ? 'text-white' : 'text-gray-600'}`}>
         {op.name}
       </div>
    </div>

    {isOwned && (
       <div className="absolute top-1 right-1 bg-endfield-yellow text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">
          x{count}
       </div>
    )}
  </div>
);
