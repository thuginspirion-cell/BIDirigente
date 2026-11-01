const fs = require('fs');
const lines = fs.readFileSync('scratch/context2_html.html', 'utf8').split('\n');
console.log('=== Lines 19115 to 19135 ===');
for (let i = 19115; i < 19135; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
