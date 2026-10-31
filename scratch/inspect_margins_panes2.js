// scratch/inspect_margins_panes2.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const r = /\.gab-header-bar\b\s*\{([^}]+)\}/g;
let m = r.exec(html);
if (m) console.log('gab-header-bar:', m[1]);

const r2 = /\.gestao-header-card\b\s*\{([^}]+)\}/g;
let m2 = r2.exec(html);
if (m2) console.log('gestao-header-card:', m2[1]);

const r3 = /\.escolas-header-card\b\s*\{([^}]+)\}/g;
let m3 = r3.exec(html);
if (m3) console.log('escolas-header-card:', m3[1]);
