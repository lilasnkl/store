import { byId, on } from '../utils/dom.js';
import { fmt } from '../utils/format.js';
import { addCartItem, cartItemCount, cartTotal, changeCartQuantity, getCartItems, removeCartItem } from '../services/cart-store.js';
import { toast } from '../services/toast.js';

function renderCartItems() {
  const itemsEl = byId('cartItems');
  if (!itemsEl) return;

  const items = getCartItems();
  if (!items.length) {
    itemsEl.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img" loading="lazy" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.title}</p>
        <p class="cart-item-price">${fmt(item.price)}</p>
        <div class="qty-row">
          <button class="qty-btn" data-id="${item.id}" data-d="-1">&#8722;</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-d="1">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove">&#x2715;</button>
    `;

    on(el.querySelector('.cart-item-remove'), 'click', () => {
      removeCartItem(item.id);
      updateCartUI();
    });

    el.querySelectorAll('.qty-btn').forEach(button => {
      on(button, 'click', () => {
        changeCartQuantity(Number(button.dataset.id), Number(button.dataset.d));
        updateCartUI();
      });
    });

    fragment.appendChild(el);
  });

  itemsEl.innerHTML = '';
  itemsEl.appendChild(fragment);
}

export function updateCartUI() {
  const count = cartItemCount();
  const badge = byId('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  }

  const countEl = byId('cartItemCount');
  if (countEl) countEl.textContent = count;

  const totalEl = byId('cartTotal');
  if (totalEl) totalEl.textContent = fmt(cartTotal());

  const footer = byId('cartFooter');
  if (footer) footer.hidden = getCartItems().length === 0;

  renderCartItems();
}

export function addProductToCart(product, quantity = 1) {
  addCartItem(product, quantity);
  updateCartUI();
  toast((product.title || 'Item') + ' added to cart', 'success');
}

export function openCartDrawer() {
  byId('cartSidebar')?.classList.add('open');
  byId('cartOverlay')?.classList.add('open');
}

export function closeCartDrawer() {
  byId('cartSidebar')?.classList.remove('open');
  byId('cartOverlay')?.classList.remove('open');
}

export function initCartDrawer() {
  on(byId('cartBtn'), 'click', openCartDrawer);
  on(byId('cartClose'), 'click', closeCartDrawer);
  on(byId('cartOverlay'), 'click', closeCartDrawer);
  on(document, 'keydown', event => {
    if (event.key === 'Escape') closeCartDrawer();
  });
  updateCartUI();
}
