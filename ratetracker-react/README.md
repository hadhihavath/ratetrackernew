# RateTracker.in - Price Comparison Platform (React Version)

A best-in-class, mobile-first price comparison platform for the Indian e-commerce ecosystem. Built with React 19, TypeScript, Vite, Tailwind CSS 4, and React Three Fiber for stunning 3D visualizations.

## 🎯 Features

### Core Features
- **Real-time Price Comparison** - Compare prices across Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales, Samsung, boAt
- **3D Hero Section** - Interactive floating product showcase with particle effects
- **3D Product Viewer** - Rotatable 3D models for 8 product categories (phones, laptops, headphones, watches, tablets, earbuds, shoes, default)
- **3D Price History Charts** - WebGL-powered price trends with smooth curves and data points
- **3D Category Cards** - Magnetic hover effects with particle bursts
- **Glass Morphism Design System** - Complete glassmorphism components (cards, buttons, inputs, modals, tooltips, containers)
- **Price Drop Alerts** - Real-time notifications when prices fall
- **Hotel Price Comparison** - Compare across Booking.com, Agoda, MakeMyTrip, Expedia
- **Wishlist** - Save products, track price changes, batch actions
- **Cuelinks Affiliate Integration** - Publisher CID: 82192 for monetization

### 3D Elements (React Three Fiber + Drei)
- **Hero3D** - Floating products with OrbitControls, auto-rotate, particle system
- **ProductViewer3D** - 8 product types with color selector, ambient particles, studio lighting
- **PriceChart3D** - Tube geometry lines, CatmullRom curves, gradient area fills, interactive data points
- **CategoryCard3D** - 3D icons with Float animation, hover glow rings, particle bursts
- **Hero3DLite** - Lightweight CSS fallback for mobile/performance

### Design System
- **GlassCard** - 5 variants (default, elevated, outlined, interactive, hero) + 7 hover effects
- **GlassButton** - 4 variants (primary, secondary, ghost, outline) + 4 sizes
- **GlassInput** - Floating labels, icons, validation states
- **GlassModal** - Spring animations, backdrop blur
- **GlassTooltip** - 4 positions, configurable delay
- **GlassContainer** - Section containers with gradient options

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript 5, Vite 8 |
| **Styling** | Tailwind CSS 4, CSS Variables |
| **State** | Zustand (persisted), TanStack Query v5 |
| **Routing** | React Router v7 |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei |
| **Animations** | Framer Motion |
| **Charts** | Recharts (2D), Custom Three.js (3D) |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Database** | Supabase / PostgreSQL |
| **Affiliate** | Cuelinks API v3 (CID: 82192) |
| **Hosting** | Vercel (Edge + Serverless) |
| **PWA** | Service Worker, Web Manifest |

## 📁 Project Structure

```
ratetracker-react/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.webmanifest
│   └── sw.js                    # Service Worker for PWA
├── src/
│   ├── api/                     # API layer
│   │   ├── client.ts            # Axios instance with interceptors
│   │   ├── products.ts          # Products API
│   │   ├── cuelinks.ts          # Cuelinks API
│   │   ├── feeds.ts             # Merchant feeds
│   │   ├── alerts.ts            # Price alerts
│   │   ├── health.ts            # Health checks
│   │   └── index.ts
│   ├── components/
│   │   ├── three-d/             # 3D Components
│   │   │   ├── Hero3D.tsx       # 3D Hero with floating products
│   │   │   ├── ProductViewer3D.tsx # 3D Product models
│   │   │   ├── PriceChart3D.tsx   # 3D Price history
│   │   │   ├── CategoryCard3D.tsx # 3D Category cards
│   │   │   ├── GlassCard.tsx      # Glass morphism system
│   │   │   └── index.ts
│   │   ├── product/             # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── StorePriceCard.tsx
│   │   │   └── index.ts
│   │   ├── hotel/               # Hotel components
│   │   │   ├── HotelCard.tsx
│   │   │   └── index.ts
│   │   ├── common/              # Shared components
│   │   │   ├── SEO.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pages/                   # Page components
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Categories.tsx
│   │   ├── PriceDrop.tsx
│   │   ├── Hotels.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Account.tsx
│   │   └── index.ts
│   ├── stores/                  # Zustand stores
│   │   └── appStore.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   ├── utils/                   # Utilities
│   │   ├── index.ts             # cn, formatINR, etc.
│   │   └── cuelinks.ts          # Cuelinks helpers
│   ├── hooks/                   # Custom hooks
│   │   └── index.ts
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── supabase/
│   └── schema.sql               # PostgreSQL schema
├── .env.example                 # Environment template
├── .gitignore
├── .oxlintrc.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json                  # Vercel deployment config
├── vite.config.ts
└── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- Supabase account
- Cuelinks publisher account (CID: 82192)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ratetracker-react

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables in .env
# See Environment Variables section below
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Cuelinks Affiliate Configuration
VITE_CUELINKS_CID=82192
VITE_CUELINKS_API_KEY=your_cuelinks_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_NAME=RateTracker.in
VITE_APP_URL=https://ratetracker.in
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npx tsc --noEmit

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:5173` (or next available port).

## 🗄️ Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in the Supabase Dashboard
3. Copy the contents of `supabase/schema.sql` and run it
4. This creates all tables, indexes, RLS policies, and seed data
5. Get your Project URL and Anon Key from **Settings > API**
6. Add them to your `.env` file

### Schema Overview

| Table | Description |
|-------|-------------|
| `merchants` | Approved store configurations |
| `products` | Product catalog with specs, ratings |
| `product_colors` | Color variants with images |
| `product_prices` | Cross-store price comparison |
| `price_history` | Time-series data (1M, 3M, 6M, 1Y) |
| `cuelinks_campaigns` | Live affiliate deals/offers |
| `price_alerts` | User price drop notifications |

## 🔗 Cuelinks Integration

### What Cuelinks Provides
- **Campaigns API** - Search merchant campaigns
- **Link Conversion** - Convert URLs to affiliate tracking links
- **Offers/Deals** - Live coupon codes and promotions
- **Performance Reports** - Earnings/commission tracking
- **Smart Redirector** - `https://linksredirect.com/?cid=82192&source=api&url=...`

### What Cuelinks Does NOT Provide
- ❌ Direct product pricing data
- ❌ Product catalogs or search APIs
- ❌ Real-time price comparison across merchants
- ❌ Product specifications or images

### Integration Pattern
1. Server-side proxy (`/api/cuelinks`) keeps API key secure
2. Client generates affiliate links via `generateCuelinksUrl()`
3. Fail-safe fallback to direct store links if ad-blockers intercept
4. Real Cuelinks campaigns displayed in "Price Drop" section

### Required Credentials
- **Publisher CID**: 82192
- **API Key**: From Cuelinks dashboard
- **API Base**: `https://developers.cuelinks.com/pub_api/v3`
- **Redirect Base**: `https://linksredirect.com/`

## 📱 PWA Support

The app includes full PWA support:
- **Service Worker** (`public/sw.js`) - Offline caching, background updates
- **Web Manifest** (`public/manifest.webmanifest`) - Installable, standalone mode
- **Icons** - SVG-based, maskable icons
- **Shortcuts** - Quick access to Search, Wishlist, Hotels

### Testing PWA Locally
```bash
npm run build
npm run preview
# Open http://localhost:4173 in Chrome
# Check Application tab in DevTools for PWA status
```

## 🚀 Deployment to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Push to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Select your repository
4. Framework Preset: **Vite**
5. Configure Environment Variables:
   - `VITE_CUELINKS_CID` = `82192`
   - `VITE_CUELINKS_API_KEY` = your API key
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add `ratetracker.in`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `@`
   - Value: `cname.vercel-dns.com`
4. Verify SSL certificate auto-provisioning

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build verification
npm run build

# Preview production build
npm run preview
```

## 📦 Build Optimization

The `vite.config.ts` includes:
- **Code splitting** by vendor, query, charts, icons
- **Manual chunks** for optimal caching
- **Sourcemaps** for debugging
- **Tree shaking** enabled

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🎨 Customization

### Tailwind Config
Edit `tailwind.config.js` for:
- Custom colors (primary, success, danger, warning)
- Typography (Plus Jakarta Sans)
- Spacing, shadows, border radius

### Glass Morphism
Modify `src/components/three-d/GlassCard.tsx` for:
- Variant styles (default, elevated, outlined, interactive, hero)
- Blur levels (sm, md, lg, xl)
- Hover effects (lift, glow, scale, shine, magnetic, none)

### 3D Components
Customize in respective files:
- `Hero3D.tsx` - Floating products, particles, lighting
- `ProductViewer3D.tsx` - Product models, materials, colors
- `PriceChart3D.tsx` - Chart dimensions, colors, animations
- `CategoryCard3D.tsx` - Category icons, hover effects

## 🔧 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
# Check for errors
npx tsc --noEmit

# Common fixes:
# - Unused imports (remove or prefix with _)
# - Type mismatches (add explicit types)
# - Missing dependencies (npm install)
```

**3D components not rendering**
- Check browser WebGL support
- Verify `@react-three/fiber` and `@react-three/drei` versions
- Check console for Three.js errors
- Ensure Canvas has proper dimensions

**Cuelinks not working**
- Verify CID and API key in environment
- Check network tab for `/api/cuelinks` requests
- Ensure CORS headers are correct
- Test with ad-blocker disabled

**PWA not installing**
- Serve over HTTPS (required for PWA)
- Check manifest.json is accessible
- Verify service worker registers without errors
- Check Application tab in DevTools

## 📋 Next Steps / Roadmap

### Phase 1: Core Improvements (High Priority)
- [ ] **Real Product Data Integration**
  - [ ] Connect to live merchant APIs (Amazon PA-API, Flipkart Affiliate)
  - [ ] Implement feed aggregation in `/api/feeds`
  - [ ] Set up cron jobs for price updates
- [ ] **Supabase Real-time**
  - [ ] Enable real-time subscriptions for price changes
  - [ ] Add optimistic UI updates
- [ ] **Search Improvements**
  - [ ] Add autocomplete/suggestions
  - [ ] Implement fuzzy search
  - [ ] Add filters (price range, brand, rating)

### Phase 2: 3D Enhancements (Medium Priority)
- [ ] **GLTF Model Support**
  - [ ] Add real 3D models for products
  - [ ] Implement model loading with useGLTF
  - [ ] Add LOD (Level of Detail) for performance
- [ ] **Advanced 3D Interactions**
  - [ ] Drag to rotate on mobile
  - [ ] Pinch to zoom
  - [ ] Exploded view for specifications
- [ ] **WebXR/AR Support**
  - [ ] AR product preview (future)
  - [ ] WebXR session management

### Phase 3: Performance & Polish (Medium Priority)
- [ ] **Code Splitting**
  - [ ] Lazy load 3D scenes with Suspense
  - [ ] Route-based code splitting
  - [ ] Dynamic imports for heavy components
- [ ] **Bundle Optimization**
  - [ ] Reduce vendor chunk size
  - [ ] Enable gzip/brotli compression
  - [ ] Optimize images (WebP, AVIF)
- [ ] **Core Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

### Phase 4: Features (Lower Priority)
- [ ] **User Accounts**
  - [ ] Authentication (Supabase Auth)
  - [ ] Sync wishlist across devices
  - [ ] Price alert management UI
- [ ] **Social Features**
  - [ ] Share price comparisons
  - [ ] Social proof (recent purchases)
  - [ ] Reviews/ratings
- [ ] **Advanced Analytics**
  - [ ] Price prediction ML model
  - [ ] Historical trend analysis
  - [ ] Merchant reliability scores

### Phase 5: Infrastructure (Ongoing)
- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions for test/build
  - [ ] Preview deployments for PRs
  - [ ] Automated dependency updates
- [ ] **Monitoring**
  - [ ] Error tracking (Sentry)
  - [ ] Analytics (Vercel Analytics)
  - [ ] Performance monitoring
- [ ] **Security**
  - [ ] CSP headers
  - [ ] Rate limiting on API
  - [ ] Input validation/sanitization

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: See `notes.txt` in project root for detailed development notes
- **Cuelinks Docs**: [developers.cuelinks.com](https://developers.cuelinks.com)

---

**Built with ❤️ for the Indian e-commerce ecosystem**

*RateTracker.in - Compare. Save. Win.*