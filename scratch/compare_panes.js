const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pHome = html.indexOf('id="pane-home"');
const pGestao = html.indexOf('id="pane-gestao-hoje"');

console.log('pane-home snippet:');
console.log(html.substring(pHome - 120, pHome + 180));

console.log('\npane-gestao snippet:');
console.log(html.substring(pGestao - 120, pGestao + 180));
