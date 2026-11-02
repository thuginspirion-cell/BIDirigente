const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldTarget = "function processarPlanilhaSharepointBase64(base64Data, horaAtualizada) {\r\n      if (typeof XLSX === 'undefined') {\r\n        console.warn('SheetJS (XLSX) não disponível.');\r\n        return;\r\n      }\r\n      const wb = XLSX.read(base64Data, { type: 'base64' });";

const newReplacement = `function processarPlanilhaSharepointBase64(base64Data, horaAtualizada) {\r\n      if (typeof XLSX === 'undefined') {\r\n        console.warn('SheetJS (XLSX) não disponível.');\r\n        return;\r\n      }\r\n      if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('UEsDB')) {\r\n        console.warn('Fluxo de dados recebido não é um arquivo ZIP/XLSX válido. Contingência consolidada ativa.');\r\n        return;\r\n      }\r\n      let wb;\r\n      try {\r\n        wb = XLSX.read(base64Data, { type: 'base64' });\r\n      } catch (xlsxErr) {\r\n        console.warn('Erro ao decodificar XLSX remoto. Mantendo base consolidada:', xlsxErr);\r\n        return;\r\n      }`;

if (html.includes(oldTarget)) {
  html = html.replace(oldTarget, newReplacement);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated processarPlanilhaSharepointBase64!');
} else {
  console.error('Target not found!');
}
