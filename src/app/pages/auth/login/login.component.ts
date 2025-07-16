import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GoogleButtonComponent } from '../../../components/google-button/google-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginError!: string;
  public passwordFieldType: string = 'password';
  public googleLoginError!: string;

  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  public togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => {
          // Usa hasRole para verificar si el usuario es admin o superAdmin
          if (
            this.authService.hasRole('ADMIN') ||
            this.authService.isSuperAdmin()
          ) {
            this.router.navigateByUrl('/dashboard-admin');
          } else {
            this.router.navigateByUrl('/dashboard-user');
          }
        },
        error: (err: any) => (this.loginError = err.error.description),
      });
    }
  }

  public onGoogleLoginSuccess(response: any) {
    if (this.authService.hasRole('ADMIN') || this.authService.isSuperAdmin()) {
      this.router.navigateByUrl('/dashboard-admin');
    } else {
      this.router.navigateByUrl('/dashboard-user');
    }
  }

  public onGoogleLoginError(error: string) {
    this.googleLoginError = error;
  }
}
