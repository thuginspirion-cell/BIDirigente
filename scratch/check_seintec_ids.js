const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const ids = [
  'panel-seintec-title',
  'panel-seintec-desc',
  'seintec-upload-dest-text',
  'seintec-sharepoint-calls-banner',
  'seintec-calls-kpi-bar',
  'seintec-calls-filter-buttons',
  'seintec-inventario-banner',
  'seintec-inventario-kpi-bar',
  'seintec-inventario-filter-buttons',
  'seintec-base-detail-panel'
];

ids.forEach(id => {
  console.log(id + ':', html.includes(`id="${id}"`));
});
