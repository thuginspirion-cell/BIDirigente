const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pGab = html.indexOf('id="pane-gabinete"');
const pSeintec = html.indexOf('id="pane-seintec"');

const gabContent = html.substring(pGab, pSeintec);
const openDivs = (gabContent.match(/<div\b/gi) || []).length;
const closeDivs = (gabContent.match(/<\/div>/gi) || []).length;

console.log('pane-gabinete:');
console.log('Aberturas <div:', openDivs);
console.log('Fechamentos </div>:', closeDivs);
console.log('Diferença:', openDivs - closeDivs);
