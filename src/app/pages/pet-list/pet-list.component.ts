import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';
import { usePagination } from '../../shared/use-pagination';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent, PaginationComponent],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss']
})
export class PetListComponent {
  private petService = inject(PetService);
  private router = inject(Router);

  pets = signal<Pet[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  
  pagination = usePagination({ initialPage: 1, initialSize: 10 });

  searchName = signal('');

  constructor() {
    effect(() => {
      this.pagination.currentPage();
      this.loadPets();
    });
  }

  loadPets(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.petService.list({ 
      page: this.pagination.currentPage() - 1, 
      size: this.pagination.pageSize(),
      nome: this.searchName().trim() || undefined
    }).subscribe({
      next: (response) => {
        this.pets.set(response.content || []);
        this.pagination.setTotal(response.total || 0);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Erro ao carregar pets.');
        this.loading.set(false);
        console.error('Erro ao carregar pets:', error);
      }
    });
  }
  onSearchNameChange(value: string) {
    this.searchName.set(value);
    this.pagination.setPage(1);
    this.loadPets();
  }

  changePage(page: number): void {
    this.pagination.setPage(page);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/pet', id]);
  }

}
