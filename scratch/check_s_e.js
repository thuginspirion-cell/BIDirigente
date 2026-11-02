const fs = require('fs');
const code = fs.readFileSync('scratch/validar_todas_coordenadas.js', 'utf8');
const s = code.indexOf('const COORDENADAS_ESCOLAS = {');
const e = code.indexOf('};\n\nconsole.log', s);
console.log('s:', s, 'e:', e);
console.log('Sample:', code.slice(s, s + 100));
console.log('End sample:', code.slice(e - 50, e + 2));
