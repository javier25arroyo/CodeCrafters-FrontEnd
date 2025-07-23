import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NavComponent } from '../../components/nav/nav.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavComponent, FooterComponent],
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent {
  suggestionText = '';
  infoMsg = '';
  successMsg = '';
  userId: number | null = null;

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        this.userId = parsed?.id || null;
      } catch {
        this.userId = null;
      }
    }
  }

  submit() {
    if (!this.userId) {
      this.infoMsg = 'Debes estar logueado para enviar sugerencias.';
      this.successMsg = '';
      return;
    }

    if (!this.suggestionText.trim()) {
      this.infoMsg = 'La sugerencia no puede estar vacía.';
      this.successMsg = '';
      return;
    }

    // 🔧 Corregimos el token para eliminar comillas dobles
    const rawToken = localStorage.getItem('access_token');
    const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

    if (!token) {
      this.infoMsg = 'Token de autenticación no encontrado.';
      this.successMsg = '';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      userId: this.userId,
      message: this.suggestionText
    };

    this.http.post('http://localhost:8080/suggestions', body, { headers }).subscribe({
      next: () => {
        this.successMsg = '¡Gracias por tu sugerencia!';
        this.infoMsg = '';
        this.suggestionText = '';
      },
      error: (error) => {
        this.infoMsg = 'Ocurrió un error al enviar tu sugerencia.';
        this.successMsg = '';
        console.error('Error al enviar sugerencia:', error);
      }
    });
  }
}
