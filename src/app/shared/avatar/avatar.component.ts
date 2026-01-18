import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" [class]="imgClass()" />
    } @else {
      <div [class]="defaultClass()">
        <ng-content>Sem foto</ng-content>
      </div>
    }
  `,
  styles: []
})
export class AvatarComponent {
  src = input<string | null>(null);
  alt = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');

  readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm': return 'w-12 h-12';
      case 'lg': return 'w-40 h-40';
      default: return 'w-24 h-24';
    }
  });

  readonly imgClass = computed(() =>
    `${this.sizeClass()} object-cover rounded-full bg-white shadow border-2 border-[var(--color-primary)]`
  );

  readonly defaultClass = computed(() =>
    `${this.sizeClass()} flex items-center justify-center rounded-full border-dashed text-[var(--color-secondary)]/60 bg-white border-2 border-[var(--color-primary)] text-sm`
  );
}
