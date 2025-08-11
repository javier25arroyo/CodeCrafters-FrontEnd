import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LevelEnum } from '../../interfaces';

export interface ScorePayload {
  gameType: 'CROSSWORD';
  level: LevelEnum;   
  movements: number; 
  time: number;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class GameScoreService {
  private base = 'games/score';
  constructor(private http: HttpClient) {}
  saveScore(payload: ScorePayload): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }
}
