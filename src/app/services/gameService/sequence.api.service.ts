import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base-service';
import { IScore, IResponse, GameTypeEnum, LevelEnum } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SequenceStats {
  playerId: string;
  totalGames: number;
  averageScore: number;
  gamesPerDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

@Injectable({ providedIn: 'root' })
export class SequenceApiService extends BaseService<IScore> {
  protected override source: string = 'games';
  private readonly apiUrl = environment.apiUrl;
  private readonly sequenceApiUrl = `${environment.apiUrl}/sequence`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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

  getSequencePlayerStats(playerId: string): Observable<SequenceStats> {
    return this.http.get<SequenceStats>(`${this.sequenceApiUrl}/stats/${playerId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  buildScore(level: LevelEnum, score: number): IScore {
    return {
      gameType: GameTypeEnum.NUMBER_SEQUENCE,
      level,
      movements: 0,      
      time: 0,           
      score: Number(score) || 0,
      date: new Date()
    };
  }

  private handleError(error: any) {
    console.error('Error en SequenceApiService:', error);
    let errorMessage = 'Ocurrió un error desconocido';
    if (error?.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error?.status}\nMensaje: ${error?.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
