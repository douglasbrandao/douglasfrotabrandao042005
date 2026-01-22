import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PetSelectorComponent } from './pet-selector.component';
import { Pet } from '../../models/pet.model';

describe('PetSelectorComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PetSelectorComponent]
    });
  });

  it('deve criar o componente e renderizar pets recebidos via input', () => {
    const fixture = TestBed.createComponent(PetSelectorComponent);
    const comp = fixture.componentInstance;
    const pets: Pet[] = [
      { id: 1, nome: 'Toto', raca: 'Vira-lata', idade: 3 },
      { id: 2, nome: 'Mimi', raca: 'SRD', idade: 2 }
    ];
    comp.pets = pets;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Toto');
    expect(el.textContent).toContain('Mimi');
  });

  it('deve filtrar pets pela query', () => {
    const fixture = TestBed.createComponent(PetSelectorComponent);
    const comp = fixture.componentInstance;
    const pets: Pet[] = [
      { id: 1, nome: 'Rex', raca: 'Vira-lata', idade: 5 },
      { id: 2, nome: 'Luna', raca: 'SRD', idade: 1 }
    ];
    comp.pets = pets;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    input.value = 'Luna';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Luna');
    expect(el.textContent).not.toContain('Rex');
  });

  it('deve fazer o emit do selectedChange quando um pet for selecionado', () => {
    const fixture = TestBed.createComponent(PetSelectorComponent);
    const comp = fixture.componentInstance;
    const pets: Pet[] = [
      { id: 10, nome: 'Bolt', raca: 'Greyhound', idade: 4 }
    ];
    comp.pets = pets;
    fixture.detectChanges();

    let emitted: number[] | null = null;
    comp.selectedChange.subscribe(v => emitted = v);
    comp.onToggle(10, true);
    expect(emitted).toEqual([10]);
  });

  it('deve manter os pets selecionados sempre no início da lista', () => {
    const fixture = TestBed.createComponent(PetSelectorComponent);
    const comp = fixture.componentInstance;
    const pets: Pet[] = [
      { id: 1, nome: 'Toto', raca: 'Vira-lata', idade: 3 },
      { id: 2, nome: 'Mimi', raca: 'SRD', idade: 2 },
      { id: 3, nome: 'Rex', raca: 'Poodle', idade: 5 }
    ];
    comp.pets = pets;
    comp.selected = [2];
    fixture.detectChanges();

    // Mimi deve estar no início
    let ordered = comp.filteredPets();
    expect(ordered[0].id).toBe(2);
    expect(ordered.map(p => p.id)).toEqual([2,1,3]);

    // Rex deve ir para o início
    comp.onToggle(3, true);
    fixture.detectChanges();
    ordered = comp.filteredPets();
    expect(ordered.map(p => p.id)).toEqual([3,2,1]);

    // Toto deve ir para o início
    comp.onToggle(1, true);
    fixture.detectChanges();
    ordered = comp.filteredPets();
    expect(ordered.map(p => p.id)).toEqual([1,3,2]);

    // Rex deve sair do início
    comp.onToggle(3, false);
    fixture.detectChanges();
    ordered = comp.filteredPets();
    expect(ordered.map(p => p.id)).toEqual([1,2,3]);
  });
});
