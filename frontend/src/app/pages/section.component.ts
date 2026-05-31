import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService, Category, ContentItem, SECTIONS, SectionDef } from '../services/api.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header style="text-align: center; margin-bottom: 36px;">
        <span class="eyebrow" [style.color]="section?.color">{{ section?.label }}</span>
        <h1 style="margin: 12px 0;">{{ section?.label }}</h1>
        <p class="lead" style="max-width: 620px; margin: 0 auto;">{{ section?.blurb }}</p>
      </header>

      <!-- Kategori filtreleri -->
      <div *ngIf="categories.length" class="seg" style="justify-content: center; margin: 0 auto 36px; display: flex;">
        <button [class.active]="!activeCat" (click)="filter(null)">
          Tümü <span style="opacity: .65; font-size:.8em;">({{ items.length }})</span>
        </button>
        <button *ngFor="let c of categories"
                [class.active]="activeCat === c.slug"
                (click)="filter(c.slug || null)">
          {{ c.name }}
          <span style="opacity: .65; font-size:.8em;">({{ c.item_count || 0 }})</span>
        </button>
      </div>

      <div *ngIf="loading" class="state"><div class="spinner"></div></div>

      <div *ngIf="!loading && filtered.length === 0" class="state card">
        <div class="state-ico">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <h3 style="font-family: var(--font);">Henüz içerik yok</h3>
        <p style="margin: 0;">Bu bölüme yakında yeni yazılar eklenecek.</p>
      </div>

      <div *ngIf="!loading && filtered.length" class="grid grid-3">
        <a *ngFor="let item of filtered" [routerLink]="['/icerik', item.slug]" class="card card-hover article-card">
          <div class="article-thumb" *ngIf="item.image"><img [src]="item.image" [alt]="item.title" /></div>
          <div class="article-thumb-ph" *ngIf="!item.image"
               [style.background]="section?.color" [style.color]="'#fff'">
            {{ item.category_name }}
          </div>
          <div class="article-body">
            <span class="tag" [style.color]="section?.color" [style.background]="catBg">
              <span class="tag-dot"></span>{{ item.category_name }}
            </span>
            <h3 style="margin-top: 12px;">{{ item.title }}</h3>
            <p style="font-size: .94rem;">{{ item.summary }}</p>
            <div class="article-meta">
              <span>{{ item.created_at | date: 'd MMM yyyy' }}</span>
              <span [style.color]="section?.color" style="font-weight: 600;">Oku →</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class SectionComponent implements OnInit {
  section?: SectionDef;
  categories: Category[] = [];
  items: ContentItem[] = [];
  filtered: ContentItem[] = [];
  activeCat: string | null = null;
  loading = true;
  catBg = 'rgba(15,157,142,.12)';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const key = data['section'] as string;
      this.section = SECTIONS.find((s) => s.key === key);
      if (this.section) this.catBg = this.hexA(this.section.color, 0.12);
      this.load(key);
    });
  }

  load(key: string): void {
    this.loading = true;
    this.activeCat = null;
    this.api.getCategories(key).subscribe({ next: (c) => (this.categories = c), error: () => {} });
    this.api.getItems(key).subscribe({
      next: (items) => { this.items = items; this.filtered = items; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  filter(slug: string | null): void {
    this.activeCat = slug;
    this.filtered = slug ? this.items.filter((i) => i.category_slug === slug) : this.items;
  }

  hexA(hex: string, a: number): string {
    const h = hex.replace('#', '');
    return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${a})`;
  }
}
