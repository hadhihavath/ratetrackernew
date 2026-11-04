/**
 * Vercel Serverless Function: /api/health
 * Complete Architecture Health Check across all 6 components
 */

const { checkSupabaseHealth } = require('../lib/supabase');
const { checkCuelinksStatus } = require('../lib/cuelinks');
const { getMerchantFeedsStatus } = require('../lib/merchantFeeds');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const [supabaseStatus, cuelinksStatus, feedsStatus] = await Promise.all([
    checkSupabaseHealth(),
    checkCuelinksStatus(),
    Promise.resolve(getMerchantFeedsStatus())
  ]);

  const architecture = {
    platform: 'RateTracker.in',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    components: {
      frontend: {
        technology: 'HTML, CSS, JavaScript',
        status: 'active',
        responsive: true
      },
      backend: {
        technology: 'Node.js',
        runtime: process.version,
        status: 'active'
      },
      database: {
        technology: 'Supabase / PostgreSQL',
        status: supabaseStatus.connected ? 'connected' : 'configured_fallback',
        details: supabaseStatus
      },
      affiliate_integration: {
        technology: 'Cuelinks API',
        publisherCid: cuelinksStatus.publisherCid,
        status: cuelinksStatus.status,
        details: cuelinksStatus
      },
      product_information: {
        technology: 'Approved merchant APIs and feeds',
        approvedMerchantsCount: feedsStatus.approvedMerchantsCount,
        status: 'active'
      },
      hosting: {
        technology: 'Vercel',
        environment: process.env.VERCEL ? 'vercel-production' : 'local-node',
        status: 'active'
      }
    }
  };

  return res.status(200).json(architecture);
};

