import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'pets',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pet-list/pet-list.component').then(m => m.PetListComponent)
  },
  {
    path: 'tutors',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tutor-list/tutor-list.component').then(m => m.TutorListComponent)
  },
  {
    path: 'tutor/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tutor-detail/tutor-detail.component').then(m => m.TutorDetailComponent)
  },
  {
    path: 'pet/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pet-detail/pet-detail.component').then(m => m.PetDetailComponent)
  },
  {
    path: 'pet-create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pet-create/pet-create.component').then(m => m.PetCreateComponent)
  },
  {
    path: 'tutor-create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tutor-create/tutor-create.component').then(m => m.TutorCreateComponent)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
