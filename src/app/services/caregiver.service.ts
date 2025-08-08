import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, IUserCaregiver } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CaregiverService {
  private base = 'caregivers';

  constructor(private http: HttpClient) {}

  getDashboard(email: string): Observable<IUserCaregiver[]> {
    return this.http.get<IUserCaregiver[]>(
      `${this.base}dashboard?email=${encodeURIComponent(email)}`
    );
  }

    getAssignedUsers(caregiverId: number, filter?: string): Observable<IUserCaregiver[]> {
    let params = new HttpParams();
    if (filter) params = params.set('filter', filter);
    return this.http.get<IUserCaregiver[]>(
      `${this.base}/${caregiverId}users`,
      { params }
    );
  }

  getUserByEmail(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.get<IUser>('caregivers/search', { params });
  }
}
