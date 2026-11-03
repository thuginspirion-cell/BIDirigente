const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace literal https:// in DADOS_SEGRE sharepointUrl
const target = '"sharepointUrl": "https://seesp-my.sharepoint.com';
const rep = '"sharepointUrl": "https:\\/\\/seesp-my.sharepoint.com';
if (html.includes(target)) {
  html = html.replace(target, rep);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✔ Sanitized sharepointUrl in DADOS_SEGRE');
} else {
  console.log('ℹ Target not found or already sanitized');
}
