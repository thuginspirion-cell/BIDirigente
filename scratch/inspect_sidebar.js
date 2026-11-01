const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('<aside class="sidebar"');
const endIdx = html.indexOf('</aside>', startIdx);

console.log(html.substring(startIdx, endIdx + 8));
