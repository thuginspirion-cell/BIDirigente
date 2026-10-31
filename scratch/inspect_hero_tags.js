// scratch/inspect_hero_tags.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const paneHomeStart = html.indexOf('<section id="pane-home"');
const heroStart = html.indexOf('<div class="executive-hero">');

console.log(html.substring(paneHomeStart, heroStart));
