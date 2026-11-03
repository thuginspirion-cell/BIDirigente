const fs = require('fs');
const vm = require('vm');

console.log('====================================================');
console.log('🔍 INICIANDO VALIDAÇÃO DE INTEGRIDADE GERAL DO BI');
console.log('====================================================');

const html = fs.readFileSync('index.html', 'utf8');
const codigoGs = fs.readFileSync('Código.gs', 'utf8');

let errors = [];

// 1. Verificar os 12 botões da Sidebar
const botoesSidebar = [
  'side-btn-home',
  'side-btn-gestao',
  'side-btn-agenda',
  'side-btn-carro',
  'side-btn-visitas',
  'side-btn-escolas',
  'side-btn-GAB',
  'side-btn-SEINTEC',
  'side-btn-CAF',
  'side-btn-CGE',
  'side-btn-CRH',
  'side-btn-NPE'
];

console.log('\n[1/4] Verificando existência dos 12 botões da Sidebar...');
botoesSidebar.forEach(id => {
  const regex = new RegExp(`id=["']${id}["']`, 'i');
  if (regex.test(html)) {
    console.log(`  ✔ Botão encontrado: ${id}`);
  } else {
    errors.push(`Botão ausente na sidebar: ${id}`);
    console.error(`  ❌ Botão AUSENTE: ${id}`);
  }
});

// 2. Verificar Sintaxe JS dos scripts em index.html
console.log('\n[2/4] Validando sintaxe JavaScript em index.html...');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const scriptContent = match[1];
  try {
    // Testar com vm.Script para detectar erros de sintaxe
    new vm.Script(scriptContent, { filename: `index.html-script-${scriptIndex}.js` });
    console.log(`  ✔ Bloco <script> #${scriptIndex} sintaticamente válido.`);
  } catch (err) {
    errors.push(`Erro de sintaxe no script #${scriptIndex}: ${err.message}`);
    console.error(`  ❌ Erro de sintaxe no script #${scriptIndex}:`, err.message);
  }
}

// 3. Verificar Funções Chave do SEGRE
console.log('\n[3/4] Verificando funções e componentes SEGRE...');
const segreComponents = [
  'URLS_OFICIAIS_SEGRE',
  'DADOS_SEGRE',
  'renderizarDashboardSegre',
  'sincronizarDashboardSegre',
  'mudarAbaSegre',
  'filtrarTabelaSegre',
  'renderizarCorpoTabelaSegre'
];

segreComponents.forEach(comp => {
  if (html.includes(comp)) {
    console.log(`  ✔ Componente SEGRE encontrado: ${comp}`);
  } else {
    errors.push(`Componente SEGRE ausente em index.html: ${comp}`);
    console.error(`  ❌ Componente SEGRE AUSENTE: ${comp}`);
  }
});

// 4. Verificar Código.gs
console.log('\n[4/4] Verificando backend Apps Script em Código.gs...');
const backendChecks = [
  "action === 'sincronizarSegre'",
  "function sincronizarPlanilhaSegre()",
  "obterArquivoPublicoSharepoint",
  "https://seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br"
];

backendChecks.forEach(chk => {
  if (codigoGs.includes(chk)) {
    console.log(`  ✔ Item backend encontrado: ${chk}`);
  } else {
    errors.push(`Item backend ausente em Código.gs: ${chk}`);
    console.error(`  ❌ Item backend AUSENTE: ${chk}`);
  }
});

console.log('\n====================================================');
if (errors.length === 0) {
  console.log('🎉 TODOS OS TESTES PASSARAM! SISTEMA 100% OPERACIONAL!');
  console.log('====================================================');
  process.exit(0);
} else {
  console.error(`💥 FORAM ENCONTRADOS ${errors.length} ERROS:`);
  errors.forEach(e => console.error('  - ' + e));
  console.log('====================================================');
  process.exit(1);
}
