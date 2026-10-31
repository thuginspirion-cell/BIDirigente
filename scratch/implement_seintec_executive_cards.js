// scratch/implement_seintec_executive_cards.js
const fs = require('fs');

console.log('Implementando cartões SEINTEC no mesmo padrão executivo de excelência da SEFIN...');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Ocultar o badge flutuante antigo que poluía o topo
html = html.replace(
  /\.inv-kpi-badge-active\s*\{[^}]*\}/g,
  `.inv-kpi-badge-active { display: none !important; }`
);

// 2. Localizar o trecho exato dos 5 cards dentro de #seintec-inventario-kpi-bar
const pStart = html.indexOf('<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">');
if (pStart === -1) {
  console.error('Grid não encontrada');
  process.exit(1);
}

const targetEndMarker = '<!-- 5. Inservíveis / Descarte -->';
const pCard5 = html.indexOf(targetEndMarker, pStart);
const pEnd = html.indexOf('</div>\n              </div>\n            </div>', pCard5);

if (pEnd === -1) {
  console.error('Fim do container não encontrado');
  process.exit(1);
}

const currentGridHtml = html.substring(pStart, pEnd + 21);

// Criar o novo Grid Executivo idêntico ao padrão SEFIN (mesmo visual executivo limpo, badge sutil no canto superior direito, títulos alinhados à esquerda, número centralizado grande e rodapé suave com borda divisória)
const newGridHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
                
                <!-- CARD 1: TOTAL DO PARQUE -->
                <div class="inv-kpi-card selected" id="inv-kpi-total" onclick="filtrarInventarioPorStatus('todos', this)" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); cursor: pointer; transition: all 0.2s ease;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em;">Total do Parque</span>
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                      </div>
                    </div>
                    <div id="inv-kpi-val-total" style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">15.873</div>
                  </div>
                  <div id="inv-kpi-sub-total" style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                    <span>100% Mapeados</span>
                    <span style="color: #64748b; font-weight: 600;">Ativos Totais</span>
                  </div>
                </div>

                <!-- CARD 2: DISPONÍVEIS (UPTIME) -->
                <div class="inv-kpi-card" id="inv-kpi-disponivel" onclick="filtrarInventarioPorStatus('Disponível', this)" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); cursor: pointer; transition: all 0.2s ease;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em;">Disponíveis (Uptime)</span>
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                    </div>
                    <div id="inv-kpi-val-disponivel" style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">12.105</div>
                  </div>
                  <div id="inv-kpi-sub-disponivel" style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 800;">
                    <span>76,3% em uso normal</span>
                    <span style="color: #64748b; font-weight: 600;">Operacional</span>
                  </div>
                </div>

                <!-- CARD 3: DANIFICADOS (ATENÇÃO) -->
                <div class="inv-kpi-card" id="inv-kpi-danificado" onclick="filtrarInventarioPorStatus('Danificado', this)" style="background: #ffffff; border: 1.5px solid #fecaca; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08); cursor: pointer; transition: all 0.2s ease;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-size: 0.78rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.03em;">Danificados (Atenção)</span>
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #fee2e2; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fecaca;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      </div>
                    </div>
                    <div id="inv-kpi-val-danificado" style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b91c1c; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">1.674</div>
                  </div>
                  <div id="inv-kpi-sub-danificado" style="font-size: 0.74rem; color: #b91c1c; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 800;">
                    <span>10,5% requerem reparo</span>
                    <span style="color: #64748b; font-weight: 600;">Sinistros</span>
                  </div>
                </div>

                <!-- CARD 4: EM MANUTENÇÃO / OS -->
                <div class="inv-kpi-card" id="inv-kpi-manutencao" onclick="filtrarInventarioPorStatus('Em manutenção', this)" style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); cursor: pointer; transition: all 0.2s ease;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em;">Em Manutenção / OS</span>
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                      </div>
                    </div>
                    <div id="inv-kpi-val-manutencao" style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">1.144</div>
                  </div>
                  <div id="inv-kpi-sub-manutencao" style="font-size: 0.74rem; color: #78350f; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 800;">
                    <span>7,2% em assistência/OS</span>
                    <span style="color: #64748b; font-weight: 600;">Em Aberto</span>
                  </div>
                </div>

                <!-- CARD 5: INSERVÍVEIS (BAIXA) -->
                <div class="inv-kpi-card" id="inv-kpi-inservivel" onclick="filtrarInventarioPorStatus('Inservível', this)" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); cursor: pointer; transition: all 0.2s ease;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-size: 0.78rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.03em;">Inservíveis (Baixa)</span>
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #cbd5e1;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                      </div>
                    </div>
                    <div id="inv-kpi-val-inservivel" style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">950</div>
                  </div>
                  <div id="inv-kpi-sub-inservivel" style="font-size: 0.74rem; color: #475569; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                    <span>6,0% p/ descarte</span>
                    <span style="color: #64748b; font-weight: 600;">Baixa Definitiva</span>
                  </div>
                </div>

              </div>`;

html = html.replace(currentGridHtml, newGridHtml);
console.log('✓ Substituição do grid executivo SEINTEC concluída');

// Restaurar CRLF se o arquivo original era CRLF
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html atualizado!');
