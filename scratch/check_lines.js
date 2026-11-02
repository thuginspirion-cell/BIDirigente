const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('id="pane-visitas"')) console.log('pane-visitas at line:', i+1);
  if (l.includes('</main>')) console.log('</main> at line:', i+1);
});
