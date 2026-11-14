'use strict';
/**
 * Central configuration for the Ruby data importer.
 * Credentials come from environment variables or a git-ignored _tools/.env file.
 * Nothing here is shipped with the app (this is standalone tooling).
 */
const fs = require('fs');
const path = require('path');

const TOOLS_ROOT = path.resolve(__dirname, '..'); // dataEntery/_tools
const DATA_ROOT = path.resolve(TOOLS_ROOT, '..'); // dataEntery

/** Minimal .env parser (no external dependency). */
function loadEnvFile() {
  const envPath = path.join(TOOLS_ROOT, '.env');
  const vars = {};
  if (!fs.existsSync(envPath)) return vars;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx === -1) continue;
    const key = t.slice(0, idx).trim();
    let val = t.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

const fileEnv = loadEnvFile();
const read = (key, fallback) => process.env[key] || fileEnv[key] || fallback;

const BASE_URL = String(read('RUBY_API_URL', 'https://swimming1academy.runasp.net')).replace(/\/+$/, '');
const EMAIL = read('RUBY_API_EMAIL', '');
const PASSWORD = read('RUBY_API_PASSWORD', '');

const ADDED_DIR = path.join(DATA_ROOT, 'added');
const LOG_FILE = path.join(ADDED_DIR, '_import-log.xlsx');

/**
 * Auto-discover the source root: the single academy folder under dataEntery
 * that is neither `_tools` nor `added`. Avoids hardcoding the Arabic folder name.
 */
function discoverSourceRoot() {
  const dirs = fs
    .readdirSync(DATA_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => n !== '_tools' && n !== 'added');
  if (dirs.length === 0) throw new Error('No source folder found under ' + DATA_ROOT);
  return path.join(DATA_ROOT, dirs[0]);
}

module.exports = {
  TOOLS_ROOT,
  DATA_ROOT,
  BASE_URL,
  EMAIL,
  PASSWORD,
  ADDED_DIR,
  LOG_FILE,
  discoverSourceRoot,
  hasCreds: () => Boolean(EMAIL && PASSWORD),
};
