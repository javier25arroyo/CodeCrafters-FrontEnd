import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Achievement, ScoreRow } from '../pages/achievements/achievements.model';

interface ScoreRowDTO {
  id?: number;
  date?: string;
  timestamp?: string;
  createdAt?: string;
  gameType?: string;
  level?: string;
  movements?: number;
  time?: number;
  score?: number;
  game?: { id?: number };
  game_id?: number;
  user?: { id?: number };
  user_id?: number;
}

type UserAchievementDTO = {
  id: number;
  name: string;
  description?: string;
  unlocked: boolean;
  dateUnlocked?: string | Date | null;
};

const PUZZLE_UNDER_TIME = 60;
const PUZZLE_MAX_MOVES = 10;
const TARGET_ONE = 1;
const TARGET_THREE = 3;
const TARGET_FIVE = 5;

const LEVELS = ['EASY', 'MEDIUM', 'HARD'] as const;

@Injectable({ providedIn: 'root' })
export class AchievementsService {
  private readonly scoresUrl = '/scores';
  private readonly persistUrl = (userId: number) => `/achievements/user/${userId}`;

  constructor(private http: HttpClient) {}

  getAchievements(userId: number): Observable<Achievement[]> {
    return this.http
      .get<UserAchievementDTO[]>(this.persistUrl(userId), { withCredentials: true })
      .pipe(
        catchError(() => of([])),
        switchMap((persisted) =>
          this.http.get<ScoreRowDTO[]>(this.scoresUrl, { withCredentials: true }).pipe(
            map((rows) => rows.map(this.normalize)),
            map((rows) => rows.filter((r) => r.userId === userId)),
            map((rows) => {
              const computed = this.compute(rows);
              if (!persisted?.length) return computed;

              const persistedSet = new Set(
                persisted.filter((p) => p.unlocked).map((p) => p.name)
              );
              return computed.map((a) => {
                const persistedUnlocked = persistedSet.has(a.key);
                const meetsTarget = (a.target ?? 1) <= (a.progress ?? 0);
                return { ...a, unlocked: a.unlocked || (persistedUnlocked && meetsTarget) };
              });
            })
          )
        )
      );
  }

  private normalize = (r: ScoreRowDTO): ScoreRow => {
    const gt = ((r.gameType ?? 'PUZZLE').toUpperCase()) as ScoreRow['gameType'];

    const rawLevel = r.level ? String(r.level).toUpperCase() : undefined;
    const lvl = rawLevel && (LEVELS as readonly string[]).includes(rawLevel)
      ? (rawLevel as ScoreRow['level'])
      : undefined;

    return {
      id: r.id ?? 0,
      date: r.date ?? r.timestamp ?? r.createdAt,
      gameType: gt,
      level: lvl,
      movements: r.movements ?? 0,
      time: r.time ?? 0,
      score: r.score ?? 0,
      gameId: r.game?.id ?? r.game_id ?? undefined,
      userId: r.user?.id ?? r.user_id ?? undefined,
    };
  };

  private compute(data: ScoreRow[]): Achievement[] {
    const total = data.length;
    const byGame = (g: ScoreRow['gameType']) => data.filter((r) => r.gameType === g).length;

    const minBy = <T extends keyof ScoreRow>(key: T, pred?: (r: ScoreRow) => boolean) =>
      data
        .filter((r) => (pred ? pred(r) : true))
        .filter((r) => typeof r[key] === 'number' && (r[key] as number) > 0)
        .sort((a, b) => Number(a[key]) - Number(b[key]))[0];

    const firstBy = (pred: (r: ScoreRow) => boolean) => data.find(pred);

    const under60Row = minBy('time', (r) => r.gameType === 'PUZZLE' && (r.time ?? 0) <= PUZZLE_UNDER_TIME);
    const fewMovesRow = minBy('movements', (r) => r.gameType === 'PUZZLE' && (r.movements ?? 0) <= PUZZLE_MAX_MOVES);

    const hardWinRow = firstBy((r) => (String(r.level ?? '').toUpperCase()) === 'HARD');

    const anyUnder60s = !!under60Row;
    const anyFewMoves = !!fewMovesRow;
    const anyHard = !!hardWinRow;

    return [
      {
        key: 'first_win',
        title: 'Primer triunfo',
        description: 'Completa tu primera partida.',
        icon: '🥇',
        target: TARGET_ONE,
        progress: Math.min(total, TARGET_ONE),
        unlocked: total >= TARGET_ONE,
      },
      {
        key: 'five_wins',
        title: 'Calentando motores',
        description: 'Completa 5 partidas en total.',
        icon: '🔥',
        target: TARGET_FIVE,
        progress: Math.min(total, TARGET_FIVE),
        unlocked: total >= TARGET_FIVE,
      },
      {
        key: 'puzzle_3',
        title: 'Fan del Puzzle',
        description: 'Completa 3 partidas de Puzzle.',
        icon: '🧩',
        target: TARGET_THREE,
        progress: Math.min(byGame('PUZZLE'), TARGET_THREE),
        unlocked: byGame('PUZZLE') >= TARGET_THREE,
      },
      {
        key: 'ws_3',
        title: 'Cazapalabras',
        description: 'Completa 3 partidas de Sopa de Letras.',
        icon: '🔤',
        target: TARGET_THREE,
        progress: Math.min(byGame('WORD_SEARCH'), TARGET_THREE),
        unlocked: byGame('WORD_SEARCH') >= TARGET_THREE,
      },
      {
        key: 'seq_3',
        title: 'Maestro de Secuencias',
        description: 'Completa 3 partidas de Secuencia.',
        icon: '🔢',
        target: TARGET_THREE,
        progress: Math.min(byGame('NUMBER_SEQUENCE'), TARGET_THREE),
        unlocked: byGame('NUMBER_SEQUENCE') >= TARGET_THREE,
      },
      {
        key: 'cross_3',
        title: 'Crucigramista',
        description: 'Completa 3 partidas de Crucigrama.',
        icon: '✍️',
        target: TARGET_THREE,
        progress: Math.min(byGame('CROSSWORD'), TARGET_THREE),
        unlocked: byGame('CROSSWORD') >= TARGET_THREE,
      },
      {
        key: 'under_60',
        title: 'Contra el reloj',
        description: `Termina una partida en ${PUZZLE_UNDER_TIME}s o menos.`,
        icon: '⏱️',
        target: TARGET_ONE,
        progress: anyUnder60s ? TARGET_ONE : 0,
        unlocked: anyUnder60s,
      },
      {
        key: 'few_moves',
        title: 'Cirujano',
        description: `Termina una partida con ≤ ${PUZZLE_MAX_MOVES} movimientos.`,
        icon: '🧠',
        target: TARGET_ONE,
        progress: anyFewMoves ? TARGET_ONE : 0,
        unlocked: anyFewMoves,
      },
      {
        key: 'hard_win',
        title: 'Desafío duro',
        description: 'Gana en dificultad HARD.',
        icon: '💪',
        target: TARGET_ONE,
        progress: anyHard ? TARGET_ONE : 0,
        unlocked: anyHard,
      },
    ];
  }
}
