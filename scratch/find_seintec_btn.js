const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const match = html.match(/id=['"]side-btn-SEINTEC['"][^>]*>/);
console.log('side-btn-SEINTEC HTML:', match ? match[0] : 'not found');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('side-btn-SEINTEC')) {
    console.log('Line', i+1, ':', l.trim().substring(0, 100));
  }
});
