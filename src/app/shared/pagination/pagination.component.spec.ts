import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PaginationComponent]
    });
  });

  it('deve criar o componente e renderizar estado inicial', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Página 1 de 1');
  });

  it('prev não deve fazer emit quando estiver na página 1', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    let emitted: number | null = null;
    comp.pageChange.subscribe(v => emitted = v);
    comp.prev();
    expect(emitted).toBeNull();
  });

  it('prev deve fazer emit da página - 1 quando possível', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.currentPage = 3;
    comp.totalPages = 5;
    let emitted: number | null = null;
    comp.pageChange.subscribe(v => emitted = v);
    comp.prev();
    expect(emitted).toBe(2);
  });

  it('next não deve fazer emit quando estiver na última página', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.currentPage = 2;
    comp.totalPages = 2;
    let emitted: number | null = null;
    comp.pageChange.subscribe(v => emitted = v);
    comp.next();
    expect(emitted).toBeNull();
  });

  it('next deve fazer emit da página + 1 quando possível', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.currentPage = 1;
    comp.totalPages = 3;
    let emitted: number | null = null;
    comp.pageChange.subscribe(v => emitted = v);
    comp.next();
    expect(emitted).toBe(2);
  });
});
