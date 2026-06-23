import type { Product } from '../types';

let registered: ((product: Product, quantity?: number) => void) | null = null;

export function registerAddToCart(fn: (product: Product, quantity?: number) => void) {
  registered = fn;
}

export function addProductToCart(product: Product, quantity = 1) {
  registered?.(product, quantity);
}
