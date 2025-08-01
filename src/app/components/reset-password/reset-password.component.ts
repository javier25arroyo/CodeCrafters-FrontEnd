import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageResponse } from '../../interfaces';
import { AlertService } from '../../services/alert.service';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private alertService: AlertService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'] || '';
    });
  }

  submit() {
    if (!this.email || !this.newPassword || this.newPassword !== this.confirmPassword) {
      this.alertService.displayAlert('error', 'Por favor, revise sus datos.', 'center', 'top', ['error-snackbar']);
      return;
    }

    this.loading = true;

    const params = new HttpParams()
      .set('email', this.email)
      .set('newPassword', this.newPassword);

    this.http.post<MessageResponse>('auth/reset-password', null, { params }).subscribe({
      next: (res) => {
        this.alertService.displayAlert('success', res.message, 'center', 'top', ['success-snackbar']);
        this.loading = false;

        //  cierra la pestaña luego de 2 segundos 
        setTimeout(() => window.close(), 2000);
      },
      error: (err) => {
        this.alertService.displayAlert('error', err?.error?.message || 'Error al restablecer la contraseña.', 'center', 'top', ['error-snackbar']);
        this.loading = false;
      }
    });
  }
}
