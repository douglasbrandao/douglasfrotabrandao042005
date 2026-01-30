import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TutorService } from '../../services/tutor.service';
import { PetService } from '../../services/pet.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { PetSelectorComponent } from '../../shared/pet-selector/pet-selector.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { Pet } from '../../models/pet.model';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-detail',
  standalone: true,
  imports: [CommonModule, AvatarComponent, ReactiveFormsModule, ModalComponent, RouterModule, PetSelectorComponent],
  templateUrl: './tutor-detail.component.html',
  styleUrls: ['./tutor-detail.component.scss']
})
export class TutorDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tutorService = inject(TutorService);
  private petService = inject(PetService);
  private fb = inject(FormBuilder);
  private title = inject(Title);

  tutorId!: number;
  loading = signal(false);
  errorMessage = signal('');

  tutor = signal<Tutor | null>(null);

  editForm!: FormGroup;

  allPets = signal<Pet[]>([]);
  selectedPets = signal<number[]>([]);

  constructor() {
    this.editForm = this.fb.group({
      nome: [''],
      telefone: [''],
      endereco: [''],
      pets: [[] as number[]]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Pet não encontrado.');
      this.loading.set(false);
      return;
    }
    this.tutorId = Number(id);
    this.load();
    this.loadPets();
  }

  showEdit = signal(false);
  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;
  avatarSrc = computed(() => this.avatarPreview() || this.tutor()?.foto?.url || null);

  load(): void {
    this.loading.set(true);
    this.tutorService.getById(this.tutorId).subscribe({
      next: (t: Tutor) => {
        this.tutor.set(t);
        this.title.setTitle(`Tutor: ${t.nome || 'Sem nome'} | Pet Manager`);
          this.editForm.patchValue({
            nome: t.nome || '',
            telefone: t.telefone || '',
            endereco: t.endereco || '',
            pets: (t.pets || []).map((p: Pet) => p.id)
          });
          const petIds: number[] = (t.pets || []).map((p: Pet) => p.id);
          this.selectedPets.set(petIds);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Erro ao carregar tutor.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadPets(): void {
    this.petService.list({ size: 9999 }).subscribe({
      next: (res) => this.allPets.set(res.content || []),
      error: (err) => console.error('Erro ao carregar pets:', err)
    });
  }

  onSelectedChange(ids: number[]) {
    this.selectedPets.set(ids || []);
    this.editForm.get('pets')?.setValue(ids || []);
  }

  save(): void {
    if (this.editForm.invalid) return;

    const raw = this.editForm.value;
    const nome = raw.nome || '';
    const telefone = raw.telefone || '';
    const endereco = raw.endereco || '';
    const payload = { nome, telefone, endereco };

    if (!this.tutorService.update) return;

    const previousPetIds: number[] = (this.tutor()?.pets || []).map((p: Pet) => p.id);

    this.loading.set(true);

    this.tutorService.update(this.tutorId, payload).pipe(
      switchMap((updated: Tutor) => {
        const merged = updated || { ...(this.tutor() || {}), ...payload };
        this.tutor.set(merged);
        // INFO: Melhor usar um forkJoin/of aqui para evitar problemas com observables vazios
        const ops = this.buildPetLinkRequests(previousPetIds, this.editForm.get('pets')?.value || []);
        return ops.length ? forkJoin(ops) : of(null);
      }),
      switchMap(() => this.avatarFile ? this.tutorService.uploadPhoto(this.tutorId, this.avatarFile) : of(null)),
      switchMap(() => this.tutorService.getById(this.tutorId)),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (fresh: Tutor) => {
        this.tutor.set(fresh);
        const ids = (fresh.pets || []).map((p: Pet) => p.id);
        this.selectedPets.set(ids);
        this.editForm.get('pets')?.setValue(ids);
        this.avatarPreview.set(null);
        this.avatarFile = null;
        this.showEdit.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao salvar tutor:', err);
        this.errorMessage.set('Erro ao salvar tutor. Verifique o console.');
        this.showEdit.set(false);
      }
    });
  }

  private buildPetLinkRequests(previousIds: number[], afterIds: number[]) {
    const toLink = afterIds.filter(id => !previousIds.includes(id));
    const toUnlink = previousIds.filter(id => !afterIds.includes(id));
    return [
      ...toLink.map(id => this.tutorService.linkPet(this.tutorId, id)),
      ...toUnlink.map(id => this.tutorService.unlinkPet(this.tutorId, id))
    ];
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

  openEdit() {
    this.showEdit.set(true);
  }

  closeEdit() {
    this.showEdit.set(false);
  }

  linkPet(petId: number): void {
    this.tutorService.linkPet(this.tutorId, petId).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Erro ao vincular pet:', err)
    });
  }

  unlinkPet(petId: number): void {
    this.tutorService.unlinkPet(this.tutorId, petId).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Erro ao desvincular pet:', err)
    });
  }

  back(): void {
    this.router.navigate(['/tutors']);
  }

}
