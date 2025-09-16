export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  flashcards: Flashcard[];
  currentIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: Date;
  isTimerMode: boolean;
  timeLimit?: number; // in seconds
}

export interface Progress {
  totalCards: number;
  studiedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number; // in seconds
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface StudyStats {
  sessionTime: number;
  cardsPerMinute: number;
  accuracy: number;
  streak: number;
}

