import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../interfaces';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  private currentUser: IUser | null = null;
  private userListSignal = signal<IUser[]>([]);
  get users$() {
    return this.userListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ?? 0 },
          (_, i) => i + 1
        );
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }


  
  getMyProfile(): Observable<IUser> {
  return this.http.get<IUser>(`${this.source}/me`);
}

toggleEnabled(userId: number) {
  return this.http.patch(`${this.source}/${userId}/toggle-enabled`, {});
}
setCurrentUser(user: IUser) {
    this.currentUser = user;
  }

  getCurrentUserRole(): string {
    return this.currentUser?.role?.name || '';
  }

  loadCurrentUser() {
    this.getMyProfile().subscribe({
      next: (user) => this.setCurrentUser(user),
      error: (err) => console.error('Error loading current user', err),
    });
  }


}
