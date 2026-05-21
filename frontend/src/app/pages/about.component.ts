import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AboutMe } from '../services/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
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

        <!-- Skills & Proficiency -->
        <h2 style="margin-bottom: 16px; text-align: center; margin-top: 80px;">Yetkinlikler & Araçlar</h2>
        <p style="text-align: center; margin-bottom: 48px; color: var(--text-muted);">Aktif olarak kullandığım teknolojiler ve tahmini yetkinlik düzeylerim.</p>

        <div class="grid-2" style="align-items: start; margin-bottom: 80px;">

          <!-- Security Tools -->
          <div class="glass-panel" style="padding: 32px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 28px; color: var(--primary);">Siber Güvenlik Araçları</h3>
            <div *ngFor="let skill of securitySkills" class="skill-bar-item">
              <div class="skill-bar-meta">
                <span>{{ skill.name }}</span>
                <span>{{ skill.level }}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" [style.--fill-width]="skill.level + '%'"></div>
              </div>
            </div>
          </div>

          <!-- Programming -->
          <div class="glass-panel" style="padding: 32px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 28px; color: var(--primary);">Programlama & Geliştirme</h3>
            <div *ngFor="let skill of devSkills" class="skill-bar-item">
              <div class="skill-bar-meta">
                <span>{{ skill.name }}</span>
                <span>{{ skill.level }}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" [style.--fill-width]="skill.level + '%'"></div>
              </div>
            </div>
          </div>

        </div>

        <!-- Tech Badges -->
        <div class="glass-panel" style="padding: 32px; margin-bottom: 80px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 24px; text-align: center;">Teknoloji Yığını</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            <span class="skill-badge security">Kali Linux</span>
            <span class="skill-badge security">Nmap</span>
            <span class="skill-badge security">Wireshark</span>
            <span class="skill-badge security">Metasploit</span>
            <span class="skill-badge security">Burp Suite</span>
            <span class="skill-badge language">Python</span>
            <span class="skill-badge language">C#</span>
            <span class="skill-badge language">TypeScript</span>
            <span class="skill-badge language">JavaScript</span>
            <span class="skill-badge language">HTML5 / CSS3</span>
            <span class="skill-badge framework">Angular</span>
            <span class="skill-badge framework">Django REST</span>
            <span class="skill-badge framework">PostgreSQL</span>
            <span class="skill-badge framework">Git / GitHub</span>
            <span class="skill-badge framework">Android Studio</span>
          </div>
        </div>

        <!-- Certifications & Goals -->
        <h2 style="margin-bottom: 16px; text-align: center;">Sertifikasyon Yolculuğu</h2>
        <p style="text-align: center; margin-bottom: 40px; color: var(--text-muted);">Kariyer hedeflerim doğrultusunda edinmeyi planladığım sertifikalar.</p>

        <div style="display: flex; flex-direction: column; gap: 16px; max-width: 700px; margin: 0 auto 80px;">
          <div class="cert-card" *ngFor="let cert of certifications">
            <div class="cert-icon">{{ cert.icon }}</div>
            <div>
              <div style="margin-bottom: 6px;">
                <span class="cert-status" [class]="cert.status">{{ cert.statusLabel }}</span>
              </div>
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">{{ cert.name }}</h3>
              <p style="font-size: 0.9rem; margin: 0; line-height: 1.6;">{{ cert.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Contact CTA -->
        <div class="contact-cta-section">
          <span class="badge badge-primary" style="margin-bottom: 16px;">İletişim</span>
          <h2 style="margin-bottom: 12px;">Birlikte Çalışalım</h2>
          <p style="max-width: 480px; margin: 0 auto 28px;">
            Siber güvenlik projeleri, web geliştirme veya teknik sorular için iletişime geçmekten çekinme.
          </p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <a href="mailto:gefemadran@icloud.com" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:8px;"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              E-posta Gönder
            </a>
            <a href="https://github.com/gefe35" target="_blank" class="btn btn-secondary">
              <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right:8px;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub Profilim
            </a>
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

  public certifications = [
    {
      name: 'CompTIA Security+',
      status: 'hedef',
      statusLabel: 'Kısa Vadeli Hedef',
      icon: '🎯',
      desc: 'Ağ güvenliği, kriptografi, tehdit yönetimi ve uyumluluk konularını kapsayan uluslararası temel güvenlik sertifikasyonu.'
    },
    {
      name: 'Certified Ethical Hacker (CEH)',
      status: 'hedef',
      statusLabel: 'Orta Vadeli Hedef',
      icon: '🛡️',
      desc: 'EC-Council tarafından verilen etik hacker sertifikasyonu. Sızma testi metodolojileri ve zafiyet keşfi odaklı.'
    },
    {
      name: 'OSCP (Offensive Security Certified Professional)',
      status: 'uzun-vadeli',
      statusLabel: 'Uzun Vadeli Hedef',
      icon: '🔭',
      desc: 'Sektörün en prestijli sızma testi sertifikası. Gerçek dünya senaryolarında manuel exploit geliştirme ve zafiyet istismarı.'
    },
    {
      name: 'Wireshark Certified Network Analyst (WCNA)',
      status: 'hedef',
      statusLabel: 'Kısa Vadeli Hedef',
      icon: '📡',
      desc: 'Ağ protokol analizi ve paket yakalama alanında uzmanlaşmak için Wireshark sertifikasyonu.'
    },
  ];

  public securitySkills = [
    { name: 'Nmap / Ağ Tarama', level: 80 },
    { name: 'Wireshark / Paket Analizi', level: 75 },
    { name: 'Metasploit', level: 65 },
    { name: 'Burp Suite / Web Güvenliği', level: 70 },
    { name: 'Kriptoloji & Sıfır Bilgi Kanıtı', level: 60 },
  ];

  public devSkills = [
    { name: 'Python', level: 80 },
    { name: 'C#', level: 72 },
    { name: 'TypeScript / Angular', level: 78 },
    { name: 'Django REST Framework', level: 70 },
    { name: 'HTML5 / CSS3', level: 85 },
  ];

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
