import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, AboutMe, ContentItem } from '../services/api.service';
import { GithubService, GithubRepo } from '../services/github.service';
import { CommonModule } from '@angular/common';

interface FeaturedRepo extends GithubRepo {
  customDesc?: string;
}

const CUSTOM_DESCRIPTIONS: Record<string, string> = {
  'VpnApp_Demo-': 'C# ile geliştirilen, temel VPN tünelleme mantığını gösteren demo masaüstü uygulaması.',
  'Otomatikmesajgonderici': 'Python ile yazılmış, belirli aralıklarla otomatik mesaj gönderimini sağlayan otomasyon aracı.',
  'HesapMakinesi': 'Android Studio ortamında Java ile geliştirilen temel dört işlem yapabilen mobil hesap makinesi.',
  'Csharp-Kalp_Yapimi': 'C# konsol uygulaması ile ASCII sanatı kullanılarak çizilen kalp animasyonu.',
  'WebProgramlamaDersi': 'Web Programlama dersi kapsamında hazırlanan; HTML, CSS ve JavaScript örneklerini içeren ders repom.',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="container blog-layout" *ngIf="aboutInfo">
      
      <!-- Main Content Area: Posts -->
      <main class="blog-main-content">
        
        <!-- Featured Post -->
        <ng-container *ngIf="recentItems.length > 0; else noContent">
          <a [routerLink]="['/blog', recentItems[0].slug]" class="featured-post-card" *ngIf="recentItems[0]">
            <img [src]="recentItems[0].image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1080&auto=format&fit=crop'" alt="Featured" class="featured-img">
            <div class="featured-bg"></div>
            <div class="content">
              <span class="badge badge-primary" style="margin-bottom: 12px; position: relative; z-index: 2;">{{ recentItems[0].category_name }}</span>
              <h2>{{ recentItems[0].title }}</h2>
              <p style="color: rgba(255,255,255,0.8); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 1.1rem; max-width: 80%;">
                {{ recentItems[0].summary }}
              </p>
            </div>
          </a>

          <!-- Other Recent Posts List -->
          <div class="recent-posts-list">
            <h3 style="margin-bottom: 24px; font-size: 1.6rem;">Son Yazılar</h3>
            <a [routerLink]="['/blog', item.slug]" class="article-list-card" *ngFor="let item of recentItems.slice(1)">
              <div class="meta">
                <span class="badge" style="background: rgba(255,255,255,0.05);">{{ item.category_name }}</span>
                <span>{{ item.created_at | date:'dd.MM.yyyy' }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
            </a>
            
            <a routerLink="/blog" class="btn btn-secondary" style="width: 100%; margin-top: 16px; justify-content: center;">Tüm Yazıları Gör →</a>
          </div>
        </ng-container>

        <ng-template #noContent>
          <div class="glass-panel flex-center" style="padding: 80px; text-align: center; flex-direction: column;">
            <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 16px;">Henüz bir yazı yayınlanmadı.</p>
          </div>
        </ng-template>

      </main>

      <!-- Sidebar -->
      <aside class="sidebar">

        <!-- Author Profile Widget -->
        <div class="glass-panel sidebar-profile">
          <img *ngIf="aboutInfo.photo" [src]="aboutInfo.photo" alt="Author" class="profile-img">
          <div *ngIf="!aboutInfo.photo" class="profile-img" style="display: flex; align-items: center; justify-content: center; background: var(--bg-surface); font-size: 2rem; font-weight: bold; color: var(--primary);">
            {{ getInitials(aboutInfo.name_surname) }}
          </div>

          <h3>{{ aboutInfo.name_surname }}</h3>
          <p style="color: var(--primary); font-size: 0.9rem; margin-bottom: 16px;">{{ aboutInfo.profession }}</p>
          <p>{{ aboutInfo.bio_paragraph | slice:0:150 }}...</p>

          <div class="social-links">
            <a *ngIf="aboutInfo.linkedin_url" [href]="aboutInfo.linkedin_url" target="_blank" class="btn btn-secondary social-link">LinkedIn</a>
            <a *ngIf="aboutInfo.github_url" [href]="aboutInfo.github_url" target="_blank" class="btn btn-secondary social-link">Github</a>
          </div>

          <a routerLink="/hakkimda" style="display: inline-block; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); text-decoration: underline;">Hakkımda Daha Fazla</a>
        </div>

        <!-- Skills & Tools Widget -->
        <div class="glass-panel" style="padding: 28px;">
          <h4 style="font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 20px;">
            Teknoloji & Araçlar
          </h4>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 10px; font-weight: 500;">Siber Güvenlik</p>
          <div class="skills-tag-cloud" style="margin-bottom: 18px;">
            <span class="skill-badge security">Nmap</span>
            <span class="skill-badge security">Wireshark</span>
            <span class="skill-badge security">Metasploit</span>
            <span class="skill-badge security">Kali Linux</span>
            <span class="skill-badge security">Burp Suite</span>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 10px; font-weight: 500;">Programlama</p>
          <div class="skills-tag-cloud" style="margin-bottom: 18px;">
            <span class="skill-badge language">Python</span>
            <span class="skill-badge language">C#</span>
            <span class="skill-badge language">TypeScript</span>
            <span class="skill-badge language">JavaScript</span>
            <span class="skill-badge language">HTML / CSS</span>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 10px; font-weight: 500;">Framework & Altyapı</p>
          <div class="skills-tag-cloud">
            <span class="skill-badge framework">Angular</span>
            <span class="skill-badge framework">Django REST</span>
            <span class="skill-badge framework">PostgreSQL</span>
            <span class="skill-badge framework">Git</span>
          </div>
        </div>

        <!-- Featured Project Widget -->
        <div class="glass-panel" style="padding: 28px;">
          <h4 style="font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 20px;">
            Öne Çıkan Proje
          </h4>
          <div *ngFor="let repo of featuredRepos" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-glass);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">{{ repo.name }}</span>
              <a [href]="repo.html_url" target="_blank" style="color: var(--primary); font-size: 0.75rem;">GitHub →</a>
            </div>
            <p style="font-size: 0.85rem; margin-bottom: 10px; line-height: 1.5;">{{ repo.customDesc || repo.description || 'Proje açıklaması mevcut değil.' }}</p>
            <div style="display: flex; gap: 10px; align-items: center;">
              <span *ngIf="repo.language" class="skill-badge" style="font-size: 0.72rem;">{{ repo.language }}</span>
              <span style="font-size: 0.75rem; color: var(--text-dim);">⭐ {{ repo.stargazers_count }}</span>
            </div>
          </div>
          <a routerLink="/projeler" class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.88rem;">Tüm Projeleri Gör →</a>
        </div>

      </aside>
      
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  public aboutInfo: AboutMe | null = null;
  public recentItems: ContentItem[] = [];
  public featuredRepos: FeaturedRepo[] = [];

  constructor(private api: ApiService, private github: GithubService) {}

  ngOnInit(): void {
    this.api.getAboutMe().subscribe({
      next: (res) => this.aboutInfo = res,
      error: (err) => console.error("About me fetch error:", err)
    });

    this.api.getItems().subscribe({
      next: (res) => this.recentItems = res.slice(0, 3),
      error: (err) => console.error("Items fetch error:", err)
    });

    this.github.getRepositories().subscribe({
      next: (repos) => {
        this.featuredRepos = repos.slice(0, 3).map(r => ({
          ...r,
          customDesc: CUSTOM_DESCRIPTIONS[r.name]
        }));
      },
      error: () => {}
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
