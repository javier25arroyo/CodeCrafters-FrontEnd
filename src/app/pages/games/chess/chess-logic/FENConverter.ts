import { columns } from "../modules/chess-board/models";
import { Color, LastMove } from "./models";
import { King } from "./pieces/king";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";
import { Knight } from "./pieces/knight";
import { Bishop } from "./pieces/bishop";
import { Queen } from "./pieces/queen";

export class FENConverter {
    public static readonly initalPosition: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    public convertBoardToFEN(
        board: (Piece | null)[][],
        playerColor: Color,
        lastMove: LastMove | undefined,
        fiftyMoveRuleCounter: number,
        numberOfFullMoves: number
    ): string {
        let FEN: string = "";

        for (let i = 7; i >= 0; i--) {
            let FENRow: string = "";
            let consecutiveEmptySquaresCounter = 0;

            for (const piece of board[i]) {
                if (!piece) {
                    consecutiveEmptySquaresCounter++;
                    continue;
                }

                if (consecutiveEmptySquaresCounter !== 0)
                    FENRow += String(consecutiveEmptySquaresCounter);

                consecutiveEmptySquaresCounter = 0;
                FENRow += piece.FENChar;
            }

            if (consecutiveEmptySquaresCounter !== 0)
                FENRow += String(consecutiveEmptySquaresCounter);

            FEN += (i === 0) ? FENRow : FENRow + "/";
        }

        const player: string = playerColor === Color.White ? "w" : "b";
        FEN += " " + player;
        FEN += " " + this.castlingAvailability(board);
        FEN += " " + this.enPassantPosibility(lastMove, playerColor);
        FEN += " " + fiftyMoveRuleCounter * 2;
        FEN += " " + numberOfFullMoves;
        return FEN;
    }

    private castlingAvailability(board: (Piece | null)[][]): string {
        const castlingPossibilities = (color: Color): string => {
            let castlingAvailability: string = "";

            const kingPositionX: number = color === Color.White ? 0 : 7;
            const king: Piece | null = board[kingPositionX][4];

            if (king instanceof King && !king.hasMoved) {
                const rookPositionX: number = kingPositionX;
                const kingSideRook = board[rookPositionX][7];
                const queenSideRook = board[rookPositionX][0];

                if (kingSideRook instanceof Rook && !kingSideRook.hasMoved)
                    castlingAvailability += "k";

                if (queenSideRook instanceof Rook && !queenSideRook.hasMoved)
                    castlingAvailability += "q";

                if (color === Color.White)
                    castlingAvailability = castlingAvailability.toUpperCase();
            }
            return castlingAvailability;
        }

        const castlingAvailability: string = castlingPossibilities(Color.White) + castlingPossibilities(Color.Black);
        return castlingAvailability !== "" ? castlingAvailability : "-";
    }

    private enPassantPosibility(lastMove: LastMove | undefined, color: Color): string {
        if (!lastMove) return "-";
        const { piece, currX: newX, prevX, prevY } = lastMove;

        if (piece instanceof Pawn && Math.abs(newX - prevX) === 2) {
            const row: number = color === Color.White ? 6 : 3;
            return columns[prevY] + String(row);
        }
        return "-";
    }

    /**
     * Convierte un FEN a un tablero de piezas (Piece | null)[][]
     */
    public static fromFEN(fen: string): (Piece | null)[][] {
        const rows = fen.split(' ')[0].split('/');
        const board: (Piece | null)[][] = [];
        for (let i = 0; i < 8; i++) {
            const row: (Piece | null)[] = [];
            let j = 0;
            for (const char of rows[i]) {
                if (!isNaN(Number(char))) {
                    for (let k = 0; k < Number(char); k++) row.push(null);
                    j += Number(char);
                } else {
                    // Pieza
                    switch (char) {
                        case 'P': row.push(new Pawn(Color.White)); break;
                        case 'N': row.push(new Knight(Color.White)); break;
                        case 'B': row.push(new Bishop(Color.White)); break;
                        case 'R': row.push(new Rook(Color.White)); break;
                        case 'Q': row.push(new Queen(Color.White)); break;
                        case 'K': row.push(new King(Color.White)); break;
                        case 'p': row.push(new Pawn(Color.Black)); break;
                        case 'n': row.push(new Knight(Color.Black)); break;
                        case 'b': row.push(new Bishop(Color.Black)); break;
                        case 'r': row.push(new Rook(Color.Black)); break;
                        case 'q': row.push(new Queen(Color.Black)); break;
                        case 'k': row.push(new King(Color.Black)); break;
                        default: row.push(null);
                    }
                    j++;
                }
            }
            board.push(row);
        }
        return board;
    }
}