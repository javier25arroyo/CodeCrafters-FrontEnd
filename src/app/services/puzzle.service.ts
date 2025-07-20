import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Definimos una interfaz para representar una pieza del rompecabezas
export interface PuzzlePiece {
  id: number;
  correctPosition: { row: number, col: number };
  currentPosition: { row: number, col: number };
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  // Tamaño fijo del tablero
  private readonly boardSize = 3;
  // Total de piezas
  private totalPieces = this.boardSize * this.boardSize;
  // Imágenes disponibles
  private availableImages: string[] = [
    'assets/img-rompecabezas/1.png',
    'assets/img-rompecabezas/2.png',
    'assets/img-rompecabezas/3.png',
    'assets/img-rompecabezas/4.png',
    'assets/img-rompecabezas/5.png'
  ];
  // Imagen seleccionada actualmente
  private currentImage = this.availableImages[0];

  // Observable para el estado del tablero
  private puzzleBoardSubject = new BehaviorSubject<PuzzlePiece[]>([]);
  puzzleBoard$ = this.puzzleBoardSubject.asObservable();

  // Observable para verificar si el puzzle está completo
  private isCompletedSubject = new BehaviorSubject<boolean>(false);
  isCompleted$ = this.isCompletedSubject.asObservable();

  // Observable para el contador de movimientos
  private moveCounterSubject = new BehaviorSubject<number>(0);
  moveCounter$ = this.moveCounterSubject.asObservable();

  // Pieza seleccionada actualmente (para intercambio)
  private selectedPiece: PuzzlePiece | null = null;

  // Inicializar con la primera imagen al crear el servicio
  constructor(private http: HttpClient) {
    // Usar las imágenes que sabemos que existen
    this.currentImage = this.availableImages[0];
    this.initializeGame();
  }

  // Cargar imágenes dinámicamente desde la carpeta assets/img
  private loadAvailableImages(): void {
    
    // Inicializamos directamente con las imágenes conocidas
    this.currentImage = this.availableImages[0];
    this.initializeGame();
  }

  // Dividir la imagen seleccionada en piezas
  private divideImageIntoPieces(): string[] {
    const pieces: string[] = [];
    
    // Usamos un enfoque más directo para dividir la imagen en piezas
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        // En vez de generar un estilo completo, solo almacenamos la URL de la imagen
        // Las posiciones se calcularán en el componente
        pieces.push(this.currentImage);
      }
    }

    return pieces;
  }

  // Inicializa un nuevo juego
  initializeGame(): void {
    this.updateTotalPieces();
    const pieces: PuzzlePiece[] = [];
    const dividedImages = this.divideImageIntoPieces();

    // Crear piezas con posiciones correctas
    for (let i = 0; i < this.totalPieces; i++) {
      const row = Math.floor(i / this.boardSize);
      const col = i % this.boardSize;
      
      pieces.push({
        id: i,
        correctPosition: { row, col },
        currentPosition: { row, col }, // Inicialmente en posición correcta
        imageUrl: dividedImages[i]
      });
    }
    
    // Mezcla las piezas para iniciar juego
    this.shufflePieces(pieces);
    
    // Verificar que el rompecabezas no esté resuelto después de mezclar
    this.ensureNotSolved(pieces);
    
    this.puzzleBoardSubject.next(pieces);
    this.isCompletedSubject.next(false);
    this.moveCounterSubject.next(0);
  }

  // Asegura que el rompecabezas no esté resuelto después de mezclar
  private ensureNotSolved(pieces: PuzzlePiece[]): void {
    const isSolved = pieces.every(piece => 
      piece.correctPosition.row === piece.currentPosition.row && 
      piece.correctPosition.col === piece.currentPosition.col
    );
    
    // Si está resuelto, intercambiamos al menos dos piezas
    if (isSolved && pieces.length > 1) {
      const piece1 = pieces[0];
      const piece2 = pieces[1];
      const tempPosition = { ...piece1.currentPosition };
      piece1.currentPosition = { ...piece2.currentPosition };
      piece2.currentPosition = tempPosition;
    }
  }

  // Actualiza el total de piezas basado en el tamaño del tablero
  private updateTotalPieces(): void {
    this.totalPieces = this.boardSize * this.boardSize;
  }

  // Mezcla las piezas del rompecabezas 
  private shufflePieces(pieces: PuzzlePiece[]): void {
    // Crear un array con todas las posiciones disponibles
    const availablePositions: { row: number, col: number }[] = [];
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        availablePositions.push({ row, col });
      }
    }
    
    // Algoritmo Fisher-Yates para mezclar las posiciones
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
    }
    
    // Asignar las posiciones mezcladas a las piezas
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].currentPosition = { ...availablePositions[i] };
    }
  }

  // Selecciona una pieza
  selectPiece(piece: PuzzlePiece): void {
    if (!this.selectedPiece) {
      this.selectedPiece = piece;
    } else if (this.selectedPiece.id !== piece.id) {
      this.swapPieces(this.selectedPiece, piece);
      this.selectedPiece = null;
    } else {
      this.selectedPiece = null;
    }
  }

  // Intercambia dos piezas
  private swapPieces(piece1: PuzzlePiece, piece2: PuzzlePiece): void {
    const pieces = this.puzzleBoardSubject.value;
    const piece1Index = pieces.findIndex(p => p.id === piece1.id);
    const piece2Index = pieces.findIndex(p => p.id === piece2.id);

    // Intercambiar posiciones actuales
    const tempPosition = { ...pieces[piece1Index].currentPosition };
    pieces[piece1Index].currentPosition = { ...pieces[piece2Index].currentPosition };
    pieces[piece2Index].currentPosition = tempPosition;

    this.puzzleBoardSubject.next([...pieces]);
    this.moveCounterSubject.next(this.moveCounterSubject.value + 1);
    this.checkCompletion();
  }

  // Verifica si el rompecabezas está completo
  private checkCompletion(): void {
    const pieces = this.puzzleBoardSubject.value;
    const isCompleted = pieces.every(piece => 
      piece.correctPosition.row === piece.currentPosition.row && 
      piece.correctPosition.col === piece.currentPosition.col
    );

    this.isCompletedSubject.next(isCompleted);
  }

  // Obtiene la pieza en una posición específica
  getPieceAtPosition(row: number, col: number): PuzzlePiece | undefined {
    return this.puzzleBoardSubject.value.find(piece => 
      piece.currentPosition.row === row && piece.currentPosition.col === col
    );
  }

  // Devuelve el tamaño del tablero
  getBoardSize(): number {
    return this.boardSize;
  }

  // Verifica si una pieza está seleccionada
  isPieceSelected(piece: PuzzlePiece): boolean {
    return this.selectedPiece?.id === piece.id;
  }

  // Obtener la lista de imágenes disponibles
  getAvailableImages(): string[] {
    return this.availableImages;
  }

  // Cambiar la imagen actual
  setImage(imageUrl: string): void {
    this.currentImage = imageUrl;
    this.loadImageAndSetBoardSize(imageUrl);
  }

  // Cargar imagen y reiniciar el juego
  private loadImageAndSetBoardSize(imageUrl: string): void {
    const img = new Image();
    img.onload = () => {
      this.initializeGame();
    };
    img.onerror = () => {
      console.warn(`No se pudo cargar la imagen: ${imageUrl}.`);
      this.initializeGame();
    };
    img.src = imageUrl;
  }

  // Obtener la imagen actual
  getCurrentImage(): string {
    return this.currentImage;
  }
}
