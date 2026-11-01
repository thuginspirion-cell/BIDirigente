const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf("'Hardware':");
if (idx !== -1) {
  console.log(html.substring(idx - 20, idx + 800));
}
