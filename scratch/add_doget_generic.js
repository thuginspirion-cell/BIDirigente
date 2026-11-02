const fs = require('fs');
let code = fs.readFileSync('Código.gs', 'utf8');

const target = "action === 'sincronizarSefin') {\r\n        output = sincronizarPlanilhaSefin();";
const replacement = "action === 'sincronizarSefin') {\r\n        output = sincronizarPlanilhaSefin();\r\n      } else if (action === 'sincronizarGenerico' || action === 'obterArquivoPublico') {\r\n        output = obterArquivoPublicoSharepoint(e.parameter.url, {\r\n          nomeSetor: e.parameter.setor,\r\n          descricaoBase: e.parameter.descricao\r\n        });";

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('Código.gs', code, 'utf8');
  console.log('doGet updated successfully with generic action!');
} else {
  console.error('Target not found in doGet!');
}
