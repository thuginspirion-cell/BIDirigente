const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('const BASE_ESCOLAS_PADRAO = [');
const end = content.indexOf('];', start);
const jsonStr = content.substring(start + 'const BASE_ESCOLAS_PADRAO = '.length, end + 1);
const escolas = eval('(' + jsonStr + ')');

const valContent = fs.readFileSync('scratch/validar_todas_coordenadas.js', 'utf8');
const valStart = valContent.indexOf('const COORDENADAS_ESCOLAS = {');
const valEnd = valContent.indexOf('};\n\nconsole.log', valStart);
const coordsStr = valContent.substring(valStart + 'const COORDENADAS_ESCOLAS = '.length, valEnd + 1);
const coords = eval('(' + coordsStr + ')');

console.log('Total Escolas:', escolas.length);
console.log('Total Coords:', Object.keys(coords).length);

let missing = 0;
escolas.forEach(e => {
  if (!coords[e.cie]) {
    console.log('Missing:', e.cie, e.nome, e.cidade);
    missing++;
  }
});

console.log('Missing total:', missing);
