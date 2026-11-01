const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('SEINTEC_BASES_CONFIG =')) {
    console.log('Line', i+1, ':', l);
  }
});

const idx = html.indexOf('SEINTEC_BASES_CONFIG =');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 1000));
}
