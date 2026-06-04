import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AboutMe {
  id?: string;
  name_surname: string;
  age: number;
  city: string;
  profession: string;
  school: string;
  linkedin_url: string;
  github_url: string;
  bio_paragraph: string;
  photo?: string;
  updated_at?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug?: string;
  section_type: string;
  section_type_display?: string;
  item_count?: number;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  github_url: string;
  stars: number;
  forks: number;
  order: number;
  updated_at: string;
}

export interface ContentItem {
  id?: string;
  category: string;
  category_name?: string;
  category_slug?: string;
  category_section?: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  image?: string | null;
  external_link?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

/** Değerlendirme kriterindeki bölümler */
export interface SectionDef { key: string; label: string; short: string; route: string; color: string; blurb: string; }
export const SECTIONS: SectionDef[] = [
  { key: 'technical',     label: 'Teknik Bilgi',         short: 'Teknik',          route: 'teknik-bilgi',          color: '#0f9d8e', blurb: 'Siber güvenlik, ağ ve yazılım üzerine teknik notlar.' },
  { key: 'non_technical', label: 'Teknik Olmayan Bilgi', short: 'Teknik Olmayan',  route: 'teknik-olmayan-bilgi',  color: '#f4845f', blurb: 'Üretkenlik, kariyer ve kişisel gelişim yazıları.' },
  { key: 'research',      label: 'Araştırmalarım',       short: 'Araştırmalar',    route: 'arastirmalarim',        color: '#7c6cf0', blurb: 'İncelemeler, vaka analizleri ve derin araştırmalar.' },
  { key: 'hobby',         label: 'Hobilerim',            short: 'Hobiler',         route: 'hobilerim',             color: '#e0699a', blurb: 'İş dışında ilgilendiğim aktiviteler ve ilgi alanları.' },
  { key: 'book',          label: 'Okuduğum Kitaplar',    short: 'Kitaplar',        route: 'kitaplar',              color: '#d99a1c', blurb: 'Okuyup değerlendirdiğim kitaplar ve çıkarımlarım.' },
];

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Replit'te frontend ve backend aynı origin'den çalışır (relative URL)
  // Geliştirmede localhost:8000 kullanılır
  private readonly baseUrl = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
    ? '/api'
    : 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ---------- Auth ----------
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, data);
  }

  // ---------- Projects ----------
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects/`);
  }
  createProject(data: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects/`, data);
  }
  updateProject(id: string, data: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/projects/${id}/`, data);
  }
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}/`);
  }

  // ---------- About Me ----------
  getAboutMe(): Observable<AboutMe> {
    return this.http.get<AboutMe>(`${this.baseUrl}/aboutme/`);
  }
  updateAboutMe(data: Partial<AboutMe>, photo?: File | null): Observable<AboutMe> {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'photo' || k === 'id' || k === 'updated_at') return;
      if (v !== undefined && v !== null) form.append(k, String(v));
    });
    if (photo) form.append('photo', photo);
    return this.http.put<AboutMe>(`${this.baseUrl}/aboutme/`, form);
  }

  // ---------- Categories ----------
  getCategories(sectionType?: string): Observable<Category[]> {
    let params = new HttpParams();
    if (sectionType) params = params.set('section_type', sectionType);
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`, { params });
  }
  createCategory(data: { name: string; section_type: string }): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, data);
  }
  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/categories/${id}/`, data);
  }
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}/`);
  }

  // ---------- Content items ----------
  getItems(sectionType?: string, categorySlug?: string): Observable<ContentItem[]> {
    let params = new HttpParams();
    if (sectionType) params = params.set('section_type', sectionType);
    if (categorySlug) params = params.set('category_slug', categorySlug);
    return this.http.get<ContentItem[]>(`${this.baseUrl}/items/`, { params });
  }
  getItem(slugOrId: string): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.baseUrl}/items/${slugOrId}/`);
  }
  createItem(data: Partial<ContentItem>, image?: File | null): Observable<ContentItem> {
    return this.http.post<ContentItem>(`${this.baseUrl}/items/`, this.itemForm(data, image));
  }
  updateItem(id: string, data: Partial<ContentItem>, image?: File | null): Observable<ContentItem> {
    return this.http.patch<ContentItem>(`${this.baseUrl}/items/${id}/`, this.itemForm(data, image));
  }
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}/`);
  }

  private itemForm(data: Partial<ContentItem>, image?: File | null): FormData {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'image' || k === 'id') return;
      if (v !== undefined && v !== null) form.append(k, String(v));
    });
    if (image) form.append('image', image);
    return form;
  }
}
