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
  gameType: GameType;        // Tipo de juego (normaliza en el service si viene sucio)
  level?: Level | string;    // Permitimos string por si el backend envía valores no normalizados
  movements: number;         // 0 si no aplica
  time: number;              // en segundos; 0 si no aplica
  score: number;
  gameId?: number;
  userId?: number;
}

export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;              // emoji o nombre de ícono
  target: number;            // meta para desbloquear
  progress: number;          // avance actual hacia la meta
  unlocked: boolean;         // <- necesario para el merge y la UI
  meta?: string;             // info extra opcional (p.ej. etiqueta del juego)
}

export function pct(a: Achievement): number {
  if (!a.target) return 0;
  const p = (a.progress / a.target) * 100;
  return Math.max(0, Math.min(100, Math.round(p)));
}
