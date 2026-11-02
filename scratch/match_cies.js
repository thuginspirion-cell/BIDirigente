const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const startPadrao = content.indexOf('const BASE_ESCOLAS_PADRAO = [');
const endPadrao = content.indexOf('];\n', startPadrao) + 2;

const startCoords = content.indexOf('const COORDENADAS_REDE_ESCOLAS = {');
const endCoords = content.indexOf('};', startCoords) + 2;

const vm = require('vm');
const ctx = {};
vm.runInNewContext(content.slice(startPadrao, endPadrao) + '\n' + content.slice(startCoords, endCoords), ctx);

console.log('BASE_ESCOLAS_PADRAO length:', ctx.BASE_ESCOLAS_PADRAO.length);
console.log('COORDENADAS_REDE_ESCOLAS keys:', Object.keys(ctx.COORDENADAS_REDE_ESCOLAS).length);

const matched = [];
const unmatched = [];
ctx.BASE_ESCOLAS_PADRAO.forEach(e => {
  const c = ctx.COORDENADAS_REDE_ESCOLAS[e.cie];
  if (c) {
    matched.push(e.cie);
  } else {
    unmatched.push({ id: e.id, nome: e.nome, cie: e.cie, cidade: e.cidade });
  }
});

console.log('Matched count:', matched.length);
console.log('Unmatched count:', unmatched.length);
if (unmatched.length > 0) {
  console.log('Unmatched schools:', unmatched);
}
