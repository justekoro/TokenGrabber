const os = require('os');
const { isDarwin } = require('./os');

const { homedir } = os.userInfo();
const roamingAppData = process.env.APPDATA || (isDarwin() ? `${homedir}/Library/Preferences` : `${homedir}/.local/share`);

module.exports = {
  paths: {
    localAppData: process.env.LOCALAPPDATA, roamingAppData,
    // https://www.developerfiles.com/location-of-startup-items-and-applications-on-mac-os-x/
    startupPrograms: isDarwin() ? `${homedir}/Library/StartupItems` : `${roamingAppData}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\`
  },
  temp: os.tmpdir(),
  user: {
    name: os.userInfo().username,
    homeDir: homedir
  },
  computer: {
    name: os.hostname(),
    ram: {
      free: os.freemem(),
      total: os.totalmem(),
    },
    kernelVer: os.version(),
    cpus: os.cpus(),
    networkInterfaces: os.networkInterfaces()
  }
};
