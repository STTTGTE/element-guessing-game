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
  block: string;
  atomicRadius?: number;
  ionizationEnergy?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  naturalOccurrence?: 'common' | 'rare' | 'synthetic';
  isRadioactive: boolean;
  electricalConductivity?: 'high' | 'medium' | 'low';
  magneticProperty?: 'ferromagnetic' | 'paramagnetic' | 'diamagnetic';
  biologicalRole?: 'essential' | 'trace' | 'none' | 'toxic';
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

export type GameMode = 
  | 'standard'
  | 'electron_explorer'
  | 'valence_voyager'
  | 'orbital_odyssey'
  | 'reaction_rush'
  | 'atomic_architect'
  | 'periodic_puzzle'
  | 'element_evolution'
  | 'molecular_master'
  | 'bonding_battle'
  | 'atomic_assembly'
  | 'synthesis_sprint'
  | 'isotope_investigator'
  | 'periodic_war'
  | 'nano_architect';

export type TableVariant = 
  | 'standard'
  | 'color_spectrum'
  | 'layered_view'
  | 'geological_map'
  | 'thermal_view'
  | 'liquid_metals'
  | 'electrical_conductors'
  | 'magnetic_elements'
  | 'density_map'
  | 'cognitive_map'
  | 'organic_elements';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type CategoryFilter = 'all' | string;
export type ViewMode = TableVariant;

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
