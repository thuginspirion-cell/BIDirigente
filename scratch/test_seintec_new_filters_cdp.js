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

server.listen(9878, async () => {
  console.log('Test server started on 9878');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:9878'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://localhost:9224/json');
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

    // 1. Open SEINTEC
    console.log('Opening SEINTEC...');
    await send('Runtime.evaluate', { expression: 'abrirSeintec();' });
    await new Promise(r => setTimeout(r, 800));

    // 2. Open Hardware base
    console.log('Opening Hardware base...');
    await send('Runtime.evaluate', { expression: 'abrirBaseDetalheSeintec("Hardware");' });
    await new Promise(r => setTimeout(r, 800));

    // 3. Test each quick filter pill
    const tests = [
      { key: 'cat:Notebook', expectedMin: 8000, desc: 'Notebooks' },
      { key: 'cat:Tablet', expectedMin: 6500, desc: 'Tablets' },
      { key: 'cat:Desktop', expectedMin: 900, desc: 'Desktops' },
      { key: 'cat:Smartphone', expectedMin: 300, desc: 'Smartphones' },
      { key: 'cat:SalaAula', expectedMin: 6500, desc: 'Sala de Aula' },
      { key: 'cat:Avancado', expectedMin: 800, desc: 'Avançados' },
      { key: 'amb:Pedagógico', expectedMin: 14000, desc: 'Pedagógico' },
      { key: 'amb:Administrativo', expectedMin: 1300, desc: 'Administrativo' },
      { key: 'todos', expectedMin: 15800, desc: 'Todos os Equipamentos' }
    ];

    for (const t of tests) {
      const evalRes = await send('Runtime.evaluate', {
        expression: `(function() {
          filtrarInventarioPorCategoria('${t.key}', null);
          const counterEl = document.getElementById('seintec-table-records-counter');
          const counterText = counterEl ? counterEl.innerText : '';
          const activeBtn = document.querySelector('#seintec-inventario-filter-buttons .btn-inv-filter.active');
          const btnText = activeBtn ? activeBtn.innerText.replace(/\\s+/g, ' ').trim() : '';
          return { key: '${t.key}', desc: '${t.desc}', btnText: btnText, counterText: counterText };
        })()`,
        returnByValue: true
      });
      console.log('Pill Test Result:', JSON.stringify(evalRes.result.value));
    }

    // 4. Test combined filter: Danificados status card + Notebooks category pill
    console.log('Testing combined filter (Danificados card + Notebooks pill)...');
    const combinedRes = await send('Runtime.evaluate', {
      expression: `(function() {
        filtrarInventarioPorStatus('Danificado', document.getElementById('inv-kpi-danificado'));
        filtrarInventarioPorCategoria('cat:Notebook', document.getElementById('btn-inv-filter-cat-notebook'));
        const counterEl = document.getElementById('seintec-table-records-counter');
        const counterText = counterEl ? counterEl.innerText : '';
        const cardSelected = document.getElementById('inv-kpi-danificado').classList.contains('selected');
        const pillActive = document.getElementById('btn-inv-filter-cat-notebook').classList.contains('active');
        return { cardSelected: cardSelected, pillActive: pillActive, counterText: counterText };
      })()`,
      returnByValue: true
    });
    console.log('Combined Filter Result:', JSON.stringify(combinedRes.result.value));

    ws.close();
  } catch (err) {
    console.error('CDP test error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
