import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

interface Suggestion {
  id: number;
  message: string;
  status: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  private readonly ENDPOINT = `${environment.apiUrl}/suggestions`;

  constructor(private http: HttpClient) {}

  /**
   * Genera los headers de autorización con el token almacenado
   */
  private getAuthHeaders(): HttpHeaders {
    const rawToken = localStorage.getItem('access_token');
    const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * Envía una sugerencia por parte del usuario autenticado
   */
  submitSuggestion(userId: number, message: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.ENDPOINT,
      { userId, message },
      { headers, withCredentials: true }
    );
  }

  /**
   * Obtiene todas las sugerencias (requiere autorización)
   */
  getSuggestions(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.ENDPOINT, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /**
   * Actualiza el estado de una sugerencia específica
   */
  updateStatus(id: number, newStatus: string): Observable<any> {
    return this.http.put(
      `${this.ENDPOINT}/${id}/status`,
      { status: newStatus },
      {
        headers: this.getAuthHeaders(),
        withCredentials: true
      }
    );
  }
}
