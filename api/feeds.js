/**
 * Vercel Serverless Function: /api/feeds
 * Architecture Component: Product information (Approved merchant APIs and feeds)
 */

const { getMerchantFeedsStatus, APPROVED_MERCHANTS, getCachedMerchantProducts } = require('../lib/merchantFeeds');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const action = url.searchParams.get('action') || 'status';

  if (action === 'merchants') {
    return res.status(200).json({
      merchants: APPROVED_MERCHANTS
    });
  }

  if (action === 'feed-dump') {
    return res.status(200).json({
      feedSource: 'Approved Indian E-Commerce Feeds',
      count: getCachedMerchantProducts().length,
      items: getCachedMerchantProducts()
    });
  }

  // Default status
  const status = getMerchantFeedsStatus();
  return res.status(200).json(status);
};

