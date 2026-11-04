const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const requiredButtons = [
  'side-btn-home',
  'side-btn-gestao',
  'side-btn-agenda',
  'side-btn-carro',
  'side-btn-visitas',
  'side-btn-escolas',
  'side-btn-ASURE',
  'side-btn-SEINTEC',
  'side-btn-CAF',
  'side-btn-SEOM',
  'side-btn-SEGRE',
  'side-btn-SEPES',
  'side-btn-EEC'
];

let allOk = true;
requiredButtons.forEach(id => {
  const hasId = html.includes('id="' + id + '"');
  console.log(id + ':', hasId ? 'OK' : 'MISSING');
  if (!hasId) allOk = false;
});

const requiredFunctions = [
  'renderizarDashboardSecomse',
  'renderizarDashboardSepat',
  'renderizarDashboardSeom',
  'renderizarDashboardSefisc',
  'renderizarDashboardFinanceiroSefin',
  'renderizarDashboardSemat',
  'renderizarDashboardSevesc',
  'renderizarDashboardSegre'
];

requiredFunctions.forEach(fn => {
  const hasFn = html.includes('function ' + fn);
  console.log('Function ' + fn + ':', hasFn ? 'OK' : 'MISSING');
  if (!hasFn) allOk = false;
});

console.log('Overall check:', allOk ? 'PASS' : 'FAIL');
process.exit(allOk ? 0 : 1);
