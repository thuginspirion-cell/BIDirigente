const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9453',
  '--disable-gpu',
  '--no-sandbox',
  'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9453/json', async (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      await new Promise(r => setTimeout(r, 4000));
      http.get('http://127.0.0.1:9453/json', (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const tabs = JSON.parse(d2);
          const iframeTab = tabs.find(t => t.url.includes('googleusercontent.com'));
          if (!iframeTab) return;

          const ws = new WebSocket(iframeTab.webSocketDebuggerUrl);
          let userCtxId = null;
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          };

          ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.method === 'Runtime.executionContextCreated') {
              // Context 2 or the one with frameId
              if (msg.params.context.id === 2) {
                userCtxId = 2;
              }
            } else if (msg.method === 'Runtime.consoleAPICalled') {
              console.log('[CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
            } else if (msg.id === 50) {
              console.log('[USER EVAL RESULT IN LIVE GAS]:', msg.result.result.value);
              chrome.kill();
              process.exit(0);
            }
          };

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 50,
              method: 'Runtime.evaluate',
              params: {
                expression: `(function() {
                  abrirSeintec();
                  return {
                    tuplesHw: window.INVENTARIO_COMPLETO_TUPLES?.hardware?.length,
                    abrirSeintecType: typeof window.abrirSeintec,
                    cardDescHw: document.getElementById('seintec-card-desc-Hardware')?.innerText,
                    cardBadgeHw: document.getElementById('seintec-card-badge-Hardware')?.innerText,
                    counter: document.getElementById('seintec-table-records-counter')?.innerText,
                    tbodyRows: document.getElementById('panel-seintec-tbody')?.children?.length
                  };
                })()`,
                contextId: userCtxId || 2,
                returnByValue: true
              }
            }));
          }, 3500);

        });
      });
    });
  });
}, 3000);
