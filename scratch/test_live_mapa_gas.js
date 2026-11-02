const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const gasUrl = 'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9455',
  '--disable-gpu',
  '--no-sandbox',
  gasUrl
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9455/json', async (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      await new Promise(r => setTimeout(r, 4500));
      http.get('http://127.0.0.1:9455/json', (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const tabs = JSON.parse(d2);
          const iframeTab = tabs.find(t => t.url.includes('googleusercontent.com'));
          if (!iframeTab) {
            console.error('Iframe tab not found');
            chrome.kill();
            process.exit(1);
          }

          const ws = new WebSocket(iframeTab.webSocketDebuggerUrl);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          };

          ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.id === 50) {
              console.log('[LIVE GAS MAP EVAL RESULT]:', msg.result.result.value);
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
                  abrirMapaRede();
                  inicializarOuAtualizarMapaRede();
                  return {
                    paneActive: document.getElementById('pane-mapas').classList.contains('active'),
                    sideActive: document.getElementById('side-btn-mapa').classList.contains('active'),
                    markersCount: typeof marcadoresEscolasMapa !== 'undefined' ? marcadoresEscolasMapa.length : -1,
                    statusText: document.getElementById('mapa-status-exibicao') ? document.getElementById('mapa-status-exibicao').innerText : ''
                  };
                })()`,
                contextId: 2,
                returnByValue: true
              }
            }));
          }, 2000);
        });
      });
    });
  });
}, 3000);
