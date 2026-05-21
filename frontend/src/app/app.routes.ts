import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { BlogComponent } from './pages/blog.component';
import { BlogDetailComponent } from './pages/blog-detail.component';
import { ProjectsComponent } from './pages/projects.component';
import { TerminalComponent } from './pages/terminal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hakkimda', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'projeler', component: ProjectsComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: '**', redirectTo: '' }
];

