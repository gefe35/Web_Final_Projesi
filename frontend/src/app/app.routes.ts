import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { SectionComponent } from './pages/section.component';
import { ContentDetailComponent } from './pages/content-detail.component';
import { ProjectsComponent } from './pages/projects.component';
import { LoginComponent } from './pages/login.component';
import { ManagementComponent } from './pages/management.component';
import { authGuard } from './guards/auth.guard';

import { RegisterComponent } from './pages/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Göktuğ Efe Madran | Kişisel Blog' },
  { path: 'hakkimda', component: AboutComponent, title: 'Hakkımda' },

  // Değerlendirme kriterindeki 5 içerik bölümü
  { path: 'teknik-bilgi', component: SectionComponent, data: { section: 'technical' }, title: 'Teknik Bilgi' },
  { path: 'teknik-olmayan-bilgi', component: SectionComponent, data: { section: 'non_technical' }, title: 'Teknik Olmayan Bilgi' },
  { path: 'arastirmalarim', component: SectionComponent, data: { section: 'research' }, title: 'Araştırmalarım' },
  { path: 'hobilerim', component: SectionComponent, data: { section: 'hobby' }, title: 'Hobilerim' },
  { path: 'kitaplar', component: SectionComponent, data: { section: 'book' }, title: 'Okuduğum Kitaplar' },

  { path: 'icerik/:slug', component: ContentDetailComponent },
  { path: 'projeler', component: ProjectsComponent, title: 'Projeler' },

  { path: 'giris', component: LoginComponent, title: 'Giriş' },
  { path: 'kayit-ol', component: RegisterComponent, title: 'Kayıt Ol' },
  { path: 'yonetim', component: ManagementComponent, canActivate: [authGuard], title: 'Yönetim Paneli' },

  // Eski bağlantı yönlendirmeleri
  { path: 'login', redirectTo: 'giris', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'yonetim', pathMatch: 'full' },

  { path: '**', redirectTo: '' },
];
