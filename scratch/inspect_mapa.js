const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('function abrirModalMapaVisitas(');
console.log(startIdx !== -1 ? html.substring(startIdx, startIdx + 500) : 'abrirModalMapaVisitas NÃO ENCONTRADA!');
