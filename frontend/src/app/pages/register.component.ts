import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container flex-center" style="min-height: 60vh;">
      <div class="glass-card" style="width: 100%; max-width: 450px; padding: 40px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 2.5rem; color: var(--primary); display: block; margin-bottom: 8px;">🚀</span>
          <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Kayıt Ol</h2>
          <p style="font-size: 0.95rem; color: var(--text-dim);">Aramıza katılmak için hemen hesabını oluştur.</p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="error-alert" style="margin-bottom: 24px; padding: 12px 16px; background-color: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); border-radius: var(--radius-sm); color: var(--error); font-size: 0.9rem;">
          {{ errorMessage }}
        </div>

        <!-- Success Alert -->
        <div *ngIf="successMessage" class="info-alert" style="margin-bottom: 24px; padding: 16px; background-color: rgba(142, 235, 172, 0.1); border: 1px solid var(--success); border-radius: var(--radius-sm); color: var(--success); font-size: 0.9rem; text-align: center;">
          {{ successMessage }}
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
          
          <div class="form-group">
            <label class="form-label" for="username">Kullanıcı Adı</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="userData.username" 
              class="form-control" 
              placeholder="Kullanıcı adınız" 
              required>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">E-Posta (İsteğe bağlı)</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="userData.email" 
              class="form-control" 
              placeholder="ornek@posta.com">
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Şifre</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="userData.password" 
              class="form-control" 
              placeholder="••••••••" 
              required>
          </div>

          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label" for="password_confirm">Şifre Onayı</label>
            <input 
              type="password" 
              id="password_confirm" 
              name="password_confirm" 
              [(ngModel)]="userData.password_confirm" 
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
            {{ isSubmitting ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur' }}
          </button>

          <!-- Back to login link -->
          <div style="margin-top: 24px; text-align: center; font-size: 0.85rem;">
            <span style="color: var(--text-dim);">Zaten bir hesabın var mı? </span>
            <a routerLink="/login" class="form-link" style="color: var(--primary); font-weight: 500; transition: color var(--transition-fast);">
              Giriş Yap
            </a>
          </div>

        </form>

        <div *ngIf="successMessage" style="text-align: center; margin-top: 24px;">
           <button routerLink="/login" class="btn btn-primary" style="width: 100%;">Giriş Yap'a Dön</button>
        </div>

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
export class RegisterComponent {
  public userData = { username: '', email: '', password: '', password_confirm: '' };
  public errorMessage = '';
  public successMessage = '';
  public isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  public onSubmit(): void {
    if (!this.userData.username || !this.userData.password || !this.userData.password_confirm) {
      this.errorMessage = 'Lütfen tüm zorunlu alanları doldurun.';
      return;
    }

    if (this.userData.password !== this.userData.password_confirm) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return;
    }

    if (this.userData.password.length < 8) {
      this.errorMessage = 'Şifre en az 8 karakter olmalıdır.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.register(this.userData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.';
      },
      error: (err) => {
        console.error("Registration failed:", err);
        this.isSubmitting = false;
        if (err.status === 400 && err.error) {
           const keys = Object.keys(err.error);
           if (keys.length > 0) {
               // Show the first validation error
               const firstError = err.error[keys[0]];
               this.errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
           } else {
               this.errorMessage = 'Kayıt başarısız oldu. Lütfen girdiğiniz bilgileri kontrol edin.';
           }
        } else {
           this.errorMessage = 'Sunucuyla bağlantı kurulamadı.';
        }
      }
    });
  }
}
