const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const calls = [
  { name: 'mostrarHome', code: 'mostrarHome()' },
  { name: 'abrirMinhaGestao', code: 'abrirMinhaGestao()' },
  { name: 'abrirAgenda', code: 'abrirAgenda()' },
  { name: 'abrirCarroOficial', code: 'abrirCarroOficial()' },
  { name: 'abrirVisitas', code: 'abrirVisitas()' },
  { name: 'abrirEscolas', code: 'abrirEscolas()' },
  { name: 'abrirModalMapaVisitas', code: 'abrirModalMapaVisitas()' },
  { name: 'abrirCentro(GAB)', code: "abrirCentro('GAB')" },
  { name: 'abrirSeintec', code: 'abrirSeintec()' },
  { name: 'abrirCentro(SEAFIN)', code: "abrirCentro('SEAFIN')" },
  { name: 'abrirCentro(CGE)', code: "abrirCentro('CGE')" },
  { name: 'abrirCentro(CRH)', code: "abrirCentro('CRH')" },
  { name: 'abrirCentro(NPE)', code: "abrirCentro('NPE')" }
];

console.log("=== SIMULAÇÃO DOS GATILHOS DE CADA BOTÃO LATERAL ===");
// Verificar funções chamadas internamente por cada uma
// 1. mostrarHome -> esconderTodasAsPanes, document.getElementById('pane-home'), document.getElementById('side-btn-home'), atualizarBreadcrumbTopo, rolarAoTopoSuave
// 2. abrirMinhaGestao -> renderizarMinhaGestao, sincronizarCardsBasesSeintec, carregarGoogleCalendar, rolarAoTopoSuave
// 3. abrirAgenda -> renderizarAgenda, carregarGoogleCalendar, rolarAoTopoSuave
// 4. abrirCarroOficial -> renderizarCarroOficial, atualizarMetricasSuperioresSeintec, rolarAoTopoSuave
// 5. abrirVisitas -> carregarEscolasLocalStorage, carregarVisitasLocalStorage, atualizarPainelVisitas, rolarAoTopoSuave
// 6. abrirEscolas -> carregarEscolasLocalStorage, filtrarEscolas
// 7. abrirModalMapaVisitas -> carregarEscolasLocalStorage, carregarVisitasLocalStorage
// 8. abrirCentro('GAB') -> abrirAssessoriaTecnica -> selecionarBaseGabinete('TermosVisita')
// 9. abrirSeintec -> selecionarBaseSeintec('Hardware'), atualizarMetricasSuperioresSeintec, sincronizarCardsBasesSeintec
// 10. abrirCentro('SEAFIN') -> ESTRUTURA_ORGANIZACIONAL['SEAFIN']
// 11. abrirCentro('CGE') -> ESTRUTURA_ORGANIZACIONAL['CGE']
// 12. abrirCentro('CRH') -> ESTRUTURA_ORGANIZACIONAL['CRH']
// 13. abrirCentro('NPE') -> ESTRUTURA_ORGANIZACIONAL['NPE']

const fnsToCheck = [
  'esconderTodasAsPanes', 'atualizarBreadcrumbTopo', 'rolarAoTopoSuave',
  'renderizarMinhaGestao', 'sincronizarCardsBasesSeintec', 'carregarGoogleCalendar',
  'renderizarAgenda', 'renderizarCarroOficial', 'atualizarMetricasSuperioresSeintec',
  'carregarEscolasLocalStorage', 'carregarVisitasLocalStorage', 'atualizarPainelVisitas',
  'filtrarEscolas', 'selecionarBaseGabinete', 'selecionarBaseSeintec'
];

fnsToCheck.forEach(fn => {
  const exists = html.includes(`function ${fn}`);
  console.log(`Função interna ${fn}: ${exists ? 'OK' : 'FALTANDO!'}`);
});
