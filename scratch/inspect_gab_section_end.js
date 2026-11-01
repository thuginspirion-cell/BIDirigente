const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pGab = html.indexOf('id="pane-gabinete"');
const pSeintec = html.indexOf('id="pane-seintec"');

const gabContent = html.substring(pGab, pSeintec);
const pSectionEnd = gabContent.lastIndexOf('</section>');
console.log(gabContent.substring(pSectionEnd - 250, pSectionEnd + 10));
