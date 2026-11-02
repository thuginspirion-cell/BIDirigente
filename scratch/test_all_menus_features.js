const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== TESTE DOS 12+ MENUS LATERAIS (RULE 3) ===');
const buttons = [
  'side-btn-home', 'side-btn-gestao', 'side-btn-agenda', 'side-btn-carro',
  'side-btn-visitas', 'side-btn-escolas', 'side-btn-mapa', 'side-btn-GAB', 'side-btn-SEINTEC',
  'side-btn-CAF', 'side-btn-CGE', 'side-btn-CRH', 'side-btn-NPE'
];

let allOk = true;
buttons.forEach(btnId => {
  const exists = html.includes(`id="${btnId}"`);
  console.log(`- ${btnId}: ${exists ? 'OK' : 'FALTANDO!'}`);
  if (!exists) allOk = false;
});

console.log('\n=== TESTE DE PAINÉIS DE DESTINO (PANES) ===');
const panes = [
  'pane-home', 'pane-gestao-hoje', 'pane-agenda', 'pane-carro',
  'pane-visitas', 'pane-escolas', 'pane-mapas', 'pane-gabinete', 'pane-seintec',
  'pane-centro'
];
panes.forEach(paneId => {
  const exists = html.includes(`id="${paneId}"`);
  console.log(`- ${paneId}: ${exists ? 'OK' : 'FALTANDO!'}`);
  if (!exists) allOk = false;
});

console.log('\n=== TESTE DE FUNÇÕES DE INTERATIVIDADE NO ESCOPO GLOBAL / WINDOW ===');
const globalFunctions = [
  'mostrarHome',
  'abrirMinhaGestao',
  'abrirAgenda',
  'abrirCarroOficial',
  'abrirVisitas',
  'abrirEscolas',
  'abrirMapaRede',
  'abrirSeintec',
  'abrirCentro',
  'abrirAssessoriaTecnica',
  'sincronizarSharepointCalls',
  'sincronizarInventarioSharepoint',
  'alternarAbaSeintec',
  'sincronizarTudo'
];

globalFunctions.forEach(fn => {
  const hasFn = html.includes(`function ${fn}`) || html.includes(`window.${fn}`);
  console.log(`- ${fn}: ${hasFn ? 'OK' : 'FALTANDO!'}`);
  if (!hasFn) allOk = false;
});

if (allOk) {
  console.log('\n>>> 100% DOS MENUS, PAINÉIS E FUNÇÕES VERIFICADOS COM SUCESSO! <<<');
} else {
  console.log('\n>>> ATENCAO: FORAM DETECTADAS INCONSISTENCIAS! <<<');
}
