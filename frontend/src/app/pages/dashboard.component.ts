import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AboutMe, Category, ContentItem } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" *ngIf="isAuthenticated">
      
      <!-- Dashboard Title -->
      <div style="margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div>
          <span class="badge badge-primary" style="margin-bottom: 8px;">Yönetim Kokpiti</span>
          <h2>Merhaba, {{ aboutForm.name_surname }}</h2>
        </div>
        <div style="display: flex; gap: 12px;">
          <button (click)="activeTab = 'about'" [class.active]="activeTab === 'about'" class="tab-btn">Hakkımda</button>
          <button (click)="activeTab = 'categories'" [class.active]="activeTab === 'categories'" class="tab-btn">Kategoriler</button>
          <button (click)="activeTab = 'items'" [class.active]="activeTab === 'items'" class="tab-btn">İçerikler</button>
        </div>
      </div>

      <!-- Alert messages -->
      <div *ngIf="message.text" [class]="'alert alert-' + message.type" style="margin-bottom: 24px; padding: 14px 18px; border-radius: var(--radius-sm); border: 1px solid; display: flex; justify-content: space-between; align-items: center;">
        <span>{{ message.text }}</span>
        <button (click)="clearMessage()" style="background: none; border: none; cursor: pointer; color: inherit; font-size: 1rem;">×</button>
      </div>

      <!-- ================== TAB 1: ABOUT ME ================== -->
      <div *ngIf="activeTab === 'about'" class="glass-card" style="padding: 40px;">
        <h3 style="margin-bottom: 24px; color: var(--primary);">Hakkımda Bilgilerini Güncelle</h3>
        
        <form (ngSubmit)="onUpdateAbout()">
          <div class="grid-2">
            
            <div class="form-group">
              <label class="form-label">İsim Soyisim</label>
              <input type="text" [(ngModel)]="aboutForm.name_surname" name="name_surname" class="form-control" required>
            </div>

            <div class="form-group">
              <label class="form-label">Yaş</label>
              <input type="number" [(ngModel)]="aboutForm.age" name="age" class="form-control" required>
            </div>

            <div class="form-group">
              <label class="form-label">Yaşadığım Şehir</label>
              <input type="text" [(ngModel)]="aboutForm.city" name="city" class="form-control" required>
            </div>

            <div class="form-group">
              <label class="form-label">Mesleğim</label>
              <input type="text" [(ngModel)]="aboutForm.profession" name="profession" class="form-control" required>
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Okul / Üniversite Bilgisi</label>
              <input type="text" [(ngModel)]="aboutForm.school" name="school" class="form-control" required>
            </div>

            <div class="form-group">
              <label class="form-label">LinkedIn URL</label>
              <input type="url" [(ngModel)]="aboutForm.linkedin_url" name="linkedin_url" class="form-control">
            </div>

            <div class="form-group">
              <label class="form-label">GitHub URL</label>
              <input type="url" [(ngModel)]="aboutForm.github_url" name="github_url" class="form-control">
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Uzun Açıklama Paragrafı (Biyografi)</label>
              <textarea [(ngModel)]="aboutForm.bio_paragraph" name="bio_paragraph" class="form-control" style="min-height: 150px;" required></textarea>
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Güncel Fotoğraf</label>
              <div style="display: flex; align-items: center; gap: 20px;">
                <div class="avatar-preview flex-center" style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid var(--border-glass); background-color: var(--bg-surface);">
                  <img *ngIf="aboutForm.photo || photoPreview" [src]="photoPreview || aboutForm.photo" style="width:100%; height:100%; object-fit:cover;">
                  <span *ngIf="!aboutForm.photo && !photoPreview" style="font-size: 1.5rem;">👤</span>
                </div>
                <input type="file" (change)="onAboutPhotoSelected($event)" accept="image/*" class="form-control" style="border: none; padding: 0;">
              </div>
            </div>

          </div>

          <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
            <button type="submit" [disabled]="isSaving" class="btn btn-primary">
              {{ isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
            </button>
          </div>
        </form>
      </div>

      <!-- ================== TAB 2: CATEGORIES ================== -->
      <div *ngIf="activeTab === 'categories'">
        <div class="grid-2">
          
          <!-- Category Creation & Edit Form -->
          <div class="glass-panel" style="padding: 32px; height: fit-content;">
            <h3 style="margin-bottom: 24px; color: var(--primary);">
              {{ isEditingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle' }}
            </h3>
            
            <form (ngSubmit)="onSaveCategory()">
              <div class="form-group">
                <label class="form-label">Kategori Adı</label>
                <input type="text" [(ngModel)]="categoryForm.name" name="cat_name" class="form-control" placeholder="Örn: Sızma Testleri" required>
              </div>

              <div class="form-group" style="margin-bottom: 28px;">
                <label class="form-label">Bölüm Tipi</label>
                <select [(ngModel)]="categoryForm.section_type" name="cat_section" class="form-control" required>
                  <option value="technical">Teknik Bilgi</option>
                  <option value="non_technical">Teknik Olmayan Bilgi</option>
                  <option value="research">Araştırmalarım</option>
                  <option value="hobby">Hobilerim</option>
                  <option value="book">Okuduğum Kitaplar</option>
                </select>
              </div>

              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button *ngIf="isEditingCategory" type="button" (click)="resetCategoryForm()" class="btn btn-secondary">İptal</button>
                <button type="submit" [disabled]="isSaving" class="btn btn-primary">
                  {{ isEditingCategory ? 'Güncelle' : 'Ekle' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Categories List -->
          <div class="glass-panel" style="padding: 32px;">
            <h3 style="margin-bottom: 24px;">Mevcut Kategoriler</h3>
            
            <!-- Quick list filter by section -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;">
              <button 
                *ngFor="let filterSec of sections" 
                (click)="categoryFilter = filterSec.id"
                [class.active]="categoryFilter === filterSec.id"
                class="pill-btn">
                {{ filterSec.name }}
              </button>
            </div>

            <div style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
              <div *ngFor="let cat of getFilteredCategories()" class="cat-list-item">
                <div>
                  <strong style="display: block;">{{ cat.name }}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-dim);">Öğe Sayısı: {{ cat.item_count }}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button (click)="onEditCategoryClick(cat)" class="btn btn-secondary crud-action-btn">✏️</button>
                  <button (click)="onDeleteCategoryClick(cat.id!)" class="btn btn-secondary crud-action-btn" style="color: var(--error);">🗑️</button>
                </div>
              </div>
              <div *ngIf="getFilteredCategories().length === 0" style="text-align: center; padding: 40px; color: var(--text-dim);">
                Seçili bölümde henüz kategori bulunmuyor.
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ================== TAB 3: CONTENT ITEMS ================== -->
      <div *ngIf="activeTab === 'items'">
        
        <!-- Toggle Item Editor or List -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h3>{{ showItemForm ? (isEditingItem ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle') : 'Mevcut Blog Yazıları' }}</h3>
          <button (click)="toggleItemForm()" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.9rem;">
            {{ showItemForm ? 'Yazı Listesine Dön' : 'Yeni Yazı Ekle' }}
          </button>
        </div>

        <!-- Create & Edit Form -->
        <div *ngIf="showItemForm" class="glass-card" style="padding: 40px;">
          <form (ngSubmit)="onSaveItem()">
            <div class="grid-2">
              
              <div class="form-group">
                <label class="form-label">Başlık</label>
                <input type="text" [(ngModel)]="itemForm.title" name="item_title" class="form-control" placeholder="Örn: Wireshark Paket Analizi" required>
              </div>

              <div class="form-group">
                <label class="form-label">Kategori</label>
                <select [(ngModel)]="itemForm.category" name="item_category" class="form-control" required>
                  <option value="" disabled selected>Kategori Seçin...</option>
                  <optgroup label="Teknik Bilgi">
                    <option *ngFor="let cat of getCategoriesBySection('technical')" [value]="cat.id">{{ cat.name }}</option>
                  </optgroup>
                  <optgroup label="Teknik Olmayan Bilgi">
                    <option *ngFor="let cat of getCategoriesBySection('non_technical')" [value]="cat.id">{{ cat.name }}</option>
                  </optgroup>
                  <optgroup label="Araştırmalarım">
                    <option *ngFor="let cat of getCategoriesBySection('research')" [value]="cat.id">{{ cat.name }}</option>
                  </optgroup>
                  <optgroup label="Hobilerim">
                    <option *ngFor="let cat of getCategoriesBySection('hobby')" [value]="cat.id">{{ cat.name }}</option>
                  </optgroup>
                  <optgroup label="Okuduğum Kitaplar">
                    <option *ngFor="let cat of getCategoriesBySection('book')" [value]="cat.id">{{ cat.name }}</option>
                  </optgroup>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Dış Kaynak Bağlantısı (URL)</label>
                <input type="url" [(ngModel)]="itemForm.external_link" name="item_link" class="form-control" placeholder="https://example.com/source">
              </div>

              <div class="form-group">
                <label class="form-label">Yayın Durumu</label>
                <select [(ngModel)]="itemForm.status" name="item_status" class="form-control" required>
                  <option value="published">Yayınlandı</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>

              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Özet Açıklama (Kartlarda gösterilen kısa metin)</label>
                <input type="text" [(ngModel)]="itemForm.summary" name="item_summary" class="form-control" placeholder="Yazının kısa bir özeti..." required>
              </div>

              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">İçerik (Markdown Formatı Destekler)</label>
                <textarea [(ngModel)]="itemForm.content" name="item_content" class="form-control" style="min-height: 250px;" placeholder="## Başlık... \n**Kalın Yazı**..." required></textarea>
              </div>

              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Yazı Görseli</label>
                <div style="display: flex; align-items: center; gap: 20px;">
                  <div class="avatar-preview flex-center" style="width: 140px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid var(--border-glass); background-color: var(--bg-surface);">
                    <img *ngIf="itemForm.image || itemPhotoPreview" [src]="itemPhotoPreview || itemForm.image" style="width:100%; height:100%; object-fit:cover;">
                    <span *ngIf="!itemForm.image && !itemPhotoPreview" style="font-size: 1.2rem; color: var(--text-dim);">No Image</span>
                  </div>
                  <input type="file" (change)="onItemPhotoSelected($event)" accept="image/*" class="form-control" style="border: none; padding: 0;">
                </div>
              </div>

            </div>

            <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" (click)="toggleItemForm()" class="btn btn-secondary">Vazgeç</button>
              <button type="submit" [disabled]="isSaving" class="btn btn-primary">
                {{ isSaving ? 'Kaydediliyor...' : (isEditingItem ? 'Güncelle' : 'Yayınla') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Items Grid List -->
        <div *ngIf="!showItemForm">
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px;">
            <button 
              (click)="itemFilter = 'all'"
              [class.active]="itemFilter === 'all'"
              class="pill-btn">
              Tümü
            </button>
            <button 
              *ngFor="let filterSec of sections" 
              (click)="itemFilter = filterSec.id"
              [class.active]="itemFilter === filterSec.id"
              class="pill-btn">
              {{ filterSec.name }}
            </button>
          </div>

          <div class="grid-3" *ngIf="getFilteredItems().length > 0; else emptyItemsState">
            <div class="glass-card flex-between" *ngFor="let item of getFilteredItems()" style="flex-direction: column; align-items: flex-start; height: 100%; padding: 24px;">
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span class="badge">{{ item.category_name }}</span>
                  <span [class]="'badge ' + (item.status === 'published' ? 'badge-published' : 'badge-draft')">
                    {{ item.status === 'published' ? 'Aktif' : 'Taslak' }}
                  </span>
                </div>
                <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; margin-bottom: 8px; line-height: 1.3;">{{ item.title }}</h4>
                <p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-dim); margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  {{ item.summary }}
                </p>
              </div>
              
              <div style="display: flex; gap: 8px; width: 100%; margin-top: auto;">
                <button (click)="onEditItemClick(item)" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; flex: 1;">Düzenle</button>
                <button (click)="onDeleteItemClick(item.id!)" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; border-color: rgba(239, 68, 68, 0.4); color: var(--error);">Sil</button>
              </div>
            </div>
          </div>

          <ng-template #emptyItemsState>
            <div class="glass-panel flex-center" style="padding: 80px; text-align: center;">
              Henüz bu grupta yazı bulunmuyor.
            </div>
          </ng-template>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .tab-btn {
      padding: 10px 20px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      border: 1px solid var(--border-glass);
      background: transparent;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .tab-btn:hover {
      color: var(--text-main);
      background-color: rgba(255, 255, 255, 0.03);
    }
    .tab-btn.active {
      color: var(--bg-main);
      background-color: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .pill-btn {
      padding: 6px 14px;
      border: 1px solid var(--border-glass);
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-muted);
      border-radius: 50px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    .pill-btn:hover {
      color: var(--text-main);
      border-color: var(--text-muted);
    }
    .pill-btn.active {
      background-color: var(--primary-glow);
      border-color: var(--primary);
      color: var(--primary);
    }

    .alert-success {
      background-color: rgba(16, 185, 129, 0.1);
      border-color: var(--success);
      color: var(--success);
    }
    .alert-error {
      background-color: rgba(239, 68, 68, 0.1);
      border-color: var(--error);
      color: var(--error);
    }

    .cat-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      border: 1px solid var(--border-glass);
      background-color: rgba(255, 255, 255, 0.01);
      border-radius: var(--radius-sm);
    }

    .crud-action-btn {
      padding: 6px !important;
      width: 32px;
      height: 32px;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .badge-published {
      background-color: rgba(16, 185, 129, 0.1);
      border-color: var(--success);
      color: var(--success);
    }
    .badge-draft {
      background-color: rgba(245, 158, 11, 0.1);
      border-color: var(--warning);
      color: var(--warning);
    }
    .flex-between {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class DashboardComponent implements OnInit {
  public isAuthenticated = false;
  public activeTab = 'about';
  public sections = [
    { id: 'technical', name: 'Teknik Bilgi' },
    { id: 'non_technical', name: 'Teknik Olmayan' },
    { id: 'research', name: 'Araştırmalarım' },
    { id: 'hobby', name: 'Hobilerim' },
    { id: 'book', name: 'Kitaplarım' }
  ];

  public message = { text: '', type: 'success' };
  public isSaving = false;

  // Hakkımda Form
  public aboutForm: AboutMe = {
    name_surname: '',
    age: 0,
    city: '',
    profession: '',
    school: '',
    linkedin_url: '',
    github_url: '',
    bio_paragraph: ''
  };
  public selectedAboutPhoto: File | null = null;
  public photoPreview: string | null = null;

  // Categories Form & List
  public allCategories: Category[] = [];
  public categoryFilter = 'technical';
  public isEditingCategory = false;
  public editingCategoryId: string | null = null;
  public categoryForm: Category = {
    name: '',
    section_type: 'technical'
  };

  // Content Items Form & List
  public showItemForm = false;
  public isEditingItem = false;
  public editingItemId: string | null = null;
  public allItems: ContentItem[] = [];
  public itemFilter = 'all';
  public itemForm: ContentItem = {
    category: '',
    title: '',
    summary: '',
    content: '',
    status: 'published',
    external_link: ''
  };
  public selectedItemPhoto: File | null = null;
  public itemPhotoPreview: string | null = null;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Guard check: secure administration panel
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isAuthenticated = true;

    // 2. Load all initial database records
    this.loadAboutInfo();
    this.loadCategories();
    this.loadAllItems();
  }

  // --- Alert Helpers ---
  public showToast(text: string, type: 'success' | 'error' = 'success'): void {
    this.message = { text, type };
    // Auto-dismiss alert after 5 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  public clearMessage(): void {
    this.message = { text: '', type: 'success' };
  }

  // --- Loaders ---
  private loadAboutInfo(): void {
    this.api.getAboutMe().subscribe({
      next: (res) => this.aboutForm = res,
      error: (err) => this.showToast('Hakkımda bilgileri çekilemedi.', 'error')
    });
  }

  private loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (res) => this.allCategories = res,
      error: (err) => this.showToast('Kategoriler çekilemedi.', 'error')
    });
  }

  private loadAllItems(): void {
    this.api.getItems().subscribe({
      next: (res) => this.allItems = res,
      error: (err) => this.showToast('Blog yazıları çekilemedi.', 'error')
    });
  }

  // ================== ABOUT TAB OPERATIONS ==================
  public onAboutPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedAboutPhoto = file;
      // Generate a nice client preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public onUpdateAbout(): void {
    this.isSaving = true;
    const formData = new FormData();
    formData.append('name_surname', this.aboutForm.name_surname);
    formData.append('age', this.aboutForm.age.toString());
    formData.append('city', this.aboutForm.city);
    formData.append('profession', this.aboutForm.profession);
    formData.append('school', this.aboutForm.school);
    formData.append('linkedin_url', this.aboutForm.linkedin_url || '');
    formData.append('github_url', this.aboutForm.github_url || '');
    formData.append('bio_paragraph', this.aboutForm.bio_paragraph);
    
    if (this.selectedAboutPhoto) {
      formData.append('photo', this.selectedAboutPhoto);
    }

    this.api.updateAboutMe(formData).subscribe({
      next: (res) => {
        this.aboutForm = res;
        this.selectedAboutPhoto = null;
        this.photoPreview = null;
        this.isSaving = false;
        this.showToast('Hakkımda bilgileri başarıyla güncellendi.');
      },
      error: (err) => {
        this.isSaving = false;
        this.showToast('Güncelleme esnasında bir hata oluştu.', 'error');
      }
    });
  }

  // ================== CATEGORIES TAB OPERATIONS ==================
  public getFilteredCategories(): Category[] {
    return this.allCategories.filter(cat => cat.section_type === this.categoryFilter);
  }

  public getCategoriesBySection(sectionId: string): Category[] {
    return this.allCategories.filter(cat => cat.section_type === sectionId);
  }

  public onEditCategoryClick(cat: Category): void {
    this.isEditingCategory = true;
    this.editingCategoryId = cat.id!;
    this.categoryForm = {
      name: cat.name,
      section_type: cat.section_type
    };
  }

  public resetCategoryForm(): void {
    this.isEditingCategory = false;
    this.editingCategoryId = null;
    this.categoryForm = { name: '', section_type: 'technical' };
  }

  public onSaveCategory(): void {
    if (!this.categoryForm.name) return;

    this.isSaving = true;
    if (this.isEditingCategory && this.editingCategoryId) {
      // Update existing
      this.api.updateCategory(this.editingCategoryId, this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.resetCategoryForm();
          this.isSaving = false;
          this.showToast('Kategori başarıyla güncellendi.');
        },
        error: () => {
          this.isSaving = false;
          this.showToast('Kategori güncellenemedi.', 'error');
        }
      });
    } else {
      // Create new
      this.api.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.categoryForm.name = ''; // Clear text field only
          this.isSaving = false;
          this.showToast('Kategori başarıyla eklendi.');
        },
        error: () => {
          this.isSaving = false;
          this.showToast('Kategori eklenemedi.', 'error');
        }
      });
    }
  }

  public onDeleteCategoryClick(id: string): void {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye bağlı tüm yazılar da silinecektir.')) {
      this.api.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.loadAllItems(); // Items cascade delete
          this.showToast('Kategori ve bağlı yazılar silindi.');
        },
        error: () => this.showToast('Kategori silinemedi.', 'error')
      });
    }
  }

  // ================== CONTENT ITEMS TAB OPERATIONS ==================
  public toggleItemForm(): void {
    this.showItemForm = !this.showItemForm;
    if (!this.showItemForm) {
      this.resetItemForm();
    }
  }

  public resetItemForm(): void {
    this.isEditingItem = false;
    this.editingItemId = null;
    this.selectedItemPhoto = null;
    this.itemPhotoPreview = null;
    this.itemForm = {
      category: '',
      title: '',
      summary: '',
      content: '',
      status: 'published',
      external_link: ''
    };
  }

  public onItemPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedItemPhoto = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.itemPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public getFilteredItems(): ContentItem[] {
    if (this.itemFilter === 'all') {
      return this.allItems;
    }
    return this.allItems.filter(item => item.category_section === this.itemFilter);
  }

  public onEditItemClick(item: ContentItem): void {
    this.isEditingItem = true;
    this.editingItemId = item.id!;
    this.showItemForm = true;
    this.itemForm = {
      category: item.category,
      title: item.title,
      summary: item.summary,
      content: item.content,
      status: item.status,
      external_link: item.external_link,
      image: item.image
    };
  }

  public onDeleteItemClick(id: string): void {
    if (confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      this.api.deleteItem(id).subscribe({
        next: () => {
          this.loadAllItems();
          this.showToast('Yazı başarıyla silindi.');
        },
        error: () => this.showToast('Yazı silinemedi.', 'error')
      });
    }
  }

  public onSaveItem(): void {
    if (!this.itemForm.title || !this.itemForm.category || !this.itemForm.content) {
      this.showToast('Lütfen tüm zorunlu alanları doldurun.', 'error');
      return;
    }

    this.isSaving = true;
    const formData = new FormData();
    formData.append('title', this.itemForm.title);
    formData.append('category', this.itemForm.category);
    formData.append('summary', this.itemForm.summary || '');
    formData.append('content', this.itemForm.content);
    formData.append('status', this.itemForm.status);
    formData.append('external_link', this.itemForm.external_link || '');
    
    if (this.selectedItemPhoto) {
      formData.append('image', this.selectedItemPhoto);
    }

    if (this.isEditingItem && this.editingItemId) {
      // Update
      this.api.updateItem(this.editingItemId, formData).subscribe({
        next: () => {
          this.loadAllItems();
          this.toggleItemForm();
          this.isSaving = false;
          this.showToast('Yazı başarıyla güncellendi.');
        },
        error: () => {
          this.isSaving = false;
          this.showToast('Yazı güncellenemedi.', 'error');
        }
      });
    } else {
      // Create
      this.api.createItem(formData).subscribe({
        next: () => {
          this.loadAllItems();
          this.toggleItemForm();
          this.isSaving = false;
          this.showToast('Yazı başarıyla yayınlandı.');
        },
        error: () => {
          this.isSaving = false;
          this.showToast('Yazı oluşturulamadı.', 'error');
        }
      });
    }
  }
}
