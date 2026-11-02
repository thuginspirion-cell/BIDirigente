const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('index.html', 'utf8'));
}).listen(9901, async () => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9244',
    'http://localhost:9901'
  ]);
  await new Promise(r => setTimeout(r, 3000));
  const list = await (await fetch('http://localhost:9244/json')).json();
  const ws = new globalThis.WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 2000));

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        (() => {
          try {
            abrirMapaRede();
            inicializarOuAtualizarMapaRede();
            return {
              listaEscolasLen: listaEscolas.length,
              markersLen: marcadoresEscolasMapa.length,
              coordsKeysLen: Object.keys(COORDENADAS_REDE_ESCOLAS).length,
              sampleEscolas: listaEscolas.slice(0, 3).map(e => ({ cie: e.cie, hasCoord: !!COORDENADAS_REDE_ESCOLAS[e.cie] }))
            };
          } catch(e) {
            return { error: e.message, stack: e.stack };
          }
        })()
      `,
      returnByValue: true
    }
  }));

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id === 1) {
      console.log('Debug result:', JSON.stringify(data.result, null, 2));
      chrome.kill();
      server.close();
      process.exit(0);
    }
  };
});
