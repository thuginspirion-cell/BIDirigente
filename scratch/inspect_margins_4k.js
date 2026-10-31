// scratch/inspect_margins_4k.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Ver onde foi colocado o +15% de container e 4K
const p = html.indexOf('2300px');
console.log('2300px snippet:');
console.log(html.substring(p - 200, p + 600));

const p2 = html.indexOf('1610px');
console.log('1610px snippet:');
console.log(html.substring(p2 - 200, p2 + 600));
