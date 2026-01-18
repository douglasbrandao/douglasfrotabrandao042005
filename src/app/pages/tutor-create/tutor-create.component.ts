
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { PetService } from '../../services/pet.service';
import { TutorService } from '../../services/tutor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutor-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent],
  templateUrl: './tutor-create.component.html',
  styleUrls: ['./tutor-create.component.scss']
})
export class TutorCreateComponent {
  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private tutorService = inject(TutorService);
  private router = inject(Router);

  tutorForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[0-9]{8,9}$/)]],
    address: ['', Validators.required],
    pets: [[], Validators.required]
  });

  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;

  selectedPets = signal<number[]>([]);
  petSearch = signal('');
  filteredPets = computed(() => {
    const q = this.petSearch().trim().toLowerCase();
    const all = this.petService.allPets ? this.petService.allPets() : [];
    if (!q) return all;
    return all.filter(p => p.nome.toLowerCase().includes(q));
  });

  constructor() {
    this.petService.fetchAllPets();
  }

  onSelectPets(event: Event) {
    const select = event.target as HTMLSelectElement;
    const values = Array.from(select.selectedOptions).map(o => Number(o.value));
    this.selectedPets.set(values);
    this.tutorForm.get('pets')?.setValue(values);
  }

  onPetSearch(query: string) {
    this.petSearch.set(query);
  }

  submit() {
    if (this.tutorForm.invalid) {
      this.tutorForm.markAllAsTouched();
      this.tutorForm.get('pets')?.markAsTouched();
      return;
    }
    const { name, phone, address } = this.tutorForm.value;
    this.tutorService.create({ nome: name, telefone: phone, endereco: address }).subscribe({
      next: (tutor) => {
        if (this.avatarFile && tutor.id) {
          this.tutorService.uploadPhoto(tutor.id, this.avatarFile).subscribe();
        }
        for (const petId of this.selectedPets()) {
          this.tutorService.linkPet(tutor.id, petId).subscribe();
        }
        this.router.navigate(['/']);
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
