const axios = require('axios');
const { discord: { autoJoinGuild: inviteCode } } = require('../config');
const { readFileSync } = require('fs');
const { join } = require('path');
const { tempFolder } = require('../index');

const { token } = JSON.parse(readFileSync(join(tempFolder, 'dsc_acc.json')).toString()).account;
axios(`https://discord.com/api/v10/invites/${inviteCode}`, {
  headers: { Authorization: token }, method: 'POST'
});
