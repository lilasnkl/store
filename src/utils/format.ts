import type { Product } from '../types';

export function fmt(value: number): string {
  return '$' + Number(value || 0).toFixed(2);
}

export function discountPrice(product: Product | undefined | null): number {
  const discount = product?.discountPercentage || 0;
  const price = product?.price || 0;
  return +(price * (1 - discount / 100)).toFixed(2);
}

export function capitalize(value: string | undefined | null): string {
  if (!value) return '';
  return String(value).replace(/\b\w/g, (character) => character.toUpperCase());
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 250): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function starHtml(rating: number, className = 'plp-card-star'): string {
  const full = Math.round(Number(rating || 0));
  return Array.from({ length: 5 }, (_, index) => (
    `<span class="${className}${index + 1 <= full ? '' : ' empty'}">&#9733;</span>`
  )).join('');
}
