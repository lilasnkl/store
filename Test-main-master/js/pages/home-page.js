import { DEAL_PRODUCTS, FEATURED_PRODUCTS } from '../data/home.js';
import { fetchCatalog } from '../data/catalog.js';
import { buildDealCard, buildHomeProductCard } from '../components/product-cards.js';
import { initAuthSimulation } from '../components/auth-simulation.js';
import { initCartDrawer } from '../components/cart-drawer.js';
import { initNewsletterForm } from '../components/newsletter-form.js';
import { initSearchBox } from '../components/search-autocomplete.js';
import { byId } from '../utils/dom.js';

function showProductsLoading() {
  const grid = byId('productsGrid');
  const error = byId('errorState');
  if (grid) {
    grid.innerHTML = Array(10).fill(null).map(() => '<div class="product-skeleton"></div>').join('');
  }
  if (error) error.hidden = true;
}

function renderFeaturedProducts(products) {
  const grid = byId('productsGrid');
  if (!grid) return;
  if (!products.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:40px;text-align:center;color:#8B96A5;font-size:14px">No products found.</div>';
    return;
  }
  const fragment = document.createDocumentFragment();
  products.forEach(product => fragment.appendChild(buildHomeProductCard(product)));
  grid.innerHTML = '';
  grid.appendChild(fragment);
}

function renderDeals(products) {
  const grid = byId('dealsGrid');
  if (!grid) return;
  const fragment = document.createDocumentFragment();
  products.forEach(product => fragment.appendChild(buildDealCard(product)));
  grid.innerHTML = '';
  grid.appendChild(fragment);
}

function showDealsLoading() {
  const grid = byId('dealsGrid');
  if (grid) {
    grid.innerHTML = Array(5).fill(null).map(() => '<div class="deal-skeleton"></div>').join('');
  }
}

function startCountdown() {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 4);
  deadline.setHours(13, 34, 56, 0);

  function tick() {
    const diff = deadline - Date.now();
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const pad = value => String(value).padStart(2, '0');
    const set = (id, value) => {
      const element = byId(id);
      if (element) element.textContent = pad(value);
    };
    set('cdDays', days);
    set('cdHours', hours);
    set('cdMins', minutes);
    set('cdSecs', seconds);
  }

  tick();
  setInterval(tick, 1000);
}

async function loadHomeSections() {
  showDealsLoading();
  showProductsLoading();
  const [deals, featured] = await Promise.all([
    fetchCatalog({ category: 'electronics', sortBy: 'discount-desc' }),
    fetchCatalog({ category: 'electronics' }),
  ]);
  renderDeals(deals.length ? deals.slice(0, 5) : DEAL_PRODUCTS);
  renderFeaturedProducts(featured.length ? featured.slice(0, 10) : FEATURED_PRODUCTS);
}

export function initHomePage() {
  initCartDrawer();
  initAuthSimulation();
  initSearchBox();
  initNewsletterForm();
  startCountdown();
  byId('retryBtn')?.addEventListener('click', loadHomeSections);
  loadHomeSections();
}
