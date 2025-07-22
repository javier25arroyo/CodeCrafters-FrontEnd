import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-puzzle-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './puzzle-game.component.html',
  styleUrls: ['./puzzle-game.component.scss']
})
export class PuzzleGameComponent {

}
