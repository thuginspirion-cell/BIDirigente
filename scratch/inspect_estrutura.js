const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('const ESTRUTURA_ORGANIZACIONAL =');
console.log(html.substring(startIdx, startIdx + 1200));
