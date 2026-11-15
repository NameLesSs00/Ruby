'use strict';
/**
 * Coach-file SUB-PILOT orchestrator (one file at a time inside ايرادات المدربين).
 *
 *   node run-subpilot.js --file "قدرى"                 # DRY-RUN (no writes)
 *   node run-subpilot.js --file "قدرى" --commit        # create coach+clients+subs+dues, log
 *
 * Stages: Coach -> Clients -> (subscription payload probe) -> Subscriptions -> CoachDues.
 * clientType is Academy for all rows (decision); commission also becomes CoachDues (decision).
 * The processed FOLDER is NOT moved - a sub-pilot handles a single file only.
 * A UTF-8 report is written to _tools/subpilot-report.txt (console cannot render Arabic).
 */
const fs = require('fs');
const path = require('path');
const config = require('./lib/config');
const api = require('./lib/api');
const dedupe = require('./lib/dedupe');
const log = require('./lib/log');
const cf = require('./importers/coachfile');

const REPORT_FILE = path.join(config.TOOLS_ROOT, 'subpilot-report.txt');
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

async function main() {
  const fileArg = arg('file');
  const folder = arg('folder', 'ايرادات المدربين') || 'ايرادات المدربين';
  const year = parseInt(arg('year', '2026'), 10) || 2026;
  const commit = Boolean(arg('commit', false));
  const out = [];
  const say = (s = '') => out.push(s);

  if (!fileArg && !arg('list', false)) {
    console.error('Usage: node run-subpilot.js --file "<name-or-index>" [--folder "ايرادات المدربين"] [--year 2026] [--commit]');
    console.error('       node run-subpilot.js --list   (print indexed file list)');
    process.exit(2);
  }

  const root = config.discoverSourceRoot();
  const folderAbs = path.join(root, folder);
  if (!fs.existsSync(folderAbs)) { console.error('Folder not found: ' + folderAbs); process.exit(2); }

  // `--list` prints an indexed file list (UTF-8 report) so a file can be chosen
  // by number, avoiding Arabic arguments on the command line.
  const allFiles = fs.readdirSync(folderAbs).filter((f) => /\.xlsx$/i.test(f) && !f.startsWith('~$')).sort();
  if (arg('list', false)) {
    const l = ['== Files in ' + folder + ' =='];
    allFiles.forEach((f, i) => l.push(`  ${i + 1}. ${f}`));
    fs.writeFileSync(REPORT_FILE, l.join('\n'), 'utf8');
    console.log('Wrote indexed file list to ' + REPORT_FILE + ' (' + allFiles.length + ' files)');
    return;
  }

  // Resolve the target file: numeric -> 1-based index; otherwise substring match.
  let fileAbs;
  if (/^\d+$/.test(String(fileArg))) {
    fileAbs = path.join(folderAbs, allFiles[parseInt(fileArg, 10) - 1]);
    if (!fs.existsSync(fileAbs)) { console.error('File index out of range: ' + fileArg); process.exit(2); }
  } else {
    fileAbs = cf.resolveFile(folderAbs, fileArg);
  }
  if (!fileAbs || !fs.existsSync(fileAbs)) { console.error('No xlsx matching "' + fileArg + '" in folder.'); process.exit(2); }

  say('== Coach-File Sub-Pilot ==');
  say('Backend : ' + config.BASE_URL);
  say('Folder  : ' + folder);
  say('File    : ' + path.basename(fileAbs));
  say('Mode    : ' + (commit ? 'COMMIT' : 'DRY-RUN'));
  say('Year    : ' + year + ' (default for D-Mon dates)');

  // 1. Parse + filter
  const parsed = cf.parseFile(fileAbs, { defaultYear: year });
  const records = parsed.records;
  say('');
  say('--- PARSE ---');
  say('Sheets kept(rows): ' + parsed.sheets.join(', '));
  say('Importable subscription rows: ' + records.length);
  const skipTotal = Object.values(parsed.skipped).reduce((a, b) => a + b, 0);
  say('Skipped rows: ' + skipTotal + '  ' + JSON.stringify(parsed.skipped));
  if (records.length === 0) {
    say('');
    say('Nothing importable in this file. Aborting.');
    fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8');
    console.log('DRY-RUN complete. importable=0');
    return;
  }

  // 2. Login + indexes
  const auth = await api.login();
  say('');
  say('Login   : OK (token expires ' + auth.expiresAt + ')');
  const coachIndex = await dedupe.buildCoachIndex(api);
  const clientIndex = await dedupe.buildClientIndex(api);
  say('Backend coaches(existing): ' + coachIndex.size + ' | clients(existing): ' + clientIndex.size);

  // 3. Coach (from filename; fall back to dominant in-sheet coach value)
  const fileCoach = cf.coachNameFromFile(fileAbs);
  const inSheet = {};
  for (const r of records) if (r.coachName) inSheet[r.coachName] = (inSheet[r.coachName] || 0) + 1;
  const dominant = Object.keys(inSheet).sort((a, b) => inSheet[b] - inSheet[a])[0] || fileCoach;
  let coachKey = dedupe.normalizeName(fileCoach);
  let coachDisplay = fileCoach;
  if (!coachIndex.has(coachKey) && dedupe.normalizeName(dominant) !== coachKey) {
    // filename didn't match an existing coach; prefer the in-sheet spelling for display
    coachDisplay = dominant;
    coachKey = dedupe.normalizeName(dominant);
  }
  const existingCoach = coachIndex.get(coachKey) || null;
  say('');
  say('--- COACH ---');
  say(`Coach: "${coachDisplay}" -> ` + (existingCoach ? `EXISTS id ${existingCoach.id}` : 'TO CREATE'));

  // 4. Clients
  const toCreateClients = [];
  const existingClients = [];
  const seenClient = new Set();
  for (const r of records) {
    const k = dedupe.normalizeName(r.clientName);
    if (seenClient.has(k)) continue;
    seenClient.add(k);
    const hit = clientIndex.get(k);
    if (hit) existingClients.push({ name: r.clientName, id: hit.id, clientCode: hit.clientCode });
    else toCreateClients.push(r.clientName);
  }
  say('');
  say('--- CLIENTS ---');
  say(`Distinct clients in file: ${seenClient.size}  |  existing: ${existingClients.length}  |  to create: ${toCreateClients.length}`);
  toCreateClients.forEach((n, i) => say(`  ${String(i + 1).padStart(3, ' ')}. + ${n}`));
  existingClients.forEach((e) => say(`       = ${e.name} (id ${e.id})`));

  // 5. Subscription + CoachDue plan
  const byType = {};
  for (const r of records) byType[r.subscriptionType] = (byType[r.subscriptionType] || 0) + 1;
  const dueRows = records.filter((r) => r.commission > 0);
  say('');
  say('--- SUBSCRIPTIONS (plan) ---');
  say('To create: ' + records.length + '  byType: ' + JSON.stringify(byType));
  say('Sample (up to 12):');
  records.slice(0, 12).forEach((r) =>
    say(`  ${r.startDate} | ${r.clientName} | ${r.activity || '-'} | ${r.subscriptionType} | amount=${r.amount} paid=${r.paidAmount} rem=${r.remaining} com=${r.commission} | ${r.sheet}#r${r.rowIndex}`));
  say('');
  say('--- COACHDUES (plan) ---');
  say('Rows with commission>0: ' + dueRows.length + (dueRows.length ? ' (will POST /api/coachdues)' : ' (none in this file)'));
  dueRows.slice(0, 12).forEach((r) => say(`  ${r.clientName} | ${r.startDate} | commission=${r.commission}`));

  if (!commit) {
    say('');
    say('[dry-run] Nothing written. Re-run with --commit to create the records above.');
    fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8');
    console.log(`DRY-RUN complete. file="${path.basename(fileAbs)}" importable=${records.length} newClients=${toCreateClients.length} existingClients=${existingClients.length} dues=${dueRows.length} coach=${existingCoach ? 'exists' : 'create'}`);
    console.log('Report: ' + REPORT_FILE);
    return;
  }

  // ===================== COMMIT =====================
  say('');
  say('--- COMMIT ---');

  // 6a. Coach
  let coachId = existingCoach ? existingCoach.id : null;
  let coachCreated = false;
  if (!coachId) {
    const res = await api.post('/api/coaches', { fullName: coachDisplay });
    if (res.ok && res.data && res.data.data) { coachId = res.data.data.id; coachCreated = true; say(`  coach created #${coachId} (${coachDisplay})`); }
    else { say(`  COACH CREATE FAILED (${res.status}): ${JSON.stringify(res.data).slice(0, 200)} -- aborting (dues need coachId).`); fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8'); process.exit(1); }
  } else {
    say(`  coach exists #${coachId}`);
  }

  // 6b. Clients
  const nameToId = new Map();
  for (const e of existingClients) nameToId.set(dedupe.normalizeName(e.name), e.id);
  const createdClients = [];
  const failedClients = [];
  for (const name of toCreateClients) {
    const res = await api.post('/api/clients', { fullName: name });
    if (res.ok && res.data && res.data.data) {
      const id = res.data.data.id;
      nameToId.set(dedupe.normalizeName(name), id);
      createdClients.push({ name, id });
      say(`  client #${id}  ${name}`);
    } else {
      failedClients.push({ name, status: res.status, error: JSON.stringify(res.data).slice(0, 200) });
      say(`  CLIENT FAILED (${res.status}) ${name}: ${JSON.stringify(res.data).slice(0, 160)}`);
    }
    await delay(90);
  }

  // 6c. Subscription payload probe (throwaway, then DELETE)
  const probeClientId = (existingClients[0] && existingClients[0].id) || (createdClients[0] && createdClients[0].id) || null;
  let lockedExtra = null;
  let probeError = '';
  if (probeClientId) {
    const base = records[0];
    const probeRec = { ...base, clientName: 'PROBE', activity: base.activity, commission: 0, fileName: 'probe', sheet: 'probe' };
    const candidates = [
      {},
      { endDate: base.startDate },
      { endDate: base.startDate, totalSessions: 0 },
      { totalSessions: 0 },
    ];
    for (const extra of candidates) {
      const res = await api.post('/api/subscriptions', cf.subscriptionPayload(probeRec, probeClientId, extra));
      if (res.ok && res.data && res.data.data) {
        lockedExtra = extra;
        const pid = res.data.data.id;
        const del = await api.del('/api/subscriptions/' + pid);
        say(`  probe OK with extra=${JSON.stringify(extra)} -> created #${pid}, deleted=${del.ok}`);
        break;
      }
      probeError = `(${res.status}) ${JSON.stringify(res.data).slice(0, 200)}`;
      say(`  probe rejected extra=${JSON.stringify(extra)}: ${probeError}`);
    }
  } else {
    say('  no client available to probe subscription shape -- aborting.');
  }
  if (!lockedExtra) {
    say('  SUBSCRIPTION SHAPE UNKNOWN -- aborting before mass-create. Last error: ' + probeError);
    fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8');
    process.exit(1);
  }

  // 6d. Subscriptions (idempotent per client+startDate+amount)
  const subKeysCache = new Map();
  const createdSubs = [];
  const skippedSubs = [];
  const failedSubs = [];
  for (const r of records) {
    const clientId = nameToId.get(dedupe.normalizeName(r.clientName));
    if (!clientId) { failedSubs.push({ name: r.clientName, error: 'no clientId (client create failed?)' }); continue; }
    if (!subKeysCache.has(clientId)) subKeysCache.set(clientId, await dedupe.buildSubscriptionKeys(api, clientId));
    const key = `${clientId}|${r.startDate}|${Number(r.amount)}`;
    if (subKeysCache.get(clientId).has(key)) { skippedSubs.push({ name: r.clientName, key }); continue; }
    const res = await api.post('/api/subscriptions', cf.subscriptionPayload(r, clientId, lockedExtra));
    if (res.ok && res.data && res.data.data) {
      const id = res.data.data.id;
      createdSubs.push({ id, clientId, name: r.clientName, startDate: r.startDate, amount: r.amount });
      subKeysCache.get(clientId).add(key);
      say(`  sub #${id}  ${r.startDate} ${r.clientName} amount=${r.amount}`);
    } else {
      failedSubs.push({ name: r.clientName, status: res.status, error: JSON.stringify(res.data).slice(0, 160) });
      say(`  SUB FAILED (${res.status}) ${r.clientName}: ${JSON.stringify(res.data).slice(0, 140)}`);
    }
    await delay(90);
  }

  // 6e. CoachDues (commission rows). No search/delete endpoint -> create once.
  const createdDues = [];
  const failedDues = [];
  if (coachId) {
    for (const r of dueRows) {
      const res = await api.post('/api/coachdues', cf.coachDuePayload(r, coachId));
      if (res.ok && res.data && res.data.data) {
        createdDues.push({ id: res.data.data.id, name: r.clientName, amount: r.commission });
        say(`  due #${res.data.data.id}  ${r.clientName} amount=${r.commission}`);
      } else {
        failedDues.push({ name: r.clientName, status: res.status, error: JSON.stringify(res.data).slice(0, 160) });
        say(`  DUE FAILED (${res.status}) ${r.clientName}: ${JSON.stringify(res.data).slice(0, 140)}`);
      }
      await delay(90);
    }
  }

  // 7. Verify
  say('');
  say('--- VERIFY ---');
  const clientIndex2 = await dedupe.buildClientIndex(api);
  let clientsPresent = 0;
  for (const c of createdClients) if (clientIndex2.get(dedupe.normalizeName(c.name))) clientsPresent++;
  say(`Coach: id ${coachId} (${coachCreated ? 'created' : 'existing'})`);
  say(`Clients created: ${createdClients.length} | verified present: ${clientsPresent} | failed: ${failedClients.length} | backend clients now: ${clientIndex2.size}`);
  say(`Subscriptions created: ${createdSubs.length} | skipped(existing): ${skippedSubs.length} | failed: ${failedSubs.length}`);
  say(`CoachDues created: ${createdDues.length} | failed: ${failedDues.length}`);

  // 8. Log (one row per entity)
  const ts = new Date().toISOString();
  const srcFile = path.basename(fileAbs);
  const rows = [
    { Timestamp: ts, SourceFolder: folder, SourceFile: srcFile, Sheet: '(all months)', Entity: 'Coach', RowsFound: 1, Created: coachCreated ? 1 : 0, SkippedExisting: existingCoach ? 1 : 0, Failed: 0, Status: 'Success', Notes: coachDisplay, CreatedIds: coachCreated ? String(coachId) : '' },
    { Timestamp: ts, SourceFolder: folder, SourceFile: srcFile, Sheet: '(all months)', Entity: 'Client', RowsFound: seenClient.size, Created: createdClients.length, SkippedExisting: existingClients.length, Failed: failedClients.length, Status: failedClients.length ? 'CompletedWithErrors' : 'Success', Notes: '', CreatedIds: createdClients.map((c) => c.id).join(',') },
    { Timestamp: ts, SourceFolder: folder, SourceFile: srcFile, Sheet: '(all months)', Entity: 'Subscription', RowsFound: records.length, Created: createdSubs.length, SkippedExisting: skippedSubs.length, Failed: failedSubs.length, Status: failedSubs.length ? 'CompletedWithErrors' : 'Success', Notes: 'clientType=Academy; extra=' + JSON.stringify(lockedExtra), CreatedIds: createdSubs.map((s) => s.id).join(',') },
    { Timestamp: ts, SourceFolder: folder, SourceFile: srcFile, Sheet: '(all months)', Entity: 'CoachDue', RowsFound: dueRows.length, Created: createdDues.length, SkippedExisting: 0, Failed: failedDues.length, Status: failedDues.length ? 'CompletedWithErrors' : 'Success', Notes: 'commission->coachdues; coachId=' + coachId, CreatedIds: createdDues.map((d) => d.id).join(',') },
  ];
  log.appendRows(rows);
  say('');
  say('Log     : ' + log.LOG_FILE);
  say('NOTE    : Sub-pilot processed a single file; the folder was NOT moved (other files remain).');
  say('Done.');

  fs.writeFileSync(REPORT_FILE, out.join('\n'), 'utf8');
  console.log(`COMMIT complete. file="${srcFile}" coachId=${coachId} clients=+${createdClients.length} subs=+${createdSubs.length} dues=+${createdDues.length} failed(c/s/d)=${failedClients.length}/${failedSubs.length}/${failedDues.length}`);
  console.log('Report: ' + REPORT_FILE);
}

main().catch((e) => {
  console.error('ERROR: ' + (e && e.message ? e.message : e));
  process.exit(1);
});
