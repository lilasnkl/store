import { CATALOG_PRODUCTS, DETAIL_DEFAULT_ID, fetchRelatedProducts } from '../data/catalog.js';
import { initAuthSimulation } from '../components/auth-simulation.js';
import { buildRelatedCard } from '../components/product-cards.js';
import { initNewsletterForm } from '../components/newsletter-form.js';
import { initSearchBox } from '../components/search-autocomplete.js';
import { byId } from '../utils/dom.js';
import { fmt } from '../utils/format.js';
import { cartItemCount, cartTotal, clearCart, getCartItems, removeCartItem, setCartQuantity } from '../services/cart-store.js';
import { addWishlist, isWished } from '../services/wishlist-store.js';
import { toast } from '../services/toast.js';

const SHIPPING = 10;
const TAX_RATE = 0.08;

function findCatalogProduct(id) {
  return CATALOG_PRODUCTS.find(product => product.id === id);
}

function totals() {
  const subtotal = cartTotal();
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > 0 ? SHIPPING : 0;
  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
  };
}

function renderEmpty() {
  const list = byId('cartPageItems');
  if (!list) return;
  list.innerHTML = `
    <div class="cart-empty-page">
      <strong>Your cart is empty</strong>
      <p>Browse products and add items to build your sourcing order.</p>
      <a href="/products.html" class="commerce-primary-link">Browse products</a>
    </div>
  `;
}

function renderCartItems() {
  const list = byId('cartPageItems');
  if (!list) return;
  const items = getCartItems();
  setSummaryCount();

  if (!items.length) {
    renderEmpty();
    return;
  }

  list.innerHTML = items.map(item => `
    <article class="cart-page-item" data-id="${item.id}">
      <a class="cart-page-img" href="/detail.html?id=${item.id}">
        <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
      </a>
      <div class="cart-page-info">
        <a href="/detail.html?id=${item.id}" class="cart-page-title">${item.title}</a>
        <p>Seller: ${findCatalogProduct(item.id)?.supplier?.name || 'Brand verified supplier'}</p>
        <p>Shipping: Free standard pickup available</p>
        <div class="cart-page-actions">
          <button class="cart-remove" data-action="remove">Remove</button>
          <button class="cart-save" data-action="save">${isWished(item.id) ? 'Saved' : 'Save for later'}</button>
        </div>
      </div>
      <div class="cart-page-controls">
        <strong>${fmt(item.price * item.qty)}</strong>
        <select class="cart-qty" aria-label="Quantity">
          ${Array.from({ length: 9 }, (_, index) => {
            const value = index + 1;
            return `<option value="${value}" ${value === item.qty ? 'selected' : ''}>Qty: ${value}</option>`;
          }).join('')}
        </select>
      </div>
    </article>
  `).join('');

  list.querySelectorAll('.cart-page-item').forEach(itemEl => {
    const id = Number(itemEl.dataset.id);
    itemEl.querySelector('.cart-qty')?.addEventListener('change', event => {
      const next = Number(event.target.value);
      setCartQuantity(id, next);
      renderCartPage();
    });
    itemEl.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
      removeCartItem(id);
      renderCartPage();
      toast('Item removed from cart', 'info');
    });
    itemEl.querySelector('[data-action="save"]')?.addEventListener('click', event => {
      addWishlist(id);
      event.currentTarget.textContent = 'Saved';
      toast('Saved to wishlist locally', 'success');
    });
  });
}

function setSummaryCount() {
  const count = cartItemCount();
  const countLabel = byId('cartPageCount');
  if (countLabel) countLabel.textContent = `${count} item${count === 1 ? '' : 's'}`;
  const badge = byId('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  }
}

function renderSummary() {
  const values = totals();
  const subtotal = byId('summarySubtotal');
  const shipping = byId('summaryShipping');
  const tax = byId('summaryTax');
  const total = byId('summaryTotal');
  const checkout = byId('checkoutBtn');
  if (subtotal) subtotal.textContent = fmt(values.subtotal);
  if (shipping) shipping.textContent = fmt(values.shipping);
  if (tax) tax.textContent = fmt(values.tax);
  if (total) total.textContent = fmt(values.total);
  if (checkout) checkout.disabled = getCartItems().length === 0;
}

async function renderRecommended() {
  const container = byId('cartRecommended');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  const related = await fetchRelatedProducts(DETAIL_DEFAULT_ID, 4);
  related.forEach(product => fragment.appendChild(buildRelatedCard(product)));
  container.innerHTML = '';
  container.appendChild(fragment);
}

function wireActions() {
  byId('clearCartBtn')?.addEventListener('click', () => {
    clearCart();
    renderCartPage();
    toast('Cart cleared', 'info');
  });
  byId('checkoutBtn')?.addEventListener('click', () => {
    if (!getCartItems().length) return;
    toast('Checkout prepared', 'success');
  });
  byId('couponBtn')?.addEventListener('click', () => {
    toast('Coupon applied for preview', 'success');
  });
}

function renderCartPage() {
  renderCartItems();
  renderSummary();
}

export function initCartPage() {
  initAuthSimulation();
  initSearchBox();
  initNewsletterForm();
  wireActions();
  renderCartPage();
  renderRecommended();
}
