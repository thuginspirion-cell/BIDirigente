const fs = require('fs');
const content = fs.readFileSync('scratch/validar_todas_coordenadas.js', 'utf8');
console.log(content.slice(0, 1000));
