// Dumps structure of all xlsx files under dataEntery (sheets + first rows preview)
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = 'C:/work/Ruby/dataEntery';
const out = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_tools' || e.name === 'added') continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.xlsx$/i.test(e.name) && !e.name.startsWith('~$')) inspect(f);
  }
}

function inspect(file) {
  out.push('='.repeat(100));
  out.push('FILE: ' + path.relative(ROOT, file));
  let wb;
  try {
    wb = XLSX.readFile(file, { cellDates: true });
  } catch (err) {
    out.push('  !! ERROR: ' + err.message);
    return;
  }
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const ref = ws['!ref'] || '(empty)';
    const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : null;
    const rows = range ? range.e.r - range.s.r + 1 : 0;
    const cols = range ? range.e.c - range.s.c + 1 : 0;
    out.push(`  SHEET: "${name}"  ref=${ref}  rows=${rows} cols=${cols}`);
    // preview first 6 rows as compact arrays
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
    for (let i = 0; i < Math.min(6, aoa.length); i++) {
      const cells = (aoa[i] || []).map(c => String(c).replace(/\s+/g, ' ').trim()).slice(0, 15);
      out.push('    R' + (i + 1) + ': ' + JSON.stringify(cells));
    }
  }
}

walk(ROOT);
fs.writeFileSync(path.join(__dirname, 'structure_report.txt'), out.join('\n'), 'utf8');
console.log('report written, lines:', out.length);
