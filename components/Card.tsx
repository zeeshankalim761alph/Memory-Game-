import React from 'react';
import { CardType } from '../types';
import { HelpCircle } from 'lucide-react';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
  disabled: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  // Determine if the card shows its face
  const showFace = card.isFlipped || card.isMatched;

  const handleClick = () => {
    if (!disabled && !showFace) {
      onClick(card);
    }
  };

  return (
    <div 
      className={`relative h-24 w-full cursor-pointer perspective-1000 group ${disabled ? 'cursor-default' : ''}`}
      onClick={handleClick}
    >
      <div
        className={`relative h-full w-full shadow-xl transition-all duration-500 transform-style-3d rounded-xl ${
          showFace ? 'rotate-y-180' : ''
        }`}
      >
        {/* Card Back (Face Down) */}
        <div className="absolute h-full w-full backface-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-400/30">
          <HelpCircle className="text-white/20 w-8 h-8 md:w-10 md:h-10" />
        </div>

        {/* Card Front (Face Up) */}
        <div className="absolute h-full w-full backface-hidden rotate-y-180 rounded-xl bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center shadow-emerald-500/10">
          <span className="text-4xl md:text-5xl select-none filter drop-shadow-lg">
            {card.content}
          </span>
          {card.isMatched && (
             <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center justify-center animate-pulse">
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
