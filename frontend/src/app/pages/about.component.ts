import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, AboutMe } from '../services/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" *ngIf="aboutInfo">
      <section style="max-width: 900px; margin: 0 auto;">
        
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 60px;">
          <span class="badge badge-primary" style="margin-bottom: 12px;">Hakkımda Detaylı Bilgi</span>
          <h1 style="margin-bottom: 16px;">Göktuğ Efe Madran</h1>
          <p style="font-size: 1.2rem; color: var(--primary);">{{ aboutInfo.profession }}</p>
        </div>

        <!-- Bio Grid -->
        <div class="grid-2" style="margin-bottom: 80px; align-items: start;">
          <div class="flex-center" style="flex-direction: column;">
            <div class="photo-glow-wrapper" style="margin-bottom: 30px;">
              <div class="avatar-fallback" *ngIf="!aboutInfo.photo">
                {{ getInitials(aboutInfo.name_surname) }}
              </div>
              <img *ngIf="aboutInfo.photo" [src]="aboutInfo.photo" alt="Profile Photo" class="profile-img">
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center;">
              <a *ngIf="aboutInfo.linkedin_url" [href]="aboutInfo.linkedin_url" target="_blank" class="social-link">LinkedIn Profilim</a>
              <a *ngIf="aboutInfo.github_url" [href]="aboutInfo.github_url" target="_blank" class="social-link">GitHub Profilim</a>
            </div>
          </div>

          <div>
            <h2 style="margin-bottom: 24px;">Ben Kimim?</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px;">
              {{ aboutInfo.bio_paragraph }}
            </p>

            <div class="glass-panel" style="padding: 24px;">
              <h3 style="margin-bottom: 16px; font-size: 1.2rem; color: var(--primary);">Kişisel Kart</h3>
              <ul style="list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; color: var(--text-muted);">
                <li><strong>Yaş:</strong> {{ aboutInfo.age }}</li>
                <li><strong>Şehir:</strong> {{ aboutInfo.city }}</li>
                <li style="grid-column: span 2;"><strong>Eğitim:</strong> {{ aboutInfo.school }}</li>
                <li style="grid-column: span 2;"><strong>LinkedIn:</strong> <a [href]="aboutInfo.linkedin_url" target="_blank" style="color: var(--primary);">linkedin.com</a></li>
                <li style="grid-column: span 2;"><strong>Github:</strong> <a [href]="aboutInfo.github_url" target="_blank" style="color: var(--primary);">github.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Academic & Professional Timeline -->
        <h2 style="margin-bottom: 40px; text-align: center;">Eğitim & Kariyer Yolculuğu</h2>
        <div class="timeline-container">
          
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="glass-card timeline-card">
              <span class="badge badge-primary">Eğitim (Şu Anda)</span>
              <h3 style="margin: 8px 0 12px 0; font-size: 1.2rem;">Konak Kavram Meslek Yüksekokulu</h3>
              <p style="font-weight: 500; color: var(--text-main); margin-bottom: 8px;">Siber Güvenlik Teknolojileri Programı</p>
              <p style="font-size: 0.95rem;">
                Ağ güvenliği, sızma testleri, siber olaylara müdahale ve kriptoloji alanlarında pratik ve teorik eğitimler. Laboratuvar ortamlarında uygulamalı zafiyet analizleri gerçekleştirme.
              </p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="glass-card timeline-card">
              <span class="badge">Uzmanlık & Geliştirme</span>
              <h3 style="margin: 8px 0 12px 0; font-size: 1.2rem;">Full-Stack Web Geliştirme</h3>
              <p style="font-weight: 500; color: var(--text-main); margin-bottom: 8px;">Angular, Django REST & PostgreSQL</p>
              <p style="font-size: 0.95rem;">
                Güvenli yazılım geliştirme prensiplerine (OWASP) sadık kalarak, modern, hızlı ve yüksek performanslı tek sayfalık web uygulamaları (SPA) ve backend servisleri tasarlama.
              </p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="glass-card timeline-card">
              <span class="badge">Araştırmalar</span>
              <h3 style="margin: 8px 0 12px 0; font-size: 1.2rem;">Siber Tehdit Avcılığı</h3>
              <p style="font-weight: 500; color: var(--text-main); margin-bottom: 8px;">Ağ Analitiği & Kriptoloji</p>
              <p style="font-size: 0.95rem;">
                Wireshark, Nmap, Metasploit gibi siber güvenlik araçlarının kullanımı, ağ zafiyetlerinin giderilmesi ve sıfır bilgi kanıtı gibi yenilikçi kriptolojik mekanizmaların incelenmesi.
              </p>
            </div>
          </div>

        </div>

      </section>
    </div>
  `,
  styles: [`
    .profile-img {
      width: 280px;
      height: 280px;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid var(--border-glass);
    }
    .avatar-fallback {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--bg-surface) 0%, hsl(222, 24%, 20%) 100%);
      border: 3px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
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
    .social-link {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-glass);
      padding: 12px 24px;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }
    .social-link:hover {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: var(--primary);
      color: var(--text-main);
    }
    
    /* Timeline styles */
    .timeline-container {
      position: relative;
      padding-left: 32px;
      border-left: 2px solid var(--border-glass);
      margin: 40px 0;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .timeline-item {
      position: relative;
    }
    .timeline-dot {
      position: absolute;
      left: -41px;
      top: 24px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--primary);
      box-shadow: 0 0 10px var(--primary);
    }
    .timeline-card {
      transition: transform var(--transition-smooth);
    }
    .timeline-card:hover {
      transform: translateX(10px);
    }
  `]
})
export class AboutComponent implements OnInit {
  public aboutInfo: AboutMe | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAboutMe().subscribe({
      next: (res) => this.aboutInfo = res,
      error: (err) => console.error("About me fetch error:", err)
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
