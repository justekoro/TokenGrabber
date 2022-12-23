module.exports.isPlatform = (platform) => process.platform === platform;
module.exports.isDarwin = () => process.platform === 'darwin';
module.exports.isWindows = () => process.platform === 'win32';
