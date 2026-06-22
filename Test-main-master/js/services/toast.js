import { byId } from '../utils/dom.js';

export function toast(message, type = 'info') {
  const wrap = byId('toastWrap');
  if (!wrap) return;

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  wrap.appendChild(el);

  setTimeout(() => {
    el.style.animation = 'toastOut 250ms forwards';
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 2800);
}
