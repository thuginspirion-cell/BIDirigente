const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const idx = content.indexOf('ESCOLAS_PADRAO');
if (idx !== -1) {
  console.log(content.slice(idx, idx + 400));
} else {
  const idx2 = content.indexOf('JSON.parse(salvo)');
  console.log(content.slice(idx2, idx2 + 600));
}
