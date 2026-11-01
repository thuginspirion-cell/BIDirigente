const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== AUDITORIA GERAL DE COMPATIBILIDADE COM O GOOGLE SITES (GS) ===\n');

// 1. Links externos sem target="_blank"
// No iframe do Google Sites, tentar navegar o top-level frame ou navegar dentro do iframe para domínios com X-Frame-Options: SAMEORIGIN ou DENY (como Microsoft SharePoint, SED, Google Forms) quebra a tela com tela cinza/branca de erro.
const aTags = html.match(/<a\s+[^>]*>/gi) || [];
const externalWithoutTarget = [];
const externalWithoutRel = [];

aTags.forEach(tag => {
  if (tag.includes('http://') || tag.includes('https://')) {
    const hasTargetBlank = /target\s*=\s*["']_blank["']/i.test(tag);
    if (!hasTargetBlank) {
      externalWithoutTarget.push(tag);
    }
    const hasRel = /rel\s*=\s*["'][^"']*noopener[^"']*["']/i.test(tag);
    if (!hasRel) {
      externalWithoutRel.push(tag);
    }
  }
});

console.log(`1. Total de tags <a> com URLs externas: ${aTags.filter(t => t.includes('http')).length}`);
console.log(`   - Sem target="_blank" (CRÍTICO em iframe do GS): ${externalWithoutTarget.length}`);
if (externalWithoutTarget.length > 0) {
  externalWithoutTarget.slice(0, 10).forEach(t => console.log('     * ', t));
}
console.log(`   - Sem rel="noopener noreferrer": ${externalWithoutRel.length}`);

// 2. Chamadas diretas a google.script.run que possam faltar tratamento de erro
const gScriptCalls = html.match(/google\.script\.run[\s\S]*?\.[a-zA-Z0-9_]+\s*\(/g) || [];
console.log(`\n2. Chamadas diretas a google.script.run: ${gScriptCalls.length}`);
gScriptCalls.forEach(call => {
  const hasFailure = call.includes('withFailureHandler');
  console.log(`   - Chamada: ${call.replace(/\s+/g, ' ').substring(0, 80)}... [withFailureHandler: ${hasFailure}]`);
});

// 3. Auditoria de funções chamadas no onclick
const onclicks = [];
const onclickRegex = /onclick\s*=\s*["']([^"']+)["']/gi;
let match;
while ((match = onclickRegex.exec(html)) !== null) {
  onclicks.push(match[1]);
}
console.log(`\n3. Total de manipuladores onclick inline: ${onclicks.length}`);

// 4. Verificação de CSP / Scripts / Recursos bloqueados em iframe
// O GS roda em sandbox 'allow-scripts allow-popups allow-forms allow-same-origin'.
// window.top ou window.parent acessos diretos causam SecurityError (Cross-Origin Frame).
const topAccesses = html.match(/window\.(top|parent)\.[a-zA-Z0-9_]+/g) || [];
console.log(`\n4. Acessos diretos a window.top/window.parent (SecurityError no GS): ${topAccesses.length}`);
if (topAccesses.length > 0) {
  topAccesses.forEach(a => console.log('   * ', a));
}

// 5. Verificação de window.open sem parâmetros adequados
const windowOpens = html.match(/window\.open\s*\([^)]*\)/g) || [];
console.log(`\n5. Chamadas a window.open: ${windowOpens.length}`);
windowOpens.forEach(o => {
  if (!o.includes('_blank')) {
    console.log('   * Alerta: sem _blank explícito:', o);
  }
});
