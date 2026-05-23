import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <div style="padding: 60px 0 100px 0; text-align: center; border-bottom: 1px solid var(--border-color); background: radial-gradient(circle at top, rgba(88, 166, 255, 0.1) 0%, transparent 60%); margin-top: -60px;">
      <div class="container">
        <h1 style="font-size: 3.5rem; margin-bottom: 24px; color: #ffffff;">
          Dijital Dünyanın <br>
          <span style="color: var(--primary);">Savunma Hattına</span> Hoş Geldiniz.
        </h1>
        <p style="font-size: 1.2rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 40px auto; line-height: 1.8;">
          Siber güvenlik, ağ sistemleri, zafiyet analizleri ve yazılım geliştirme üzerine kişisel notlar, araştırmalar ve projeler.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center;">
          <a routerLink="/kategori/teknik-bilgi" class="btn btn-primary" style="padding: 14px 28px; font-size: 1.1rem;">Teknik Notları Oku</a>
          <a routerLink="/hakkimda" class="btn btn-outline" style="padding: 14px 28px; font-size: 1.1rem;">Ben Kimim?</a>
        </div>
      </div>
    </div>

    <!-- Features / Highlights -->
    <div class="container" style="margin-top: 60px;">
      <h2 style="text-align: center; margin-bottom: 40px;">Neler Bulabilirsiniz?</h2>
      <div class="grid-3">
        
        <div class="glass-card" style="text-align: center; padding: 40px 24px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(88, 166, 255, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <h3 style="margin-bottom: 16px;">Siber Güvenlik</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Zafiyet yönetimi, sızma testleri ve savunma mimarileri üzerine araştırmalarım.</p>
        </div>

        <div class="glass-card" style="text-align: center; padding: 40px 24px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(46, 160, 67, 0.1); color: var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 style="margin-bottom: 16px;">Projeler</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Python, C++ ve donanım bileşenleri ile geliştirdiğim güvenlik projeleri.</p>
        </div>

        <div class="glass-card" style="text-align: center; padding: 40px 24px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(139, 148, 158, 0.1); color: var(--text-main); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h3 style="margin-bottom: 16px;">Gündelik</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Okuduğum kitaplar, hobilerim ve teknik olmayan düşüncelerim.</p>
        </div>

      </div>
    </div>
  `
})
export class HomeComponent {}
