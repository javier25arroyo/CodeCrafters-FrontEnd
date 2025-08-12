// ...existing code...
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChessResultDialogComponent } from '../chess-result-dialog/chess-result-dialog.component';
import { ChessTimerComponent } from '../chess-timer/chess-timer.component';
import { CommonModule } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';
import { ChessBoard } from '../../chess-logic/chess-board';
import { CheckState, Color, Coords, FENChar, GameHistory, LastMove, MoveList, MoveType, SafeSquares, pieceImagePaths } from '../../chess-logic/models';
import { SelectedSquare } from './models';
import { ChessBoardService } from './chess-board.service';
import { Subscription, filter, fromEvent, tap } from 'rxjs';
import { FENConverter } from '../../chess-logic/FENConverter';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
  standalone: true,
  imports: [CommonModule, MoveListComponent, ChessTimerComponent]
})
export class ChessBoardComponent implements OnInit, OnDestroy {
  public timerStarted = false;
  private timerDialogOpen = false;
  public pieceImagePaths = pieceImagePaths;

  protected chessBoard = new ChessBoard();
  public get chessBoardView(): (FENChar | null)[][] {
    // Si flipMode está activo, invertir las filas para mostrar negras abajo
    return this.flipMode ? [...this.chessBoard.chessBoardView].reverse() : this.chessBoard.chessBoardView;
  }
  public get playerColor(): Color { return this.chessBoard.playerColor; };
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };
  public get gameOverMessage(): string | undefined { return this.chessBoard.gameOverMessage; };
  public get winner(): 'w' | 'b' | undefined { return (this.chessBoard as any).winner; }

  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  public get moveList(): MoveList { return this.chessBoard.moveList; };
  public get gameHistory(): GameHistory { return this.chessBoard.gameHistory; };
  public gameHistoryPointer: number = 0;

  // promotion properties
  public isPromotionActive: boolean = false;
  private promotionCoords: Coords | null = null;
  private promotedPiece: FENChar | null = null;
  public promotionPieces(): FENChar[] {
    return this.playerColor === Color.White ?
      [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] :
      [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen];
  }

  public flipMode: boolean = false;
  private subscriptions$ = new Subscription();

  constructor(
    protected chessBoardService: ChessBoardService,
    private dialog: MatDialog
  ) {
    // Por defecto, jugador es blancas y FEN inicial
    this.chessBoard = new ChessBoard(Color.White, undefined);
  }

  public ngOnInit(): void {
    const keyEventSubscription$: Subscription = fromEvent<KeyboardEvent>(document, "keyup")
      .pipe(
        filter(event => event.key === "ArrowRight" || event.key === "ArrowLeft"),
        tap(event => {
          switch (event.key) {
            case "ArrowRight":
              if (this.gameHistoryPointer === this.gameHistory.length - 1) return;
              this.gameHistoryPointer++;
              break;
            case "ArrowLeft":
              if (this.gameHistoryPointer === 0) return;
              this.gameHistoryPointer--;
              break;
            default:
              break;
          }

          this.showPreviousPosition(this.gameHistoryPointer);
        })
      )
      .subscribe();

    this.subscriptions$.add(keyEventSubscription$);
    
    // Timer y resultado
    this.chessBoardService.chessBoardState$.subscribe(() => {
      if (!this.timerStarted && !this.gameOverMessage) {
        this.timerStarted = true;
      }
      if (this.gameOverMessage && this.timerStarted && !this.timerDialogOpen) {
        this.timerStarted = false;
        this.timerDialogOpen = true;
        setTimeout(() => {
          this.dialog.open(ChessResultDialogComponent, {
            data: {
              winner: this.getWinnerText(),
              reason: this.gameOverMessage
            },
            disableClose: true
          }).afterClosed().subscribe(() => {
            this.timerDialogOpen = false;
          });
        }, 300);
      }
    });
  }

  getWinnerText(): string {
    // Detectar si es contra la IA
    const isVsAI = window.location.pathname.includes('against-computer');
    if (this.gameOverMessage?.toLowerCase().includes('tablas')) return 'Empate';
    if (isVsAI) {
      if (this.winner === 'w' && this.playerColor === 0) return '¡Felicitaciones, le ganaste a la IA!';
      if (this.winner === 'b' && this.playerColor === 1) return '¡Felicitaciones, le ganaste a la IA!';
      if (this.winner === 'w' || this.winner === 'b') return 'Lo siento, la IA te ha derrotado. Suerte la próxima.';
    }
    if (this.winner === 'w') return 'Ganador: piezas blancas';
    if (this.winner === 'b') return 'Ganador: piezas negras';
    return 'Jugador';
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.chessBoardService.chessBoardState$.next(FENConverter.initalPosition);
  }

  public flipBoard(): void {
    this.flipMode = !this.flipMode;
  }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    if ('x' in this.selectedSquare && 'y' in this.selectedSquare) {
      return this.selectedSquare.x === x && this.selectedSquare.y === y;
    }
    return false;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y);
  }

  public isSquareLastMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return x === prevX && y === prevY || x === currX && y === currY;
  }

  public isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquarePromotionSquare(x: number, y: number): boolean {
    if (!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  private unmarkingPreviouslySlectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];

    if (this.isPromotionActive) {
      this.isPromotionActive = false;
      this.promotedPiece = null;
      this.promotionCoords = null;
    }
  }

  private selectingPiece(x: number, y: number): void {
  if (this.gameOverMessage !== undefined) return;
  // Bloqueo de input humano según color
  // Si el color de turno no es el del jugador humano, ignorar input
  if ((this as any)._playerColor !== undefined && this.chessBoard.playerColor !== (this as any)._playerColor) return;
  const piece: FENChar | null = this.chessBoardView[x][y];
  if (!piece) return;
  if (this.isWrongPieceSelected(piece)) return;

    let isSameSquareClicked = false;
    if (this.selectedSquare.piece && 'x' in this.selectedSquare && 'y' in this.selectedSquare) {
      isSameSquareClicked = this.selectedSquare.x === x && this.selectedSquare.y === y;
    }
    this.unmarkingPreviouslySlectedAndSafeSquares();
    if (isSameSquareClicked) return;

    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private placingPiece(newX: number, newY: number): void {
    if (!this.selectedSquare.piece) return;
    if (!this.isSquareSafeForSelectedPiece(newX, newY)) return;

    // pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn;
    const isPawnOnlastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnlastRank;

    if (shouldOpenPromotionDialog) {
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY };
      return;
    }

    if ('x' in this.selectedSquare && 'y' in this.selectedSquare) {
      const { x: prevX, y: prevY } = this.selectedSquare;
      this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
    }
  }

  protected updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void {
    // Forzar el color de turno si el movimiento lo hace la IA
    // Detectamos si el movimiento es de la IA por el color de la pieza origen
    const piece = this.chessBoard.chessBoardView[prevX][prevY];
    if (piece) {
      const isWhitePiece = piece === piece.toUpperCase();
      const expectedColor = isWhitePiece ? Color.White : Color.Black;
      if (this.chessBoard.playerColor !== expectedColor) {
        // Forzar el color de turno para que la IA pueda mover
        (this.chessBoard as any)._playerColor = expectedColor;
      }
    }
  this.chessBoard.move(prevX, prevY, newX, newY, promotedPiece);
  this.markLastMoveAndCheckState(this.chessBoard.lastMove, this.chessBoard.checkState);
  this.unmarkingPreviouslySlectedAndSafeSquares();
  this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN);
  this.gameHistoryPointer++;
  }

  public promotePiece(piece: FENChar): void {
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece = piece;
    const { x: newX, y: newY } = this.promotionCoords;
    if ('x' in this.selectedSquare && 'y' in this.selectedSquare) {
      const { x: prevX, y: prevY } = this.selectedSquare;
      this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
    }
  }

  public closePawnPromotionDialog(): void {
    this.unmarkingPreviouslySlectedAndSafeSquares();
  }

  private markLastMoveAndCheckState(lastMove: LastMove | undefined, checkState: CheckState): void {
    this.lastMove = lastMove;
    this.checkState = checkState;

    if (this.lastMove)
      this.moveSound(this.lastMove.moveType);
    else
      this.moveSound(new Set<MoveType>([MoveType.BasicMove]));
  }
  public move(x: number, y: number): void {
    this.selectingPiece(x, y);
    this.placingPiece(x, y);
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.Black ||
      !isWhitePieceSelected && this.playerColor === Color.White;
  }

  public showPreviousPosition(moveIndex: number): void {
  const { board, checkState, lastMove } = this.gameHistory[moveIndex];
  // this.chessBoardView = board; // No se puede asignar, getter
  this.markLastMoveAndCheckState(lastMove, checkState);
  this.gameHistoryPointer = moveIndex;
  }

  private moveSound(moveType: Set<MoveType>): void {
    const moveSound = new Audio("assets/chesssounds/move.mp3");

    if (moveType.has(MoveType.Promotion)) moveSound.src = "assets/chesssounds/promote.mp3";
    else if (moveType.has(MoveType.Capture)) moveSound.src = "assets/chesssounds/capture.mp3";
    else if (moveType.has(MoveType.Castling)) moveSound.src = "assets/chesssounds/castling.mp3";

    if (moveType.has(MoveType.CheckMate)) moveSound.src = "assets/chesssounds/checkmate.mp3";
    else if (moveType.has(MoveType.Check)) moveSound.src = "assets/chesssounds/check.mp3";

    moveSound.play();
  }

  public getPieceImage(piece: FENChar | null): string {
    if (piece && this.pieceImagePaths[piece]) {
      return this.pieceImagePaths[piece];
    }
    return '';
  }
}
