const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const buttons = [
  { id: 'side-btn-home', fn: 'mostrarHome()' },
  { id: 'side-btn-gestao', fn: 'abrirMinhaGestao()' },
  { id: 'side-btn-agenda', fn: 'abrirAgenda()' },
  { id: 'side-btn-carro', fn: 'abrirCarroOficial()' },
  { id: 'side-btn-visitas', fn: 'abrirVisitas()' },
  { id: 'side-btn-escolas', fn: 'abrirEscolas()' },
  { id: 'side-btn-GAB', fn: "abrirCentro('GAB')" },
  { id: 'side-btn-SEINTEC', fn: 'abrirSeintec()' },
  { id: 'side-btn-CAF', fn: "abrirCentro('SEAFIN')" },
  { id: 'side-btn-CGE', fn: "abrirCentro('CGE')" },
  { id: 'side-btn-CRH', fn: "abrirCentro('CRH')" },
  { id: 'side-btn-NPE', fn: "abrirCentro('NPE')" }
];

// Vamos testar se todos os IDs de elementos acessados por essas funções existem no HTML
const checkedElements = [
  'pane-home', 'pane-gestao-hoje', 'pane-agenda', 'pane-carro', 'pane-visitas',
  'pane-escolas', 'pane-gabinete', 'pane-seintec', 'pane-centro',
  'banner-centro-badge', 'banner-centro-nome', 'banner-centro-desc',
  'atual-centro-sigla', 'container-setores-tabs'
];

checkedElements.forEach(id => {
  const exists = html.includes(`id="${id}"`);
  console.log(`Elemento DOM id="${id}": ${exists ? 'ENCONTRADO' : 'NÃO EXISTE NO DOM!'}`);
});
