import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cell {
  row: number;
  col: number;
}

@Component({
  selector: 'app-word-search-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-search-game.component.html',
  styleUrls: ['./word-search-game.component.scss']
})
export class WordSearchGameComponent {
  gridSize = 12;
  grid: string[][] = [];
  selectedCells: Cell[] = [];
  isDragging = false;
  message = '';

  level = 1;
  maxLevels = 3;
  score = 0;
  restartCount = 0;
  maxRestarts = 1;
  gameCompleted = false;

  words: string[] = [];
  foundWords: string[] = [];
  placedWords: string[] = []; // ✅ Lista de palabras realmente colocadas

  wordPoolsByLevel: string[][] = [
    ['ABUELO', 'SILLA', 'RADIO', 'TELE', 'LIBRO', 'TÉ', 'GAFAS', 'COJIN', 'CAMISA', 'PAN'],
    ['CAMINAR', 'JARDIN', 'CROCHET', 'BASTON', 'FAMILIA', 'MERIENDA', 'FARMACIA', 'CANECA', 'RECUERDO', 'MANTA', 'AMIGOS', 'SABADO'],
    ['OSTEOPOROSIS', 'PENSIONADO', 'AUDIFONOS', 'HIPERTENSION', 'EJERCICIO', 'VOLUNTARIADO', 'TERAPIA', 'NUTRICION', 'MOVILIDAD', 'ENFERMERA', 'MEMORIA', 'ENVEJECER']
  ];

  constructor() {
    this.loadLevel();
  }

  loadLevel() {
    const wordsPerLevel = [6, 9, 12];
    const pool = this.wordPoolsByLevel[this.level - 1];
    this.gridSize = this.level === 1 ? 12 : this.level === 2 ? 14 : 16;

    let intentosGlobales = 0;
    const maxIntentosGlobales = 20;

    while (intentosGlobales < maxIntentosGlobales) {
      this.words = this.getRandomWords(wordsPerLevel[this.level - 1], pool);
      this.foundWords = [];
      this.selectedCells = [];
      this.message = '';
      this.placedWords = []; // ✅ limpiar palabras colocadas
      this.gameCompleted = false;

      this.generateGrid();

      if (!this.message.includes('Error')) return;

      intentosGlobales++;
    }

    this.message = 'No se pudo generar la sopa de letras después de varios intentos. Recarga la página.';
  }

  getRandomWords(count: number, pool: string[]): string[] {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateGrid() {
    let intentos = 0;
    const maxIntentos = 50;
    let todasColocadas = false;

    while (!todasColocadas && intentos < maxIntentos) {
      intentos++;

      this.grid = Array.from({ length: this.gridSize }, () =>
        Array.from({ length: this.gridSize }, () => '')
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
            console.log(`✅ Palabra colocada: ${word}`);
            this.placedWords.push(word); // ✅ guardar palabra colocada
          }

          intentosPalabra++;
        }

        if (!colocada) {
          console.warn(`❌ No se pudo colocar: ${word}`);
          todasColocadas = false;
          break;
        }
      }
    }

    if (!todasColocadas) {
      console.error('❌ Grid inválido. No se colocaron todas las palabras.');
      this.message = 'Error al generar la sopa de letras. Intenta reiniciar.';
      return;
    }

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (!this.grid[i][j]) {
          this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    console.warn('🧩 Palabras esperadas:', this.words);
    console.warn('🧩 Grilla final:');
    this.grid.forEach((row, i) => {
      console.log(`Fila ${i + 1}:`, row.join(' '));
    });

    this.verifyWordsInGrid();
  }

  getRandomDirection(): Cell {
    const directions = [
      { row: 0, col: 1 }, { row: 1, col: 0 },
      { row: 1, col: 1 }, { row: -1, col: 1 },
      { row: 0, col: -1 }, { row: -1, col: 0 },
      { row: -1, col: -1 }, { row: 1, col: -1 }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  getRandomStartPosition(length: number, dir: Cell): Cell {
    const row = dir.row === -1
      ? Math.floor(Math.random() * (this.gridSize - length)) + length
      : Math.floor(Math.random() * (this.gridSize - (dir.row * length || 0)));

    const col = dir.col === -1
      ? Math.floor(Math.random() * (this.gridSize - length)) + length
      : Math.floor(Math.random() * (this.gridSize - (dir.col * length || 0)));

    return { row, col };
  }

  canPlaceWord(word: string, start: Cell, dir: Cell): boolean {
    for (let i = 0; i < word.length; i++) {
      const r = start.row + dir.row * i;
      const c = start.col + dir.col * i;
      if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize) return false;
      const currentLetter = this.grid[r][c];
      if (currentLetter !== '' && currentLetter !== word[i]) return false;
    }
    return true;
  }

  placeWord(word: string, start: Cell, dir: Cell) {
    for (let i = 0; i < word.length; i++) {
      const r = start.row + dir.row * i;
      const c = start.col + dir.col * i;
      this.grid[r][c] = word[i];
    }
  }

  verifyWordsInGrid() {
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
            let match = true;
            for (let k = 0; k < word.length; k++) {
              const r = i + dr * k;
              const c = j + dc * k;
              if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize || this.grid[r][c] !== word[k]) {
                match = false;
                break;
              }
            }
            if (match) return true;
          }
        }
      }
      return false;
    };

    console.log('📋 Verificando palabras realmente colocadas:');
    this.words.forEach(word => {
      const found = this.placedWords.includes(word) && isInGrid(word);
      console.log(`${found ? '✅' : '❌'} ${word}`);
    });
  }

  startSelection(row: number, col: number) {
    if (this.gameCompleted) return;
    this.isDragging = true;
    this.selectedCells = [{ row, col }];
  }

  extendSelection(row: number, col: number) {
    if (!this.isDragging || this.gameCompleted) return;
    const last = this.selectedCells[this.selectedCells.length - 1];
    if (last.row === row && last.col === col) return;
    this.selectedCells.push({ row, col });
  }

  endSelection() {
    this.isDragging = false;
    this.checkSelectedWord();
    this.selectedCells = [];
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedCells.some(cell => cell.row === row && cell.col === col);
  }

  checkSelectedWord() {
    const word = this.selectedCells.map(cell => this.grid[cell.row][cell.col]).join('');
    if (this.words.includes(word) && !this.foundWords.includes(word)) {
      this.foundWords.push(word);
      this.score += 1;
      this.message = `¡Encontraste "${word}"!`;

      if (this.foundWords.length === this.words.length) {
        if (this.level < this.maxLevels) {
          this.message = `🎉 ¡Nivel ${this.level} completado! Pasando al nivel ${this.level + 1}...`;
          this.level++;
          setTimeout(() => {
            this.loadLevel();
            setTimeout(() => { this.message = ''; }, 1000);
          }, 2000);
        } else {
          this.gameCompleted = true;
          const totalWords = [6, 9, 12].reduce((a, b) => a + b, 0);
          this.message = `¡Completaste el juego! Encontraste ${this.score} de ${totalWords} palabras.`;
        }
      }
    } else {
      this.message = '';
    }
  }

  restartGame() {
    if (this.restartCount < this.maxRestarts) {
      this.restartCount++;
      this.level = 1;
      this.score = 0;
      this.loadLevel();
    } else {
      this.message = 'Solo puedes reiniciar una vez.';
    }
  }
}
