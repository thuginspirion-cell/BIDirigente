const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

// Localizar o guardião GS no Script 2
const marker = '/* GS RESILIENCE GUARD */';
const markerIdx = html.indexOf(marker);

if (markerIdx === -1) {
  console.error("Marker GS RESILIENCE GUARD não encontrado!");
  process.exit(1);
}

const stubsCode = [
  '    /* ========================================================',
  '       ROUTER RESILIENTE & EARLY GLOBAL STUBS PARA TODOS OS MENUS',
  '       Garante que nenhum clique de menu falhe no GS mesmo antes',
  '       do carregamento de scripts subsequentes ou bases massivas.',
  '       ======================================================== */',
  '    window.__navQueue = [];',
  '',
  '    function executarOuEnfileirar(fnName, args) {',
  '      if (typeof window[fnName] === "function" && window[fnName].__isReal) {',
  '        return window[fnName].apply(null, args);',
  '      }',
  '      console.log("Enfileirando navegação para:", fnName, args);',
  '      window.__navQueue.push({ fnName: fnName, args: args });',
  '    }',
  '',
  '    if (!window.mostrarHome) {',
  '      window.mostrarHome = function() { executarOuEnfileirar("mostrarHome", arguments); };',
  '    }',
  '    if (!window.abrirVisitas) {',
  '      window.abrirVisitas = function() { executarOuEnfileirar("abrirVisitas", arguments); };',
  '    }',
  '    if (!window.abrirEscolas) {',
  '      window.abrirEscolas = function() { executarOuEnfileirar("abrirEscolas", arguments); };',
  '    }',
  '    if (!window.abrirCentro) {',
  '      window.abrirCentro = function() { executarOuEnfileirar("abrirCentro", arguments); };',
  '    }',
  '    if (!window.abrirSeintec) {',
  '      window.abrirSeintec = function() { executarOuEnfileirar("abrirSeintec", arguments); };',
  '    }',
  '    if (!window.abrirAssessoriaTecnica) {',
  '      window.abrirAssessoriaTecnica = function() { executarOuEnfileirar("abrirAssessoriaTecnica", arguments); };',
  '    }',
  '    if (!window.abrirModalMapaVisitas) {',
  '      window.abrirModalMapaVisitas = function() { executarOuEnfileirar("abrirModalMapaVisitas", arguments); };',
  '    }',
  ''
].join(nl);

// Inserir logo após o marker
const insertPos = html.indexOf(marker) + marker.length;
html = html.substring(0, insertPos) + nl + stubsCode + html.substring(insertPos);

// Agora, no final do Script 3 (ou onde mostrarHome, abrirCentro, etc são definidas),
// marcar as funções com .__isReal = true e processar a fila window.__navQueue
const queueProcessor = [
  '',
  '    /* MARCAÇÃO DE FUNÇÕES REAIS E DRENAGEM DA FILA DE NAVEGAÇÃO */',
  '    if (typeof mostrarHome === "function") { mostrarHome.__isReal = true; window.mostrarHome = mostrarHome; }',
  '    if (typeof abrirVisitas === "function") { abrirVisitas.__isReal = true; window.abrirVisitas = abrirVisitas; }',
  '    if (typeof abrirEscolas === "function") { abrirEscolas.__isReal = true; window.abrirEscolas = abrirEscolas; }',
  '    if (typeof abrirCentro === "function") { abrirCentro.__isReal = true; window.abrirCentro = abrirCentro; }',
  '    if (typeof abrirSeintec === "function") { abrirSeintec.__isReal = true; window.abrirSeintec = abrirSeintec; }',
  '    if (typeof abrirAssessoriaTecnica === "function") { abrirAssessoriaTecnica.__isReal = true; window.abrirAssessoriaTecnica = abrirAssessoriaTecnica; }',
  '    if (typeof abrirModalMapaVisitas === "function") { abrirModalMapaVisitas.__isReal = true; window.abrirModalMapaVisitas = abrirModalMapaVisitas; }',
  '    if (typeof abrirMinhaGestao === "function") { abrirMinhaGestao.__isReal = true; window.abrirMinhaGestao = abrirMinhaGestao; }',
  '    if (typeof abrirAgenda === "function") { abrirAgenda.__isReal = true; window.abrirAgenda = abrirAgenda; }',
  '    if (typeof abrirCarroOficial === "function") { abrirCarroOficial.__isReal = true; window.abrirCarroOficial = abrirCarroOficial; }',
  '',
  '    if (window.__navQueue && window.__navQueue.length > 0) {',
  '      console.log("Processando fila pendente de navegação:", window.__navQueue.length);',
  '      const lastNav = window.__navQueue.pop();',
  '      window.__navQueue = [];',
  '      if (lastNav && typeof window[lastNav.fnName] === "function") {',
  '        window[lastNav.fnName].apply(null, lastNav.args);',
  '      }',
  '    }',
  ''
].join(nl);

// Encontrar o fechamento do Script 3
const s3ScriptClose = html.lastIndexOf('</script>', html.lastIndexOf('/* ========================================================'));
if (s3ScriptClose === -1) {
  console.error("Não foi possível localizar o fechamento do Script 3!");
  process.exit(1);
}

html = html.substring(0, s3ScriptClose) + queueProcessor + nl + html.substring(s3ScriptClose);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Early Global Stubs e Queue Processor aplicados com sucesso em index.html!");
