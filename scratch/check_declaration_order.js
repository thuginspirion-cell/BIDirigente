const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const calls = [
  { name: 'Home', fn: 'mostrarHome', code: 'mostrarHome()' },
  { name: 'Minha Gestão', fn: 'abrirMinhaGestao', code: 'abrirMinhaGestao()' },
  { name: 'Agenda', fn: 'abrirAgenda', code: 'abrirAgenda()' },
  { name: 'Carro Oficial', fn: 'abrirCarroOficial', code: 'abrirCarroOficial()' },
  { name: 'Visitas', fn: 'abrirVisitas', code: 'abrirVisitas()' },
  { name: 'Escolas', fn: 'abrirEscolas', code: 'abrirEscolas()' },
  { name: 'Gabinete (ASURE)', fn: 'abrirCentro', code: "abrirCentro('GAB')" },
  { name: 'SEINTEC', fn: 'abrirSeintec', code: 'abrirSeintec()' },
  { name: 'SEAFIN', fn: 'abrirCentro', code: "abrirCentro('SEAFIN')" },
  { name: 'SEGRE (CGE)', fn: 'abrirCentro', code: "abrirCentro('CGE')" },
  { name: 'SEPES (CRH)', fn: 'abrirCentro', code: "abrirCentro('CRH')" },
  { name: 'EEC (NPE)', fn: 'abrirCentro', code: "abrirCentro('NPE')" }
];

// Onde estão declaradas as funções e onde está a sidebar?
const sidebarIdx = html.indexOf('<aside class="sidebar"');
console.log(`Posição da Sidebar no HTML: caractere ${sidebarIdx}`);

calls.forEach(c => {
  const fnDeclIdx = html.indexOf(`function ${c.fn}`);
  console.log(`Função ${c.fn} declarada na posição ${fnDeclIdx} (${fnDeclIdx < sidebarIdx ? 'ANTES da sidebar' : 'DEPOIS da sidebar'})`);
});
