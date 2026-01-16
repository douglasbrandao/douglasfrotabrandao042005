import { Location } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { TutorService } from '../../services/tutor.service';
import { Pet, Tutor } from '../../models/pet.model';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.scss']
})
export class PetDetailComponent {
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private petService = inject(PetService);
  private tutorService = inject(TutorService);

  pet = signal<Pet | null>(null);
  tutor = signal<Tutor | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('Pet não encontrado.');
      this.loading.set(false);
      return;
    }
    this.petService.getById(id).subscribe({
      next: (pet: Pet) => {
        this.pet.set(pet);
        this.loading.set(false);
        if (pet.tutores && pet.tutores.length > 0) {
          this.tutorService.getById(pet.tutores[0].id).subscribe({
            next: (tutor: Tutor) => {
              const contato = [tutor.telefone, tutor.email].filter(Boolean).join(' | ');
              this.tutor.set({ ...tutor, contato });
            },
            error: () => this.tutor.set(null)
          });
        }
      },
      error: () => {
        this.errorMessage.set('Erro ao carregar pet.');
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
