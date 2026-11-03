const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = '"sharepointUrl": "https://seesp-my.sharepoint.com';
const rep = '"sharepointUrl": "https:\\/\\/seesp-my.sharepoint.com';
let count = 0;
while (html.includes(target)) {
  html = html.replace(target, rep);
  count++;
}
if (count > 0) {
  fs.writeFileSync('index.html', html, 'utf8');
  console.log(`✔ Sanitized ${count} occurrences of sharepointUrl in index.html`);
} else {
  console.log('ℹ All occurrences already sanitized');
}
