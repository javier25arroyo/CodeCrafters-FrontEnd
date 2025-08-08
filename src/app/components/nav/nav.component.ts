import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [NgIf, RouterLink]
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  showProfileLink = false; // ← nueva
  authService: AuthService = inject(AuthService);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.updateUi();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateUi());
  }

  private updateUi(): void {
    this.isLoggedIn = this.authService.check();
    const isCaregiver = this.authService.hasRole('ROLE_CAREGIVER');
    this.showProfileLink =
      this.isLoggedIn &&
      !isCaregiver && 
      !this.router.url.startsWith('/user-profile');
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  goHome(): void {
    if (this.authService.hasRole('ROLE_CAREGIVER')) {
      this.router.navigateByUrl('/caregiver-dashboard');
    } else if (
      this.authService.hasRole('ROLE_ADMIN') ||
      this.authService.hasRole('ROLE_SUPER_ADMIN')
    ) {
      this.router.navigateByUrl('/dashboard-admin');
    } else {
      this.router.navigateByUrl('/dashboard-user');
    }
  }
}
