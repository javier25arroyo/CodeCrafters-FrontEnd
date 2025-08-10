import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base-service';
import { IScore, IResponse, GameTypeEnum, LevelEnum } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface WordSearchStats {
  playerId: string;
  totalGames: number;
  averageScore: number;
  gamesPerDifficulty: { easy: number; medium: number; hard: number; };
}

@Injectable({ providedIn: 'root' })
export class WordSearchApiService extends BaseService<IScore> {
  protected override source = 'games';
  private readonly apiUrl = environment.apiUrl;
  private readonly wordSearchApiUrl = `${environment.apiUrl}/word-search`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private snackBar: MatSnackBar) { super(); }

 
  saveScore(scoreData: IScore): Observable<IResponse<IScore>> {
    return this.addCustomSource('score', scoreData);
  }

  getWordSearchPlayerStats(playerId: string): Observable<WordSearchStats> {
    return this.http.get<WordSearchStats>(`${this.wordSearchApiUrl}/stats/${playerId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  buildScore(level: LevelEnum, score: number): IScore {
    return {
      gameType: GameTypeEnum.WORD_SEARCH,
      level,
      movements: 0,   
      time: 0,        
      score: Number(score) || 0,
      date: new Date()
    };
  }

  private handleError(error: any) {
    console.error('Error en WordSearchApiService:', error);
    const msg = error?.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Código: ${error?.status}\nMensaje: ${error?.message}`;
    return throwError(() => new Error(msg));
  }
}
