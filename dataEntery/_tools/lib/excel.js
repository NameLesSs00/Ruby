'use strict';
/**
 * Excel helpers: workbook reading, header-driven row extraction, text cleanup,
 * and robust date parsing for the many Arabic/serial/ISO date formats in the books.
 */
const XLSX = require('xlsx');

const AR_MONTHS = {
  'يناير': 1, 'فبراير': 2, 'مارس': 3, 'ابريل': 4, 'أبريل': 4, 'مايو': 5,
  'يونيو': 6, 'يونيه': 6, 'يوليو': 7, 'اغسطس': 8, 'أغسطس': 8, 'سبتمبر': 9,
  'اكتوبر': 10, 'أكتوبر': 10, 'نوفمبر': 11, 'ديسمبر': 12,
};
const EN_MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

/** Strip RTL/LRM marks + non-breaking spaces, collapse whitespace, trim. */
function cleanText(v) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  return String(v)
    .replace(/[\u00A0\u200E\u200F\u202A-\u202E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function readWorkbook(file) {
  return XLSX.readFile(file, { cellDates: true });
}

/** Sheet -> array of rows, each an array of cleaned strings. */
function sheetToAoA(ws) {
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' }).map((r) => (r || []).map(cleanText));
}

/** Index of the first row (within the first 15) that contains any of `needles`. */
function findHeaderRow(aoa, needles) {
  const limit = Math.min(aoa.length, 15);
  for (let i = 0; i < limit; i++) {
    const row = aoa[i] || [];
    if (needles.some((h) => row.some((c) => c && c.includes(h)))) return i;
  }
  return -1;
}

function pad(y, m, d) {
  if (!y || !m || !d) return null;
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function serialToIso(serial) {
  // 25569 = days between Excel epoch (1899-12-30) and Unix epoch (1970-01-01)
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return pad(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/**
 * Parse a date from: JS Date, Excel serial, ISO (yyyy-mm-dd), d-m-yyyy,
 * "1-Jul" / "1-Jul-2026", or Arabic "1 يوليو [2026]". Returns yyyy-mm-dd or null.
 */
function parseDate(value, defaultYear) {
  if (value instanceof Date && !isNaN(value)) {
    return pad(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }
  const s = cleanText(value);
  if (!s) return null;
  const year = defaultYear || new Date().getFullYear();

  if (/^\d+(\.\d+)?$/.test(s)) {
    const n = parseFloat(s);
    if (n > 20000 && n < 80000) return serialToIso(n);
    return null;
  }
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return pad(+m[1], +m[2], +m[3]);

  m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) return pad(+m[3], +m[2], +m[1]);

  m = s.match(/^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s]?(\d{4})?$/);
  if (m) {
    const mon = EN_MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (mon) return pad(m[3] ? +m[3] : year, mon, +m[1]);
  }

  m = s.match(/^(\d{1,2})[-\s](\S+?)(?:[-\s](\d{4}))?$/);
  if (m && AR_MONTHS[m[2]]) return pad(m[3] ? +m[3] : year, AR_MONTHS[m[2]], +m[1]);

  return null;
}

module.exports = { cleanText, readWorkbook, sheetToAoA, findHeaderRow, parseDate, pad, AR_MONTHS, EN_MONTHS };
