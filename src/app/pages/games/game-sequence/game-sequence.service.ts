import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LevelEnum, IResponse, IScore } from '../../../interfaces';
import { SequenceApiService } from '../../../services/gameService/sequence.api.service';
import { environment } from '../../../../environments/environment';

export type Difficulty = 'facil' | 'medio' | 'dificil';

@Injectable({ providedIn: 'root' })
export class GameSequenceService {
  private readonly difficultySubject = new BehaviorSubject<Difficulty>('facil');
  readonly difficulty$ = this.difficultySubject.asObservable();

  private readonly scoreSubject = new BehaviorSubject<number>(0);
  readonly score$ = this.scoreSubject.asObservable();

  constructor(private readonly api: SequenceApiService) {}

  setDifficulty(level: Difficulty): void {
    this.difficultySubject.next(level);
  }

  setScore(score: number): void {
    this.scoreSubject.next(Number(score) || 0);
  }

  addScore(delta: number): void {
    this.setScore(this.scoreSubject.value + Number(delta || 0));
  }

  reset(): void {
    this.setScore(0);
  }

  private mapLevel(d: Difficulty | string): LevelEnum {
    const l = (d || '').toString().toLowerCase();
    if (l === 'facil' || l === 'easy')   return LevelEnum.EASY;
    if (l === 'medio' || l === 'medium') return LevelEnum.MEDIUM;
    if (l === 'dificil' || l === 'hard') return LevelEnum.HARD;
    return LevelEnum.EASY;
  }

  saveFinalScore() {
    const levelEnum = this.mapLevel(this.difficultySubject.value);
    const score = this.scoreSubject.value;
    const payload: IScore = this.api.buildScore(levelEnum, score);

    if (!environment.production) {
      console.log('[GameSequenceService] payload', payload);
    }

    return this.api.saveScore(payload).pipe(
      tap({
        next: (r: IResponse<IScore>) => {
          if (!environment.production) {
            console.log('[GameSequenceService] Puntaje guardado', r);
          }
        },
        error: (e) => {
          if (!environment.production) {
            console.error('[GameSequenceService] Error guardando puntaje', e);
          }
        }
      })
    );
  }
}
