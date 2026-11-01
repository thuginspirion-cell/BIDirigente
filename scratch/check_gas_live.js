const https = require('https');

https.get('https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let idx = 0;
    while ((idx = data.indexOf('FALHA NO SINCRONISMO', idx)) !== -1) {
      console.log('Found FALHA NO SINCRONISMO at:', idx);
      console.log(data.substring(Math.max(0, idx - 200), Math.min(data.length, idx + 300)));
      console.log('---');
      idx += 20;
    }
  });
});
