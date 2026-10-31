// scratch/inspect_margins_panes3.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const r = /\.escolas-table-card\b\s*\{([^}]+)\}/g;
let m = r.exec(html);
if (m) console.log('escolas-table-card:', m[1]);

const r2 = /\.escolas-table-responsive\b\s*\{([^}]+)\}/g;
let m2 = r2.exec(html);
if (m2) console.log('escolas-table-responsive:', m2[1]);

const r3 = /\.escolas-main-container\b\s*\{([^}]+)\}/g;
let m3 = r3.exec(html);
if (m3) console.log('escolas-main-container:', m3[1]);
