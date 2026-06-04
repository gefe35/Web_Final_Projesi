import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="display: grid; place-items: center; min-height: 62vh;">
      <div class="card card-pad-lg" style="width: 100%; max-width: 420px;">
        <div class="center" style="margin-bottom: 28px;">
          <span class="brand-mark" style="margin: 0 auto 14px; width: 48px; height: 48px; font-size: 1.3rem;">G</span>
          <h2 style="font-size: 1.7rem; margin-bottom: 6px;">Yönetici Girişi</h2>
          <p class="muted" style="margin: 0; font-size: .92rem;">İçerikleri yönetmek için giriş yapın.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label class="label">Kullanıcı Adı</label>
            <input type="text" formControlName="username" class="input" placeholder="admin" autocomplete="username" />
          </div>
          <div class="field">
            <label class="label">Şifre</label>
            <input type="password" formControlName="password" class="input" placeholder="••••••••" autocomplete="current-password" />
          </div>

          <div *ngIf="error" class="alert alert-err">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Giriş yapılıyor…' : 'Giriş Yap' }}
          </button>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <button type="button" class="btn btn-ghost btn-block" routerLink="/kayit-ol">Kayıt Ol</button>
            <button type="button" class="btn btn-ghost btn-block" (click)="forgotPassword()">Şifremi Unuttum</button>
          </div>
        </form>

        <p class="center" style="margin: 22px 0 0; display: flex; flex-direction: column; gap: 8px;">
          <a routerLink="/" style="font-size: .9rem;">← Siteye dön</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.auth.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/yonetim']),
      error: () => {
        this.isLoading = false;
        this.error = 'Kullanıcı adı veya şifre hatalı.';
        this.cdr.detectChanges();
      },
    });
  }

  forgotPassword(): void {
    alert('Şifre sıfırlama özelliği yakında eklenecektir.');
  }
}
