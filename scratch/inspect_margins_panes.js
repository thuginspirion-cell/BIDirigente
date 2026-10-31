// scratch/inspect_margins_panes.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const paneSelectors = [
  '.seintec-metric-row',
  '.seintec-section-ribbon',
  '.seintec-bases-grid',
  '.gab-metric-row',
  '.gestao-header-card',
  '.gestao-kpi-grid',
  '.agenda-header',
  '.agenda-kpi-grid',
  '.carro-header-card',
  '.carro-kpi-grid',
  '.escolas-header-card',
  '.escolas-kpi-grid',
  '.escolas-table-wrapper',
  '.visitas-header-card',
  '.visitas-kpi-grid'
];

paneSelectors.forEach(sel => {
  const r = new RegExp(sel.replace('.', '\\.') + '\\s*\\{([^}]+)\\}', 'g');
  let m = r.exec(html);
  if (m) {
    const props = m[1].replace(/\s+/g, ' ').trim();
    console.log(sel, ':', props.substring(0, 120));
  } else {
    console.log(sel, ': not found');
  }
});
