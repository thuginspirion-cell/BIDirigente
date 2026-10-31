// scratch/trace_divs_hero.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const heroStart = html.indexOf('<div class="executive-hero">');
const heroEnd = html.indexOf('<div class="indicators-split">');
const snippet = html.substring(heroStart, heroEnd);

let depth = 0;
const tagRegex = /<\/?div\b[^>]*>/g;
let m;
while ((m = tagRegex.exec(snippet)) !== null) {
  const isClosing = m[0].startsWith('</');
  if (isClosing) depth--;
  else depth++;
  console.log(m.index, depth, m[0]);
}
