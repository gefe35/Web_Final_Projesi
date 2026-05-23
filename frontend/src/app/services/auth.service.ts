import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/token/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}


  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap({
        next: (res: any) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.isLoggedInSubject.next(true);
        },
        error: (err) => {
          console.error('AuthService login hatası:', err);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedInSubject.next(false);
  }

  hasToken(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
        return !!localStorage.getItem('access_token');
    }
    return false;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('access_token');
    }
    return null;
  }
}
