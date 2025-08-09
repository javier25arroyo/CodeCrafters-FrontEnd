import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CrosswordStatPayload {
  puzzleId: string;           
  difficulty: Difficulty;     
  wordsFound: number;
  wordsTotal: number;
  mistakes: number;           
  hints: number;              
  completed: boolean;
  startedAt: string;          
  finishedAt: string;         
}

@Injectable({ providedIn: 'root' })
export class CrosswordStatsService {
  constructor(private http: HttpClient) {}

  post(payload: CrosswordStatPayload): Observable<any> {
    return this.http.post('scores/crossword', payload);
  }

  getLast(gameType = 'CROSSWORD', limit = 3) {
    // lo usaremos en caregiver-stats más abajo
    return this.http.get(`scores/recent?gameType=${gameType}&limit=${limit}`);
  }
}
