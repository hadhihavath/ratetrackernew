-- ==============================================================================
-- RateTracker.in - Supabase / PostgreSQL Production Database Schema
-- Architecture Component: Database (Supabase / PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. MERCHANTS TABLE (Approved merchant feeds and stores)
CREATE TABLE IF NOT EXISTS merchants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    logo_url TEXT,
    affiliate_network TEXT DEFAULT 'cuelinks',
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    search_term TEXT NOT NULL,
    category TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    reviews_count TEXT DEFAULT '1k',
    best_price INTEGER NOT NULL,
    original_price INTEGER NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    store_count INTEGER DEFAULT 1,
    badge TEXT,
    lowest_ever_price INTEGER,
    lowest_ever_date TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT COLORS / IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_colors (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hex TEXT NOT NULL,
    img_url TEXT NOT NULL
);

-- 5. PRODUCT PRICES TABLE (Cross-store comparison rates from approved feeds)
CREATE TABLE IF NOT EXISTS product_prices (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    merchant_id TEXT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    delivery TEXT,
    is_best_deal BOOLEAN DEFAULT FALSE,
    deal_badge TEXT,
    direct_url TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, merchant_id)
);

-- 6. PRICE HISTORY TABLE (1M, 3M, 6M, 1Y tracking points)
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    period TEXT NOT NULL, -- '1M', '3M', '6M', '1Y'
    date_label TEXT NOT NULL,
    price INTEGER NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUELINKS DEALS & CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS cuelinks_campaigns (
    id TEXT PRIMARY KEY,
    campaign_name TEXT NOT NULL,
    title TEXT NOT NULL,
    discount TEXT,
    coupon_code TEXT,
    category TEXT,
    tag TEXT,
    direct_url TEXT NOT NULL,
    tracking_url TEXT,
    image_url TEXT,
    ends_in TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRICE DROP ALERTS TABLE
CREATE TABLE IF NOT EXISTS price_alerts (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    target_price INTEGER NOT NULL,
    is_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || search_term));
CREATE INDEX IF NOT EXISTS idx_prices_product ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_merchant ON product_prices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_history_product_period ON price_history(product_id, period);
CREATE INDEX IF NOT EXISTS idx_alerts_product ON price_alerts(product_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuelinks_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to product and merchant catalog
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public product colors are viewable by everyone" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public merchants are viewable by everyone" ON merchants FOR SELECT USING (true);
CREATE POLICY "Public prices are viewable by everyone" ON product_prices FOR SELECT USING (true);
CREATE POLICY "Public price history is viewable by everyone" ON price_history FOR SELECT USING (true);
CREATE POLICY "Public cuelinks campaigns are viewable by everyone" ON cuelinks_campaigns FOR SELECT USING (true);

-- Allow public to create price alerts
CREATE POLICY "Public can insert price alerts" ON price_alerts FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Approved Merchants & Indian E-Commerce Products)
-- ==============================================================================

-- Seed Merchants
INSERT INTO merchants (id, name, domain, logo_url, affiliate_network) VALUES
('amazon', 'Amazon India', 'amazon.in', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 'cuelinks'),
('flipkart', 'Flipkart', 'flipkart.com', 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', 'cuelinks'),
('croma', 'Croma', 'croma.com', 'https://upload.wikimedia.org/wikipedia/commons/7/70/Croma_Logo.png', 'cuelinks'),
('reliance-digital', 'Reliance Digital', 'reliancedigital.in', 'https://seeklogo.com/images/R/reliance-digital-logo-56B3A9B26D-seeklogo.com.png', 'cuelinks'),
('vijay-sales', 'Vijay Sales', 'vijaysales.com', 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Vijay_Sales_logo.png', 'cuelinks'),
('samsung', 'Samsung Shop', 'samsung.com/in', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 'cuelinks'),
('boat', 'boAt Lifestyle', 'boat-lifestyle.com', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Boat_logo.png', 'cuelinks')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (id, title, search_term, category, rating, reviews_count, best_price, original_price, discount_percent, store_count, badge, lowest_ever_price, lowest_ever_date, specs) VALUES
('iphone-15-128', 'Apple iPhone 15 (128GB)', 'Apple iPhone 15 128GB', 'Mobiles', 4.6, '14.2k', 57999, 69900, 17, 12, 'Best Price', 54999, 'Oct 2024 Festival Sale', '{"Display": "6.1-inch Super Retina XDR OLED", "Chip": "Apple A16 Bionic", "Camera": "48MP Main + 12MP Ultra-Wide", "Charging": "USB-C"}'::jsonb),
('samsung-s23-128', 'Samsung Galaxy S23 5G (128GB)', 'Samsung Galaxy S23 5G', 'Mobiles', 4.6, '11.8k', 43999, 74999, 41, 9, '41% OFF', 39999, 'Oct 2024', '{"Display": "6.1-inch Dynamic AMOLED 2X 120Hz", "Processor": "Snapdragon 8 Gen 2", "Camera": "50MP + 12MP + 10MP"}'::jsonb),
('macbook-air-m2', 'Apple MacBook Air M2 (8GB / 256GB SSD)', 'Apple MacBook Air M2 256GB', 'Laptops', 4.8, '9.8k', 79990, 99900, 20, 11, 'Popular', 69990, 'Oct 2024 Festival Sale', '{"Display": "13.6-inch Liquid Retina", "Processor": "Apple M2 Chip", "Battery": "Up to 18 Hours"}'::jsonb),
('sony-wh1000xm5', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'Sony WH 1000XM5', 'Electronics', 4.7, '7.6k', 26990, 34990, 23, 8, 'Price Drop', 24990, 'Sep 2024', '{"ANC": "Industry-leading Dual Processor V1", "Battery": "30 Hours Battery", "Driver": "30mm precision-engineered"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Colors
INSERT INTO product_colors (product_id, name, hex, img_url) VALUES
('iphone-15-128', 'Black', '#26292b', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80'),
('iphone-15-128', 'Pink', '#ffd0d6', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'),
('iphone-15-128', 'Blue', '#d2e3eb', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'),
('samsung-s23-128', 'Phantom Black', '#1c1c1e', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'),
('macbook-air-m2', 'Midnight', '#2b303a', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'),
('sony-wh1000xm5', 'Black', '#1a1a1a', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80');

-- Seed Product Prices
INSERT INTO product_prices (product_id, merchant_id, price, delivery, is_best_deal, deal_badge, direct_url) VALUES
('iphone-15-128', 'amazon', 57999, 'Free Delivery | 1-2 Days (Prime)', true, 'Lowest Price', 'https://www.amazon.in/dp/B0CHX1W1XY'),
('iphone-15-128', 'flipkart', 58999, 'Free Delivery | 2-3 Days', false, null, 'https://www.flipkart.com/search?q=Apple+iPhone+15+128GB'),
('iphone-15-128', 'croma', 61990, 'Express Delivery | Store Pickup', false, null, 'https://www.croma.com/searchB?q=Apple+iPhone+15+128GB'),
('iphone-15-128', 'reliance-digital', 62990, 'Free Delivery | 2-4 Days', false, null, 'https://www.reliancedigital.in/search?q=Apple+iPhone+15+128GB'),
('samsung-s23-128', 'amazon', 43999, 'Free Delivery | 1-2 Days', true, 'Lowest Price', 'https://www.amazon.in/s?k=Samsung+Galaxy+S23+5G'),
('samsung-s23-128', 'flipkart', 44999, 'Free Delivery | 2-4 Days', false, null, 'https://www.flipkart.com/search?q=Samsung+Galaxy+S23+5G'),
('samsung-s23-128', 'samsung', 49999, 'Official Warranty | 2-3 Days', false, null, 'https://www.samsung.com/in/search/?searchvalue=Galaxy%20S23'),
('macbook-air-m2', 'amazon', 79990, 'Free Delivery | 1-2 Days', true, 'Lowest Price', 'https://www.amazon.in/s?k=Apple+MacBook+Air+M2'),
('macbook-air-m2', 'flipkart', 81990, 'Free Delivery | 2-4 Days', false, null, 'https://www.flipkart.com/search?q=Apple+MacBook+Air+M2'),
('sony-wh1000xm5', 'amazon', 26990, 'Free Delivery | 1-2 Days', true, 'Price Drop', 'https://www.amazon.in/s?k=Sony+WH-1000XM5'),
('sony-wh1000xm5', 'croma', 28990, 'Store Pickup Available', false, null, 'https://www.croma.com/searchB?q=Sony+WH-1000XM5')
ON CONFLICT (product_id, merchant_id) DO UPDATE SET price = EXCLUDED.price, last_synced_at = NOW();

-- Seed Live Cuelinks Campaigns
INSERT INTO cuelinks_campaigns (id, campaign_name, title, discount, coupon_code, category, tag, direct_url, tracking_url, image_url, ends_in) VALUES
('cuelinks-131871', 'Klook', 'Klook Tours & Attractions: Up to 60% Off + Extra 10% Coupon!', 'Up to 70% Total', 'TNA10OFF2026AID', 'Travel', 'Hot Deal', 'https://www.klook.com/en-IN/', 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fwww.klook.com%2Fen-IN%2F', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80', 'Ends in 15 days'),
('cuelinks-129482', 'Acer India', 'Acer Aspire 3 Laptop (Intel Core i3, 8GB RAM, 256GB SSD) @ ₹28,999', '33% OFF', null, 'Laptops', 'Verified Offer', 'https://store.acer.com/en-in/', 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fstore.acer.com%2Fen-in%2F', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80', 'Live Deal'),
('cuelinks-129481', 'boAt Lifestyle', 'boAt Grand Festive Sale: Smartwatches, TWS & Speakers Up to 85% OFF', 'Up to 85% OFF', 'FESTIVE', 'Audio', 'Flash Sale', 'https://www.boat-lifestyle.com/', 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fwww.boat-lifestyle.com%2F', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80', 'Ends Today')
ON CONFLICT (id) DO NOTHING;

