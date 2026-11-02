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

server.listen(9879, async () => {
  console.log('Test server started on 9879');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9879'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://localhost:9225/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);
    console.log('WebSocket connected to Chrome');

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

    console.log('Testing abrirEscolas()...');
    const evalRes = await send('Runtime.evaluate', {
      expression: `(function() {
        abrirEscolas();
        const ths = Array.from(document.querySelectorAll('#pane-escolas thead th')).map(th => th.innerText.replace(/\\s+/g, ' ').trim());
        const firstRowCells = Array.from(document.querySelectorAll('#escolas-table-body tr:first-child td')).map(td => td.innerText.replace(/\\s+/g, ' ').trim());
        const hasEducatronsTh = ths.some(t => t.toLowerCase().includes('educatron'));
        return {
          totalThs: ths.length,
          ths: ths,
          hasEducatronsTh: hasEducatronsTh,
          firstRowCellCount: firstRowCells.length,
          totalRows: document.querySelectorAll('#escolas-table-body tr').length
        };
      })()`,
      returnByValue: true
    });
    console.log('Escolas Table Test Result:', JSON.stringify(evalRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('CDP test error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
