import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { addWishlist, getWishlistIds, isWished as storeIsWished, removeWishlist, toggleWishlist as storeToggle } from './wishlist-store';

interface WishlistContextValue {
  ids: number[];
  isWished: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => boolean;
  refresh: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(() => getWishlistIds());

  const refresh = useCallback(() => setIds(getWishlistIds()), []);

  const add = useCallback(
    (id: number) => {
      addWishlist(id);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: number) => {
      removeWishlist(id);
      refresh();
    },
    [refresh],
  );

  const toggle = useCallback(
    (id: number) => {
      const result = storeToggle(id);
      refresh();
      return result;
    },
    [refresh],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      isWished: storeIsWished,
      add,
      remove,
      toggle,
      refresh,
    }),
    [ids, add, remove, toggle, refresh],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
