// scratch/inspect_rogue1.js
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const p = 1928508;
console.log(html.substring(p - 300, p + 200));
