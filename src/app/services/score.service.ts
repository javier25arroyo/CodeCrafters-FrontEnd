import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IScore, IResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ScoreService extends BaseService<IScore> {
  protected override source: string = 'games';

  saveScore(scoreData: IScore): Observable<IResponse<IScore>> {
    return this.addCustomSource('score', scoreData);
  }
}