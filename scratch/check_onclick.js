const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('index.html', 'utf8'));
}).listen(9894, async () => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9237',
    'http://localhost:9894'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const list = await (await fetch('http://localhost:9237/json')).json();
  const ws = new globalThis.WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1000));

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        (() => {
          abrirMapaRede();
          inicializarOuAtualizarMapaRede();
          const card = document.getElementById('mapa-lista-escolas-container').firstElementChild;
          return {
            outer: card ? card.outerHTML.slice(0, 300) : null,
            onclickAttr: card ? card.getAttribute('onclick') : null
          };
        })()
      `,
      returnByValue: true
    }
  }));

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id === 1) {
      console.log('Result Full:', JSON.stringify(data, null, 2));
      chrome.kill();
      server.close();
      process.exit(0);
    }
  };
});
