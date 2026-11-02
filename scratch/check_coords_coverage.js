const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Extract listaEscolas from index.html
const listaEscolasMatch = content.match(/const listaEscolas = (\[[\s\S]*?\]);/);
const coordenadasMatch = content.match(/const COORDENADAS_REDE_ESCOLAS = ({[\s\S]*?});/);

const vm = require('vm');
const sandbox = {};
vm.runInNewContext('var listaEscolas = ' + listaEscolasMatch[1] + '; var COORDENADAS_REDE_ESCOLAS = ' + coordenadasMatch[1] + ';', sandbox);

console.log('Total escolas in listaEscolas:', sandbox.listaEscolas.length);
console.log('Total coords in COORDENADAS_REDE_ESCOLAS:', Object.keys(sandbox.COORDENADAS_REDE_ESCOLAS).length);

const missing = [];
sandbox.listaEscolas.forEach(e => {
  const c = sandbox.COORDENADAS_REDE_ESCOLAS[e.cie];
  if (!c) {
    missing.push({ id: e.id, nome: e.nome, cie: e.cie, cidade: e.cidade });
  }
});
console.log('Missing coords count:', missing.length);
if (missing.length > 0) {
  console.log('Sample missing:', missing.slice(0, 10));
}
