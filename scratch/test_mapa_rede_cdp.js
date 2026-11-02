const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.join(__dirname, '..', 'index.html');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(htmlPath).pipe(res);
});

server.listen(9882, async () => {
  console.log('Test server started on 9882');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9882'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9228/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const onMsg = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === id) {
            ws.removeEventListener('message', onMsg);
            resolve(resp.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');

    console.log('Testing abrirMapaRede()...');
    await send('Runtime.evaluate', {
      expression: 'abrirMapaRede(); inicializarOuAtualizarMapaRede();'
    });
    await new Promise(r => setTimeout(r, 300));

    // Test Jandira
    const jandiraRes = await send('Runtime.evaluate', {
      expression: `(function() {
        filtrarMapaPorMunicipio('Jandira', document.getElementById('map-pill-jandira'));
        return { markers: marcadoresEscolasMapa.length, status: document.getElementById('mapa-status-exibicao').innerText };
      })()`,
      returnByValue: true
    });
    console.log('Jandira:', jandiraRes.result.value);

    // Test Pirapora
    const piraporaRes = await send('Runtime.evaluate', {
      expression: `(function() {
        filtrarMapaPorMunicipio('Pirapora', document.getElementById('map-pill-pirapora'));
        return { markers: marcadoresEscolasMapa.length, status: document.getElementById('mapa-status-exibicao').innerText };
      })()`,
      returnByValue: true
    });
    console.log('Pirapora:', piraporaRes.result.value);

    // Test Visitadas
    const visitadasRes = await send('Runtime.evaluate', {
      expression: `(function() {
        resetarVisualizacaoMapaRede();
        filtrarMapaPorVisita('visitadas', document.getElementById('map-pill-visitadas'));
        return { markers: marcadoresEscolasMapa.length, status: document.getElementById('mapa-status-exibicao').innerText };
      })()`,
      returnByValue: true
    });
    console.log('Visitadas:', visitadasRes.result.value);

    // Test Search input
    const searchRes = await send('Runtime.evaluate', {
      expression: `(function() {
        buscarNoMapaRede('Ivani');
        return { markers: marcadoresEscolasMapa.length, status: document.getElementById('mapa-status-exibicao').innerText };
      })()`,
      returnByValue: true
    });
    console.log('Search "Ivani":', searchRes.result.value);

    ws.close();
  } catch (err) {
    console.error('CDP test error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
