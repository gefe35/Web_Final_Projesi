import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, AboutMe, ContentItem, SECTIONS } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero -->
    <section class="container hero">
      <div class="hero-grid">
        <div>
          <span class="eyebrow">Merhaba, ben {{ about?.name_surname || 'Göktuğ Efe' }} 👋</span>
          <h1>
            Öğrendiklerimi <span class="hl">paylaştığım</span><br />
            kişisel köşem.
          </h1>
          <p class="lead">
            {{ about?.profession || 'Siber Güvenlik & Full-Stack Geliştirici' }}.
            Siber güvenlik, yazılım, araştırmalar, hobiler ve okuduğum kitaplar üzerine
            notlar tutuyor; öğrendiklerimi burada herkesle paylaşıyorum.
          </p>
          <div class="hero-cta">
            <a routerLink="/teknik-bilgi" class="btn btn-primary">Teknik Yazıları Oku</a>
            <a routerLink="/hakkimda" class="btn btn-ghost">Ben Kimim?</a>
          </div>
        </div>

        <div class="avatar-frame">
          <span class="blob"></span>
          <img *ngIf="about?.photo" [src]="about?.photo" [alt]="about?.name_surname" class="avatar-photo" />
          <div *ngIf="!about?.photo" class="avatar-fallback">{{ initials }}</div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="container" style="padding: 0 0 56px;">
      <div style="display: flex; gap: 0; flex-wrap: wrap; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface);">
        <div *ngFor="let stat of stats; let last = last" style="flex: 1; min-width: 160px; padding: 24px 28px; text-align: center;"
             [style.border-right]="last ? 'none' : '1px solid var(--border)'">
          <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--ink);">{{ stat.value }}</div>
          <div style="font-size: .85rem; color: var(--muted); margin-top: 4px;">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Topics -->
    <section class="container section" style="padding-top: 0;">
      <div style="text-align: center; margin-bottom: 40px;">
        <span class="eyebrow">Ne paylaşıyorum?</span>
        <h2 style="margin-top: 10px;">Keşfedebileceğin başlıklar</h2>
      </div>
      <div class="grid grid-3">
        <a *ngFor="let s of sections" [routerLink]="'/' + s.route" class="card card-hover topic-card"
           style="border-top: 3px solid {{ s.color }};">
          <span class="topic-ico" [style.background]="hexA(s.color, 0.14)" [style.color]="s.color">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </span>
          <h3>{{ s.label }}</h3>
          <p style="margin: 0; font-size: .93rem;">{{ s.blurb }}</p>
          <span [style.color]="s.color" style="margin-top: 8px; font-weight: 600; font-size: .9rem;">İncele →</span>
        </a>
      </div>
    </section>

    <!-- Latest -->
    <section class="container section" style="background: var(--bg-tint); border-radius: var(--radius); padding: 40px 36px;" *ngIf="latest.length">
      <div style="display: flex; align-items: end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="eyebrow">Son eklenenler</span>
          <h2 style="margin-top: 10px;">En yeni yazılar</h2>
        </div>
      </div>
      <div class="grid grid-3">
        <a *ngFor="let item of latest" [routerLink]="['/icerik', item.slug]" class="card card-hover article-card">
          <div class="article-thumb" *ngIf="item.image"><img [src]="item.image" [alt]="item.title" /></div>
          <div class="article-thumb-ph" *ngIf="!item.image"
               [style.background]="sectionColor(item.category_section)">{{ item.category_name }}</div>
          <div class="article-body">
            <span class="tag" [style.color]="sectionColor(item.category_section)" [style.background]="hexA(sectionColor(item.category_section), 0.12)">
              <span class="tag-dot"></span>{{ item.category_name }}
            </span>
            <h3 style="margin-top: 12px;">{{ item.title }}</h3>
            <p style="font-size: .94rem;">{{ item.summary }}</p>
            <div class="article-meta">
              <span>{{ item.created_at | date: 'd MMMM yyyy' }}</span>
              <span style="color: var(--primary-strong); font-weight: 600;">Oku →</span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- Bize Ulaşın -->
    <section class="container section" id="contact-section">
      <div style="text-align: center; margin-bottom: 48px;">
        <span class="eyebrow">İletişim</span>
        <h2 style="margin-top: 10px;">Bize Ulaşın</h2>
        <p class="lead" style="max-width: 560px; margin: 12px auto 0;">
          Bir soru, öneri veya iş birliği teklifiniz mi var? Formu doldurun, en kısa sürede size dönüş yapayım.
        </p>
      </div>

      <div class="contact-layout">
        <!-- Contact Info Cards -->
        <div class="contact-info-col">
          <div class="contact-info-card">
            <div class="contact-info-ico" style="background: rgba(15,157,142,.12); color: var(--primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h4 class="contact-info-title">E-posta</h4>
              <p class="contact-info-text">goktug&#64;example.com</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-info-ico" style="background: rgba(244,132,95,.12); color: var(--accent);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h4 class="contact-info-title">Konum</h4>
              <p class="contact-info-text">{{ about?.city || 'İzmir' }}, Türkiye</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-info-ico" style="background: rgba(124,108,240,.12); color: #7c6cf0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </div>
            <div>
              <h4 class="contact-info-title">LinkedIn</h4>
              <a *ngIf="about?.linkedin_url" [href]="about?.linkedin_url" target="_blank" rel="noopener"
                 class="contact-info-link">Profili Görüntüle →</a>
              <p *ngIf="!about?.linkedin_url" class="contact-info-text">linkedin.com</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-info-ico" style="background: rgba(217,154,28,.12); color: var(--sun);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            <div>
              <h4 class="contact-info-title">GitHub</h4>
              <a *ngIf="about?.github_url" [href]="about?.github_url" target="_blank" rel="noopener"
                 class="contact-info-link">Profili Görüntüle →</a>
              <p *ngIf="!about?.github_url" class="contact-info-text">github.com</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-col">
          <form *ngIf="!contactSent" class="card contact-form-card" (ngSubmit)="submitContact()" #contactForm="ngForm">
            <div class="contact-form-row">
              <div class="field" style="flex: 1;">
                <label class="label" for="contact-name">Ad Soyad <span class="req">*</span></label>
                <input class="input" id="contact-name" name="contactName" [(ngModel)]="contactData.name" required placeholder="Adınız Soyadınız" />
              </div>
              <div class="field" style="flex: 1;">
                <label class="label" for="contact-email">E-posta <span class="req">*</span></label>
                <input class="input" id="contact-email" name="contactEmail" [(ngModel)]="contactData.email" required type="email" placeholder="ornek@mail.com" />
              </div>
            </div>

            <div class="field">
              <label class="label" for="contact-subject">Konu <span class="req">*</span></label>
              <input class="input" id="contact-subject" name="contactSubject" [(ngModel)]="contactData.subject" required placeholder="Mesajınızın konusu" />
            </div>

            <div class="field">
              <label class="label" for="contact-message">Mesaj <span class="req">*</span></label>
              <textarea class="textarea" id="contact-message" name="contactMessage" [(ngModel)]="contactData.message" required
                        placeholder="Mesajınızı buraya yazabilirsiniz..." rows="5"></textarea>
            </div>

            <div *ngIf="contactError" class="alert alert-err">{{ contactError }}</div>

            <button type="submit" class="btn btn-primary btn-block" [disabled]="contactSending || !contactForm.valid" style="margin-top: 4px;">
              <svg *ngIf="!contactSending" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              <span *ngIf="contactSending" class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></span>
              {{ contactSending ? 'Gönderiliyor...' : 'Mesajı Gönder' }}
            </button>
          </form>

          <!-- Success State -->
          <div *ngIf="contactSent" class="card contact-success-card">
            <div class="contact-success-ico">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 8px;">Mesajınız İletildi!</h3>
            <p style="color: var(--ink-soft); margin-bottom: 24px;">Teşekkürler! En kısa sürede size geri dönüş yapacağım.</p>
            <button class="btn btn-ghost" (click)="resetContact()">Yeni Mesaj Gönder</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 36px;
      align-items: start;
    }

    .contact-info-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .contact-info-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 22px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .contact-info-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow);
    }

    .contact-info-ico {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 14px;
      display: grid;
      place-items: center;
    }

    .contact-info-title {
      font-family: var(--font);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 2px;
    }
    .contact-info-text {
      font-size: 0.88rem;
      color: var(--muted);
      margin: 0;
    }
    .contact-info-link {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--primary-strong);
    }
    .contact-info-link:hover { color: var(--primary); }

    .contact-form-card {
      padding: 36px;
    }

    .contact-form-row {
      display: flex;
      gap: 18px;
    }

    .contact-success-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 64px 36px;
      animation: fadeUp .4s ease both;
    }

    .contact-success-ico {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--primary-soft);
      color: var(--primary);
      display: grid;
      place-items: center;
      margin-bottom: 20px;
      animation: scaleIn .5s ease both;
    }

    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 900px) {
      .contact-layout {
        grid-template-columns: 1fr;
      }
      .contact-info-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
    }
    @media (max-width: 560px) {
      .contact-info-col {
        grid-template-columns: 1fr;
      }
      .contact-form-row {
        flex-direction: column;
        gap: 0;
      }
      .contact-form-card {
        padding: 24px;
      }
    }
  `],
})
export class HomeComponent implements OnInit {
  about?: AboutMe;
  latest: ContentItem[] = [];
  sections = SECTIONS;
  stats: { value: string; label: string }[] = [];

  // Contact form state
  contactData = { name: '', email: '', subject: '', message: '' };
  contactSending = false;
  contactSent = false;
  contactError = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAboutMe().subscribe({ next: (a) => { this.about = a; this.buildStats(a); }, error: () => {} });
    this.api.getItems().subscribe({
      next: (items) => (this.latest = (items || []).slice(0, 3)),
      error: () => {},
    });
  }

  buildStats(a: AboutMe): void {
    this.stats = [
      { value: '5', label: 'İçerik Bölümü' },
      { value: a.city || 'İzmir', label: 'Yaşadığım Şehir' },
      { value: a.profession?.split(' ')[0] || 'Siber', label: 'Uzmanlık Alanı' },
      { value: new Date().getFullYear() - 2021 + '+', label: 'Yıl Deneyim' },
    ];
  }

  get initials(): string {
    const n = this.about?.name_surname || 'Göktuğ Efe';
    return n.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }

  sectionColor(key?: string): string {
    return SECTIONS.find((s) => s.key === key)?.color || '#0f9d8e';
  }

  hexA(hex: string, a: number): string {
    const h = hex.replace('#', '');
    return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${a})`;
  }

  submitContact(): void {
    this.contactSending = true;
    this.contactError = '';
    this.api.sendContactMessage(this.contactData).subscribe({
      next: () => {
        this.contactSending = false;
        this.contactSent = true;
      },
      error: (err) => {
        this.contactSending = false;
        this.contactError = 'Mesaj gönderilemedi. Lütfen tekrar deneyin.';
      },
    });
  }

  resetContact(): void {
    this.contactSent = false;
    this.contactData = { name: '', email: '', subject: '', message: '' };
    this.contactError = '';
  }
}
