const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('function abrirCentro(');
console.log(html.substring(startIdx + 1200, startIdx + 2800));
