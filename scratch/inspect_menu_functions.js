const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const functionsToInspect = [
  'mostrarHome',
  'abrirMinhaGestao',
  'abrirAgenda',
  'abrirCarroOficial',
  'abrirVisitas',
  'abrirEscolas',
  'abrirCentro',
  'abrirSeintec'
];

functionsToInspect.forEach(fn => {
  const startIdx = html.indexOf(`function ${fn}(`);
  if (startIdx !== -1) {
    console.log(`\n================ FUNCTION ${fn} ================`);
    console.log(html.substring(startIdx, startIdx + 800));
  } else {
    console.log(`Função ${fn} NÃO encontrada com syntax 'function ${fn}('!`);
  }
});
