const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. CSS
const oldCss = `    .btn-secomse-cat:hover {
      border-color: #2563eb;
      color: #2563eb;
      background: #eff6ff;
    }
    .btn-secomse-cat.active {
      background: #2563eb !important;
      border-color: #2563eb !important;
      color: #ffffff !important;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3) !important;
      font-weight: 800 !important;
    }`;

const newCss = `    .btn-secomse-cat:hover {
      border-color: #0b2351;
      color: #0b2351;
      background: #f1f5f9;
    }
    .btn-secomse-cat.active {
      background: #0b2351 !important;
      border-color: #0b2351 !important;
      color: #ffffff !important;
      box-shadow: 0 2px 6px rgba(11, 35, 81, 0.25) !important;
      font-weight: 800 !important;
    }`;

// 2. mudarCategoriaSecomse JS
const oldJs = `        if (isMatch) {
          b.classList.add('active');
          b.style.background = '#2563eb';
          b.style.color = '#ffffff';
          b.style.borderColor = '#2563eb';
          b.style.fontWeight = '800';
          b.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
        } else {`;

const newJs = `        if (isMatch) {
          b.classList.add('active');
          b.style.background = '#0b2351';
          b.style.color = '#ffffff';
          b.style.borderColor = '#0b2351';
          b.style.fontWeight = '800';
          b.style.boxShadow = '0 2px 6px rgba(11, 35, 81, 0.25)';
        } else {`;

function replaceAllExact(str, find, rep) {
  const normFind = find.replace(/\r?\n/g, '\r\n');
  const normRep = rep.replace(/\r?\n/g, '\r\n');
  if (!str.includes(normFind)) {
    console.error('NOT FOUND: ' + find.substring(0, 40));
    return str;
  }
  console.log('REPLACED: ' + find.substring(0, 40));
  return str.replace(normFind, normRep);
}

content = replaceAllExact(content, oldCss, newCss);
content = replaceAllExact(content, oldJs, newJs);

// Replace category buttons inside renderizarDashboardSecomse
content = content.replace(
  /\$\{estadoSecomse\.categoria === '([^']+)' \? '#2563eb' : '#cbd5e1'\}\; background: \$\{estadoSecomse\.categoria === '([^']+)' \? '#2563eb' : '#ffffff'\}/g,
  "${estadoSecomse.categoria === '$1' ? '#0b2351' : '#cbd5e1'}; background: ${estadoSecomse.categoria === '$2' ? '#0b2351' : '#ffffff'}"
);

content = content.replace(
  /box-shadow: \$\{estadoSecomse\.categoria === '([^']+)' \? '0 2px 8px rgba\(37, 99, 235, 0\.3\)' : 'none'\}/g,
  "box-shadow: ${estadoSecomse.categoria === '$1' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}"
);

// Replace Exercício buttons
content = content.replace(
  /\$\{ano === '2026' \? '#2563eb' : '#cbd5e1'\}; background: \$\{ano === '2026' \? '#2563eb' : '#ffffff'\}/g,
  "${ano === '2026' ? '#0b2351' : '#cbd5e1'}; background: ${ano === '2026' ? '#0b2351' : '#ffffff'}"
);
content = content.replace(
  /box-shadow: \$\{ano === '2026' \? '0 2px 8px rgba\(37, 99, 235, 0\.3\)' : 'none'\}/g,
  "box-shadow: ${ano === '2026' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}"
);

content = content.replace(
  /\$\{ano === '2025' \? '#2563eb' : '#cbd5e1'\}; background: \$\{ano === '2025' \? '#2563eb' : '#ffffff'\}/g,
  "${ano === '2025' ? '#0b2351' : '#cbd5e1'}; background: ${ano === '2025' ? '#0b2351' : '#ffffff'}"
);
content = content.replace(
  /box-shadow: \$\{ano === '2025' \? '0 2px 8px rgba\(37, 99, 235, 0\.3\)' : 'none'\}/g,
  "box-shadow: ${ano === '2025' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated filter colors to #0b2351!');
