// scratch/check_panes_css_margins.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Ver as regras de gestao-timeline-card e gestao-kpi-grid
const r1 = /\.gestao-timeline-card\b\s*\{([^}]+)\}/g;
let m = r1.exec(html);
if (m) console.log('gestao-timeline-card:', m[1]);

const r2 = /\.timeline-slots-container\b\s*\{([^}]+)\}/g;
let m2 = r2.exec(html);
if (m2) console.log('timeline-slots-container:', m2[1]);
