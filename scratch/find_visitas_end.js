const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let inVisitas = false;
lines.forEach((l, i) => {
  if (l.includes('id="pane-visitas"')) {
    inVisitas = true;
    console.log('pane-visitas start at line:', i + 1);
  }
  if (inVisitas && l.includes('</section>')) {
    console.log('pane-visitas end at line:', i + 1);
    inVisitas = false;
  }
});
