import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCaregiver } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CaregiverService {
  private base = 'http://localhost:8080/caregivers';

  constructor(private http: HttpClient) {}

  getDashboard(email: string): Observable<IUserCaregiver[]> {
    return this.http.get<IUserCaregiver[]>(
      `${this.base}/dashboard?email=${encodeURIComponent(email)}`
    );
  }
}
