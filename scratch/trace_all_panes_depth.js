const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const panes = [
  'pane-home',
  'pane-centro',
  'pane-gabinete',
  'pane-seintec',
  'pane-gestao-hoje',
  'pane-agenda',
  'pane-carro',
  'pane-escolas',
  'pane-visitas'
];

const vcStart = html.indexOf('<div class="view-container">');

panes.forEach(p => {
  const pIdx = html.indexOf(`id="${p}"`);
  const sub = html.substring(vcStart, pIdx);
  const divMatches = sub.match(/<\/?div\b[^>]*>/gi) || [];
  let d = 0;
  divMatches.forEach(tag => {
    if (tag.startsWith('</')) d--;
    else if (!tag.endsWith('/>')) d++;
  });
  console.log(`Pane [${p}]: depth = ${d}`);
});

// E no fechamento de </main>
const mainEnd = html.indexOf('</main>');
const subMain = html.substring(vcStart, mainEnd);
const divsMain = subMain.match(/<\/?div\b[^>]*>/gi) || [];
let dMain = 0;
divsMain.forEach(tag => {
  if (tag.startsWith('</')) dMain--;
  else if (!tag.endsWith('/>')) dMain++;
});
console.log(`Fechamento </main>: depth = ${dMain} (deve ser 0 para fechar a view-container perfeitamente)`);
