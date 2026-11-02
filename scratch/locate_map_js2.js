const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const idx = content.indexOf('COORDENADAS_REDE_ESCOLAS');
console.log('Found COORDENADAS_REDE_ESCOLAS at', idx);
console.log('Before:');
console.log(content.slice(idx - 300, idx));
const idxEnd = content.indexOf('window.focarEscolaNoMapaPorCie');
console.log('After window.focarEscolaNoMapaPorCie:');
console.log(content.slice(idxEnd, idxEnd + 400));
