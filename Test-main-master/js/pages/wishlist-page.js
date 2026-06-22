import { DETAIL_DEFAULT_ID, fetchProductById, fetchRelatedProducts } from '../data/catalog.js';
import { initAuthSimulation } from '../components/auth-simulation.js';
import { addProductToCart, updateCartUI } from '../components/cart-drawer.js';
import { buildRelatedCard } from '../components/product-cards.js';
import { initNewsletterForm } from '../components/newsletter-form.js';
import { initSearchBox } from '../components/search-autocomplete.js';
import { getWishlistIds, removeWishlist } from '../services/wishlist-store.js';
import { toast } from '../services/toast.js';
import { byId } from '../utils/dom.js';
import { discountPrice, fmt, starHtml } from '../utils/format.js';

async function wishlistProducts() {
  const ids = getWishlistIds();
  const products = await Promise.all(ids.map(id => fetchProductById(id)));
  return products.filter((product, index) => product && product.id === Number(ids[index]));
}

function updateHeaderCount(count = getWishlistIds().length) {
  const label = byId('wishlistCount');
  if (label) label.textContent = `${count} saved item${count === 1 ? '' : 's'}`;
}

function renderEmpty() {
  const grid = byId('wishlistGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="wishlist-empty">
      <strong>No saved items yet</strong>
      <p>Save products from the grid or product detail page. Wishlist items are stored locally on this browser only.</p>
      <a href="/products.html" class="commerce-primary-link">Browse products</a>
    </div>
  `;
}

async function renderWishlist() {
  const grid = byId('wishlistGrid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;padding:32px;text-align:center;color:#8B96A5;font-size:14px">Loading saved products...</div>';
  const products = await wishlistProducts();
  updateHeaderCount(products.length);

  if (!products.length) {
    renderEmpty();
    return;
  }

  grid.innerHTML = products.map(product => `
    <article class="wishlist-card" data-id="${product.id}">
      <a class="wishlist-img" href="/detail.html?id=${product.id}">
        <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
      </a>
      <div class="wishlist-body">
        <a href="/detail.html?id=${product.id}" class="wishlist-title">${product.title}</a>
        <div class="wishlist-rating">
          <span>${starHtml(product.rating, 'wishlist-star')}</span>
          <small>${Number(product.rating || 0).toFixed(1)} · ${product.orders || 0} orders</small>
        </div>
        <p>${product.description || ''}</p>
        <strong>${fmt(discountPrice(product))}</strong>
      </div>
      <div class="wishlist-actions">
        <button class="wishlist-add" data-action="cart">Add to cart</button>
        <button class="wishlist-remove" data-action="remove">Remove</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.wishlist-card').forEach(card => {
    const id = Number(card.dataset.id);
    const product = products.find(entry => entry.id === id);
    card.querySelector('[data-action="cart"]')?.addEventListener('click', () => {
      if (product) addProductToCart(product);
    });
    card.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
      removeWishlist(id);
      renderWishlist();
      toast('Removed from local wishlist', 'info');
    });
  });
}

async function renderRecommended() {
  const container = byId('wishlistRecommended');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  const related = await fetchRelatedProducts(DETAIL_DEFAULT_ID, 4);
  related.forEach(product => fragment.appendChild(buildRelatedCard(product)));
  container.innerHTML = '';
  container.appendChild(fragment);
}

export function initWishlistPage() {
  initAuthSimulation();
  initSearchBox();
  initNewsletterForm();
  updateCartUI();
  renderWishlist();
  renderRecommended();
}
