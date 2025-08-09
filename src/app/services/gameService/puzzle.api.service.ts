
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base-service';
import { IScore, IResponse, GameTypeEnum, LevelEnum } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

// Interfaces para el juego de rompecabezas
export interface PuzzleGameData {
  playerId: string;
  gameId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  moveCount: number;
  timeElapsed: number; // en segundos
  completed: boolean;
  imageUsed: string;
  startTime: Date;
  endTime?: Date;
}

export interface PuzzleGameResponse {
  success: boolean;
  message: string;
  gameId?: string;
  data?: any;
}

export interface PuzzleStats {
  playerId: string;
  totalGames: number;
  completedGames: number;
  averageMoves: number;
  bestTime: number;
  favoritedifficulty: string;
  gamesPerDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PuzzleApiService extends BaseService<IScore> {
  protected override source: string = 'games';
  private readonly puzzleApiUrl = `${environment.apiUrl}/puzzle`;
  private readonly apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private snackBar: MatSnackBar) {
    super();
  }


  saveScore(scoreData: IScore): Observable<IResponse<IScore>> {
    return this.addCustomSource('score', scoreData);
  }

  getLeaderboardByGameType(gameType: GameTypeEnum, limit: number = 10): Observable<IScore[]> {
    return this.http.get<IScore[]>(`${this.apiUrl}/leaderboard/${gameType}?limit=${limit}`);
  }

  submitPuzzleGameData(gameData: PuzzleGameData): Observable<PuzzleGameResponse> {
    return this.http.post<PuzzleGameResponse>(
      `${this.puzzleApiUrl}/submit-game`,
      gameData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getPuzzlePlayerStats(playerId: string): Observable<PuzzleStats> {
    return this.http.get<PuzzleStats>(
      `${this.puzzleApiUrl}/stats/${playerId}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getPuzzleLeaderboard(difficulty?: string, limit: number = 10): Observable<any[]> {
    let url = `${this.puzzleApiUrl}/leaderboard?limit=${limit}`;
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    return this.http.get<any[]>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  startPuzzleGame(playerId: string, difficulty: string, imageUrl: string): Observable<PuzzleGameResponse> {
    const gameStartData = {
      playerId,
      difficulty,
      imageUrl,
      startTime: new Date()
    };

    return this.http.post<PuzzleGameResponse>(
      `${this.puzzleApiUrl}/start-game`,
      gameStartData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  updatePuzzleGameProgress(gameId: string, moveCount: number, timeElapsed: number): Observable<PuzzleGameResponse> {
    const progressData = {
      gameId,
      moveCount,
      timeElapsed,
      timestamp: new Date()
    };

    return this.http.patch<PuzzleGameResponse>(
      `${this.puzzleApiUrl}/update-progress`,
      progressData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  completePuzzleGame(gameId: string, completed: boolean, finalMoveCount: number, totalTime: number): Observable<PuzzleGameResponse> {
    const completionData = {
      gameId,
      completed,
      moveCount: finalMoveCount,
      timeElapsed: totalTime,
      endTime: new Date()
    };

    return this.http.patch<PuzzleGameResponse>(
      `${this.puzzleApiUrl}/complete-game`,
      completionData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en PuzzleApiService:', error);

    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}
Mensaje: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  convertPuzzleDataToScore(puzzleData: PuzzleGameData): IScore {
    const difficulty = puzzleData.difficulty.toUpperCase() as keyof typeof LevelEnum;

    return {
      gameType: GameTypeEnum.PUZZLE,
      level: LevelEnum[difficulty],
      movements: puzzleData.moveCount,
      time: puzzleData.timeElapsed,
      score: this.calculateScore(puzzleData.moveCount, puzzleData.timeElapsed, LevelEnum[difficulty]),
      date: puzzleData.endTime || new Date()
    };
  }

  private calculateScore(movements: number, time: number, level: LevelEnum): number {
    let basePoints = 0;
    switch (level) {
      case LevelEnum.EASY:
        basePoints = 1000;
        break;
      case LevelEnum.MEDIUM:
        basePoints = 2000;
        break;
      case LevelEnum.HARD:
        basePoints = 3000;
        break;
    }

    const movementPenalty = movements * 5;
    const timePenalty = time * 2;

    return Math.max(100, basePoints - movementPenalty - timePenalty);
  }
}
