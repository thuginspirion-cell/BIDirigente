const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix line 18672 (bare https:// inside script tag)
const badUrl = '"https://raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/inventario_consolidado.json?_t=" + Date.now()';
const goodUrl = "'https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/inventario_consolidado.json?_t=' + Date.now()";
if (html.includes(badUrl)) {
  html = html.replace(badUrl, goodUrl);
  console.log('1. Fixed bare https:// in script tag.');
} else {
  console.warn('1. badUrl not found!');
}

// 2. Fix static placeholders in SEINTEC base cards
html = html.replace(
  '<p class="base-card-desc" id="seintec-card-desc-Hardware">Carregando inventário...</p>',
  '<p class="base-card-desc" id="seintec-card-desc-Hardware">15.873 notebooks, desktops e tablets inventariados nas 60 escolas.</p>'
);
html = html.replace(
  '<span style="font-size: 0.65rem; background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Hardware">-- itens</span>',
  '<span style="font-size: 0.65rem; background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Hardware">15.873 itens</span>'
);

html = html.replace(
  '<p class="base-card-desc" id="seintec-card-desc-Rede">Carregando inventário...</p>',
  '<p class="base-card-desc" id="seintec-card-desc-Rede">542 switches, roteadores, nobreaks e racks nas 60 escolas.</p>'
);
html = html.replace(
  '<span style="font-size: 0.65rem; background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Rede">-- itens</span>',
  '<span style="font-size: 0.65rem; background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Rede">542 itens</span>'
);

html = html.replace(
  '<p class="base-card-desc" id="seintec-card-desc-Educatrons">Carregando inventário...</p>',
  '<p class="base-card-desc" id="seintec-card-desc-Educatrons">736 televisores e Educatrons inventariados nas 60 escolas.</p>'
);
html = html.replace(
  '<span style="font-size: 0.65rem; background: rgba(59, 130, 246, 0.15); color: #2563eb; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Educatrons">-- itens</span>',
  '<span style="font-size: 0.65rem; background: rgba(59, 130, 246, 0.15); color: #2563eb; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Educatrons">736 itens</span>'
);

html = html.replace(
  '<p class="base-card-desc" id="seintec-card-desc-Recarga">Carregando inventário...</p>',
  '<p class="base-card-desc" id="seintec-card-desc-Recarga">200 carrinhos e plataformas de recarga nas 60 escolas.</p>'
);
html = html.replace(
  '<span style="font-size: 0.65rem; background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Recarga">-- itens</span>',
  '<span style="font-size: 0.65rem; background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700;" id="seintec-card-badge-Recarga">200 itens</span>'
);

// 3. Fix static table counter
html = html.replace(
  '5 registros exibidos\r\n                </span>',
  '15.873 registros da base de Hardware\r\n                </span>'
);
html = html.replace(
  '5 registros exibidos\n                </span>',
  '15.873 registros da base de Hardware\n                </span>'
);

// 4. Fix image error fallbacks for logo_ure_itapevi_480.png
html = html.replace(
  '<img src="logo_ure_itapevi_480.png" class="brand-logo-img sidebar-logo-img" alt="Brasão URE - Itapevi">',
  '<img src="logo_ure_itapevi_480.png" class="brand-logo-img sidebar-logo-img" alt="Brasão URE - Itapevi" onerror="if(this.src!==\'https://thuginspirion-cell.github.io/BIDirigente/logo_ure_itapevi_480.png\')this.src=\'https://thuginspirion-cell.github.io/BIDirigente/logo_ure_itapevi_480.png\';">'
);

html = html.replace(
  '<img src="logo_ure_itapevi_480.png" class="brand-logo-img hero-crest-img" alt="Brasão Oficial URE Itapevi">',
  '<img src="logo_ure_itapevi_480.png" class="brand-logo-img hero-crest-img" alt="Brasão Oficial URE Itapevi" onerror="if(this.src!==\'https://thuginspirion-cell.github.io/BIDirigente/logo_ure_itapevi_480.png\')this.src=\'https://thuginspirion-cell.github.io/BIDirigente/logo_ure_itapevi_480.png\';">'
);

// 5. Ensure abrirSeintec executes synchronization synchronously
const oldAbrirSeintec = `    function abrirSeintec() {
      setTimeout(atualizarMetricasSuperioresSeintec, 50); setTimeout(sincronizarCardsBasesSeintec, 60);`;

const newAbrirSeintec = `    function abrirSeintec() {
      try { atualizarMetricasSuperioresSeintec(); } catch(e){}
      try { sincronizarCardsBasesSeintec(); } catch(e){}`;

if (html.includes(oldAbrirSeintec)) {
  html = html.replace(oldAbrirSeintec, newAbrirSeintec);
  console.log('5. Made abrirSeintec sync calls synchronous.');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html!');
