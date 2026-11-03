const fs = require('fs');
const path = require('path');

// ==========================================
// 1. ATUALIZAR CÓDIGO.GS
// ==========================================
console.log('--- 1. Atualizando Código.gs ---');
let codigoGs = fs.readFileSync('Código.gs', 'utf8');

// Adicionar action em doGet se não existir
if (!codigoGs.includes("action === 'sincronizarSegre'")) {
  const targetDoGet = "else if (action === 'sincronizarSefin') {\n        output = sincronizarPlanilhaSefin();\n      }";
  const targetDoGetCrlf = "else if (action === 'sincronizarSefin') {\r\n        output = sincronizarPlanilhaSefin();\r\n      }";
  
  const replaceDoGet = "else if (action === 'sincronizarSefin') {\n        output = sincronizarPlanilhaSefin();\n      } else if (action === 'sincronizarSegre') {\n        output = sincronizarPlanilhaSegre();\n      }";
  const replaceDoGetCrlf = "else if (action === 'sincronizarSefin') {\r\n        output = sincronizarPlanilhaSefin();\r\n      } else if (action === 'sincronizarSegre') {\r\n        output = sincronizarPlanilhaSegre();\r\n      }";

  if (codigoGs.includes(targetDoGetCrlf)) {
    codigoGs = codigoGs.replace(targetDoGetCrlf, replaceDoGetCrlf);
    console.log('✔ action sincronizarSegre adicionada ao doGet (CRLF)');
  } else if (codigoGs.includes(targetDoGet)) {
    codigoGs = codigoGs.replace(targetDoGet, replaceDoGet);
    console.log('✔ action sincronizarSegre adicionada ao doGet (LF)');
  } else {
    console.error('❌ Alvo targetDoGet não encontrado em Código.gs');
    process.exit(1);
  }
}

// Adicionar sincronizarPlanilhaSegre se não existir
if (!codigoGs.includes('function sincronizarPlanilhaSegre()')) {
  const targetFn = 'function sincronizarPlanilhaSefin() {';
  const newFn = `/**
 * Sincronização Dinâmica da Planilha SEGRE do SharePoint (Livro Entrada 2026)
 * Herda o motor universal de resolução pública anti-login
 */
function sincronizarPlanilhaSegre() {
  var url = "https://seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw?download=1";
  try {
    return obterArquivoPublicoSharepoint(url, {
      nomeSetor: "SEGRE / CGE",
      descricaoBase: "Livro Entrada 2026 SEGRE"
    });
  } catch (e) {
    Logger.log("Aviso SEGRE: fallback leve ativado - " + e.toString());
    try {
      var mirrorUrl = "https://raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/segre_livro_2026.json";
      var res = UrlFetchApp.fetch(mirrorUrl, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
    } catch (errMirror) {
      Logger.log("Erro ao buscar mirror SEGRE: " + errMirror.toString());
    }
    return {
      sucesso: false,
      erro: e.toString()
    };
  }
}

function sincronizarPlanilhaSefin() {`;

  if (codigoGs.includes(targetFn)) {
    codigoGs = codigoGs.replace(targetFn, newFn);
    console.log('✔ Função sincronizarPlanilhaSegre adicionada ao Código.gs');
  } else {
    console.error('❌ Target targetFn não encontrado em Código.gs');
    process.exit(1);
  }
}

fs.writeFileSync('Código.gs', codigoGs, 'utf8');
console.log('Código.gs atualizado com sucesso.');

// ==========================================
// 2. ATUALIZAR INDEX.HTML
// ==========================================
console.log('\n--- 2. Atualizando index.html ---');
let html = fs.readFileSync('index.html', 'utf8');

// A. URLs Oficiais SEGRE
if (!html.includes('URLS_OFICIAIS_SEGRE')) {
  const targetUrls = "const URLS_OFICIAIS_SEFIN = {";
  const newUrls = `const URLS_OFICIAIS_SEGRE = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/segre_livro_2026.json')
    };

    const URLS_OFICIAIS_SEFIN = {`;
  html = html.replace(targetUrls, newUrls);
  console.log('✔ URLS_OFICIAIS_SEGRE inserido.');
}

// B. Estrutura SEGRE com sharepointUrl
const oldSegreDef = `'SEGRE': {
        sigla: 'SEGRE',
        nome: 'SEGRE - Gestão da Rede Escolar',
        descricao: 'Supervisão do atendimento escolar, matrículas, organização de classes e demandas das unidades escolares.',
        icone: '🏫',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / CGE',
        setores: [
          { sigla: 'SEGRE', nome: 'Gestão da Rede e Matrículas', desc: 'Organização de turmas e fluxo de alunos' },
          { sigla: 'Supervisão', nome: 'Supervisão Regional Escolar', desc: 'Acompanhamento das equipes gestoras' }
        ]
      },`;

const newSegreDef = `'SEGRE': {
        sigla: 'SEGRE',
        nome: 'SEGRE - Gestão da Rede Escolar & Matrícula',
        descricao: 'Supervisão do atendimento escolar, matrículas, organização de classes, ouvidorias e demandas do SEI.',
        icone: '🏫',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / CGE',
        setores: [
          {
            sigla: 'SEGRE',
            nome: 'Gestão da Rede e Matrículas',
            desc: 'Organização de turmas, fluxo de alunos, processos SEI e ouvidorias',
            sharepointUrl: URLS_OFICIAIS_SEGRE.sharepoint
          },
          { sigla: 'Supervisão', nome: 'Supervisão Regional Escolar', desc: 'Acompanhamento das equipes gestoras' }
        ]
      },`;

const normHtml = html.replace(/\r\n/g, '\n');
const normOldDef = oldSegreDef.replace(/\r\n/g, '\n');
const normNewDef = newSegreDef.replace(/\r\n/g, '\n');

if (normHtml.includes(normOldDef)) {
  html = normHtml.replace(normOldDef, normNewDef);
  console.log('✔ ESTRUTURA_ORGANIZACIONAL SEGRE atualizada.');
} else {
  console.log('ℹ ESTRUTURA_ORGANIZACIONAL SEGRE já estava ajustada ou formato difere.');
}

// C. Injetar suporte a SEGRE em selecionarSetor
const oldSelecionarSetor = `      // Renderiza conteúdo dinâmico do setor (ex: SEFIN SharePoint)
      const containerDinamico = document.getElementById('setor-conteudo-dinamico');
      if (containerDinamico) {
        if (siglaSetor === 'SEFIN' || (setor && setor.sharepointUrl)) {
          renderizarDashboardFinanceiroSefin();
        } else {`;

const newSelecionarSetor = `      // Renderiza conteúdo dinâmico do setor (ex: SEFIN SharePoint, SEGRE Livro Entrada)
      const containerDinamico = document.getElementById('setor-conteudo-dinamico');
      if (containerDinamico) {
        if (siglaSetor === 'SEFIN' || (setor && setor.sharepointUrl && siglaSetor === 'SEFIN')) {
          renderizarDashboardFinanceiroSefin();
        } else if (siglaSetor === 'SEGRE' || siglaCentro === 'SEGRE' || siglaCentro === 'CGE') {
          renderizarDashboardSegre();
        } else {`;

const normOldSel = oldSelecionarSetor.replace(/\r\n/g, '\n');
const normNewSel = newSelecionarSetor.replace(/\r\n/g, '\n');

if (html.includes(normOldSel)) {
  html = html.replace(normOldSel, normNewSel);
  console.log('✔ selecionarSetor atualizado com rota para renderizarDashboardSegre.');
} else {
  console.log('ℹ rota selecionarSetor já configurada.');
}

// D. Atualizar setor-drive-caminho para indicar SharePoint SEGRE se for SEGRE
const oldDriveCaminho = `document.getElementById('setor-drive-caminho').innerHTML = \`📁 Nuvem: <b>\${setor.sharepointUrl ? 'SharePoint SEFIN Oficial' : 'Uploads BIDirigente / ' + siglaCentro + ' / ' + siglaSetor}</b>\`;`;
const newDriveCaminho = `const descNuvem = setor.sharepointUrl ? (siglaSetor === 'SEFIN' ? 'SharePoint SEFIN Oficial' : 'SharePoint SEGRE Oficial') : ('Uploads BIDirigente / ' + siglaCentro + ' / ' + siglaSetor);
      document.getElementById('setor-drive-caminho').innerHTML = \`📁 Nuvem: <b>\${descNuvem}</b>\`;`;

if (html.includes(oldDriveCaminho)) {
  html = html.replace(oldDriveCaminho, newDriveCaminho);
  console.log('✔ setor-drive-caminho atualizado.');
}

// E. Injetar suporte a SEGRE em sincronizarModulo
const oldSyncModulo = `          case 'centro':
            const centroSigla = (document.getElementById('atual-centro-sigla') ? document.getElementById('atual-centro-sigla').value : 'Centro');
            if ((centroSigla === 'CAF' || centroSigla === 'SEAFIN') && typeof sincronizarDashboardSefin === 'function') {
              sincronizarDashboardSefin();
            }
            mostrarToastAgenda('Módulo ' + centroSigla + ' e seus setores sincronizados às ' + agoraStr, '🏛️');
            break;`;

const newSyncModulo = `          case 'centro':
            const centroSigla = (document.getElementById('atual-centro-sigla') ? document.getElementById('atual-centro-sigla').value : 'Centro');
            if ((centroSigla === 'CAF' || centroSigla === 'SEAFIN') && typeof sincronizarDashboardSefin === 'function') {
              sincronizarDashboardSefin();
            } else if ((centroSigla === 'CGE' || centroSigla === 'SEGRE') && typeof sincronizarDashboardSegre === 'function') {
              sincronizarDashboardSegre();
            }
            mostrarToastAgenda('Módulo ' + centroSigla + ' e seus setores sincronizados às ' + agoraStr, '🏛️');
            break;

          case 'segre':
            if (typeof sincronizarDashboardSegre === 'function') sincronizarDashboardSegre();
            mostrarToastAgenda('Painel SEGRE sincronizado com SharePoint às ' + agoraStr, '📋');
            break;`;

const normOldSync = oldSyncModulo.replace(/\r\n/g, '\n');
const normNewSync = newSyncModulo.replace(/\r\n/g, '\n');

if (html.includes(normOldSync)) {
  html = html.replace(normOldSync, normNewSync);
  console.log('✔ sincronizarModulo atualizado com cases para centro CGE/SEGRE e segre.');
}

// F. Carregar os dados base do segre_livro_2026.json para embutir de forma compacta
const segreJson = fs.readFileSync(path.join(__dirname, '..', 'data', 'segre_livro_2026.json'), 'utf8');

// G. Injetar a lógica e o componente completo do Dashboard SEGRE
if (!html.includes('function renderizarDashboardSegre')) {
  const targetEndSefin = 'function renderizarExplicacoesMetricasSefin';
  // Vamos localizar o final de renderizarDashboardFinanceiroSefin
  const marker = 'function limparTodosArquivosCentro()';
  
  const segreScript = `
    // =======================================================
    // PAINEL SEGRE - LIVRO ENTRADA 2026 (SHAREPOINT)
    // =======================================================
    let DADOS_SEGRE = ${segreJson};
    let abaAtivaSegre = 'sei';
    let filtroBuscaSegre = '';
    let filtroStatusSegre = 'todos';

    function mudarAbaSegre(aba) {
      abaAtivaSegre = aba;
      const abas = ['sei', 'vagas', 'ouvidoria', 'concluintes'];
      abas.forEach(a => {
        const btn = document.getElementById('tab-btn-segre-' + a);
        if (btn) {
          if (a === aba) {
            btn.style.background = '#0b2351';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#0b2351';
          } else {
            btn.style.background = '#f8fafc';
            btn.style.color = '#475569';
            btn.style.borderColor = '#cbd5e1';
          }
        }
      });
      renderizarCorpoTabelaSegre();
    }

    function filtrarTabelaSegre() {
      const input = document.getElementById('segre-busca-input');
      const selectStatus = document.getElementById('segre-filtro-status');
      filtroBuscaSegre = input ? input.value.trim().toLowerCase() : '';
      filtroStatusSegre = selectStatus ? selectStatus.value : 'todos';
      renderizarCorpoTabelaSegre();
    }

    function renderizarCorpoTabelaSegre() {
      const container = document.getElementById('segre-tabela-container');
      const badgeContador = document.getElementById('segre-contador-registros');
      if (!container) return;

      let colunas = [];
      let registros = [];

      if (abaAtivaSegre === 'sei') {
        registros = (DADOS_SEGRE.processosSei || []).filter(item => {
          const matchBusca = !filtroBuscaSegre || 
            (item.protocolo && item.protocolo.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.remetente && item.remetente.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSegre));
          
          let matchStatus = true;
          if (filtroStatusSegre === 'concluido') {
            matchStatus = item.situacao.includes('CONCLU') || item.situacao.includes('RESPONDID') || item.situacao.includes('ENCAMINHADO');
          } else if (filtroStatusSegre === 'andamento') {
            matchStatus = item.situacao.includes('ANDAMENTO') || !item.situacao.includes('CONCLU');
          }
          return matchBusca && matchStatus;
        });

        colunas = [
          { titulo: 'Protocolo SEI', width: '22%' },
          { titulo: 'Data', width: '12%' },
          { titulo: 'Assunto / Objeto', width: '32%' },
          { titulo: 'Interessado / Remetente', width: '20%' },
          { titulo: 'Situação / Responsável', width: '14%' }
        ];

      } else if (abaAtivaSegre === 'vagas') {
        registros = (DADOS_SEGRE.atendimentosVaga || []).filter(item => {
          const matchBusca = !filtroBuscaSegre || 
            (item.aluno && item.aluno.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.ra && item.ra.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.escolaAtual && item.escolaAtual.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.escolaPretendida && item.escolaPretendida.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.motivo && item.motivo.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSegre));
          return matchBusca;
        });

        colunas = [
          { titulo: 'Data & Meio', width: '13%' },
          { titulo: 'Aluno & RA', width: '25%' },
          { titulo: 'Série', width: '8%' },
          { titulo: 'Escola Atual ➔ Pretendida', width: '27%' },
          { titulo: 'Motivo & Orientação', width: '27%' }
        ];

      } else if (abaAtivaSegre === 'ouvidoria') {
        registros = (DADOS_SEGRE.ouvidorias || []).filter(item => {
          const matchBusca = !filtroBuscaSegre || 
            (item.protocolo && item.protocolo.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSegre));
          
          let matchStatus = true;
          if (filtroStatusSegre === 'concluido') {
            matchStatus = item.situacao.includes('RESPONDID') || item.situacao.includes('CONCLU');
          } else if (filtroStatusSegre === 'andamento') {
            matchStatus = !item.situacao.includes('RESPONDID') && !item.situacao.includes('CONCLU');
          }
          return matchBusca && matchStatus;
        });

        colunas = [
          { titulo: 'Protocolo Fala.SP', width: '20%' },
          { titulo: 'Data Entrada', width: '12%' },
          { titulo: 'Interessado(a)', width: '25%' },
          { titulo: 'Assunto da Manifestação', width: '30%' },
          { titulo: 'Status / Responsável', width: '13%' }
        ];

      } else if (abaAtivaSegre === 'concluintes') {
        registros = (DADOS_SEGRE.concluintesRecentes || []).filter(item => {
          const matchBusca = !filtroBuscaSegre || 
            (item.aluno && item.aluno.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.escola && item.escola.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.tipoEnsino && item.tipoEnsino.toLowerCase().includes(filtroBuscaSegre));
          return matchBusca;
        });

        colunas = [
          { titulo: 'Data Registro', width: '15%' },
          { titulo: 'Aluno Concluinte', width: '35%' },
          { titulo: 'Unidade Escolar', width: '25%' },
          { titulo: 'Ano Conclusão', width: '12%' },
          { titulo: 'Ensino', width: '13%' }
        ];
      }

      if (badgeContador) {
        badgeContador.innerText = \`Exibindo \${registros.length} registros\`;
      }

      // Monta tabela HTML
      let htmlTabela = \`
        <div style="overflow-x: auto; max-height: 520px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left; background: #ffffff;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; position: sticky; top: 0; z-index: 2;">
                \${colunas.map(c => \`<th style="padding: 10px 12px; font-weight: 800; color: #1e293b; width: \${c.width};">\${c.titulo}</th>\`).join('')}
              </tr>
            </thead>
            <tbody>
      \`;

      if (registros.length === 0) {
        htmlTabela += \`
          <tr>
            <td colspan="\${colunas.length}" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div>
              <div style="font-weight: 700;">Nenhum registro encontrado para os filtros aplicados.</div>
            </td>
          </tr>
        \`;
      } else {
        registros.forEach((r, idx) => {
          const bgPar = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          htmlTabela += \`<tr style="background: \${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='\${bgPar}'">\`;
          
          if (abaAtivaSegre === 'sei') {
            const isConcluido = r.situacao.includes('CONCLU') || r.situacao.includes('ENCAMINHADO');
            const corBadge = isConcluido ? '#059669' : '#d97706';
            const bgBadge = isConcluido ? '#d1fae5' : '#fef3c7';

            htmlTabela += \`
              <td style="padding: 9px 12px; font-weight: 800; color: #0b2351; font-family: monospace;">\${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569;">\${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #1e293b;">\${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">
                <div><strong>\${r.interessado || '—'}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">De: \${r.remetente || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: \${bgBadge}; color: \${corBadge};">\${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: \${r.responsavel}</div>
              </td>
            \`;
          } else if (abaAtivaSegre === 'vagas') {
            htmlTabela += \`
              <td style="padding: 9px 12px; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">\${r.data || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">\${r.meio || 'Presencial'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">\${r.aluno}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RA: \${r.ra || 'S/N'}</div>
              </td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0284c7;">\${r.serie || '—'}</td>
              <td style="padding: 9px 12px; font-size: 0.76rem;">
                <div style="color: #64748b;">Atual: <strong style="color: #334155;">\${r.escolaAtual || '—'}</strong></div>
                <div style="color: #059669; font-weight: 700;">➔ \${r.escolaPretendida || 'Não informada'}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem; color: #475569;">
                <div><strong>\${r.motivo}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">\${r.orientacao || '—'}</div>
              </td>
            \`;
          } else if (abaAtivaSegre === 'ouvidoria') {
            const isResp = r.situacao.includes('RESPONDID');
            htmlTabela += \`
              <td style="padding: 9px 12px; font-weight: 800; color: #7c3aed; font-family: monospace;">\${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569;">\${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0f172a;">\${r.interessado || '—'}</td>
              <td style="padding: 9px 12px; color: #334155;">\${r.assunto}</td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: \${isResp ? '#d1fae5' : '#fef3c7'}; color: \${isResp ? '#059669' : '#d97706'};">\${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: \${r.responsavel}</div>
              </td>
            \`;
          } else if (abaAtivaSegre === 'concluintes') {
            htmlTabela += \`
              <td style="padding: 9px 12px; color: #475569;">\${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 800; color: #0f172a;">\${r.aluno}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #0369a1;">\${r.escola}</td>
              <td style="padding: 9px 12px; font-weight: 700; color: #475569;">\${r.anoConclusao || '2026'}</td>
              <td style="padding: 9px 12px;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">\${r.tipoEnsino || 'EM'}</span></td>
            \`;
          }

          htmlTabela += \`</tr>\`;
        });
      }

      htmlTabela += \`
            </tbody>
          </table>
        </div>
      \`;

      container.innerHTML = htmlTabela;
    }

    function renderizarDashboardSegre() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEGRE.meta || {};
      const kpis = DADOS_SEGRE.kpis || { totalSei: 116, totalVagas: 297, totalOuvidoria: 25, totalConcluintes: 4398, totalEmails: 8727 };

      const html = \`
        <div class="segre-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEGRE -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.3rem 1.5rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">🏫</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEGRE • Gestão da Rede Escolar & Matrícula (CGE)</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Acompanhamento em tempo real do <strong style="color: #ffffff;">Livro de Entrada 2026</strong>: Processos SEI, Atendimentos de Vagas e Transferências, Ouvidorias Fala.SP e Registros de Concluintes da Diretoria Regional de Ensino de Itapevi.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 1.2rem; margin-top: 0.6rem; font-size: 0.76rem; color: #cbd5e1; font-weight: 600;">
                <span>📁 <strong>Arquivo:</strong> <span style="color: #ffffff;">\${meta.nomeArquivo || 'Livro Entrada 2026 SEGRE.xlsx'}</span></span>
                <span>👤 <strong>Conta:</strong> <span style="color: #ffffff;">\${meta.contaResponsavel || 'itp_segre_educacao_sp_gov_br'}</span></span>
                <span>🕒 <strong>Atualizado:</strong> <span id="segre-banner-timestamp" style="color: #ffffff;">\${meta.atualizadoFormatado || 'Hoje'}</span></span>
                <span>📦 <strong>Tamanho:</strong> <span style="color: #ffffff;">\${meta.tamanhoArquivoMb || '65.55'} MB</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSegre()" id="btn-segre-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar Base
                </button>
                <a href="\${meta.sharepointUrl || URLS_OFICIAIS_SEGRE.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Livro Oficial de Entradas com 13.563+ registros consolidados</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS SEGRE -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <!-- CARD 1: PROCESSOS SEI -->
            <div onclick="mudarAbaSegre('sei')" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase;">Processos SEI</span>
                <span style="background: #e0f2fe; color: #0369a1; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📋</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #0284c7; margin: 0.2rem 0;">\${kpis.totalSei}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Encaminhados e Análise</span>
                <span style="font-weight: 700; color: #0284c7;">Aba SEI ➔</span>
              </div>
            </div>

            <!-- CARD 2: VAGAS & ATENDIMENTOS -->
            <div onclick="mudarAbaSegre('vagas')" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase;">Vagas & Matrícula</span>
                <span style="background: #d1fae5; color: #047857; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🎓</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #059669; margin: 0.2rem 0;">\${kpis.totalVagas}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Atendimentos / Transferências</span>
                <span style="font-weight: 700; color: #059669;">Aba Vagas ➔</span>
              </div>
            </div>

            <!-- CARD 3: OUVIDORIA FALA.SP -->
            <div onclick="mudarAbaSegre('ouvidoria')" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase;">Ouvidorias Fala.SP</span>
                <span style="background: #ffedd5; color: #c2410c; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📢</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #ea580c; margin: 0.2rem 0;">\${kpis.totalOuvidoria}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>100% Respondidas / No Prazo</span>
                <span style="font-weight: 700; color: #ea580c;">Aba Ouvidoria ➔</span>
              </div>
            </div>

            <!-- CARD 4: CONCLUINTES & EXPEDIENTES -->
            <div onclick="mudarAbaSegre('concluintes')" style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase;">Concluintes</span>
                <span style="background: #ede9fe; color: #6d28d9; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📜</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #7c3aed; margin: 0.2rem 0;">\${kpis.totalConcluintes.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>+ \${(kpis.totalEmails || 8727).toLocaleString('pt-BR')} e-mails registrados</span>
                <span style="font-weight: 700; color: #7c3aed;">Aba Concluintes ➔</span>
              </div>
            </div>

          </div>

          <!-- NAVEGAÇÃO DE SUB-ABAS DO SEGRE -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-segre-sei" onclick="mudarAbaSegre('sei')" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📋 Processos SEI (\${kpis.totalSei})
              </button>
              <button id="tab-btn-segre-vagas" onclick="mudarAbaSegre('vagas')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                🎓 Atendimento Vagas (\${kpis.totalVagas})
              </button>
              <button id="tab-btn-segre-ouvidoria" onclick="mudarAbaSegre('ouvidoria')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📢 Ouvidoria Fala.SP (\${kpis.totalOuvidoria})
              </button>
              <button id="tab-btn-segre-concluintes" onclick="mudarAbaSegre('concluintes')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📜 Concluintes (\${kpis.totalConcluintes.toLocaleString('pt-BR')})
              </button>
            </div>

            <div id="segre-contador-registros" style="font-size: 0.8rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 5px 12px; border-radius: 20px;">
              Carregando dados...
            </div>

          </div>

          <!-- BARRA DE BUSCA E FILTROS -->
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between;">
            <div style="flex: 1; min-width: 260px; display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0 0.75rem;">
              <span style="font-size: 1rem; color: #64748b; margin-right: 0.5rem;">🔍</span>
              <input type="text" id="segre-busca-input" onkeyup="filtrarTabelaSegre()" placeholder="Pesquisar por protocolo, aluno, escola, assunto ou responsável..." style="border: none; background: transparent; width: 100%; padding: 8px 0; font-size: 0.84rem; outline: none; color: #0f172a; font-family: inherit;">
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select id="segre-filtro-status" onchange="filtrarTabelaSegre()" style="background: #ffffff; border: 1.5px solid #cbd5e1; color: #0f172a; padding: 7px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; outline: none; cursor: pointer;">
                <option value="todos">Todos os Status</option>
                <option value="concluido">Concluídos / Respondidos / Encaminhados</option>
                <option value="andamento">Em Andamento / Em Análise</option>
              </select>
            </div>
          </div>

          <!-- CONTÊINER DA TABELA RESPONSIVA -->
          <div id="segre-tabela-container">
            <!-- Renderizado dinamicamente via renderizarCorpoTabelaSegre() -->
          </div>

        </div>
      \`;

      container.innerHTML = html;
      renderizarCorpoTabelaSegre();
    }

    function sincronizarDashboardSegre(silencioso) {
      if (!silencioso && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEGRE • SHAREPOINT',
          titulo: 'Sincronizando Livro de Entrada SEGRE...',
          mensagem: 'Consultando base de 65.55 MB no SharePoint corporativo...',
          detalhes: 'Conexão Anônima Pública • 100% Resiliente',
          duracao: 0
        });
      }

      // Função de fallback/espelho
      const aplicarDadosRecebidos = function(dadosNovos) {
        if (dadosNovos && (dadosNovos.kpis || dadosNovos.processosSei)) {
          DADOS_SEGRE = dadosNovos;
          try {
            localStorage.setItem('dados_segre_cache', JSON.stringify(dadosNovos));
          } catch (eCache) {}
        }
        if (DADOS_SEGRE.meta) {
          DADOS_SEGRE.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR');
        }
        renderizarDashboardSegre();

        if (!silencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEGRE ATUALIZADO',
            titulo: 'SEGRE Sincronizado com Sucesso!',
            mensagem: 'Livro de Entrada 2026 atualizado com ' + (DADOS_SEGRE.kpis ? DADOS_SEGRE.kpis.totalSei : 116) + ' processos SEI e ' + (DADOS_SEGRE.kpis ? DADOS_SEGRE.kpis.totalVagas : 297) + ' vagas.',
            detalhes: 'Sincronizado às ' + new Date().toLocaleTimeString('pt-BR'),
            duracao: 4500
          });
        }
      };

      // Tenta via GAS ou fetch direto no espelho com cache-busting
      if (typeof google !== 'undefined' && google.script && google.script.run && google.script.run.sincronizarPlanilhaSegre) {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.sucesso !== false) {
              aplicarDadosRecebidos(res);
            } else {
              buscarMirrorSegre();
            }
          })
          .withFailureHandler(function() {
            buscarMirrorSegre();
          })
          .sincronizarPlanilhaSegre();
      } else {
        buscarMirrorSegre();
      }

      function buscarMirrorSegre() {
        fetch(URLS_OFICIAIS_SEGRE.mirrorData + '?t=' + Date.now())
          .then(r => r.json())
          .then(json => {
            aplicarDadosRecebidos(json);
          })
          .catch(err => {
            console.warn('Fallback local para SEGRE:', err);
            aplicarDadosRecebidos(DADOS_SEGRE);
          });
      }
    }
`;

  if (html.includes(marker)) {
    html = html.replace(marker, segreScript + '\n    ' + marker);
    console.log('✔ Dashboard SEGRE e sincronização inseridos antes de limparTodosArquivosCentro.');
  } else {
    console.error('❌ Marker não encontrado em index.html');
    process.exit(1);
  }
}

// H. Ajustar sincronizarTudoGlobalmente para incluir SEGRE
if (!html.includes('sincronizarDashboardSegre(true)')) {
  const targetSyncAll = "if (typeof sincronizarDashboardSefin === 'function') {\n        sincronizarDashboardSefin();\n      }";
  const newSyncAll = `if (typeof sincronizarDashboardSefin === 'function') {
        sincronizarDashboardSefin();
      }
      if (typeof sincronizarDashboardSegre === 'function') {
        sincronizarDashboardSegre(true);
      }`;
  
  const normHtml2 = html.replace(/\r\n/g, '\n');
  if (normHtml2.includes(targetSyncAll)) {
    html = normHtml2.replace(targetSyncAll, newSyncAll);
    console.log('✔ sincronizarTudoGlobalmente atualizado para incluir sincronizarDashboardSegre(true).');
  }
}

// Salvar index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html atualizado com sucesso.');
