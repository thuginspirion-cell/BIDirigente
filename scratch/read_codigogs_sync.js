const fs = require('fs');
const content = fs.readFileSync('Código.gs', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(70, 290).join('\n'));
