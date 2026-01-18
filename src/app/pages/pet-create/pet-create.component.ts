import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { PetService } from '../../services/pet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent],
  templateUrl: './pet-create.component.html',
  styleUrls: ['./pet-create.component.scss']
})
export class PetCreateComponent {
  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private router = inject(Router);

  petForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    idade: ['', [Validators.required, Validators.min(0)]],
    raca: ['', Validators.required]
  });

  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;

  submit() {
    if (this.petForm.invalid) return;
    const { nome, idade, raca } = this.petForm.value;
    this.petService.create({ nome, idade, raca }).subscribe({
      next: (pet) => {
        if (this.avatarFile && pet.id) {
          this.petService.uploadPhoto(pet.id, this.avatarFile).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.router.navigate(['/'])
          });
        } else {
          this.router.navigate(['/']);
        }
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
