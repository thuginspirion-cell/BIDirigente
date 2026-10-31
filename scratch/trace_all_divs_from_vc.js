// scratch/trace_all_divs_from_vc.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const vcStart = html.indexOf('class="view-container"');
console.log('vcStart:', vcStart);

const tagRegex = /<\/?(div|section|main)\b[^>]*>/gi;
tagRegex.lastIndex = vcStart;

let depth = 0;
let m;
const sections = {};

while ((m = tagRegex.exec(html)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');

  if (tagName === 'div') {
    if (isClosing) depth--;
    else depth++;
  }

  if (fullTag.includes('id="pane-')) {
    const idMatch = fullTag.match(/id="([^"]+)"/);
    if (idMatch) {
      sections[idMatch[1]] = { pos: m.index, depth: depth };
      console.log(`SECTION OPEN [${idMatch[1]}] at pos ${m.index} with div-depth: ${depth}`);
    }
  }

  if (depth === 0) {
    console.log(`!!! DIV DEPTH REACHED 0 at pos ${m.index}! Snippet:`);
    console.log(html.substring(m.index - 50, m.index + 50));
    break;
  }
}
