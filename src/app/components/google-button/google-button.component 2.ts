import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-google-button',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './google-button.component.html',
  styleUrls: ['./google-button.component.scss']
})
export class GoogleButtonComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<any>();
  @Output() loginError = new EventEmitter<string>();

  private authService = inject(AuthService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if (user && user.provider === 'GOOGLE') {
        this.handleGoogleLogin(user);
      }
    });
  }

  private handleGoogleLogin(user: SocialUser): void {
    if (user.idToken) {
      this.authService.loginWithGoogle(user.idToken).subscribe({
        next: (loginResponse) => {
          this.loginSuccess.emit(loginResponse);
          if (this.authService.hasRole('ADMIN') || this.authService.isSuperAdmin()) {
            this.router.navigateByUrl('/dashboard-admin');
          } else {
            this.router.navigateByUrl('/dashboard-user');
          }
        },
        error: (error) => {
          console.error('Google login error:', error);
          this.loginError.emit('Error signing in with Google');
        }
      });
    } else {
      this.loginError.emit('No Google token received');
    }
  }
}