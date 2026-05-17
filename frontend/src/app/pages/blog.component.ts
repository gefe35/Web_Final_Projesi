import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Category, ContentItem } from '../services/api.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      
      <!-- Page Title -->
      <div style="text-align: center; margin-bottom: 50px;">
        <span class="badge badge-primary" style="margin-bottom: 12px;">Yazılar & Araştırmalar</span>
        <h1 style="margin-bottom: 16px;">Kişisel Kütüphane</h1>
        <p style="max-width: 600px; margin: 0 auto; color: var(--text-muted);">
          Hem siber güvenlik ve teknik konular hem de ürekenlik, kişisel gelişim ve okuduğum kitaplar üzerine aldığım tüm notlar.
        </p>
      </div>

      <!-- Main Section Tabs -->
      <div class="sections-nav flex-center glass-panel" style="margin-bottom: 40px; padding: 6px; border-radius: 50px; gap: 4px;">
        <button 
          *ngFor="let sec of sections" 
          (click)="onSelectSection(sec.id)"
          [class.active]="activeSection === sec.id"
          class="sec-tab-btn">
          {{ sec.name }}
        </button>
      </div>

      <!-- Subcategory Filters -->
      <div class="categories-filter flex-center" style="gap: 12px; flex-wrap: wrap; margin-bottom: 40px;">
        <button 
          (click)="onSelectCategory('')"
          [class.active]="activeCategorySlug === ''"
          class="cat-filter-btn">
          Tümü
        </button>
        <button 
          *ngFor="let cat of categories" 
          (click)="onSelectCategory(cat.slug || '')"
          [class.active]="activeCategorySlug === cat.slug"
          class="cat-filter-btn">
          {{ cat.name }} ({{ cat.item_count }})
        </button>
      </div>

      <!-- Articles / Items Grid -->
      <div *ngIf="isLoading" class="flex-center" style="padding: 100px 0;">
        <div class="loader"></div>
      </div>

      <div *ngIf="!isLoading">
        <div class="grid-3" *ngIf="items.length > 0; else emptyState">
          <div class="glass-card flex-between" *ngFor="let item of items" style="flex-direction: column; align-items: flex-start; height: 100%;">
            <div style="width: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span class="badge badge-primary">{{ item.category_name }}</span>
                <span style="font-size: 0.8rem; color: var(--text-dim);">{{ item.created_at | date:'dd.MM.yyyy' }}</span>
              </div>
              <h3 style="margin-bottom: 12px; line-height: 1.3;" class="card-title">{{ item.title }}</h3>
              <p style="font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
                {{ item.summary }}
              </p>
            </div>
            
            <div style="display: flex; gap: 12px; width: 100%; margin-top: auto;">
              <a [routerLink]="['/blog', item.slug]" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem; flex: 1; text-align: center;">Okumaya Başla</a>
              <a *ngIf="item.external_link" [href]="item.external_link" target="_blank" class="btn btn-secondary" style="padding: 8px 12px; font-size: 0.85rem; border-color: var(--primary-glow);" title="Harici Kaynak Bağlantısı">
                🔗
              </a>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <div class="glass-panel flex-center" style="padding: 100px; flex-direction: column; text-align: center;">
            <p style="font-size: 1.2rem; margin-bottom: 16px;">Bu kategoride henüz yayınlanmış bir içerik bulunmuyor.</p>
            <button class="btn btn-secondary" (click)="onSelectCategory('')">Filtreleri Temizle</button>
          </div>
        </ng-template>
      </div>

    </div>
  `,
  styles: [`
    .sections-nav {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
    }
    .sec-tab-btn {
      flex: 1;
      padding: 12px 18px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      border-radius: 50px;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .sec-tab-btn:hover {
      color: var(--text-main);
      background-color: rgba(255, 255, 255, 0.03);
    }
    .sec-tab-btn.active {
      color: var(--bg-main);
      background-color: var(--primary);
      box-shadow: 0 4px 15px var(--primary-glow);
    }
    
    .cat-filter-btn {
      padding: 6px 16px;
      border: 1px solid var(--border-glass);
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-muted);
      border-radius: 50px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    .cat-filter-btn:hover {
      border-color: var(--text-muted);
      color: var(--text-main);
    }
    .cat-filter-btn.active {
      border-color: var(--primary);
      color: var(--primary);
      background-color: var(--primary-glow);
    }

    .card-title {
      transition: color var(--transition-fast);
    }
    .glass-card:hover .card-title {
      color: var(--primary);
    }
    .flex-between {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class BlogComponent implements OnInit {
  public sections = [
    { id: 'technical', name: 'Teknik Bilgi' },
    { id: 'non_technical', name: 'Teknik Olmayan' },
    { id: 'research', name: 'Araştırmalarım' },
    { id: 'hobby', name: 'Hobilerim' },
    { id: 'book', name: 'Kitaplarım' }
  ];

  public activeSection = 'technical';
  public activeCategorySlug = '';
  public categories: Category[] = [];
  public items: ContentItem[] = [];
  public isLoading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  public onSelectSection(sectionId: string): void {
    this.activeSection = sectionId;
    this.activeCategorySlug = ''; // Reset subcategory filter on section change
    this.loadData();
  }

  public onSelectCategory(slug: string): void {
    this.activeCategorySlug = slug;
    this.loadItems();
  }

  private loadData(): void {
    this.isLoading = true;
    // Load categories for active section
    this.api.getCategories(this.activeSection).subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loadItems();
      },
      error: (err) => {
        console.error("Error fetching categories:", err);
        this.isLoading = false;
      }
    });
  }

  private loadItems(): void {
    this.isLoading = true;
    // Load content items filtered by active section and category
    this.api.getItems(this.activeSection, this.activeCategorySlug).subscribe({
      next: (contentItems) => {
        this.items = contentItems;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching items:", err);
        this.isLoading = false;
      }
    });
  }
}
