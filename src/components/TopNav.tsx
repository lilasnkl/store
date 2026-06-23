import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../services/cart-context';
import { useAuth } from '../services/auth-context';
import SearchAutocomplete from './SearchAutocomplete';

interface TopNavProps {
  variant?: 'full' | 'commerce';
}

export default function TopNav({ variant = 'full' }: TopNavProps) {
  const { count, open } = useCart();

  if (variant === 'commerce') {
    return (
      <header className="top-nav">
        <div className="top-nav-inner">
          <Link to="/" className="logo" aria-label="Brand home">
            <span className="logo-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="4" fill="#0167F3" />
                <path d="M8 10h10a6 6 0 0 1 0 12H8V10z" fill="white" />
                <circle cx="23" cy="22" r="3" fill="white" />
              </svg>
            </span>
            <span className="logo-text">Brand</span>
          </Link>
          <SearchAutocomplete />
          <div className="top-nav-icons">
            <Link className="icon-btn" to="/wishlist.html" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="icon-label">Wishlist</span>
            </Link>
            <Link className="icon-btn cart-icon-btn" to="/cart.html" aria-label="Shopping cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="icon-label">My cart</span>
              <span className={`cart-badge${count > 0 ? ' show' : ''}`}>{count}</span>
            </Link>
          </div>
        </div>
        <CatNav />
      </header>
    );
  }

  const { authorize } = useAuth();

  const onMessagesClick = useCallback(
    (event: React.MouseEvent) => {
      if (!authorize('Messages')) event.preventDefault();
    },
    [authorize],
  );

  const onOrdersClick = useCallback(
    (event: React.MouseEvent) => {
      if (!authorize('Orders')) event.preventDefault();
    },
    [authorize],
  );

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Link to="/" className="logo" aria-label="Brand home">
          <span className="logo-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="4" fill="#0167F3" />
              <path d="M8 10h10a6 6 0 0 1 0 12H8V10z" fill="white" />
              <circle cx="23" cy="22" r="3" fill="white" />
            </svg>
          </span>
          <span className="logo-text">Brand</span>
        </Link>
        <SearchAutocomplete />
        <div className="top-nav-icons">
          <a
            className="icon-btn"
            href="#"
            aria-label="Messages"
            onClick={onMessagesClick}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="icon-label">Message</span>
          </a>
          <a
            className="icon-btn"
            href="#"
            aria-label="Orders"
            onClick={onOrdersClick}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="icon-label">Orders</span>
          </a>
          <Link className="icon-btn" to="/wishlist.html" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="icon-label">Wishlist</span>
          </Link>
          <button type="button" className="icon-btn cart-icon-btn" aria-label="Shopping cart" onClick={open}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="icon-label">My cart</span>
            <span className={`cart-badge${count > 0 ? ' show' : ''}`}>{count}</span>
          </button>
          <div className="lang-select">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>English, USD</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
      <CatNav />
    </header>
  );
}

function CatNav() {
  const { snapshot, openAuth, logout, authorize, refreshTokens } = useAuth();
  const userName = snapshot.user?.name || 'user';

  const onJoinClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (snapshot.isAuthenticated) openAuth('status');
    else openAuth('register');
  };

  const onLoginClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (snapshot.isAuthenticated) logout();
    else openAuth('login');
  };

  return (
    <nav className="cat-nav" aria-label="Category navigation">
      <div className="cat-nav-inner">
        <div className="cat-nav-left">
          <Link to="/products.html" className="all-cat-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            All category
          </Link>
          <ul className="cat-nav-links" role="list">
            <li><Link to="/products.html" className="cat-nav-link">Hot offers</Link></li>
            <li><Link to="#" className="cat-nav-link">Gift boxes</Link></li>
            <li><Link to="#" className="cat-nav-link">Source requests</Link></li>
            <li><Link to="#" className="cat-nav-link">Verified suppliers</Link></li>
            <li>
              <Link to="#" className="cat-nav-link">
                Help
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
        <div className="cat-nav-right">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="user-greeting">Hi, <strong>{userName}</strong></span>
          <span className="user-sub">{snapshot.user ? 'authenticated locally' : "let's get started"}</span>
          <a href="#" className="btn-join" onClick={onJoinClick}>
            {snapshot.user ? 'Auth status' : 'Join now'}
          </a>
          <span className="user-or" hidden={Boolean(snapshot.user)}>or</span>
          <a href="#" className="btn-login" onClick={onLoginClick}>
            {snapshot.user ? 'Log out' : 'Log in'}
          </a>
        </div>
      </div>
    </nav>
  );
}
