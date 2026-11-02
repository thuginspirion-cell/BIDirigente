const fs = require('fs');
let code = fs.readFileSync('scratch/atualizar_mapa_google_hibrido.js', 'utf8');
code = code.replace("onmouseleave=\"this.style.background=\\'#f8fafc\\'\">\\' +", "onmouseleave=\"this.style.background=\\'#f8fafc\\'\">' +");
fs.writeFileSync('scratch/atualizar_mapa_google_hibrido.js', code, 'utf8');
console.log('Fixed scratch/atualizar_mapa_google_hibrido.js successfully');
