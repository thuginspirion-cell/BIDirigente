const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
console.log(content.slice(2016130, 2016500));
