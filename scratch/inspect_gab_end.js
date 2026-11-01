const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pGab = html.indexOf('id="pane-gabinete"');
const pSeintec = html.indexOf('id="pane-seintec"');

const gabContent = html.substring(pGab, pSeintec);
console.log(gabContent.substring(gabContent.length - 250));
