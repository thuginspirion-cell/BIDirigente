// scratch/validate_buttons.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const requiredIds = [
  'side-btn-home',
  'side-btn-gestao',
  'side-btn-agenda',
  'side-btn-carro',
  'side-btn-visitas',
  'side-btn-escolas',
  'side-btn-GAB',
  'side-btn-SEINTEC',
  'side-btn-CAF',
  'side-btn-CGE',
  'side-btn-CRH',
  'side-btn-NPE'
];

let allOk = true;
requiredIds.forEach(id => {
  const found = html.includes('id="' + id + '"') || html.includes("id='" + id + "'");
  if (!found) {
    console.error('ERRO: Botao nao encontrado:', id);
    allOk = false;
  }
});

if (allOk) {
  console.log('✓ REGRA 3 VALIDADA: Todos os 12 botoes estao intactos no DOM!');
} else {
  process.exit(1);
}
