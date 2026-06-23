import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../services/cart-context';
import { useToast } from '../services/toast-context';
import { fmt } from '../utils/format';
import { registerAddToCart } from './cart-drawer-helpers';
import type { Product } from '../types';

export default function CartDrawer() {
  const { items, count, total, isOpen, open, close, add, changeQuantity, remove } = useCart();
  const toast = useToast();

  useEffect(() => {
    registerAddToCart((product: Product, quantity = 1) => {
      add(product, quantity);
      open();
      toast((product.title || 'Item') + ' added to cart', 'success');
    });
  }, [add, open, toast]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <>
      <div className={`cart-overlay${isOpen ? ' open' : ''}`} id="cartOverlay" onClick={close} />
      <aside className={`cart-sidebar${isOpen ? ' open' : ''}`} id="cartSidebar">
        <div className="cart-header">
          <h2 className="cart-title">
            Cart (<span id="cartItemCount">{count}</span>)
          </h2>
          <button className="cart-close" id="cartClose" onClick={close}>
            &#x2715;
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="cart-item-img"
                  loading="lazy"
                />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.title}</p>
                  <p className="cart-item-price">{fmt(item.price)}</p>
                  <div className="qty-row">
                    <button
                      className="qty-btn"
                      data-id={item.id}
                      onClick={() => changeQuantity(item.id, -1)}
                    >
                      &#8722;
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button
                      className="qty-btn"
                      data-id={item.id}
                      onClick={() => changeQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  data-id={item.id}
                  aria-label="Remove"
                  onClick={() => remove(item.id)}
                >
                  &#x2715;
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer" id="cartFooter" hidden={items.length === 0}>
          <div className="cart-total-row">
            <span>Total</span>
            <span id="cartTotal">{fmt(total)}</span>
          </div>
          <Link to="/cart.html" className="btn-blue-full" style={{ width: '100%' }}>
            View full cart
          </Link>
        </div>
      </aside>
    </>
  );
}
