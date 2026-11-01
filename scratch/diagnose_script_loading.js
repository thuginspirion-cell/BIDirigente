const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const calls = [
  { id: 'side-btn-home', title: 'Início', action: 'mostrarHome()' },
  { id: 'side-btn-gestao', title: 'Minha Gestão', action: 'abrirMinhaGestao()' },
  { id: 'side-btn-agenda', title: 'Agenda', action: 'abrirAgenda()' },
  { id: 'side-btn-carro', title: 'Carro Oficial', action: 'abrirCarroOficial()' },
  { id: 'side-btn-visitas', title: 'Visitas', action: 'abrirVisitas()' },
  { id: 'side-btn-escolas', title: 'Escolas', action: 'abrirEscolas()' },
  { id: 'side-btn-mapa', title: 'Mapa', action: 'abrirModalMapaVisitas()' },
  { id: 'side-btn-GAB', title: 'ASURE / Gabinete', action: "abrirCentro('GAB')" },
  { id: 'side-btn-SEINTEC', title: 'SEINTEC', action: 'abrirSeintec()' },
  { id: 'side-btn-CAF', title: 'SEAFIN', action: "abrirCentro('SEAFIN')" },
  { id: 'side-btn-CGE', title: 'SEGRE', action: "abrirCentro('CGE')" },
  { id: 'side-btn-CRH', title: 'SEPES', action: "abrirCentro('CRH')" },
  { id: 'side-btn-NPE', title: 'EEC', action: "abrirCentro('NPE')" }
];

console.log("=== VERIFICAÇÃO DETALHADA DE DISPONIBILIDADE NO WINDOW ===");
// No HTML, o Script 2 roda primeiro (no <head>), depois vem o HTML (com a sidebar), depois vem o Script 3 (no meio do body).
// Se o usuário clica num botão antes do Script 3 ser parseado ou se o Google Sites atrasa o download/parseamento do Script 3 (que tem 1.2MB),
// qualquer função definida no Script 3 (como mostrarHome, abrirVisitas, abrirEscolas, abrirCentro, abrirSeintec) vai dar:
// "Uncaught ReferenceError: mostrarHome is not defined" ou "abrirCentro is not defined"!!

// Vamos verificar em qual script cada função está declarada!
const s2End = html.indexOf('</script>', html.indexOf('/* GS RESILIENCE GUARD */'));
const s3Start = html.indexOf('<script>', s2End + 9);
const s3End = html.indexOf('</script>', s3Start + 8);

calls.forEach(c => {
  const fnName = c.action.split('(')[0];
  const pos = html.indexOf(`function ${fnName}`);
  let scriptNum = 'Desconhecido';
  if (pos < s2End) scriptNum = 'Script 2 (no HEAD - disponível imediatamente)';
  else if (pos > s3Start && pos < s3End) scriptNum = 'Script 3 (no MEIO DO BODY - após 1.9MB de HTML!)';
  else scriptNum = 'Fora dos scripts principais';

  console.log(`Menu [${c.title}] -> Função ${fnName}: declarada no ${scriptNum}`);
});
