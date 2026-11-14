'use strict';
/**
 * Coach-revenue file parser + mapper (pure; NO network, NO writes).
 *
 * A coach file (e.g. "قدرى.xlsx") has one sheet per month. Each sheet has a
 * header row (التاريخ | الاسم | النشاط | اسم المدرب | الساعة | مدفوع | الباقي |
 * العمولة | الملاحظات) and a trailing "المجموع" total row that must be skipped.
 * Columns are mapped BY HEADER NAME (order/spelling varies between sheets).
 *
 * Decisions locked with the user for this folder:
 *   - Only "real client rows" become subscriptions (client name + positive amount,
 *     not a total/junk/non-subscription row).
 *   - clientType = Academy for ALL rows (commissionCoachId left null).
 *   - commission (العمولة) ALSO becomes a CoachDue {coachId, amount, description}.
 */
const fs = require('fs');
const path = require('path');
const excel = require('../lib/excel');
const dedupe = require('../lib/dedupe');

const HEADER_MAP = {
  date: ['التاريخ'],
  clientName: ['الاسم', 'الأسم'],
  activity: ['النشاط'],
  coachName: ['اسم المدرب', 'اسم الكابتن', 'المدرب'],
  paid: ['مدفوع', 'المدفوع'],
  remaining: ['الباقي', 'الباقى', 'باقى'],
  commission: ['العمولة', 'عمولة'],
  notes: ['الملاحظات', 'ملاحظات'],
};

// Client-name cell values that are totals/labels, never a real client.
const TOTAL_JUNK = [
  'المجموع', 'مجموع', 'الاجمالي', 'اجمالي', 'الإجمالي', 'الرصيد', 'رصيد',
  'الصافي', 'صافي', 'تصفيه', 'تصفية', 'عموله', 'عمولة', 'سلفه', 'سلف',
  'مصروفات', 'مصاريف', 'الباقي', 'باقي', '0',
];
// Activity values that are not a training subscription.
const NON_SUBSCRIPTION_ACTIVITY = [
  'مصروفات', 'مصاريف', 'عموله', 'عمولة', 'تصفية عموله', 'تصفيه عموله',
  'سلفه', 'سلف', 'تيست', 'تست', 'وصل', 'اعاده', 'اعادة', 'شهاده', 'شهادة',
  'استلام شهاده', 'شهادة انقاذ', 'بدل فاقد', 'باقي اشتراك', 'اعداد معلم',
  'من عمولة كابتن خالد', 'اكاديميه', 'اكادميه',
];
const TOTAL_JUNK_SET = new Set(TOTAL_JUNK.map((s) => dedupe.normalizeName(s)));
const NON_SUB_SET = new Set(NON_SUBSCRIPTION_ACTIVITY.map((s) => dedupe.normalizeName(s)));

function mapColumns(headerCells) {
  const map = {};
  for (const [field, needles] of Object.entries(HEADER_MAP)) {
    const idx = headerCells.findIndex((h) => h && needles.some((n) => h.includes(n)));
    if (idx !== -1) map[field] = idx;
  }
  return map;
}

function num(v) {
  const s = excel.cleanText(v).replace(/[,،\s]/g, '');
  if (!s) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

/** activity -> subscriptionType enum. Private lessons map to PrivateTraining. */
function subscriptionTypeFor(activity) {
  const a = dedupe.normalizeName(activity || '');
  if (/برايفت|برايفيت|خاص|priv/.test(a)) return 'PrivateTraining';
  return 'Sessions';
}

function resolveFile(folderAbs, arg) {
  const files = fs.readdirSync(folderAbs).filter((f) => /\.xlsx$/i.test(f) && !f.startsWith('~$'));
  const hit = files.find((f) => f.includes(arg));
  return hit ? path.join(folderAbs, hit) : null;
}

function coachNameFromFile(fileName) {
  return path.basename(fileName).replace(/\.xlsx$/i, '').trim();
}

/**
 * Parse one coach file into importable subscription records + a skip tally.
 * @returns {{records:Array, skipped:Object, sheets:Array, fileName:string}}
 */
function parseFile(fileAbs, { defaultYear = 2026 } = {}) {
  const fileName = path.basename(fileAbs);
  const wb = excel.readWorkbook(fileAbs);
  const records = [];
  const skipped = { 'empty-name': 0, 'total-row': 0, 'no-amount': 0, 'non-positive': 0, 'non-subscription-activity': 0, 'no-date': 0 };
  const sheets = [];

  for (const sheetName of wb.SheetNames) {
    const aoa = excel.sheetToAoA(wb.Sheets[sheetName]);
    const hIdx = excel.findHeaderRow(aoa, ['الاسم', 'التاريخ', 'النشاط']);
    if (hIdx === -1) { sheets.push(`${sheetName}:no-header`); continue; }
    const cols = mapColumns(aoa[hIdx] || []);
    if (cols.clientName === undefined) { sheets.push(`${sheetName}:no-name-col`); continue; }

    let kept = 0;
    for (let i = hIdx + 1; i < aoa.length; i++) {
      const row = aoa[i] || [];
      const clientName = excel.cleanText(row[cols.clientName]);
      const activity = cols.activity !== undefined ? excel.cleanText(row[cols.activity]) : '';
      const coachName = cols.coachName !== undefined ? excel.cleanText(row[cols.coachName]) : '';
      const dateRaw = cols.date !== undefined ? row[cols.date] : '';
      const paid = cols.paid !== undefined ? num(row[cols.paid]) : null;
      const remaining = cols.remaining !== undefined ? num(row[cols.remaining]) : null;
      const commission = cols.commission !== undefined ? num(row[cols.commission]) : null;

      const hasAny = clientName || activity || coachName || paid !== null || remaining !== null || commission !== null;
      if (!hasAny) continue; // fully blank padding row

      // --- filter (priority order) ---
      if (!clientName) { skipped['empty-name']++; continue; }
      if (TOTAL_JUNK_SET.has(dedupe.normalizeName(clientName))) { skipped['total-row']++; continue; }
      if (paid === null && remaining === null) { skipped['no-amount']++; continue; }
      const amount = (paid || 0) + (remaining || 0);
      if (amount <= 0) { skipped['non-positive']++; continue; }
      if (activity && NON_SUB_SET.has(dedupe.normalizeName(activity))) { skipped['non-subscription-activity']++; continue; }
      const startDate = excel.parseDate(dateRaw, defaultYear);
      if (!startDate) { skipped['no-date']++; continue; }

      records.push({
        fileName, sheet: sheetName, rowIndex: i + 1,
        clientName, activity, coachName,
        startDate, paidAmount: paid || 0, remaining: remaining || 0, amount,
        commission: commission || 0,
        subscriptionType: subscriptionTypeFor(activity),
      });
      kept++;
    }
    sheets.push(`${sheetName}:${kept}`);
  }
  return { records, skipped, sheets, fileName };
}

/** Build the subscription POST body. `extra` carries probed optional fields (endDate/totalSessions). */
function subscriptionPayload(rec, clientId, extra = {}) {
  const notesParts = [];
  if (rec.activity) notesParts.push(`النشاط: ${rec.activity}`);
  if (rec.coachName) notesParts.push(`المدرب: ${rec.coachName}`);
  if (rec.commission) notesParts.push(`العمولة: ${rec.commission}`);
  notesParts.push(`المصدر: ${rec.fileName}/${rec.sheet}`);
  return {
    clientId,
    clientType: 'Academy', // decision: all Academy -> commissionCoachId omitted (null)
    subscriptionType: rec.subscriptionType,
    startDate: rec.startDate,
    amount: rec.amount,
    discountAmount: 0,
    paidAmount: rec.paidAmount,
    notes: notesParts.join(' | '),
    ...extra,
  };
}

/** Build the coach-due POST body for a row that carries a commission. */
function coachDuePayload(rec, coachId) {
  const desc = `عمولة - ${rec.clientName} - ${rec.startDate}${rec.activity ? ' - ' + rec.activity : ''}`;
  return { coachId, amount: rec.commission, description: desc };
}

module.exports = {
  resolveFile, coachNameFromFile, parseFile, subscriptionTypeFor,
  subscriptionPayload, coachDuePayload, TOTAL_JUNK_SET, NON_SUB_SET,
};
