import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TimelineStore, Snapshot } from '../../../../services/gameService/timeline-store.service';
import { TimelineSocketService } from '../../../../services/gameService/timeline-socket.service';
import { TimelineApiService } from '../../../../services/gameService/timeline-api.service';

@Component({
  standalone: true,
  selector: 'app-timeline-board',
  imports: [CommonModule, FormsModule],
  templateUrl: './timeline-board.component.html',
  styleUrls: ['./timeline-board.component.scss']
})
export class TimelineBoardComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  flash = '';
  turnMsLeft = 0;
  gameMsLeft = 0;
  private tId?: any;
  private timeoutSent = false;

  lastPlayed = -1;
  effectClass = '';

  constructor(
    public store: TimelineStore,
    private sock: TimelineSocketService,
    private api: TimelineApiService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.sock.events().subscribe(ev => {
        if (!ev) return;

        if (ev.type === 'PLAY_RESULT') {
          const { correct, state, played } = ev.payload;
          this.store.setState(state);

          this.lastPlayed  = (played?.position ?? -1);
          this.effectClass = correct ? 'pulse-success' : 'pulse-error';
          setTimeout(() => { this.lastPlayed = -1; this.effectClass = ''; }, 900);

          this.flash = correct ? '✔️ Correcto' : '✖️ Incorrecto';
          setTimeout(() => (this.flash = ''), 1200);

          this.syncTimers(state);
          return;
        }

        if (['JOINED','STATE','STARTED','PAUSED','RESUMED'].includes(ev.type)) {
          const s = ev.payload?.state ?? ev.payload;
          if (s) { this.store.setState(s); this.syncTimers(s); }
        }
      })
    );

    const rid = this.store.snapshot?.roomId || sessionStorage.getItem('timeline_room') || '';
    if (rid) {
      this.sock.connect(rid);
      this.api.getState(rid).subscribe(s => { this.store.setState(s); this.syncTimers(s); });
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    clearInterval(this.tId);
  }

  play(cardId: string, position: number) {
    this.sock.sendAction({ type: 'PLAY_CARD', cardId, position });
  }

  private syncTimers(s: Snapshot){
    const now = Date.now();
    this.turnMsLeft = s.turnDeadlineEpochMs ? Math.max(0, s.turnDeadlineEpochMs - now) : s.turnDurationMs;
    this.gameMsLeft = s.gameDeadlineEpochMs ? Math.max(0, s.gameDeadlineEpochMs - now) : s.gameDurationMs;
    this.timeoutSent = false;

    clearInterval(this.tId);
    if (!s.paused && s.phase === 'RUNNING') {
      this.tId = setInterval(() => {
        this.turnMsLeft = Math.max(0, this.turnMsLeft - 1000);
        this.gameMsLeft = Math.max(0, this.gameMsLeft - 1000);

        if (this.turnMsLeft === 0 && !this.timeoutSent) {
          this.timeoutSent = true;
          this.sock.sendAction({ type: 'TIMEOUT' });
        }
      }, 1000);
    }
  }

  winnerName(s: Snapshot): string {
    const p = s.players?.find(x => x.userId === s.winnerId);
    return p?.name || s.winnerId || '—';
  }


  msToClock(ms: number): string {
    const t = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  getCardClasses(index: number): Record<string, boolean> {
    const classes: Record<string, boolean> = { seed: index === 0 };
    if (index === this.lastPlayed && this.effectClass) classes[this.effectClass] = true;
    return classes;
  }

  gameBarClass(): string {
    const min = this.gameMsLeft / 60000;
    if (min > 10) return 'g-green';
    if (min > 5)  return 'g-orange';
    return 'g-red';
  }
}
