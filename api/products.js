/**
 * Vercel Serverless Function: /api/products
 * Architecture Component: Backend (Node.js) & Database (Supabase / PostgreSQL)
 */

const { getProductsFromDb, getProductByIdFromDb } = require('../lib/supabase');
const { getCachedMerchantProducts, getCachedProductById } = require('../lib/merchantFeeds');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse query parameters
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');
  const category = url.searchParams.get('category');
  const query = url.searchParams.get('q');

  try {
    if (id) {
      // 1. Try Supabase first
      let product = await getProductByIdFromDb(id);
      
      // 2. Fall back to normalized merchant feed cache
      if (!product) {
        product = getCachedProductById(id);
      }

      if (!product) {
        return res.status(404).json({ error: 'Product not found', id });
      }

      return res.status(200).json({
        source: 'supabase/merchant-feed',
        product
      });
    }

    // List query
    let products = await getProductsFromDb({ category, query });
    let source = 'supabase';

    if (!products || products.length === 0) {
      products = getCachedMerchantProducts({ category, query });
      source = 'merchant-feeds-cache';
    }

    return res.status(200).json({
      count: products.length,
      source,
      products
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve products', details: err.message });
  }
};

