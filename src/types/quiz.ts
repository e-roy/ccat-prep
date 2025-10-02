export enum QuizCategory {
  MATH = "math",
  SPATIAL_REASONING = "spatial_reasoning",
  VERBAL_REASONING = "verbal_reasoning",
  LOGICAL_REASONING = "logical_reasoning",
}

export enum QuizMode {
  PRACTICE = "practice",
  EXAM = "exam",
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[]; // Variable number of options
  correctAnswer: number; // Index of correct answer
  explanation?: string;
}

export interface VerbalQuestion extends QuizQuestion {
  vocabularyWord: string;
  context: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number; // Index of selected answer
  isCorrect: boolean;
  timeSpent: number; // seconds on this question
}

export interface QuizSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  score: number;
  totalQuestions: 50;
  timeSpent: number; // seconds
  status: "in_progress" | "completed" | "abandoned";
  categoryScores: Record<QuizCategory, number>;
  mode: QuizMode;
}

export interface QuizConfig {
  totalQuestions: 50;
  questionsPerCategory: 12; // 4 categories = 48, with 2 extra distributed
  timeLimit: 900; // 15 minutes in seconds
  categories: QuizCategory[];
}

export interface QuizStatistics {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  categoryAverages: Record<QuizCategory, number>;
  improvementTrend: number[];
  totalTimeSpent: number;
}

export interface CategoryInfo {
  id: QuizCategory;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  example: string;
  antonym?: string;
}
