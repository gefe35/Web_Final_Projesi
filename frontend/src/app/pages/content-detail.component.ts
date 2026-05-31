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
        <h3 style="font-family: var(--font);">İçerik bulunamadı</h3>
        <p>Aradığın yazı kaldırılmış olabilir.</p>
        <a routerLink="/" class="btn btn-ghost btn-sm">Ana sayfaya dön</a>
      </div>

      <article *ngIf="!loading && item">
        <a [routerLink]="backLink" style="font-weight: 600; font-size: .9rem;">← {{ sectionLabel }}</a>

        <header style="margin: 18px 0 26px;">
          <span class="tag" [style.color]="color" [style.background]="bg">
            <span class="tag-dot"></span>{{ item.category_name }}
          </span>
          <h1 style="margin: 16px 0 12px;">{{ item.title }}</h1>
          <p class="muted" style="margin: 0;">{{ item.created_at | date: 'd MMMM yyyy' }}</p>
        </header>

        <img *ngIf="item.image" [src]="item.image" [alt]="item.title"
             style="width: 100%; border-radius: var(--radius); margin-bottom: 30px; box-shadow: var(--shadow-sm);" />

        <p *ngIf="item.summary" class="lead" style="border-left: 3px solid {{ color }}; padding-left: 18px; margin-bottom: 30px;">
          {{ item.summary }}
        </p>

        <div class="prose" [innerHTML]="html"></div>

        <div *ngIf="item.external_link" style="margin-top: 36px;">
          <a [href]="item.external_link" target="_blank" rel="noopener" class="btn btn-accent">İlgili Bağlantıyı Aç ↗</a>
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

  get sectionLabel(): string {
    return SECTIONS.find((s) => s.key === this.item?.category_section)?.label || 'Geri';
  }
  get backLink(): string {
    const sec = SECTIONS.find((s) => s.key === this.item?.category_section);
    return sec ? '/' + sec.route : '/';
  }

  hexA(hex: string, a: number): string {
    const h = hex.replace('#', '');
    return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${a})`;
  }
}
