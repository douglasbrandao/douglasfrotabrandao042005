import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss']
})
export class PetListComponent {
  private petService = inject(PetService);
  private router = inject(Router);

  pets = signal<Pet[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  constructor() {
    this.loadPets();
    
    effect(() => {
      const page = this.currentPage();
      if (page > 1) {
        this.loadPets();
      }
    });
  }

  loadPets(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.petService.list({ 
      page: this.currentPage() - 1, 
      size: this.pageSize() 
    }).subscribe({
      next: (response) => {
        this.pets.set(response.content || []);
        this.totalItems.set(response.total || 0);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Erro ao carregar pets.');
        this.loading.set(false);
        console.error('Erro ao carregar pets:', error);
      }
    });
  }

  changePage(page: number): void {
    this.currentPage.set(page);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/pets', id]);
  }
}
