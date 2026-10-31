// scratch/inspect_vc_open.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p = html.indexOf('class="view-container"');
console.log(html.substring(p - 100, p + 300));
