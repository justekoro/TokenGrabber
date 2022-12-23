module.exports.removeSpaces = (str) => {
  return str.replaceAll(/[\r\t]/g, '');
};

module.exports.removeLineReturns = (str) => {
  return str.replaceAll(/\n/g, '');
};
