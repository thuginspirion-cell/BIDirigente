const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const vm = require('vm');
const context = {};
context.window = context;
const startIdx = content.indexOf('const DICIONARIO_OFICIAL_INVENTARIO =');
const endIdx = content.indexOf('/* ========================================================', startIdx);
const scriptSnippet = content.substring(startIdx, endIdx);

try {
  vm.runInNewContext(scriptSnippet + '\nthis.dict = DICIONARIO_OFICIAL_INVENTARIO; this.tuples = INVENTARIO_COMPLETO_TUPLES;', context);
  const hw = context.tuples.hardware || [];
  console.log('Total Hardware tuples:', hw.length);

  const categories = {};
  const environments = {};
  const statuses = {};

  hw.forEach(item => {
    const amb = item[1] || 'N/A';
    const cat = item[2] || 'N/A';
    const st = item[5] || 'N/A';

    environments[amb] = (environments[amb] || 0) + 1;
    categories[cat] = (categories[cat] || 0) + 1;
    statuses[st] = (statuses[st] || 0) + 1;
  });

  console.log('Ambientes:', environments);
  console.log('Categorias:', categories);
  console.log('Status:', statuses);

  // Check specs
  const specs = {};
  hw.forEach(item => {
    const cat = item[2] || 'N/A';
    const spec = item[3] || 'N/A';
    if (!specs[cat]) specs[cat] = {};
    specs[cat][spec] = (specs[cat][spec] || 0) + 1;
  });
  console.log('Specs por Categoria:', JSON.stringify(specs, null, 2));

} catch (e) {
  console.error('Error running script:', e);
}
