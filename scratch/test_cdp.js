const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (filePath.endsWith('.html')) res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    else if (filePath.endsWith('.js')) res.writeHead(200, { 'Content-Type': 'application/javascript' });
    else res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(9876, async () => {
  console.log('Server started on 9876');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:9876/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9333/json', async (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('index.html'));
        if (!pageTab) {
          console.error('No page tab found');
          cleanup();
          return;
        }

        const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
        let idCounter = 1;
        function send(method, params = {}) {
          const id = idCounter++;
          ws.send(JSON.stringify({ id, method, params }));
          return id;
        }

        ws.onopen = () => {
          send('Console.enable');
          send('Runtime.enable');
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
          } else if (msg.method === 'Runtime.exceptionThrown') {
            console.error('[BROWSER EXCEPTION]', JSON.stringify(msg.params.exceptionDetails));
          } else if (msg.result && msg.result.result) {
            console.log('[EVAL RESULT]', msg.result.result.value);
          }
        };

        await new Promise(r => setTimeout(r, 2500));

        console.log('--- Calling abrirSeintec() ---');
        send('Runtime.evaluate', {
          expression: 'try { abrirSeintec(); "abrirSeintec executed OK"; } catch(e) { "ERROR: " + e.stack; }',
          returnByValue: true
        });

        await new Promise(r => setTimeout(r, 2000));

        send('Runtime.evaluate', {
          expression: `JSON.stringify({
            cardDescHw: document.getElementById('seintec-card-desc-Hardware')?.innerText,
            cardBadgeHw: document.getElementById('seintec-card-badge-Hardware')?.innerText,
            counter: document.getElementById('seintec-table-records-counter')?.innerText,
            tbodyRows: document.getElementById('panel-seintec-tbody')?.children.length
          })`,
          returnByValue: true
        });

        await new Promise(r => setTimeout(r, 2000));
        cleanup();
      } catch (err) {
        console.error('CDP Error:', err);
        cleanup();
      }
    });
  }).on('error', err => {
    console.error('Failed to connect to CDP:', err);
    cleanup();
  });

  function cleanup() {
    try { chrome.kill(); } catch(e) {}
    try { server.close(); } catch(e) {}
    process.exit(0);
  }
});
