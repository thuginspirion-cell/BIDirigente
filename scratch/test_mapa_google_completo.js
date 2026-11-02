const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const html = fs.readFileSync('index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(9887, async () => {
  console.log('Server started on 9887');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9887'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9230/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');

    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const msgId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');

    // Call abrirMapaRede() and wait for map init
    const r1 = await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          abrirMapaRede();
          setTimeout(() => {
            resolve({
              isPaneActive: document.getElementById('pane-mapas').classList.contains('active'),
              markersCount: window._mapaRedeMarkers ? window._mapaRedeMarkers.length : 0,
              listaEscolasCount: document.querySelectorAll('#mapa-lista-escolas > div').length,
              googleButtonsCount: document.querySelectorAll('#pane-mapas button').length,
              mapZoom: window._mapaRedeLeaflet ? window._mapaRedeLeaflet.getZoom() : null,
              minZoom: window._mapaRedeLeaflet ? window._mapaRedeLeaflet.getMinZoom() : null,
              maxZoom: window._mapaRedeLeaflet ? window._mapaRedeLeaflet.getMaxZoom() : null,
              center: window._mapaRedeLeaflet ? window._mapaRedeLeaflet.getCenter() : null
            });
          }, 800);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Mapa Initialization check:', r1.result.value);

    // Test clicking a school card
    const r2 = await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          focarEscolaNoMapaPorCie('908617'); // Jardim Paulista
          setTimeout(() => {
            const popup = document.querySelector('.leaflet-popup-content');
            resolve({
              popupFound: !!popup,
              popupHtmlPreview: popup ? popup.innerText.slice(0, 160).replace(/\\n/g, ' ') : null,
              centerAfterFly: window._mapaRedeLeaflet.getCenter(),
              zoomAfterFly: window._mapaRedeLeaflet.getZoom()
            });
          }, 400);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Focus School by CIE check:', r2.result.value);

    // Test Layer switching
    const r3 = await send('Runtime.evaluate', {
      expression: `
        alternarCamadaGoogle('sat');
        const hasSatLayer = window._mapaRedeLeaflet.hasLayer(window._camadasGoogle.sat);
        alternarCamadaGoogle('traffic');
        const hasTrafficLayer = window._mapaRedeLeaflet.hasLayer(window._camadasGoogle.traffic);
        alternarCamadaGoogle('streets');
        const hasStreetsLayer = window._mapaRedeLeaflet.hasLayer(window._camadasGoogle.streets);
        ({ hasSatLayer, hasTrafficLayer, hasStreetsLayer })
      `,
      returnByValue: true
    });
    console.log('Google Layer switcher check:', r3.result.value);

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
    server.close();
    process.exit(0);
  }
});
