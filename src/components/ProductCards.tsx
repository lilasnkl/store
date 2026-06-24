import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../services/cart-context';
import { useToast } from '../services/toast-context';
import { useWishlist } from '../services/wishlist-context';
import { discountPrice, fmt, starHtml } from '../utils/format';

export function CatalogCard({ product }: { product: Product }) {
  const { add, open } = useCart();
  const toast = useToast();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);
  const freeShip =
    product.shippingInformation && product.shippingInformation.toLowerCase().includes('free');

  const onAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    add(product);
    open();
    toast((product.title || 'Item') + ' added to cart', 'success');
  };

  const onWish = (event: React.MouseEvent) => {
    event.stopPropagation();
    const active = toggle(product.id);
    if (active) toast('Added to wishlist', 'success');
  };

  return (
    <div className="plp-card" role="listitem">
      <button
        className={`plp-card-wish${wished ? ' wished' : ''}`}
        data-id={product.id}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={onWish}
        dangerouslySetInnerHTML={{ __html: wished ? '&hearts;' : '&#9825;' }}
      />
      <a
        className="plp-card-img-wrap"
        href={`/detail.html?id=${product.id}`}
        aria-label={`Open ${product.title}`}
      >
        <img
          src={product.thumbnail || ''}
          alt={product.title || ''}
          className="plp-card-img"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300';
          }}
        />
      </a>
      <div className="plp-card-info">
        <Link to={`/detail.html?id=${product.id}`} className="plp-card-title">
          {product.title || ''}
        </Link>
        <div className="plp-card-rating-row">
          <div className="plp-card-stars" dangerouslySetInnerHTML={{ __html: starHtml(product.rating) }} />
          <span className="plp-card-rating-score">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="plp-card-rcount">{product.orders || 0} orders</span>
          {freeShip && (
            <span className="plp-card-free-ship">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Free Shipping
            </span>
          )}
        </div>
        <p className="plp-card-desc">{product.description || ''}</p>
        <Link to={`/detail.html?id=${product.id}`} className="plp-card-more">
          View details
        </Link>
      </div>
      <div className="plp-card-price-col">
        <p className="plp-card-price">{fmt(discountPrice(product))}</p>
        {product.discountPercentage > 0.5 && (
          <>
            <p className="plp-card-old-price">{fmt(product.price)}</p>
            <span className="plp-card-discount">-{Math.round(product.discountPercentage)}%</span>
          </>
        )}
        <button className="btn-add-cart" data-id={product.id} onClick={onAddToCart}>
          Add to cart
        </button>
      </div>
    </div>
  );
}

export function HomeProductCard({ product }: { product: Product }) {
  const { add, open } = useCart();
  const toast = useToast();
  return (
    <div className="product-card" role="listitem">
      <Link to={`/detail.html?id=${product.id}`} className="product-card-img-wrap">
        <img
          src={product.thumbnail || ''}
          alt={product.title || ''}
          className="product-card-img"
          loading="lazy"
          width="150"
          height="150"
        />
      </Link>
      <p className="product-card-price">{fmt(discountPrice(product))}</p>
      {product.discountPercentage > 3 && (
        <p className="product-card-old-price">{fmt(product.price)}</p>
      )}
      <Link to={`/detail.html?id=${product.id}`} className="product-card-name">
        {product.title || ''}
      </Link>
      <p className="product-card-desc">{product.description || product.category || ''}</p>
      <button
        className="product-card-add"
        aria-label="Add to cart"
        onClick={() => {
          add(product);
          open();
          toast((product.title || 'Item') + ' added to cart', 'success');
        }}
      >
        +
      </button>
    </div>
  );
}

export function DealCard({ product }: { product: Product }) {
  const { add, open } = useCart();
  const toast = useToast();
  const discount = Math.round(product.discountPercentage || 0);
  const price = Math.round(discountPrice(product));
  return (
    <div
      className="deal-card"
      role="listitem"
      onClick={() => {
        add(product);
        open();
        toast((product.title || 'Item') + ' added to cart', 'success');
      }}
    >
      <div className="deal-card-img-wrap">
        {discount > 0 && (
          <span className="deal-hot-badge">
            <span className="deal-hot-label">Hot</span>
            <span className="deal-hot-pct">-{discount}%</span>
          </span>
        )}
        <img src={product.thumbnail || ''} alt={product.title || ''} className="deal-card-img" loading="lazy" />
      </div>
      <p className="deal-card-name">{product.title || ''}</p>
      <p className="deal-card-price">USD {price}</p>
    </div>
  );
}

export function RelatedCard({ product }: { product: Product }) {
  return (
    <Link to={`/detail.html?id=${product.id}`} className="detail-related-card">
      <span className="detail-related-img-wrap">
        <img src={product.thumbnail || ''} alt={product.title || ''} className="detail-related-img" loading="lazy" />
      </span>
      <strong>{fmt(discountPrice(product))}</strong>
      <span>{product.title || ''}</span>
    </Link>
  );
}
