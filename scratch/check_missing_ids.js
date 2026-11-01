const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s1Start = html.indexOf('<script>');
const s1End = html.indexOf('</script>', s1Start);
const s1 = html.substring(s1Start, s1End);

const matches = [];
const regex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let m;
while ((m = regex.exec(s1)) !== null) {
  matches.push(m[1]);
}
console.log('Total de getElementById em s1:', matches.length);

const unique = [...new Set(matches)];
const missing = unique.filter(id => !html.includes('id="' + id + '"'));
console.log('IDs que NÃO existem no HTML (' + missing.length + '):', missing);
