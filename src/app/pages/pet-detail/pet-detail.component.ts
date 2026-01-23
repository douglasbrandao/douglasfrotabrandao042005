import { Location } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { TutorService } from '../../services/tutor.service';
import { Pet } from '../../models/pet.model';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, AvatarComponent, RouterModule, RouterLink],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.scss']
})
export class PetDetailComponent {
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private petService = inject(PetService);
  private tutorService = inject(TutorService);

  pet = signal<Pet | null>(null);
  tutors = signal<Tutor[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  showEditModal = signal(false);
  editForm!: FormGroup;

  private fb = inject(FormBuilder);
  
  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;

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
          const tutors = pet.tutores as Tutor[];
          this.tutors.set(tutors.map(t => ({ ...t })));
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
        if (this.avatarFile) {
          this.petService.uploadPhoto(id, this.avatarFile).subscribe({
            next: () => {
              this.petService.getById(id).subscribe({
                next: (updatedPet: Pet) => {
                  this.pet.set(updatedPet);
                  this.avatarPreview.set(null);
                  this.avatarFile = null;
                  this.closeEditModal();
                },
                error: () => {
                  this.errorMessage.set('Erro ao atualizar dados do pet.');
                }
              });
            },
            error: () => {
              this.errorMessage.set('Erro ao enviar foto.');
            }
          });
        } else {
          this.pet.set(updatedPet);
          this.closeEditModal();
        }
      },
      error: () => {
        this.errorMessage.set('Erro ao editar pet.');
      }
    });
  }
  
  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview.set(e.target.result);
      };
      if (this.avatarFile) {
        reader.readAsDataURL(this.avatarFile);
      }
    }
  }

  avatarSrc = computed(() => this.avatarPreview() || this.pet()?.foto?.url || null);
}
