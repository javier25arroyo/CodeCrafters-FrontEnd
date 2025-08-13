import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Card { id: string; title: string; year: number; }
export interface Player {
  userId: string; name: string;
  hand: Card[];
}
export interface Snapshot {
  roomId: string;
  phase: 'LOBBY'|'RUNNING'|'FINISHED';
  timeline: Card[];
  turnOrder: string[];
  currentPlayerId: string | null;
  players: Player[];

  paused: boolean;
  turnDurationMs: number;
  gameDurationMs: number;
  turnDeadlineEpochMs: number;
  gameDeadlineEpochMs: number;
  winnerId?: string | null;
}

export interface ChatMessage { userId: string; text: string; ts: number; emoji?: string; }

@Injectable({ providedIn: 'root' })
export class TimelineStore {
  private state$ = new BehaviorSubject<Snapshot | null>(null);

  get snapshot$() { return this.state$.asObservable(); }
  get snapshot()  { return this.state$.value; }

  setState(s: Snapshot) { this.state$.next(s); }
}
