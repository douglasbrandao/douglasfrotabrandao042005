import { Directive, EventEmitter, HostListener, Input, Output, inject, DestroyRef } from '@angular/core';

@Directive({
  selector: '[debounce]',
  standalone: true
})
export class DebounceDirective {
  @Input('debounceTime') debounceTime: number = 300;
  @Output() debounced = new EventEmitter<string>();

  private timer: ReturnType<typeof setTimeout> | null = null;
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.debounced.emit(value), this.debounceTime);
  }
}
