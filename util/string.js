module.exports.removeSpaces = (s) => s.replaceAll(/[\r\t]/g, '');
module.exports.removeLineReturns = (s) => s.replaceAll(/\n/g, '');
module.exports.addDoubleQuotes = (s) => `"${s}"`;

module.exports.generateString = (length = 16) => {
  // https://stackoverflow.com/a/1349426/13088041
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports.isValidURL = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};
