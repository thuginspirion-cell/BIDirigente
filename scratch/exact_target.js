const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('inventario_consolidado.json');
console.log(JSON.stringify(html.substring(idx - 100, idx + 200)));
