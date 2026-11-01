const fs = require('fs');

async function testGas() {
  const url = 'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec';
  const res = await fetch(url);
  const html = await res.text();
  console.log('Tamanho da resposta:', html.length);
  
  // Salvar resposta temporária para inspecionar
  fs.writeFileSync('scratch/gas_response.html', html, 'utf8');
  console.log('Salvo em scratch/gas_response.html');

  // Checar se contém tags da nossa página
  console.log('Contém "BI Dirigente"?', html.includes('BI Dirigente'));
  console.log('Contém "side-btn-home"?', html.includes('side-btn-home'));
  console.log('Contém "side-btn-SEINTEC"?', html.includes('side-btn-SEINTEC'));
  console.log('Contém "ScriptError"?', html.includes('ScriptError') || html.includes('script-error'));
  console.log('Contém "Exception"?', html.includes('Exception'));
}

testGas();
