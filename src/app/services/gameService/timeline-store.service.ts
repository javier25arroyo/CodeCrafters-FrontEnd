import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface Snapshot {
  roomId:string; phase:'LOBBY'|'RUNNING'|'FINISHED';
  timeline:{id:string;title:string;year:number}[];
  turnOrder:string[]; currentPlayerId:string|null;
  players:{userId:string;name:string;hand:{id:string;title:string;year:number}[]}[];
}
@Injectable({ providedIn: 'root' })
export class TimelineStore {
  private state$ = new BehaviorSubject<Snapshot|null>(null);
  get snapshot$(){ return this.state$.asObservable(); }
  get snapshot(){ return this.state$.value; }
  setState(s:Snapshot){ this.state$.next(s); }
}
