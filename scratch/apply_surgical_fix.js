const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

// 1. Proteger atualizarMetricasSuperioresSeintec no abrirCarroOficial
const oldCarroCall = 'atualizarMetricasSuperioresSeintec();';
const safeCarroCall = 'try { if (typeof atualizarMetricasSuperioresSeintec === "function") atualizarMetricasSuperioresSeintec(); } catch(e) {}';

if (html.includes(oldCarroCall)) {
  html = html.replace(oldCarroCall, safeCarroCall);
  console.log("atualizarMetricasSuperioresSeintec protegido com sucesso!");
}

// 2. Adicionar stubs no topo para abrirMinhaGestao, abrirAgenda e abrirCarroOficial
const marker = 'if (!window.mostrarHome) {';
const markerIdx = html.indexOf(marker);

if (markerIdx === -1) {
  console.error("marker não encontrado!");
  process.exit(1);
}

const extraStubs = [
  '    if (!window.abrirMinhaGestao) {',
  '      window.abrirMinhaGestao = function() { executarOuEnfileirar("abrirMinhaGestao", arguments); };',
  '    }',
  '    if (!window.abrirAgenda) {',
  '      window.abrirAgenda = function() { executarOuEnfileirar("abrirAgenda", arguments); };',
  '    }',
  '    if (!window.abrirCarroOficial) {',
  '      window.abrirCarroOficial = function() { executarOuEnfileirar("abrirCarroOficial", arguments); };',
  '    }',
  ''
].join(nl);

if (!html.includes('if (!window.abrirMinhaGestao)')) {
  html = html.substring(0, markerIdx) + extraStubs + html.substring(markerIdx);
  console.log("Stubs de gestão, agenda e carro adicionados no topo!");
}

// 3. Onde abrirMinhaGestao, abrirAgenda e abrirCarroOficial são declaradas no s1, marcar com __isReal
html = html.replace(
  'function abrirMinhaGestao(dataOpcional) {',
  'function abrirMinhaGestao(dataOpcional) {\n      abrirMinhaGestao.__isReal = true; window.abrirMinhaGestao = abrirMinhaGestao;'
);

html = html.replace(
  'function abrirAgenda(dataOpcional) {',
  'function abrirAgenda(dataOpcional) {\n      abrirAgenda.__isReal = true; window.abrirAgenda = abrirAgenda;'
);

html = html.replace(
  'function abrirCarroOficial(dataOpcional, tabOpcional) {',
  'function abrirCarroOficial(dataOpcional, tabOpcional) {\n  abrirCarroOficial.__isReal = true; window.abrirCarroOficial = abrirCarroOficial;'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Proteções salvas em index.html com sucesso!");
