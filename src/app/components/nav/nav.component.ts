import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  isLoggedIn = false;

  constructor(private router: Router) {
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
  }
}
