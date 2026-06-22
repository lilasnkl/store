import { readJson, writeJson } from './storage.js';

const WISHLIST_KEY = 'ts_wish';
let ids = readJson(WISHLIST_KEY, []);

function save() {
  writeJson(WISHLIST_KEY, ids);
}

export function isWished(id) {
  return ids.includes(id);
}

export function getWishlistIds() {
  return [...ids];
}

export function addWishlist(id) {
  if (!isWished(id)) {
    ids.push(id);
    save();
  }
}

export function removeWishlist(id) {
  ids = ids.filter(itemId => itemId !== id);
  save();
}

export function toggleWishlist(id) {
  if (isWished(id)) {
    removeWishlist(id);
    return false;
  }
  addWishlist(id);
  return true;
}
