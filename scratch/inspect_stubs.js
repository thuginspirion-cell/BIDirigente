const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s1Start = html.indexOf('<script>');
const s1End = html.indexOf('</script>', s1Start);
const s1 = html.substring(s1Start, s1End);

const p1 = s1.indexOf('window.__navQueue = [];');
const p2 = s1.indexOf('window.addEventListener("error"', p1);
console.log('=== Stubs em s1 ===');
console.log(s1.substring(p1, p2));

const s2Start = html.indexOf('<script>', s1End);
const s2End = html.indexOf('</script>', s2Start);
const s2 = html.substring(s2Start, s2End);

const p3 = s2.indexOf('/* MARCAÇÃO DE FUNÇÕES REAIS');
console.log('=== Marcação em s2 ===');
console.log(s2.substring(p3, p3 + 1200));
