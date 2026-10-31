// scratch/inspect_4k_all_queries.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p = html.indexOf('@media (min-width: 2560px)');
const pNext = html.indexOf('@media (max-width: 1100px)', p);
console.log(html.substring(p, pNext));
