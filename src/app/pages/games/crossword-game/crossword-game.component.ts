import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../../components/nav/nav.component';
import { Hint, DifficultySettings, LevelEnum } from '../../../interfaces/index';
import { GameScoreService } from '../../../services/gameService/game-score.service';

type UiDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_SETTINGS: Record<UiDifficulty, DifficultySettings> = {
  easy:   { maxHints: 5, puzzleKeys: ['puzzle-easy-1','puzzle-easy-2','puzzle-easy-3'] },
  medium: { maxHints: 3, puzzleKeys: ['puzzle-medium-1','puzzle-medium-2','puzzle-medium-3'] },
  hard:   { maxHints: 1, puzzleKeys: ['puzzle-hard-1','puzzle-hard-2','puzzle-hard-3'] }
};

@Component({
  selector: 'app-crossword-game',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, NavComponent, DecimalPipe],
  templateUrl: './crossword-game.component.html',
  styleUrls: ['./crossword-game.component.scss']
})
export class CrosswordGameComponent implements OnInit, OnDestroy {

  // Estado de juego
  currentPuzzleId!: string;
  currentDifficulty!: LevelEnum;
  wordsFound = 0;
  wordsTotal = 0;
  mistakeCellsCount = 0;
  hintsUsed = 0;
  isCompleted = false;
  startedAt = new Date();
  finalScore = 0;

  // Tableros
  grid: (string | null)[][] = [];
  solutionGrid: (string | null)[][] = [];
  userGrid: string[][] = [];
  cellStatus: ('correct' | 'incorrect' | '')[][] = [];
  usedMask: boolean[][] = [];

  // Pistas
  hints: Hint[] = [];
  horizontalHints: Hint[] = [];
  verticalHints: Hint[] = [];
  clueNumbers: Record<string, number> = {};

  // UI
  isCorrect: boolean | null = null;
  timer = '00:00';
  private startTs = 0;
  private timerInt!: any;

  // Dificultad (UI)
  difficulty: UiDifficulty = 'easy';
  maxHints = DIFFICULTY_SETTINGS[this.difficulty].maxHints;
  revealLeft = this.maxHints;

  constructor(private gameScore: GameScoreService) {}

  // ========= Ciclo de vida =========
  ngOnInit(): void {
    this.onDifficultyChange();
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInt);
  }

  // ========= Timer =========
  private startTimer(): void {
    this.startTs = Date.now();
    this.timerInt = setInterval(() => {
      const totalSec = Math.floor((Date.now() - this.startTs) / 1000);
      const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const s = String(totalSec % 60).padStart(2, '0');
      this.timer = `${m}:${s}`;
    }, 1000);
  }

  private resetTimer(): void {
    clearInterval(this.timerInt);
    this.timer = '00:00';
    this.startTimer();
  }

  // ========= Carga de puzzle =========
  async loadPuzzle(key: string): Promise<void> {
    try {
      const res = await fetch(`assets/crossword/${key}.json`);
      if (!res.ok) throw new Error(`No se pudo cargar ${key}.json`);
      const pz = await res.json();
      this.hints = (pz?.hints ?? []) as Hint[];
      this.setupBoard();
      this.currentPuzzleId = key;
      this.currentDifficulty = LevelEnum[this.difficulty.toUpperCase() as keyof typeof LevelEnum];
      this.startedAt = new Date();
    } catch (e) {
      console.error(e);
      // Estado seguro si falla la carga
      this.hints = [];
      this.setupBoard();
    }
  }

  private setupBoard(): void {
    // 1) Dimensiones
    let maxR = 0, maxC = 0;
    for (const h of this.hints) {
      const len = h.word.length;
      if (h.direction === 'across') {
        maxR = Math.max(maxR, h.x);
        maxC = Math.max(maxC, h.y + len - 1);
      } else {
        maxR = Math.max(maxR, h.x + len - 1);
        maxC = Math.max(maxC, h.y);
      }
    }
    const ROWS = maxR + 1;
    const COLS = maxC + 1;

    // 2) Tablero base y solución
    this.grid = Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null));
    this.solutionGrid = Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null));

    for (const h of this.hints) {
      for (let i = 0; i < h.word.length; i++) {
        const r = h.direction === 'across' ? h.x : h.x + i;
        const c = h.direction === 'across' ? h.y + i : h.y;
        this.grid[r][c] = '';
        this.solutionGrid[r][c] = h.word[i].toUpperCase();
      }
    }

    // 3) Números de pista
    this.clueNumbers = {};
    this.hints.forEach((h, idx) => {
      this.clueNumbers[`${h.x}-${h.y}`] = idx + 1;
    });

    // 4) Estructuras auxiliares
    this.userGrid   = this.grid.map(row => row.map(() => ''));
    this.cellStatus = this.grid.map(row => row.map(() => ''));
    this.usedMask   = this.grid.map(row => row.map(c => c !== null));

    // 5) Pistas separadas
    this.horizontalHints = this.hints.filter(h => h.direction === 'across');
    this.verticalHints   = this.hints.filter(h => h.direction === 'down');

    // 6) Estado UI
    this.isCorrect = null;
    this.wordsTotal = this.hints.length;
    this.wordsFound = 0;
    this.mistakeCellsCount = 0;
    this.hintsUsed = 0;
    this.maxHints = DIFFICULTY_SETTINGS[this.difficulty].maxHints;
    this.revealLeft = this.maxHints;
    this.finalScore = 0;
  }

  // ========= UI Handlers =========
  async onDifficultyChange(): Promise<void> {
    const cfg = DIFFICULTY_SETTINGS[this.difficulty];
    const keys = cfg.puzzleKeys;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    await this.loadPuzzle(randomKey);
    this.resetTimer();
  }

  onInputChange(ev: Event, ri: number, ci: number): void {
    const el = ev.target as HTMLInputElement;
    const val = (el.value || '').toUpperCase().slice(0, 1);
    el.value = val;
    this.userGrid[ri][ci] = val;
    this.cellStatus[ri][ci] = '';
  }

  isEditableCell(ri: number, ci: number): boolean {
    return this.grid[ri][ci] !== null;
  }

  // ========= Acciones =========
  checkAnswers(): void {
    let correctWords = 0;
    const incorrectCells = new Set<string>();

    for (const h of this.hints) {
      let ok = true;
      for (let i = 0; i < h.word.length; i++) {
        const r = h.direction === 'across' ? h.x : h.x + i;
        const c = h.direction === 'across' ? h.y + i : h.y;
        const expected = this.solutionGrid[r][c]!;
        const got = this.userGrid[r][c] || '';
        const match = got === expected;

        this.cellStatus[r][c] = match ? 'correct' : 'incorrect';
        if (!match) {
          ok = false;
          incorrectCells.add(`${r},${c}`);
        }
      }
      if (ok) correctWords++;
    }

    this.wordsFound = correctWords;
    this.mistakeCellsCount = incorrectCells.size;
    this.isCorrect = incorrectCells.size === 0;

    if (this.isCorrect) {
      this.isCompleted = true;
      this.finishGame();
    }
  }

  revealLetter(): void {
    if (this.revealLeft <= 0) return;

    const candidates: Array<[number, number]> = [];
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[0].length; c++) {
        if (!this.usedMask[r][c]) continue;
        const expected = this.solutionGrid[r][c];
        const got = this.userGrid[r][c] || '';
        if (expected && got !== expected) {
          candidates.push([r, c]);
        }
      }
    }

    if (candidates.length === 0) return;

    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    this.userGrid[r][c] = this.solutionGrid[r][c]!;
    this.cellStatus[r][c] = '';
    this.revealLeft--;
    this.hintsUsed++;
  }

  resetGame(): void {
    this.userGrid   = this.grid.map(row => row.map(() => ''));
    this.cellStatus = this.grid.map(row => row.map(() => ''));
    this.isCorrect = null;
    this.wordsFound = 0;
    this.mistakeCellsCount = 0;
    this.hintsUsed = 0;
    this.revealLeft = this.maxHints;
    this.finalScore = 0;
    this.isCompleted = false;
    this.startedAt = new Date();
    this.resetTimer();
  }

  // ========= Puntaje =========
  private computeScore(): number {
  const base =
    this.currentDifficulty === LevelEnum.EASY   ? 5 :
    this.currentDifficulty === LevelEnum.MEDIUM ? 10 : 15;

  const hints    = this.hintsUsed ?? 0;
  const mistakes = this.mistakeCellsCount ?? 0;
  const elapsed  = Math.floor((Date.now() - this.startTs) / 1000);

  const timePenalty     = Math.floor(elapsed / 120);   // -1 cada 2 min
  const hintPenalty     = Math.floor(hints / 2);       // -1 cada 2 ayudas
  const mistakePenalty  = Math.floor(mistakes / 15);   // -1 cada 15 errores

  return Math.max(1, base - timePenalty - hintPenalty - mistakePenalty);
}

  private posted = false;

  private finishGame(): void {
    if (this.posted) return;
    const elapsedSec = Math.floor((Date.now() - this.startTs) / 1000);

  const score = this.computeScore();
  this.finalScore = score;

    const scorePayload = {
      gameType: 'CROSSWORD' as const,
      level: this.currentDifficulty,
      movements: 0,
      time: elapsedSec,
      score: score
    };

    this.gameScore.saveScore(scorePayload).subscribe({
    next: () => {
      this.posted = true;
      console.log('Score saved to scores!');
    },
    error: (e) => console.error('Score error', e),
  });
  }
}
