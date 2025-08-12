import { Injectable, NgZone } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';

export interface GameEvent { type:string; payload:any; }

@Injectable({ providedIn: 'root' })
export class TimelineSocketService {
  private client?: Client; private roomId?: string;
  private events$ = new BehaviorSubject<GameEvent|null>(null);

  constructor(private zone: NgZone, private auth: AuthService) {}

  connect(roomId: string) {
    this.roomId = roomId;
    const token = this.auth.getAccessToken() ?? '';
    const url = `${environment.apiUrl}/ws?token=${encodeURIComponent(token)}`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(url) as any,
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      this.client!.subscribe(`/topic/room.${roomId}`, (m:IMessage) => {
        const ev = JSON.parse(m.body);
        this.zone.run(() => this.events$.next(ev));
      });
      this.sendAction({ type: 'JOIN' });
    };

    this.client.activate();
  }

  disconnect(){ this.client?.deactivate(); }
  events(): Observable<GameEvent|null>{ return this.events$.asObservable(); }

  sendAction(a:any){
    if (!this.client || !this.roomId) return;
    this.client.publish({ destination:`/app/room/${this.roomId}/action`, body: JSON.stringify(a) });
  }
}
