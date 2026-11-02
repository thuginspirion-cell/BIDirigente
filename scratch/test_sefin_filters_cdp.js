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

server.listen(9877, async () => {
  console.log('Test server started on 9877');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9877'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://localhost:9223/json');
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

    // 1. Open SEFIN / CAF
    console.log('Testing abrirCentro("CAF")...');
    await send('Runtime.evaluate', {
      expression: 'abrirCentro("CAF");'
    });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Change year filter: alterarExercicioSefin("2025")
    console.log('Testing alterarExercicioSefin("2025")...');
    const filterRes = await send('Runtime.evaluate', {
      expression: `(function() {
        alterarExercicioSefin('2025');
        const alertEl = document.getElementById('painel-alerta-sincronizacao');
        const toastEl = document.getElementById('agenda-toast');
        const alertVis = alertEl ? window.getComputedStyle(alertEl).opacity : '0';
        const toastVis = toastEl ? toastEl.classList.contains('show') : false;
        return { ano: filtrosSefinAvancados.ano, alertVis: alertVis, toastVis: toastVis };
      })()`,
      returnByValue: true
    });
    console.log('Filter Year Result:', JSON.stringify(filterRes.result.value));

    // 3. Test sorting: alternarOrdenacaoTabelaSefin("recTotal")
    console.log('Testing alternarOrdenacaoTabelaSefin("recTotal")...');
    const sortRes = await send('Runtime.evaluate', {
      expression: `(function() {
        alternarOrdenacaoTabelaSefin('recTotal');
        const alertEl = document.getElementById('painel-alerta-sincronizacao');
        const toastEl = document.getElementById('agenda-toast');
        const alertVis = alertEl ? window.getComputedStyle(alertEl).opacity : '0';
        const toastVis = toastEl ? toastEl.classList.contains('show') : false;
        return { ordenadoPor: filtrosSefinAvancados.ordenarPor, alertVis: alertVis, toastVis: toastVis };
      })()`,
      returnByValue: true
    });
    console.log('Sort Result:', JSON.stringify(sortRes.result.value));

    // 4. Test limparTodosFiltrosSefin()
    console.log('Testing limparTodosFiltrosSefin()...');
    const clearRes = await send('Runtime.evaluate', {
      expression: `(function() {
        limparTodosFiltrosSefin();
        const alertEl = document.getElementById('painel-alerta-sincronizacao');
        const toastEl = document.getElementById('agenda-toast');
        const alertVis = alertEl ? window.getComputedStyle(alertEl).opacity : '0';
        const toastVis = toastEl ? toastEl.classList.contains('show') : false;
        return { programa: filtrosSefinAvancados.programa, alertVis: alertVis, toastVis: toastVis };
      })()`,
      returnByValue: true
    });
    console.log('Clear Result:', JSON.stringify(clearRes.result.value));

    ws.close();
  } catch (err) {
    console.error('CDP test error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
