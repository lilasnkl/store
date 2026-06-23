import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce, discountPrice, fmt } from '../utils/format';
import { searchProducts } from '../data/catalog';
import { addProductToCart } from './cart-drawer-helpers';
import type { Product } from '../types';
export default function SearchAutocomplete() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const requestId = useRef(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const suggest = useCallback(
    debounce(async (value: string, currentId: number) => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      const results = await searchProducts(value, 5);
      if (currentId !== requestId.current) return;
      setSuggestions(results);
      setOpen(results.length > 0);
    }, 250),
    [],
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setQuery(value);
    const id = ++requestId.current;
    suggest(value, id);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (query) navigate('/products.html?q=' + encodeURIComponent(query));
  };

  const onSearchBtnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (query) navigate('/products.html?q=' + encodeURIComponent(query));
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const selectSuggestion = (product: Product) => {
    addProductToCart(product);
    setOpen(false);
  };

  return (
    <div className="search-bar-wrap" ref={wrapRef}>
      <div className="search-bar">
        <select className="search-cat-select" id="searchCatSelect" aria-label="Search category">
          <option value="">All category</option>
        </select>
        <div className="search-divider" />
        <input
          type="text"
          className="search-input"
          id="searchInput"
          placeholder="Search"
          autoComplete="off"
          aria-label="Search products"
          value={query}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <button className="search-btn" id="searchBtn" aria-label="Search" onClick={onSearchBtnClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Search
        </button>
      </div>
      <div className="search-dropdown" id="searchDropdown" hidden={!open}>
        {suggestions.map((product) => (
          <div
            className="search-result-item"
            data-id={product.id}
            key={product.id}
            onClick={() => selectSuggestion(product)}
          >
            <img
              src={product.thumbnail || ''}
              className="search-result-img"
              alt={product.title || ''}
              loading="lazy"
            />
            <div>
              <p className="search-result-name">{product.title || ''}</p>
              <p className="search-result-price">{fmt(discountPrice(product))}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
