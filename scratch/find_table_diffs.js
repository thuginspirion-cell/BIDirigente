// scratch/find_table_diffs.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Comparar as margens e wrappers de tabelas em Escolas e Núcleo
const p1 = html.indexOf('id="escolas-main-table"');
console.log('--- ESCOLAS TABLE WRAPPER ---');
console.log(html.substring(p1 - 300, p1 + 100));

const p2 = html.indexOf('id="panel-seintec-table"');
console.log('--- SEINTEC TABLE WRAPPER ---');
console.log(html.substring(p2 - 300, p2 + 100));

const p3 = html.indexOf('id="tabela-repasses-sefin"');
console.log('--- SEFIN TABLE WRAPPER ---');
console.log(html.substring(p3 - 300, p3 + 100));
