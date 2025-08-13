import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimelineApiService } from '../../../../services/gameService/timeline-api.service';
import { TimelineSocketService, GameEvent } from '../../../../services/gameService/timeline-socket.service';
import { TimelineStore } from '../../../../services/gameService/timeline-store.service';

@Component({
  standalone: true,
  selector: 'app-timeline-lobby',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './timeline-lobby.component.html',
  styleUrls: ['./timeline-lobby.component.scss']
})
export class TimelineLobbyComponent implements OnInit, OnDestroy {
  roomId = '';
  toast = '';
  showRules = false;
  step = 0;
  subs: Subscription[] = [];

  openTutorial(){ this.showRules = true; this.step = 0; }
  prevStep(){ if (this.step>0) this.step--; }
  nextStep(){ if (this.step<2) this.step++; else this.showRules = false; }

  constructor(
    private api: TimelineApiService,
    private sock: TimelineSocketService,
    public  store: TimelineStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(p => {
      const rid = p.get('room');
      if (rid) this.roomId = rid;
    });

    this.subs.push(
      this.sock.events().subscribe((ev: GameEvent | null) => {
        if (!ev) return;
        if (ev.type === 'JOINED' || ev.type === 'STATE' || ev.type === 'STARTED') {
          const s = ev.payload?.state ?? ev.payload;
          this.store.setState(s);
          if (ev.type === 'STARTED') {
            this.router.navigate(['/timeline-dashboard']);
          }
        }
      })
    );
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  createRoom() {
    this.api.createRoom().subscribe(({ roomId }) => {
      this.roomId = roomId;
      this.sock.connect(roomId);
      this.api.joinRoom(roomId).subscribe();
      this.toastOnce('Sala creada');
    });
  }

  joinRoom() {
    if (!this.roomId) return;
    this.sock.connect(this.roomId);
    this.api.joinRoom(this.roomId).subscribe(() => this.toastOnce('Unido a la sala'));
  }

  startGame() { this.sock.sendAction({ type: 'START' }); }

  copyRoomCode() {
    const id = this.store.snapshot?.roomId || this.roomId;
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => this.toastOnce('Código copiado'));
  }

  private toastOnce(msg: string) { this.toast = msg; setTimeout(() => (this.toast = ''), 1200); }
}
