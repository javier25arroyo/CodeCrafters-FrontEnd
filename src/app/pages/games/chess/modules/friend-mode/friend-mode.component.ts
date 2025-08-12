import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';
import { ChessTimerComponent } from '../chess-timer/chess-timer.component';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { ChessBoardService } from '../chess-board/chess-board.service';

@Component({
  selector: 'app-friend-mode',
  templateUrl: './friend-mode.component.html',
  styleUrls: ['../chess-board/chess-board.component.css'],
  standalone: true,
  imports: [CommonModule, MoveListComponent, ChessTimerComponent]
})
export class FriendModeComponent extends ChessBoardComponent {
  constructor(
    protected override chessBoardService: ChessBoardService,
    dialog: MatDialog,
    private router: Router
  ) {
    super(chessBoardService, dialog);
  }

  public goBackToGallery(): void {
    this.router.navigate(['/game-gallery']);
  }
}
