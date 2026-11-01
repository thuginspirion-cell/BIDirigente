const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const vcStart = html.indexOf('<div class="view-container">');
const pHome = html.indexOf('id="pane-home"');
const pCentro = html.indexOf('id="pane-centro"');
const pGab = html.indexOf('id="pane-gabinete"');
const pSeintec = html.indexOf('id="pane-seintec"');
const pGestao = html.indexOf('id="pane-gestao-hoje"');

function testDepthAt(targetIdx) {
  let depth = 0;
  // analisar tags <div> e </div> entre vcStart e targetIdx
  const sub = html.substring(vcStart, targetIdx);
  const divMatches = sub.match(/<\/?div\b[^>]*>/gi) || [];
  divMatches.forEach(tag => {
    if (tag.startsWith('</')) depth--;
    else if (!tag.endsWith('/>')) depth++;
  });
  return depth;
}

console.log('Depth na entrada de pane-home:', testDepthAt(pHome));
console.log('Depth na entrada de pane-centro:', testDepthAt(pCentro));
console.log('Depth na entrada de pane-gabinete:', testDepthAt(pGab));
console.log('Depth na entrada de pane-seintec:', testDepthAt(pSeintec));
console.log('Depth na entrada de pane-gestao-hoje:', testDepthAt(pGestao));
