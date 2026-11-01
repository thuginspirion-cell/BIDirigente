const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== VERIFICAÇÃO DE RESILIÊNCIA EM TODAS AS CHAMADAS DO APPS SCRIPT ===\n');

// Vamos verificar se todas as chamadas `google.script.run` possuem `.withFailureHandler`
// e se estão protegidas com try/catch ou contingência
const lines = html.split('\n');
const callSites = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('google.script.run')) {
    // Pegar as 15 linhas seguintes para ver a cadeia de métodos
    const snippet = lines.slice(i, i + 15).join('\n');
    const hasFailure = snippet.includes('withFailureHandler');
    callSites.push({
      line: i + 1,
      snippet: lines[i].trim(),
      hasFailureHandler: hasFailure
    });
  }
}

callSites.forEach(site => {
  console.log(`Linha ${site.line}: withFailureHandler = ${site.hasFailureHandler ? 'SIM (OK)' : 'NÃO (ALERTA)'}`);
  if (!site.hasFailureHandler) {
    console.log(`   Trecho: ${site.snippet}`);
  }
});
