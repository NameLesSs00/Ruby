'use strict';
/**
 * Name normalization + client de-duplication.
 * We fetch all existing clients once and index them by a normalized Arabic name,
 * which is far more reliable than depending on the backend Search tokenizer.
 */
const { cleanText } = require('./excel');

/**
 * Normalize an Arabic name for comparison:
 * strip tashkeel/tatweel, unify alef/ya/ta-marbuta/hamza variants, collapse spaces.
 * Used only for matching; the cleaned original is what we send to the API.
 */
function normalizeName(s) {
  let t = cleanText(s);
  t = t.replace(/[\u064B-\u0652\u0640\u0670]/g, ''); // harakat + tatweel + superscript alef
  t = t.replace(/[أإآٱٲٳ]/g, 'ا');
  t = t.replace(/[ىي]/g, 'ي');
  t = t.replace(/ؤ/g, 'و');
  t = t.replace(/ئ/g, 'ي');
  t = t.replace(/ة/g, 'ه');
  t = t.replace(/[\u0622]/g, 'ا');
  return t.replace(/\s+/g, ' ').trim();
}

/** Page through GET /api/clients and build Map<normalizedName, client>. */
async function buildClientIndex(api) {
  const index = new Map();
  const pageSize = 50; // the server rejects large page sizes (PageSize=200 -> 400)
  let page = 1;
  // Hard stop to avoid runaway loops if totalCount is missing.
  while (page <= 2000) {
    const res = await api.get('/api/clients', { Page: page, PageSize: pageSize });
    if (!res.ok) {
      // Never treat a failed query as "no existing clients" - that would break
      // de-dupe and could create duplicates. Surface it instead.
      throw new Error(`GET /api/clients failed (${res.status}): ${JSON.stringify(res.data).slice(0, 300)}`);
    }
    const items = (res.data && res.data.items) || [];
    for (const c of items) index.set(normalizeName(c.fullName), c);
    const total = (res.data && res.data.totalCount) || 0;
    if (items.length === 0 || page * pageSize >= total) break;
    page++;
  }
  return index;
}

/** Page through GET /api/coaches and build Map<normalizedName, coach>. */
async function buildCoachIndex(api) {
  const index = new Map();
  const pageSize = 50;
  let page = 1;
  while (page <= 2000) {
    const res = await api.get('/api/coaches', { Page: page, PageSize: pageSize });
    if (!res.ok) {
      throw new Error(`GET /api/coaches failed (${res.status}): ${JSON.stringify(res.data).slice(0, 300)}`);
    }
    const items = (res.data && res.data.items) || [];
    for (const c of items) index.set(normalizeName(c.fullName), c);
    const total = (res.data && res.data.totalCount) || 0;
    if (items.length === 0 || page * pageSize >= total) break;
    page++;
  }
  return index;
}

/**
 * Build a Set of existing-subscription fingerprints for one client so re-runs
 * are idempotent: `${clientId}|${startDate}|${amount}`. Fetches all pages for
 * the given clientId.
 */
async function buildSubscriptionKeys(api, clientId) {
  const keys = new Set();
  const pageSize = 50;
  let page = 1;
  while (page <= 2000) {
    const res = await api.get('/api/subscriptions', { ClientId: clientId, Page: page, PageSize: pageSize });
    if (!res.ok) break; // absence of proof -> caller decides; do not fake empties for writes
    const items = (res.data && res.data.items) || [];
    for (const s of items) {
      const sd = (s.startDate || '').slice(0, 10);
      keys.add(`${clientId}|${sd}|${Number(s.amount || 0)}`);
    }
    const total = (res.data && res.data.totalCount) || 0;
    if (items.length === 0 || page * pageSize >= total) break;
    page++;
  }
  return keys;
}

module.exports = { normalizeName, buildClientIndex, buildCoachIndex, buildSubscriptionKeys };
