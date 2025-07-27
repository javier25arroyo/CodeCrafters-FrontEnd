import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../services/game.service';
import { IGame } from '../../../interfaces';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-game-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-game-list.component.html',
  styleUrls: ['./admin-game-list.component.scss']
})
export class AdminGameListComponent implements OnInit {
  games: IGame[] = [];

  constructor(private gameService: GameService) {}

   ngOnInit(): void {
    this.loadGames();
  }


  loadGames(): void {
    this.gameService.getAllGames().subscribe({
      next: (data) => {
        this.games = data;
      },
      error: (err) => {
        console.error('Error al cargar juegos:', err);
      }
    });
}
}
