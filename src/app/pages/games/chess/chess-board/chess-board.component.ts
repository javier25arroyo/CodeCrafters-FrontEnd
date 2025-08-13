
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';
import { ChessBoard } from '../chess-logic/chess-board';
import { CheckState, Color, Coords, FENChar, GameHistory, LastMove, MoveList, MoveType, SafeSquares, pieceImagePaths } from '../chess-logic/models';
import { SelectedSquare } from './models';
import { ChessBoardService } from './chess-board.service';
import { Subscription, filter, fromEvent, tap } from 'rxjs';
import { FENConverter } from '../chess-logic/FENConverter';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChessResultDialogComponent } from '../chess-result-dialog/chess-result-dialog.component';


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
  standalone: true,
  imports: [CommonModule, MoveListComponent, MatDialogModule]
})
export class ChessBoardComponent implements OnInit, OnDestroy {
  public pieceImagePaths = pieceImagePaths;

  protected chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.chessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor; }
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; }
  public get gameOverMessage(): string | undefined { return this.chessBoard.gameOverMessage; }

  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  public get moveList(): MoveList { return this.chessBoard.moveList; }
  public get gameHistory(): GameHistory { return this.chessBoard.gameHistory; }
  public gameHistoryPointer: number = 0;

  public isPromotionActive: boolean = false;
  private promotionCoords: Coords | null = null;
  private promotedPiece: FENChar | null = null;
  public promotionPieces(): FENChar[] {
    return this.playerColor === Color.White ?
      [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] :
      [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen];
  }

  public flipMode: boolean = false;
  public showFlipButton: boolean = false;
  private subscriptions$ = new Subscription();
  private resultShown = false;

  constructor(protected chessBoardService: ChessBoardService, private dialog: MatDialog) { }

  public get isVsAI(): boolean {
    // Detecta si el componente es ComputerModeComponent
    return this.constructor.name === 'ComputerModeComponent';
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
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
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
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return;
    if (this.isWrongPieceSelected(piece)) return;

    const isSameSquareClicked: boolean = !!this.selectedSquare.piece && this.selectedSquare.x === x && this.selectedSquare.y === y;
    this.unmarkingPreviouslySlectedAndSafeSquares();
    if (isSameSquareClicked) return;

    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private placingPiece(newX: number, newY: number): void {
    if (!this.selectedSquare.piece) return;
    if (!this.isSquareSafeForSelectedPiece(newX, newY)) return;

    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn;
    const isPawnOnlastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnlastRank;

    if (shouldOpenPromotionDialog) {
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY };
      return;
    }

    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
  }

  protected updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void {
    this.chessBoard.move(prevX, prevY, newX, newY, promotedPiece);
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.markLastMoveAndCheckState(this.chessBoard.lastMove, this.chessBoard.checkState);
    this.unmarkingPreviouslySlectedAndSafeSquares();
    this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN);
    this.gameHistoryPointer++;
  }

  public setStartingColor(color: Color): void {
    this.chessBoard.setStartingPlayer(color);
    if (color === Color.Black) this.flipMode = true;
    this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN);
  }

  public promotePiece(piece: FENChar): void {
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece = piece;
    const { x: newX, y: newY } = this.promotionCoords;
    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
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

    if (!this.resultShown && this.chessBoard.gameOverMessage) {
      const msg = this.getResultMessage();
      if (msg) {
        this.resultShown = true;
        this.dialog.open(ChessResultDialogComponent, { data: { message: msg }, disableClose: false });
      }
    }
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
    this.chessBoardView = board;
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

  protected getResultMessage(): string | null {
    const msg = this.chessBoard.gameOverMessage;
    if (!msg) return null;
    if (msg.includes('won by checkmate')) {
      const winner = msg.startsWith('White') ? 'White' : 'Black';
      return `Winner: ${winner} pieces`;
    }
    if (msg === 'Stalemate') return 'Draw: Stalemate';
    if (msg.startsWith('Draw')) return 'Draw';
    return `Game Over`;
  }
}
