const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

[1115, 1140, 16030, 16145, 18380, 18400, 18618, 18656].forEach(ln => {
  console.log(`=== Around line ${ln} ===`);
  console.log(lines.slice(Math.max(0, ln - 5), Math.min(lines.length, ln + 20)).join('\n'));
});
