/**
 * Supabase / PostgreSQL Client & Database Integration Module
 * Architecture Component: Database (Supabase / PostgreSQL)
 */

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
      });
      console.log('✓ Supabase client initialized with endpoint:', supabaseUrl);
      return supabaseClient;
    } catch (err) {
      console.warn('⚠️ @supabase/supabase-js not installed or failed to load. Operating in fallback mock mode.');
    }
  }

  return null;
}

/**
 * Fetch all products with prices and merchant information
 */
async function getProductsFromDb({ category, query } = {}) {
  const supabase = getSupabaseClient();
  if (!supabase) return null; // Signal fallback to cache / feeds

  try {
    let request = supabase
      .from('products')
      .select(`
        *,
        product_colors(*),
        product_prices(*, merchants(*)),
        price_history(*)
      `);

    if (category && category !== 'All') {
      request = request.eq('category', category);
    }

    if (query) {
      request = request.ilike('title', `%${query}%`);
    }

    const { data, error } = await request;
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching products from Supabase:', err.message);
    return null;
  }
}

/**
 * Fetch single product details with store price comparison
 */
async function getProductByIdFromDb(productId) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_colors(*),
        product_prices(*, merchants(*)),
        price_history(*)
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Error fetching product ${productId} from Supabase:`, err.message);
    return null;
  }
}

/**
 * Record a price drop alert in Supabase
 */
async function createPriceAlert({ productId, email, targetPrice }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true, mocked: true, message: 'Alert queued locally' };
  }

  try {
    const { data, error } = await supabase
      .from('price_alerts')
      .insert([
        { product_id: productId, email, target_price: targetPrice }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error creating price alert in Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Check Supabase connection health
 */
async function checkSupabaseHealth() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      status: 'unconfigured',
      message: 'SUPABASE_URL and SUPABASE_ANON_KEY required in environment variables'
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      connected: false,
      status: 'client_unavailable',
      message: 'Supabase client could not be loaded'
    };
  }

  try {
    const { error } = await supabase.from('merchants').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return {
      connected: true,
      status: 'active',
      url: supabaseUrl
    };
  } catch (err) {
    return {
      connected: false,
      status: 'error',
      message: err.message
    };
  }
}

module.exports = {
  getSupabaseClient,
  getProductsFromDb,
  getProductByIdFromDb,
  createPriceAlert,
  checkSupabaseHealth
};

