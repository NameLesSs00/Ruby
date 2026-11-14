'use strict';
/**
 * Ruby data importer - CLI orchestrator (pilot: entity=clients).
 *
 *   node run.js --folder "New folder"                 # DRY-RUN (no writes)
 *   node run.js --folder "New folder" --commit        # create records, log, move folder
 *
 * A UTF-8 report is written to _tools/last-run-report.txt (the Windows console
 * cannot render Arabic reliably), plus an ASCII-only summary is printed.
 */
const fs = require('fs');
const path = require('path');
const config = require('./lib/config');
const api = require('./lib/api');
const dedupe = require('./lib/dedupe');
const log = require('./lib/log');
const move = require('./lib/move');
const clientsImporter = require('./importers/clients');

const REPORT_FILE = path.join(config.TOOLS_ROOT, 'last-run-report.txt');
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

async function main() {
  const folder = arg('folder');
  const entity = arg('entity', 'clients') || 'clients';
  const commit = Boolean(arg('commit', false));
  const out = [];
  const say = (s = '') => out.push(s);

  if (!folder) {
    console.error('Usage: node run.js --folder "<name>" [--entity clients] [--commit]');
    process.exit(2);
  }
  if (entity !== 'clients') {
    console.error('Pilot implements entity=clients only.');
    process.exit(2);
  }

  const sourceRoot = config.discoverSourceRoot();
  const folderAbs = path.join(sourceRoot, folder);
  if (!fs.existsSync(folderAbs)) {
    console.error('Folder not found: ' + folderAbs);
    process.exit(2);
  }

  say('== Ruby Data Importer ==');
  say('Backend : ' + config.BASE_URL);
  say('Folder  : ' + folder);
  say('Mode    : ' + (commit ? 'COMMIT' : 'DRY-RUN'));

  // 1. Locate + parse the star list
  const starFile = clientsImporter.findStarFile(folderAbs);
  if (!starFile) {
    console.error('No star (ستار) xlsx found in folder.');
    process.exit(2);
  }
  const parsed = clientsImporter.parseStarNames(starFile);
  say('Source  : ' + path.basename(starFile) + ` (sheet "${parsed.sheet}", header row ${parsed.headerRow})`);
  say('Parsed  : ' + parsed.names.length + ' unique names');

  // 2. Login
  const auth = await api.login();
  say('Login   : OK (token expires ' + auth.expiresAt + ')');

  // 3. Existing-client index for de-dupe
  const index = await dedupe.buildClientIndex(api);
  say('Backend clients (existing): ' + index.size);

  // 4. Classify
  const toCreate = [];
  const existing = [];
  for (const n of parsed.names) {
    const hit = index.get(dedupe.normalizeName(n));
    if (hit) existing.push({ name: n, id: hit.id, clientCode: hit.clientCode });
    else toCreate.push(n);
  }

  say('');
  say('--- PLAN ---');
  say(`Found: ${parsed.names.length}  |  To CREATE: ${toCreate.length}  |  Already EXISTS: ${existing.length}`);
  if (existing.length) {
    say('');
    say('EXISTS (will skip):');
    existing.forEach((e) => say(`  = ${e.name}  -> id ${e.id} (${e.clientCode})`));
  }
  say('');
  say('TO CREATE:');
  toCreate.forEach((n, i) => say(`  ${String(i + 1).padStart(2, ' ')}. + ${n}`));

  if (!commit) {
    say('');
    say('[dry-run] Nothing written. Re-run with --commit to create the clients above.');
    fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8');
    console.log(`DRY-RUN complete. Found=${parsed.names.length} toCreate=${toCreate.length} existing=${existing.length}`);
    console.log('Report: ' + REPORT_FILE);
    return;
  }

  // 5. COMMIT - first record doubles as the payload probe.
  say('');
  say('--- COMMIT ---');
  let usePhone = false; // becomes true if {fullName} alone is rejected (400)
  const created = [];
  const failed = [];
  for (const name of toCreate) {
    let body = usePhone ? { fullName: name, phoneNumber: '' } : { fullName: name };
    let res = await api.post('/api/clients', body);
    if (!res.ok && res.status === 400 && !usePhone) {
      usePhone = true; // probe fallback: API wants phoneNumber too
      body = { fullName: name, phoneNumber: '' };
      res = await api.post('/api/clients', body);
    }
    if (res.ok && res.data && res.data.data) {
      const c = res.data.data;
      created.push({ name, id: c.id, clientCode: c.clientCode });
      say(`  created #${c.id} ${c.clientCode}  ${name}`);
    } else {
      const err = JSON.stringify(res.data).slice(0, 200);
      failed.push({ name, status: res.status, error: err });
      say(`  FAILED (${res.status}) ${name}: ${err}`);
    }
    await delay(120);
  }
  say('Payload shape used: ' + (usePhone ? '{ fullName, phoneNumber:"" }' : '{ fullName }'));

  // 6. Verify
  say('');
  say('--- VERIFY ---');
  const reindex = await dedupe.buildClientIndex(api);
  let verified = 0;
  for (const c of created) if (reindex.has(dedupe.normalizeName(c.name))) verified++;
  say(`Created: ${created.length}  Verified present: ${verified}  Failed: ${failed.length}  Backend clients now: ${reindex.size}`);

  // 7. Log (one row for the star file + one row per skipped file in the folder)
  const ts = new Date().toISOString();
  const rows = [
    {
      Timestamp: ts, SourceFolder: folder, SourceFile: path.basename(starFile), Sheet: parsed.sheet,
      Entity: 'Client', RowsFound: parsed.names.length, Created: created.length,
      SkippedExisting: existing.length, Failed: failed.length,
      Status: failed.length ? 'CompletedWithErrors' : 'Success',
      Notes: usePhone ? 'phoneNumber sent as empty string' : '',
      CreatedIds: created.map((c) => c.id).join(','),
    },
  ];
  for (const f of clientsImporter.otherFiles(folderAbs, starFile)) {
    rows.push({
      Timestamp: ts, SourceFolder: folder, SourceFile: path.basename(f), Sheet: '',
      Entity: 'Client', RowsFound: 0, Created: 0, SkippedExisting: 0, Failed: 0,
      Status: 'Skipped', Notes: 'Empty template / no client names', CreatedIds: '',
    });
  }
  log.appendRows(rows);
  say('Log     : ' + log.LOG_FILE);

  // 8. Move the processed folder into added/
  const dest = move.moveFolderToAdded(folderAbs);
  say('Moved   : ' + folderAbs + '  ->  ' + dest);
  say('');
  say('Done. Pilot complete.');

  fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8');
  console.log(`COMMIT complete. created=${created.length} existing=${existing.length} failed=${failed.length}`);
  console.log('Report: ' + REPORT_FILE);
}

main().catch((e) => {
  console.error('ERROR: ' + (e && e.message ? e.message : e));
  process.exit(1);
});
