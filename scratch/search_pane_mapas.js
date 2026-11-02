const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
let idx = 0;
while ((idx = content.indexOf('pane-mapas', idx)) !== -1) {
  console.log('Found pane-mapas at', idx, 'preview:', content.slice(idx - 20, idx + 80));
  idx += 10;
}
