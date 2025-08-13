import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Snapshot } from './timeline-store.service';

@Injectable({ providedIn: 'root' })
export class TimelineApiService {
  private base = `${environment.apiUrl}/api/timeline`;

  constructor(private http: HttpClient) {}

  createRoom(): Observable<{roomId:string}> {
    return this.http.post<{roomId:string}>(`${this.base}/rooms`, {});
  }
  joinRoom(roomId: string): Observable<{ok:boolean}> {
    return this.http.post<{ok:boolean}>(`${this.base}/rooms/${roomId}/join`, {});
  }
  getState(roomId: string): Observable<Snapshot> {
    return this.http.get<Snapshot>(`${this.base}/rooms/${roomId}/state`);
  }
}
