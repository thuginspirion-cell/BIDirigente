// scratch/find_rogue_closing_div.js
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const vcStart = html.indexOf('<div class="view-container">');
const pVisitas = html.indexOf('id="pane-visitas"');
const pVisitasEnd = html.indexOf('</section>', pVisitas);

const insideVc = html.substring(vcStart + '<div class="view-container">'.length, pVisitasEnd);

let depth = 1;
const tagRegex = /<\/?div\b[^>]*>/g;
let m;
let roguePoints = [];

while ((m = tagRegex.exec(insideVc)) !== null) {
  const isClosing = m[0].startsWith('</');
  if (isClosing) depth--;
  else depth++;

  if (depth <= 0) {
    roguePoints.push({
      indexInInside: m.index,
      absIndex: vcStart + '<div class="view-container">'.length + m.index,
      depth: depth,
      snippet: insideVc.substring(m.index - 80, m.index + 80)
    });
  }
}

console.log('Total rogue closing points (depth <= 0):', roguePoints.length);
roguePoints.forEach((r, idx) => {
  console.log(`\n--- Rogue #${idx + 1} at absolute ${r.absIndex} (depth = ${r.depth}) ---`);
  console.log(r.snippet);
});
