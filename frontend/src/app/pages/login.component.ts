import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container flex-center" style="min-height: 60vh;">
      <div class="glass-card" style="width: 100%; max-width: 450px; padding: 40px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 2.5rem; color: var(--primary); display: block; margin-bottom: 8px;">🔐</span>
          <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Yetkili Girişi</h2>
          <p style="font-size: 0.95rem; color: var(--text-dim);">Sadece içerik ekleme ve güncelleme yetkisine sahip kullanıcı girişi.</p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="error-alert" style="margin-bottom: 24px; padding: 12px 16px; background-color: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); border-radius: var(--radius-sm); color: var(--error); font-size: 0.9rem;">
          {{ errorMessage }}
        </div>

        <!-- Info / Helper Alert -->
        <div *ngIf="infoMessage" class="info-alert" 
             [style.border-color]="infoType === 'warning' ? 'var(--warning)' : 'var(--primary)'" 
             style="margin-bottom: 24px; padding: 16px; background-color: rgba(255, 255, 255, 0.02); border: 1px solid; border-radius: var(--radius-sm); font-size: 0.88rem; line-height: 1.5; color: var(--text-muted); position: relative;">
          <p>{{ infoMessage }}</p>
          <button (click)="clearInfo()" style="position: absolute; top: 6px; right: 10px; background: none; border: none; cursor: pointer; color: var(--text-dim); font-size: 1.2rem;">×</button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label class="form-label" for="username">Kullanıcı Adı</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="credentials.username" 
              class="form-control" 
              placeholder="admin" 
              required>
          </div>

          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label" for="password">Şifre</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="credentials.password" 
              class="form-control" 
              placeholder="••••••••" 
              required>
          </div>

          <button 
            type="submit" 
            [disabled]="isSubmitting" 
            class="btn btn-primary" 
            style="width: 100%; font-weight: 600;">
            <span *ngIf="isSubmitting" class="loader" style="width: 16px; height: 16px; border-width: 2px; margin-right: 8px; display: inline-block; vertical-align: middle;"></span>
            {{ isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
          </button>

          <!-- Forgot Password & Register Buttons -->
          <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
            <a (click)="onForgotPassword($event)" href="#" class="form-link" style="color: var(--text-dim); transition: color var(--transition-fast);">
              Şifremi Unuttum
            </a>
            <a routerLink="/register" class="form-link" style="color: var(--primary); font-weight: 500; transition: color var(--transition-fast);">
              Kayıt Ol
            </a>
          </div>

        </form>

      </div>
    </div>
  `,
  styles: [`
    .error-alert, .info-alert {
      animation: fadeIn 0.3s ease-in-out;
    }
    .error-alert {
      animation: shake 0.3s ease-in-out;
    }
    .form-link:hover {
      color: var(--primary) !important;
      text-decoration: underline;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent {
  public credentials = { username: '', password: '' };
  public errorMessage = '';
  public infoMessage = '';
  public infoType = 'info'; // 'info' or 'warning'
  public isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  public onForgotPassword(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';
    this.infoType = 'warning';
    this.infoMessage = '🔒 Siber güvenlik önlemleri gereği, şifre sıfırlama talepleri dış ağlara kapatılmıştır. Şifrenizi sıfırlamak için lütfen yerel veritabanı yönetim panelini kullanın veya sistem yöneticinizle iletişime geçin.';
  }

  public clearInfo(): void {
    this.infoMessage = '';
  }

  public onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.clearInfo();

    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("Login failed:", err);
        this.isSubmitting = false;
        if (err.status === 401) {
          this.errorMessage = 'Hatalı kullanıcı adı veya şifre!';
        } else {
          this.errorMessage = 'Sunucuyla bağlantı kurulamadı. Lütfen backend sunucunuzun (localhost:8000) çalıştığından emin olun.';
        }
      }
    });
  }
}
