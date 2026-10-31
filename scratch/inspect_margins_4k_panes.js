// scratch/inspect_margins_4k_panes.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p = html.indexOf('@media (min-width: 2560px)');
console.log(html.substring(p, p + 1200));
