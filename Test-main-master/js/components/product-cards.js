import { discountPrice, fmt, starHtml } from '../utils/format.js';
import { addProductToCart } from './cart-drawer.js';
import { isWished, toggleWishlist } from '../services/wishlist-store.js';
import { toast } from '../services/toast.js';

export function buildCatalogCard(product) {
  const wished = isWished(product.id);
  const freeShip = product.shippingInformation && product.shippingInformation.toLowerCase().includes('free');
  const card = document.createElement('div');
  card.className = 'plp-card';
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <button class="plp-card-wish${wished ? ' wished' : ''}" data-id="${product.id}" aria-label="${wished ? 'Remove from wishlist' : 'Add to wishlist'}">${wished ? '&hearts;' : '&#9825;'}</button>
    <a class="plp-card-img-wrap" href="/detail.html?id=${product.id}" aria-label="Open ${product.title}">
      <img
        src="${product.thumbnail || ''}"
        alt="${product.title || ''}"
        class="plp-card-img"
        loading="lazy"
        onerror="this.src='https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300'"
      />
    </a>
    <div class="plp-card-info">
      <a href="/detail.html?id=${product.id}" class="plp-card-title">${product.title || ''}</a>
      <div class="plp-card-rating-row">
        <div class="plp-card-stars">${starHtml(product.rating)}</div>
        <span class="plp-card-rating-score">${Number(product.rating || 0).toFixed(1)}</span>
        <span class="plp-card-rcount">${product.orders || 0} orders</span>
        ${freeShip ? '<span class="plp-card-free-ship"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Free Shipping</span>' : ''}
      </div>
      <p class="plp-card-desc">${product.description || ''}</p>
      <a href="/detail.html?id=${product.id}" class="plp-card-more">View details</a>
    </div>
    <div class="plp-card-price-col">
      <p class="plp-card-price">${fmt(discountPrice(product))}</p>
      ${product.discountPercentage > 0.5 ? `<p class="plp-card-old-price">${fmt(product.price)}</p><span class="plp-card-discount">-${Math.round(product.discountPercentage)}%</span>` : ''}
      <button class="btn-add-cart" data-id="${product.id}">Add to cart</button>
    </div>
  `;

  card.querySelector('.btn-add-cart')?.addEventListener('click', event => {
    event.stopPropagation();
    addProductToCart(product);
  });

  card.querySelector('.plp-card-wish')?.addEventListener('click', event => {
    event.stopPropagation();
    const active = toggleWishlist(product.id);
    event.currentTarget.classList.toggle('wished', active);
    event.currentTarget.innerHTML = active ? '&hearts;' : '&#9825;';
    if (active) toast('Added to wishlist', 'success');
  });

  return card;
}

export function buildHomeProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <a href="/detail.html?id=${product.id}" class="product-card-img-wrap">
      <img src="${product.thumbnail || ''}" alt="${product.title || ''}" class="product-card-img" loading="lazy" width="150" height="150" />
    </a>
    <p class="product-card-price">${fmt(discountPrice(product))}</p>
    ${product.discountPercentage > 3 ? `<p class="product-card-old-price">${fmt(product.price)}</p>` : ''}
    <a href="/detail.html?id=${product.id}" class="product-card-name">${product.title || ''}</a>
    <p class="product-card-desc">${product.description || product.category || ''}</p>
    <button class="product-card-add" aria-label="Add to cart">+</button>
  `;
  card.querySelector('.product-card-add')?.addEventListener('click', event => {
    event.stopPropagation();
    addProductToCart(product);
  });
  return card;
}

export function buildDealCard(product) {
  const discount = Math.round(product.discountPercentage || 0);
  const price = Math.round(discountPrice(product));
  const card = document.createElement('div');
  card.className = 'deal-card';
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <img src="${product.thumbnail || ''}" alt="${product.title || ''}" class="deal-card-img" loading="lazy" />
    <p class="deal-card-name">${product.title || ''}</p>
    <p class="deal-card-price">USD ${price}</p>
    ${discount > 0 ? `<span class="deal-discount-badge">-${discount}%</span>` : ''}
  `;
  card.addEventListener('click', () => addProductToCart(product));
  return card;
}

export function buildRelatedCard(product) {
  const card = document.createElement('a');
  card.className = 'detail-related-card';
  card.href = `/detail.html?id=${product.id}`;
  card.innerHTML = `
    <span class="detail-related-img-wrap">
      <img src="${product.thumbnail || ''}" alt="${product.title || ''}" class="detail-related-img" loading="lazy" />
    </span>
    <strong>${fmt(discountPrice(product))}</strong>
    <span>${product.title || ''}</span>
  `;
  return card;
}
