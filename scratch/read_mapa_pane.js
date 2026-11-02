const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<div id="pane-mapas"');
const endMarker = '<!-- FIM DO PANE MAPAS -->';
let end = content.indexOf(endMarker);
if (end === -1) {
  end = content.indexOf('<!-- PANE GABINETE -->');
}
console.log('Start:', start, 'End:', end);
console.log(content.slice(start, start + 600));
