const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9449',
  '--disable-gpu',
  '--no-sandbox',
  'https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9449/json', async (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      await new Promise(r => setTimeout(r, 4000));
      http.get('http://127.0.0.1:9449/json', (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const tabs = JSON.parse(d2);
          const iframeTab = tabs.find(t => t.url.includes('googleusercontent.com'));
          if (!iframeTab) return;

          const ws = new WebSocket(iframeTab.webSocketDebuggerUrl);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'DOM.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({
              id: 3,
              method: 'Runtime.evaluate',
              params: {
                expression: 'document.documentElement.outerHTML',
                returnByValue: true
              }
            }));
          };

          ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.id === 3 && msg.result && msg.result.result) {
              const html = msg.result.result.value;
              fs.writeFileSync('scratch/userCodeAppPanel.html', html, 'utf8');
              console.log('Saved userCodeAppPanel.html, size:', html.length);
              
              // Find the scripts in userCodeAppPanel.html
              const lines = html.split('\n');
              console.log('Total lines:', lines.length);
              console.log('Lines around 7229:');
              for (let i = Math.max(0, 7220); i < Math.min(lines.length, 7235); i++) {
                console.log(`${i+1}: ${lines[i]}`);
              }

              chrome.kill();
              process.exit(0);
            }
          };
        });
      });
    });
  });
}, 3000);
