import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';

export function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="section-inner">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Subscribe on our newsletter</h2>
            <p className="newsletter-sub">
              Get daily news on upcoming offers from many suppliers all over the world
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLS: { title: string; links: string[] }[] = [
  {
    title: 'About',
    links: ['About Us', 'Find store', 'Categories', 'Blogs'],
  },
  {
    title: 'Partnership',
    links: ['About Us', 'Find store', 'Categories', 'Blogs'],
  },
  {
    title: 'Information',
    links: ['Help Center', 'Money Refund', 'Item Protection', 'Chat with Us'],
  },
  {
    title: 'For users',
    links: ['Login', 'Register', 'Settings', 'My Orders'],
  },
];

export function Footer({ variant = 'full' }: { variant?: 'full' | 'minimal' }) {
  if (variant === 'minimal') {
    return (
      <footer className="footer">
        <div className="section-inner">
          <div className="footer-bottom">
            <p className="footer-copy">Copyright &copy; 2024 Brand.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="section-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="4" fill="#0167F3" />
                <path d="M8 10h10a6 6 0 0 1 0 12H8V10z" fill="white" />
                <circle cx="23" cy="22" r="3" fill="white" />
              </svg>
              <span className="logo-text">Brand</span>
            </Link>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84A8.68 8.68 0 0 1 2 19.13 12.1 12.1 0 0 0 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <nav className="footer-col" aria-label={col.title} key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              <ul>
                {col.links.map((linkText) => (
                  <li key={linkText}>
                    <a href="#" className="footer-link">
                      {linkText}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer-col footer-app">
            <h4 className="footer-col-title">Get app</h4>
            <a href="#" className="app-store-btn" aria-label="Download on App Store">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.64M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <span className="app-store-small">Download on the</span>
                <span className="app-store-big">App Store</span>
              </div>
            </a>
            <a href="#" className="app-store-btn" aria-label="Get on Google Play">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83 1-.99 1.4-.38l16 8.5c.4.21.4.77 0 .98l-16 8.5c-.4.6-1.4.44-1.4-.6zM5 6.54v10.92L16.96 12z" />
              </svg>
              <div>
                <span className="app-store-small">Get it on</span>
                <span className="app-store-big">Google Play</span>
              </div>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">Copyright &copy; 2024 Brand.</p>
        </div>
      </div>
    </footer>
  );
}
