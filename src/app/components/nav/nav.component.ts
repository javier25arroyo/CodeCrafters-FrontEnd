import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [NgIf, RouterLink]
})
export class NavComponent implements OnInit {
  isLoggedIn = false;

  // 👇 Cambio aquí: public en vez de private
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
    const user = localStorage.getItem('auth_user');
    this.isLoggedIn = !!user;
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
