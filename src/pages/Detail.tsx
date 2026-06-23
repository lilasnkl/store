import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Footer, NewsletterSection } from '../components/Footer';
import { RelatedCard } from '../components/ProductCards';
import {
  DETAIL_DEFAULT_ID,
  categoryLabel,
  fetchProductById,
  fetchRelatedProducts,
} from '../data/catalog';
import { useCart } from '../services/cart-context';
import { useWishlist } from '../services/wishlist-context';
import { useToast } from '../services/toast-context';
import { discountPrice, fmt, starHtml } from '../utils/format';
import type { Product } from '../types';

type Tab = 'panelDescription' | 'panelReviews' | 'panelShipping' | 'panelSeller';

export default function Detail() {
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get('id') || DETAIL_DEFAULT_ID);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('panelDescription');
  const [quantity, setQuantity] = useState(1);

  const { add, open } = useCart();
  const { isWished, toggle } = useWishlist();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchProductById(id).then((p) => {
      if (cancelled) return;
      setProduct(p);
      setActiveImage(0);
      setQuantity(1);
      document.title = `${p.title} | Brand`;
    });
    fetchRelatedProducts(id, 6).then((data) => {
      if (cancelled) return;
      setRelated(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!product) {
    return (
      <>
        <TopNav />
        <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#8B96A5' }}>
          Loading product...
        </main>
      </>
    );
  }

  const p = product;
  const images = p.images?.length ? p.images : [p.thumbnail].filter(Boolean);
  const wished = isWished(p.id);

  const addToCart = () => {
    add(p, quantity);
    open();
    toast((p.title || 'Item') + ' added to cart', 'success');
  };

  const onInquiry = () => toast('Inquiry request prepared', 'success');
  const onWish = () => {
    const active = toggle(p.id);
    if (active) toast('Added to wishlist', 'success');
  };

  const supplier = p.supplier || { name: 'Brand Supplier', country: 'Germany, Berlin', flag: 'DE' };

  return (
    <>
      <TopNav />

      <div className="detail-breadcrumb">
        <div className="section-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="bc-link">Home</a>
            <span className="bc-sep">&gt;</span>
            <a href="/products.html" className="bc-link" id="detailCategory">{categoryLabel(p.category)}</a>
            <span className="bc-sep">&gt;</span>
            <span className="bc-current" id="detailCurrent">{p.title}</span>
          </nav>
        </div>
      </div>

      <main className="detail-main">
        <section className="section-inner detail-shell" aria-label="Product details">
          <div className="detail-gallery">
            <div className="detail-main-image-wrap">
              <img id="detailMainImage" className="detail-main-image" src={images[activeImage] || p.thumbnail || ''} alt={p.title || ''} />
            </div>
            <div className="detail-thumbs" id="detailThumbs">
              {images.map((src, index) => (
                <button className={`detail-thumb${index === activeImage ? ' active' : ''}`} data-src={src} aria-label={`View image ${index + 1}`} key={src + index} onClick={() => setActiveImage(index)}>
                  <img src={src} alt={`${p.title} thumbnail ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <section className="detail-info">
            <p className="detail-stock" id="detailStock">In stock</p>
            <h1 id="detailTitle">{p.title}</h1>
            <div className="detail-rating-row">
              <div className="detail-stars" id="detailStars" dangerouslySetInnerHTML={{ __html: starHtml(p.rating, 'detail-star') }} />
              <span id="detailRatingValue">{Number(p.rating || 0).toFixed(1)}</span>
              <span className="detail-dot" />
              <span id="detailOrders">{p.orders || 0} orders</span>
              <span className="detail-dot" />
              <span>Free shipping</span>
            </div>

            <div className="detail-price-box">
              <div>
                <strong id="detailPrice">{fmt(discountPrice(p))}</strong>
                <span id="detailOldPrice">{p.discountPercentage ? fmt(p.price) : ''}</span>
              </div>
              <p>Tiered pricing for volume orders</p>
              <div className="detail-tier-grid" id="detailPriceTiers">
                {(p.priceTiers || []).map((tier) => (
                  <div className="tier-cell" key={tier.qty}>
                    <strong>{fmt(tier.price)}</strong>
                    <span>{tier.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="detail-summary" id="detailDescription">{p.description || ''}</p>
            <dl className="detail-spec-list" id="detailSpecs">
              {(p.specs || []).map(([label, value]) => (
                <div className="spec-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </dl>

            <div className="detail-qty-row">
              <span>Quantity</span>
              <div className="qty-stepper" aria-label="Quantity">
                <button id="qtyMinus" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <strong id="qtyValue">{quantity}</strong>
                <button id="qtyPlus" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(99, q + 1))}>+</button>
              </div>
              <span className="detail-muted">pieces</span>
            </div>
          </section>

          <aside className="supplier-card" aria-label="Supplier information">
            <div className="supplier-top">
              <span className="supplier-initial" id="supplierInitial">{(supplier.name || 'S').trim().charAt(0).toUpperCase()}</span>
              <div>
                <p>Supplier</p>
                <strong id="supplierName">{supplier.name}</strong>
              </div>
            </div>
            <div className="supplier-meta">
              <span id="supplierFlag">{supplier.flag}</span>
              <span id="supplierCountry">{supplier.country}</span>
            </div>
            <ul className="supplier-trust" role="list">
              <li>Verified Seller</li>
              <li>Worldwide shipping</li>
              <li>Secure payments</li>
            </ul>
            <button className="btn-blue-full supplier-primary" id="sendInquiryBtn" onClick={onInquiry}>Send inquiry</button>
            <button className="supplier-secondary" id="addDetailCart" onClick={addToCart}>Add to cart</button>
            <button className={`supplier-save${wished ? ' saved' : ''}`} id="saveProductBtn" onClick={onWish}>
              <span dangerouslySetInnerHTML={{ __html: wished ? '&hearts;' : '&#9825;' }} /> {wished ? 'Saved' : 'Save for later'}
            </button>
          </aside>
        </section>

        <section className="section-inner detail-service-bar" aria-label="Buyer protections">
          <div><strong>Trade Assurance</strong><span>Protects every payment until delivery is complete.</span></div>
          <div><strong>Verified supplier</strong><span>Factory profile and business documents reviewed.</span></div>
          <div><strong>Fast response</strong><span>Average reply within 24 hours.</span></div>
        </section>

        <section className="section-inner detail-lower">
          <article className="detail-tabs-card">
            <div className="detail-tabs" role="tablist" aria-label="Product information">
              <button className={`detail-tab${activeTab === 'panelDescription' ? ' active' : ''}`} role="tab" onClick={() => setActiveTab('panelDescription')}>Description</button>
              <button className={`detail-tab${activeTab === 'panelReviews' ? ' active' : ''}`} role="tab" onClick={() => setActiveTab('panelReviews')}>Reviews</button>
              <button className={`detail-tab${activeTab === 'panelShipping' ? ' active' : ''}`} role="tab" onClick={() => setActiveTab('panelShipping')}>Shipping</button>
              <button className={`detail-tab${activeTab === 'panelSeller' ? ' active' : ''}`} role="tab" onClick={() => setActiveTab('panelSeller')}>About seller</button>
            </div>

            <div className={`detail-panel${activeTab === 'panelDescription' ? ' active' : ''}`} role="tabpanel">
              <p>The item is built for marketplace sourcing with consistent quality, clean packaging, and flexible quantity options. It is suitable for retail bundles, private label offers, and repeat procurement orders.</p>
              <ul className="detail-check-list" id="detailFeatureList">
                {(p.features || []).map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className="detail-description-grid">
                <div><h3>Model details</h3><p>SKU-{p.id}</p></div>
                <div><h3>Customization</h3><p>Logo, carton, colors, and pack sizes can be discussed with the supplier.</p></div>
              </div>
            </div>
            <div className={`detail-panel${activeTab === 'panelReviews' ? ' active' : ''}`} role="tabpanel">
              <p>Buyers rated this product highly for quality consistency, fabric comfort, and supplier response time.</p>
            </div>
            <div className={`detail-panel${activeTab === 'panelShipping' ? ' active' : ''}`} role="tabpanel">
              <p>Standard shipping, express freight, and consolidated container shipment are available depending on order quantity and destination.</p>
            </div>
            <div className={`detail-panel${activeTab === 'panelSeller' ? ' active' : ''}`} role="tabpanel">
              <p>The supplier supports sampling, production updates, payment protection, and inspection before shipment.</p>
            </div>
          </article>

          <aside className="side-products-card">
            <h2>You may like</h2>
            <div className="side-products">
              {related.slice(0, 5).map((item) => (
                <Link className="side-product" to={`/detail.html?id=${item.id}`} key={item.id}>
                  <img src={item.thumbnail} alt={item.title} loading="lazy" />
                  <span>{item.title}</span>
                  <strong>{fmt(discountPrice(item))}</strong>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="section-inner detail-related-section">
          <h2>Related products</h2>
          <div className="detail-related-grid" id="relatedProducts">
            {related.map((item) => <RelatedCard product={item} key={item.id} />)}
          </div>
        </section>

        <section className="section-inner detail-supplier-banner">
          <div>
            <h2>Super discount on more than 100 USD</h2>
            <p>Have you ever finally just write dummy info</p>
          </div>
          <a href="/products.html" className="banner-cta">Shop now</a>
        </section>
      </main>

      <NewsletterSection />
      <Footer />
    </>
  );
}
