const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes("tipo: 'error'") || l.includes('tipo: "error"')) {
    console.log('Line', i+1, ':', l.trim());
    console.log(lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 15)).join('\n'));
    console.log('--------------------------------------------------');
  }
});
