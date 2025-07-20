import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleService, PuzzlePiece } from '../../services/puzzle.service';

@Component({
  selector: 'puzzle-board',
  templateUrl: './puzzle-board.component.html',
  styleUrls: ['./puzzle-board.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PuzzleBoardComponent implements OnInit {
  boardSize: number = 3;
  pieces: PuzzlePiece[] = [];
  isCompleted: boolean = false;
  availableImages: string[] = [];
  currentImage: string = '';
  moveCounter: number = 0;
  
  constructor(private puzzleService: PuzzleService) {}

  ngOnInit() {
    // Suscribirse a los cambios en el tablero
    this.puzzleService.puzzleBoard$.subscribe(pieces => {
      this.pieces = pieces;
    });
    
    // Suscribirse a los cambios en el estado de completado
    this.puzzleService.isCompleted$.subscribe(isCompleted => {
      this.isCompleted = isCompleted;
    });

    // Suscribirse al contador de movimientos
    this.puzzleService.moveCounter$.subscribe(moves => {
      this.moveCounter = moves;
    });

    // Obtener la imagen actual
    this.currentImage = this.puzzleService.getCurrentImage();
    
    // Obtener el tamaño del tablero
    this.boardSize = this.puzzleService.getBoardSize();
    
    // Obtener imágenes disponibles
    this.availableImages = this.puzzleService.getAvailableImages();
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
    
    // Para un grid de 3x3, cada pieza debe mostrar 1/3 de la imagen
    // La fórmula es: (posición / (total-1)) * 100 para el desplazamiento
    const xPercent = (col / (this.boardSize - 1)) * 100;
    const yPercent = (row / (this.boardSize - 1)) * 100;
    
    return `${xPercent}% ${yPercent}%`;
  }

  // Obtener el tamaño de fondo para el rompecabezas
  getBackgroundSize(): string {
    // Para que cada pieza muestre correctamente su porción,
    // el background-size debe ser exactamente el tamaño del grid completo
    const size = this.boardSize * 100;
    return `${size}% ${size}%`;
  }
}
