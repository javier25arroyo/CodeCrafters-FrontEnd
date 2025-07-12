import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  public passwordFieldType: string = 'password';

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public user: IUser = {};

  constructor(private router: Router, 
    private authService: AuthService
  ) {}

  public togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.nameModel.valid && this.emailModel.valid && this.passwordModel.valid) {
      this.authService.signup(this.user).subscribe({
        next: () => this.validSignup = true,
        error: (err: any) => (this.signUpError = err.description),
      });
    }
  }
}
