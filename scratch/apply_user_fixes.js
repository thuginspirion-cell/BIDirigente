// scratch/apply_user_fixes.js
const fs = require('fs');

console.log('Iniciando aplicação dos ajustes pontuais solicitados pelo usuário...');
let html = fs.readFileSync('index.html', 'utf8');

// Normalizar line-endings para \n
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// =========================================================================
// 1. RETIRAR A PALAVRA "Escolas" NA FRENTE DO 60 NO BANNER SEINTEC
// =========================================================================

// Estático no HTML
const oldBannerEscola = `<div id="seintec-inv-escolas-count" style="font-size: 17px; font-weight: 900; color: #ffffff;">60 Escolas</div>`;
const newBannerEscola = `<div id="seintec-inv-escolas-count" style="font-size: 17px; font-weight: 900; color: #ffffff;">60</div>`;

if (html.includes(oldBannerEscola)) {
  html = html.replace(oldBannerEscola, newBannerEscola);
  console.log('✓ Palavra "Escolas" removida do banner estático (ficou apenas "60")');
} else {
  console.warn('! Banner estático não encontrado exatamente');
}

// Dinâmico no JS que atualiza seintec-inv-escolas-count
const oldJsEscolaCount = `filtroEscolaCieAtivo !== '' && filtroEscolaCieAtivo !== 'todas')
          ? '1 Escola Selecionada'
          : '60 Escolas';`;
const newJsEscolaCount = `filtroEscolaCieAtivo !== '' && filtroEscolaCieAtivo !== 'todas')
          ? '1'
          : '60';`;

if (html.includes(oldJsEscolaCount)) {
  html = html.replace(oldJsEscolaCount, newJsEscolaCount);
  console.log('✓ Atualização dinâmica de seintec-inv-escolas-count ajustada para "60"');
} else {
  console.warn('! Atualização dinâmica não encontrada exatamente');
}


// =========================================================================
// 2. RETIRAR OS ÍCONES DOS 5 CARDS DO PAINEL OPERACIONAL (IMAGE 2)
//    (Total do Parque, Disponíveis, Danificados, Manutenção, Inservíveis)
// =========================================================================

// Card 1: Total do Parque
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: flex-start;">\n                    <span style="font-size: 11px; font-weight: 800; color: #0369a1; text-transform: uppercase;">Total do Parque</span>\n                    <span style="font-size: 18px;">💻</span>\n                  </div>`,
  `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">\n                    <span style="font-size: 11px; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.04em;">Total do Parque</span>\n                  </div>`
);

// Card 2: Disponíveis (Uptime)
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: flex-start;">\n                    <span style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase;">Disponíveis (Uptime)</span>\n                    <span style="font-size: 18px;">✅</span>\n                  </div>`,
  `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">\n                    <span style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.04em;">Disponíveis (Uptime)</span>\n                  </div>`
);

// Card 3: Danificados (Atenção)
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: flex-start;">\n                    <span style="font-size: 11px; font-weight: 800; color: #b91c1c; text-transform: uppercase;">Danificados (Atenção)</span>\n                    <span style="font-size: 18px;">⚠️</span>\n                  </div>`,
  `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">\n                    <span style="font-size: 11px; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.04em;">Danificados (Atenção)</span>\n                  </div>`
);

// Card 4: Em Manutenção / OS
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: flex-start;">\n                    <span style="font-size: 11px; font-weight: 800; color: #d97706; text-transform: uppercase;">Em Manutenção / OS</span>\n                    <span style="font-size: 18px;">🔧</span>\n                  </div>`,
  `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">\n                    <span style="font-size: 11px; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 0.04em;">Em Manutenção / OS</span>\n                  </div>`
);

// Card 5: Inservíveis (Baixa)
html = html.replace(
  `<div style="display: flex; justify-content: space-between; align-items: flex-start;">\n                    <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">Inservíveis (Baixa)</span>\n                    <span style="font-size: 18px;">📦</span>\n                  </div>`,
  `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">\n                    <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.04em;">Inservíveis (Baixa)</span>\n                  </div>`
);

console.log('✓ Ícones removidos e títulos dos 5 subcards perfeitamente centralizados');


// =========================================================================
// 3. RETIRAR OS TEXTOS DE RODAPÉ "Comparação atual - não é histórico" (IMAGE 3)
// =========================================================================

// Ocultar via CSS e remover do DOM
html = html.replace(
  /\.gab-card-footer-note\s*\{[^}]*\}/g,
  `.gab-card-footer-note { display: none !important; }`
);

// Remover as tags HTML estáticas nos 6 cards superiores do SEINTEC
const oldFooterNote = `<div class="gab-card-footer-note">Comparação atual - não é histórico</div>`;
while (html.includes(oldFooterNote)) {
  html = html.replace(oldFooterNote, '');
}

// Na função de atualização de métricas do SEINTEC:
html = html.replace(
  `let rodapeTexto = 'Comparação atual - não é histórico';`,
  `let rodapeTexto = '';`
);

console.log('✓ Textos de rodapé "Comparação atual - não é histórico" eliminados');


// Restaurar CRLF se o original era CRLF
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html atualizado com sucesso!');
