import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export type DeviceMode = 'desktop' | 'mobile';
export type LinkMode = 'cuelinks' | 'direct';
export type ViewName = 'home' | 'search' | 'detail' | 'categories' | 'price-drop' | 'hotels' | 'wishlist' | 'account';

interface AppState {
  // Device & View Mode
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  toggleDeviceMode: () => void;

  // Link Mode (Cuelinks vs Direct)
  linkMode: LinkMode;
  setLinkMode: (mode: LinkMode) => void;
  toggleLinkMode: () => void;

  // Current View
  currentView: ViewName;
  setCurrentView: (view: ViewName) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;

  // Selected Product (for detail view)
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;

  // Detail Tab
  currentDetailTab: 'price-comparison' | 'price-history' | 'specifications';
  setCurrentDetailTab: (tab: 'price-comparison' | 'price-history' | 'specifications') => void;

  // Price History Period
  currentHistoryPeriod: '1M' | '3M' | '6M' | '1Y';
  setCurrentHistoryPeriod: (period: '1M' | '3M' | '6M' | '1Y') => void;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Price Alerts
  priceAlerts: Array<{
    productId: string;
    email: string;
    targetPrice: number;
    timestamp: string;
  }>;
  addPriceAlert: (alert: { productId: string; email: string; targetPrice: number }) => void;

  // Cuelinks Connection Status
  cuelinksConnected: boolean;
  setCuelinksConnected: (connected: boolean) => void;

  // Cuelinks API Key
  cuelinksApiKey: string;
  setCuelinksApiKey: (key: string) => void;

  // Toast notifications (we'll use react-hot-toast instead, but keep for reference)
  // toasts: Array<{ id: string; message: string; icon?: string }>;
  // addToast: (message: string, icon?: string) => void;
  // removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Device & View Mode
      deviceMode: 'desktop',
      setDeviceMode: (mode) => set({ deviceMode: mode }),
      toggleDeviceMode: () => set((state) => ({
        deviceMode: state.deviceMode === 'desktop' ? 'mobile' : 'desktop'
      })),

      // Link Mode
      linkMode: 'cuelinks',
      setLinkMode: (mode) => set({ linkMode: mode }),
      toggleLinkMode: () => set((state) => ({
        linkMode: state.linkMode === 'cuelinks' ? 'direct' : 'cuelinks'
      })),

      // Current View
      currentView: 'home',
      setCurrentView: (view) => set({ currentView: view }),

      // Search & Filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      activeCategory: 'All',
      setActiveCategory: (category) => set({ activeCategory: category }),

      // Selected Product
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      selectedColorIndex: 0,
      setSelectedColorIndex: (index) => set({ selectedColorIndex: index }),

      // Detail Tab
      currentDetailTab: 'price-comparison',
      setCurrentDetailTab: (tab) => set({ currentDetailTab: tab }),

      // Price History Period
      currentHistoryPeriod: '6M',
      setCurrentHistoryPeriod: (period) => set({ currentHistoryPeriod: period }),

      // Wishlist
      wishlist: ['iphone-15-128', 'sony-wh1000xm5', 'dell-inspiron-15'],
      addToWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist
          : [...state.wishlist, productId]
      })),
      removeFromWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.filter((id) => id !== productId)
      })),
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter((id) => id !== productId)
          : [...state.wishlist, productId]
      })),
      isInWishlist: (productId) => get().wishlist.includes(productId),
      clearWishlist: () => set({ wishlist: [] }),

      // Price Alerts
      priceAlerts: [],
      addPriceAlert: (alert) => set((state) => ({
        priceAlerts: [...state.priceAlerts, { ...alert, timestamp: new Date().toISOString() }]
      })),

      // Cuelinks Connection
      cuelinksConnected: true,
      setCuelinksConnected: (connected) => set({ cuelinksConnected: connected }),

      // Cuelinks API Key
      cuelinksApiKey: 'oQab8xOk401MwoV5ofoIevFvlP_zu-WR_EarndNqpXk',
      setCuelinksApiKey: (key) => set({ cuelinksApiKey: key }),
    }),
    {
      name: 'ratetracker-app-storage',
      partialize: (state) => ({
        deviceMode: state.deviceMode,
        linkMode: state.linkMode,
        wishlist: state.wishlist,
        priceAlerts: state.priceAlerts,
        cuelinksApiKey: state.cuelinksApiKey,
      }),
    }
  )
);