const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const code = match[1];
  if (!code.trim()) continue;

  try {
    new vm.Script(code);
    console.log(`Script #${scriptIndex}: SINTAXE JS PERFEITA! (Sem erros de compilação)`);
  } catch (err) {
    console.error(`Script #${scriptIndex}: ERRO DE SINTAXE:`, err.message);
  }
}
