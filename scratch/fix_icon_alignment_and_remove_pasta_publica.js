// scratch/fix_icon_alignment_and_remove_pasta_publica.js
const fs = require('fs');

console.log('Iniciando correção de alinhamento dos ícones e remoção do texto da Pasta Pública...');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// =========================================================================
// 1. REMOVER A REGRA CSS CONFLITANTE QUE FORÇAVA .inv-kpi-card COM text-align: center
// =========================================================================

const oldCssInvKpiCard = `    .inv-kpi-card {
      text-align: center !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 1.25rem 1rem !important;
    }`;

const newCssInvKpiCard = `    .inv-kpi-card {
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }`;

if (html.includes(oldCssInvKpiCard)) {
  html = html.replace(oldCssInvKpiCard, newCssInvKpiCard);
  console.log('✓ Removido conflito CSS de .inv-kpi-card (agora respeita flex justify-content: space-between)');
} else {
  console.warn('! oldCssInvKpiCard não encontrado exatamente');
}

// =========================================================================
// 2. BLINDAR O HEADER DE TODOS OS CARDS SEINTEC PARA GARANTIR ÍCONE NO EXTREMO DIREITO
// =========================================================================

// Card 1
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em;">Total do Parque</span>`,
  `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Total do Parque</span>`
);

// Card 2
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em;">Disponíveis (Uptime)</span>`,
  `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Disponíveis (Uptime)</span>`
);

// Card 3
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.03em;">Danificados (Atenção)</span>`,
  `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Danificados (Atenção)</span>`
);

// Card 4
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em;">Em Manutenção / OS</span>`,
  `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Em Manutenção / OS</span>`
);

// Card 5
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.03em;">Inservíveis (Baixa)</span>`,
  `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">\n                      <span style="font-size: 0.78rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Inservíveis (Baixa)</span>`
);

// Adicionar margin-left: auto em todos os mini-badges de ícone do SEINTEC para colar na borda direita
html = html.replace(
  /<div style="width: 32px; height: 32px; border-radius: 8px;/g,
  `<div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0;`
);

console.log('✓ Ícones empurrados para a extrema direita com margin-left: auto e sem sobrepor o texto');


// =========================================================================
// 3. REMOVER O TEXTO "Pasta Pública • 60 Escolas Monitoradas"
// =========================================================================

const oldPastaPublicaHtml = `<div style="font-size: 9.5px; color: #bae6fd; font-weight: 600;" id="sync-inv-status-text">\n                    Pasta Pública • 60 Escolas Monitoradas\n                  </div>`;
const newPastaPublicaHtml = `<div style="display: none !important;" id="sync-inv-status-text"></div>`;

if (html.includes(oldPastaPublicaHtml)) {
  html = html.replace(oldPastaPublicaHtml, newPastaPublicaHtml);
  console.log('✓ Texto "Pasta Pública • 60 Escolas Monitoradas" removido do HTML');
} else {
  // Substituir flexivelmente
  html = html.replace(
    /id="sync-inv-status-text"[^>]*>[\s\S]*?<\/div>/,
    `id="sync-inv-status-text" style="display: none !important;"></div>`
  );
  console.log('✓ Texto "Pasta Pública • 60 Escolas Monitoradas" ocultado via regex');
}

// Ocultar também qualquer texto injetado dinamicamente via JS em sync-inv-status-text
html = html.replace(
  `statusText.innerText = 'Atualizado às ' + agora + ' • 60 Escolas Monitoradas';`,
  `if (statusText) statusText.innerText = '';`
);
html = html.replace(
  `statusText.innerText = 'Sincronizado às ' + agora + ' • Base local 60 Escolas ativa';`,
  `if (statusText) statusText.innerText = '';`
);


// =========================================================================
// 4. RESTAURAR CRLF SE NECESSÁRIO E SALVAR
// =========================================================================

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html atualizado com sucesso!');
