// scratch/check_panes_css.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const r = /([a-zA-Z0-9_#.-]+)\s*\{[^}]*margin:\s*0\s+auto[^}]*\}/g;
let m;
while ((m = r.exec(html)) !== null) {
  console.log(m[1]);
}
