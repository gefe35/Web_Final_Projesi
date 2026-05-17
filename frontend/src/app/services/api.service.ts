import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  image?: string;
  external_link?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  // --- Hakkımda (About Me) ---
  public getAboutMe(): Observable<AboutMe> {
    return this.http.get<AboutMe>(`${this.baseUrl}/aboutme/`);
  }

  public updateAboutMe(data: FormData): Observable<AboutMe> {
    return this.http.put<AboutMe>(`${this.baseUrl}/aboutme/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // --- Kategoriler (Categories) ---
  public getCategories(sectionType?: string): Observable<Category[]> {
    let params = new HttpParams();
    if (sectionType) {
      params = params.set('section_type', sectionType);
    }
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`, { params });
  }

  public createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, category, {
      headers: this.getAuthHeaders()
    });
  }

  public updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}/`, category, {
      headers: this.getAuthHeaders()
    });
  }

  public deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // --- İçerik Öğeleri (Content Items) ---
  public getItems(sectionType?: string, categorySlug?: string): Observable<ContentItem[]> {
    let params = new HttpParams();
    if (sectionType) {
      params = params.set('section_type', sectionType);
    }
    if (categorySlug) {
      params = params.set('category_slug', categorySlug);
    }
    return this.http.get<ContentItem[]>(`${this.baseUrl}/items/`, { params });
  }

  public getItem(slugOrId: string): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.baseUrl}/items/${slugOrId}/`);
  }

  public createItem(data: FormData): Observable<ContentItem> {
    return this.http.post<ContentItem>(`${this.baseUrl}/items/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  public updateItem(id: string, data: FormData): Observable<ContentItem> {
    return this.http.put<ContentItem>(`${this.baseUrl}/items/${id}/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  public deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }
}
