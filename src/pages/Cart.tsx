import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Footer, NewsletterSection } from '../components/Footer';
import { RelatedCard } from '../components/ProductCards';
import { CATALOG_PRODUCTS, DETAIL_DEFAULT_ID, fetchRelatedProducts } from '../data/catalog';
import { useCart } from '../services/cart-context';
import { useWishlist } from '../services/wishlist-context';
import { useToast } from '../services/toast-context';
import { useAuth } from '../services/auth-context';
import { fmt } from '../utils/format';
import type { Product } from '../types';

const SHIPPING = 10;
const TAX_RATE = 0.08;

function findCatalogProduct(id: number): Product | undefined {
  return CATALOG_PRODUCTS.find((product) => product.id === id);
}

export default function Cart() {
  const { items, count, total, remove, setQuantity, clear } = useCart();
  const { isWished, add: addWish } = useWishlist();
  const toast = useToast();
  const { authorize } = useAuth();
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    fetchRelatedProducts(DETAIL_DEFAULT_ID, 4).then(setRecommended);
  }, []);

  const totals = useMemo(() => {
    const subtotal = total;
    const tax = subtotal * TAX_RATE;
    const shipping = subtotal > 0 ? SHIPPING : 0;
    return { subtotal, shipping, tax, grand: subtotal + shipping + tax };
  }, [total]);

  const onClear = () => {
    clear();
    toast('Cart cleared', 'info');
  };

  const onCheckout = () => {
    if (!items.length) return;
    if (!authorize('Checkout')) return;
    toast('Checkout prepared', 'success');
  };

  const onCoupon = () => toast('Coupon applied for preview', 'success');

  return (
    <>
      <TopNav variant="commerce" />

      <main className="commerce-main">
        <div className="section-inner">
          <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>&gt;</span>
            <span>Cart</span>
          </nav>

          <div className="commerce-heading-row">
            <div>
              <h1>My cart</h1>
              <p id="cartPageCount">{count} item{count === 1 ? '' : 's'}</p>
            </div>
            <a href="/products.html" className="commerce-muted-link">Continue shopping</a>
          </div>

          <section className="cart-layout" aria-label="Cart">
            <div className="cart-items-panel">
              <div className="panel-toolbar">
                <strong>Shopping cart</strong>
                <button id="clearCartBtn" onClick={onClear}>Clear all</button>
              </div>
              <div id="cartPageItems" className="cart-page-list">
                {items.length === 0 ? (
                  <div className="cart-empty-page">
                    <strong>Your cart is empty</strong>
                    <p>Browse products and add items to build your sourcing order.</p>
                    <Link to="/products.html" className="commerce-primary-link">Browse products</Link>
                  </div>
                ) : (
                  items.map((item) => {
                    const supplierName = findCatalogProduct(item.id)?.supplier?.name || 'Brand verified supplier';
                    return (
                      <article className="cart-page-item" data-id={item.id} key={item.id}>
                        <Link className="cart-page-img" to={`/detail.html?id=${item.id}`}>
                          <img src={item.thumbnail} alt={item.title} loading="lazy" />
                        </Link>
                        <div className="cart-page-info">
                          <Link to={`/detail.html?id=${item.id}`} className="cart-page-title">{item.title}</Link>
                          <p>Seller: {supplierName}</p>
                          <p>Shipping: Free standard pickup available</p>
                          <div className="cart-page-actions">
                            <button className="cart-remove" onClick={() => { remove(item.id); toast('Item removed from cart', 'info'); }}>Remove</button>
                            <button className="cart-save" onClick={() => { addWish(item.id); toast('Saved to wishlist locally', 'success'); }}>
                              {isWished(item.id) ? 'Saved' : 'Save for later'}
                            </button>
                          </div>
                        </div>
                        <div className="cart-page-controls">
                          <strong>{fmt(item.price * item.qty)}</strong>
                          <select
                            className="cart-qty"
                            aria-label="Quantity"
                            value={item.qty}
                            onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                          >
                            {Array.from({ length: 9 }, (_, index) => {
                              const value = index + 1;
                              return <option value={value} key={value}>Qty: {value}</option>;
                            })}
                          </select>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            <aside className="order-summary" aria-label="Order summary">
              <div className="coupon-box">
                <label htmlFor="couponInput">Have a coupon?</label>
                <div>
                  <input id="couponInput" type="text" placeholder="Add coupon" />
                  <button type="button" id="couponBtn" onClick={onCoupon}>Apply</button>
                </div>
              </div>
              <div className="summary-lines">
                <div><span>Subtotal</span><strong>{fmt(totals.subtotal)}</strong></div>
                <div><span>Shipping</span><strong>{fmt(totals.shipping)}</strong></div>
                <div><span>Tax</span><strong>{fmt(totals.tax)}</strong></div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>{fmt(totals.grand)}</strong>
              </div>
              <button className="checkout-btn" id="checkoutBtn" onClick={onCheckout} disabled={items.length === 0}>Checkout</button>
              <a href="/products.html" className="back-shop-btn">Back to shop</a>
              <div className="payment-row" aria-label="Payment methods">
                <span>Visa</span><span>MC</span><span>PayPal</span><span>Pay</span>
              </div>
            </aside>
          </section>

          <section className="commerce-benefits" aria-label="Buyer guarantees">
            <div><strong>Secure payment</strong><span>Encrypted checkout and protected card handling.</span></div>
            <div><strong>Customer support</strong><span>Help with orders, suppliers, and item issues.</span></div>
            <div><strong>Free returns</strong><span>Eligible products can be returned within the policy window.</span></div>
          </section>

          <section className="commerce-recommended">
            <h2>Recommended items</h2>
            <div className="commerce-related-grid" id="cartRecommended">
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
