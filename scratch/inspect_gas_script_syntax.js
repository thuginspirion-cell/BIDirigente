const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9448',
  '--disable-gpu',
  '--no-sandbox',
  'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9448/json', async (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      await new Promise(r => setTimeout(r, 4000));
      http.get('http://127.0.0.1:9448/json', (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const tabs = JSON.parse(d2);
          const iframeTab = tabs.find(t => t.url.includes('googleusercontent.com'));
          if (!iframeTab) return;

          const ws = new WebSocket(iframeTab.webSocketDebuggerUrl);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Debugger.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          };

          ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.method === 'Debugger.scriptFailedToParse') {
              console.log('FAILED TO PARSE:', msg.params);
            } else if (msg.method === 'Runtime.exceptionThrown') {
              console.log('EXCEPTION THROWN:', msg.params.exceptionDetails);
            }
          };

          setTimeout(() => {
            // Reload iframe page to catch parsing from start
            ws.send(JSON.stringify({ id: 10, method: 'Page.enable' }));
            ws.send(JSON.stringify({ id: 11, method: 'Page.reload' }));
          }, 1000);

          setTimeout(() => {
            chrome.kill();
            process.exit(0);
          }, 8000);
        });
      });
    });
  });
}, 3000);
