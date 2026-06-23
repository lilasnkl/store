import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Footer, NewsletterSection } from '../components/Footer';
import { DealCard, HomeProductCard } from '../components/ProductCards';
import { DEAL_PRODUCTS, FEATURED_PRODUCTS } from '../data/home';
import { fetchCatalog } from '../data/catalog';
import { useAuth } from '../services/auth-context';
import type { Product } from '../types';

const HOME_OUTDOOR_ITEMS = [
  { name: 'Soft chairs', img: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Sofa & chair', img: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Kitchen dishes', img: 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Smart watches', img: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Kitchen mixer', img: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 100' },
  { name: 'Blenders', img: 'https://images.pexels.com/photos/4226765/pexels-photo-4226765.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 39' },
  { name: 'Home appliance', img: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Coffee maker', img: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 10' },
];

const ELECTRONICS_ITEMS = [
  { name: 'Smart watches', img: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Cameras', img: 'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 89' },
  { name: 'Headphones', img: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 19' },
  { name: 'Smart watches', img: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 90' },
  { name: 'Gaming set', img: 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 35' },
  { name: 'Laptops & PC', img: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=150', price: 'USD 340' },
  { name: 'Smartphones', img: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 340' },
  { name: 'Electric kettle', img: 'https://images.pexels.com/photos/4226765/pexels-photo-4226765.jpeg?auto=compress&cs=tinysrgb&w=150', price: 'USD 340' },
];

const SERVICE_CARDS = [
  { name: 'Source from<br/>industry hubs', img: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Customize your<br/>products', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Fast, reliable shipping<br/>by ocean', img: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Product monitoring<br/>and inspection', img: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const SUPPLIERS = [
  { flag: '🇦🇪', name: 'Arabia' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🇮🇹', name: 'Italy' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇰🇷', name: 'China' },
  { flag: '🇷🇺', name: 'Russia' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇬🇧', name: 'Great Britain' },
];

export default function Home() {
  const [deals, setDeals] = useState<Product[] | null>(null);
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  const load = async () => {
    setDeals(null);
    setFeatured(null);
    setErrorVisible(false);
    try {
      const [dealsData, featuredData] = await Promise.all([
        fetchCatalog({ category: 'electronics', sortBy: 'discount-desc' }),
        fetchCatalog({ category: 'electronics' }),
      ]);
      setDeals(dealsData.length ? dealsData.slice(0, 5) : (DEAL_PRODUCTS as unknown as Product[]));
      setFeatured(featuredData.length ? featuredData.slice(0, 10) : FEATURED_PRODUCTS);
    } catch {
      setErrorVisible(true);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRetry = () => load();

  return (
    <>
      <TopNav />

      <section className="hero-area">
        <section className="hero-inner" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px' }}>
          <HeroPanel />
        </section>
      </section>

      <DealsSection deals={deals} />

      <section className="section cat-section">
        <div className="section-inner">
          <div className="cat-section-layout">
            <div className="cat-promo-card cat-promo-green" style={{ maxWidth: 'unset' }}>
              <h3 className="cat-promo-title">Home and<br />outdoor</h3>
              <a href="/products.html?category=furniture" className="btn-source-now">Source now</a>
              <img
                src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Home and outdoor"
                className="cat-promo-img"
                loading="lazy"
              />
            </div>
            <div className="cat-items-grid" role="list">
              {HOME_OUTDOOR_ITEMS.map((item) => (
                <div className="cat-item-card" key={item.name} role="listitem">
                  <img src={item.img} alt={item.name} className="cat-item-img" loading="lazy" />
                  <p className="cat-item-name">{item.name}</p>
                  <p className="cat-item-price">
                    From<br /><strong>{item.price}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section cat-section">
        <div className="section-inner">
          <div className="cat-section-layout">
            <div className="cat-promo-card cat-promo-blue-light" style={{ maxWidth: 'unset' }}>
              <h3 className="cat-promo-title">Consumer<br />electronics<br />and gadgets</h3>
              <a href="/products.html?category=laptops" className="btn-source-now">Source now</a>
              <img
                src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Consumer electronics"
                className="cat-promo-img"
                loading="lazy"
              />
            </div>
            <div className="cat-items-grid" role="list">
              {ELECTRONICS_ITEMS.map((item, idx) => (
                <div className="cat-item-card" key={`${item.name}-${idx}`} role="listitem">
                  <img src={item.img} alt={item.name} className="cat-item-img" loading="lazy" />
                  <p className="cat-item-name">{item.name}</p>
                  <p className="cat-item-price">
                    From<br /><strong>{item.price}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InquiryBanner />

      <section className="section" id="products">
        <div className="section-inner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 className="section-heading">Recommended items</h2>
            <Link to="/products.html" style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500, textDecoration: 'none' }}>
              View all &rsaquo;
            </Link>
          </div>
          <div className="products-grid" id="productsGrid" role="list" aria-label="Recommended products">
            {featured === null
              ? Array.from({ length: 10 }).map((_, i) => <div className="product-skeleton" key={i} />)
              : featured.map((product) => <HomeProductCard product={product} key={product.id} />)}
          </div>
          <div className="error-state" id="errorState" hidden={errorVisible}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>
              Failed to load products. <button className="retry-link" id="retryBtn" onClick={onRetry}>Try again</button>
            </p>
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="section-inner">
          <h2 className="section-heading" style={{ marginBottom: 20 }}>Our extra services</h2>
          <div className="services-grid">
            {SERVICE_CARDS.map((service) => (
              <div className="service-card" key={service.name}>
                <img src={service.img} alt={service.name} className="service-img" loading="lazy" />
                <div className="service-overlay">
                  <p className="service-name" dangerouslySetInnerHTML={{ __html: service.name }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section suppliers-section">
        <div className="section-inner">
          <h2 className="section-heading" style={{ marginBottom: 20 }}>Suppliers by region</h2>
          <div className="suppliers-grid">
            {SUPPLIERS.map((supplier) => (
              <div className="supplier-region" key={supplier.name}>
                <span className="flag">{supplier.flag}</span>
                <span>{supplier.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  );
}

function HeroPanel() {
  const { snapshot, openAuth, logout } = useAuth();

  return (
    <>
      <aside className="cat-sidebar" id="catSidebar" aria-label="Browse categories">
        <ul className="sidebar-cat-list" role="list">
          <li><Link to="/products.html?category=vehicle" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            Automobiles
          </Link></li>
          <li><Link to="/products.html?category=womens-dresses" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></svg>
            Clothes and wear
          </Link></li>
          <li><Link to="/products.html?category=furniture" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Home interiors
          </Link></li>
          <li><Link to="/products.html?category=laptops" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            Computer and tech
          </Link></li>
          <li><Link to="#" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            Tools, equipments
          </Link></li>
          <li><Link to="#" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" /></svg>
            Sports and outdoor
          </Link></li>
          <li><Link to="#" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>
            Animal and pets
          </Link></li>
          <li><Link to="#" className="sidebar-cat-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M16.24 7.76a6 6 0 0 1 0 8.49" /></svg>
            Machinery tools
          </Link></li>
          <li><Link to="/products.html" className="sidebar-cat-link more-cat">
            More category
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9" /></svg>
          </Link></li>
        </ul>
      </aside>

      <div className="hero-banner">
        <div className="hero-banner-content">
          <p className="hero-banner-sub">Latest trending</p>
          <h1 className="hero-banner-title">Electronic items</h1>
          <a href="/products.html?category=laptops" className="btn-learn-more">Learn more</a>
        </div>
        <div className="hero-banner-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
            alt="Headphones and electronics"
            className="hero-banner-img"
            loading="eager"
          />
        </div>
      </div>

      <aside className="hero-right-panel" id="heroRightPanel">
        <div className="right-panel-card user-card">
          <p className="user-card-greeting">Hi, <strong>{snapshot.user?.name || 'user'}</strong></p>
          <p className="user-card-sub">{snapshot.user ? 'authenticated locally' : "let's get started"}</p>
          <div className="user-card-btns">
            <button
              className="btn-blue-full"
              type="button"
              onClick={() => (snapshot.user ? openAuth('status') : openAuth('register'))}
            >
              {snapshot.user ? 'Auth status' : 'Join now'}
            </button>
            <button
              className="btn-outline-blue"
              type="button"
              onClick={() => (snapshot.user ? logout() : openAuth('login'))}
            >
              {snapshot.user ? 'Log out' : 'Log in'}
            </button>
          </div>
        </div>
        <div className="right-panel-card promo-card-orange">
          <p>Get US $10 off</p>
          <p className="promo-small">with a new supplier</p>
        </div>
        <div className="right-panel-card promo-card-blue">
          <p>Send quotes with</p>
          <p className="promo-small">supplier preferences</p>
        </div>
      </aside>
    </>
  );
}

function DealsSection({ deals }: { deals: Product[] | null }) {
  const [cd, setCd] = useState({ days: '04', hours: '13', minutes: '34', seconds: '56' });

  useEffect(() => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 4);
    deadline.setHours(13, 34, 56, 0);
    const pad = (value: number) => String(value).padStart(2, '0');
    const tick = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) return;
      setCd({
        days: pad(Math.floor(diff / 86400000)),
        hours: pad(Math.floor((diff % 86400000) / 3600000)),
        minutes: pad(Math.floor((diff % 3600000) / 60000)),
        seconds: pad(Math.floor((diff % 60000) / 1000)),
      });
    };
    tick();
    const handle = setInterval(tick, 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <section className="section deals-section">
      <div className="section-inner">
        <div className="deals-header">
          <div className="deals-title-wrap">
            <h2 className="section-heading">Deals and offers</h2>
            <p className="section-subheading">Electronic equipments</p>
          </div>
          <div className="countdown-wrap" id="countdown" aria-live="polite">
            <div className="cd-unit"><span className="cd-num" id="cdDays">{cd.days}</span><span className="cd-lbl">Days</span></div>
            <div className="cd-unit"><span className="cd-num" id="cdHours">{cd.hours}</span><span className="cd-lbl">Hour</span></div>
            <div className="cd-unit"><span className="cd-num" id="cdMins">{cd.minutes}</span><span className="cd-lbl">Min</span></div>
            <div className="cd-unit"><span className="cd-num" id="cdSecs">{cd.seconds}</span><span className="cd-lbl">Sec</span></div>
          </div>
        </div>
        <div className="deals-products" id="dealsGrid" role="list">
          {deals === null
            ? Array.from({ length: 5 }).map((_, i) => <div className="deal-skeleton" key={i} />)
            : deals.map((product) => <DealCard product={product} key={product.id} />)}
        </div>
      </div>
    </section>
  );
}

function InquiryBanner() {
  return (
    <section className="inquiry-banner">
      <div className="section-inner">
        <div className="inquiry-layout">
          <div className="inquiry-left">
            <h2 className="inquiry-title">An easy way to send requests to all suppliers</h2>
            <p className="inquiry-desc">Send inquiry details once and get matched with qualified suppliers for your product needs.</p>
          </div>
          <div className="inquiry-divider" />
          <div className="inquiry-right">
            <h3 className="inquiry-form-title">Send quote to suppliers</h3>
            <form className="inquiry-form" onSubmit={(e) => e.preventDefault()}>
              <label className="inquiry-label">What item you need?</label>
              <input type="text" className="inquiry-input" placeholder="Type more details" aria-label="Item description" />
              <div className="inquiry-row">
                <input type="number" className="inquiry-input inquiry-qty" placeholder="Quantity" aria-label="Quantity" />
                <select className="inquiry-select" aria-label="Unit">
                  <option>Pcs</option>
                  <option>Kg</option>
                  <option>Ton</option>
                  <option>Box</option>
                </select>
              </div>
              <button className="btn-send-inquiry">Send inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
