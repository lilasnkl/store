import { readJson, writeJson } from './storage.js';
import { discountPrice } from '../utils/format.js';

const CART_KEY = 'ts_cart';
let items = readJson(CART_KEY, []);

function save() {
  writeJson(CART_KEY, items);
}

export function getCartItems() {
  return items;
}

export function addCartItem(product, quantity = 1) {
  const existing = items.find(item => item.id === product.id);
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

export function removeCartItem(id) {
  items = items.filter(item => item.id !== id);
  save();
}

export function changeCartQuantity(id, delta) {
  const item = items.find(entry => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  save();
}

export function setCartQuantity(id, quantity) {
  const item = items.find(entry => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, Number(quantity) || 1);
  save();
}

export function clearCart() {
  items = [];
  save();
}

export function cartItemCount() {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal() {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
