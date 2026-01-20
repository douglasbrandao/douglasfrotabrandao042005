import { signal, computed } from '@angular/core';

export interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

export function usePagination(opts: UsePaginationOptions = {}) {
  const currentPage = signal(opts.initialPage ?? 1);
  const pageSize = signal(opts.initialSize ?? 10);
  const totalItems = signal(0);

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems() / pageSize())));

  function setTotal(total: number) {
    totalItems.set(total);
  }

  function setPage(page: number) {
    const p = Math.max(1, Math.min(page, totalPages()));
    currentPage.set(p);
  }

  function setSize(size: number) {
    pageSize.set(Math.max(1, size));
    if (currentPage() > totalPages()) {
      currentPage.set(totalPages());
    }
  }

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setTotal,
    setPage,
    setSize
  };
}
