import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFeedBackMessage, IFeedbackStatus } from '../../interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,               
  imports: [CommonModule, FormsModule],  
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string = '';
  feedback: IFeedBackMessage = { type: IFeedbackStatus.default, message: '' };
  loading = false;

  constructor(private http: HttpClient) {}

  sendResetLink() {
    if (!this.email) {
      this.feedback = {
        type: IFeedbackStatus.error,
        message: 'Please enter your email',
      };
      return;
    }

    this.loading = true;
    this.http.post('/api/auth/forgot-password', { email: this.email }).subscribe({
      next: (res: any) => {
        this.feedback = {
          type: IFeedbackStatus.success,
          message: 'If this email exists, a reset link has been sent.',
        };
        this.loading = false;
      },
      error: (err) => {
        this.feedback = {
          type: IFeedbackStatus.error,
          message: err?.error?.message || 'Something went wrong',
        };
        this.loading = false;
      },
    });
  }
}
