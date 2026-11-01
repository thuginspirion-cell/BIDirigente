const fs = require('fs');
const html = fs.readFileSync('scratch/gas_response.html', 'utf8');

// Onde termina o conteúdo do usuário dentro do HTML do Google?
const p = html.indexOf('id="side-btn-home"');
console.log('side-btn-home em:', p);

// Procurar todas as tags <script> dentro do HTML retornado pelo Google
const scriptTags = html.match(/<script\b[^>]*>/gi) || [];
console.log('Total de tags <script> no HTML retornado:', scriptTags.length);
scriptTags.forEach((s, idx) => console.log(idx + 1, s));
