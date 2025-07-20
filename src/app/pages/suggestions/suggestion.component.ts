import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent {
  message = '';
  infoMsg = '';

  constructor(private http: HttpClient) {}

  submit() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('DEBUG userData:', userData);

    // Solo permitir si tiene el roleId === 1 (USER)
    if (!userData.id || !userData.role || userData.role.id !== 1) {
      this.infoMsg = 'Debes estar logueado como usuario para enviar sugerencias.';
      return;
    }

    this.http.post('http://localhost:8080/api/suggestions', {
      userId: userData.id,
      message: this.message
    }).subscribe({
      next: () => {
        this.infoMsg = '¡Gracias por tu sugerencia!';
        this.message = '';
      },
      error: () => {
        this.infoMsg = 'Ocurrió un error al enviar tu sugerencia.';
      }
    });
  }
}
