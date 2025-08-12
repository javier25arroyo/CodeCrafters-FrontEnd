import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameScoreService, GameScoreStat } from '../../services/game-score-stat.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from '../../components/nav/nav.component';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavComponent],
  templateUrl: './game-score-stat.component.html',
  styleUrls: ['./game-score-stat.component.scss']
})
export class GameStatsComponent implements OnInit {
  scores: GameScoreStat[] = [];

  gameTypeNames: Record<string, string> = {
    PUZZLE: 'Rompecabezas',
    CROSSWORD: 'Crucigrama',
    NUMBER_SEQUENCE: 'Juego de Secuencia',
    CARD_MEMORY: 'Cartas de Memoria',
    MUSIC_MEMORY: 'Memoria Musical',
    WORD_SEARCH: 'Sopa de Letras',
  };


  constructor(
    private userService: UserService,
    private gameScoreService: GameScoreService
  ) { }


  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.loadScores(user.id);
      } else {
        this.scores = [];
      }
    });

    this.userService.loadCurrentUser();
  }

  private loadScores(userId: number): void {
    this.gameScoreService.getScoresByUserId(userId).subscribe({
      next: (data) => {
        console.log('Scores recibidos:', data);
        this.scores = data;
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.scores = [];
      }
    });
  }
  getGameName(gameType: string): string {
    return this.gameTypeNames[gameType] || gameType;
  }
}
