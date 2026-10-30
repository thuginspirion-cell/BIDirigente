const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync('index.html'));
  } else if (reqPath.startsWith('/data/')) {
    const fPath = path.join(__dirname, reqPath);
    if (fs.existsSync(fPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(fs.readFileSync(fPath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Test server listening on port 3000');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\regiv\\.gemini\\antigravity\\brain\\545b4eee-837b-4178-8c23-348d2e2c474a';
  const screenshotPath = path.join(artifactDir, 'screenshot_sync_real_verified.png');

  try {
    console.log('Taking screenshot with headless Chrome...');
    execSync(`"${chromePath}" --headless --disable-gpu --window-size=1280,900 --virtual-time-budget=4000 --screenshot="${screenshotPath}" http://localhost:3000/#seintec`);
    console.log('Screenshot taken successfully at:', screenshotPath);
  } catch (err) {
    console.error('Error taking screenshot:', err);
  } finally {
    server.close();
  }
});
