/**
 * Cuelinks API Integration Engine
 * Architecture Component: Affiliate integration (Cuelinks API)
 */

const https = require('https');

const CUELINKS_CONFIG = {
  publisherCid: process.env.CUELINKS_PUB_CID || '82192',
  apiKey: process.env.CUELINKS_API_KEY || 'oQab8xOk401MwoV5ofoIevFvlP_zu-WR_EarndNqpXk',
  v3BaseUrl: process.env.CUELINKS_V3_BASE_URL || 'https://developers.cuelinks.com/pub_api/v3',
  redirectBaseUrl: process.env.CUELINKS_REDIRECT_BASE_URL || 'https://linksredirect.com/'
};

/**
 * Generate high-conversion affiliate redirect link
 */
function generateTrackingLink(directUrl, subId = 'ratetracker') {
  if (!directUrl) return '#';
  const cleanUrl = encodeURIComponent(directUrl.trim());
  return `${CUELINKS_CONFIG.redirectBaseUrl}?cid=${CUELINKS_CONFIG.publisherCid}&source=api&url=${cleanUrl}&subid=${encodeURIComponent(subId)}`;
}

/**
 * Perform HTTPS Request to Cuelinks Developer API v3
 */
function makeCuelinksApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${CUELINKS_CONFIG.v3BaseUrl}${endpoint}`;
    
    const options = {
      headers: {
        'Authorization': `Token ${CUELINKS_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'RateTracker/1.0 (+https://ratetracker.in)'
      },
      timeout: 8000
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ raw: data });
          }
        } else {
          resolve({ error: true, statusCode: res.statusCode, body: data });
        }
      });
    }).on('error', (err) => {
      resolve({ error: true, message: err.message });
    });
  });
}

/**
 * Query active merchant campaigns on Cuelinks (Flipkart, Amazon, Croma, etc.)
 */
async function getCampaigns(query = '') {
  const endpoint = `/campaigns${query ? `?q=${encodeURIComponent(query)}` : ''}`;
  return await makeCuelinksApiRequest(endpoint);
}

/**
 * Query live offers and coupons
 */
async function getOffers() {
  return await makeCuelinksApiRequest('/offers');
}

/**
 * Check Cuelinks connection status
 */
async function checkCuelinksStatus() {
  const result = await makeCuelinksApiRequest('/campaigns?limit=1');
  if (result && !result.error) {
    return {
      connected: true,
      publisherCid: CUELINKS_CONFIG.publisherCid,
      status: 'active'
    };
  }
  return {
    connected: false,
    publisherCid: CUELINKS_CONFIG.publisherCid,
    status: 'fallback_active',
    note: 'Redirect link generator operational without rate-limit constraints'
  };
}

module.exports = {
  CUELINKS_CONFIG,
  generateTrackingLink,
  getCampaigns,
  getOffers,
  checkCuelinksStatus
};

