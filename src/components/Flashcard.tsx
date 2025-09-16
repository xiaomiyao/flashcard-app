import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardProps {
  card: FlashcardType;
  onFlip?: () => void;
  onDifficultyRate?: (difficulty: 'easy' | 'medium' | 'hard') => void;
  showDifficultyButtons?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  onFlip,
  onDifficultyRate,
  showDifficultyButtons = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    onFlip?.();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Difficulty Badge */}
      <div className="flex justify-between items-center mb-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(card.difficulty)}`}>
          {card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1)}
        </div>
        <div className="text-sm text-gray-500">
          {card.category}
        </div>
      </div>

      {/* Flashcard */}
      <motion.div
        className="relative w-full h-80 cursor-pointer"
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 w-full h-full card rounded-2xl p-8 flex flex-col justify-center items-center text-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">
              {card.question}
            </h3>
            <p className="text-sm text-gray-500">
              Click to reveal answer
            </p>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 w-full h-full card rounded-2xl p-8 flex flex-col justify-center items-center text-center backface-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">
              {card.answer}
            </h3>
            <p className="text-sm text-gray-500">
              Click to see question again
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Difficulty Rating Buttons */}
      <AnimatePresence>
        {showDifficultyButtons && isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex justify-center space-x-3"
          >
            <button
              onClick={() => onDifficultyRate?.('easy')}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Easy
            </button>
            <button
              onClick={() => onDifficultyRate?.('medium')}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Medium
            </button>
            <button
              onClick={() => onDifficultyRate?.('hard')}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Hard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flashcard;

