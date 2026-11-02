const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const idx = content.indexOf('const LIMITES_URE_ITAPEVI');
console.log('Before LIMITES_URE_ITAPEVI:');
console.log(content.slice(idx - 300, idx));
