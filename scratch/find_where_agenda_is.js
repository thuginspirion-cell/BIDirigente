// scratch/find_where_agenda_is.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pAgenda = html.indexOf('id="pane-agenda"');
console.log('pAgenda:', pAgenda);

// Olhar as tags pai de pane-agenda
// Vamos escanear para trás até achar onde foi aberta e fechada as tags
let pos = pAgenda;
let snippet = html.substring(pAgenda - 1000, pAgenda + 200);
console.log('Snippet before pane-agenda:');
console.log(snippet);
