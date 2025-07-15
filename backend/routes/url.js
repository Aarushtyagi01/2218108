const express = require('express');
const router = express.Router();
const { Log } = require('../utils/logging');
const { nanoid } = require('nanoid');

// In-memory storage
const urls = {};
// Structure: {
//   shortcode: {
//     originalUrl, shortUrl, shortcode, createdAt, expiresAt, clicks: [{timestamp, source}]
//   }
// }

const BASE_URL = 'http://localhost:5000';
const SHORTCODE_REGEX = /^[a-zA-Z0-9]{3,20}$/;
const DEFAULT_VALIDITY_MINUTES = 30;

// Helper to generate a unique shortcode
function generateUniqueShortcode() {
  let code;
  do {
    code = nanoid(7);
  } while (urls[code]);
  return code;
}

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url) {
    await Log('backend', 'error', 'service', 'No URL provided in request body');
    return res.status(400).json({ error: 'URL is required' });
  }
  let code = shortcode;
  if (code) {
    if (!SHORTCODE_REGEX.test(code)) {
      await Log('backend', 'error', 'service', 'Invalid shortcode format');
      return res.status(400).json({ error: 'Shortcode must be alphanumeric (3-20 chars)' });
    }
    if (urls[code]) {
      await Log('backend', 'error', 'service', 'Shortcode already exists');
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  } else {
    code = generateUniqueShortcode();
  }
  const now = new Date();
  const validMinutes = validity && Number.isInteger(validity) && validity > 0 ? validity : DEFAULT_VALIDITY_MINUTES;
  const expiresAt = new Date(now.getTime() + validMinutes * 60000);
  const shortUrl = `${BASE_URL}/${code}`;
  urls[code] = {
    originalUrl: url,
    shortUrl,
    shortcode: code,
    createdAt: now,
    expiresAt,
    clicks: []
  };
  await Log('backend', 'info', 'service', `Shortened URL generated for: ${url} as ${shortUrl}`);
  res.json({ shortUrl, expiry: expiresAt, shortcode: code });
});

// GET /:shortcode (Redirection)
router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const entry = urls[shortcode];
  if (!entry) {
    await Log('backend', 'error', 'service', `Shortcode not found: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  const now = new Date();
  if (now > entry.expiresAt) {
    await Log('backend', 'warn', 'service', `Shortcode expired: ${shortcode}`);
    return res.status(410).json({ error: 'Shortcode expired' });
  }
  // Track click
  entry.clicks.push({ timestamp: now, source: req.headers['user-agent'] || 'unknown' });
  await Log('backend', 'info', 'service', `Redirected to original URL for shortcode: ${shortcode}`);
  res.redirect(entry.originalUrl);
});

// GET /api/analytics
router.get('/analytics', async (req, res) => {
  const data = Object.values(urls).map(entry => ({
    shortUrl: entry.shortUrl,
    originalUrl: entry.originalUrl,
    shortcode: entry.shortcode,
    createdAt: entry.createdAt,
    expiresAt: entry.expiresAt,
    clicks: entry.clicks
  }));
  await Log('backend', 'info', 'service', 'Analytics data requested');
  res.json({ data });
});

module.exports = router; 