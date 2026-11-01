const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pSeintec = html.indexOf('id="pane-seintec"');
const pGestao = html.indexOf('id="pane-gestao-hoje"');

const snippet = html.substring(pSeintec, pGestao);
// Vamos rastrear onde o depth cai para 0 dentro desse snippet
let depth = 1;
const regex = /<\/?div\b[^>]*>/gi;
let match;

while ((match = regex.exec(snippet)) !== null) {
  const tag = match[0];
  if (tag.startsWith('</')) depth--;
  else if (!tag.endsWith('/>')) depth++;

  if (depth === 0) {
    console.log('Depth caiu para 0 no índice relativo:', match.index);
    console.log('Contexto:', snippet.substring(match.index - 100, match.index + 100));
    break;
  }
}
