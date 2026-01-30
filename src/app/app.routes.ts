import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const APP_TITLE = 'Pet Manager';

export const routes: Routes = [
  {
    path: 'login',
    title: `Login | ${APP_TITLE}`,
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    title: `Início | ${APP_TITLE}`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'pets',
    title: `Pets | ${APP_TITLE}`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pet-list/pet-list.component').then(m => m.PetListComponent)
  },
  {
    path: 'tutors',
    title: `Tutores | ${APP_TITLE}`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tutor-list/tutor-list.component').then(m => m.TutorListComponent)
  },
  {
    path: 'tutor/:id',
    title: `Tutor | ${APP_TITLE}`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tutor-detail/tutor-detail.component').then(m => m.TutorDetailComponent)
  },
  {
    path: 'pet/:id',
    title: `Pet | ${APP_TITLE}`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pet-detail/pet-detail.component').then(m => m.PetDetailComponent)
  },
  {
    path: 'pet-create',
    title: `Cadastrar pet | ${APP_TITLE}`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pet-create/pet-create.component').then(m => m.PetCreateComponent)
  },
  {
    path: 'tutor-create',
    title: `Cadastrar tutor | ${APP_TITLE}`,
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
