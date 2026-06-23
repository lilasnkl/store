import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Footer, NewsletterSection } from '../components/Footer';
import { CatalogCard } from '../components/ProductCards';
import {
  BRAND_FILTERS,
  CATALOG_CATEGORIES,
  DEFAULT_CATEGORY,
  PAGE_SIZE,
  categoryLabel,
  fetchCatalog,
  getDisplayTotal,
} from '../data/catalog';
import { capitalize } from '../utils/format';
import type { Product } from '../types';

interface State {
  page: number;
  category: string;
  searchQ: string;
  sortBy: string;
  minRating: number;
  minPrice: number;
  maxPrice: number;
  allBrandsVisible: boolean;
  viewMode: 'grid' | 'list';
}

const INITIAL_STATE: State = {
  page: 1,
  category: DEFAULT_CATEGORY,
  searchQ: '',
  sortBy: '',
  minRating: 0,
  minPrice: 0,
  maxPrice: Infinity,
  allBrandsVisible: false,
  viewMode: 'grid',
};

const RATINGS = [
  { min: 0, count: 5, label: '' },
  { min: 4, count: 4, label: '& up' },
  { min: 3, count: 3, label: '& up' },
  { min: 2, count: 2, label: '& up' },
  { min: 1, count: 1, label: '& up' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<State>(() => {
    const next = { ...INITIAL_STATE };
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    if (category) next.category = category;
    if (q) next.searchQ = q;
    return next;
  });

  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const requestId = ++requestIdRef.current;
    const run = async () => {
      const data = await fetchCatalog(state);
      if (cancelled || requestId !== requestIdRef.current) return;
      let start = (state.page - 1) * PAGE_SIZE;
      if (!data.slice(start, start + PAGE_SIZE).length && data.length && state.page > 1) {
        setState((prev) => ({ ...prev, page: 1 }));
        start = 0;
      }
      setProducts(data);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [state]);

  const visibleProducts = useMemo(() => {
    const start = (state.page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, state.page]);

  const total = products.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const setCategory = (category: string) => {
    setState((prev) => ({ ...prev, category, searchQ: '', page: 1 }));
    setSearchParams({}, { replace: true });
  };

  const setSort = (sortBy: string) => {
    setState((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const applyPrice = () => {
    setState((prev) => ({
      ...prev,
      minPrice: parseFloat(minInput) || 0,
      maxPrice: parseFloat(maxInput) || Infinity,
      page: 1,
    }));
  };

  const setRating = (min: number) => {
    setState((prev) => ({ ...prev, minRating: min, page: 1 }));
  };

  const setView = (viewMode: 'grid' | 'list') => {
    setState((prev) => ({ ...prev, viewMode }));
  };

  const setPage = (page: number) => {
    setState((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resultsLabel = state.searchQ
    ? `"${state.searchQ}"`
    : state.category
      ? categoryLabel(state.category)
      : 'All Products';
  const visibleTotal = getDisplayTotal({ total });

  return (
    <>
      <TopNav />

      <div className="breadcrumb-bar">
        <div className="section-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="bc-link">Home</a>
            <span className="bc-sep">›</span>
            <span className="bc-link" id="bcCategory">
              {state.searchQ ? 'Search' : categoryLabel(state.category)}
            </span>
            <span className={`bc-sep bc-sep--last${state.searchQ ? '' : ''}`} id="bcSubSep" hidden={!state.searchQ}>›</span>
            <span className="bc-current" id="bcCurrent" hidden={!state.searchQ}>{state.searchQ ? `"${state.searchQ}"` : ''}</span>
          </nav>
        </div>
      </div>

      <main className="plp-main">
        <div className="section-inner plp-inner">
          <aside className="filter-sidebar" id="filterSidebar">
            <FilterBlock title="Categories">
              <ul className="filter-cat-list" id="filterCatList" role="list">
                {CATALOG_CATEGORIES.map((category) => (
                  <li
                    className={`filter-cat-item${category.slug === state.category ? ' active' : ''}`}
                    data-cat={category.slug}
                    key={category.slug}
                    onClick={() => setCategory(category.slug)}
                  >
                    <span>{capitalize(category.name)}</span>
                  </li>
                ))}
              </ul>
            </FilterBlock>

            <FilterBlock title="Brands">
              <ul className="filter-check-list" id="filterBrandList" role="list">
                {(state.allBrandsVisible ? BRAND_FILTERS : BRAND_FILTERS.slice(0, 5)).map((brand) => (
                  <li key={brand}>
                    <label className="filter-check-label">
                      <input type="checkbox" className="filter-check" data-brand={brand} />
                      {brand}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                className="filter-see-all"
                id="brandSeeAll"
                onClick={() => setState((prev) => ({ ...prev, allBrandsVisible: !prev.allBrandsVisible }))}
                hidden={BRAND_FILTERS.length <= 5}
              >
                {state.allBrandsVisible ? 'See less' : 'See all'}
              </button>
            </FilterBlock>

            <FilterBlock title="Features">
              <ul className="filter-check-list" role="list">
                {['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'].map((feature) => (
                  <li key={feature}>
                    <label className="filter-check-label">
                      <input type="checkbox" className="filter-check" />
                      {feature}
                    </label>
                  </li>
                ))}
              </ul>
            </FilterBlock>

            <FilterBlock title="Price range">
              <div className="price-range-row">
                <input
                  type="number"
                  className="price-input"
                  id="priceMin"
                  placeholder="Min"
                  min="0"
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                />
                <span className="price-dash">-</span>
                <input
                  type="number"
                  className="price-input"
                  id="priceMax"
                  placeholder="Max"
                  min="0"
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                />
              </div>
              <button className="btn-apply-price" id="applyPriceBtn" onClick={applyPrice}>Apply</button>
            </FilterBlock>

            <FilterBlock title="Condition">
              <ul className="filter-radio-list" role="list">
                {[{ v: '', l: 'Any' }, { v: 'refurbished', l: 'Refurbished' }, { v: 'brand-new', l: 'Brand new' }, { v: 'old-items', l: 'Old items' }].map((cond, i) => (
                  <li key={cond.v}>
                    <label className="filter-radio-label">
                      <input type="radio" name="condition" value={cond.v} defaultChecked={i === 0} className="filter-radio" />
                      {cond.l}
                    </label>
                  </li>
                ))}
              </ul>
            </FilterBlock>

            <FilterBlock title="Ratings">
              <ul className="filter-rating-list" id="filterRatingList" role="list">
                {RATINGS.map((r) => (
                  <li
                    className={`filter-rating-item${r.min === state.minRating ? ' active' : ''}`}
                    data-min={r.min}
                    key={r.min}
                    onClick={() => setRating(r.min)}
                  >
                    <div className="stars" data-count={r.count}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span className={i < r.count ? 'star filled' : 'star'} key={i}>★</span>
                      ))}
                    </div>
                    {r.label && <span className="rating-label" dangerouslySetInnerHTML={{ __html: r.label }} />}
                  </li>
                ))}
              </ul>
            </FilterBlock>
          </aside>

          <div className="plp-results">
            <div className="results-header">
              <p className="results-count" id="resultsCount">
                {loading ? 'Loading...' : `${visibleTotal.toLocaleString()} items in ${resultsLabel}`}
              </p>
              <div className="results-controls">
                <label className="results-sort-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="21" y1="10" x2="7" y2="10" />
                    <line x1="21" y1="6" x2="3" y2="6" />
                    <line x1="21" y1="14" x2="3" y2="14" />
                    <line x1="21" y1="18" x2="7" y2="18" />
                  </svg>
                  Verified only
                  <input type="checkbox" id="featuredOnly" className="sr-only" />
                </label>
                <select
                  className="results-sort-select"
                  id="sortSelect"
                  aria-label="Sort by"
                  value={state.sortBy}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Top Rated</option>
                  <option value="discount-desc">Best Discount</option>
                </select>
                <div className="view-toggle">
                  <button
                    className={`view-btn${state.viewMode === 'list' ? ' active' : ''}`}
                    id="listViewBtn"
                    aria-label="List view"
                    title="List view"
                    onClick={() => setView('list')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                  <button
                    className={`view-btn${state.viewMode === 'grid' ? ' active' : ''}`}
                    id="gridViewBtn"
                    aria-label="Grid view"
                    title="Grid view"
                    onClick={() => setView('grid')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={`plp-list${state.viewMode === 'grid' ? ' grid-view' : ''}`} id="plpList" role="list">
              {loading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => <div className="plp-skeleton" key={i} />)
                : visibleProducts.length === 0
                  ? <div style={{ padding: 32, textAlign: 'center', color: '#8B96A5', fontSize: 14 }}>No products found.</div>
                  : visibleProducts.map((product) => <CatalogCard product={product} key={product.id} />)}
            </div>

            {totalPages > 1 && (
              <div className="pagination" id="pagination">
                <button
                  className="page-btn"
                  id="pgPrev"
                  disabled={state.page === 1}
                  onClick={() => setPage(state.page - 1)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    className={`page-btn${i + 1 === state.page ? ' active' : ''}`}
                    data-page={i + 1}
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  id="pgNext"
                  disabled={state.page === totalPages}
                  onClick={() => setPage(state.page + 1)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <NewsletterSection />
      <Footer />
    </>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="filter-block">
      <h3 className="filter-block-title">{title}</h3>
      {children}
    </div>
  );
}
