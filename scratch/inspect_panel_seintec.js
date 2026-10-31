// scratch/inspect_panel_seintec.js
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const pSeintecStart = html.indexOf('id="pane-seintec"');
const pSeintecEnd = html.indexOf('</section>', pSeintecStart);
const seintecSection = html.substring(pSeintecStart, pSeintecEnd);

let depth = 0;
const tagRegex = /<\/?div\b[^>]*>/g;
let m;
while ((m = tagRegex.exec(seintecSection)) !== null) {
  const isClosing = m[0].startsWith('</');
  if (isClosing) depth--;
  else depth++;
  if (depth < 0) {
    console.log('Depth dropped below 0 at index:', m.index);
    console.log(seintecSection.substring(m.index - 50, m.index + 50));
    break;
  }
}
console.log('Final depth of pane-seintec:', depth);
