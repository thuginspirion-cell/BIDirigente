const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = 'function abrirSeintec() {\r\n      setTimeout(atualizarMetricasSuperioresSeintec, 50); setTimeout(sincronizarCardsBasesSeintec, 60);';
const targetLf = 'function abrirSeintec() {\n      setTimeout(atualizarMetricasSuperioresSeintec, 50); setTimeout(sincronizarCardsBasesSeintec, 60);';

const replacement = 'function abrirSeintec() {\r\n      try { atualizarMetricasSuperioresSeintec(); } catch(e){}\r\n      try { sincronizarCardsBasesSeintec(); } catch(e){}\r\n      setTimeout(atualizarMetricasSuperioresSeintec, 50);\r\n      setTimeout(sincronizarCardsBasesSeintec, 60);';

if (html.includes(target)) {
  html = html.replace(target, replacement);
  console.log('Replaced with CRLF');
} else if (html.includes(targetLf)) {
  html = html.replace(targetLf, replacement.replace(/\r\n/g, '\n'));
  console.log('Replaced with LF');
} else {
  console.warn('Target not found directly!');
}

fs.writeFileSync('index.html', html, 'utf8');
