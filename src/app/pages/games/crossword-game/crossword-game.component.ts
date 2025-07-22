import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

interface Hint {
  word: string;
  clue: string;
  x: number;
  y: number;
  direction: 'across' | 'down';
}

@Component({
  selector: 'app-crossword-game',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './crossword-game.component.html',
  styleUrls: ['./crossword-game.component.scss']
})

export class CrosswordGameComponent implements OnInit, OnDestroy {
  grid: (string|null)[][] = [];
  userGrid: string[][] = [];
  cellStatus: ('correct'|'incorrect'|'')[][] = [];
  usedMask: boolean[][] = [];
  hints: Hint[] = [];
  isCorrect: boolean|null = null;

  timer = '00:00';
  private startTs = 0;
  private timerInt!: any;

  // número de ayudas disponibles
  revealLeft = 3;

  ngOnInit(): void {
    this.resetGame();
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

  clueNumbers: Record<string, number> = {};

  resetGame() {
    const ROWS = 10, COLS = 23;
    this.grid = Array.from({ length: ROWS },
      () => Array<string|null>(COLS).fill(null)
    );

    this.hints = [
      { word:'ELEFANTE', clue:'Mamífero gris con trompa',       x:1, y:2,  direction:'across' },
      { word:'DELFIN',   clue:'Amigo cordial del océano',        x:0, y:4,  direction:'down'   },
      { word:'JIRAFA',   clue:'Animal de cuello larguísimo',     x:3, y:0,  direction:'across' },
      { word:'TIGRE',    clue:'Felino rayado',                   x:1, y:8,  direction:'down'   },
      { word:'TORTUGA',  clue:'Reptil longevo y lento',          x:4, y:6,  direction:'across' },
      { word:'CABALLO',  clue:'Equino doméstico',                x:3, y:12, direction:'down'   },
      { word:'VACA',     clue:'Productora de leche',             x:6, y:9,  direction:'across' },
      { word:'COCODRILO',clue:'Reptil grande y feroz',           x:9, y:11, direction:'across' },
      { word:'GATO',     clue:'Felino doméstico',                x:4, y:16, direction:'down'   },
      { word:'MARIPOSA', clue:'Insecto colorido',                x:5, y:15, direction:'across' },
      { word:'LEON',     clue:'Rey de la selva',                 x:7, y:14, direction:'across' },
      { word:'RANA',     clue:'Anfibio saltarín',                x:8, y:19, direction:'across' },
      { word:'PANDA',    clue:'Oso negro y blanco',              x:4, y:22, direction:'down'   },
      { word:'PERRO',    clue:'Mejor amigo del hombre',          x:5, y:19, direction:'down'   },
    ];

    this.clueNumbers = {};
    this.hints.forEach((h, idx) => {
      this.clueNumbers[`${h.x}-${h.y}`] = idx + 1;
    });

    this.hints.forEach(h =>
      [...h.word].forEach((_, i) => {
        const r = h.direction==='across' ? h.x     : h.x + i;
        const c = h.direction==='across' ? h.y + i : h.y;
        this.grid[r][c] = '';
      })
    );

    this.userGrid   = this.grid.map(r => r.map(c => c===null?'':''));
    this.cellStatus = this.grid.map(r => r.map(c => c===null?'':''));
    this.usedMask   = this.grid.map(r => r.map(_ => false));

    this.hints.forEach(h =>
      [...h.word].forEach((_, i) => {
        const r = h.direction==='across' ? h.x     : h.x + i;
        const c = h.direction==='across' ? h.y + i : h.y;
        this.usedMask[r][c] = true;
      })
    );

    this.isCorrect = null;
    this.revealLeft = 3;    // reset ayudas
    clearInterval(this.timerInt);
    this.startTimer();
  }

get horizontalHints(): Hint[] {
  return this.hints
    .filter(h => h.direction === 'across')
    .sort((a, b) => {
      const na = this.clueNumbers[`${a.x}-${a.y}`];
      const nb = this.clueNumbers[`${b.x}-${b.y}`];
      return na - nb;
    });
}

get verticalHints(): Hint[] {
  return this.hints
    .filter(h => h.direction === 'down')
    .sort((a, b) => {
      const na = this.clueNumbers[`${a.x}-${a.y}`];
      const nb = this.clueNumbers[`${b.x}-${b.y}`];
      return na - nb;
    });
}


  isEditableCell(r:number,c:number): boolean {
    return this.grid[r][c] !== null;
  }

  onInputChange(e:any, r:number, c:number) {
    this.userGrid[r][c] = e.target.value.toUpperCase().charAt(0) || '';
  }

  checkAnswers() {
    this.isCorrect = true;
    this.cellStatus = this.grid.map(r => r.map(c=>c===null?'':''));
    this.hints.forEach(h => {
      [...h.word].forEach((ch,i) => {
        const r = h.direction==='across' ? h.x     : h.x + i;
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
        const r = h.direction==='across' ? h.x     : h.x + i;
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
}
