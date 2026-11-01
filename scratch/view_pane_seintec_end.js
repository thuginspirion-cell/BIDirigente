const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const pSeintec = html.indexOf('id="pane-seintec"');
const pGestao = html.indexOf('id="pane-gestao-hoje"');
const snippet = html.substring(pSeintec + 54500, pGestao);
console.log(snippet);
