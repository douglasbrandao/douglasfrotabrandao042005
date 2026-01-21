import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebounceDirective } from './debounce.directive';

@Component({
  standalone: true,
  imports: [DebounceDirective],
  template: `<input debounce [debounceTime]="time" (debounced)="onDebounced($event)" />`
})
class HostComponent {
  time = 200;
  last: string | null = null;
  onDebounced(v: string) { this.last = v; }
}

describe('DebounceDirective', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HostComponent, DebounceDirective]
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve fazer emit após debounceTime', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));

    // Não deve emitir antes do debounceTime
    vi.advanceTimersByTime(150);
    fixture.detectChanges();
    expect(fixture.componentInstance.last).toBeNull();
    
    // Depois do debounceTime deve emitir
    vi.advanceTimersByTime(100);
    fixture.detectChanges();
    expect(fixture.componentInstance.last).toBe('abc');
  });

  it('deve cancelar timer anterior e fazer emit somente do último valor', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    input.value = 'ab';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));

    // avançou 200ms no total mas os timers foram resetados; ainda precisa do debounceTime do último
    vi.advanceTimersByTime(199);
    fixture.detectChanges();
    expect(fixture.componentInstance.last).toBeNull();
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.last).toBe('abc');
  });
});
