/**
 * Vercel Serverless Function: /api/alerts
 * Architecture Component: Database (Supabase / PostgreSQL)
 */

const { createPriceAlert } = require('../lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Leave as is
      }
    }

    const { productId, email, targetPrice } = body || {};

    if (!productId || !email || !targetPrice) {
      return res.status(400).json({
        error: 'Missing required parameters: productId, email, targetPrice'
      });
    }

    const result = await createPriceAlert({ productId, email, targetPrice });
    if (result.success) {
      return res.status(201).json({
        message: 'Price drop alert successfully registered',
        alert: { productId, email, targetPrice, timestamp: new Date().toISOString() }
      });
    } else {
      return res.status(500).json({ error: 'Failed to record alert', details: result.error });
    }
  }

  // GET: Health / ping
  return res.status(200).json({
    status: 'Price Alert Dispatcher Operational',
    method: 'POST to register alerts'
  });
};

