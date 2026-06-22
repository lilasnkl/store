import { capitalize } from '../utils/format.js';

export const PAGE_SIZE = 9;
export const DEFAULT_CATEGORY = 'mobile-accessory';
export const DEFAULT_CATEGORY_LABEL = 'Mobile accessory';
export const CATALOG_DISPLAY_TOTAL = 12911;
export const DETAIL_DEFAULT_ID = 123;

const API_BASE_URL = 'https://dummyjson.com/products';
const API_CATALOG_LIMIT = 200;
const API_TECH_CATEGORIES = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
const API_CATEGORY_MAP = {
  [DEFAULT_CATEGORY]: API_TECH_CATEGORIES,
  electronics: API_TECH_CATEGORIES,
  'modern-tech': ['mobile-accessories'],
  smartphones: ['smartphones'],
  tablets: ['tablets'],
  laptops: ['laptops'],
};

let apiCatalogPromise;
let apiCatalog = [];

export const CATALOG_CATEGORIES = [
  { slug: DEFAULT_CATEGORY, name: DEFAULT_CATEGORY_LABEL },
  { slug: 'electronics', name: 'Electronics' },
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'modern-tech', name: 'Modern Tech' },
  { slug: 'tablets', name: 'Tablets' },
  { slug: 'laptops', name: 'Laptops' },
];

export const BRAND_FILTERS = ['Samsung', 'Apple', 'Huawei', 'Poco', 'Lenovo'];

const DETAIL_PRODUCT = {
  id: DETAIL_DEFAULT_ID,
  title: 'Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle',
  description: 'The auth endpoint provides details about user authentication, authorization, and refresh tokens.',
  category: 'mobile-accessory',
  brand: 'Brand',
  price: 98,
  discountPercentage: 0,
  rating: 4.8,
  orders: 154,
  thumbnail: 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp',
  images: [
    'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp',
    'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp',
    'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp',
    'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp',
    'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=420',
    'https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?auto=compress&cs=tinysrgb&w=420',
  ],
  shippingInformation: 'Free shipping',
  supplier: {
    name: 'Guanjoi Trading LLC',
    country: 'Germany, Berlin',
    flag: 'DE',
    verified: true,
  },
  priceTiers: [
    { qty: '50-100 pcs', price: 98 },
    { qty: '100-700 pcs', price: 90 },
    { qty: '700+ pcs', price: 78 },
  ],
  specs: [
    ['Price', 'Negotiable'],
    ['Type', 'Classic cotton base layer'],
    ['Material', 'Cotton blend'],
    ['Design', 'Modern slim fit'],
    ['Customization', 'Logo, color, packaging'],
    ['Protection', 'Refund policy'],
    ['Warranty', '2 years full warranty'],
  ],
  features: ['Soft breathable fabric', 'Trade Assurance ready', 'Sample available', 'Ships worldwide'],
};

const ELECTRONICS = [
  {
    id: 1101,
    title: 'iPhone 13 Pro',
    description: 'Flagship smartphone with a vivid display, fast camera system, and premium metal body.',
    category: 'smartphones',
    brand: 'Apple',
    price: 998,
    discountPercentage: 7,
    rating: 4.8,
    orders: 154,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1102,
    title: 'Samsung Galaxy S8',
    description: 'Slim Android phone with edge display, fast charging, and reliable daily performance.',
    category: 'smartphones',
    brand: 'Samsung',
    price: 749,
    discountPercentage: 5,
    rating: 4.6,
    orders: 82,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1103,
    title: 'Oppo F19 Pro Plus',
    description: 'Bright AMOLED smartphone with fast 5G performance and a lightweight build.',
    category: 'smartphones',
    brand: 'Oppo',
    price: 399,
    discountPercentage: 9,
    rating: 4.5,
    orders: 97,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1104,
    title: 'iPad Mini 2021 Starlight',
    description: 'Compact tablet for browsing, sketching, reading, and mobile productivity.',
    category: 'tablets',
    brand: 'Apple',
    price: 539,
    discountPercentage: 4,
    rating: 4.7,
    orders: 65,
    thumbnail: 'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1105,
    title: 'TV Studio Camera Pedestal',
    description: 'Professional studio camera support with smooth adjustment and heavy-duty balance.',
    category: 'electronics',
    brand: 'ProVision',
    price: 499,
    discountPercentage: 11,
    rating: 4.4,
    orders: 34,
    thumbnail: 'https://cdn.dummyjson.com/product-images/mobile-accessories/tv-studio-camera-pedestal/thumbnail.webp',
    shippingInformation: 'Ships in 3 days',
  },
  {
    id: 1106,
    title: 'Samsung Galaxy Tab S8 Plus',
    description: 'Wide-screen tablet with sharp color, responsive pen support, and powerful speakers.',
    category: 'tablets',
    brand: 'Samsung',
    price: 699,
    discountPercentage: 8,
    rating: 4.6,
    orders: 71,
    thumbnail: 'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1107,
    title: 'Apple MacBook Pro 14 Inch',
    description: 'Portable laptop with a sharp display, strong performance, and all-day battery life.',
    category: 'laptops',
    brand: 'Apple',
    price: 1999,
    discountPercentage: 6,
    rating: 4.9,
    orders: 49,
    thumbnail: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1108,
    title: 'Apple AirPods Max Silver',
    description: 'Over-ear wireless headphones with rich audio, noise cancellation, and metal finish.',
    category: 'modern-tech',
    brand: 'Apple',
    price: 549,
    discountPercentage: 10,
    rating: 4.5,
    orders: 112,
    thumbnail: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1109,
    title: 'iPhone X',
    description: 'Glass-body smartphone with OLED display, Face ID, and smooth everyday speed.',
    category: 'smartphones',
    brand: 'Apple',
    price: 899,
    discountPercentage: 12,
    rating: 4.4,
    orders: 136,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
];

const RELATED_PRODUCTS = [
  {
    id: 1301,
    title: 'Blue wallet',
    description: 'Compact daily wallet with smooth finish.',
    category: 'mobile-accessory',
    brand: 'Brand',
    price: 32,
    discountPercentage: 6,
    rating: 4.5,
    orders: 58,
    thumbnail: 'https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg?auto=compress&cs=tinysrgb&w=320',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1302,
    title: 'Smart watch',
    description: 'Black smart watch for daily tracking.',
    category: 'modern-tech',
    brand: 'Poco',
    price: 99,
    discountPercentage: 12,
    rating: 4.4,
    orders: 78,
    thumbnail: 'https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?auto=compress&cs=tinysrgb&w=320',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1303,
    title: 'Silver headphones',
    description: 'Wireless headphones with clear audio.',
    category: 'modern-tech',
    brand: 'Apple',
    price: 84,
    discountPercentage: 8,
    rating: 4.7,
    orders: 91,
    thumbnail: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1304,
    title: 'Denim shorts',
    description: 'Casual denim item for summer orders.',
    category: 'mobile-accessory',
    brand: 'Brand',
    price: 44,
    discountPercentage: 5,
    rating: 4.3,
    orders: 37,
    thumbnail: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=320',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1305,
    title: 'Black travel bag',
    description: 'Durable bag with multiple compartments.',
    category: 'mobile-accessory',
    brand: 'Lenovo',
    price: 62,
    discountPercentage: 4,
    rating: 4.5,
    orders: 43,
    thumbnail: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=320',
    shippingInformation: 'Free shipping',
  },
  {
    id: 1306,
    title: 'Brown winter jacket',
    description: 'Warm jacket with soft lining.',
    category: 'mobile-accessory',
    brand: 'Brand',
    price: 79,
    discountPercentage: 7,
    rating: 4.6,
    orders: 56,
    thumbnail: 'https://images.pexels.com/photos/7679650/pexels-photo-7679650.jpeg?auto=compress&cs=tinysrgb&w=320',
    shippingInformation: 'Free shipping',
  },
];

export const CATALOG_PRODUCTS = [
  DETAIL_PRODUCT,
  ...Array.from({ length: 27 }, (_, index) => {
    const product = ELECTRONICS[index % ELECTRONICS.length];
    const pageOffset = Math.floor(index / ELECTRONICS.length);
    return {
      ...product,
      id: product.id + pageOffset * 100,
      price: +(product.price + pageOffset * 17).toFixed(2),
      orders: product.orders + pageOffset * 12,
      images: product.images || [product.thumbnail],
      supplier: product.supplier || {
        name: `${product.brand || 'Brand'} Official Store`,
        country: 'Germany, Berlin',
        flag: 'DE',
        verified: true,
      },
      priceTiers: product.priceTiers || [
        { qty: '50-100 pcs', price: +(product.price * 0.98).toFixed(2) },
        { qty: '100-700 pcs', price: +(product.price * 0.93).toFixed(2) },
        { qty: '700+ pcs', price: +(product.price * 0.86).toFixed(2) },
      ],
      specs: product.specs || [
        ['Price', 'Negotiable'],
        ['Type', categoryLabel(product.category)],
        ['Brand', product.brand || 'Brand'],
        ['Model', product.title],
        ['Condition', 'Brand new'],
        ['Warranty', '2 years warranty'],
      ],
      features: product.features || ['Verified supplier', 'Ready to ship', 'Secure payments'],
    };
  }),
  ...RELATED_PRODUCTS,
];

export function categoryLabel(slug) {
  const category = CATALOG_CATEGORIES.find(item => item.slug === slug);
  return category ? category.name : capitalize(String(slug || '').replace(/-/g, ' '));
}

function matchesCategory(product, category) {
  if (!category) return true;
  if (category === DEFAULT_CATEGORY) {
    return product.source === 'api' ? API_TECH_CATEGORIES.includes(product.category) : true;
  }
  if (category === 'electronics') {
    return product.source === 'api'
      ? API_TECH_CATEGORIES.includes(product.category)
      : ['electronics', 'smartphones', 'tablets', 'laptops', 'modern-tech'].includes(product.category);
  }

  const apiCategories = API_CATEGORY_MAP[category];
  if (apiCategories) return apiCategories.includes(product.category) || product.category === category;
  return product.category === category;
}

function productMatchesQuery(product, query) {
  return (
    String(product.title || '').toLowerCase().includes(query) ||
    String(product.brand || '').toLowerCase().includes(query) ||
    String(product.description || '').toLowerCase().includes(query) ||
    categoryLabel(product.category).toLowerCase().includes(query)
  );
}

function filterProductList(products, { category = DEFAULT_CATEGORY, searchQ = '', minRating = 0, minPrice = 0, maxPrice = Infinity, sortBy = '' } = {}) {
  const query = searchQ.trim().toLowerCase();
  let list = products.filter(product => product.id !== DETAIL_DEFAULT_ID);

  if (!query || category !== DEFAULT_CATEGORY) {
    list = list.filter(product => matchesCategory(product, category));
  }

  if (query) list = list.filter(product => productMatchesQuery(product, query));
  if (minRating > 0) list = list.filter(product => product.rating >= minRating);
  if (minPrice > 0) list = list.filter(product => product.price >= minPrice);
  if (maxPrice < Infinity) list = list.filter(product => product.price <= maxPrice);

  if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating-desc') list = [...list].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'discount-desc') list = [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);

  return list;
}

function normalizeProduct(product) {
  const brand = product.brand || capitalize(product.tags?.[0] || 'Brand');
  const category = product.category || DEFAULT_CATEGORY;
  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);
  const price = Number(product.price || 0);
  const minimumOrder = product.minimumOrderQuantity || 1;
  const features = [
    ...(product.tags || []).map(tag => capitalize(tag)),
    product.shippingInformation,
    product.returnPolicy,
  ].filter(Boolean).slice(0, 4);

  return {
    ...product,
    source: 'api',
    id: Number(product.id),
    title: product.title || 'Product',
    description: product.description || '',
    category,
    brand,
    price,
    discountPercentage: Number(product.discountPercentage || 0),
    rating: Number(product.rating || 0),
    orders: Math.max(Number(product.stock || 0), (product.reviews?.length || 0) * 31),
    thumbnail: product.thumbnail || images[0] || '',
    images,
    shippingInformation: product.shippingInformation || 'Standard shipping',
    supplier: {
      name: `${brand} Official Store`,
      country: 'Global supplier',
      flag: 'API',
      verified: true,
    },
    priceTiers: [
      { qty: `${minimumOrder}-${minimumOrder * 5} pcs`, price: +(price * 0.98).toFixed(2) },
      { qty: `${minimumOrder * 5}-${minimumOrder * 20} pcs`, price: +(price * 0.93).toFixed(2) },
      { qty: `${minimumOrder * 20}+ pcs`, price: +(price * 0.86).toFixed(2) },
    ],
    specs: [
      ['Price', 'Negotiable'],
      ['Category', categoryLabel(category)],
      ['Brand', brand],
      ['SKU', product.sku || `API-${product.id}`],
      ['Stock', product.availabilityStatus || `${product.stock || 0} available`],
      ['Warranty', product.warrantyInformation || 'Available from seller'],
      ['Return policy', product.returnPolicy || 'Standard policy'],
    ],
    features: features.length ? features : ['Verified supplier', 'Ready to ship', 'Secure payments'],
  };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

async function loadApiCatalog() {
  if (!apiCatalogPromise) {
    apiCatalogPromise = fetchJson(`${API_BASE_URL}?limit=${API_CATALOG_LIMIT}`)
      .then(data => {
        apiCatalog = (data.products || []).map(normalizeProduct);
        return apiCatalog;
      })
      .catch(error => {
        apiCatalogPromise = undefined;
        throw error;
      });
  }
  return apiCatalogPromise;
}

export function filterCatalog(options = {}) {
  return filterProductList(CATALOG_PRODUCTS, options);
}

export async function fetchCatalog(options = {}) {
  try {
    return filterProductList(await loadApiCatalog(), options);
  } catch (error) {
    console.warn('Using local catalog fallback because the product API failed.', error);
    return filterCatalog(options);
  }
}

export function getDisplayTotal({ total }) {
  return total;
}

export function getProductById(id) {
  const numericId = Number(id || DETAIL_DEFAULT_ID);
  return CATALOG_PRODUCTS.find(product => product.id === numericId) || DETAIL_PRODUCT;
}

export async function fetchProductById(id) {
  const numericId = Number(id || DETAIL_DEFAULT_ID);
  if (numericId === DETAIL_DEFAULT_ID) return getProductById(numericId);

  const cached = apiCatalog.find(product => product.id === numericId);
  if (cached) return cached;

  try {
    return normalizeProduct(await fetchJson(`${API_BASE_URL}/${numericId}`));
  } catch (error) {
    console.warn('Using local product fallback because the product API failed.', error);
    return getProductById(numericId);
  }
}

export function searchCatalog(query, limit = 5) {
  const value = query.trim().toLowerCase();
  if (!value) return [];
  return CATALOG_PRODUCTS
    .filter(product => productMatchesQuery(product, value))
    .slice(0, limit);
}

export async function searchProducts(query, limit = 5) {
  const value = query.trim();
  if (!value) return [];

  try {
    return filterProductList(await loadApiCatalog(), { category: '', searchQ: value }).slice(0, limit);
  } catch (error) {
    console.warn('Using local search fallback because the product API failed.', error);
    return searchCatalog(query, limit);
  }
}

export function getRelatedProducts(productId, limit = 6) {
  return CATALOG_PRODUCTS
    .filter(product => product.id !== Number(productId))
    .filter(product => product.id !== DETAIL_DEFAULT_ID || Number(productId) !== DETAIL_DEFAULT_ID)
    .slice(0, limit);
}

export async function fetchRelatedProducts(productId, limit = 6) {
  const numericId = Number(productId);

  try {
    const products = await loadApiCatalog();
    const current = products.find(product => product.id === numericId);
    const pool = products.filter(product => product.id !== numericId);
    const sameCategory = current ? pool.filter(product => product.category === current.category) : [];
    const remaining = pool.filter(product => !sameCategory.includes(product));
    return [...sameCategory, ...remaining].slice(0, limit);
  } catch (error) {
    console.warn('Using local related-products fallback because the product API failed.', error);
    return getRelatedProducts(productId, limit);
  }
}
