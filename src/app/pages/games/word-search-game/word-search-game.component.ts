import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from "../../../components/nav/nav.component";
import { FooterComponent } from '../../../components/footer/footer.component';

interface Cell {
  row: number;
  col: number;
}

type Difficulty = 'facil' | 'medio' | 'dificil';

@Component({
  selector: 'app-word-search-game',
  standalone: true,
  imports: [CommonModule, NavComponent, FooterComponent],
  templateUrl: './word-search-game.component.html',
  styleUrls: ['./word-search-game.component.scss']
})
export class WordSearchGameComponent {
  gridSize = 12;
  grid: string[][] = [];
  selectedCells: Cell[] = [];
  message = '';

  difficulty: Difficulty = 'facil';
  score = 0;
  restartCount = 0;
  maxRestarts = 1;
  gameCompleted = false;

  words: string[] = [];
  foundWords: string[] = [];
  placedWords: string[] = [];

  /** Clase dinámica para ajustar el tamaño de celda según la dificultad */
  cellSizeClass = 'size-12';

  private readonly wordPoolsByLevel: string[][] = [
    ['ABUELO', 'SILLA', 'RADIO', 'TELE', 'LIBRO', 'TÉ', 'GAFAS', 'COJIN', 'CAMISA', 'PAN'],
    ['CAMINAR', 'JARDIN', 'CROCHET', 'BASTON', 'FAMILIA', 'MERIENDA', 'FARMACIA', 'CANECA', 'RECUERDO', 'MANTA', 'AMIGOS', 'SABADO'],
    ['OSTEOPOROSIS', 'PENSIONADO', 'AUDIFONOS', 'HIPERTENSION', 'EJERCICIO', 'VOLUNTARIADO', 'TERAPIA', 'NUTRICION', 'MOVILIDAD', 'ENFERMERA', 'MEMORIA', 'ENVEJECER']
  ];

  private readonly difficultiesConfig = {
    facil: { gridSize: 12, wordCount: 6, poolIndex: 0 },
    medio: { gridSize: 14, wordCount: 9, poolIndex: 1 },
    dificil: { gridSize: 16, wordCount: 12, poolIndex: 2 }
  };

  constructor() {
    this.loadLevel();
  }

  /** Cambia la dificultad y reinicia el juego */
  setDifficulty(level: Difficulty): void {
    this.difficulty = level;
    this.score = 0;
    this.restartCount = 0;
    this.loadLevel();
  }

  /** Configura y genera un nuevo tablero según la dificultad */
  loadLevel(): void {
    const config = this.difficultiesConfig[this.difficulty];
    const pool = this.wordPoolsByLevel[config.poolIndex];
    this.gridSize = config.gridSize;
    this.cellSizeClass = `size-${this.gridSize}`;

    let intentosGlobales = 0;
    const maxIntentosGlobales = 20;

    while (intentosGlobales < maxIntentosGlobales) {
      this.words = this.getRandomWords(config.wordCount, pool);
      this.resetGameState();
      this.generateGrid();

      if (!this.message.includes('Error')) return;
      intentosGlobales++;
    }

    this.message = 'No se pudo generar la sopa de letras después de varios intentos. Recarga la página.';
  }

  /** Reinicia los valores de juego sin cambiar la dificultad */
  private resetGameState(): void {
    this.foundWords = [];
    this.selectedCells = [];
    this.message = '';
    this.placedWords = [];
    this.gameCompleted = false;
  }

  /** Obtiene un arreglo de palabras aleatorias del pool */
  private getRandomWords(count: number, pool: string[]): string[] {
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  /** Genera la grilla colocando las palabras aleatoriamente */
  private generateGrid(): void {
    let intentos = 0;
    const maxIntentos = 50;
    let todasColocadas = false;

    while (!todasColocadas && intentos < maxIntentos) {
      intentos++;
      this.grid = Array.from({ length: this.gridSize }, () =>
        Array(this.gridSize).fill('')
      );

      todasColocadas = true;
      this.placedWords = [];

      for (const word of this.words) {
        let colocada = false;
        let intentosPalabra = 0;

        while (!colocada && intentosPalabra < 100) {
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

  /** Direcciones posibles de colocación */
  private getRandomDirection(): Cell {
    const directions = [
      { row: 0, col: 1 }, { row: 1, col: 0 },
      { row: 1, col: 1 }, { row: -1, col: 1 },
      { row: 0, col: -1 }, { row: -1, col: 0 },
      { row: -1, col: -1 }, { row: 1, col: -1 }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  /** Posición inicial aleatoria */
  private getRandomStartPosition(length: number, dir: Cell): Cell {
    const row = dir.row === -1
      ? Math.floor(Math.random() * (this.gridSize - length)) + length
      : Math.floor(Math.random() * (this.gridSize - (dir.row * length || 0)));

    const col = dir.col === -1
      ? Math.floor(Math.random() * (this.gridSize - length)) + length
      : Math.floor(Math.random() * (this.gridSize - (dir.col * length || 0)));

    return { row, col };
  }

  /** Verifica si se puede colocar una palabra en la posición */
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

  /** Coloca la palabra en la grilla */
  private placeWord(word: string, start: Cell, dir: Cell): void {
    for (let i = 0; i < word.length; i++) {
      const r = start.row + dir.row * i;
      const c = start.col + dir.col * i;
      this.grid[r][c] = word[i];
    }
  }

  /** Llena las celdas vacías con letras aleatorias */
  private fillEmptyCells(): void {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (!this.grid[i][j]) {
          this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
  }

  /** Verifica que todas las palabras estén realmente en la grilla */
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

  /** Marca/desmarca celdas seleccionadas */
  toggleSelection(row: number, col: number): void {
    if (this.gameCompleted) return;
    const index = this.selectedCells.findIndex(c => c.row === row && c.col === col);
    index > -1 ? this.selectedCells.splice(index, 1) : this.selectedCells.push({ row, col });
  }

  /** Confirma la palabra seleccionada */
  confirmSelection(): void {
    if (this.gameCompleted) return;
    this.checkSelectedWord();
    this.selectedCells = [];
  }

  /** Verifica si una celda está seleccionada */
  isSelected(row: number, col: number): boolean {
    return this.selectedCells.some(cell => cell.row === row && cell.col === col);
  }

  /** Comprueba si la palabra seleccionada es correcta */
  private checkSelectedWord(): void {
    const word = this.selectedCells.map(cell => this.grid[cell.row][cell.col]).join('');
    if (this.words.includes(word) && !this.foundWords.includes(word)) {
      this.foundWords.push(word);
      this.score++;
      this.message = `¡Encontraste "${word}"!`;

      if (this.foundWords.length === this.words.length) {
        this.gameCompleted = true;
        this.message = `🎉 ¡Completaste el nivel ${this.difficulty.toUpperCase()}!`;
      }
    } else {
      this.message = '';
    }
  }

  /** Reinicia el juego sin cambiar la dificultad */
  restartGame(): void {
    if (this.restartCount < this.maxRestarts) {
      this.restartCount++;
      this.score = 0;
      this.loadLevel();
    } else {
      this.message = 'Solo puedes reiniciar una vez.';
    }
  }
}
