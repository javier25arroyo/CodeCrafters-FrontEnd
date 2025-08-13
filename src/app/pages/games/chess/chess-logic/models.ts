import { Piece } from "./pieces/piece";

export enum Color {
    White,
    Black
}

export type Coords = {
    x: number;
    y: number;
}

export enum FENChar {
    WhitePawn = "P",
    WhiteKnight = "N",
    WhiteBishop = "B",
    WhiteRook = "R",
    WhiteQueen = "Q",
    WhiteKing = "K",
    BlackPawn = "p",
    BlackKnight = "n",
    BlackBishop = "b",
    BlackRook = "r",
    BlackQueen = "q",
    BlackKing = "k"
}

export const pieceImagePaths: Readonly<Record<string, string>> = {
    [FENChar.WhitePawn]: "assets/img/chesspieces/white pawn.svg",
    [FENChar.WhiteKnight]: "assets/img/chesspieces/white knight.svg",
    [FENChar.WhiteBishop]: "assets/img/chesspieces/white bishop.svg",
    [FENChar.WhiteRook]: "assets/img/chesspieces/white rook.svg",
    [FENChar.WhiteQueen]: "assets/img/chesspieces/white queen.svg",
    [FENChar.WhiteKing]: "assets/img/chesspieces/white king.svg",
    [FENChar.BlackPawn]: "assets/img/chesspieces/black pawn.svg",
    [FENChar.BlackKnight]: "assets/img/chesspieces/black knight.svg",
    [FENChar.BlackBishop]: "assets/img/chesspieces/black bishop.svg",
    [FENChar.BlackRook]: "assets/img/chesspieces/black rook.svg",
    [FENChar.BlackQueen]: "assets/img/chesspieces/black queen.svg",
    [FENChar.BlackKing]: "assets/img/chesspieces/black king.svg"
}

export type SafeSquares = Map<string, Coords[]>;

export enum MoveType {
    Capture,
    Castling,
    Promotion,
    Check,
    CheckMate,
    BasicMove
}

export type LastMove = {
    piece: Piece;
    prevX: number;
    prevY: number;
    currX: number;
    currY: number;
    moveType: Set<MoveType>;
}

type KingChecked = {
    isInCheck: true;
    x: number;
    y: number;
}

type KingNotChecked = {
    isInCheck: false;
}

export type CheckState = KingChecked | KingNotChecked;

export type MoveList = ([string, string?])[];

export type GameHistory = {
    lastMove: LastMove | undefined;
    checkState: CheckState;
    board: (FENChar | null)[][];
}[];

export const columns = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

