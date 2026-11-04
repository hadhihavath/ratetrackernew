/**
 * Vercel Serverless Function: /api/cuelinks
 * Architecture Component: Affiliate integration (Cuelinks API)
 */

const { CUELINKS_CONFIG, generateTrackingLink, getCampaigns, getOffers, checkCuelinksStatus } = require('../lib/cuelinks');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const action = url.searchParams.get('action') || 'status';
  const targetUrl = url.searchParams.get('url');
  const subId = url.searchParams.get('subid') || 'ratetracker';
  const query = url.searchParams.get('q') || '';

  try {
    switch (action) {
      case 'redirect':
        if (!targetUrl) {
          return res.status(400).json({ error: 'Missing target url parameter' });
        }
        const trackingUrl = generateTrackingLink(targetUrl, subId);
        // If client requested 302 redirect directly:
        if (url.searchParams.get('redirect') === 'true') {
          return res.redirect(302, trackingUrl);
        }
        return res.status(200).json({
          originalUrl: targetUrl,
          publisherCid: CUELINKS_CONFIG.publisherCid,
          trackingUrl
        });

      case 'campaigns':
        const campaignsData = await getCampaigns(query);
        return res.status(200).json(campaignsData);

      case 'offers':
      case 'deals':
        const offersData = await getOffers();
        return res.status(200).json(offersData);

      case 'status':
      default:
        const status = await checkCuelinksStatus();
        return res.status(200).json(status);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Cuelinks API request failed', details: err.message });
  }
};

