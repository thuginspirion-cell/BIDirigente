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

server.listen(9881, async () => {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9881'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9227/json');
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

    // Check Leaflet global
    const checkRes = await send('Runtime.evaluate', {
      expression: `(function() {
        return {
          typeOfL: typeof L,
          hasMapMethod: typeof L !== 'undefined' ? typeof L.map : 'undefined'
        };
      })()`,
      returnByValue: true
    });
    console.log('Leaflet Check:', checkRes.result.value);

    // Call inicializarOuAtualizarMapaRede directly
    const initRes = await send('Runtime.evaluate', {
      expression: `(function() {
        try {
          abrirMapaRede();
          inicializarOuAtualizarMapaRede();
          return {
            hasMap: !!mapaRedeInstancia,
            markers: marcadoresEscolasMapa.length
          };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()`,
      returnByValue: true
    });
    console.log('Direct Init Result:', initRes.result.value);

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
