import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

@Injectable({
  providedIn: 'root'
})
export class MusicMemoryService {
  private currentDifficulty: DifficultyLevel = DifficultyLevel.EASY;

  constructor(private http: HttpClient) {}

  setDifficulty(difficulty: DifficultyLevel) {
    this.currentDifficulty = difficulty;
  }

  submitScore(scoreIncrement: number) {
    const levelMapping = {
      easy: 'EASY',
      medium: 'MEDIUM',
      hard: 'HARD'
    };

    const scoreData = {
  gameType: 'MUSIC_MEMORY',
  level: levelMapping[this.currentDifficulty as keyof typeof levelMapping],
  score: scoreIncrement,
  movements: 0,
  time: 0
};

    return this.http.post('games/score/music-melody', scoreData);
  }
}
