import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AboutMe, Category, ContentItem, Project, SECTIONS } from '../services/api.service';
import { AuthService } from '../services/auth.service';

interface Tab { key: string; label: string; color: string; isAbout?: boolean; }

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding-bottom: 80px;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 8px;">
        <div>
          <span class="eyebrow">Yönetim Paneli</span>
          <h1 style="margin: 8px 0 0;">Merhaba, {{ auth.getUsername() }} 👋</h1>
        </div>
        <button class="btn btn-danger btn-sm" (click)="logout()">Çıkış Yap</button>
      </div>
      <p class="muted" style="margin-bottom: 28px;">Düzenlemek istediğin bölümü seç, ardından ekleme · güncelleme · silme yap.</p>

      <!-- 1. Bölüm seçimi -->
      <div class="seg" style="margin-bottom: 30px;">
        <button *ngFor="let t of tabs" [class.active]="active === t.key" (click)="select(t.key)">{{ t.label }}</button>
      </div>

      <!-- Global mesaj -->
      <div *ngIf="message" class="alert" [class.alert-ok]="!isError" [class.alert-err]="isError">{{ message }}</div>

      <!-- ============ HAKKIMDA ============ -->
      <div *ngIf="active === 'about'" class="card card-pad-lg">
        <h2 style="font-size: 1.5rem; margin-bottom: 4px;">Hakkımda Bilgileri</h2>
        <p class="muted" style="margin-bottom: 26px;">Profil bilgilerini ve fotoğrafını güncelle.</p>

        <div *ngIf="aboutLoading" class="state"><div class="spinner"></div></div>

        <div *ngIf="!aboutLoading && about" class="grid grid-2" style="gap: 24px 32px; align-items: start;">
          <div class="field"><label class="label">İsim Soyisim <span class="req">*</span></label>
            <input class="input" [(ngModel)]="about.name_surname" /></div>
          <div class="field"><label class="label">Yaş <span class="req">*</span></label>
            <input class="input" type="number" [(ngModel)]="about.age" /></div>
          <div class="field"><label class="label">Yaşadığım Şehir <span class="req">*</span></label>
            <input class="input" [(ngModel)]="about.city" /></div>
          <div class="field"><label class="label">Meslek <span class="req">*</span></label>
            <input class="input" [(ngModel)]="about.profession" /></div>
          <div class="field"><label class="label">Okul / Üniversite</label>
            <input class="input" [(ngModel)]="about.school" /></div>
          <div class="field"><label class="label">LinkedIn URL</label>
            <input class="input" [(ngModel)]="about.linkedin_url" placeholder="https://linkedin.com/in/..." /></div>
          <div class="field"><label class="label">Github URL</label>
            <input class="input" [(ngModel)]="about.github_url" placeholder="https://github.com/..." /></div>
          <div class="field">
            <label class="label">Güncel Fotoğraf</label>
            <input type="file" accept="image/*" (change)="onPhoto($event)" />
            <div *ngIf="photoPreview || about.photo" style="margin-top: 12px;">
              <img [src]="photoPreview || about.photo" alt="" style="width: 96px; height: 96px; border-radius: 14px; object-fit: cover; border: 3px solid #fff; box-shadow: var(--shadow-sm);" />
            </div>
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label class="label">Açıklama (Uzun Paragraf) <span class="req">*</span></label>
            <textarea class="textarea" rows="6" [(ngModel)]="about.bio_paragraph"></textarea>
          </div>
          <div style="grid-column: 1 / -1;">
            <button class="btn btn-primary" (click)="saveAbout()" [disabled]="saving">{{ saving ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet' }}</button>
          </div>
        </div>
      </div>

      <!-- ============ PROJELER ============ -->
      <div *ngIf="active === 'projects'" class="card card-pad-lg">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 4px;">Projeler</h2>
            <p class="muted" style="margin: 0;">Projelerini ekle, düzenle veya sil.</p>
          </div>
          <button class="btn btn-accent btn-sm" (click)="openProjectModal()">+ Yeni Proje</button>
        </div>

        <div *ngIf="projectsLoading" class="state"><div class="spinner"></div></div>

        <div *ngIf="!projectsLoading && !projectsList.length" class="muted" style="font-size: .9rem; padding: 8px 0;">Henüz proje eklenmemiş.</div>

        <div *ngFor="let p of projectsList" class="row-item">
          <div style="min-width: 0;">
            <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ p.name }}</strong>
            <span class="muted" style="font-size: .82rem;">{{ p.language || 'Dil belirtilmemiş' }} · ⭐ {{ p.stars }} · 🍴 {{ p.forks }}</span>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <a *ngIf="p.github_url" [href]="p.github_url" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">GitHub ↗</a>
            <button class="btn btn-ghost btn-sm" (click)="openProjectModal(p)">Düzenle</button>
            <button class="btn btn-danger btn-sm" (click)="removeProject(p)">Sil</button>
          </div>
        </div>
      </div>

      <!-- ============ İÇERİK BÖLÜMLERİ ============ -->
      <div *ngIf="active !== 'about' && active !== 'projects'">
        <div class="grid" style="grid-template-columns: 340px 1fr; gap: 26px; align-items: start;">

          <!-- Kategoriler -->
          <div class="card">
            <h3 style="font-family: var(--font); font-size: 1.15rem; margin-bottom: 4px;">Kategoriler</h3>
            <p class="muted" style="font-size: .86rem; margin-bottom: 18px;">Bu bölümün kategorilerini yönet.</p>

            <div style="display: flex; gap: 8px; margin-bottom: 18px;">
              <input class="input" [(ngModel)]="newCatName" placeholder="Yeni kategori adı" (keyup.enter)="addCategory()" />
              <button class="btn btn-primary btn-sm" (click)="addCategory()" [disabled]="!newCatName.trim()">Ekle</button>
            </div>

            <div *ngIf="!categories.length" class="muted" style="font-size: .9rem; padding: 8px 0;">Henüz kategori yok.</div>

            <div *ngFor="let c of categories" class="row-item">
              <ng-container *ngIf="editingCatId !== c.id">
                <div>
                  <strong>{{ c.name }}</strong>
                  <span class="muted" style="font-size: .82rem; display: block;">{{ c.item_count || 0 }} içerik</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-ghost btn-sm" (click)="startEditCat(c)">Düzenle</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteCategory(c)">Sil</button>
                </div>
              </ng-container>
              <ng-container *ngIf="editingCatId === c.id">
                <input class="input" [(ngModel)]="editCatName" style="flex: 1;" (keyup.enter)="saveCat(c)" />
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-primary btn-sm" (click)="saveCat(c)">Kaydet</button>
                  <button class="btn btn-ghost btn-sm" (click)="editingCatId = null">İptal</button>
                </div>
              </ng-container>
            </div>
          </div>

          <!-- İçerikler -->
          <div class="card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
              <h3 style="font-family: var(--font); font-size: 1.15rem; margin: 0;">İçerikler</h3>
              <button class="btn btn-accent btn-sm" (click)="openItemModal()" [disabled]="!categories.length">+ Yeni İçerik</button>
            </div>

            <div *ngIf="!categories.length" class="muted" style="font-size: .9rem;">Önce en az bir kategori eklemelisin.</div>
            <div *ngIf="categories.length && !items.length" class="muted" style="font-size: .9rem;">Bu bölümde henüz içerik yok.</div>

            <div *ngFor="let it of items" class="row-item">
              <div style="min-width: 0;">
                <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ it.title }}</strong>
                <span class="muted" style="font-size: .82rem;">{{ it.category_name }}</span>
                <span class="badge-status" [class.badge-published]="it.status === 'published'" [class.badge-draft]="it.status === 'draft'" style="margin-left: 8px;">
                  {{ it.status === 'published' ? 'Yayında' : 'Taslak' }}
                </span>
              </div>
              <div style="display: flex; gap: 6px; flex-shrink: 0;">
                <button class="btn btn-ghost btn-sm" (click)="openItemModal(it)">Düzenle</button>
                <button class="btn btn-danger btn-sm" (click)="deleteItem(it)">Sil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ İÇERİK MODAL ============ -->
    <div *ngIf="showModal" class="modal-backdrop" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 style="font-size: 1.4rem; margin-bottom: 22px;">{{ isNew ? 'Yeni İçerik' : 'İçeriği Düzenle' }}</h2>

        <div class="field"><label class="label">Kategori <span class="req">*</span></label>
          <select class="select" [(ngModel)]="form.category">
            <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field"><label class="label">Başlık <span class="req">*</span></label>
          <input class="input" [(ngModel)]="form.title" /></div>
        <div class="field"><label class="label">Özet Açıklama</label>
          <textarea class="textarea" rows="2" [(ngModel)]="form.summary" placeholder="Kartlarda görünecek kısa özet"></textarea></div>
        <div class="field"><label class="label">İçerik <span class="req">*</span></label>
          <textarea class="textarea" rows="8" [(ngModel)]="form.content" placeholder="Markdown destekler (## başlık, **kalın**, - liste, \`kod\`)"></textarea></div>
        <div class="field"><label class="label">Dış Bağlantı (opsiyonel)</label>
          <input class="input" [(ngModel)]="form.external_link" placeholder="https://..." /></div>
        <div class="grid grid-2" style="gap: 20px;">
          <div class="field"><label class="label">Görsel</label>
            <input type="file" accept="image/*" (change)="onItemImage($event)" />
            <div *ngIf="itemImagePreview || form.image" style="margin-top: 10px;">
              <img [src]="itemImagePreview || form.image" alt="" style="width: 80px; height: 60px; border-radius: 8px; object-fit: cover;" />
            </div>
          </div>
          <div class="field"><label class="label">Durum</label>
            <select class="select" [(ngModel)]="form.status">
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </div>
        </div>

        <div *ngIf="modalError" class="alert alert-err">{{ modalError }}</div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
          <button class="btn btn-ghost" (click)="closeModal()">İptal</button>
          <button class="btn btn-primary" (click)="saveItem()" [disabled]="saving">{{ saving ? 'Kaydediliyor…' : 'Kaydet' }}</button>
        </div>
      </div>
    </div>

    <!-- ============ PROJE MODAL ============ -->
    <div *ngIf="showProjectModal" class="modal-backdrop" (click)="closeProjectModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 style="font-size: 1.4rem; margin-bottom: 22px;">{{ isNewProject ? 'Yeni Proje' : 'Projeyi Düzenle' }}</h2>

        <div class="field"><label class="label">Proje Adı <span class="req">*</span></label>
          <input class="input" [(ngModel)]="projectForm.name" placeholder="Proje adı" /></div>
        <div class="field"><label class="label">Açıklama <span class="req">*</span></label>
          <textarea class="textarea" rows="3" [(ngModel)]="projectForm.description" placeholder="Proje hakkında kısa açıklama"></textarea></div>
        <div class="grid grid-2" style="gap: 20px;">
          <div class="field"><label class="label">Programlama Dili</label>
            <input class="input" [(ngModel)]="projectForm.language" placeholder="Python, JavaScript, vb." /></div>
          <div class="field"><label class="label">Sıra</label>
            <input class="input" type="number" [(ngModel)]="projectForm.order" /></div>
        </div>
        <div class="field"><label class="label">GitHub URL</label>
          <input class="input" [(ngModel)]="projectForm.github_url" placeholder="https://github.com/..." /></div>
        <div class="grid grid-2" style="gap: 20px;">
          <div class="field"><label class="label">Yıldız</label>
            <input class="input" type="number" [(ngModel)]="projectForm.stars" /></div>
          <div class="field"><label class="label">Fork</label>
            <input class="input" type="number" [(ngModel)]="projectForm.forks" /></div>
        </div>

        <div *ngIf="projectModalError" class="alert alert-err">{{ projectModalError }}</div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
          <button class="btn btn-ghost" (click)="closeProjectModal()">İptal</button>
          <button class="btn btn-primary" (click)="saveProject()" [disabled]="saving">{{ saving ? 'Kaydediliyor…' : 'Kaydet' }}</button>
        </div>
      </div>
    </div>
  `,
})
export class ManagementComponent implements OnInit {
  tabs: Tab[] = [
    { key: 'about', label: 'Hakkımda', color: '#0f9d8e', isAbout: true },
    { key: 'projects', label: 'Projeler', color: '#2d6a4f' },
    ...SECTIONS.map((s) => ({ key: s.key, label: s.label, color: s.color })),
  ];
  active = 'about';

  message = '';
  isError = false;
  saving = false;

  // About
  about?: AboutMe;
  aboutLoading = false;
  photoFile: File | null = null;
  photoPreview: string | null = null;

  // Sections
  categories: Category[] = [];
  items: ContentItem[] = [];
  newCatName = '';
  editingCatId: string | null = null;
  editCatName = '';

  // Item modal
  showModal = false;
  isNew = true;
  form: Partial<ContentItem> = {};
  itemImageFile: File | null = null;
  itemImagePreview: string | null = null;
  modalError = '';

  // Projects
  projectsList: Project[] = [];
  projectsLoading = false;
  showProjectModal = false;
  isNewProject = true;
  projectForm: Partial<Project> = {};
  projectModalError = '';

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadAbout();
  }

  select(key: string): void {
    this.active = key;
    this.clearMessage();
    if (key === 'about') { if (!this.about) this.loadAbout(); }
    else if (key === 'projects') { this.loadProjects(); }
    else this.loadSection(key);
  }

  // ---------- About ----------
  loadAbout(): void {
    this.aboutLoading = true;
    this.api.getAboutMe().subscribe({
      next: (a) => { this.about = a; this.aboutLoading = false; },
      error: () => { this.aboutLoading = false; this.flash('Hakkımda bilgisi yüklenemedi.', true); },
    });
  }
  onPhoto(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0] || null;
    this.photoFile = f;
    this.photoPreview = f ? URL.createObjectURL(f) : null;
  }
  saveAbout(): void {
    if (!this.about) return;
    this.saving = true;
    this.api.updateAboutMe(this.about, this.photoFile).subscribe({
      next: (a) => { this.about = a; this.photoFile = null; this.photoPreview = null; this.saving = false; this.flash('Hakkımda bilgileri kaydedildi.'); },
      error: (err) => { this.saving = false; this.flash(this.errText(err), true); },
    });
  }

  // ---------- Section data ----------
  loadSection(key: string): void {
    this.categories = [];
    this.items = [];
    this.api.getCategories(key).subscribe({ next: (c) => (this.categories = c), error: () => {} });
    this.api.getItems(key).subscribe({ next: (i) => (this.items = i), error: () => {} });
  }

  // ---------- Categories ----------
  addCategory(): void {
    const name = this.newCatName.trim();
    if (!name) return;
    this.api.createCategory({ name, section_type: this.active }).subscribe({
      next: () => { this.newCatName = ''; this.loadSection(this.active); this.flash('Kategori eklendi.'); },
      error: (err) => this.flash(this.errText(err), true),
    });
  }
  startEditCat(c: Category): void { this.editingCatId = c.id!; this.editCatName = c.name; }
  saveCat(c: Category): void {
    const name = this.editCatName.trim();
    if (!name) return;
    this.api.updateCategory(c.id!, { name }).subscribe({
      next: () => { this.editingCatId = null; this.loadSection(this.active); this.flash('Kategori güncellendi.'); },
      error: (err) => this.flash(this.errText(err), true),
    });
  }
  deleteCategory(c: Category): void {
    if (!confirm(`"${c.name}" kategorisi ve içindeki tüm içerikler silinecek. Emin misin?`)) return;
    this.api.deleteCategory(c.id!).subscribe({
      next: () => { this.loadSection(this.active); this.flash('Kategori silindi.'); },
      error: (err) => this.flash(this.errText(err), true),
    });
  }

  // ---------- Items ----------
  openItemModal(item?: ContentItem): void {
    this.modalError = '';
    this.itemImageFile = null;
    this.itemImagePreview = null;
    if (item) {
      this.isNew = false;
      this.form = { ...item };
    } else {
      this.isNew = true;
      this.form = { category: this.categories[0]?.id, title: '', summary: '', content: '', external_link: '', status: 'published' };
    }
    this.showModal = true;
  }
  onItemImage(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0] || null;
    this.itemImageFile = f;
    this.itemImagePreview = f ? URL.createObjectURL(f) : null;
  }
  saveItem(): void {
    if (!this.form.category || !this.form.title?.trim() || !this.form.content?.trim()) {
      this.modalError = 'Kategori, başlık ve içerik zorunludur.';
      return;
    }
    this.saving = true;
    const payload: Partial<ContentItem> = {
      category: this.form.category,
      title: this.form.title,
      summary: this.form.summary || '',
      content: this.form.content,
      external_link: this.form.external_link || '',
      status: this.form.status || 'published',
    };
    const req = this.isNew
      ? this.api.createItem(payload, this.itemImageFile)
      : this.api.updateItem(this.form.id!, payload, this.itemImageFile);
    req.subscribe({
      next: () => { this.saving = false; this.closeModal(); this.loadSection(this.active); this.flash(this.isNew ? 'İçerik eklendi.' : 'İçerik güncellendi.'); },
      error: (err) => { this.saving = false; this.modalError = this.errText(err); },
    });
  }
  deleteItem(it: ContentItem): void {
    if (!confirm(`"${it.title}" içeriği silinecek. Emin misin?`)) return;
    this.api.deleteItem(it.id!).subscribe({
      next: () => { this.loadSection(this.active); this.flash('İçerik silindi.'); },
      error: (err) => this.flash(this.errText(err), true),
    });
  }
  closeModal(): void { this.showModal = false; }

  // ---------- Projects ----------
  loadProjects(): void {
    this.projectsLoading = true;
    this.api.getProjects().subscribe({
      next: (p) => { this.projectsList = p; this.projectsLoading = false; },
      error: () => { this.projectsLoading = false; this.flash('Projeler yüklenemedi.', true); },
    });
  }
  openProjectModal(project?: Project): void {
    this.projectModalError = '';
    if (project) {
      this.isNewProject = false;
      this.projectForm = { ...project };
    } else {
      this.isNewProject = true;
      this.projectForm = { name: '', description: '', language: '', github_url: '', stars: 0, forks: 0, order: this.projectsList.length };
    }
    this.showProjectModal = true;
  }
  closeProjectModal(): void { this.showProjectModal = false; }
  saveProject(): void {
    if (!this.projectForm.name?.trim() || !this.projectForm.description?.trim()) {
      this.projectModalError = 'Proje adı ve açıklama zorunludur.';
      return;
    }
    this.saving = true;
    const payload: Partial<Project> = {
      name: this.projectForm.name,
      description: this.projectForm.description,
      language: this.projectForm.language || '',
      github_url: this.projectForm.github_url || '',
      stars: this.projectForm.stars || 0,
      forks: this.projectForm.forks || 0,
      order: this.projectForm.order || 0,
    };
    const req = this.isNewProject
      ? this.api.createProject(payload)
      : this.api.updateProject(this.projectForm.id!, payload);
    req.subscribe({
      next: () => { this.saving = false; this.closeProjectModal(); this.loadProjects(); this.flash(this.isNewProject ? 'Proje eklendi.' : 'Proje güncellendi.'); },
      error: (err) => { this.saving = false; this.projectModalError = this.errText(err); },
    });
  }
  removeProject(p: Project): void {
    if (!confirm(`"${p.name}" projesi silinecek. Emin misin?`)) return;
    this.api.deleteProject(p.id).subscribe({
      next: () => { this.loadProjects(); this.flash('Proje silindi.'); },
      error: (err) => this.flash(this.errText(err), true),
    });
  }

  // ---------- helpers ----------
  logout(): void { this.auth.logout(); this.router.navigate(['/']); }
  flash(msg: string, err = false): void {
    this.message = msg; this.isError = err;
    setTimeout(() => this.clearMessage(), 4000);
  }
  clearMessage(): void { this.message = ''; this.isError = false; }
  errText(err: any): string {
    if (err?.status === 401) return 'Oturum süresi dolmuş olabilir, tekrar giriş yapın.';
    const d = err?.error;
    if (typeof d === 'string') return d;
    if (d && typeof d === 'object') return Object.values(d).flat().join(' ');
    return 'Bir hata oluştu.';
  }
}
