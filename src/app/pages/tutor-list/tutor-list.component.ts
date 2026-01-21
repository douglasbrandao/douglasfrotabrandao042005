import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { Router } from '@angular/router';
import { TutorService } from '../../services/tutor.service';
import { Tutor, TutorListResponse } from '../../models/pet.model';
import { usePagination } from '../../shared/use-pagination';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { DebounceDirective } from '../../shared/debounce/debounce.directive';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent, PaginationComponent, DebounceDirective],
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss']
})
export class TutorListComponent {
  private tutorService = inject(TutorService);
  private router = inject(Router);

  tutors = signal<Tutor[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  
  pagination = usePagination({ initialPage: 1, initialSize: 10 });

  searchName = signal('');

  constructor() {
    effect(() => {
      this.pagination.currentPage();
      this.loadTutors();
    });
  }

  loadTutors(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.tutorService.list({
      page: this.pagination.currentPage() - 1,
      size: this.pagination.pageSize(),
      nome: this.searchName().trim() || undefined
    }).subscribe({
      next: (response: TutorListResponse) => {
        this.tutors.set(response.content || []);
        this.pagination.setTotal(response.total || 0);
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
    this.pagination.setPage(1);
  }

  changePage(page: number): void {
    this.pagination.setPage(page);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/tutor', id]);
  }

}
