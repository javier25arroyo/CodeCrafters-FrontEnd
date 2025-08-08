import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../../components/nav/nav.component';
import { PuzzleService, PuzzlePiece, DifficultyLevel, DifficultyConfig } from './puzzle.game.service';

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
  timeElapsed: number = 0;
  
  constructor(@Inject(PuzzleService) private puzzleService: PuzzleService) {}

  ngOnInit() {
    this.puzzleService.puzzleBoard$.subscribe((pieces: PuzzlePiece[]) => {
      this.pieces = pieces;
    });
    
    this.puzzleService.isCompleted$.subscribe((isCompleted: boolean) => {
      this.isCompleted = isCompleted;
    });

    this.puzzleService.moveCounter$.subscribe((moves: number) => {
      this.moveCounter = moves;
    });

    this.puzzleService.difficulty$.subscribe((difficulty: DifficultyLevel) => {
      this.currentDifficulty = difficulty;
    });

    this.puzzleService.timeElapsed$.subscribe((time: number) => {
      this.timeElapsed = time;
    });

    this.currentImage = this.puzzleService.getCurrentImage();
    
    this.boardSize = this.puzzleService.getBoardSize();
    
    this.availableImages = this.puzzleService.getAvailableImages();

    this.difficultyConfigs = this.puzzleService.getDifficultyConfigs();
  }
  
  selectPiece(piece: PuzzlePiece): void {
    this.puzzleService.selectPiece(piece);
  }
  
  isPieceSelected(piece: PuzzlePiece): boolean {
    return this.puzzleService.isPieceSelected(piece);
  }
  
  changeImage(imageUrl: string): void {
    this.puzzleService.setImage(imageUrl);
    this.currentImage = imageUrl;
  }
  
  resetGame(): void {
    this.puzzleService.initializeGame();
  }
  
  getPieceAtPosition(row: number, col: number): PuzzlePiece | undefined {
    return this.puzzleService.getPieceAtPosition(row, col);
  }
  
  getRowCol(index: number): { row: number, col: number } {
    return {
      row: Math.floor(index / this.boardSize),
      col: index % this.boardSize
    };
  }
  
  range(size: number): number[] {
    return Array(size).fill(0).map((_, i) => i);
  }

  getBackgroundPosition(piece: PuzzlePiece): string {
    return piece.backgroundPosition;
  }

  getBackgroundSize(piece: PuzzlePiece): string {
    return piece.backgroundSize;
  }

  changeDifficulty(difficulty: DifficultyLevel): void {
    this.puzzleService.setDifficulty(difficulty);
    this.boardSize = this.puzzleService.getBoardSize();
  }

  isCurrentDifficulty(difficulty: DifficultyLevel): boolean {
    return this.currentDifficulty === difficulty;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

}
