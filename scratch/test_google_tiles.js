const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="map" style="width: 500px; height: 400px;"></div>
  <script>
    const map = L.map('map').setView([-23.5415, -46.9385], 13);
    const gmapsTile = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    L.tileLayer(gmapsTile, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20
    }).addTo(map);
    window.__mapReady = true;
  </script>
</body>
</html>`);
});

server.listen(9885, async () => {
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    'http://localhost:9885'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await (await fetch('http://localhost:9232/json')).json();
    const page = list.find(t => t.type === 'page');
    const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 1) {
        console.log('Google Maps Tiles Leaflet Result:', msg.result.result.value);
        chrome.kill();
        server.close();
        process.exit(0);
      }
    };

    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: 'window.__mapReady'
      }
    }));
  } catch(e) {
    console.error(e);
    chrome.kill();
    server.close();
    process.exit(1);
  }
});
