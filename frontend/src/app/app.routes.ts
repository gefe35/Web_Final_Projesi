import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { BlogComponent } from './pages/blog.component';
import { BlogDetailComponent } from './pages/blog-detail.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { DashboardComponent } from './pages/dashboard.component';
import { ProjectsComponent } from './pages/projects.component';
import { TerminalComponent } from './pages/terminal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hakkimda', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projeler', component: ProjectsComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: '**', redirectTo: '' } // Fallback to Home
];

