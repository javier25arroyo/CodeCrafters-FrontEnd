import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

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
export class PuzzleApiService {
  private readonly apiUrl = `${environment.apiUrl}/puzzle`;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Enviar datos de la partida al backend
  submitGameData(gameData: PuzzleGameData): Observable<PuzzleGameResponse> {
    return this.http.post<PuzzleGameResponse>(
      `${this.apiUrl}/submit-game`, 
      gameData, 
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener estadísticas del jugador
  getPlayerStats(playerId: string): Observable<PuzzleStats> {
    return this.http.get<PuzzleStats>(
      `${this.apiUrl}/stats/${playerId}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener ranking de mejores jugadores
  getLeaderboard(difficulty?: string, limit: number = 10): Observable<any[]> {
    let url = `${this.apiUrl}/leaderboard?limit=${limit}`;
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
    
    return this.http.get<any[]>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Iniciar una nueva partida
  startGame(playerId: string, difficulty: string, imageUrl: string): Observable<PuzzleGameResponse> {
    const gameStartData = {
      playerId,
      difficulty,
      imageUrl,
      startTime: new Date()
    };

    return this.http.post<PuzzleGameResponse>(
      `${this.apiUrl}/start-game`,
      gameStartData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar progreso de la partida
  updateGameProgress(gameId: string, moveCount: number, timeElapsed: number): Observable<PuzzleGameResponse> {
    const progressData = {
      gameId,
      moveCount,
      timeElapsed,
      timestamp: new Date()
    };

    return this.http.patch<PuzzleGameResponse>(
      `${this.apiUrl}/update-progress`,
      progressData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Finalizar partida
  completeGame(gameId: string, completed: boolean, finalMoveCount: number, totalTime: number): Observable<PuzzleGameResponse> {
    const completionData = {
      gameId,
      completed,
      moveCount: finalMoveCount,
      timeElapsed: totalTime,
      endTime: new Date()
    };

    return this.http.patch<PuzzleGameResponse>(
      `${this.apiUrl}/complete-game`,
      completionData,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en PuzzleApiService:', error);
    
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}