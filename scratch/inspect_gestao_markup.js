// scratch/inspect_gestao_markup.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pGroup = html.indexOf('GESTÃO DA REDE</div>');
console.log(html.substring(pGroup + 1200, pGroup + 2500));
