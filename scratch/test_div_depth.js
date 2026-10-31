// scratch/test_div_depth.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const r = /class="view-pane/g;
let m;
while ((m = r.exec(html)) !== null) {
  console.log(m.index, html.substring(m.index - 30, m.index + 50));
}
