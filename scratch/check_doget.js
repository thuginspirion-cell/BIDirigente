const fs = require('fs');
const lines = fs.readFileSync('Código.gs', 'utf8').split('\n');
console.log(lines.slice(10, 65).join('\n'));
