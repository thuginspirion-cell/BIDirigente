const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('__isReal') || l.includes('__navQueue')) {
    console.log('Line', i+1, ':', l.trim());
  }
});
