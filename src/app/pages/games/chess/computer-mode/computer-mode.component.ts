import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from '../chess-logic/models';
import { ComputerConfiguration } from './models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-computer-mode',
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrls: ['../chess-board/chess-board.component.css'],
  standalone: true,
  imports: [CommonModule, MoveListComponent]
})
export class ComputerModeComponent extends ChessBoardComponent implements OnInit, OnDestroy {
  private computerSubscriptions$ = new Subscription();

  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService), inject(MatDialog));
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    const computerConfiSubscription$: Subscription = this.stockfishService.computerConfiguration$.subscribe({
      next: (computerConfiguration: ComputerConfiguration) => {
        if (computerConfiguration.color === Color.White) {
          this.flipBoard();
          this.setStartingColor(Color.White);
        } else {
          this.setStartingColor(Color.White);
        }
      }
    });

    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }

        const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        if (player !== this.stockfishService.computerConfiguration$.value.color) return;

        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(this.stockfishService.getBestMove(FEN));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
      }
    });

    this.computerSubscriptions$.add(chessBoardStateSubscription$);
    this.computerSubscriptions$.add(computerConfiSubscription$);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.computerSubscriptions$.unsubscribe();
  }

  protected override getResultMessage(): string | null {
    const msg = this.chessBoard.gameOverMessage;
    if (!msg) return null;

    const computerColor = this.stockfishService.computerConfiguration$.value.color;
    const humanColor = computerColor === Color.White ? 'Black' : 'White';

    if (msg.includes('won by checkmate')) {
      const winner = msg.startsWith('White') ? 'White' : 'Black';
      if (winner === humanColor) return `Winner: ${humanColor} pieces`;
      return 'Winner: AI';
    }
    if (msg === 'Stalemate') return 'Draw: Stalemate';
    if (msg.startsWith('Draw')) return 'Draw';
    return 'Game Over';
  }
}
