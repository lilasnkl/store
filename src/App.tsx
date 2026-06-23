import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Layout from './components/Layout';

const BODY_CLASS_MAP: Record<string, string> = {
  '/': '',
  '/products.html': 'products-page',
  '/detail.html': 'detail-page',
  '/cart.html': 'commerce-page cart-page',
  '/wishlist.html': 'commerce-page wishlist-page',
};

function BodyClassManager() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const baseClass = BODY_CLASS_MAP[pathname] || '';
    document.body.removeAttribute('class');
    if (baseClass) document.body.setAttribute('class', baseClass);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {};
    return handleScroll;
  }, []);

  return null;
}

export default function App() {
  return (
    <>
      <BodyClassManager />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products.html" element={<Products />} />
          <Route path="/detail.html" element={<Detail />} />
          <Route path="/cart.html" element={<Cart />} />
          <Route path="/wishlist.html" element={<Wishlist />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </>
  );
}
