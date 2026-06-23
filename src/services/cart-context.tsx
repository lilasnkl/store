import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import {
  addCartItem,
  cartItemCount,
  cartTotal,
  changeCartQuantity as storeChangeQty,
  clearCart as storeClearCart,
  getCartItems,
  removeCartItem,
  setCartQuantity as storeSetQty,
} from './cart-store';

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  refresh: () => void;
  add: (product: Product, quantity?: number) => void;
  remove: (id: number) => void;
  changeQuantity: (id: number, delta: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => getCartItems());
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(() => setItems(getCartItems()), []);

  const add = useCallback(
    (product: Product, quantity = 1) => {
      addCartItem(product, quantity);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: number) => {
      removeCartItem(id);
      refresh();
    },
    [refresh],
  );

  const changeQuantity = useCallback(
    (id: number, delta: number) => {
      storeChangeQty(id, delta);
      refresh();
    },
    [refresh],
  );

  const setQuantity = useCallback(
    (id: number, quantity: number) => {
      storeSetQty(id, quantity);
      refresh();
    },
    [refresh],
  );

  const clear = useCallback(() => {
    storeClearCart();
    refresh();
  }, [refresh]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartItemCount(),
      total: cartTotal(),
      refresh,
      add,
      remove,
      changeQuantity,
      setQuantity,
      clear,
      isOpen,
      open,
      close,
    }),
    [items, isOpen, refresh, add, remove, changeQuantity, setQuantity, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
