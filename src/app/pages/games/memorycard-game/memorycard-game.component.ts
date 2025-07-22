import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule] ,
})
export class MemoryGameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  isCheckingMatch: boolean = false;

  ngOnInit(): void {
    this.initializeGame();
  }

  initializeGame(): void {
    const images = [
      '🐶', '🐱', '🐭', '🐼', '🐸', '🐵', '🐧', '🐦',
      '🐶', '🐱', '🐭', '🐼', '🐸', '🐵', '🐧', '🐦',
    ];

    this.cards = images
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5); 
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
      this.flippedCards = [];
      this.isCheckingMatch = false;
    } else {
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
    this.initializeGame();
  }
}
