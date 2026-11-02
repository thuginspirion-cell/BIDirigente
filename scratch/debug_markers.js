const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('index.html', 'utf8'));
}).listen(9899, async () => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9242',
    'http://localhost:9899'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await (await fetch('http://localhost:9242/json')).json();
  const ws = new globalThis.WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        (() => {
          abrirMapaRede();
          inicializarOuAtualizarMapaRede();
          return {
            listaEscolasLen: listaEscolas.length,
            markersLen: marcadoresEscolasMapa.length,
            coordsKeysLen: Object.keys(COORDENADAS_REDE_ESCOLAS).length,
            filtroMunicipio: filtroMapaMunicipioAtivo,
            filtroVisita: filtroMapaVisitaAtivo
          };
        })()
      `,
      returnByValue: true
    }
  }));

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id === 1) {
      console.log('Debug result:', data.result.result.value);
      chrome.kill();
      server.close();
      process.exit(0);
    }
  };
});
