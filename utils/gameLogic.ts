import { CardType } from '../types';

// Default emoji set for the game
const EMOJIS = ['🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🐙', '🦄'];

/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generates a fresh deck of cards based on the grid size (4x4 = 16 cards = 8 pairs)
 */
export const generateDeck = (): CardType[] => {
  const pairs = [...EMOJIS, ...EMOJIS]; // Duplicate to create pairs
  const shuffled = shuffleArray(pairs);
  
  return shuffled.map((emoji, index) => ({
    id: index,
    content: emoji,
    isFlipped: false,
    isMatched: false,
  }));
};
