# RateTracker (ratetracker.in) - Price Comparison Platform

A production-ready price comparison web platform for the Indian e-commerce ecosystem, matching the **RateTracker** UI design with real-time pricing and verified Cuelinks affiliate link monetization.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js |
| **Database** | Supabase / PostgreSQL |
| **Affiliate integration** | Cuelinks API |
| **Product information** | Approved merchant APIs and feeds |
| **Hosting** | Vercel |

---

## 📐 Architecture & Component Overview

```
                                +---------------------------+
                                |      End User Browser     |
                                +-------------+-------------+
                                              |
                          HTML / CSS / JS UI  |  /api REST calls
                                              v
+-----------------------------------------------------------------------------------+
| ▲ Vercel Hosting Platform                                                        |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+  |
|  | Frontend Static Layer               |   | Backend Layer: Node.js             |  |
|  | - index.html (Responsive UI)        |   | - /api/products (Catalog & Prices) |  |
|  | - style.css (Design System)         |   | - /api/cuelinks (API v3 Proxy)     |  |
|  | - app.js (Client Engine)            |   | - /api/feeds (Merchant Aggregator) |  |
|  |                                     |   | - /api/alerts (Price Drop Alerts)  |  |
|  |                                     |   | - /api/health (System Status)      |  |
|  +-------------------------------------+   +-----------------+------------------+  |
+--------------------------------------------------------------|--------------------+
                                                               |
                     +-----------------------------------------+-----------------------------------------+
                     |                                         |                                         |
                     v                                         v                                         v
       +----------------------------+            +----------------------------+            +----------------------------+
       | Database                   |            | Affiliate Integration      |            | Product Information        |
       | Supabase / PostgreSQL      |            | Cuelinks API               |            | Approved Merchant APIs     |
       +----------------------------+            +----------------------------+            +----------------------------+
       | • products                 |            | • Publisher CID: 82192     |            | • Amazon India (PA-API)    |
       | • merchants                |            | • API v3 Campaigns/Deals   |            | • Flipkart Affiliate API   |
       | • product_prices           |            | • Smart Link Redirector    |            | • Croma Direct Feed        |
       | • price_history            |            | • Fail-safe direct fallback|            | • Reliance Digital Feed    |
       | • price_alerts             |            |                            |            | • Vijay Sales Feed         |
       | • Row Level Security (RLS) |            |                            |            | • boAt / Samsung Feeds     |
       +----------------------------+            +----------------------------+            +----------------------------+
```

### 1. Frontend: HTML, CSS, JavaScript
- **Clean Semantic HTML5** with responsive layouts, accessible navigation, and modal dialogues.
- **Custom CSS3 Design System** with typography matching Google Sans / Plus Jakarta Sans, device frame toggles (Desktop View vs Mobile App View), and dark-mode accents.
- **Vanilla JavaScript Engine (`app.js`)** providing instant cross-store price comparison, real-time price history graphs (1M, 3M, 6M, 1Y), search filtering, and client fail-safe fallbacks.

### 2. Backend: Node.js
- **Serverless API Routes (`/api/*`)** designed for instant zero-cold-start execution on Vercel.
- **Local Dev Server (`server.js`)**: Standalone Node.js HTTP server that executes API routes and serves the static frontend without requiring heavy external dependencies.
- **API Endpoints**:
  - `GET /api/products`: Search and filter catalog with store comparison.
  - `GET /api/cuelinks`: Secure server-side Cuelinks API proxy (keeps secret API key secure).
  - `GET /api/feeds`: Aggregates and normalizes feeds from approved merchants.
  - `POST /api/alerts`: Stores user price drop notification requests.
  - `GET /api/health`: Real-time system health and connectivity status.

### 3. Database: Supabase / PostgreSQL
- **Schema**: Provided in [`supabase/schema.sql`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/supabase/schema.sql).
- **PostgreSQL Tables**: `products`, `merchants`, `product_prices`, `product_colors`, `price_history`, `price_alerts`, and `cuelinks_campaigns`.
- **Security**: Pre-configured Row Level Security (RLS) policies allowing public read access while restricting write/update actions to authenticated server-side processes.
- **Database Client**: Clean modular client in [`lib/supabase.js`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/lib/supabase.js).

### 4. Affiliate Integration: Cuelinks API
- **Publisher CID**: `82192`
- **API Key**: `oQab8xOk401MwoV5ofoIevFvlP_zu-WR_EarndNqpXk`
- **Smart Link Dispatcher**: Every "View Deal" and "Buy Now" button automatically converts into a trackable Cuelinks affiliate redirect (`https://linksredirect.com/?cid=82192&source=api&url=...`).
- **Fail-Safe Fallback**: If an ad-blocker or network blocker interferes, the link automatically falls back directly to the merchant's landing page.
- **Server-Side Integration**: Managed in [`lib/cuelinks.js`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/lib/cuelinks.js) and [`api/cuelinks.js`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/api/cuelinks.js).

### 5. Product Information: Approved Merchant APIs and Feeds
- **Approved Merchants**: Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, boAt Lifestyle, and Samsung Shop.
- **Feed Normalization**: Managed in [`lib/merchantFeeds.js`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/lib/merchantFeeds.js).
- **Deep Store Landing URLs**: Eliminates generic homepage links; targets exact product ASINs or verified store search URLs.

### 6. Hosting: Vercel
- **Configuration**: Managed in [`vercel.json`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/vercel.json).
- **Static Asset Delivery**: Instant global edge caching for HTML, CSS, JavaScript, and images.
- **Serverless API Execution**: Routes under `/api/*` run on Node.js Serverless Functions.

---

## 📂 Project Structure

```
ratetracker.in/
├── api/                             # Node.js Serverless Backend Functions (Vercel)
│   ├── alerts.js                    # Price drop alert management
│   ├── cuelinks.js                  # Cuelinks API v3 proxy & redirects
│   ├── feeds.js                     # Approved merchant feeds endpoint
│   ├── health.js                    # System health check across all components
│   └── products.js                  # Product catalog & store price comparison
├── lib/                             # Shared Node.js Backend Modules
│   ├── cuelinks.js                  # Cuelinks API client (CID: 82192)
│   ├── merchantFeeds.js             # Merchant feed aggregator & cache
│   └── supabase.js                  # Supabase / PostgreSQL client
├── supabase/                        # Database Migrations & Schemas
│   └── schema.sql                   # Complete PostgreSQL schema & seed data
├── cuelinks_offers.json             # Live Cuelinks campaign dataset dump
├── index.html                       # Semantic HTML5 frontend interface
├── style.css                        # CSS3 responsive design system
├── app.js                           # Vanilla JavaScript client engine
├── package.json                     # Node.js package configuration
├── vercel.json                      # Vercel deployment configuration
├── .env.example                     # Environment variables template
└── server.js                        # Standalone local Node.js server
```

---

## 🚀 Setup & Deployment Guide

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub / GitLab / Bitbucket**.
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your repository.
   - Framework Preset: **Other** (Vercel automatically detects static HTML + `/api` Node.js functions).
3. **Configure Environment Variables in Vercel**:
   - `SUPABASE_URL`: Your Supabase Project URL (`https://xyz.supabase.co`).
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `CUELINKS_PUB_CID`: `82192`.
   - `CUELINKS_API_KEY`: `oQab8xOk401MwoV5ofoIevFvlP_zu-WR_EarndNqpXk`.
4. Click **Deploy**. Your price comparison engine is live with edge-speed frontend and serverless Node.js backend.

---

### Option 2: Local Development

**With Node.js:**
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Install optional dependencies:
   ```bash
   npm install
   ```
3. Run the Node.js server:
   ```bash
   node server.js
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Instant One-Click Runner (Windows PowerShell / No Node install required):**
```powershell
.\run-local.ps1
```
Or open [index.html](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/index.html) directly in any browser.

---

### Option 3: Supabase / PostgreSQL Setup

1. Open your [Supabase Dashboard](https://app.supabase.com).
2. Go to the **SQL Editor**.
3. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/LENOVO/Downloads/Havath/ratetracker.in/supabase/schema.sql) and paste into the SQL Editor.
4. Click **Run**. All tables, indexes, security policies, and initial product seed data will be created instantly.
