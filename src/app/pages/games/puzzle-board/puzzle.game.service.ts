import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface DifficultyConfig {
  level: DifficultyLevel;
  boardSize: number;
  maxPieces: number;
  label: string;
}

const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  [DifficultyLevel.EASY]: {
    level: DifficultyLevel.EASY,
    boardSize: 3,
    maxPieces: 9,
    label: 'Fácil (3x3)'
  },
  [DifficultyLevel.MEDIUM]: {
    level: DifficultyLevel.MEDIUM,
    boardSize: 4,
    maxPieces: 16,
    label: 'Medio (4x4)'
  },
  [DifficultyLevel.HARD]: {
    level: DifficultyLevel.HARD,
    boardSize: 5,
    maxPieces: 25,
    label: 'Difícil (5x5)'
  }
};

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
  private availableImages: string[] = [
    'assets/img/img-rompecabezas/1.png',
    'assets/img/img-rompecabezas/2.png',
    'assets/img/img-rompecabezas/3.png',
    'assets/img/img-rompecabezas/4.png',
    'assets/img/img-rompecabezas/5.png'
  ];
  
  private currentImage = this.availableImages[0];
  private currentDifficulty: DifficultyLevel = DifficultyLevel.EASY;
  
  private puzzleBoardSubject = new BehaviorSubject<PuzzlePiece[]>([]);
  puzzleBoard$ = this.puzzleBoardSubject.asObservable();
  
  private isCompletedSubject = new BehaviorSubject<boolean>(false);
  isCompleted$ = this.isCompletedSubject.asObservable();
  
  private moveCounterSubject = new BehaviorSubject<number>(0);
  moveCounter$ = this.moveCounterSubject.asObservable();

  private difficultySubject = new BehaviorSubject<DifficultyLevel>(DifficultyLevel.EASY);
  difficulty$ = this.difficultySubject.asObservable();
  
  private selectedPiece: PuzzlePiece | null = null;

  constructor(private http: HttpClient) {
    this.currentImage = this.availableImages[0];
    this.initializeGame();
  }

  private getCurrentConfig(): DifficultyConfig {
    return DIFFICULTY_CONFIGS[this.currentDifficulty];
  }

  private divideImageIntoPieces(): string[] {
    const config = this.getCurrentConfig();
    const pieces: string[] = [];
    
    for (let row = 0; row < config.boardSize; row++) {
      for (let col = 0; col < config.boardSize; col++) {
        pieces.push(this.currentImage);
      }
    }
    return pieces;
  }

  initializeGame(): void {
    const config = this.getCurrentConfig();
    const pieces: PuzzlePiece[] = [];
    const dividedImages = this.divideImageIntoPieces();

    for (let i = 0; i < config.maxPieces; i++) {
      const row = Math.floor(i / config.boardSize);
      const col = i % config.boardSize;
      
      pieces.push({
        id: i,
        correctPosition: { row, col },
        currentPosition: { row, col },
        imageUrl: dividedImages[i]
      });
    }
    
    this.shufflePieces(pieces);
    this.ensureNotSolved(pieces);
    
    this.puzzleBoardSubject.next(pieces);
    this.isCompletedSubject.next(false);
    this.moveCounterSubject.next(0);
  }

  private ensureNotSolved(pieces: PuzzlePiece[]): void {
    const isSolved = pieces.every(piece => 
      piece.correctPosition.row === piece.currentPosition.row && 
      piece.correctPosition.col === piece.currentPosition.col
    );
    
    if (isSolved && pieces.length > 1) {
      const piece1 = pieces[0];
      const piece2 = pieces[1];
      const tempPosition = { ...piece1.currentPosition };
      piece1.currentPosition = { ...piece2.currentPosition };
      piece2.currentPosition = tempPosition;
    }
  }

  private shufflePieces(pieces: PuzzlePiece[]): void {
    const config = this.getCurrentConfig();
    const availablePositions: { row: number, col: number }[] = [];
    
    for (let row = 0; row < config.boardSize; row++) {
      for (let col = 0; col < config.boardSize; col++) {
        availablePositions.push({ row, col });
      }
    }
    
    // Algoritmo Fisher-Yates
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
    }
    
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].currentPosition = { ...availablePositions[i] };
    }
  }

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

  private swapPieces(piece1: PuzzlePiece, piece2: PuzzlePiece): void {
    const pieces = this.puzzleBoardSubject.value;
    const piece1Index = pieces.findIndex(p => p.id === piece1.id);
    const piece2Index = pieces.findIndex(p => p.id === piece2.id);

    const tempPosition = { ...pieces[piece1Index].currentPosition };
    pieces[piece1Index].currentPosition = { ...pieces[piece2Index].currentPosition };
    pieces[piece2Index].currentPosition = tempPosition;

    this.puzzleBoardSubject.next([...pieces]);
    this.moveCounterSubject.next(this.moveCounterSubject.value + 1);
    this.checkCompletion();
  }

  private checkCompletion(): void {
    const pieces = this.puzzleBoardSubject.value;
    const isCompleted = pieces.every(piece => 
      piece.correctPosition.row === piece.currentPosition.row && 
      piece.correctPosition.col === piece.currentPosition.col
    );

    this.isCompletedSubject.next(isCompleted);
  }

  getPieceAtPosition(row: number, col: number): PuzzlePiece | undefined {
    return this.puzzleBoardSubject.value.find(piece => 
      piece.currentPosition.row === row && piece.currentPosition.col === col
    );
  }

  getBoardSize(): number {
    return this.getCurrentConfig().boardSize;
  }

  isPieceSelected(piece: PuzzlePiece): boolean {
    return this.selectedPiece?.id === piece.id;
  }

  getAvailableImages(): string[] {
    return this.availableImages;
  }

  setImage(imageUrl: string): void {
    this.currentImage = imageUrl;
    this.loadImageAndSetBoardSize(imageUrl);
  }

  private loadImageAndSetBoardSize(imageUrl: string): void {
    const img = new Image();
    img.onload = () => {
      this.initializeGame();
    };
    img.onerror = () => {
      this.initializeGame();
    };
    img.src = imageUrl;
  }

  getCurrentImage(): string {
    return this.currentImage;
  }

  // Nuevos métodos para manejar dificultad
  setDifficulty(difficulty: DifficultyLevel): void {
    this.currentDifficulty = difficulty;
    this.difficultySubject.next(difficulty);
    this.selectedPiece = null; // Resetear selección
    this.initializeGame();
  }

  getCurrentDifficulty(): DifficultyLevel {
    return this.currentDifficulty;
  }

  getDifficultyConfigs(): DifficultyConfig[] {
    return Object.values(DIFFICULTY_CONFIGS);
  }

  getCurrentDifficultyConfig(): DifficultyConfig {
    return this.getCurrentConfig();
  }
}
