import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../../components/nav/nav.component';
import { PuzzleService, PuzzlePiece, DifficultyLevel, DifficultyConfig } from '../../../services/puzzle.game.service';

@Component({
  selector: 'puzzle-board',
  templateUrl: './puzzle-board.component.html',
  styleUrls: ['./puzzle-board.component.scss'],
  standalone: true,
  imports: [CommonModule, NavComponent],
  providers: [PuzzleService]
})
export class PuzzleBoardComponent implements OnInit {
  boardSize: number = 3;
  pieces: PuzzlePiece[] = [];
  isCompleted: boolean = false;
  availableImages: string[] = [];
  currentImage: string = '';
  moveCounter: number = 0;
  currentDifficulty: DifficultyLevel = DifficultyLevel.EASY;
  difficultyConfigs: DifficultyConfig[] = [];
  
  constructor(private puzzleService: PuzzleService) {}

  ngOnInit() {
    // Suscribirse a los cambios en el tablero
    this.puzzleService.puzzleBoard$.subscribe((pieces: PuzzlePiece[]) => {
      this.pieces = pieces;
    });
    
    // Suscribirse a los cambios en el estado de completado
    this.puzzleService.isCompleted$.subscribe((isCompleted: boolean) => {
      this.isCompleted = isCompleted;
    });

    // Suscribirse al contador de movimientos
    this.puzzleService.moveCounter$.subscribe((moves: number) => {
      this.moveCounter = moves;
    });

    // Suscribirse a los cambios de dificultad
    this.puzzleService.difficulty$.subscribe((difficulty: DifficultyLevel) => {
      this.currentDifficulty = difficulty;
    });

    // Obtener la imagen actual
    this.currentImage = this.puzzleService.getCurrentImage();
    
    // Obtener el tamaño del tablero
    this.boardSize = this.puzzleService.getBoardSize();
    
    // Obtener imágenes disponibles
    this.availableImages = this.puzzleService.getAvailableImages();

    // Obtener configuraciones de dificultad
    this.difficultyConfigs = this.puzzleService.getDifficultyConfigs();
  }
  
  // Manejar clic en una pieza
  selectPiece(piece: PuzzlePiece): void {
    this.puzzleService.selectPiece(piece);
  }
  
  // Verificar si una pieza está seleccionada
  isPieceSelected(piece: PuzzlePiece): boolean {
    return this.puzzleService.isPieceSelected(piece);
  }
  
  // Cambiar la imagen del rompecabezas
  changeImage(imageUrl: string): void {
    this.puzzleService.setImage(imageUrl);
    this.currentImage = imageUrl;
  }
  
  // Reiniciar el juego
  resetGame(): void {
    this.puzzleService.initializeGame();
  }
  
  // Obtener la pieza en una posición específica
  getPieceAtPosition(row: number, col: number): PuzzlePiece | undefined {
    return this.puzzleService.getPieceAtPosition(row, col);
  }
  
  // Convertir índice a coordenadas de fila y columna
  getRowCol(index: number): { row: number, col: number } {
    return {
      row: Math.floor(index / this.boardSize),
      col: index % this.boardSize
    };
  }
  
  // Generar array para iterar en template
  range(size: number): number[] {
    return Array(size).fill(0).map((_, i) => i);
  }

  // Obtener la posición de fondo para cada pieza
  getBackgroundPosition(piece: PuzzlePiece): string {
    const row = piece.correctPosition.row;
    const col = piece.correctPosition.col;
    
    const xPercent = (col / (this.boardSize - 1)) * 100;
    const yPercent = (row / (this.boardSize - 1)) * 100;
    
    return `${xPercent}% ${yPercent}%`;
  }

  // Obtener el tamaño de fondo para el rompecabezas
  getBackgroundSize(): string {
    const size = this.boardSize * 100;
    return `${size}% ${size}%`;
  }

  // Cambiar dificultad
  changeDifficulty(difficulty: DifficultyLevel): void {
    this.puzzleService.setDifficulty(difficulty);
    this.boardSize = this.puzzleService.getBoardSize();
  }

  // Verificar si es la dificultad actual
  isCurrentDifficulty(difficulty: DifficultyLevel): boolean {
    return this.currentDifficulty === difficulty;
  }
}
