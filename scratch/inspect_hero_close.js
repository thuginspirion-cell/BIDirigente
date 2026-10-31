// scratch/inspect_hero_close.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const heroStart = html.indexOf('class="executive-hero"');
console.log(html.substring(heroStart + 1200, heroStart + 1600));
