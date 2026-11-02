const fs = require('fs');
let code = fs.readFileSync('scratch/atualizar_mapa_google_hibrido.js', 'utf8');
const lines = code.split('\n');
lines[421] = "            return '<div onclick=\"focarEscolaNoMapaPorCie(\\\\' + e.cie + \\\\')\" style=\"background: #f8fafc; border: 1px solid #e2e8f0; border-left: ' + borderLeft + '; border-radius: 8px; padding: 7px 9px; cursor: pointer; transition: all 0.15s ease;\" onmouseenter=\"this.style.background=\\\\'#f1f5f9\\\\'\" onmouseleave=\"this.style.background=\\\\'#f8fafc\\\\'\">' +";
fs.writeFileSync('scratch/atualizar_mapa_google_hibrido.js', lines.join('\n'), 'utf8');
console.log('Updated line 421 with 4 backslashes');
