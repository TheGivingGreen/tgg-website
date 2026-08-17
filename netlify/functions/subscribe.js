// netlify/functions/subscribe.js
// The Giving Green - adds an email to the Mailchimp audience.
//
// Netlify auto-detects any function in netlify/functions/ at repo root.
// No netlify.toml needed, no npm install needed. Node 18+ has global fetch.
//
// REQUIRED environment variables (Netlify > Site configuration > Environment variables):
//   MAILCHIMP_API_KEY   your Mailchimp API key. Ends in something like -us14
//   MAILCHIMP_LIST_ID   the Audience ID. Mailchimp > Audience > Settings > Audience name and defaults
//
// OPTIONAL:
//   MAILCHIMP_STATUS    "subscribed" (default) or "pending" if your audience uses double opt-in
//   MAILCHIMP_TAGS      comma separated. Defaults to "giving5-modal,crawl-2026"

const crypto = require('crypto');

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const STATUS  = process.env.MAILCHIMP_STATUS || 'subscribed';
  const TAGS    = (process.env.MAILCHIMP_TAGS || 'giving5-modal,crawl-2026')
                    .split(',').map(t => t.trim()).filter(Boolean);

  if (!API_KEY || !LIST_ID) {
    console.error('Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID');
    return json(500, { ok: false, error: 'Server not configured' });
  }

  // Server prefix is the bit after the dash in the API key, e.g. us14
  const dc = API_KEY.split('-')[1];
  if (!dc) return json(500, { ok: false, error: 'API key missing datacenter suffix' });

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { /* fall through */ }

  const email = String(payload.email || '').trim().toLowerCase();
  const source = String(payload.source || 'org-modal').slice(0, 80);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json(400, { ok: false, error: 'Invalid email' });
  }

  // PUT upsert on the MD5 of the lowercased email.
  // status_if_new only applies to brand new members, so we never flip
  // an existing unsubscribe back on, which Mailchimp rejects anyway.
  const hash = crypto.createHash('md5').update(email).digest('hex');
  const url  = `https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`;

  const body = {
    email_address: email,
    status_if_new: STATUS,
    tags: TAGS,
    merge_fields: {},
    ip_signup: (event.headers['x-nf-client-connection-ip'] || '').split(',')[0] || undefined
  };

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('anystring:' + API_KEY).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Tags on PUT are not always applied for existing members. Best effort follow-up.
      if (TAGS.length) {
        fetch(url + '/tags', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from('anystring:' + API_KEY).toString('base64'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tags: TAGS.map(name => ({ name, status: 'active' })) })
        }).catch(() => {});
      }
      return json(200, { ok: true, status: data.status || STATUS, source });
    }

    // Someone who previously unsubscribed. Not an error worth showing a human.
    if (data.title === 'Member In Compliance State' || data.title === 'Forgotten Email Not Subscribed') {
      console.warn('Compliance state for a hashed address, skipping');
      return json(200, { ok: true, status: 'skipped' });
    }

    console.error('Mailchimp error', res.status, data.title, data.detail);
    return json(502, { ok: false, error: data.title || 'Mailchimp rejected the request' });

  } catch (err) {
    console.error('subscribe function threw', err);
    return json(502, { ok: false, error: 'Upstream failure' });
  }
};
