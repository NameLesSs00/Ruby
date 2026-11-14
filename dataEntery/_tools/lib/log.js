'use strict';
/**
 * Tracking workbook: dataEntery/added/_import-log.xlsx
 * One row per imported source file (plus rows for skipped files).
 */
const fs = require('fs');
const XLSX = require('xlsx');
const { ADDED_DIR, LOG_FILE } = require('./config');

const HEADERS = [
  'Timestamp', 'SourceFolder', 'SourceFile', 'Sheet', 'Entity',
  'RowsFound', 'Created', 'SkippedExisting', 'Failed', 'Status', 'Notes', 'CreatedIds',
];

function ensureDir() {
  if (!fs.existsSync(ADDED_DIR)) fs.mkdirSync(ADDED_DIR, { recursive: true });
}

/** Append row objects (keyed by HEADERS) to the log workbook, creating it if absent. */
function appendRows(rows) {
  ensureDir();
  let wb;
  let ws;
  if (fs.existsSync(LOG_FILE)) {
    wb = XLSX.readFile(LOG_FILE);
    ws = wb.Sheets[wb.SheetNames[0]];
  } else {
    wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet([HEADERS]);
    XLSX.utils.book_append_sheet(wb, ws, 'ImportLog');
  }

  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
  const startRow = range.e.r + 1;

  rows.forEach((rowObj, i) => {
    HEADERS.forEach((h, c) => {
      const val = rowObj[h] !== undefined && rowObj[h] !== null ? rowObj[h] : '';
      const addr = XLSX.utils.encode_cell({ r: startRow + i, c });
      ws[addr] = { t: typeof val === 'number' ? 'n' : 's', v: val };
    });
  });

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: startRow + rows.length - 1, c: HEADERS.length - 1 },
  });

  XLSX.writeFile(wb, LOG_FILE);
  return LOG_FILE;
}

module.exports = { appendRows, HEADERS, LOG_FILE };
