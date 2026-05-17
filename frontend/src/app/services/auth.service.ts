import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api/auth';
  
  // Signal representation of the JWT token
  private readonly accessTokenSignal = signal<string | null>(localStorage.getItem('access_token'));
  
  // Computed signal to track auth state reactively
  public readonly isAuthenticated = computed(() => !!this.accessTokenSignal());

  constructor(private http: HttpClient) {}

  public login(credentials: { username: string; password: string }): Observable<{ access: string; refresh: string }> {
    return this.http.post<{ access: string; refresh: string }>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.accessTokenSignal.set(response.access);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessTokenSignal.set(null);
  }

  public getToken(): string | null {
    return this.accessTokenSignal();
  }
}
