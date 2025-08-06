import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../../components/nav/nav.component';
import { Hint,DifficultySettings } from '../../../interfaces/index';

type Difficulty = 'easy' | 'medium' | 'hard';

const MAX_HINTS = 3;
const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    maxHints: 5,
    puzzleKeys: [
      'puzzle-easy-1',
      'puzzle-easy-2',
      'puzzle-easy-3'
    ]
  },
  medium: {
    maxHints: 3,
    puzzleKeys: [
      'puzzle-medium-1',
      'puzzle-medium-2',
      'puzzle-medium-3'
    ]
  },
  hard: {
    maxHints: 1,
    puzzleKeys: [
      'puzzle-hard-1',
      'puzzle-hard-2',
      'puzzle-hard-3'
    ]
  }
};

@Component({
  selector: 'app-crossword-game',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, NavComponent],
  templateUrl: './crossword-game.component.html',
  styleUrls: ['./crossword-game.component.scss']
})
export class CrosswordGameComponent implements OnInit, OnDestroy {
  // Tablero
  grid: (string|null)[][] = [];
  userGrid: string[][] = [];
  cellStatus: ('correct'|'incorrect'|'')[][] = [];
  usedMask: boolean[][] = [];
  hints: Hint[] = [];
  clueNumbers: Record<string, number> = {};
  isCorrect: boolean|null = null;

  timer = '00:00';
  private startTs = 0;
  private timerInt!: any;

  difficulty: Difficulty = 'easy';
  maxHints = DIFFICULTY_SETTINGS[this.difficulty].maxHints;
  revealLeft = this.maxHints;

  ngOnInit() {
  this.onDifficultyChange();
  this.startTimer();
}

  ngOnDestroy(): void {
    clearInterval(this.timerInt);
  }

  private startTimer() {
    this.startTs = Date.now();
    this.timerInt = setInterval(() => {
      const totalSec = Math.floor((Date.now() - this.startTs) / 1000);
      const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const s = String(totalSec % 60).padStart(2, '0');
      this.timer = `${m}:${s}`;
    }, 1000);
  }

async loadPuzzle(key: string) {
  const res = await fetch(`assets/crossword/${key}.json`);
  const pz = await res.json();
  this.hints = pz.hints;
  this.setupBoard();
}

  private setupBoard() {
  let maxR = 0, maxC = 0;
  for (let h of this.hints) {
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

  this.grid = Array.from({ length: ROWS },
    () => Array<string|null>(COLS).fill(null)
  );

  for (let h of this.hints) {
    for (let i = 0; i < h.word.length; i++) {
      const r = h.direction === 'across' ? h.x : h.x + i;
      const c = h.direction === 'across' ? h.y + i : h.y;
      this.grid[r][c] = '';
    }
  }


  this.clueNumbers = {};
  this.hints.forEach((h, idx) => {
    this.clueNumbers[`${h.x}-${h.y}`] = idx + 1;
  });

  this.userGrid   = this.grid.map(row => row.map(_ => ''));
  this.cellStatus = this.grid.map(row => row.map(_ => ''));
  this.usedMask   = this.grid.map(row => row.map(c => c !== null));

  this.isCorrect = null;
  this.maxHints   = DIFFICULTY_SETTINGS[this.difficulty].maxHints;
  this.revealLeft = this.maxHints;
}


  onDifficultyChange() {
  const cfg = DIFFICULTY_SETTINGS[this.difficulty];

  this.maxHints   = cfg.maxHints;
  this.revealLeft = cfg.maxHints;

  const keys = cfg.puzzleKeys;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  this.loadPuzzle(randomKey);
}

  get horizontalHints(): Hint[] {
    return this.hints
      .filter(h => h.direction === 'across')
      .sort((a, b) => this.clueNumbers[`${a.x}-${a.y}`] - this.clueNumbers[`${b.x}-${b.y}`]);
  }

  get verticalHints(): Hint[] {
    return this.hints
      .filter(h => h.direction === 'down')
      .sort((a, b) => this.clueNumbers[`${a.x}-${a.y}`] - this.clueNumbers[`${b.x}-${b.y}`]);
  }

  isEditableCell(r:number,c:number): boolean {
    return this.grid[r][c] !== null;
  }

  onInputChange(e:any, r:number, c:number) {
    this.userGrid[r][c] = e.target.value.toUpperCase().charAt(0) || '';
  }

  checkAnswers() {
    this.isCorrect = true;
    this.cellStatus = this.grid.map(r => r.map(c => c===null ? '' : ''));
    this.hints.forEach(h => {
      [...h.word].forEach((ch,i) => {
        const r = h.direction==='across' ? h.x : h.x + i;
        const c = h.direction==='across' ? h.y + i : h.y;
        if (this.userGrid[r][c] === ch) {
          this.cellStatus[r][c] = 'correct';
        } else {
          this.cellStatus[r][c] = 'incorrect';
          this.isCorrect = false;
        }
      });
    });
  }

  revealLetter() {
    if (this.revealLeft === 0) return;
    for (let h of this.hints) {
      for (let i = 0; i < h.word.length; i++) {
        const r = h.direction==='across' ? h.x : h.x + i;
        const c = h.direction==='across' ? h.y + i : h.y;
        if (this.userGrid[r][c] !== h.word[i]) {
          this.userGrid[r][c] = h.word[i];
          this.cellStatus[r][c] = 'correct';
          this.revealLeft--;
          this.isCorrect = null;
          return;
        }
      }
    }
  }

  resetGame() {
    this.setupBoard();
    clearInterval(this.timerInt);
    this.startTimer();
  }
}
