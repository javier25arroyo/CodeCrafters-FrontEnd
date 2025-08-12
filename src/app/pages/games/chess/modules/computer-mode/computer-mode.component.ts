import { Component, OnDestroy, OnInit, inject, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';
import { ChessTimerComponent } from '../chess-timer/chess-timer.component';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { FENConverter } from '../../chess-logic/FENConverter';
import { ChessBoard } from '../../chess-logic/chess-board';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from '../../chess-logic/models';
import { ComputerConfiguration } from './models';

@Component({
  selector: 'app-computer-mode',
  templateUrl: './computer-mode.component.html',
  styleUrls: ['../chess-board/chess-board.component.css'],
  standalone: true,
  imports: [CommonModule, MoveListComponent, ChessTimerComponent]
})
export class ComputerModeComponent extends ChessBoardComponent implements OnInit, OnDestroy {
  public override flipMode: boolean = false;
  private computerSubscriptions$ = new Subscription();

  // Handler compatible con EventListener para eventos personalizados
  private stockfishMoveHandler = (event: Event) => {
    this.handleStockfishMove(event as CustomEvent);
  };
  private forceAIMoveHandler = this.forceAIMove.bind(this);

  private _playerColor!: Color;
  private fen: string;

  constructor(
    private stockfishService: StockfishService,
    dialog: MatDialog,
    private ngZone: NgZone,
  ) {
    const iaColor = stockfishService.computerConfiguration$.value.color;
    // El color del usuario es el opuesto al de la IA
    const playerColor = iaColor === Color.White ? Color.Black : Color.White;
    let fen = FENConverter.initalPosition;

    // IMPORTANTE: El FEN siempre debe empezar con turno de blancas ('w')
    // Esto asegura que la IA mueva primero cuando es blancas
    fen = fen.replace(/ [wb] /, ' w ');

    console.log('IA juega con: ' + (iaColor === Color.White ? 'blancas' : 'negras'));
    console.log('Usuario juega con: ' + (playerColor === Color.White ? 'blancas' : 'negras'));
    console.log('FEN inicial: ' + fen);

    super(inject(ChessBoardService), dialog);
  // _playerColor representa el color del humano
  (this as any)._playerColor = playerColor;
    this.fen = fen;
    // Deja que el FEN determine el turno
    this.chessBoard = new ChessBoard(undefined, this.fen);
    // Si el usuario elige negras, activar flipMode para que las negras estén abajo
    if (playerColor === Color.Black) {
      this.flipMode = true;
    }
  }

  public override get playerColor(): Color {
    return this.chessBoard.playerColor;
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    // Añadimos listener para el evento stockfishMove (nuevo mecanismo)
  window.addEventListener('stockfishMove', this.stockfishMoveHandler);
    window.addEventListener('forceAIMove', this.forceAIMoveHandler);

    // Asegura que el FEN inicial y el color interno estén sincronizados
    this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN);

    // Forzar movimiento inicial de la IA si es su turno
    setTimeout(() => {
      const iaColor = this.stockfishService.computerConfiguration$.value.color;
      const FEN = this.chessBoardService.chessBoardState$.value;
      const turnColor: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
      if (iaColor === turnColor) {
        this.stockfishService.play(FEN);
      }
    }, 100);

    const computerConfiSubscription$: Subscription = this.stockfishService.computerConfiguration$.subscribe({
      next: (computerConfiguration: ComputerConfiguration) => {
        console.log('Configuración de IA actualizada: color = ' + 
                   (computerConfiguration.color === Color.White ? 'blancas' : 'negras'));
        
        // Intentar forzar movimiento de la IA si le corresponde
        setTimeout(() => {
          const FEN = this.chessBoardService.chessBoardState$.value;
          const turnColor: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
          if (computerConfiguration.color === turnColor) {
            console.log('Forzando movimiento de la IA después de cambio de configuración');
            this.forceAIMove();
          }
        }, 100);
      }
    });

    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }

        const turnColor: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        const iaColor = this.stockfishService.computerConfiguration$.value.color;
        
        if (turnColor !== iaColor) return;

        const hasIAPieces = this.chessBoard.chessBoardView.some(row => row.some(piece => {
          if (!piece) return false;
          return iaColor === Color.White ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
        }));
        
        if (!hasIAPieces) return;

        // Usamos el nuevo sistema de eventos para manejar la respuesta
        console.log('Es turno de la IA, solicitando movimiento para FEN:', FEN);
        this.stockfishService.play(FEN);
      }
    });

    this.computerSubscriptions$.add(chessBoardStateSubscription$);
    this.computerSubscriptions$.add(computerConfiSubscription$);
  }

  private handleStockfishMove(event: CustomEvent): void {
    this.ngZone.run(() => {
      if (this.chessBoard.isGameOver) {
        console.log('No se puede ejecutar movimiento de IA: el juego ha terminado');
        return;
      }
      
      const move = event.detail;
      console.log('Recibido movimiento de Stockfish:', move);
      
      if (move && 'prevX' in move && 'prevY' in move && 'newX' in move && 'newY' in move) {
        const { prevX, prevY, newX, newY, promotedPiece } = move;
        console.log(`Ejecutando movimiento de IA: (${prevX},${prevY}) a (${newX},${newY})${promotedPiece ? ' promocionando a '+promotedPiece : ''}`);
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
      }
    });
  }

  private async forceAIMove() {
    this.ngZone.run(async () => {
      if (this.chessBoard.isGameOver) {
        console.log('No se puede forzar movimiento de IA: el juego ha terminado');
        return;
      }
      
      const FEN = this.chessBoardService.chessBoardState$.value;
      const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
      const iaColor = this.stockfishService.computerConfiguration$.value.color;
      
      console.log('Forzando movimiento: turno = ' + (player === Color.White ? 'blancas' : 'negras') + 
                 ', IA = ' + (iaColor === Color.White ? 'blancas' : 'negras'));
      
      if (player !== iaColor) {
        console.log('No es el turno de la IA para mover');
        return;
      }
      
      console.log('La IA está calculando su movimiento...');
      try {
        // Usamos el nuevo método play en lugar de getBestMove
        this.stockfishService.play(FEN);
      } catch (error) {
        console.error('Error al obtener el mejor movimiento de la IA:', error);
      }
    });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Limpieza de eventos para evitar memory leaks
  window.removeEventListener('stockfishMove', this.stockfishMoveHandler);
    window.removeEventListener('forceAIMove', this.forceAIMoveHandler);
    this.computerSubscriptions$.unsubscribe();
  }
}
