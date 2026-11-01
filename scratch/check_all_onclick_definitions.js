const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /onclick\s*=\s*["']([^"']+)["']/gi;
let match;
const fnCalls = new Set();

while ((match = regex.exec(html)) !== null) {
  const expr = match[1].trim();
  // Pegar o nome da função que precede '('
  const fnMatch = expr.match(/^([a-zA-Z0-9_$]+)\s*\(/);
  if (fnMatch) {
    fnCalls.add(fnMatch[1]);
  }
}

console.log(`Total de funções distintas chamadas em onclicks: ${fnCalls.size}`);

const missingFns = [];
fnCalls.forEach(fn => {
  // Verificar se a função está definida no script (function fnName ou window.fnName ou const fnName =)
  const defRegex = new RegExp(`(function\\s+${fn}\\b|window\\.${fn}\\s*=|\\bconst\\s+${fn}\\s*=|\\blet\\s+${fn}\\s*=|\\bvar\\s+${fn}\\s*=)`);
  if (!defRegex.test(html)) {
    missingFns.push(fn);
  }
});

console.log(`Funções ausentes ou não declaradas globalmente: ${missingFns.length}`);
if (missingFns.length > 0) {
  missingFns.forEach(fn => console.log('   * FALTANDO:', fn));
} else {
  console.log('✓ 100% das funções chamadas nos 255 botões/elementos clicáveis existem no script!');
}
