const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const server = http.createServer((q, s) => {
  s.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream('index.html').pipe(s);
}).listen(9881, async () => {
  const cp = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    'http://localhost:9881'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const targets = await (await fetch('http://localhost:9223/json')).json();
  const ws = new globalThis.WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        abrirMapaRede();
        inicializarOuAtualizarMapaRede();
        ({
          markers: marcadoresEscolasMapa.length,
          cards: document.querySelectorAll('#mapa-lista-escolas-container > div').length,
          status: document.getElementById('mapa-status-exibicao').innerText
        })
      `,
      returnByValue: true
    }
  }));

  ws.onmessage = (e) => {
    console.log('RAW CDP RESPONSE:', e.data);
    cp.kill();
    server.close();
    process.exit(0);
  };
});
