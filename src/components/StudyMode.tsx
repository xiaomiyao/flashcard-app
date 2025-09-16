import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from './Flashcard';
import { Flashcard as FlashcardType, Progress } from '../types';

interface StudyModeProps {
  flashcards: FlashcardType[];
  onSessionComplete: (progress: Progress) => void;
  timerMode: boolean;
}

const StudyMode: React.FC<StudyModeProps> = ({
  flashcards,
  onSessionComplete,
  timerMode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  const handleDifficultyRate = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    // Mark card as studied
    setStudiedCards(prev => new Set([...Array.from(prev), currentCard.id]));

    // Count as correct if rated easy or medium, incorrect if hard
    if (difficulty === 'easy' || difficulty === 'medium') {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session complete
      setIsSessionComplete(true);
      const sessionEndTime = new Date();
      const timeSpent = Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000);
      
      const finalProgress: Progress = {
        totalCards,
        studiedCards: studiedCards.size + 1,
        correctAnswers: difficulty === 'easy' || difficulty === 'medium' ? correctAnswers + 1 : correctAnswers,
        incorrectAnswers: difficulty === 'hard' ? incorrectAnswers + 1 : incorrectAnswers,
        accuracy: totalCards > 0 ? ((difficulty === 'easy' || difficulty === 'medium' ? correctAnswers + 1 : correctAnswers) / totalCards) * 100 : 0,
        timeSpent
      };

      onSessionComplete(finalProgress);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionComplete(true);
      const sessionEndTime = new Date();
      const timeSpent = Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000);
      
      const finalProgress: Progress = {
        totalCards,
        studiedCards: studiedCards.size,
        correctAnswers,
        incorrectAnswers,
        accuracy: totalCards > 0 ? (correctAnswers / totalCards) * 100 : 0,
        timeSpent
      };

      onSessionComplete(finalProgress);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setStudiedCards(new Set());
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setIsSessionComplete(false);
  };

  if (isSessionComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{studiedCards.size}</div>
              <div className="text-sm text-gray-600">Cards Studied</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {totalCards > 0 ? Math.round((correctAnswers / totalCards) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          <button
            onClick={resetSession}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start New Session
          </button>
        </div>
      </motion.div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Card {currentIndex + 1} of {totalCards}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentIndex + 1) / totalCards) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Flashcard
            card={currentCard}
            onDifficultyRate={handleDifficultyRate}
            showDifficultyButtons={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            currentIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500'
          }`}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyMode;
