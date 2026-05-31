import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Project } from '../services/api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header style="text-align: center; margin-bottom: 48px;">
        <span class="eyebrow">Projeler</span>
        <h1 style="margin: 12px 0;">Geliştirdiğim Projeler</h1>
        <p class="lead" style="max-width: 580px; margin: 0 auto;">
          Siber güvenlik ve yazılım geliştirme alanlarında oluşturduğum projeler.
        </p>
      </header>

      <div *ngIf="loading" class="state"><div class="spinner"></div></div>

      <div *ngIf="!loading && !projects.length" class="state card">
        <div class="state-ico">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77"/>
          </svg>
        </div>
        <h3 style="font-family: var(--font);">Henüz proje yok</h3>
        <p style="margin: 0;">Projeler yakında eklenecek.</p>
      </div>

      <div *ngIf="!loading && projects.length" class="grid grid-2">
        <div *ngFor="let p of projects" class="card card-hover" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: start; justify-content: space-between; gap: 12px;">
            <div>
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: var(--primary-soft); color: var(--primary-strong); margin-bottom: 12px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </span>
              <h3 style="font-family: var(--font); font-size: 1.15rem; margin: 0 0 8px;">{{ p.name }}</h3>
            </div>
            <a *ngIf="p.github_url" [href]="p.github_url" target="_blank" rel="noopener"
               class="btn btn-ghost btn-sm" style="flex-shrink: 0;">
              GitHub ↗
            </a>
          </div>

          <p style="font-size: .95rem; flex: 1; margin: 0;">{{ p.description }}</p>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span class="tag" style="background: var(--bg-tint); color: var(--ink-soft);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>
              {{ p.language }}
            </span>
            <div style="display: flex; gap: 14px; font-size: .84rem; color: var(--muted);">
              <span>⭐ {{ p.stars }}</span>
              <span>🍴 {{ p.forks }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getProjects().subscribe({
      next: (p) => { this.projects = p; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
}
