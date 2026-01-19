import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TutorService } from '../../services/tutor.service';
import { Tutor, TutorListResponse } from '../../models/pet.model';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss']
})
export class TutorListComponent {
  private authService = inject(AuthService);
  private tutorService = inject(TutorService);
  private router = inject(Router);

  tutors = signal<Tutor[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);

  searchName = signal('');

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  constructor() {
    effect(() => {
      this.currentPage();
      this.loadTutors();
    });
  }

  loadTutors(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.tutorService.list({
      page: this.currentPage() - 1,
      size: this.pageSize(),
      nome: this.searchName().trim() || undefined
    }).subscribe({
      next: (response: TutorListResponse) => {
        this.tutors.set(response.content || []);
        this.totalItems.set(response.total || 0);
        this.loading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Erro ao carregar tutores.');
        this.loading.set(false);
        console.error('Erro ao carregar tutores:', error);
      }
    });
  }

  onSearchNameChange(value: string) {
    this.searchName.set(value);
    this.currentPage.set(1);
    this.loadTutors();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/tutor', id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
