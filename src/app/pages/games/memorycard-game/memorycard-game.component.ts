import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DifficultySelectorComponent } from '../../../components/difficulty-selector/difficulty-selector.component';
import { DifficultyConfig, DifficultyLevel } from '../puzzle-board/puzzle.game.service';
import { Router } from '@angular/router';
export interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  templateUrl: './memorycard-game.component.html',
  styleUrls: ['./memorycard-game.component.scss'],
  imports: [CommonModule, DifficultySelectorComponent],
})
export class MemoryGameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  isCheckingMatch: boolean = false;
  score: number = 0;
  showScoreModal: boolean = false;
  difficultyConfigs: DifficultyConfig[] = [
    { level: DifficultyLevel.EASY, label: 'Fácil', boardSize: 0, maxPieces: 8 },   // 4 pares
    { level: DifficultyLevel.MEDIUM, label: 'Medio', boardSize: 0, maxPieces: 16 },// 8 pares
    { level: DifficultyLevel.HARD, label: 'Difícil', boardSize: 0, maxPieces: 24 } // 12 pares
  ];
  currentDifficulty: DifficultyLevel = DifficultyLevel.EASY;

  ngOnInit(): void {
    this.initializeGame();
  }

  initializeGame(): void {
    this.score = 0;
    const allImages = [
      '🐶', '🐱', '🐭', '🐼', '🐸', '🐵', '🐧', '🐦', '🦁', '🐷', '🐰', '🐻', '�', '🦊', '�', '�', '�', '🦄', '�', '�', '�', '🦋', '�', '🦉'
    ];
    const config = this.difficultyConfigs.find(c => c.level === this.currentDifficulty)!;
    const pairs = Math.floor((config.maxPieces || 8) / 2);
    const images = allImages.slice(0, pairs);
    const deck = [...images, ...images];
    this.cards = deck
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
  }

  onDifficultyChange(level: DifficultyLevel) {
    this.currentDifficulty = level;
    this.resetGame();
  }

  flipCard(card: Card): void {
    if (this.isCheckingMatch || card.isFlipped || card.isMatched) {
      return;
    }
    card.isFlipped = true;
    this.flippedCards.push(card);
    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  checkForMatch(): void {
    this.isCheckingMatch = true;
    const [card1, card2] = this.flippedCards;
    if (card1.image === card2.image) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.score += 2;
      this.flippedCards = [];
      this.isCheckingMatch = false;
      // Verificar si el juego terminó
      if (this.cards.every(c => c.isMatched)) {
        this.showScoreModal = true;
      }
    } else {
      this.score -= 2;
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.isCheckingMatch = false;
      }, 1000);
    }
  }

  resetGame(): void {
    this.flippedCards = [];
    this.isCheckingMatch = false;
    this.showScoreModal = false;
    this.initializeGame();
  }

  // Navegar de vuelta a la galería de juegos
  constructor(private router: Router) {}

  goToGameGallery(): void {
    this.showScoreModal = false;
    this.router.navigate(['/game-gallery']);
  }
}
