'use strict';
/**
 * Move a fully-processed source folder into dataEntery/added/.
 */
const fs = require('fs');
const path = require('path');
const { ADDED_DIR } = require('./config');

function moveFolderToAdded(absFolderPath) {
  if (!fs.existsSync(absFolderPath)) throw new Error('Source folder missing: ' + absFolderPath);
  if (!fs.existsSync(ADDED_DIR)) fs.mkdirSync(ADDED_DIR, { recursive: true });

  const name = path.basename(absFolderPath);
  let dest = path.join(ADDED_DIR, name);
  if (fs.existsSync(dest)) {
    // Never clobber a previously-added folder of the same name.
    dest = path.join(ADDED_DIR, `${name}__${Date.now()}`);
  }
  fs.renameSync(absFolderPath, dest);
  return dest;
}

module.exports = { moveFolderToAdded };
