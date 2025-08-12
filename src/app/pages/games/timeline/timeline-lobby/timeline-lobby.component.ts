import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimelineApiService } from '../../../../services/gameService/timeline-api.service';
import { TimelineSocketService } from '../../../../services/gameService/timeline-socket.service';
import { TimelineStore } from '../../../../services/gameService/timeline-store.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-timeline-lobby',
  imports: [CommonModule, FormsModule],
  templateUrl: './timeline-lobby.component.html',
  styleUrls: ['./timeline-lobby.component.scss']
})
export class TimelineLobbyComponent implements OnInit, OnDestroy {
  roomId = ''; subs: Subscription[] = [];
  constructor(private api:TimelineApiService, private sock:TimelineSocketService, public store:TimelineStore, private router: Router) {}
  ngOnInit() {
  this.subs.push(this.sock.events().subscribe(ev => {
    if (!ev) return;
    const p = ev.payload?.state ?? ev.payload;
    if (ev.type === 'JOINED' || ev.type === 'STATE' || ev.type === 'STARTED' || ev.type === 'PLAY_RESULT') {
      this.store.setState(p);
    }
    if (ev.type === 'STARTED') {
      this.router.navigate(['timeline-dashboard']);
    }
  }));
}
  ngOnDestroy(){ this.subs.forEach(s=>s.unsubscribe()); this.sock.disconnect(); }

  createRoom(){ this.api.createRoom().subscribe(({roomId})=>{ this.roomId=roomId; this.sock.connect(roomId); this.api.joinRoom(roomId).subscribe(); }); }
  joinRoom(){ if(!this.roomId) return; this.sock.connect(this.roomId); this.api.joinRoom(this.roomId).subscribe(); }
  startGame(){ this.sock.sendAction({ type:'START' }); }
}
