const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const panes = [
  'pane-home',
  'pane-gestao-hoje',
  'pane-agenda',
  'pane-carro',
  'pane-visitas',
  'pane-escolas',
  'pane-gabinete',
  'pane-seintec',
  'pane-centro'
];

const vcIdx = html.indexOf('<div class="view-container">');
console.log('Posição da abertura de .view-container:', vcIdx);

panes.forEach(p => {
  const pIdx = html.indexOf(`id="${p}"`);
  console.log(`Pane [${p}] está na posição: ${pIdx} (distância da abertura: ${pIdx - vcIdx})`);
});
