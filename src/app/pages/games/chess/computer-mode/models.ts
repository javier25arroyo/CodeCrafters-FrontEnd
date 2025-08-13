import { Color, FENChar } from "../chess-logic/models";

export type StockfishQueryParams = {
    fen: string;
    depth: number;
}

export type ChessMove = {
    prevX: number;
    prevY: number;
    newX: number;
    newY: number;
    promotedPiece: FENChar | null;
}

export type StockfishResponse = {
    success: boolean;
    evaulatuion: number | null;
    mate: number | null;
    bestmove: string;
    continuation: string;
}

export type ComputerConfiguration = {
    color: Color;
    level: number;
}

export const stockfishLevels: Readonly<Record<number, number>> = {
    1: 10,
    2: 13,
    3: 16
}