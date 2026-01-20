import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="flex items-center gap-2">
      <button class="btn-secondary" (click)="prev()" [disabled]="currentPage <= 1">Anterior</button>
      <div class="px-2 text-[var(--color-secondary)] font-medium">Página {{currentPage}} de {{totalPages}}</div>
      <button class="btn-secondary" (click)="next()" [disabled]="currentPage >= totalPages">Próxima</button>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  prev() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
