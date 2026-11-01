const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const buttons = [
  'side-btn-home', 'side-btn-gestao', 'side-btn-agenda', 'side-btn-carro',
  'side-btn-visitas', 'side-btn-escolas', 'side-btn-GAB', 'side-btn-SEINTEC',
  'side-btn-CAF', 'side-btn-CGE', 'side-btn-CRH', 'side-btn-NPE'
];

console.log("=== INSPEÇÃO DOS BOTÕES NO HTML ===");
buttons.forEach(id => {
  const regex = new RegExp(`<button[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/button>`, 'i');
  const match = html.match(regex);
  if (match) {
    // Extrai o onclick
    const onclickMatch = match[0].match(/onclick="([^"]*)"/);
    console.log(`Botão ${id}: onclick -> ${onclickMatch ? onclickMatch[1] : 'SEM ONCLICK!'}`);
  } else {
    console.log(`Botão ${id}: NÃO ENCONTRADO!`);
  }
});
