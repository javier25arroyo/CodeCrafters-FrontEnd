import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageResponse } from '../../interfaces';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  loading = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  submit() {
    if (!this.email || !this.newPassword || this.newPassword !== this.confirmPassword) {
      this.message = 'Please check your inputs.';
      return;
    }

    this.loading = true;

    const params = new HttpParams()
      .set('email', this.email)
      .set('newPassword', this.newPassword);

    this.http.post<MessageResponse>('auth/reset-password', null, { params }).subscribe({
  next: (res) => {
    this.message = res.message;  
    this.loading = false;
  },
  error: (err) => {
    this.message = err?.error?.message || 'Error resetting password.';
    this.loading = false;
  }
    });
  }
}
