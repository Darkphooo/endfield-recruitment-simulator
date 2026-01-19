import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-[90%] md:w-full max-w-md p-6 bg-endfield-black border border-endfield-yellow/50 shadow-[0_0_20px_rgba(255,225,0,0.1)]">
        
        <div className="flex items-center gap-3 mb-4 text-endfield-yellow">
           <AlertTriangle size={24} />
           <h2 className="text-xl font-bold uppercase tracking-wider">{title}</h2>
        </div>

        <div className="text-gray-300 mb-8 leading-relaxed">
           {message}
        </div>

        <div className="flex gap-4">
            <button 
                onClick={onCancel}
                className="flex-1 py-4 min-h-[44px] border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors uppercase font-bold tracking-wider"
            >
                取消
            </button>
            <button 
                onClick={onConfirm}
                className="flex-1 py-4 min-h-[44px] bg-endfield-yellow text-black hover:bg-white transition-colors uppercase font-bold tracking-wider"
            >
                确认
            </button>
        </div>
      </div>
    </div>
  );
};
