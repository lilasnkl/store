import { byId, on } from '../utils/dom.js';
import { debounce, discountPrice, fmt } from '../utils/format.js';
import { searchProducts } from '../data/catalog.js';
import { addProductToCart } from './cart-drawer.js';

function closeDropdown() {
  const dropdown = byId('searchDropdown');
  if (dropdown) dropdown.hidden = true;
}

function renderSuggestions(items) {
  const dropdown = byId('searchDropdown');
  if (!dropdown) return;
  if (!items.length) {
    dropdown.hidden = true;
    return;
  }

  dropdown.innerHTML = items.map(product => `
    <div class="search-result-item" data-id="${product.id}">
      <img src="${product.thumbnail || ''}" class="search-result-img" alt="${product.title || ''}" loading="lazy" />
      <div>
        <p class="search-result-name">${product.title || ''}</p>
        <p class="search-result-price">${fmt(discountPrice(product))}</p>
      </div>
    </div>
  `).join('');

  dropdown.hidden = false;
  dropdown.querySelectorAll('.search-result-item').forEach(item => {
    on(item, 'click', () => {
      const product = items.find(entry => entry.id === Number(item.dataset.id));
      if (product) addProductToCart(product);
      closeDropdown();
    });
  });
}

export function initSearchBox({ redirectToProducts = true } = {}) {
  const searchInput = byId('searchInput');
  const searchButton = byId('searchBtn');
  let suggestionRequestId = 0;
  const suggest = debounce(async query => {
    const requestId = ++suggestionRequestId;
    if (!query || query.length < 2) {
      closeDropdown();
      return;
    }
    const suggestions = await searchProducts(query, 5);
    if (requestId === suggestionRequestId) renderSuggestions(suggestions);
  }, 250);

  on(searchInput, 'input', () => suggest(searchInput.value.trim()));
  on(searchInput, 'keydown', event => {
    if (event.key === 'Escape') {
      closeDropdown();
      return;
    }
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const query = searchInput.value.trim();
    if (redirectToProducts && query) {
      location.href = '/products.html?q=' + encodeURIComponent(query);
    }
  });

  on(searchButton, 'click', event => {
    event.preventDefault();
    const query = searchInput?.value.trim() || '';
    if (redirectToProducts && query) {
      location.href = '/products.html?q=' + encodeURIComponent(query);
    }
  });

  on(document, 'click', event => {
    if (!event.target.closest('.search-bar-wrap')) closeDropdown();
  });
}
