export type TrickDifficulty = 'beginner' | 'entry' | 'intermediate' | 'advanced' | 'expert';

export type TrickCategory = 
  | 'fundamentals' 
  | 'first_tricks' 
  | 'flip' 
  | 'intermediate' 
  | 'advanced' 
  | 'transition' 
  | 'street_grinds' 
  | 'expert';

export interface Trick {
  id: string;
  name: string;
  category: TrickCategory;
  difficulty: TrickDifficulty;
  description: string;
  shortDescription: string;
  youtubeUrl?: string;
  prerequisites: string[];
  points: number;
}