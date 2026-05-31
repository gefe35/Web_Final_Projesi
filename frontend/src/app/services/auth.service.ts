import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/token/';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        this.store('access_token', res.access);
        this.store('refresh_token', res.refresh);
        this.store('username', credentials.username);
        this.loggedIn$.next(true);
      })
    );
  }

  logout(): void {
    ['access_token', 'refresh_token', 'username'].forEach((k) => this.remove(k));
    this.loggedIn$.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  hasToken(): boolean {
    return !!this.read('access_token');
  }

  getUsername(): string {
    return this.read('username') || 'Yönetici';
  }

  getToken(): string | null {
    return this.read('access_token');
  }

  private store(k: string, v: string) { if (this.canUse()) localStorage.setItem(k, v); }
  private read(k: string): string | null { return this.canUse() ? localStorage.getItem(k) : null; }
  private remove(k: string) { if (this.canUse()) localStorage.removeItem(k); }
  private canUse(): boolean { return typeof window !== 'undefined' && !!window.localStorage; }
}
