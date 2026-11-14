'use strict';
/**
 * Thin authenticated HTTP client for the Ruby backend.
 * - Logs in once, caches the access token, auto-refreshes on 401.
 * - get/post/patch return { ok, status, data } and never throw on HTTP errors,
 *   so the caller can record per-row success/failure without aborting a batch.
 */
const { BASE_URL, EMAIL, PASSWORD } = require('./config');

let accessToken = null;
let refreshToken = null;

// The live server intermittently drops connections (UND_ERR_CONNECT_TIMEOUT).
// Retry transient network failures with exponential backoff.
const MAX_NET_RETRIES = 5;
// Only retry non-idempotent writes when the request provably never reached the
// server (connection-phase errors), so we can never double-create a record.
const CONNECT_PHASE_CODES = new Set([
  'UND_ERR_CONNECT_TIMEOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ETIMEDOUT', 'UND_ERR_HEADERS_TIMEOUT',
]);
const backoff = (attempt) => new Promise((r) => setTimeout(r, Math.min(500 * 2 ** attempt, 8000)));

function assertCreds() {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Missing RUBY_API_EMAIL / RUBY_API_PASSWORD (set in _tools/.env or environment).');
  }
}

/**
 * fetch() with retries. When `idempotent` is false (POST/PATCH), only
 * connection-phase errors are retried; 5xx/429 are returned as-is because the
 * server may have already processed the write.
 */
async function fetchWithRetry(url, options, idempotent) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_NET_RETRIES; attempt++) {
    try {
      const res = await fetch(url, options);
      const transientStatus = res.status >= 500 || res.status === 429;
      if (idempotent && transientStatus && attempt < MAX_NET_RETRIES) {
        await backoff(attempt);
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      const code = e && e.cause && e.cause.code;
      const safeToRetry = idempotent || CONNECT_PHASE_CODES.has(code);
      if (safeToRetry && attempt < MAX_NET_RETRIES) {
        await backoff(attempt);
        continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error('fetch failed after retries');
}

async function login() {
  assertCreds();
  const res = await fetchWithRetry(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  }, true);
  const text = await res.text();
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${text.slice(0, 300)}`);
  const data = JSON.parse(text);
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  return { ok: true, expiresAt: data.accessTokenExpiresAtUtc };
}

async function doRefresh() {
  if (!refreshToken) return login();
  const res = await fetchWithRetry(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refreshToken }),
  }, true);
  if (!res.ok) return login();
  const data = await res.json();
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
}

function buildQuery(params = {}) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') u.append(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : '';
}

async function request(method, urlPath, { params, body } = {}, isRetry = false) {
  if (!accessToken) await login();
  const idempotent = method === 'GET' || method === 'HEAD';
  const res = await fetchWithRetry(`${BASE_URL}${urlPath}${buildQuery(params)}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': 'ar',
      Authorization: `Bearer ${accessToken}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }, idempotent);

  if (res.status === 401 && !isRetry) {
    await doRefresh();
    return request(method, urlPath, { params, body }, true);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { ok: res.ok, status: res.status, data };
}

module.exports = {
  login,
  get: (p, params) => request('GET', p, { params }),
  post: (p, body) => request('POST', p, { body }),
  patch: (p, body) => request('PATCH', p, { body }),
  del: (p, params) => request('DELETE', p, { params }),
  getToken: () => accessToken,
};
