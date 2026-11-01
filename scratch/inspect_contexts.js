const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9451',
  '--disable-gpu',
  '--no-sandbox',
  'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9451/json', async (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      await new Promise(r => setTimeout(r, 4000));
      http.get('http://127.0.0.1:9451/json', (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const tabs = JSON.parse(d2);
          const iframeTab = tabs.find(t => t.url.includes('googleusercontent.com'));
          if (!iframeTab) return;

          const ws = new WebSocket(iframeTab.webSocketDebuggerUrl);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          };

          const contexts = [];
          ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.method === 'Runtime.executionContextCreated') {
              console.log('Context created:', msg.params.context);
              contexts.push(msg.params.context.id);
            }
          };

          setTimeout(() => {
            console.log('Testing evaluation in all contexts:', contexts);
            contexts.forEach(ctxId => {
              ws.send(JSON.stringify({
                id: 100 + ctxId,
                method: 'Runtime.evaluate',
                params: {
                  expression: '({ title: document.title, scripts: document.querySelectorAll("script").length, url: window.location.href, err: window.__lastErr })',
                  contextId: ctxId,
                  returnByValue: true
                }
              }));
            });
          }, 3000);

          setTimeout(() => {
            chrome.kill();
            process.exit(0);
          }, 8000);
        });
      });
    });
  });
}, 3000);
