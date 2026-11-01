const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s2End = html.indexOf('</script>', html.indexOf('/* GS RESILIENCE GUARD */'));
const s3Start = html.indexOf('<script>', s2End + 9);

console.log("Fim do Script 2 em:", s2End);
console.log("Início do Script 3 em:", s3Start);
console.log("Conteúdo entre eles (HTML):", s3Start - s2End, "bytes");

// Ver o que tem ao redor do Script 3
console.log("Snippet antes do Script 3:");
console.log(html.substring(s3Start - 300, s3Start + 100));
