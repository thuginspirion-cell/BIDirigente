// scratch/find_differences_nucleo_gestao.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// O que há dentro de #pane-seintec?
const pSeintec = html.indexOf('id="pane-seintec"');
console.log('--- PANE SEINTEC ---');
console.log(html.substring(pSeintec, pSeintec + 700));

// O que há dentro de #pane-escolas?
const pEscolas = html.indexOf('id="pane-escolas"');
console.log('--- PANE ESCOLAS ---');
console.log(html.substring(pEscolas, pEscolas + 700));

// O que há dentro de #pane-gestao-hoje?
const pGestao = html.indexOf('id="pane-gestao-hoje"');
console.log('--- PANE GESTAO HOJE ---');
console.log(html.substring(pGestao, pGestao + 700));
