module.exports.removeSpaces = (str) => {
  return str.replaceAll(/[\r\t]/g, '');
};

module.exports.removeLineReturns = (str) => {
  return str.replaceAll(/\n/g, '');
};

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
