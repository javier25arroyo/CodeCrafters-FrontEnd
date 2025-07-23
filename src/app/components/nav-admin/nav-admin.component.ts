import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-admin',
  standalone: true,
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.scss'],
  imports: [NgIf, RouterLink]
})
export class NavAdminComponent implements OnInit {
  isLoggedIn = false;
  authService: AuthService = inject(AuthService);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.check();
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  navigateBack() {
    this.router.navigate(['/dashboard-admin']);
  }
}
