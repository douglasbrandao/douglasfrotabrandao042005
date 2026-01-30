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
      <div [class]="defaultClass()" aria-hidden="true">
        <svg class="w-1/2 h-1/2 text-inherit" viewBox="0 0 90 90" aria-hidden="true">
          <path class="opacity-[0.45]" fill="currentColor" d="M 45 88 c -11.049 0 -21.18 -2.003 -29.021 -8.634 C 6.212 71.105 0 58.764 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 c 0 13.765 -6.212 26.105 -15.979 34.366 C 66.181 85.998 56.049 88 45 88 z" />
          <path class="opacity-75" fill="currentColor" d="M 45 60.71 c -11.479 0 -20.818 -9.339 -20.818 -20.817 c 0 -11.479 9.339 -20.818 20.818 -20.818 c 11.479 0 20.817 9.339 20.817 20.818 C 65.817 51.371 56.479 60.71 45 60.71 z" />
          <path class="opacity-75" fill="currentColor" d="M 45 90 c -10.613 0 -20.922 -3.773 -29.028 -10.625 c -0.648 -0.548 -0.88 -1.444 -0.579 -2.237 C 20.034 64.919 31.933 56.71 45 56.71 s 24.966 8.209 29.607 20.428 c 0.301 0.793 0.069 1.689 -0.579 2.237 C 65.922 86.227 55.613 90 45 90 z" />
        </svg>
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
    `${this.sizeClass()} flex items-center justify-center rounded-full border-dashed text-[var(--color-secondary)]/50 bg-white/80 border-2 border-[var(--color-primary)]`
  );
}
