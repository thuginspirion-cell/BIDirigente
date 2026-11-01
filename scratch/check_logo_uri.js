const fs = require('fs');
const lines = fs.readFileSync('Código.gs', 'utf8').split('\n');
console.log(lines.slice(735, 750).join('\n'));
