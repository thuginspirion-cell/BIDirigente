const fs = require('fs');
const html = fs.readFileSync('scratch/gas_response.html', 'utf8');

// No GAS HTML Service (modo IFRAME ou ALLOWALL):
// O Apps Script encapsula o HTML do usuário.
// Vamos verificar como os scripts do usuário foram renderizados:
console.log('Tamanho total retornado pelo GAS:', html.length);

// Procurar se nossos scripts estão presentes
const hasXlsx = html.includes('xlsx.full.min.js');
console.log('CDN SheetJS presente?', hasXlsx);

const hasResilienceGuard = html.includes('GS RESILIENCE GUARD');
console.log('Guardião de resiliência presente?', hasResilienceGuard);

const hasHorarios = html.includes('HORARIOS_EXPEDIENTE');
console.log('Script 1 presente?', hasHorarios);

const hasIdentidadeVisual = html.includes('aplicarIdentidadeVisual');
console.log('Script 2 presente?', hasIdentidadeVisual);

const hasDrawer = html.includes('CONTROLE RESPONSIVO MOBILE');
console.log('Script 3 presente?', hasDrawer);
