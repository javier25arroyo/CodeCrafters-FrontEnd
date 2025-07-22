import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-suggestions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-suggestions.component.html',
  styleUrls: ['./admin-suggestions.component.scss']
})
export class AdminSuggestionsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  suggestions: any[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    console.log('AdminSuggestionsComponent cargado');
    this.getSuggestions();
  }

  getSuggestions(): void {
    console.log('📡 Enviando solicitud GET a /api/suggestions');

    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = (payload.exp * 1000) < Date.now();

        if (!isExpired) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('⚠️ Token expirado. No se incluirá en la solicitud.');
        }
      } catch (e) {
        console.warn('⚠️ Token mal formado. No se incluirá en la solicitud.');
      }
    }

    this.http.get<any[]>('http://localhost:8080/api/suggestions', { headers }).subscribe({
      next: (res) => {
        console.log('Sugerencias recibidas:', res);
        this.suggestions = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar sugerencias:', err);
        this.error = 'Error al cargar sugerencias.';
        this.loading = false;
      }
    });
  }

  actualizarEstado(id: number, status: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No estás autenticado.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const body = { status };

    console.log(`🔄 Enviando PUT a /api/suggestions/${id}/status con body:`, body);

    this.http.put(`http://localhost:8080/api/suggestions/${id}/status`, body, { headers }).subscribe({
      next: () => {
        console.log(`✅ Estado actualizado para sugerencia ${id}`);
        this.getSuggestions();
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        alert('Error al actualizar el estado');
      }
    });
  }
}
