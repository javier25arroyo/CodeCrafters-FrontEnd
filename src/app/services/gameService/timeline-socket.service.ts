import { Injectable, NgZone } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export interface GameEvent { type: string; payload: any; }

@Injectable({ providedIn: 'root' })
export class TimelineSocketService {
  private client?: Client;
  private roomId?: string;
  private events$ = new BehaviorSubject<GameEvent | null>(null);

  constructor(private zone: NgZone, private auth: AuthService) {}

  events(): Observable<GameEvent | null> {
    return this.events$.asObservable();
  }

  isConnected(): boolean {
    return !!this.client && (this.client.connected || this.client.active);
  }

  connect(roomId: string): void {
    this.roomId = roomId;
    sessionStorage.setItem('timeline_room', roomId);

    if (this.isConnected()) return;

    const token = this.auth.getAccessToken() ?? '';
    const url = `${environment.apiUrl}/ws?token=${encodeURIComponent(token)}`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(url) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000
    });

    this.client.onConnect = () => {
      if (!this.roomId) return;

      this.client!.subscribe(`/topic/room.${this.roomId}`, (m: IMessage) => {
        const ev: GameEvent = JSON.parse(m.body);
        this.zone.run(() => this.events$.next(ev));
      });

      this.sendAction({ type: 'JOIN' });
    };

    this.client.onStompError = f =>
      console.error('STOMP error:', f.headers['message']);

    this.client.onWebSocketClose = e =>
      console.warn('WS closed', e.code, e.reason);

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = undefined;
  }

  sendAction(a: any): void {
    if (!this.client || !this.client.connected || !this.roomId) return;
    this.client.publish({
      destination: `/app/room/${this.roomId}/action`,
      body: JSON.stringify(a),
    });
  }
}
