import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, AboutMe, ContentItem, SECTIONS } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          <img *ngIf="about?.photo" [src]="about?.photo" alt="{{ about?.name_surname }}" class="avatar-photo" />
          <div *ngIf="!about?.photo" class="avatar-fallback">{{ initials }}</div>
        </div>
      </div>
    </section>

    <!-- Topics -->
    <section class="container section">
      <div class="center" style="margin-bottom: 44px;">
        <span class="eyebrow">Ne paylaşıyorum?</span>
        <h2 style="margin-top: 10px;">Keşfedebileceğin başlıklar</h2>
      </div>
      <div class="grid grid-3">
        <a *ngFor="let s of sections" [routerLink]="'/' + s.route" class="card card-hover topic-card">
          <span class="topic-ico" [style.background]="hexA(s.color, 0.14)" [style.color]="s.color">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </span>
          <h3>{{ s.label }}</h3>
          <p style="margin: 0;">{{ s.blurb }}</p>
          <span style="margin-top: 6px; font-weight: 600; color: var(--primary-strong); font-size: .9rem;">İncele →</span>
        </a>
      </div>
    </section>

    <!-- Latest -->
    <section class="container section" *ngIf="latest.length">
      <div style="display: flex; align-items: end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="eyebrow">Son eklenenler</span>
          <h2 style="margin-top: 10px;">En yeni yazılar</h2>
        </div>
      </div>
      <div class="grid grid-3">
        <a *ngFor="let item of latest" [routerLink]="['/icerik', item.slug]" class="card card-hover article-card">
          <div class="article-thumb" *ngIf="item.image"><img [src]="item.image" [alt]="item.title" /></div>
          <div class="article-thumb-ph" *ngIf="!item.image" [style.background]="sectionColor(item.category_section)">
            {{ item.category_name }}
          </div>
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
  `,
})
export class HomeComponent implements OnInit {
  about?: AboutMe;
  latest: ContentItem[] = [];
  sections = SECTIONS;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAboutMe().subscribe({ next: (a) => (this.about = a), error: () => {} });
    this.api.getItems().subscribe({
      next: (items) => (this.latest = (items || []).slice(0, 3)),
      error: () => {},
    });
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
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
