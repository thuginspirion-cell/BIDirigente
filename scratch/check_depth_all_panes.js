// scratch/check_depth_all_panes.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const vcStart = html.indexOf('class="view-container"');

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

let depth = 0;
const tagRegex = /<\/?div\b[^>]*>/g;
tagRegex.lastIndex = vcStart;

let m;
let currentPaneIdx = 0;

while ((m = tagRegex.exec(html)) !== null) {
  const isClosing = m[0].startsWith('</');
  if (isClosing) depth--;
  else depth++;

  // Verificar se encontramos o próximo pane
  if (currentPaneIdx < panes.length) {
    const paneName = panes[currentPaneIdx];
    const panePos = html.indexOf('id="' + paneName + '"');
    if (m.index > panePos) {
      console.log(`Pane [${paneName}] começa na posição ${panePos}. Profundidade div atual: ${depth}`);
      currentPaneIdx++;
    }
  }

  if (depth === 0) {
    console.log(`view-container fechou em ${m.index}! Snippet:`, html.substring(m.index - 50, m.index + 50));
    break;
  }
}
