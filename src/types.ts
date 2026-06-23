import type { ReactNode } from 'react';

export interface PriceTier {
  qty: string;
  price: number;
}

export interface Supplier {
  name: string;
  country: string;
  flag: string;
  verified: boolean;
}

export interface CatalogQuery {
  category?: string;
  searchQ?: string;
  sortBy?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface Product {
  source?: string;
  id: number;
  title: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  discountPercentage: number;
  rating: number;
  orders: number;
  thumbnail: string;
  images?: string[];
  shippingInformation?: string;
  supplier?: Supplier;
  priceTiers?: PriceTier[];
  specs?: [string, string][];
  features?: string[];
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  qty: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  passwordHash: string;
  createdAt: number;
}

export interface AuthSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  issuedAt: number;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

export interface AuthSnapshot {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  accessValid: boolean;
  refreshValid: boolean;
}

export interface Category {
  slug: string;
  name: string;
}

export type ToastType = 'info' | 'success' | 'error';

export interface ToastEntry {
  id: number;
  message: string;
  type: ToastType;
}

export type ComponentChildren = ReactNode;
