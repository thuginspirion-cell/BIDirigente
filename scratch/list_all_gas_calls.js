const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /google\.script\.run[\s\S]*?;/g;
let match;
let i = 0;
const lines = html.split('\n');

lines.forEach((line, lineNum) => {
  if (line.includes('google.script.run')) {
    console.log(`Linha ${lineNum + 1}: ${line.trim()}`);
  }
});
