import { BRAND_FILTERS, CATALOG_CATEGORIES, DEFAULT_CATEGORY, PAGE_SIZE, categoryLabel, fetchCatalog, getDisplayTotal } from '../data/catalog.js';
import { initAuthSimulation } from '../components/auth-simulation.js';
import { buildCatalogCard } from '../components/product-cards.js';
import { initCartDrawer } from '../components/cart-drawer.js';
import { initNewsletterForm } from '../components/newsletter-form.js';
import { initSearchBox } from '../components/search-autocomplete.js';
import { byId, qsa } from '../utils/dom.js';
import { capitalize } from '../utils/format.js';

const state = {
  page: 1,
  category: DEFAULT_CATEGORY,
  searchQ: '',
  sortBy: '',
  minRating: 0,
  minPrice: 0,
  maxPrice: Infinity,
  allBrandsVisible: false,
  viewMode: 'grid',
};

let catalogRequestId = 0;

function showSkeleton() {
  const list = byId('plpList');
  if (!list) return;
  list.innerHTML = Array(PAGE_SIZE).fill(null).map(() => '<div class="plp-skeleton"></div>').join('');
  byId('resultsCount').textContent = 'Loading...';
  byId('pagination').innerHTML = '';
}

function renderProducts(products) {
  const list = byId('plpList');
  if (!list) return;
  if (!products.length) {
    list.innerHTML = '<div style="padding:32px;text-align:center;color:#8B96A5;font-size:14px">No products found.</div>';
    return;
  }
  const fragment = document.createDocumentFragment();
  products.forEach(product => fragment.appendChild(buildCatalogCard(product)));
  list.innerHTML = '';
  list.appendChild(fragment);
}

function updateResultsCount(total) {
  const label = state.searchQ
    ? `"${state.searchQ}"`
    : state.category
      ? categoryLabel(state.category)
      : 'All Products';
  const visibleTotal = getDisplayTotal({ total, category: state.category, searchQ: state.searchQ });
  byId('resultsCount').textContent = `${visibleTotal.toLocaleString()} items in ${label}`;
}

function renderPagination(total) {
  const container = byId('pagination');
  if (!container) return;

  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const page = state.page;
  const buttons = [];
  buttons.push(`<button class="page-btn" id="pgPrev" ${page === 1 ? 'disabled' : ''}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`);

  for (let index = 1; index <= totalPages; index++) {
    buttons.push(`<button class="page-btn${index === page ? ' active' : ''}" data-page="${index}">${index}</button>`);
  }

  buttons.push(`<button class="page-btn" id="pgNext" ${page === totalPages ? 'disabled' : ''}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`);

  container.innerHTML = buttons.join('');
  container.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      state.page = Number(button.dataset.page);
      renderCatalog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  container.querySelector('#pgPrev')?.addEventListener('click', () => {
    state.page -= 1;
    renderCatalog();
  });
  container.querySelector('#pgNext')?.addEventListener('click', () => {
    state.page += 1;
    renderCatalog();
  });
}

async function renderCatalog() {
  const requestId = ++catalogRequestId;
  showSkeleton();
  const products = await fetchCatalog(state);
  if (requestId !== catalogRequestId) return;

  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = products.slice(start, start + PAGE_SIZE);

  if (!pageItems.length && products.length && state.page > 1) {
    state.page = 1;
    renderCatalog();
    return;
  }

  renderProducts(pageItems);
  renderPagination(products.length);
  updateResultsCount(products.length);
}

function renderCategorySidebar() {
  const list = byId('filterCatList');
  if (!list) return;
  list.innerHTML = CATALOG_CATEGORIES.map(category => `
    <li class="filter-cat-item${category.slug === state.category ? ' active' : ''}" data-cat="${category.slug}">
      <span>${capitalize(category.name)}</span>
    </li>
  `).join('');

  list.querySelectorAll('.filter-cat-item').forEach(item => {
    item.addEventListener('click', () => {
      state.category = item.dataset.cat;
      state.searchQ = '';
      state.page = 1;
      const input = byId('searchInput');
      if (input) input.value = '';
      renderCategorySidebar();
      updateBreadcrumb();
      renderCatalog();
    });
  });
}

function populateCatSelect() {
  const select = byId('searchCatSelect');
  if (!select) return;
  select.innerHTML = '<option value="">All category</option>' + CATALOG_CATEGORIES.map(category => (
    `<option value="${category.slug}">${category.name}</option>`
  )).join('');
}

function renderBrands() {
  const list = byId('filterBrandList');
  if (!list) return;
  const visible = state.allBrandsVisible ? BRAND_FILTERS : BRAND_FILTERS.slice(0, 5);
  list.innerHTML = visible.map(brand => `
    <li><label class="filter-check-label">
      <input type="checkbox" class="filter-check" data-brand="${brand}" />
      ${brand}
    </label></li>
  `).join('');
  const seeAll = byId('brandSeeAll');
  if (seeAll) {
    seeAll.textContent = state.allBrandsVisible ? 'See less' : 'See all';
    seeAll.hidden = BRAND_FILTERS.length <= 5;
  }
}

function updateBreadcrumb() {
  const bcCategory = byId('bcCategory');
  const bcSep = byId('bcSubSep');
  const bcCurrent = byId('bcCurrent');
  if (!bcCategory) return;

  if (state.searchQ) {
    bcCategory.textContent = 'Search';
    bcSep.hidden = false;
    bcCurrent.hidden = false;
    bcCurrent.textContent = `"${state.searchQ}"`;
    return;
  }

  bcCategory.textContent = categoryLabel(state.category);
  bcSep.hidden = true;
  bcCurrent.hidden = true;
}

function wireControls() {
  byId('sortSelect')?.addEventListener('change', event => {
    state.sortBy = event.target.value;
    state.page = 1;
    renderCatalog();
  });

  byId('plpList')?.classList.toggle('grid-view', state.viewMode === 'grid');
  byId('gridViewBtn')?.classList.toggle('active', state.viewMode === 'grid');
  byId('listViewBtn')?.classList.toggle('active', state.viewMode === 'list');

  byId('listViewBtn')?.addEventListener('click', () => {
    state.viewMode = 'list';
    byId('plpList')?.classList.remove('grid-view');
    byId('listViewBtn')?.classList.add('active');
    byId('gridViewBtn')?.classList.remove('active');
  });
  byId('gridViewBtn')?.addEventListener('click', () => {
    state.viewMode = 'grid';
    byId('plpList')?.classList.add('grid-view');
    byId('gridViewBtn')?.classList.add('active');
    byId('listViewBtn')?.classList.remove('active');
  });

  byId('applyPriceBtn')?.addEventListener('click', () => {
    state.minPrice = parseFloat(byId('priceMin')?.value) || 0;
    state.maxPrice = parseFloat(byId('priceMax')?.value) || Infinity;
    state.page = 1;
    renderCatalog();
  });

  qsa('.filter-rating-item').forEach(item => {
    item.addEventListener('click', () => {
      qsa('.filter-rating-item').forEach(entry => entry.classList.remove('active'));
      item.classList.add('active');
      state.minRating = parseFloat(item.dataset.min) || 0;
      state.page = 1;
      renderCatalog();
    });
  });

  byId('brandSeeAll')?.addEventListener('click', () => {
    state.allBrandsVisible = !state.allBrandsVisible;
    renderBrands();
  });
}

export function initProductsPage() {
  const params = new URLSearchParams(location.search);
  state.category = params.get('category') || state.category;
  state.searchQ = params.get('q') || state.searchQ;
  const searchInput = byId('searchInput');
  if (searchInput && state.searchQ) searchInput.value = state.searchQ;

  initCartDrawer();
  initAuthSimulation();
  initSearchBox();
  initNewsletterForm();
  populateCatSelect();
  renderCategorySidebar();
  renderBrands();
  updateBreadcrumb();
  wireControls();
  renderCatalog();
}
