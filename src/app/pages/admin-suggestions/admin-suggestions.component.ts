import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Suggestion {
  id: number;
  message: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-admin-suggestions',
  standalone: true,
  templateUrl: './admin-suggestions.component.html',
  styleUrls: ['./admin-suggestions.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AdminSuggestionsComponent implements OnInit {
  suggestions: Suggestion[] = [];
  error = '';
  estadoActualizado: { [id: number]: boolean } = {};  // ✅ Para mostrar confirmación por fila

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSuggestions();
  }

  fetchSuggestions(): void {
    this.http.get<Suggestion[]>('suggestions', { withCredentials: true }).subscribe({
      next: (data) => this.suggestions = data,
      error: () => this.error = 'Error al cargar sugerencias'
    });
  }

  actualizarEstado(id: number, newStatus: string): void {
    this.http.put(`suggestions/${id}/status`, { status: newStatus }, { withCredentials: true }).subscribe({
      next: () => {
        this.estadoActualizado[id] = true;
        setTimeout(() => this.estadoActualizado[id] = false, 3000);
      },
      error: () => console.error('Error al actualizar el estado')
    });
  }
}
