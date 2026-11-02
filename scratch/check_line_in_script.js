const fs = require('fs');
const content = fs.readFileSync('scratch/atualizar_mapa_google_hibrido.js', 'utf8');
const lines = content.split('\n');
for (let i = 418; i <= 425; i++) {
  console.log(i, JSON.stringify(lines[i]));
}
