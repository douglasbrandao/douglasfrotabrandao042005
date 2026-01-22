
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { PetSelectorComponent } from '../../shared/pet-selector/pet-selector.component';
import { PetService } from '../../services/pet.service';
import { TutorService } from '../../services/tutor.service';
import { Router } from '@angular/router';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-tutor-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent, PetSelectorComponent],
  templateUrl: './tutor-create.component.html',
  styleUrls: ['./tutor-create.component.scss']
})
export class TutorCreateComponent {
  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private tutorService = inject(TutorService);
  private router = inject(Router);

  tutorForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[0-9]{8,9}$/)]],
    endereco: ['', Validators.required],
    pets: [[], Validators.required]
  });

  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;

  allPets = signal<Pet[]>([]);
  selectedPets = signal<number[]>([]);

  constructor() {
    this.petService.list({ size: 9999 }).subscribe({
      next: (res) => this.allPets.set(res.content || []),
      error: (err) => console.error('Erro ao carregar pets:', err)
    });
  }

  onSelectedChange(ids: number[]) {
    this.selectedPets.set(ids || []);
    this.tutorForm.get('pets')?.setValue(ids || []);
  }

  submit() {
    if (this.tutorForm.invalid) {
      this.tutorForm.markAllAsTouched();
      this.tutorForm.get('pets')?.markAsTouched();
      return;
    }
    const { nome, telefone, endereco } = this.tutorForm.value;
    this.tutorService.create({ nome, telefone, endereco }).subscribe({
      next: (tutor) => {
        if (this.avatarFile && tutor.id) {
          this.tutorService.uploadPhoto(tutor.id, this.avatarFile).subscribe();
        }
        for (const petId of this.selectedPets()) {
          this.tutorService.linkPet(tutor.id, petId).subscribe();
        }
        this.router.navigate(['/tutor', tutor.id]);
      },
      error: () => {}
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
      reader.readAsDataURL(this.avatarFile);
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
