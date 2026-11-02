const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('/* ========================================================\n       MÓDULO: MAPA TERRITORIAL DA REDE');
const end = content.indexOf('/* ========================================================\n       ROTEADOR MASTER DE NAVEGAÇÃO');
console.log('JS start:', start, 'JS end:', end);
console.log(content.slice(start, start + 300));
