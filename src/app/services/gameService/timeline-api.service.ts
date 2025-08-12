import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TimelineApiService {
  constructor(private http: HttpClient) {}
  createRoom(){ return this.http.post<{roomId:string}>('/api/timeline/rooms', {}); }
  joinRoom(roomId: string){ return this.http.post('/api/timeline/rooms/'+roomId+'/join', {}); }
}
