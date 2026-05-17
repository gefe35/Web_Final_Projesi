import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, AboutMe, ContentItem } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="container" *ngIf="aboutInfo">
      <!-- Hero Intro Section -->
      <section class="hero-section flex-center" style="flex-direction: column; text-align: center; margin-bottom: 80px; padding: 40px 0;">
        <h1 class="text-gradient" style="margin-bottom: 20px;">Merhaba, Ben {{ aboutInfo.name_surname }}</h1>
        <p style="font-size: 1.4rem; max-width: 800px; line-height: 1.6; margin-bottom: 40px;">
          {{ aboutInfo.profession }} | <strong>{{ aboutInfo.school }}</strong> öğrencisi.
        </p>
        <div style="display: flex; gap: 16px;">
          <a routerLink="/hakkimda" class="btn btn-primary">Hakkımda Detaylı Bilgi</a>
          <a routerLink="/blog" class="btn btn-secondary">Blogumu Keşfet</a>
        </div>
      </section>

      <!-- Glass Profile Card -->
      <section style="margin-bottom: 80px;">
        <div class="glass-card grid-2" style="align-items: center; padding: 48px;">
          <!-- Profile Pic with Cyber Accent -->
          <div class="profile-pic-container flex-center">
            <div class="photo-glow-wrapper">
              <div class="avatar-fallback" *ngIf="!aboutInfo.photo">
                {{ getInitials(aboutInfo.name_surname) }}
              </div>
              <img *ngIf="aboutInfo.photo" [src]="aboutInfo.photo" alt="Profile Photo" class="profile-img">
            </div>
          </div>
          <!-- Quick Bio Info -->
          <div>
            <span class="badge badge-primary" style="margin-bottom: 16px;">Hızlı Profil</span>
            <h2 style="margin-bottom: 20px;">Siber Güvenlik & Yazılım</h2>
            <p style="margin-bottom: 24px; font-size: 1.1rem; line-height: 1.7;">
              {{ aboutInfo.bio_paragraph }}
            </p>
            <div class="quick-facts" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px;">
              <div>
                <strong style="color: var(--primary);">Yaş:</strong> <span style="color: var(--text-muted);">{{ aboutInfo.age }}</span>
              </div>
              <div>
                <strong style="color: var(--primary);">Yaşadığım Şehir:</strong> <span style="color: var(--text-muted);">{{ aboutInfo.city }}</span>
              </div>
              <div style="grid-column: span 2;">
                <strong style="color: var(--primary);">Eğitim / Meslek:</strong> <span style="color: var(--text-muted);">{{ aboutInfo.school }}</span>
              </div>
            </div>
            <div style="display: flex; gap: 16px;">
              <a *ngIf="aboutInfo.linkedin_url" [href]="aboutInfo.linkedin_url" target="_blank" class="social-link flex-center">LinkedIn</a>
              <a *ngIf="aboutInfo.github_url" [href]="aboutInfo.github_url" target="_blank" class="social-link flex-center">Github</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Content (Blog Preview) -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 8px;">Son Paylaşımlar</span>
            <h2>Neler Yazdım?</h2>
          </div>
          <a routerLink="/blog" style="color: var(--primary); font-weight: 500;" class="hover-underline">Tüm Yazılar →</a>
        </div>

        <div class="grid-3" *ngIf="recentItems.length > 0; else noContent">
          <div class="glass-card flex-between" *ngFor="let item of recentItems" style="flex-direction: column; align-items: flex-start; height: 100%;">
            <div style="width: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span class="badge">{{ item.category_name }}</span>
                <span style="font-size: 0.8rem; color: var(--text-dim);">{{ item.created_at | date:'dd.MM.yyyy' }}</span>
              </div>
              <h3 style="margin-bottom: 12px; line-height: 1.3;" class="card-title">{{ item.title }}</h3>
              <p style="font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                {{ item.summary }}
              </p>
            </div>
            <a [routerLink]="['/blog', item.slug]" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem; width: 100%; text-align: center;">Okumaya Başla</a>
          </div>
        </div>
        <ng-template #noContent>
          <div class="glass-panel flex-center" style="padding: 60px; text-align: center; width: 100%;">
            <p>Henüz içerik eklenmemiş.</p>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .profile-img {
      width: 250px;
      height: 250px;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid var(--border-glass);
      transition: transform var(--transition-smooth);
    }
    .avatar-fallback {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--bg-surface) 0%, hsl(222, 24%, 20%) 100%);
      border: 3px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      color: var(--primary);
    }
    .photo-glow-wrapper {
      position: relative;
      border-radius: 50%;
      padding: 6px;
      background: linear-gradient(135deg, var(--primary) 0%, transparent 100%);
      box-shadow: var(--shadow-glow);
    }
    .photo-glow-wrapper:hover .profile-img {
      transform: scale(1.05);
    }
    .social-link {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-glass);
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-muted);
    }
    .social-link:hover {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: var(--primary);
      color: var(--text-main);
    }
    .card-title {
      transition: color var(--transition-fast);
    }
    .glass-card:hover .card-title {
      color: var(--primary);
    }
    .hover-underline:hover {
      text-decoration: underline;
    }
    .flex-between {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class HomeComponent implements OnInit {
  public aboutInfo: AboutMe | null = null;
  public recentItems: ContentItem[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAboutMe().subscribe({
      next: (res) => this.aboutInfo = res,
      error: (err) => console.error("About me fetch error:", err)
    });

    this.api.getItems().subscribe({
      next: (res) => this.recentItems = res.slice(0, 3), // Get top 3 recent items
      error: (err) => console.error("Items fetch error:", err)
    });
  }

  public getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}
