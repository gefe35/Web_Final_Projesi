import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { BlogComponent } from './pages/blog.component';
import { BlogDetailComponent } from './pages/blog-detail.component';
import { CategoryViewComponent } from './pages/category-view.component';
import { ProjectsComponent } from './pages/projects.component';
import { TerminalComponent } from './pages/terminal.component';
import { LoginComponent } from './pages/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hakkimda', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'kategori/:type', component: CategoryViewComponent },
  { path: 'projeler', component: ProjectsComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

