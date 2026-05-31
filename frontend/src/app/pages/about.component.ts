import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AboutMe } from '../services/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="max-width: 920px;">
      <div *ngIf="loading" class="state"><div class="spinner"></div></div>

      <div *ngIf="!loading && about">
        <header class="center" style="margin-bottom: 48px;">
          <span class="eyebrow">Hakkımda</span>
          <h1 style="margin: 12px 0 8px;">{{ about.name_surname }}</h1>
          <p class="lead" style="color: var(--primary-strong); font-weight: 500;">{{ about.profession }}</p>
        </header>

        <div class="hero-grid" style="align-items: start; margin-bottom: 48px;">
          <div style="order: 2;">
            <h2 style="font-size: 1.7rem; margin-bottom: 16px;">Ben Kimim?</h2>
            <p style="white-space: pre-line; font-size: 1.08rem; line-height: 1.85;">{{ about.bio_paragraph }}</p>

            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;">
              <a *ngIf="about.linkedin_url" [href]="about.linkedin_url" target="_blank" rel="noopener" class="btn btn-primary btn-sm">LinkedIn</a>
              <a *ngIf="about.github_url" [href]="about.github_url" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">GitHub</a>
            </div>
          </div>

          <div style="order: 1;">
            <div class="avatar-frame" style="margin-bottom: 24px;">
              <span class="blob"></span>
              <img *ngIf="about.photo" [src]="about.photo" [alt]="about.name_surname" class="avatar-photo" />
              <div *ngIf="!about.photo" class="avatar-fallback">{{ initials }}</div>
            </div>
          </div>
        </div>

        <div class="card card-pad-lg">
          <h3 style="font-family: var(--font); font-size: 1.2rem; margin-bottom: 20px;">Kişisel Kart</h3>
          <div class="grid grid-2" style="gap: 16px 32px;">
            <div class="info-row"><span class="muted">Yaş</span><strong>{{ about.age }}</strong></div>
            <div class="info-row"><span class="muted">Yaşadığım Şehir</span><strong>{{ about.city }}</strong></div>
            <div class="info-row"><span class="muted">Meslek</span><strong>{{ about.profession }}</strong></div>
            <div class="info-row"><span class="muted">Okul</span><strong>{{ about.school }}</strong></div>
            <div class="info-row" *ngIf="about.linkedin_url">
              <span class="muted">LinkedIn</span>
              <a [href]="about.linkedin_url" target="_blank" rel="noopener">{{ shortUrl(about.linkedin_url) }}</a>
            </div>
            <div class="info-row" *ngIf="about.github_url">
              <span class="muted">GitHub</span>
              <a [href]="about.github_url" target="_blank" rel="noopener">{{ shortUrl(about.github_url) }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-row { display: flex; flex-direction: column; gap: 2px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
    .info-row span { font-size: .82rem; }
  `],
})
export class AboutComponent implements OnInit {
  about?: AboutMe;
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAboutMe().subscribe({
      next: (a) => { this.about = a; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  get initials(): string {
    const n = this.about?.name_surname || '';
    return n.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }

  shortUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}
