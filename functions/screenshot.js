const screenshot = require('screenshot-desktop');
const fs = require('fs');
const { join } = require('path');
const { tempFolder } = require('../index');

// https://www.npmjs.com/package/screenshot-desktop#usage
screenshot.listDisplays().then((displays) => {
  displays.forEach(display => {
    screenshot({ screen: display.id, format: 'png' })
      .then((img) => {
        fs.writeFileSync(join(tempFolder, `Screenshot of ${display.name.replaceAll('\\', '')}.png`), img);
      });
  });
});
