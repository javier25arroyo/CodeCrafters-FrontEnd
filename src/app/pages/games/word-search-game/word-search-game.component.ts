import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../../components/nav/nav.component';
import { finalize, take } from 'rxjs/operators';
import { WordSearchGameService } from './word-search.game.service';

interface Cell { row: number; col: number; }
type Difficulty = 'facil' | 'medio' | 'dificil';

interface LevelConfig { gridSize: number; wordCount: number; poolIndex: number; }

@Component({
  selector: 'app-word-search-game',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './word-search-game.component.html',
  styleUrls: ['./word-search-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordSearchGameComponent {
  private readonly MAX_INTENTOS_GLOBAL = 20;
  private readonly MAX_INTENTOS_COLOCACION = 50;
  private readonly MAX_INTENTOS_POR_PALABRA = 100;

  gridSize = 12;
  grid: string[][] = [];
  selectedCells: Cell[] = [];            
  private selectedSet = new Set<string>(); 
  message = '';

  difficulty: Difficulty = 'facil';
  score = 0;
  restartCount = 0;
  maxRestarts = 1;
  gameCompleted = false;

  words: string[] = [];
  foundWords: string[] = [];
  placedWords: string[] = [];

  private highlightedSet = new Set<string>(); // celdas resaltadas
  cellSizeClass = 'size-12';

  private saving = false;

  // ===== Datos del juego (configurable / externo si quieres) =====
  private readonly wordPoolsByLevel: string[][] = [
    ['ABUELO', 'SILLA', 'RADIO', 'TELE', 'LIBRO', 'TÉ', 'GAFAS', 'COJIN', 'CAMISA', 'PAN'],
    ['CAMINAR', 'JARDIN', 'CROCHET', 'BASTON', 'FAMILIA', 'MERIENDA', 'FARMACIA', 'CANECA', 'RECUERDO', 'MANTA', 'AMIGOS', 'SABADO'],
    ['OSTEOPOROSIS', 'PENSIONADO', 'AUDIFONOS', 'HIPERTENSION', 'EJERCICIO', 'VOLUNTARIADO', 'TERAPIA', 'NUTRICION', 'MOVILIDAD', 'ENFERMERA', 'MEMORIA', 'ENVEJECER']
  ];

  private readonly difficultiesConfig: Record<Difficulty, LevelConfig> = {
    facil:   { gridSize: 12, wordCount: 6,  poolIndex: 0 },
    medio:   { gridSize: 14, wordCount: 9,  poolIndex: 1 },
    dificil: { gridSize: 16, wordCount: 12, poolIndex: 2 }
  } as const;

  constructor(
    private readonly wsSvc: WordSearchGameService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.wsSvc.setDifficulty(this.difficulty);
    this.wsSvc.setScore(this.score);
    this.loadLevel();
  }

  private key(r: number, c: number) { return `${r},${c}`; }

  trackByIndex = (_: number, i: number) => i;
  setDifficulty(level: Difficulty): void {
    this.difficulty = level;
    this.score = 0;
    this.restartCount = 0;
    this.wsSvc.setDifficulty(level);
    this.wsSvc.setScore(this.score);
    this.loadLevel();
  }

  loadLevel(): void {
    const config = this.difficultiesConfig[this.difficulty];
    const pool = this.wordPoolsByLevel[config.poolIndex];
    this.gridSize = config.gridSize;
    this.cellSizeClass = `size-${this.gridSize}`;

    let intentosGlobales = 0;

    while (intentosGlobales < this.MAX_INTENTOS_GLOBAL) {
      this.words = this.getRandomWords(config.wordCount, pool);
      this.resetGameState();
      this.generateGrid();

      if (!this.message.includes('Error')) {
        this.cdr.markForCheck();
        return;
      }
      intentosGlobales++;
    }

    this.message = 'No se pudo generar la sopa de letras después de varios intentos. Recarga la página.';
    this.cdr.markForCheck();
  }

  private resetGameState(): void {
    this.foundWords = [];
    this.selectedCells = [];
    this.selectedSet.clear();
    this.message = '';
    this.placedWords = [];
    this.gameCompleted = false;
    this.highlightedSet.clear();
  }

  private getRandomWords(count: number, pool: string[]): string[] {
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generateGrid(): void {
    let intentos = 0;
    let todasColocadas = false;

    while (!todasColocadas && intentos < this.MAX_INTENTOS_COLOCACION) {
      intentos++;
      this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(''));

      todasColocadas = true;
      this.placedWords = [];

      for (const word of this.words) {
        let colocada = false;
        let intentosPalabra = 0;

        while (!colocada && intentosPalabra < this.MAX_INTENTOS_POR_PALABRA) {
          const direccion = this.getRandomDirection();
          const inicio = this.getRandomStartPosition(word.length, direccion);

          if (this.canPlaceWord(word, inicio, direccion)) {
            this.placeWord(word, inicio, direccion);
            colocada = true;
            this.placedWords.push(word);
          }
          intentosPalabra++;
        }

        if (!colocada) {
          todasColocadas = false;
          break;
        }
      }
    }

    if (!todasColocadas) {
      this.message = 'Error al generar la sopa de letras. Intenta reiniciar.';
      return;
    }

    this.fillEmptyCells();
    this.verifyWordsInGrid();
  }

  private getRandomDirection(): Cell {
    const directions: Cell[] = [
      { row: 0, col: 1 }, { row: 1, col: 0 },
      { row: 1, col: 1 }, { row: -1, col: 1 },
      { row: 0, col: -1 }, { row: -1, col: 0 },
      { row: -1, col: -1 }, { row: 1, col: -1 }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private getRandomStartPosition(length: number, dir: Cell): Cell {
    const row = dir.row === -1
      ? Math.floor(Math.random() * (this.gridSize - length)) + length
      : Math.floor(Math.random() * (this.gridSize - (dir.row * length || 0)));

    const col = dir.col === -1
      ? Math.floor(Math.random() * (this.gridSize - length)) + length
      : Math.floor(Math.random() * (this.gridSize - (dir.col * length || 0)));

    return { row, col };
  }

  private canPlaceWord(word: string, start: Cell, dir: Cell): boolean {
    return Array.from({ length: word.length }).every((_, i) => {
      const r = start.row + dir.row * i;
      const c = start.col + dir.col * i;
      return (
        r >= 0 && r < this.gridSize &&
        c >= 0 && c < this.gridSize &&
        (this.grid[r][c] === '' || this.grid[r][c] === word[i])
      );
    });
  }

  private placeWord(word: string, start: Cell, dir: Cell): void {
    for (let i = 0; i < word.length; i++) {
      const r = start.row + dir.row * i;
      const c = start.col + dir.col * i;
      this.grid[r][c] = word[i];
    }
  }

  private fillEmptyCells(): void {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (!this.grid[i][j]) {
          this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
  }

  private verifyWordsInGrid(): void {
    const directions = [
      { dr: 0, dc: 1 }, { dr: 1, dc: 0 },
      { dr: 1, dc: 1 }, { dr: -1, dc: 1 },
      { dr: 0, dc: -1 }, { dr: -1, dc: 0 },
      { dr: -1, dc: -1 }, { dr: 1, dc: -1 }
    ];

    const isInGrid = (word: string): boolean => {
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          for (const { dr, dc } of directions) {
            if (Array.from({ length: word.length }).every((_, k) => {
              const r = i + dr * k;
              const c = j + dc * k;
              return r >= 0 && r < this.gridSize &&
                     c >= 0 && c < this.gridSize &&
                     this.grid[r][c] === word[k];
            })) return true;
          }
        }
      }
      return false;
    };

    for (const word of this.words) {
      if (!(this.placedWords.includes(word) && isInGrid(word))) {
        this.message = 'Advertencia: No todas las palabras fueron colocadas correctamente.';
        break;
      }
    }
  }

  toggleSelection(row: number, col: number): void {
    if (this.gameCompleted) return;
    const k = this.key(row, col);
    const idx = this.selectedCells.findIndex(c => c.row === row && c.col === col);
    if (idx > -1) {
      this.selectedCells.splice(idx, 1);
      this.selectedSet.delete(k);
    } else {
      this.selectedCells.push({ row, col });
      this.selectedSet.add(k);
    }
    this.cdr.markForCheck();
  }

  confirmSelection(): void {
    if (this.gameCompleted) return;
    this.checkSelectedWord();
    // limpiar selección tras confirmar
    this.selectedCells = [];
    this.selectedSet.clear();
    this.cdr.markForCheck();
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedSet.has(this.key(row, col));
  }

  isHighlighted(row: number, col: number): boolean {
    return this.highlightedSet.has(this.key(row, col));
  }

  private checkSelectedWord(): void {
    const word = this.selectedCells.map(cell => this.grid[cell.row][cell.col]).join('');
    if (this.words.includes(word) && !this.foundWords.includes(word)) {
      this.foundWords.push(word);
      this.score++;
      this.wsSvc.setScore(this.score);
      this.message = `¡Encontraste "${word}"!`;

      this.selectedCells.forEach(c => this.highlightedSet.add(this.key(c.row, c.col)));

      if (this.foundWords.length === this.words.length) {
        this.gameCompleted = true;
        this.message = `🎉 ¡Completaste el nivel ${this.difficulty.toUpperCase()}!`;
        this.saveScoreOnce(); 
      }
    } else {
      this.message = '';
    }
  }

  restartGame(): void {
    if (this.restartCount < this.maxRestarts) {
      this.restartCount++;
      this.score = 0;
      this.wsSvc.setScore(this.score);
      this.loadLevel();
    } else {
      this.message = 'Solo puedes reiniciar una vez.';
    }
    this.cdr.markForCheck();
  }

  private saveScoreOnce(): void {
    if (this.saving) return;
    this.saving = true;
    this.wsSvc.saveFinalScore()
      .pipe(take(1), finalize(() => { this.saving = false; }))
      .subscribe();
  }
}
