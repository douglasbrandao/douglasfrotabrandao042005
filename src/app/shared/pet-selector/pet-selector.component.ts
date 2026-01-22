import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <input type="text" class="input-base w-full mb-2" placeholder="Buscar pet..." [(ngModel)]="query" />
      <div class="input-base w-full bg-white h-40 overflow-auto p-2">
        <ul class="space-y-1">
          @for (pet of filteredPets(); track pet.id) {
            <li>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [checked]="selectedIds().includes(pet.id)" (change)="onToggle(pet.id, $event.target.checked)" />
                <span>{{ pet.nome }}</span>
              </label>
            </li>
          }
        </ul>
      </div>
    </div>
  `
})
export class PetSelectorComponent {
  private petsSignal = signal<Pet[]>([]);
  private q = signal('');

  @Input() set selected(value: number[]) {
    this.selectedIds.set(value ?? []);
  }

  @Input() set pets(value: Pet[]) {
    this.petsSignal.set(value ?? []);
  }

  @Output() selectedChange = new EventEmitter<number[]>();

  get query() {
    return this.q();
  }
  
  set query(v: string) {
    this.q.set(v || '');
  }

  selectedIds = signal<number[]>([]);

  filteredPets = computed(() => this.getOrderedPets());

  private getOrderedPets(): Pet[] {
    const q = this.q().trim().toLowerCase();
    const all = this.petsSignal() || [];

    const filtered = this.filterByName(all, q);
    const selected = this.selectedIds() || [];
    const selectedPets = this.getSelectedPets(filtered, selected);
    const unselectedPets = this.getUnselectedPets(filtered, selected);
    return [...selectedPets, ...unselectedPets];
  }

  private filterByName(pets: Pet[], query: string): Pet[] {
    if (!query) return pets.slice();
    return pets.filter(p => p.nome.toLowerCase().includes(query));
  }

  private getSelectedPets(filtered: Pet[], selectedIds: number[]): Pet[] {
    return selectedIds
      .map(id => filtered.find(p => p.id === id))
      .filter((p): p is Pet => p !== undefined);
  }

  private getUnselectedPets(filtered: Pet[], selectedIds: number[]): Pet[] {
    return filtered.filter(p => !selectedIds.includes(p.id));
  }

  onToggle(petId: number, checked: boolean) {
    const current = this.selectedIds() || [];
    const next = this.getNextSelectedIds(current, petId, checked);
    this.selectedIds.set(next);
    this.selectedChange.emit(next);
  }

  private getNextSelectedIds(current: number[], petId: number, checked: boolean): number[] {
    if (checked) {
      return [petId, ...current.filter(id => id !== petId)];
    }
    return current.filter(id => id !== petId);
  }
}
