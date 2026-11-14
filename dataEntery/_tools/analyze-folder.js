'use strict';
/**
 * READ-ONLY analysis of the "ايرادات المدربين" (coach revenues) folder.
 * Parses every xlsx + every sheet by header name (never fixed index) and
 * aggregates: data-row counts, distinct coaches, distinct clients, distinct
 * activities, and paid/remaining/commission presence. Writes UTF-8 report.
 * Performs NO network calls and NO writes to the backend.
 */
const fs = require('fs');
const path = require('path');
const config = require('./lib/config');
const excel = require('./lib/excel');
const dedupe = require('./lib/dedupe');

// Canonical field -> Arabic header needles (matched by "includes").
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

function main() {
  const root = config.discoverSourceRoot();
  const folderName = process.argv[2] || 'ايرادات المدربين';
  const folderAbs = path.join(root, folderName);
  const out = [];
  const say = (s = '') => out.push(s);

  if (!fs.existsSync(folderAbs)) {
    console.error('Folder not found: ' + folderAbs);
    process.exit(2);
  }

  const files = fs.readdirSync(folderAbs).filter((f) => /\.xlsx$/i.test(f) && !f.startsWith('~$'));
  const coachNames = new Map(); // normalized -> {display, count}
  const clientNames = new Map(); // normalized -> {display, count}
  const activities = new Map(); // normalized -> {display, count}
  let totalRows = 0;
  let rowsWithPaid = 0;
  let rowsWithRemaining = 0;
  let rowsWithCommission = 0;
  let rowsNoClient = 0;

  say('== Coach-Revenue Folder Analysis (READ-ONLY) ==');
  say('Folder: ' + folderName);
  say('Files : ' + files.length);
  say('');

  for (const f of files) {
    const fileAbs = path.join(folderAbs, f);
    const wb = excel.readWorkbook(fileAbs);
    let fileRows = 0;
    const fileSheets = [];
    const fileCoaches = new Set();
    for (const sheetName of wb.SheetNames) {
      const aoa = excel.sheetToAoA(wb.Sheets[sheetName]);
      const hIdx = excel.findHeaderRow(aoa, ['الاسم', 'التاريخ', 'النشاط']);
      if (hIdx === -1) { fileSheets.push(`${sheetName}:no-header`); continue; }
      const cols = mapColumns(aoa[hIdx] || []);
      if (cols.clientName === undefined) { fileSheets.push(`${sheetName}:no-name-col`); continue; }
      let sheetRows = 0;
      for (let i = hIdx + 1; i < aoa.length; i++) {
        const row = aoa[i] || [];
        const cname = excel.cleanText(row[cols.clientName]);
        const coach = cols.coachName !== undefined ? excel.cleanText(row[cols.coachName]) : '';
        const act = cols.activity !== undefined ? excel.cleanText(row[cols.activity]) : '';
        const paid = cols.paid !== undefined ? num(row[cols.paid]) : null;
        const rem = cols.remaining !== undefined ? num(row[cols.remaining]) : null;
        const com = cols.commission !== undefined ? num(row[cols.commission]) : null;
        const hasAny = cname || coach || act || paid !== null || rem !== null || com !== null;
        if (!hasAny) continue;
        sheetRows++; fileRows++; totalRows++;
        if (!cname) rowsNoClient++;
        else {
          const k = dedupe.normalizeName(cname);
          const e = clientNames.get(k) || { display: cname, count: 0 };
          e.count++; clientNames.set(k, e);
        }
        if (coach) {
          const k = dedupe.normalizeName(coach);
          const e = coachNames.get(k) || { display: coach, count: 0 };
          e.count++; coachNames.set(k, e);
          fileCoaches.add(k);
        }
        if (act) {
          const k = dedupe.normalizeName(act);
          const e = activities.get(k) || { display: act, count: 0 };
          e.count++; activities.set(k, e);
        }
        if (paid !== null) rowsWithPaid++;
        if (rem !== null) rowsWithRemaining++;
        if (com !== null) rowsWithCommission++;
      }
      fileSheets.push(`${sheetName}:${sheetRows}`);
    }
    say(`FILE ${f}`);
    say(`  data rows: ${fileRows}`);
    say(`  sheets(rows): ${fileSheets.join(', ')}`);
    say(`  coach-name(s) inside: ${[...fileCoaches].map((k) => coachNames.get(k).display).join(' | ') || '(none)'}`);
    say('');
  }

  const sortedClients = [...clientNames.values()].sort((a, b) => b.count - a.count);
  const sortedCoaches = [...coachNames.values()].sort((a, b) => b.count - a.count);
  const sortedActs = [...activities.values()].sort((a, b) => b.count - a.count);

  say('================ GLOBAL TOTALS ================');
  say('Total data rows        : ' + totalRows);
  say('Rows missing clientName: ' + rowsNoClient);
  say('Rows with paid (مدفوع) : ' + rowsWithPaid);
  say('Rows with remaining    : ' + rowsWithRemaining);
  say('Rows with commission   : ' + rowsWithCommission);
  say('Distinct client names  : ' + clientNames.size);
  say('Distinct coach values  : ' + coachNames.size);
  say('Distinct activities    : ' + activities.size);
  say('');
  say('--- COACH VALUES (name: rowCount) ---');
  sortedCoaches.forEach((c) => say(`  ${c.display}  : ${c.count}`));
  say('');
  say('--- ACTIVITY VALUES (activity: rowCount) ---');
  sortedActs.forEach((a) => say(`  ${a.display}  : ${a.count}`));
  say('');
  say('--- DISTINCT CLIENT NAMES (' + sortedClients.length + ') ---');
  sortedClients.forEach((c) => say(`  ${c.display}  (${c.count})`));

  const reportPath = path.join(config.TOOLS_ROOT, 'coach-folder-analysis.txt');
  fs.writeFileSync(reportPath, out.join('\n'), 'utf8');
  console.log(`ANALYSIS complete. rows=${totalRows} clients=${clientNames.size} coaches=${coachNames.size} activities=${activities.size}`);
  console.log('Report: ' + reportPath);
}

main();
