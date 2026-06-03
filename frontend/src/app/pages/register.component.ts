import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="display: grid; place-items: center; min-height: 62vh;">
      <div class="card card-pad-lg" style="width: 100%; max-width: 420px;">
        <div class="center" style="margin-bottom: 28px;">
          <span class="brand-mark" style="margin: 0 auto 14px; width: 48px; height: 48px; font-size: 1.3rem;">K</span>
          <h2 style="font-size: 1.7rem; margin-bottom: 6px;">Kayıt Ol</h2>
          <p class="muted" style="margin: 0; font-size: .92rem;">Sisteme yeni bir kullanıcı hesabı oluşturun.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label class="label">Kullanıcı Adı <span class="req">*</span></label>
            <input type="text" formControlName="username" class="input" placeholder="Kullanıcı adınız" />
          </div>
          <div class="field">
            <label class="label">E-posta <span class="req">*</span></label>
            <input type="email" formControlName="email" class="input" placeholder="ornek@email.com" />
          </div>
          <div class="field">
            <label class="label">Şifre <span class="req">*</span></label>
            <input type="password" formControlName="password" class="input" placeholder="••••••••" />
          </div>
          <div class="field">
            <label class="label">Şifre Tekrar <span class="req">*</span></label>
            <input type="password" formControlName="passwordConfirm" class="input" placeholder="••••••••" />
          </div>

          <div *ngIf="error" class="alert alert-err">{{ error }}</div>
          <div *ngIf="successMsg" class="alert alert-ok">{{ successMsg }}</div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Kayıt yapılıyor…' : 'Kayıt Ol' }}
          </button>
        </form>

        <p class="center" style="margin: 22px 0 0;">
          <a routerLink="/login" style="font-size: .9rem;">Zaten hesabınız var mı? Giriş Yapın</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  successMsg = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      this.error = 'Şifreler eşleşmiyor.';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.successMsg = '';
    this.cdr.detectChanges();

    const data = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.api.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Kayıt sırasında bir hata oluştu. Kullanıcı adı alınmış olabilir veya şifre kurallara uymuyor.';
        this.cdr.detectChanges();
      },
    });
  }
}
