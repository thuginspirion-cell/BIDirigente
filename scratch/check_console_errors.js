const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('index.html', 'utf8'));
}).listen(9896, async () => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9239',
    'http://localhost:9896'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await (await fetch('http://localhost:9239/json')).json();
  const ws = new globalThis.WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id === 10) {
      console.log('typeof window.abrirMapaRede:', data.result);
      chrome.kill();
      server.close();
      process.exit(0);
    }
  };

  setTimeout(() => {
    ws.send(JSON.stringify({
      id: 10,
      method: 'Runtime.evaluate',
      params: { expression: 'typeof window.abrirMapaRede', returnByValue: true }
    }));
  }, 1000);
});
