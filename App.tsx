import React, { useState, useEffect, useCallback } from 'react';
import { CardType, GameMode, GameStatus } from './types';
import { generateDeck } from './utils/gameLogic';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Clock, RefreshCcw, BrainCircuit, Gamepad2, Move } from 'lucide-react';

const PREVIEW_DURATION = 5000; // 5 seconds

function App() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.CLASSIC);
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewCountdown, setPreviewCountdown] = useState(PREVIEW_DURATION / 1000);

  // Initialize game
  const startNewGame = useCallback((mode: GameMode = gameMode) => {
    const newDeck = generateDeck();
    setCards(newDeck);
    setMoves(0);
    setTimeElapsed(0);
    setFirstCard(null);
    setSecondCard(null);
    setIsProcessing(false);
    setGameMode(mode);

    if (mode === GameMode.REMEMBER) {
      // Show all cards initially
      setGameStatus(GameStatus.PREVIEW);
      const previewDeck = newDeck.map(c => ({ ...c, isFlipped: true }));
      setCards(previewDeck);
      setPreviewCountdown(PREVIEW_DURATION / 1000);
    } else {
      setGameStatus(GameStatus.PLAYING);
    }
  }, [gameMode]);

  // Initial load
  useEffect(() => {
    startNewGame(GameMode.CLASSIC);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Timer logic for Game & Preview
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (gameStatus === GameStatus.PLAYING) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (gameStatus === GameStatus.PREVIEW) {
      interval = setInterval(() => {
        setPreviewCountdown(prev => {
          if (prev <= 1) {
            // Preview over, flip cards back and start playing
            setCards(current => current.map(c => ({ ...c, isFlipped: false })));
            setGameStatus(GameStatus.PLAYING);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStatus]);

  // Check for win
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameStatus(GameStatus.WON);
    }
  }, [cards]);

  const handleCardClick = (clickedCard: CardType) => {
    // Validation: Prevent clicking if processing, wrong state, or card already handled
    if (
      gameStatus !== GameStatus.PLAYING ||
      isProcessing ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return;
    }

    // Flip the clicked card
    const updatedCards = cards.map(c => 
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    if (!firstCard) {
      // First selection
      setFirstCard(clickedCard);
    } else {
      // Second selection
      setSecondCard(clickedCard);
      setIsProcessing(true);
      setMoves(prev => prev + 1);

      // Check for match
      if (firstCard.content === clickedCard.content) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.content === firstCard.content ? { ...c, isMatched: true } : c
          ));
          resetTurn();
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCard.id || c.id === clickedCard.id 
              ? { ...c, isFlipped: false } 
              : c
          ));
          resetTurn();
        }, 1000);
      }
    }
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setIsProcessing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-8 px-4 font-sans">
      
      {/* Header Section */}
      <header className="w-full max-w-4xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
            Memory Master
          </h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${gameStatus === GameStatus.PLAYING ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
            {gameStatus === GameStatus.PREVIEW ? `Memorize! ${previewCountdown}s` : 'Find matches'}
          </p>
        </div>

        {/* Stats Board */}
        <div className="flex gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
            <Move className="w-5 h-5 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Moves</span>
              <span className="text-xl font-mono font-bold text-white leading-none">{moves}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Time</span>
              <span className="text-xl font-mono font-bold text-white leading-none">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Game Controls */}
      <div className="w-full max-w-md flex gap-4 mb-8">
        <button
          onClick={() => startNewGame(GameMode.CLASSIC)}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
            gameMode === GameMode.CLASSIC 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          Classic
        </button>
        <button
          onClick={() => startNewGame(GameMode.REMEMBER)}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
            gameMode === GameMode.REMEMBER 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <BrainCircuit className="w-5 h-5" />
          Remember
        </button>
      </div>

      {/* Game Board */}
      <div className="relative w-full max-w-md md:max-w-2xl aspect-square md:aspect-auto">
        {gameStatus === GameStatus.PREVIEW && (
          <div className="absolute inset-0 -top-12 z-10 flex items-start justify-center pointer-events-none">
             <div className="bg-amber-500/90 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-bounce">
               Memorize the cards!
             </div>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-3 md:gap-4 w-full mx-auto">
          {cards.map(card => (
            <Card 
              key={card.id} 
              card={card} 
              onClick={handleCardClick}
              disabled={gameStatus !== GameStatus.PLAYING}
            />
          ))}
        </div>
      </div>

      {/* Footer / Reset */}
      <div className="mt-12">
        <button 
          onClick={() => startNewGame()}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          Restart Game
        </button>
      </div>

      <Modal 
        isOpen={gameStatus === GameStatus.WON}
        moves={moves}
        timeElapsed={timeElapsed}
        onRestart={() => startNewGame()}
      />
    </div>
  );
}

export default App;