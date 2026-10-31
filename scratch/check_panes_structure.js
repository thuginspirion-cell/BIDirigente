// scratch/check_panes_structure.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Onde abre view-container:
const vcStart = html.indexOf('class="view-container"');
console.log('vcStart at:', vcStart);

// Encontrar as tags <div> e </div> a partir de vcStart
let depth = 0;
const tagRegex = /<\/?div\b[^>]*>/g;
tagRegex.lastIndex = vcStart;

let match;
while ((match = tagRegex.exec(html)) !== null) {
  const tag = match[0];
  const isClosing = tag.startsWith('</');
  if (isClosing) {
    depth--;
  } else {
    depth++;
  }
  if (depth === 0) {
    console.log('view-container closes at index:', match.index);
    console.log('Snippet around close:', html.substring(match.index - 100, match.index + 200));
    break;
  }
}
