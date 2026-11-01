const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const pSeintec = html.indexOf('id="pane-seintec"');
const pSeintecEnd = html.indexOf('</section>', pSeintec);

const seintecContent = html.substring(pSeintec, pSeintecEnd);
const openDivs = (seintecContent.match(/<div\b/gi) || []).length;
const closeDivs = (seintecContent.match(/<\/div>/gi) || []).length;

console.log('pane-seintec:');
console.log('Aberturas <div:', openDivs);
console.log('Fechamentos </div>:', closeDivs);
console.log('Diferença:', openDivs - closeDivs);
