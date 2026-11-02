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

server.listen(9883, async () => {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9883'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9226/json');
    const targets = await listRes.json();
    const ws = new globalThis.WebSocket(targets[0].webSocketDebuggerUrl);
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
    const r = await send('Runtime.evaluate', {
      expression: `(() => {
        carregarEscolasLocalStorage();
        return listaEscolas.map(e => ({
          id: e.id,
          cie: e.cie,
          nome: e.nome,
          cidade: e.cidade,
          bairro: e.bairro
        }));
      })()`,
      returnByValue: true
    });

    fs.writeFileSync('scratch/todas_60_escolas.json', JSON.stringify(r.result.value, null, 2), 'utf8');
    console.log('Saved todas_60_escolas.json with', r.result.value.length, 'schools!');

    chromeProc.kill();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
