const { generateString } = require('./string');
const os = require('os');
const { join } = require('path');
const { openSync } = require('fs');

module.exports.randomFileCreator = (dir = os.tmpdir()) => {
  const path = join(dir, generateString(32));
  // openSync(path, 777);
  return path;
};
