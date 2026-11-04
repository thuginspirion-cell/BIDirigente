const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const requiredButtons = [
  'side-btn-home',
  'side-btn-gestao',
  'side-btn-agenda',
  'side-btn-carro',
  'side-btn-visitas',
  'side-btn-escolas',
  'side-btn-GAB',
  'side-btn-SEINTEC',
  'side-btn-CAF',
  'side-btn-CGE',
  'side-btn-CRH',
  'side-btn-NPE'
];

let allOk = true;
requiredButtons.forEach(id => {
  const hasId = html.includes('id="' + id + '"');
  console.log(id + ':', hasId ? 'OK' : 'MISSING');
  if (!hasId) allOk = false;
});

const scriptBlocks = html.match(/<script[\s\S]*?<\/script>/gi) || [];
let literalDoubleSlashFound = false;
scriptBlocks.forEach((b, idx) => {
  if (b.includes('https://') || b.includes('http://')) {
    console.warn('Warning: literal http(s):// found in script block ' + idx);
    literalDoubleSlashFound = true;
  }
});
if (!literalDoubleSlashFound) {
  console.log('Shield check: No literal // in script tags! OK');
}

console.log('Menu validation overall:', allOk ? 'PASS' : 'FAIL');
process.exit(allOk ? 0 : 1);
