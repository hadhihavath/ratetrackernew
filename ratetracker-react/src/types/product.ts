export interface ProductColor {
  name: string;
  hex: string;
  img: string;
}

export interface StorePrice {
  name: string;
  logo: string;
  price: number;
  delivery: string;
  isBestDeal: boolean;
  dealBadge?: string;
  directUrl: string;
}

export interface PriceHistoryPoint {
  label: string;
  price: number;
}

export interface PriceHistory {
  '1M'?: PriceHistoryPoint[];
  '3M'?: PriceHistoryPoint[];
  '6M'?: PriceHistoryPoint[];
  '1Y'?: PriceHistoryPoint[];
}

export interface LowestEverPrice {
  price: number;
  date: string;
}

export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  title: string;
  searchTerm: string;
  category: string;
  rating: number;
  reviewsCount: string;
  bestPrice: number;
  originalPrice: number;
  discountPercent: number;
  storeCount: number;
  badge: string;
  colors: ProductColor[];
  stores: StorePrice[];
  history: PriceHistory;
  lowestEver: LowestEverPrice;
  specs: ProductSpecs;
}

export interface ProductsResponse {
  count: number;
  source: string;
  products: Product[];
}

export interface ProductDetailResponse {
  source: string;
  product: Product;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface Brand {
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { name: 'Mobiles', icon: '📱', color: '#eff6ff' },
  { name: 'Laptops', icon: '💻', color: '#f0fdf4' },
  { name: 'Electronics', icon: '📺', color: '#fef2f2' },
  { name: 'Home Appliances', icon: '🧺', color: '#fffbeb' },
  { name: 'Fashion', icon: '👕', color: '#f5f3ff' },
  { name: 'Footwear', icon: '👟', color: '#f0fdfa' },
  { name: 'Beauty & Personal Care', icon: '🧴', color: '#fdf2f8' },
  { name: 'Sports & Fitness', icon: '🏋️', color: '#ecfdf5' },
  { name: 'Toys & Games', icon: '🧸', color: '#fff7ed' },
];

export const BRANDS: Brand[] = [
  { name: 'Apple', icon: '🍎' },
  { name: 'Samsung', icon: '📱' },
  { name: 'Xiaomi', icon: '⚡' },
  { name: 'Realme', icon: '🟡' },
  { name: 'boAt', icon: '🎧' },
  { name: 'JBL', icon: '🔊' },
  { name: 'Sony', icon: '🎵' },
  { name: 'HP', icon: '💻' },
];