const fs = require('fs');
const html = fs.readFileSync('scratch/gas_response.html', 'utf8');

// O Google escapa o HTML em unicode/hex: \\\x22, \\r\\n, etc.
// Vamos extrair a string do payload do sandboxFrame
// Procurar onde começa o payload
const startMarker = 'init({';
const pStart = html.indexOf(startMarker);
console.log('init({ em:', pStart);

// Procurar se a string do nosso HTML foi truncada pelo Apps Script!
// Qual é o tamanho máximo de string que o HtmlService do Apps Script aceita?
// Normalmente o Apps Script trunca payloads maiores que 2MB ou 4MB!
// Vamos checar se o final do nosso index.html está presente dentro da resposta do GAS:
const lastWords = ['toggleMobileSidebar', 'mobile-sidebar-backdrop', 'fecharModalDetalheCall'];
lastWords.forEach(w => {
  console.log('Palavra final [' + w + ']:', html.indexOf(w));
});
