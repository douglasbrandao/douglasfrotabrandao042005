import { Location } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ActivatedRoute } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { TutorService } from '../../services/tutor.service';
import { Pet, Tutor } from '../../models/pet.model';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
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
  showEditModal = signal(false);
  editForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor() {
    this.editForm = this.fb.group({
      nome: [''],
      idade: [''],
      raca: ['']
    });

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
        this.editForm.patchValue({
          nome: pet.nome || '',
          idade: pet.idade || '',
          raca: pet.raca || ''
        });
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

  openEditModal() {
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  isEditModalOpen() {
    return this.showEditModal();
  }

  submitEdit() {
    const id = this.pet()?.id;
    if (!id) return;
    const data = this.editForm.value;
    this.petService.update(id, data).subscribe({
      next: (updatedPet: Pet) => {
        this.pet.set(updatedPet);
        this.editForm.patchValue({
          nome: updatedPet.nome || '',
          idade: updatedPet.idade || '',
          raca: updatedPet.raca || ''
        });
        this.closeEditModal();
      },
      error: () => {
        this.errorMessage.set('Erro ao editar pet.');
      }
    });
  }
}
