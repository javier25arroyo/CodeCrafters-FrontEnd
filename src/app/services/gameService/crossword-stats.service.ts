import { Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrosswordStatPayload} from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class CrosswordStatsService {
  private base = 'stats/crossword';
  constructor(private http: HttpClient) {}
  post(payload: CrosswordStatPayload): Observable<void> {
    return this.http.post<void>(this.base, payload);
  }
}

