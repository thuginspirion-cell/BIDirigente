const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const sc3 = html.split(/<script[^>]*>/i)[3].split(/<\/script>/i)[0];
try {
  new vm.Script(sc3, { filename: 'script3.js' });
  console.log('Script 3 passed!');
} catch(e) {
  console.error(e.message);
  console.error(e.stack);
  const lines = sc3.split('\n');
  const lineMatch = e.stack.match(/script3\.js:(\d+)/);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1], 10);
    console.log('Context around line ' + lineNum + ':');
    for (let i = Math.max(0, lineNum - 5); i < Math.min(lines.length, lineNum + 5); i++) {
      console.log((i + 1) + (i + 1 === lineNum ? ' >> ' : '    ') + lines[i]);
    }
  }
}
