const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9450',
  '--disable-gpu',
  '--no-sandbox',
  'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9450/json', async (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      await new Promise(r => setTimeout(r, 6000));
      http.get('http://127.0.0.1:9450/json', (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const tabs = JSON.parse(d2);
          console.log('All tabs after 6s:');
          tabs.forEach(t => console.log(t.type, t.url));

          // Find the /blank target or userCodeAppPanel
          const blankTab = tabs.find(t => t.url.includes('/blank'));
          const target = blankTab || tabs.find(t => t.url.includes('googleusercontent.com'));
          console.log('Selected target:', target?.url);

          if (!target) return;
          const ws = new WebSocket(target.webSocketDebuggerUrl);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: {
                expression: 'document.documentElement.outerHTML',
                returnByValue: true
              }
            }));
          };

          ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.id === 2 && msg.result && msg.result.result) {
              const html = msg.result.result.value;
              fs.writeFileSync('scratch/inner_frame.html', html, 'utf8');
              console.log('Inner frame length:', html.length);
              chrome.kill();
              process.exit(0);
            }
          };
        });
      });
    });
  });
}, 3000);
