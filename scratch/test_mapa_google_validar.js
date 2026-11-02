const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const html = fs.readFileSync('index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(9889, async () => {
  console.log('Server running on 9889');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9889'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9232/json');
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

    // 1. Test Map Initialization and school count
    const r1 = await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          abrirMapaRede();
          inicializarOuAtualizarMapaRede();
          setTimeout(() => {
            resolve({
              paneActive: document.getElementById('pane-mapas').classList.contains('active'),
              markersCount: marcadoresEscolasMapa.length,
              cardsInListCount: document.querySelectorAll('#mapa-lista-escolas-container > div').length,
              statusText: document.getElementById('mapa-status-exibicao').innerText,
              boundsCheck: !!mapaRedeInstancia.options.maxBounds,
              minZoom: mapaRedeInstancia.getMinZoom(),
              maxZoom: mapaRedeInstancia.getMaxZoom(),
              currentZoom: mapaRedeInstancia.getZoom(),
              currentCenter: mapaRedeInstancia.getCenter()
            });
          }, 300);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('1. Map Init Check:', r1.result.value);

    // 2. Test focus school (Jardim Paulista) and popup contents
    const r2 = await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          focarEscolaNoMapaPorCie('908617'); // Jardim Paulista
          setTimeout(() => {
            const popup = document.querySelector('.leaflet-popup-content');
            resolve({
              popupFound: !!popup,
              popupText: popup ? popup.innerText.slice(0, 160).replace(/\\n/g, ' ') : null,
              hasGmapsLink: popup ? !!popup.querySelector('a[href*="google.com/maps/dir"]') : false,
              hasAgendarCarro: popup ? !!popup.querySelector('button[onclick*="prepararAgendamentoCarro"]') : false
            });
          }, 700);
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('2. School Focus & Popup Check:', r2.result.value);

    // 3. Test Layer switching (Satélite and Trânsito)
    const r3 = await send('Runtime.evaluate', {
      expression: `
        alternarCamadaMapa('satelite');
        const isSat = tipoCamadaGoogleAtiva === 'satelite';
        alternarCamadaMapa('trafego');
        const isTrafego = tipoCamadaGoogleAtiva === 'trafego';
        alternarCamadaMapa('ruas');
        const isRuas = tipoCamadaGoogleAtiva === 'ruas';
        ({ isSat, isTrafego, isRuas })
      `,
      returnByValue: true
    });
    console.log('3. Layer Switcher Check:', r3.result.value);

    // 4. Test City Filter (Barueri: 19 schools)
    const r4 = await send('Runtime.evaluate', {
      expression: `
        filtrarMapaPorMunicipio('Barueri', document.getElementById('map-pill-barueri'));
        ({
          markersCount: marcadoresEscolasMapa.length,
          cardsCount: document.querySelectorAll('#mapa-lista-escolas-container > div').length,
          statusText: document.getElementById('mapa-status-exibicao').innerText
        })
      `,
      returnByValue: true
    });
    console.log('4. Barueri Filter Check:', r4.result.value);

    ws.close();
  } catch(e) {
    console.error('Error during test:', e);
  } finally {
    chrome.kill();
    server.close();
    process.exit(0);
  }
});
