const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const start = content.indexOf('const BASE_ESCOLAS_PADRAO = [');
const end = content.indexOf('];', start);
const jsonStr = content.substring(start + 'const BASE_ESCOLAS_PADRAO = '.length, end + 1);
const escolas = eval(jsonStr);

console.log('Total de escolas:', escolas.length);
escolas.forEach((e, idx) => {
  console.log(`${idx + 1}. [${e.cie}] ${e.nome} (${e.cidade}) -> ${e.bairro}`);
});
