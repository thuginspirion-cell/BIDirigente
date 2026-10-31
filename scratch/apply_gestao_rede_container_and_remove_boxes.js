// scratch/apply_gestao_rede_container_and_remove_boxes.js
const fs = require('fs');

console.log('Iniciando aplicação dos ajustes nos menus de Gestão da Rede e remoção dos boxes de Uptime/60...');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// =========================================================================
// 1. REMOVER OS BOXES DE "TAXA DE DISPONIBILIDADE (UPTIME) 76,3%" E "UNIDADES MONITORADAS 60"
// =========================================================================

// Localizar os dois boxes no banner azul do SEINTEC
const oldUptimeAnd60Boxes = `<div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 7px 14px;">
                  <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Taxa de Disponibilidade (Uptime)</div>
                  <div id="seintec-inv-uptime-pct" style="font-size: 17px; font-weight: 900; color: #10b981;">76,1%</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 7px 14px;">
                  <div style="font-size: 10px; color: #bae6fd; font-weight: 700; text-transform: uppercase;">Unidades Monitoradas</div>
                  <div id="seintec-inv-escolas-count" style="font-size: 17px; font-weight: 900; color: #ffffff;">60</div>
                </div>`;

if (html.includes(oldUptimeAnd60Boxes)) {
  html = html.replace(oldUptimeAnd60Boxes, '');
  console.log('✓ Boxes de Uptime e 60 removidos do banner');
} else {
  // Regex flexível para garantir remoção
  html = html.replace(
    /<div[^>]*>\s*<div[^>]*>Taxa de Disponibilidade \(Uptime\)<\/div>[\s\S]*?<div id="seintec-inv-escolas-count"[^>]*>.*?<\/div>\s*<\/div>/i,
    ''
  );
  console.log('✓ Boxes de Uptime e 60 removidos via regex');
}

// =========================================================================
// 2. EQUALIZAR O CONTAINER E MARGENS DE TODOS OS MENUS DE "GESTÃO DA REDE"
// =========================================================================

// Regras globais para os headers, grids, cards e tabelas dos menus de Gestão da Rede
// (Minha Gestão, Agenda, Carro Oficial, Escolas e Visitas)
const cssGestaoRedeContainer = `
    /* EQUALIZAÇÃO EXECUTIVA DOS MENUS DO GRUPO GESTÃO DA REDE */
    #pane-gestao-hoje,
    #pane-agenda,
    #pane-carro,
    #pane-escolas,
    #pane-visitas {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    .gestao-header-card,
    .agenda-header,
    .carro-header-card,
    .escolas-header-card,
    .visitas-header-card {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      margin-bottom: 1.5rem !important;
    }

    .gestao-header-left,
    .escolas-header-left {
      max-width: none !important;
      width: auto !important;
    }

    .gestao-kpi-grid,
    .agenda-kpi-grid,
    .carro-kpi-grid,
    .escolas-kpi-grid,
    .visitas-kpi-grid {
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 1.5rem !important;
    }

    .gestao-timeline-card,
    .carro-table-card,
    .escolas-table-card,
    .visitas-table-card {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      margin-bottom: 2rem !important;
    }
`;

// Inserir essa equalização antes do bloco de responsividade 4K
const pMedia4k = html.indexOf('@media (min-width: 2560px)');
if (pMedia4k !== -1) {
  html = html.substring(0, pMedia4k) + cssGestaoRedeContainer + '\n' + html.substring(pMedia4k);
  console.log('✓ CSS de equalização de container para o Grupo Gestão da Rede injetado');
}

// 3. Atualizar também as regras do 4K para abranger os menus de Gestão da Rede
const old4kBlock = `@media (min-width: 2560px) {
  html {
    font-size: 17.5px; /* Escala elegante de zoom visual sem distorção */
  }

  .view-container {
    max-width: 2300px !important;
    padding: 2.5rem 4rem 5rem !important;
  }

  .topbar {
    padding: 1.1rem 4rem !important;
  }

  .executive-hero {
    padding: 2.2rem 3rem !important;
  }

  .seintec-metric-row {
    grid-template-columns: repeat(6, 1fr) !important;
    gap: 1.25rem !important;
  }
}`;

const new4kBlock = `@media (min-width: 2560px) {
  html {
    font-size: 17.5px; /* Escala elegante de zoom visual sem distorção */
  }

  .view-container {
    max-width: 2300px !important;
    padding: 2.5rem 4rem 5rem !important;
  }

  .topbar {
    padding: 1.1rem 4rem !important;
  }

  .executive-hero,
  .gestao-header-card,
  .agenda-header,
  .carro-header-card,
  .escolas-header-card,
  .visitas-header-card,
  .gab-header-bar {
    padding: 2.2rem 3rem !important;
    border-radius: 16px !important;
  }

  .seintec-metric-row {
    grid-template-columns: repeat(6, 1fr) !important;
    gap: 1.25rem !important;
  }

  .gestao-kpi-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem !important;
  }

  .carro-kpi-grid,
  .escolas-kpi-grid {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 1.5rem !important;
  }
}`;

if (html.includes(old4kBlock)) {
  html = html.replace(old4kBlock, new4kBlock);
  console.log('✓ Bloco 4K ampliado para cobrir todos os menus de Gestão da Rede');
}

// Restaurar CRLF se o original era CRLF
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html atualizado com sucesso!');
