// scratch/fix_view_container_scope.js
const fs = require('fs');

console.log('Analisando o fechamento do view-container e o escopo de todas as abas...');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

const vcStart = html.indexOf('<div class="view-container">');
console.log('vcStart:', vcStart);

// Encontrar onde cada seção começa e onde cada seção fecha
const sections = [
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

sections.forEach(s => {
  const openPos = html.indexOf(`id="${s}"`);
  console.log(`Seção ${s} abre em: ${openPos}`);
});

// A última seção é pane-visitas. Vamos ver onde pane-visitas fecha:
const pVisitas = html.indexOf('id="pane-visitas"');
const pVisitasEnd = html.indexOf('</section>', pVisitas);
console.log('pane-visitas fecha em:', pVisitasEnd);
console.log('Snippet após pane-visitas:', html.substring(pVisitasEnd, pVisitasEnd + 300));
