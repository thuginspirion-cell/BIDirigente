const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const scriptContent = match[1];
  console.log(`\n--- Script #${scriptIndex} (início em ${match.index}) ---`);
  console.log('Primeiras 150 caracteres:', scriptContent.substring(0, 150).replace(/\s+/g, ' '));
  console.log('Últimas 150 caracteres:', scriptContent.substring(scriptContent.length - 150).replace(/\s+/g, ' '));
}
