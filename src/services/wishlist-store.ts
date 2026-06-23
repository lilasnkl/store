import { readJson, writeJson } from './storage';

const WISHLIST_KEY = 'ts_wish';
let ids: number[] = readJson<number[]>(WISHLIST_KEY, []);

function save(): void {
  writeJson(WISHLIST_KEY, ids);
}

export function isWished(id: number): boolean {
  return ids.includes(id);
}

export function getWishlistIds(): number[] {
  return [...ids];
}

export function addWishlist(id: number): void {
  if (!isWished(id)) {
    ids.push(id);
    save();
  }
}

export function removeWishlist(id: number): void {
  ids = ids.filter((itemId) => itemId !== id);
  save();
}

export function toggleWishlist(id: number): boolean {
  if (isWished(id)) {
    removeWishlist(id);
    return false;
  }
  addWishlist(id);
  return true;
}
