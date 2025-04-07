
export interface ElementData {
  name: string;
  symbol: string;
  atomicNumber: number;
  category: string;
  group: number;
  period: number;
  electronegativity?: number;
  atomicMass?: number;
  electronConfiguration?: string;
  discoveryYear?: number;
  discoveredBy?: string;
  unlockedFeatures?: string[];
  masteryLevel?: number;
}

export interface Question {
  id: number;
  text: string;
  correctElement: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'properties' | 'history' | 'applications' | 'reactions' | 'structure';
  points: number;
  timeLimit?: number;
  historicalContext?: string;
  realWorldApplication?: string;
  careerPath?: string;
}

export interface GameState {
  score: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeRemaining: number;
  currentQuestion?: Question;
  gameMode: GameMode;
  difficulty: Difficulty;
  unlockedFeatures: string[];
  masteryLevels: Record<string, number>;
  lastReviewTime?: Date;
}

export type GameMode = 'quantum_leap' | 'synthesis_sprint' | 'isotope_investigator' | 'periodic_war' | 'nano_architect' | 'standard';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CategoryFilter = 'all' | string;
export type ViewMode = 'standard' | 'compact' | 'accessibility';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
  category: 'mastery' | 'exploration' | 'social' | 'streak';
  bonusPoints?: number;
}

export interface PlayerStats {
  totalScore: number;
  gamesPlayed: number;
  averageScore: number;
  bestStreak: number;
  elementMastery: Record<string, number>;
  achievements: Achievement[];
  lastReviewDate?: Date;
  unlockedFeatures: string[];
  socialScore?: number;
}
