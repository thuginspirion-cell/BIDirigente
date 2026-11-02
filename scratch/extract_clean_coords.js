const fs = require('fs');
const code = fs.readFileSync('scratch/validar_todas_coordenadas.js', 'utf8');
const s = code.indexOf('const COORDENADAS_ESCOLAS = {') + 'const COORDENADAS_ESCOLAS = '.length;
const e = code.indexOf('console.log(\'Total de escolas', s);
const lastBrace = code.lastIndexOf('};', e);
const dictText = code.substring(s, lastBrace + 1);

console.log('Dict length:', dictText.length);
console.log('Dict ends with:', dictText.slice(-30));

const parsed = eval('(' + dictText + ')');
console.log('Parsed keys count:', Object.keys(parsed).length);

// Save clean JSON to scratch/coords_60.json
fs.writeFileSync('scratch/coords_60.json', JSON.stringify(parsed, null, 2), 'utf8');
console.log('Saved clean coords_60.json!');
