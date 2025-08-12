import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface GameScoreStat {
  gameType: string;
  totalScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameScoreService {
  private baseUrl = '/scores/max-scores/user';

  constructor(private http: HttpClient) { }

  getScoresByUserId(userId: number): Observable<GameScoreStat[]> {
    return this.http.get<GameScoreStat[]>(`${this.baseUrl}/${userId}`);
  }
}
