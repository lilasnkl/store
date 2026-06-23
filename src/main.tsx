import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './services/toast-context';
import { CartProvider } from './services/cart-context';
import { WishlistProvider } from './services/wishlist-context';
import { AuthProvider } from './services/auth-context';

import '../css/style.css';
import '../css/brand-system.css';
import '../css/home-experience.css';
import '../css/commerce.css';
import '../css/detail.css';
import '../css/products.css';
import '../css/catalog-experience.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
