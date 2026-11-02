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

server.listen(9882, async () => {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9882'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9228/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);

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
    await send('Runtime.evaluate', {
      expression: 'abrirMapaRede(); inicializarOuAtualizarMapaRede();'
    });
    await new Promise(r => setTimeout(r, 500));

    // 1. Initial count check
    const r1 = await send('Runtime.evaluate', {
      expression: `(() => ({
        markersCount: marcadoresEscolasMapa.length,
        cardsCount: document.querySelectorAll('#mapa-lista-escolas-container > div').length,
        status: document.getElementById('mapa-status-exibicao').innerText
      }))()`,
      returnByValue: true
    });
    console.log('1. Total Markers & Cards:', r1.result.value);

    // 2. Test click on a card in the left list (Issue 1)
    const r2 = await send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        const firstCard = document.getElementById('mapa-lista-escolas-container').firstElementChild;
        firstCard.click();
        setTimeout(() => {
          const popup = document.querySelector('.leaflet-popup-content');
          resolve({
            clickedCie: firstCard.dataset.cie,
            hasPopup: !!popup,
            popupPreview: popup ? popup.innerText.slice(0, 150).replace(/\\n/g, ' ') : null,
            isCardAtivo: firstCard.classList.contains('ativo')
          });
        }, 500);
      })`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('2. Left Card Click:', r2.result.value);

    // 3. Test Pirapora (far north school - Issue 2)
    const r3 = await send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        focarEscolaNoMapaPorCie('043333'); // Nercy Amelia Martelini Daher (Pirapora)
        setTimeout(() => {
          const popup = document.querySelector('.leaflet-popup-content');
          const mapContainer = document.getElementById('mapa-container-leaflet');
          const popupRect = popup ? popup.getBoundingClientRect() : null;
          const containerRect = mapContainer ? mapContainer.getBoundingClientRect() : null;

          const topMargin = popupRect && containerRect ? (popupRect.top - containerRect.top) : null;
          resolve({
            hasPopup: !!popup,
            topMarginPx: topMargin,
            isInsideContainer: popupRect && containerRect ? (popupRect.top >= containerRect.top && popupRect.bottom <= containerRect.bottom) : false,
            popupPreview: popup ? popup.innerText.slice(0, 120).replace(/\\n/g, ' ') : null
          });
        }, 550);
      })`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('3. Pirapora Edge & Headroom:', r3.result.value);

    // 4. Test Enquadrar Todas (Issue 3)
    const r4 = await send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        resetarVisualizacaoMapaRede();
        setTimeout(() => {
          const bounds = mapaRedeInstancia.getBounds();
          const piraporaCoords = COORDENADAS_REDE_ESCOLAS['043333'];
          const itapeviSouthCoords = COORDENADAS_REDE_ESCOLAS['352561'];
          const containsNorth = bounds.contains(L.latLng(piraporaCoords));
          const containsSouth = bounds.contains(L.latLng(itapeviSouthCoords));
          resolve({
            containsNorthernmostPirapora: containsNorth,
            containsSouthernmostItapevi: containsSouth,
            currentZoom: mapaRedeInstancia.getZoom()
          });
        }, 600);
      })`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('4. Enquadramento Todas 60:', r4.result.value);

    chromeProc.kill();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
