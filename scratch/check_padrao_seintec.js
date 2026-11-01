const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('renderizarRegistrosPadraoSeintec')) {
    console.log('Line', i+1, ':', l);
  }
});

const idx = html.indexOf('function renderizarRegistrosPadraoSeintec');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 2000));
}
