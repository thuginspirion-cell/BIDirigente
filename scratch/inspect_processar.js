const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function processarPlanilhaSharepointBase64');
console.log(html.substring(idx, idx + 800));
