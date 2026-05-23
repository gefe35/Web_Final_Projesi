import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="padding-top: 40px; padding-bottom: 100px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
        <h1 style="margin: 0;"><span style="color: var(--primary);">/</span> Yönetim Paneli</h1>
        <button class="btn btn-outline" style="border-color: var(--error); color: var(--error);" (click)="logout()">Çıkış Yap</button>
      </div>
      
      <div class="glass-card" style="margin-bottom: 32px; border-left: 4px solid var(--primary);">
        <h2 style="color: var(--primary); font-size: 1.5rem; margin-bottom: 12px;">Sistem Yönetimi (Django Admin)</h2>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 24px;">
          Sitedeki tüm verileri (Hakkımda bilgileri, Kategoriler, İçerikler, Projeler) yönetmek için geliştirilmiş arka plan yönetim panelini kullanabilirsiniz.
          Aşağıdaki butonlara tıklayarak doğrudan veri yönetim paneline geçiş yapabilirsiniz.
        </p>
        
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="http://localhost:8000/admin/" target="_blank" class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Tüm Verileri Yönet (Django Admin)
          </a>
        </div>
      </div>
      
      <div class="grid-2">
        <!-- Hakkımda Modülü -->
        <div class="glass-card">
          <h2 style="color: var(--primary); font-size: 1.3rem; margin-bottom: 8px;">Hakkımda Bilgileri</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">İsminizi, yaşınızı, sosyal medya linklerinizi ve profil fotoğrafınızı güncelleyin.</p>
          
          <div style="background: rgba(var(--primary-rgb), 0.1); padding: 16px; border-radius: var(--border-radius-sm); margin-bottom: 24px;">
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-main);"><strong>İpucu:</strong> Hakkımda bilgileri sistemde sadece tek bir kayıt olarak tutulur. Var olan kaydı düzenleyin.</p>
          </div>
          
          <a href="http://localhost:8000/admin/profile_info/aboutme/" target="_blank" class="btn btn-outline" style="width: 100%; text-decoration: none; text-align: center;">Profilimi Güncelle</a>
        </div>
        
        <!-- İçerik ve Kategori Modülü -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="glass-card">
            <h2 style="color: var(--accent); font-size: 1.3rem; margin-bottom: 8px;">İçerik Yönetimi</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Değerlendirme kriterlerinde istenen bölümleri ve alt içeriklerini yönetin.</p>
            
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
              <li style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--surface-color); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                <strong>Kategoriler</strong>
                <a href="http://localhost:8000/admin/blog_content/category/" target="_blank" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem; text-decoration: none;">Yönet</a>
              </li>
              <li style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--surface-color); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                <strong>İçerikler (Yazılar/Paylaşımlar)</strong>
                <a href="http://localhost:8000/admin/blog_content/contentitem/" target="_blank" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem; text-decoration: none;">Yönet</a>
              </li>
              <li style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--surface-color); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                <strong>Terminal Komutları</strong>
                <a href="http://localhost:8000/admin/profile_info/terminalcommand/" target="_blank" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem; text-decoration: none;">Yönet</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
