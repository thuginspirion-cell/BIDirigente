const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
const scripts = [];
while ((match = scriptRegex.exec(html)) !== null) {
  const openTag = match[0].slice(0, match[0].indexOf('>') + 1);
  if (!openTag.includes('src=')) {
    scripts.push(match[1]);
  }
}

console.log(`Found ${scripts.length} inline script blocks.`);

const mockElement = (id = '', tagName = 'div') => {
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    children: [],
    childNodes: [],
    innerText: '',
    innerHTML: '',
    textContent: '',
    value: '',
    dataset: {},
    getAttribute(attr) { return this[attr] || null; },
    setAttribute(attr, val) { this[attr] = val; },
    hasAttribute(attr) { return this[attr] !== undefined; },
    removeAttribute(attr) { delete this[attr]; },
    querySelector: () => mockElement(),
    querySelectorAll: () => [mockElement(), mockElement()],
    getElementsByTagName: () => [mockElement()],
    getElementsByClassName: () => [mockElement()],
    appendChild: (child) => { el.children.push(child); return child; },
    removeChild: (child) => child,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    blur: () => {},
    click: () => {},
    scrollIntoView: () => {},
    closest: () => mockElement()
  };
  return el;
};

const domElements = new Map();
const getOrCreateElement = (id) => {
  if (!domElements.has(id)) {
    domElements.set(id, mockElement(id));
  }
  return domElements.get(id);
};

const sandbox = {
  window: null,
  document: {
    getElementById: (id) => getOrCreateElement(id),
    querySelector: (sel) => mockElement('', 'div'),
    querySelectorAll: (sel) => [mockElement('', 'div'), mockElement('', 'div')],
    createElement: (tag) => mockElement('', tag),
    createDocumentFragment: () => mockElement('fragment'),
    body: mockElement('body', 'body'),
    head: mockElement('head', 'head'),
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  console: console,
  setTimeout: (fn, ms) => 1,
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { userAgent: 'Node' },
  location: { href: 'https://thuginspirion-cell.github.io/BIDirigente/', reload: () => {} },
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  google: { script: { run: new Proxy({}, {
    get(target, prop) {
      if (prop === 'withSuccessHandler' || prop === 'withFailureHandler') {
        return function() { return this; };
      }
      return function() {};
    }
  }) } },
  URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
  Blob: class {},
  Date: Date,
  Math: Math,
  JSON: JSON,
  String: String,
  Number: Number,
  Array: Array,
  Object: Object
};
sandbox.window = sandbox;

vm.createContext(sandbox);

let totalErrors = 0;

scripts.forEach((code, i) => {
  try {
    vm.runInContext(code, sandbox);
    console.log(`✔ Script block #${i + 1} executed OK`);
  } catch (err) {
    totalErrors++;
    console.error(`❌ Script block #${i + 1} error:`, err.message);
  }
});

// Test navigation functions
const navFns = [
  'mostrarHome',
  'abrirMinhaGestao',
  'abrirAgenda',
  'abrirCarroOficial',
  'abrirVisitas',
  'abrirEscolas',
  'abrirMapaRede',
  'abrirSeintec'
];

console.log('\nTesting top-level navigation functions:');
for (const fn of navFns) {
  try {
    const targetFn = sandbox[fn] || sandbox.window[fn];
    if (typeof targetFn === 'function') {
      targetFn();
      console.log(`  ✔ ${fn}() executed OK`);
    } else {
      totalErrors++;
      console.error(`  ❌ ${fn} is not a function!`);
    }
  } catch (e) {
    totalErrors++;
    console.error(`  💥 Exception in ${fn}():`, e.message);
  }
}

console.log('\nTesting abrirCentro for all sectors:');
const centros = ['ASURE', 'SEAFIN', 'SEOM', 'SEGRE', 'SEPES', 'EEC', 'GABINETE'];
for (const c of centros) {
  try {
    const targetFn = sandbox.abrirCentro || sandbox.window.abrirCentro;
    if (typeof targetFn === 'function') {
      targetFn(c);
      console.log(`  ✔ abrirCentro('${c}') executed OK`);
    } else {
      totalErrors++;
      console.error(`  ❌ abrirCentro is not a function!`);
    }
  } catch (e) {
    totalErrors++;
    console.error(`  💥 Exception in abrirCentro('${c}'):`, e.message);
  }
}

console.log('\nTesting selecionarSetor for sub-tabs:');
const setores = [
  ['SEOM', 'SEOM'],
  ['SEOM', 'SEFISC'],
  ['SEOM', 'DPAT'],
  ['SEGRE', 'SEGRE'],
  ['SEGRE', 'SEMAT'],
  ['SEGRE', 'SEVESC'],
  ['SEAFIN', 'SEFIN'],
  ['SEAFIN', 'SECOMSE'],
  ['SEPES', 'SEAPE'],
  ['SEPES', 'SEFREP']
];
for (const [centro, setor] of setores) {
  try {
    const targetFn = sandbox.selecionarSetor || sandbox.window.selecionarSetor;
    if (typeof targetFn === 'function') {
      targetFn(centro, setor);
      console.log(`  ✔ selecionarSetor('${centro}', '${setor}') executed OK`);
    } else {
      totalErrors++;
      console.error(`  ❌ selecionarSetor is not a function!`);
    }
  } catch (e) {
    totalErrors++;
    console.error(`  💥 Exception in selecionarSetor('${centro}', '${setor}'):`, e.message);
  }
}

console.log('\nTesting SEPES functions:');
try {
  const rSepes = sandbox.renderizarDashboardSepes || sandbox.window.renderizarDashboardSepes;
  if (typeof rSepes === 'function') {
    rSepes();
    console.log('  ✔ renderizarDashboardSepes() executed OK');
  }
  const mAba = sandbox.mudarAbaSepes || sandbox.window.mudarAbaSepes;
  if (typeof mAba === 'function') {
    mAba('aposentadoria');
    mAba('designacoes');
    mAba('abono');
    console.log('  ✔ mudarAbaSepes() executed OK for all 3 red tabs');
  }
} catch (e) {
  totalErrors++;
  console.error('  💥 Exception in SEPES tests:', e.message);
}

console.log('\nTesting SEINTEC base selection:');
const bases = ['Atendimentos', 'Hardware', 'Rede', 'Educatrons', 'Recarga'];
for (const b of bases) {
  try {
    const targetFn = sandbox.selecionarBaseSeintec || sandbox.window.selecionarBaseSeintec;
    if (typeof targetFn === 'function') {
      targetFn(b);
      console.log(`  ✔ selecionarBaseSeintec('${b}') executed OK`);
    } else {
      totalErrors++;
      console.error(`  ❌ selecionarBaseSeintec is not a function!`);
    }
  } catch (e) {
    totalErrors++;
    console.error(`  💥 Exception in selecionarBaseSeintec('${b}'):`, e.message);
  }
}


console.log('\nTesting synchronization functions:');
const syncFns = [
  'sincronizarDashboardSefin',
  'sincronizarDashboardSecomse',
  'sincronizarDashboardDpat',
  'sincronizarDashboardSeom',
  'sincronizarDashboardSefisc',
  'sincronizarDashboardSemat',
  'sincronizarDashboardSevesc',
  'sincronizarDashboardSegre',
  'sincronizarDashboardSepes',
  'sincronizarTudoGlobalmente'
];

for (const fn of syncFns) {
  try {
    const targetFn = sandbox[fn] || (sandbox.window && sandbox.window[fn]);
    if (typeof targetFn === 'function') {
      targetFn(false);
      console.log(`  ✔ ${fn}() executed OK`);
    } else {
      totalErrors++;
      console.error(`  ❌ ${fn} is not defined or not a function!`);
    }
  } catch (e) {
    totalErrors++;
    console.error(`  💥 Exception in ${fn}():`, e.message);
  }
}

console.log(`\n🎉 Test finished! Total errors: ${totalErrors}`);
if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL DOM AND NAVIGATION TESTS PASSED WITH 0 ERRORS!');
}
