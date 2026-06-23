import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Footer, NewsletterSection } from '../components/Footer';
import { RelatedCard } from '../components/ProductCards';
import { DETAIL_DEFAULT_ID, fetchProductById, fetchRelatedProducts } from '../data/catalog';
import { useCart } from '../services/cart-context';
import { useWishlist } from '../services/wishlist-context';
import { useToast } from '../services/toast-context';
import { discountPrice, fmt, starHtml } from '../utils/format';
import type { Product } from '../types';

export default function Wishlist() {
  const { ids, remove } = useWishlist();
  const { add, open } = useCart();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    fetchRelatedProducts(DETAIL_DEFAULT_ID, 4).then(setRecommended);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(ids.map((id) => fetchProductById(id)))
      .then((results) => {
        if (cancelled) return;
        setProducts(results.filter((p, index) => p && p.id === Number(ids[index])));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const count = products.length;

  return (
    <>
      <TopNav variant="commerce" />

      <main className="commerce-main">
        <div className="section-inner">
          <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>&gt;</span>
            <span>Wishlist</span>
          </nav>

          <section className="wishlist-hero">
            <div>
              <span>Local wishlist</span>
              <h1>Saved products</h1>
              <p>{count} saved item{count === 1 ? '' : 's'}</p>
            </div>
            <p className="wishlist-local-note">
              Your wishlist is saved locally in this browser only. It is not sent to a server.
            </p>
          </section>

          <section className="wishlist-layout" aria-label="Wishlist products">
            <div className="wishlist-grid" id="wishlistGrid">
              {loading ? (
                <div style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center', color: '#8B96A5', fontSize: 14 }}>
                  Loading saved products...
                </div>
              ) : count === 0 ? (
                <div className="wishlist-empty">
                  <strong>No saved items yet</strong>
                  <p>Save products from the grid or product detail page. Wishlist items are stored locally on this browser only.</p>
                  <Link to="/products.html" className="commerce-primary-link">Browse products</Link>
                </div>
              ) : (
                products.map((product) => (
                  <article className="wishlist-card" data-id={product.id} key={product.id}>
                    <Link className="wishlist-img" to={`/detail.html?id=${product.id}`}>
                      <img src={product.thumbnail} alt={product.title} loading="lazy" />
                    </Link>
                    <div className="wishlist-body">
                      <Link to={`/detail.html?id=${product.id}`} className="wishlist-title">{product.title}</Link>
                      <div className="wishlist-rating">
                        <span dangerouslySetInnerHTML={{ __html: starHtml(product.rating, 'wishlist-star') }} />
                        <small>{Number(product.rating || 0).toFixed(1)} · {product.orders || 0} orders</small>
                      </div>
                      <p>{product.description || ''}</p>
                      <strong>{fmt(discountPrice(product))}</strong>
                    </div>
                    <div className="wishlist-actions">
                      <button
                        className="wishlist-add"
                        onClick={() => {
                          add(product);
                          open();
                          toast((product.title || 'Item') + ' added to cart', 'success');
                        }}
                      >
                        Add to cart
                      </button>
                      <button
                        className="wishlist-remove"
                        onClick={() => {
                          remove(product.id);
                          toast('Removed from local wishlist', 'info');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="commerce-recommended">
            <h2>Recommended items</h2>
            <div className="commerce-related-grid" id="wishlistRecommended">
              {recommended.map((product) => <RelatedCard product={product} key={product.id} />)}
            </div>
          </section>
        </div>
      </main>

      <NewsletterSection />
      <Footer variant="minimal" />
    </>
  );
}
