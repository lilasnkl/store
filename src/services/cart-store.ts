import type { CartItem, Product } from '../types';
import { readJson, writeJson } from './storage';
import { discountPrice } from '../utils/format';

const CART_KEY = 'ts_cart';
let items: CartItem[] = readJson<CartItem[]>(CART_KEY, []);

function save(): void {
  writeJson(CART_KEY, items);
}

export function getCartItems(): CartItem[] {
  return items;
}

export function addCartItem(product: Product, quantity = 1): void {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += quantity;
  } else {
    items.push({
      id: product.id,
      title: product.title || 'Product',
      price: discountPrice(product),
      thumbnail: product.thumbnail || '',
      qty: quantity,
    });
  }
  save();
}

export function removeCartItem(id: number): void {
  items = items.filter((item) => item.id !== id);
  save();
}

export function changeCartQuantity(id: number, delta: number): void {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  save();
}

export function setCartQuantity(id: number, quantity: number): void {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, Number(quantity) || 1);
  save();
}

export function clearCart(): void {
  items = [];
  save();
}

export function cartItemCount(): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
