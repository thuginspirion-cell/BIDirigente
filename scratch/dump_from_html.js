const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const start = content.indexOf('const BASE_ESCOLAS_PADRAO = [');
const end = content.indexOf('];', start) + 1;
const jsonStr = content.slice(start + 'const BASE_ESCOLAS_PADRAO = '.length, end);

try {
  const escolas = JSON.parse(jsonStr);
  console.log('Successfully parsed BASE_ESCOLAS_PADRAO! Count:', escolas.length);
  fs.writeFileSync('scratch/todas_60_escolas.json', JSON.stringify(escolas, null, 2), 'utf8');
} catch (e) {
  console.error('JSON parse error:', e.message);
}
