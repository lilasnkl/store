import { DETAIL_DEFAULT_ID, categoryLabel, fetchProductById, fetchRelatedProducts } from '../data/catalog.js';
import { buildRelatedCard } from '../components/product-cards.js';
import { initAuthSimulation } from '../components/auth-simulation.js';
import { addProductToCart, initCartDrawer } from '../components/cart-drawer.js';
import { initNewsletterForm } from '../components/newsletter-form.js';
import { initSearchBox } from '../components/search-autocomplete.js';
import { isWished, toggleWishlist } from '../services/wishlist-store.js';
import { toast } from '../services/toast.js';
import { byId, qsa } from '../utils/dom.js';
import { discountPrice, fmt, starHtml } from '../utils/format.js';

let activeProduct;
let quantity = 1;

function productIdFromUrl() {
  return Number(new URLSearchParams(location.search).get('id') || DETAIL_DEFAULT_ID);
}

function setText(id, value) {
  const element = byId(id);
  if (element) element.textContent = value;
}

function renderGallery(product) {
  const mainImage = byId('detailMainImage');
  const thumbs = byId('detailThumbs');
  const images = product.images?.length ? product.images : [product.thumbnail];
  if (mainImage) {
    mainImage.src = images[0];
    mainImage.alt = product.title;
  }
  if (!thumbs) return;
  thumbs.innerHTML = images.map((src, index) => `
    <button class="detail-thumb${index === 0 ? ' active' : ''}" data-src="${src}" aria-label="View image ${index + 1}">
      <img src="${src}" alt="${product.title} thumbnail ${index + 1}" loading="lazy" />
    </button>
  `).join('');
  thumbs.querySelectorAll('.detail-thumb').forEach(button => {
    button.addEventListener('click', () => {
      thumbs.querySelectorAll('.detail-thumb').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      if (mainImage) mainImage.src = button.dataset.src;
    });
  });
}

function renderPriceTiers(product) {
  const table = byId('detailPriceTiers');
  if (!table) return;
  table.innerHTML = product.priceTiers.map(tier => `
    <div class="tier-cell">
      <strong>${fmt(tier.price)}</strong>
      <span>${tier.qty}</span>
    </div>
  `).join('');
}

function renderSpecs(product) {
  const list = byId('detailSpecs');
  if (!list) return;
  list.innerHTML = product.specs.map(([label, value]) => `
    <div class="spec-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join('');
}

function renderFeatures(product) {
  const list = byId('detailFeatureList');
  if (!list) return;
  list.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
}

function renderSupplier(product) {
  const supplier = product.supplier || {};
  setText('supplierInitial', (supplier.name || 'S').trim().charAt(0).toUpperCase());
  setText('supplierName', supplier.name || 'Brand Supplier');
  setText('supplierCountry', supplier.country || 'Germany, Berlin');
  setText('supplierFlag', supplier.flag || 'DE');
}

async function renderRelated(product) {
  const list = byId('relatedProducts');
  const side = byId('sideProducts');
  const related = await fetchRelatedProducts(product.id, 6);
  if (list) {
    const fragment = document.createDocumentFragment();
    related.forEach(item => fragment.appendChild(buildRelatedCard(item)));
    list.innerHTML = '';
    list.appendChild(fragment);
  }
  if (side) {
    side.innerHTML = related.slice(0, 5).map(item => `
      <a class="side-product" href="/detail.html?id=${item.id}">
        <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
        <span>${item.title}</span>
        <strong>${fmt(discountPrice(item))}</strong>
      </a>
    `).join('');
  }
}

function updateWishlistButton(product) {
  const button = byId('saveProductBtn');
  if (!button) return;
  const active = isWished(product.id);
  button.classList.toggle('saved', active);
  button.innerHTML = `${active ? '&hearts;' : '&#9825;'} ${active ? 'Saved' : 'Save for later'}`;
}

function renderProduct(product) {
  activeProduct = product;
  document.title = `${product.title} | Brand`;
  setText('detailCategory', categoryLabel(product.category));
  setText('detailCurrent', product.title);
  setText('detailTitle', product.title);
  setText('detailRatingValue', Number(product.rating || 0).toFixed(1));
  setText('detailOrders', `${product.orders || 0} orders`);
  setText('detailPrice', fmt(discountPrice(product)));
  setText('detailOldPrice', product.discountPercentage ? fmt(product.price) : '');
  setText('detailDescription', product.description || '');
  setText('detailSku', `SKU-${product.id}`);
  setText('detailStock', 'In stock');

  const stars = byId('detailStars');
  if (stars) stars.innerHTML = starHtml(product.rating, 'detail-star');

  renderGallery(product);
  renderPriceTiers(product);
  renderSpecs(product);
  renderFeatures(product);
  renderSupplier(product);
  renderRelated(product);
  updateWishlistButton(product);
}

function wireQuantity() {
  const value = byId('qtyValue');
  const setValue = next => {
    quantity = Math.max(1, Math.min(99, next));
    if (value) value.textContent = String(quantity);
  };

  byId('qtyMinus')?.addEventListener('click', () => setValue(quantity - 1));
  byId('qtyPlus')?.addEventListener('click', () => setValue(quantity + 1));
}

function wireActions() {
  byId('addDetailCart')?.addEventListener('click', () => {
    if (!activeProduct) return;
    addProductToCart(activeProduct, quantity);
  });
  byId('sendInquiryBtn')?.addEventListener('click', () => {
    toast('Inquiry request prepared', 'success');
  });
  byId('saveProductBtn')?.addEventListener('click', () => {
    if (!activeProduct) return;
    const saved = toggleWishlist(activeProduct.id);
    updateWishlistButton(activeProduct);
    if (saved) toast('Added to wishlist', 'success');
  });
}

function wireTabs() {
  qsa('.detail-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      qsa('.detail-tab').forEach(item => item.classList.remove('active'));
      qsa('.detail-panel').forEach(panel => panel.classList.remove('active'));
      tab.classList.add('active');
      byId(tab.dataset.panel)?.classList.add('active');
    });
  });
}

export async function initDetailPage() {
  initCartDrawer();
  initAuthSimulation();
  initSearchBox();
  initNewsletterForm();
  wireQuantity();
  wireActions();
  wireTabs();
  renderProduct(await fetchProductById(productIdFromUrl()));
}
