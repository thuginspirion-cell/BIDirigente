const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('/* ========================================================\n       CONTROLE RESPONSIVO MOBILE & DRAWER DA SIDEBAR');
console.log(html.substring(startIdx, startIdx + 1500));
