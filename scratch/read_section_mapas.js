const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<section id="pane-mapas"');
const end = content.indexOf('</section>', start);
console.log('Start:', start, 'End:', end);
console.log(content.slice(start, start + 1000));
console.log('--- END SECTION ---');
console.log(content.slice(end - 300, end + 50));
