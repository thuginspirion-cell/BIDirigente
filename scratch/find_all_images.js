const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<img ') || l.includes('<img\t') || l.includes('logo_ure')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
