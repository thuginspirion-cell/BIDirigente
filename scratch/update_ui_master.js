// scratch/update_ui_master.js
const fs = require('fs');

console.log('Iniciando modernização UX/UI Master de Tabelas e Cards (com normalização de CRLF)...');
let html = fs.readFileSync('index.html', 'utf8');

// Normalizar temporariamente para \n para buscas robustas
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// =========================================================================
// 1. REFINAMENTO DOS 5 CARDS SEFIN: CENTRALIZAR APENAS OS NÚMEROS E ÍCONES SVG
// =========================================================================

// Card 1: Receita Total
const oldCard1 = `<span style="font-size: 1.2rem;">💰</span>
                </div>
                \${(() => {
                  const val = formatarValorKpiCard(kpis.totalReceita);
                  return \`<div style="font-size: \${val.fontSize}; font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.25rem 0; padding: 0 5px; white-space: nowrap;" title="Receita Total: \${formatarMoedaBrl(kpis.totalReceita)}">\${val.html}</div>\`;
                })()}`;

const newCard1 = `<div style="width: 32px; height: 32px; border-radius: 8px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                </div>
                \${(() => {
                  const val = formatarValorKpiCard(kpis.totalReceita);
                  return \`<div style="font-size: \${val.fontSize}; font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0; padding: 0 5px; white-space: nowrap; text-align: center; display: flex; justify-content: center; align-items: center; width: 100%;" title="Receita Total: \${formatarMoedaBrl(kpis.totalReceita)}">\${val.html}</div>\`;
                })()}`;

if (html.includes(oldCard1)) {
  html = html.replace(oldCard1, newCard1);
  console.log('✓ Card 1 SEFIN atualizado');
} else {
  console.warn('! Card 1 SEFIN não encontrado');
}

// Card 2: Despesas
const oldCard2 = `<span style="font-size: 1.2rem;">📝</span>
                </div>
                \${(() => {
                  const val = formatarValorKpiCard(kpis.totalDespesa);
                  return \`<div style="font-size: \${val.fontSize}; font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.25rem 0; padding: 0 5px; white-space: nowrap;" title="Despesas Realizadas: \${formatarMoedaBrl(kpis.totalDespesa)}">\${val.html}</div>\`;
                })()}`;

const newCard2 = `<div style="width: 32px; height: 32px; border-radius: 8px; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                </div>
                \${(() => {
                  const val = formatarValorKpiCard(kpis.totalDespesa);
                  return \`<div style="font-size: \${val.fontSize}; font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0; padding: 0 5px; white-space: nowrap; text-align: center; display: flex; justify-content: center; align-items: center; width: 100%;" title="Despesas Realizadas: \${formatarMoedaBrl(kpis.totalDespesa)}">\${val.html}</div>\`;
                })()}`;

if (html.includes(oldCard2)) {
  html = html.replace(oldCard2, newCard2);
  console.log('✓ Card 2 SEFIN atualizado');
} else {
  console.warn('! Card 2 SEFIN não encontrado');
}

// Card 3: Saldo em Conta
const oldCard3 = `<span style="font-size: 1.2rem;">🏦</span>
                </div>
                \${(() => {
                  const val = formatarValorKpiCard(kpis.totalSaldo);
                  return \`<div style="font-size: \${val.fontSize}; font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.25rem 0; padding: 0 5px; white-space: nowrap;" title="Saldo em Conta APMs: \${formatarMoedaBrl(kpis.totalSaldo)}">\${val.html}</div>\`;
                })()}`;

const newCard3 = `<div style="width: 32px; height: 32px; border-radius: 8px; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z"></path></svg>
                  </div>
                </div>
                \${(() => {
                  const val = formatarValorKpiCard(kpis.totalSaldo);
                  return \`<div style="font-size: \${val.fontSize}; font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0; padding: 0 5px; white-space: nowrap; text-align: center; display: flex; justify-content: center; align-items: center; width: 100%;" title="Saldo em Conta APMs: \${formatarMoedaBrl(kpis.totalSaldo)}">\${val.html}</div>\`;
                })()}`;

if (html.includes(oldCard3)) {
  html = html.replace(oldCard3, newCard3);
  console.log('✓ Card 3 SEFIN atualizado');
} else {
  console.warn('! Card 3 SEFIN não encontrado');
}

// Card 4: Total Repasses
const oldCard4 = `<span style="font-size: 1.2rem;">🏫</span>
                </div>
                <div style="font-size: \${fonteKpiContagem}; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  \${kpis.totalRepasses.toLocaleString('pt-BR')}
                </div>`;

const newCard4 = `<div style="width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #cbd5e1;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>
                <div style="font-size: \${fonteKpiContagem}; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">
                  \${kpis.totalRepasses.toLocaleString('pt-BR')}
                </div>`;

if (html.includes(oldCard4)) {
  html = html.replace(oldCard4, newCard4);
  console.log('✓ Card 4 SEFIN atualizado');
} else {
  console.warn('! Card 4 SEFIN não encontrado');
}

// Card 5: Situação SED
const oldCard5 = `<span style="font-size: 1.2rem;">✅</span>
                </div>
                <div style="font-size: \${fonteKpiContagem}; font-weight: 800; color: #6d28d9; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">`;

const newCard5 = `<div style="width: 32px; height: 32px; border-radius: 8px; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                </div>
                <div style="font-size: \${fonteKpiContagem}; font-weight: 800; color: #6d28d9; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">`;

if (html.includes(oldCard5)) {
  html = html.replace(oldCard5, newCard5);
  console.log('✓ Card 5 SEFIN atualizado');
} else {
  console.warn('! Card 5 SEFIN não encontrado');
}


// =========================================================================
// 2. CENTRALIZAR COLUNAS E CABEÇALHOS DA TABELA SEFIN
// =========================================================================

html = html.replace(
  `html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\\\'recTotal\\\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: right; min-width: 155px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\\\'#1e293b\\\'" onmouseout="this.style.background=\\\'#0f172a\\\'" title="Classificar por Receita Total">';\n      html += '<div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 0.25rem; width: 100%;"><span>Receita Total (Custeio + Capital)</span>' + gerarIndicadorOrdenacaoSefin('recTotal') + '</div></th>';`,
  `html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\\\'recTotal\\\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 165px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\\\'#1e293b\\\'" onmouseout="this.style.background=\\\'#0f172a\\\'" title="Classificar por Receita Total">';\n      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Receita Total (Custeio + Capital)</span>' + gerarIndicadorOrdenacaoSefin('recTotal') + '</div></th>';`
);

html = html.replace(
  `html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\\\'despTotal\\\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: right; min-width: 155px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\\\'#1e293b\\\'" onmouseout="this.style.background=\\\'#0f172a\\\'" title="Classificar por Despesa">';\n      html += '<div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 0.25rem; width: 100%;"><span>Despesa Executada (Custeio + Capital)</span>' + gerarIndicadorOrdenacaoSefin('despTotal') + '</div></th>';`,
  `html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\\\'despTotal\\\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 165px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\\\'#1e293b\\\'" onmouseout="this.style.background=\\\'#0f172a\\\'" title="Classificar por Despesa">';\n      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Despesa Executada (Custeio + Capital)</span>' + gerarIndicadorOrdenacaoSefin('despTotal') + '</div></th>';`
);

html = html.replace(
  `html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\\\'saldoTotal\\\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: right; min-width: 145px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\\\'#1e293b\\\'" onmouseout="this.style.background=\\\'#0f172a\\\'" title="Classificar por Saldo em Conta">';\n      html += '<div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 0.25rem; width: 100%;"><span>Saldo Remanescente (Contas APM)</span>' + gerarIndicadorOrdenacaoSefin('saldoTotal') + '</div></th>';`,
  `html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\\\'saldoTotal\\\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 155px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\\\'#1e293b\\\'" onmouseout="this.style.background=\\\'#0f172a\\\'" title="Classificar por Saldo em Conta">';\n      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Saldo Remanescente (Contas APM)</span>' + gerarIndicadorOrdenacaoSefin('saldoTotal') + '</div></th>';`
);

const oldSefinTr = `html += '<td style="padding: 10px 14px; font-weight: 800; color: #0f172a; font-size: 0.88rem;">' + r.ano + '</td>';
        html += '<td style="padding: 10px 14px;"><div style="font-weight: 800; color: #0f172a; font-size: 0.88rem; line-height: 1.35;">' + r.escola + '</div><div style="font-size: 0.74rem; font-weight: 700; color: #0284c7; margin-top: 3px;">CIE: ' + r.cie + '</div></td>';
        html += '<td style="padding: 10px 14px;"><div style="color: #0f172a; font-weight: 700; font-size: 0.82rem; line-height: 1.3;">' + r.programa + ' ' + tagOrigem + '</div></td>';
        html += '<td style="padding: 8px 14px; text-align: right; vertical-align: middle;"><div style="font-weight: 800; color: #0369a1; font-size: 0.92rem; line-height: 1.25; margin-bottom: 3px;">' + formatarMoedaBrl(r.recTotal) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Custeio: Materiais de consumo e pequenos reparos"><span style="color: #64748b; font-weight: 600;">Custeio (C):</span> ' + formatarMoedaBrl(r.recC) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Capital: Bens permanentes e equipamentos patrimoniais"><span style="color: #64748b; font-weight: 600;">Capital (K):</span> ' + formatarMoedaBrl(r.recK) + '</div></td>';
        html += '<td style="padding: 8px 14px; text-align: right; vertical-align: middle;"><div style="font-weight: 800; color: #047857; font-size: 0.92rem; line-height: 1.25; margin-bottom: 3px;">' + formatarMoedaBrl(r.despTotal) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Custeio: Gastos executados em consumo/serviços"><span style="color: #64748b; font-weight: 600;">Custeio (C):</span> ' + formatarMoedaBrl(r.despC) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Capital: Gastos executados em equipamentos permanentes"><span style="color: #64748b; font-weight: 600;">Capital (K):</span> ' + formatarMoedaBrl(r.despK) + '</div></td>';
        html += '<td style="padding: 10px 14px; text-align: right;"><div style="font-weight: 800; color: #b45309; font-size: 0.92rem;">' + formatarMoedaBrl(r.saldoTotal) + '</div></td>';`;

const newSefinTr = `html += '<td style="padding: 10px 14px; font-weight: 800; color: #0f172a; font-size: 0.88rem; text-align: center;">' + r.ano + '</td>';
        html += '<td style="padding: 10px 14px; text-align: left;"><div style="font-weight: 800; color: #0f172a; font-size: 0.88rem; line-height: 1.35;">' + r.escola + '</div><div style="font-size: 0.74rem; font-weight: 700; color: #0284c7; margin-top: 3px;">CIE: ' + r.cie + '</div></td>';
        html += '<td style="padding: 10px 14px; text-align: center;"><div style="color: #0f172a; font-weight: 700; font-size: 0.82rem; line-height: 1.3; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">' + r.programa + ' ' + tagOrigem + '</div></td>';
        html += '<td style="padding: 8px 14px; text-align: center; vertical-align: middle;"><div style="font-weight: 800; color: #0369a1; font-size: 0.92rem; line-height: 1.25; margin-bottom: 3px;">' + formatarMoedaBrl(r.recTotal) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Custeio: Materiais de consumo e pequenos reparos"><span style="color: #64748b; font-weight: 600;">Custeio (C):</span> ' + formatarMoedaBrl(r.recC) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Capital: Bens permanentes e equipamentos patrimoniais"><span style="color: #64748b; font-weight: 600;">Capital (K):</span> ' + formatarMoedaBrl(r.recK) + '</div></td>';
        html += '<td style="padding: 8px 14px; text-align: center; vertical-align: middle;"><div style="font-weight: 800; color: #047857; font-size: 0.92rem; line-height: 1.25; margin-bottom: 3px;">' + formatarMoedaBrl(r.despTotal) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Custeio: Gastos executados em consumo/serviços"><span style="color: #64748b; font-weight: 600;">Custeio (C):</span> ' + formatarMoedaBrl(r.despC) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Capital: Gastos executados em equipamentos permanentes"><span style="color: #64748b; font-weight: 600;">Capital (K):</span> ' + formatarMoedaBrl(r.despK) + '</div></td>';
        html += '<td style="padding: 10px 14px; text-align: center;"><div style="font-weight: 800; color: #b45309; font-size: 0.92rem;">' + formatarMoedaBrl(r.saldoTotal) + '</div></td>';`;

if (html.includes(oldSefinTr)) {
  html = html.replace(oldSefinTr, newSefinTr);
  console.log('✓ Células TD da tabela SEFIN centralizadas com escola alinhada à esquerda');
} else {
  console.warn('! Células TD da tabela SEFIN não encontradas');
}


// =========================================================================
// 3. REFINAMENTO DAS TABELAS DE HARDWARE E ATENDIMENTOS DO SEINTEC
// =========================================================================

const oldHwTr = `          const tr = document.createElement('tr');
          tr.innerHTML = \`
            <td>
              <strong style="color: var(--text-main); font-size: 0.88rem;">\${nomeEscola}</strong>
              <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-top: 2px;">CIE: \${cie}</div>
            </td>
            <td><span style="font-size: 0.82rem; color: #475569;">\${ambiente}</span></td>
            <td><span style="display: inline-flex; align-items: center; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; color: #334155; padding: 0.22rem 0.55rem; border-radius: 6px; border: 1px solid #cbd5e1;">\${categoria}</span></td>
            <td><strong style="color: #1e293b; font-size: 0.85rem;">\${equipamento}</strong></td>
            <td><code style="font-size: 0.78rem; background: #f8fafc; padding: 3px 6px; border-radius: 4px; color: #0f172a; border: 1px solid #e2e8f0; font-family: monospace;">\${serie}</code></td>
            <td style="text-align: center;"><span class="status-badge-inline \${statusBadgeClass}" style="\${statusBadgeStyle}">\${statusRaw}</span></td>
          \`;`;

const newHwTr = `          const tr = document.createElement('tr');
          tr.innerHTML = \`
            <td style="text-align: left;">
              <strong style="color: var(--text-main); font-size: 0.88rem;">\${nomeEscola}</strong>
              <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-top: 2px;">CIE: \${cie}</div>
            </td>
            <td style="text-align: center;"><span style="font-size: 0.82rem; color: #475569;">\${ambiente}</span></td>
            <td style="text-align: center;"><span style="display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; color: #334155; padding: 0.22rem 0.55rem; border-radius: 6px; border: 1px solid #cbd5e1;">\${categoria}</span></td>
            <td style="text-align: center;"><strong style="color: #1e293b; font-size: 0.85rem;">\${equipamento}</strong></td>
            <td style="text-align: center;"><code style="font-size: 0.78rem; background: #f8fafc; padding: 3px 6px; border-radius: 4px; color: #0f172a; border: 1px solid #e2e8f0; font-family: monospace;">\${serie}</code></td>
            <td style="text-align: center;"><span class="status-badge-inline \${statusBadgeClass}" style="\${statusBadgeStyle}">\${statusRaw}</span></td>
          \`;`;

if (html.includes(oldHwTr)) {
  html = html.replace(oldHwTr, newHwTr);
  console.log('✓ Tabela de Hardware SEINTEC centralizada com escola à esquerda');
} else {
  console.warn('! Tabela de Hardware SEINTEC não encontrada');
}


// =========================================================================
// 4. CSS GLOBAL DE PADRONIZAÇÃO DE TABELAS (REGRAS EXECUTIVAS)
// =========================================================================

const oldCssTableDef = `    .records-table td,
    .escolas-table td,
    #tabela-repasses-sefin td {
      text-align: left;
      vertical-align: middle;
      line-height: 1.45;
    }`;

const newCssTableDef = `    /* REGRAS EXECUTIVAS GLOBAIS DE ALINHAMENTO DE TABELAS */
    .records-table th,
    .escolas-table th,
    #tabela-repasses-sefin th,
    table th {
      text-align: center !important;
      vertical-align: middle !important;
    }

    .records-table td,
    .escolas-table td,
    #tabela-repasses-sefin td,
    table td {
      text-align: center;
      vertical-align: middle;
      line-height: 1.45;
    }

    /* Colunas de Nome de Escola: Rigorosamente alinhadas à esquerda com tipografia de destaque */
    .records-table td.td-school,
    .records-table td.td-escola,
    .escolas-table td.td-escola,
    .escolas-table td:nth-child(2),
    #tabela-repasses-sefin td:nth-child(2),
    .escola-name-cell,
    .td-escola-nome {
      text-align: left !important;
    }

    /* Células de observações, relatos, descrições ou demandas longas: Justificadas */
    .td-relato,
    .td-observacao,
    .td-demanda,
    .records-table td.td-justified,
    .records-table td p,
    .records-table td .obs-text,
    .escolas-table td.td-justified {
      text-align: justify !important;
      text-justify: inter-word !important;
      line-height: 1.5 !important;
    }`;

if (html.includes(oldCssTableDef)) {
  html = html.replace(oldCssTableDef, newCssTableDef);
  console.log('✓ CSS Global de Tabelas atualizado');
} else {
  console.warn('! CSS Global de Tabelas não encontrado');
}


// Restaurar CRLF se o original era CRLF
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html gravado com sucesso!');
