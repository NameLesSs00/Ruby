'use strict';
/**
 * Pilot importer: the "ستار" name list -> Clients.
 * The sheet has a header row (م | الاسم) followed by client names in the الاسم column.
 */
const fs = require('fs');
const path = require('path');
const excel = require('../lib/excel');

/** Prefer the file whose name contains "ستار"; ignore Excel lock files (~$). */
function findStarFile(folderAbs) {
  const files = fs.readdirSync(folderAbs).filter((f) => /\.xlsx$/i.test(f) && !f.startsWith('~$'));
  const starred = files.find((f) => f.includes('ستار'));
  return starred ? path.join(folderAbs, starred) : null;
}

/** Other (non-star) xlsx files in the folder, e.g. the empty daily template. */
function otherFiles(folderAbs, starFileAbs) {
  return fs
    .readdirSync(folderAbs)
    .filter((f) => /\.xlsx$/i.test(f) && !f.startsWith('~$'))
    .map((f) => path.join(folderAbs, f))
    .filter((f) => f !== starFileAbs);
}

/** Parse names from the first sheet that has an "الاسم" header. Returns cleaned, in-file-deduped names. */
function parseStarNames(file) {
  const wb = excel.readWorkbook(file);
  for (const sheetName of wb.SheetNames) {
    const aoa = excel.sheetToAoA(wb.Sheets[sheetName]);
    const headerRow = excel.findHeaderRow(aoa, ['الاسم']);
    if (headerRow === -1) continue;
    const headers = aoa[headerRow] || [];
    const nameCol = headers.findIndex((h) => h && h.includes('الاسم'));
    if (nameCol === -1) continue;

    const seen = new Set();
    const names = [];
    for (let i = headerRow + 1; i < aoa.length; i++) {
      const name = excel.cleanText((aoa[i] || [])[nameCol]);
      if (!name) continue;
      const key = name.replace(/\s+/g, ' ').toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(name);
    }
    return { names, sheet: sheetName, headerRow: headerRow + 1, nameCol: nameCol + 1 };
  }
  return { names: [], sheet: wb.SheetNames[0], headerRow: -1, nameCol: -1 };
}

module.exports = { findStarFile, otherFiles, parseStarNames };
