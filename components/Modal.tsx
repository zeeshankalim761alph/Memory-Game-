import React from 'react';
import { Trophy, RefreshCcw, Clock, Move } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  moves: number;
  timeElapsed: number;
  onRestart: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, moves, timeElapsed, onRestart }) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all scale-100">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-500/20 p-4 rounded-full ring-4 ring-yellow-500/30">
            <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Excellent!</h2>
        <p className="text-slate-400 mb-8">You've matched all the pairs.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
              <Move className="w-4 h-4" />
              <span className="text-sm font-medium">Moves</span>
            </div>
            <span className="text-2xl font-bold text-white">{moves}</span>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <span className="text-2xl font-bold text-white">{formatTime(timeElapsed)}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 group"
        >
          <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Play Again
        </button>
      </div>
    </div>
  );
};
