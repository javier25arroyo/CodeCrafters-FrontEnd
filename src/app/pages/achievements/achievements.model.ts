export type GameType =
  | 'PUZZLE'
  | 'CROSSWORD'
  | 'NUMBER_SEQUENCE'
  | 'CARD_MEMORY'
  | 'MUSIC_MEMORY'
  | 'WORD_SEARCH';

export type Level = 'EASY' | 'MEDIUM' | 'HARD';

export interface ScoreRow {
  id: number;
  date?: string;
  gameType: GameType;      
  level?: Level | string;    
  movements: number;        
  time: number;             
  score: number;
  gameId?: number;
  userId?: number;
}

export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;              
  target: number;            
  progress: number;          
  unlocked: boolean;         
  meta?: string;             
}

export function pct(a: Achievement): number {
  if (!a.target) return 0;
  const p = (a.progress / a.target) * 100;
  return Math.max(0, Math.min(100, Math.round(p)));
}
