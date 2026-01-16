
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private authService = inject(AuthService);
  private petService = inject(PetService);
  private router = inject(Router);

  pets = signal<Pet[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);

  searchName = signal('');

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  constructor() {
    this.loadPets();
    effect(() => {
      this.currentPage();
      this.loadPets();
    });
  }

  loadPets(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.petService.list({ 
      page: this.currentPage() - 1, 
      size: this.pageSize(),
      nome: this.searchName().trim() || undefined
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
  onSearchNameChange(value: string) {
    this.searchName.set(value);
    this.currentPage.set(1);
    this.loadPets();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/pets', id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
