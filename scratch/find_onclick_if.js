const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('onclick=') && l.includes('if(')) {
    console.log(i + 1, l.trim());
  }
});
