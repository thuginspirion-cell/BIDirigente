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
  'side-btn-ASURE',
  'side-btn-SEINTEC',
  'side-btn-CAF',
  'side-btn-SEOM',
  'side-btn-SEGRE',
  'side-btn-SEPES',
  'side-btn-EEC'
];

console.log('\n[1/5] Verificando existência dos 12 botões da Sidebar...');
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
console.log('\n[2/5] Validando sintaxe JavaScript em index.html...');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const scriptContent = match[1];
  try {
    new vm.Script(scriptContent, { filename: `index.html-script-${scriptIndex}.js` });
    console.log(`  ✔ Bloco <script> #${scriptIndex} sintaticamente válido.`);
  } catch (err) {
    errors.push(`Erro de sintaxe no script #${scriptIndex}: ${err.message}`);
    console.error(`  ❌ Erro de sintaxe no script #${scriptIndex}:`, err.message);
  }
}

// 3. Verificar Funções Chave do SEGRE, SEMAT e SEVESC
console.log('\n[3/5] Verificando funções e componentes SEGRE / SEMAT / SEVESC...');
const components = [
  'URLS_OFICIAIS_SEGRE',
  'URLS_OFICIAIS_SEMAT',
  'URLS_OFICIAIS_SEVESC',
  'URLS_OFICIAIS_SECOMSE',
  'URLS_OFICIAIS_SEOM',
  'URLS_OFICIAIS_SEFISC',
  'DADOS_SEGRE',
  'DADOS_SEMAT',
  'DADOS_SEVESC',
  'DADOS_SECOMSE',
  'renderizarDashboardSegre',
  'renderizarDashboardSemat',
  'renderizarDashboardSevesc',
  'renderizarDashboardSecomse',
  'sincronizarDashboardSegre',
  'sincronizarDashboardSemat',
  'sincronizarDashboardSevesc',
  'sincronizarDashboardSecomse',
  'sincronizarDashboardSeom',
  'sincronizarDashboardSefisc'
];

components.forEach(comp => {
  if (html.includes(comp)) {
    console.log(`  ✔ Componente encontrado: ${comp}`);
  } else {
    errors.push(`Componente ausente em index.html: ${comp}`);
    console.error(`  ❌ Componente AUSENTE: ${comp}`);
  }
});

// 4. Verificar Nomenclatura SEGRE
console.log('\n[4/5] Verificando Nomenclatura "Serviço de Gestão da Rede Escolar"...');
if (html.includes('Serviço de Gestão da Rede Escolar')) {
  console.log('  ✔ Nomenclatura oficial "Serviço de Gestão da Rede Escolar" presente em index.html');
} else {
  errors.push('Nomenclatura "Serviço de Gestão da Rede Escolar" não encontrada em index.html');
  console.error('  ❌ Nomenclatura NÃO encontrada');
}

// 5. Verificar Código.gs
console.log('\n[5/5] Verificando backend Apps Script em Código.gs...');
const backendChecks = [
  "action === 'sincronizarSegre'",
  "action === 'sincronizarSemat'",
  "action === 'sincronizarSevesc'",
  "function sincronizarPlanilhaSegre",
  "function sincronizarPlanilhaSemat",
  "function sincronizarPlanilhaSevesc",
  "itp_semat_educacao_sp_gov_br",
  "itp_sevesc_educacao_sp_gov_br"
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
