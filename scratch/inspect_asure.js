const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('function abrirAssessoriaTecnica(');
console.log(html.substring(startIdx, startIdx + 800));
