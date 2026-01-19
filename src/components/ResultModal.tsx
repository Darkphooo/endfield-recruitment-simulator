import React from 'react';
import type { PullResult } from '../types';
import { X } from 'lucide-react';
import { getOperatorAvatar } from '../utils/imageUtils';

interface ResultModalProps {
  results: PullResult[];
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ results, onClose }) => {
  if (results.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-8">
      <div className="relative w-full max-w-6xl h-full md:h-auto p-4 md:p-8 bg-endfield-black border-y md:border border-endfield-yellow/30 overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-endfield-yellow hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X size={32} />
        </button>

        <div className="text-center mb-4 md:mb-8 mt-4 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold text-endfield-yellow tracking-widest uppercase">
            寻访结果
          </h2>
          <div className="h-1 w-24 bg-endfield-yellow mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-5 gap-1 md:gap-4 pb-20 md:pb-0">
          {results.map((res, idx) => (
            <div 
              key={idx}
              className={`
                relative group flex flex-col items-center p-1 md:p-2 border transition-all duration-300 overflow-hidden
                ${res.operator.rarity === 6 ? 'border-endfield-yellow bg-endfield-yellow/10 shadow-[0_0_15px_rgba(255,225,0,0.3)]' : ''}
                ${res.operator.rarity === 5 ? 'border-purple-500 bg-purple-900/20' : ''}
                ${res.operator.rarity === 4 ? 'border-gray-600 bg-gray-800/30' : ''}
                ${res.operator.isLimited ? 'animate-pulse-slow shadow-[0_0_20px_#FFE100]' : ''}
              `}
              style={{
                animation: `fadeInUp 0.3s ease-out forwards`,
                animationDelay: `${idx * 0.1}s`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              {/* Limited Effect Overlay */}
              {res.operator.isLimited && (
                  <>
                    <div className="absolute inset-0 bg-linear-to-t from-endfield-yellow/30 to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-white/50 animate-ping opacity-20" />
                  </>
              )}

              <div className="text-xl md:text-4xl font-bold mb-0.5 md:mb-2 opacity-20 absolute top-1 right-1 md:top-2 md:right-2 z-0">
                {res.operator.rarity}★
              </div>
              
              {/* Image Container */}
              <div className="w-full aspect-square relative mb-1 md:mb-2 bg-black/50 overflow-hidden">
                <img 
                    src={getOperatorAvatar(res.operator.name)} 
                    alt={res.operator.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
              </div>

              <div className="text-center z-10 w-full px-0.5">
                <div className={`text-[10px] md:text-lg font-bold truncate leading-tight ${
                   res.operator.rarity === 6 ? 'text-endfield-yellow' : 
                   res.operator.rarity === 5 ? 'text-purple-400' : 'text-gray-300'
                }`}>
                  {res.operator.name}
                </div>
                {res.isNew && (
                  <span className="inline-block mt-0.5 md:mt-1 px-1 md:px-2 py-0 md:py-0.5 text-[8px] md:text-xs bg-red-600 text-white font-bold rounded-sm">
                    NEW
                  </span>
                )}
              </div>
              
              {/* Decorative Lines */}
              <div className="absolute bottom-0 left-0 w-1 md:w-2 h-1 md:h-2 border-l border-b border-current opacity-50" />
              <div className="absolute top-0 right-0 w-1 md:w-2 h-1 md:h-2 border-r border-t border-current opacity-50" />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center pb-8 md:pb-0">
            <button 
                onClick={onClose}
                className="w-full md:w-auto px-12 py-4 min-h-[44px] bg-endfield-yellow text-black font-bold text-lg hover:bg-white transition-colors uppercase tracking-wider clip-path-polygon"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
            >
                确认
            </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
