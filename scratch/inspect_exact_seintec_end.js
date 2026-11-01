const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const pSeintec = html.indexOf('id="pane-seintec"');
const pSeintecEnd = html.indexOf('</section>', pSeintec);

console.log(JSON.stringify(html.substring(pSeintecEnd - 150, pSeintecEnd + 20)));
