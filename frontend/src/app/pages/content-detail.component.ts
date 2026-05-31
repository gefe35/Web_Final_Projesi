import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService, ContentItem, SECTIONS } from '../services/api.service';
import { renderMarkdown } from '../utils/markdown';

@Component({
  selector: 'app-content-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="max-width: 800px;">
      <div *ngIf="loading" class="state"><div class="spinner"></div></div>

      <div *ngIf="!loading && !item" class="state card">
        <div class="state-ico">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 style="font-family: var(--font);">İçerik bulunamadı</h3>
        <p>Aradığın yazı kaldırılmış olabilir.</p>
        <a routerLink="/" class="btn btn-ghost btn-sm" style="margin-top: 12px;">Ana sayfaya dön</a>
      </div>

      <article *ngIf="!loading && item">
        <a [routerLink]="backLink" style="font-weight: 600; font-size: .9rem; display: inline-flex; align-items: center; gap: 6px; color: var(--ink-soft); margin-bottom: 20px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          {{ sectionLabel }}
        </a>

        <header style="margin-bottom: 26px;">
          <span class="tag" [style.color]="color" [style.background]="bg">
            <span class="tag-dot"></span>{{ item.category_name }}
          </span>
          <h1 style="margin: 16px 0 10px;">{{ item.title }}</h1>
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <span class="muted" style="font-size: .88rem;">{{ item.created_at | date: 'd MMMM yyyy' }}</span>
            <span class="muted" style="font-size: .88rem;">{{ readTime }} dk okuma</span>
          </div>
        </header>

        <img *ngIf="item.image" [src]="item.image" [alt]="item.title"
             style="width: 100%; border-radius: var(--radius); margin-bottom: 30px; box-shadow: var(--shadow-sm);" />

        <div *ngIf="item.summary" class="lead"
             [style.border-left]="'3px solid ' + color"
             style="padding-left: 18px; margin-bottom: 30px; font-style: italic; color: var(--ink-soft);">
          {{ item.summary }}
        </div>

        <div class="prose" [innerHTML]="html"></div>

        <div *ngIf="item.external_link" style="margin-top: 36px;">
          <a [href]="item.external_link" target="_blank" rel="noopener" class="btn btn-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            İlgili Bağlantıyı Aç
          </a>
        </div>

        <!-- Back to top -->
        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <a [routerLink]="backLink" class="btn btn-ghost btn-sm">← {{ sectionLabel }}'a dön</a>
          <button class="btn btn-ghost btn-sm" (click)="scrollTop()">↑ Başa çık</button>
        </div>
      </article>
    </div>
  `,
})
export class ContentDetailComponent implements OnInit {
  item?: ContentItem;
  html: SafeHtml = '';
  loading = true;
  color = '#0f9d8e';
  bg = 'rgba(15,157,142,.12)';

  constructor(private route: ActivatedRoute, private api: ApiService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => this.load(p.get('slug') || ''));
  }

  load(slug: string): void {
    this.loading = true;
    this.api.getItem(slug).subscribe({
      next: (item) => {
        this.item = item;
        this.html = this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(item.content));
        const sec = SECTIONS.find((s) => s.key === item.category_section);
        if (sec) { this.color = sec.color; this.bg = this.hexA(sec.color, 0.12); }
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get readTime(): number {
    const words = this.item?.content?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  }

  get sectionLabel(): string {
    return SECTIONS.find((s) => s.key === this.item?.category_section)?.label || 'Geri';
  }
  get backLink(): string {
    const sec = SECTIONS.find((s) => s.key === this.item?.category_section);
    return sec ? '/' + sec.route : '/';
  }

  scrollTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  hexA(hex: string, a: number): string {
    const h = hex.replace('#', '');
    return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${a})`;
  }
}
