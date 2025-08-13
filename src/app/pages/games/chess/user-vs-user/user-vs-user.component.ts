import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { MoveListComponent } from '../move-list/move-list.component';

@Component({
  selector: 'app-user-vs-user',
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrls: ['../chess-board/chess-board.component.css'],
  standalone: true,
  imports: [CommonModule, MoveListComponent]
})
export class UserVsUserComponent extends ChessBoardComponent implements OnInit {
  public override showFlipButton: boolean = true; // only user-vs-user shows Flip

  public override ngOnInit(): void {
    super.ngOnInit();
  }
}
