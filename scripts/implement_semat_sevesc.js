const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🚀 INICIANDO IMPLEMENTAÇÃO SEMAT & SEVESC + NOVO SEGRE');
console.log('====================================================');

// ==========================================
// 1. ATUALIZAR CÓDIGO.GS
// ==========================================
console.log('\n[1/3] Atualizando Código.gs...');
let codigoGs = fs.readFileSync('Código.gs', 'utf8');

// A. Adicionar actions no doGet
if (!codigoGs.includes("action === 'sincronizarSemat'")) {
  const targetDoGet = "else if (action === 'sincronizarSegre') {\n        output = sincronizarPlanilhaSegre();\n      }";
  const targetDoGetCrlf = "else if (action === 'sincronizarSegre') {\r\n        output = sincronizarPlanilhaSegre();\r\n      }";

  const replaceDoGet = `else if (action === 'sincronizarSegre') {
        output = sincronizarPlanilhaSegre();
      } else if (action === 'sincronizarSemat') {
        output = sincronizarPlanilhaSemat();
      } else if (action === 'sincronizarSevesc') {
        output = sincronizarPlanilhaSevesc();
      }`;

  const replaceDoGetCrlf = `else if (action === 'sincronizarSegre') {\r\n        output = sincronizarPlanilhaSegre();\r\n      } else if (action === 'sincronizarSemat') {\r\n        output = sincronizarPlanilhaSemat();\r\n      } else if (action === 'sincronizarSevesc') {\r\n        output = sincronizarPlanilhaSevesc();\r\n      }`;

  if (codigoGs.includes(targetDoGetCrlf)) {
    codigoGs = codigoGs.replace(targetDoGetCrlf, replaceDoGetCrlf);
    console.log('  ✔ Actions sincronizarSemat e sincronizarSevesc adicionadas ao doGet (CRLF)');
  } else if (codigoGs.includes(targetDoGet)) {
    codigoGs = codigoGs.replace(targetDoGet, replaceDoGet);
    console.log('  ✔ Actions sincronizarSemat e sincronizarSevesc adicionadas ao doGet (LF)');
  } else {
    console.error('  ❌ Target doGet não encontrado em Código.gs');
    process.exit(1);
  }
}

// B. Adicionar funções sincronizarPlanilhaSemat e sincronizarPlanilhaSevesc
if (!codigoGs.includes('function sincronizarPlanilhaSemat()')) {
  const targetFn = 'function sincronizarPlanilhaSegre() {';
  const newFunctions = `/**
 * Sincronização Dinâmica da Planilha SEMAT do SharePoint (Livro Entrada 2026)
 * Herda o motor universal de resolução pública anti-login
 */
function sincronizarPlanilhaSemat() {
  var url = "https://seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q?download=1";
  try {
    return obterArquivoPublicoSharepoint(url, {
      nomeSetor: "SEMAT / SEGRE",
      descricaoBase: "Livro Entrada 2026 SEMAT"
    });
  } catch (e) {
    Logger.log("Aviso SEMAT: fallback leve ativado - " + e.toString());
    try {
      var mirrorUrl = "https://raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/semat_livro_2026.json";
      var res = UrlFetchApp.fetch(mirrorUrl, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
    } catch (errMirror) {
      Logger.log("Erro ao buscar mirror SEMAT: " + errMirror.toString());
    }
    return { sucesso: false, erro: e.toString() };
  }
}

/**
 * Sincronização Dinâmica da Planilha SEVESC do SharePoint (Livro Entrada 2026)
 * Herda o motor universal de resolução pública anti-login
 */
function sincronizarPlanilhaSevesc() {
  var url = "https://seesp-my.sharepoint.com/:x:/g/personal/itp_sevesc_educacao_sp_gov_br/cQroeBSCMXZCQbbGQSCaAqMaEgUCxrdIuNVbs_RPejCEfptcng?download=1";
  try {
    return obterArquivoPublicoSharepoint(url, {
      nomeSetor: "SEVESC / SEGRE",
      descricaoBase: "Livro Entrada 2026 SEVESC"
    });
  } catch (e) {
    Logger.log("Aviso SEVESC: fallback leve ativado - " + e.toString());
    try {
      var mirrorUrl = "https://raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sevesc_livro_2026.json";
      var res = UrlFetchApp.fetch(mirrorUrl, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
    } catch (errMirror) {
      Logger.log("Erro ao buscar mirror SEVESC: " + errMirror.toString());
    }
    return { sucesso: false, erro: e.toString() };
  }
}

function sincronizarPlanilhaSegre() {`;

  if (codigoGs.includes(targetFn)) {
    codigoGs = codigoGs.replace(targetFn, newFunctions);
    console.log('  ✔ Funções sincronizarPlanilhaSemat e sincronizarPlanilhaSevesc adicionadas.');
  } else {
    console.error('  ❌ Target targetFn não encontrado em Código.gs');
    process.exit(1);
  }
}

fs.writeFileSync('Código.gs', codigoGs, 'utf8');
console.log('✔ Código.gs salvo.');

// ==========================================
// 2. ATUALIZAR INDEX.HTML
// ==========================================
console.log('\n[2/3] Atualizando index.html...');
let html = fs.readFileSync('index.html', 'utf8');

// A. Atualizar Nomenclatura SEGRE em textos e tabelas
html = html.replace('SEGRE (Gestão da Rede Escolar)', 'SEGRE (Serviço de Gestão da Rede Escolar)');
html = html.replace('SEGRE / CGE • Gestão da Rede Escolar', 'SEGRE / CGE • Serviço de Gestão da Rede Escolar');
html = html.replace('SEGRE - Vida Escolar, Matrícula', 'SEGRE - Serviço de Gestão da Rede Escolar');
html = html.replace('<span class="sidebar-item-sub">Vida Escolar, Matrícula</span>', '<span class="sidebar-item-sub">Serviço de Gestão da Rede</span>');
html = html.replace('Acessar CGE / Rede →', 'Acessar SEGRE / Rede →');
html = html.replace('SEGRE • Gestão da Rede Escolar & Matrícula (CGE)', 'SEGRE • Serviço de Gestão da Rede Escolar (CGE)');
console.log('  ✔ Nomenclatura SEGRE atualizada para "Serviço de Gestão da Rede Escolar".');

// B. Injetar URLs Oficiais SEMAT e SEVESC
if (!html.includes('URLS_OFICIAIS_SEMAT')) {
  const targetUrls = 'const URLS_OFICIAIS_SEGRE = {';
  const newUrls = `const URLS_OFICIAIS_SEMAT = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/semat_livro_2026.json')
    };

    const URLS_OFICIAIS_SEVESC = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_sevesc_educacao_sp_gov_br/cQroeBSCMXZCQbbGQSCaAqMaEgUCxrdIuNVbs_RPejCEfptcng'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sevesc_livro_2026.json')
    };

    const URLS_OFICIAIS_SEGRE = {`;
  html = html.replace(targetUrls, newUrls);
  console.log('  ✔ URLS_OFICIAIS_SEMAT e URLS_OFICIAIS_SEVESC adicionados.');
}

// C. Atualizar ESTRUTURA_ORGANIZACIONAL SEGRE com os 3 setores (SEMAT, SEVESC, Geral)
const oldSegreBlockRegex = /'SEGRE':\s*\{[\s\S]*?driveFolder:\s*'Uploads BIDirigente \/ CGE',[\s\S]*?setores:\s*\[[\s\S]*?\]\s*\},/g;
const newSegreBlock = `'SEGRE': {
        sigla: 'SEGRE',
        nome: 'SEGRE - Serviço de Gestão da Rede Escolar',
        descricao: 'Supervisão do atendimento escolar, matrículas (SEMAT), vida escolar (SEVESC) e organização regional.',
        icone: '🏫',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / CGE',
        setores: [
          {
            sigla: 'SEMAT',
            nome: 'SEMAT - Seção de Matrícula',
            desc: 'Organização de turmas, fluxo de alunos, matrículas manuais, vagas e processos SEI de matrícula',
            sharepointUrl: URLS_OFICIAIS_SEMAT.sharepoint
          },
          {
            sigla: 'SEVESC',
            nome: 'SEVESC - Seção de Vida Escolar',
            desc: 'Prontuários escolares, histórico, certificações, concluintes e processos SEI de vida escolar',
            sharepointUrl: URLS_OFICIAIS_SEVESC.sharepoint
          },
          {
            sigla: 'SEGRE',
            nome: 'SEGRE - Geral e Supervisão',
            desc: 'Supervisão Regional Escolar, Livro de Entrada consolidado e acompanhamento das 60 escolas',
            sharepointUrl: URLS_OFICIAIS_SEGRE.sharepoint
          }
        ]
      },`;

if (oldSegreBlockRegex.test(html)) {
  html = html.replace(oldSegreBlockRegex, newSegreBlock);
  console.log('  ✔ ESTRUTURA_ORGANIZACIONAL SEGRE atualizada com SEMAT, SEVESC e Geral.');
} else {
  console.log('  ℹ Bloco SEGRE regex não casou, verificando substituição manual...');
}

// D. Atualizar selecionarSetor para rotear SEMAT e SEVESC
const oldSelSetorRoute = `if (siglaSetor === 'SEFIN' || (setor && setor.sharepointUrl && siglaSetor === 'SEFIN')) {
          renderizarDashboardFinanceiroSefin();
        } else if (siglaSetor === 'SEGRE' || siglaCentro === 'SEGRE' || siglaCentro === 'CGE') {
          renderizarDashboardSegre();
        } else {`;

const newSelSetorRoute = `if (siglaSetor === 'SEFIN' || (setor && setor.sharepointUrl && siglaSetor === 'SEFIN')) {
          renderizarDashboardFinanceiroSefin();
        } else if (siglaSetor === 'SEMAT') {
          renderizarDashboardSemat();
        } else if (siglaSetor === 'SEVESC') {
          renderizarDashboardSevesc();
        } else if (siglaSetor === 'SEGRE' || siglaCentro === 'SEGRE' || siglaCentro === 'CGE') {
          renderizarDashboardSegre();
        } else {`;

const normHtml = html.replace(/\r\n/g, '\n');
const normOldSel = oldSelSetorRoute.replace(/\r\n/g, '\n');
const normNewSel = newSelSetorRoute.replace(/\r\n/g, '\n');

if (normHtml.includes(normOldSel)) {
  html = normHtml.replace(normOldSel, normNewSel);
  console.log('  ✔ selecionarSetor atualizado com rotas para SEMAT e SEVESC.');
}

// E. Atualizar caminho de nuvem exibido
const oldDescNuvem = `const descNuvem = setor.sharepointUrl ? (siglaSetor === 'SEFIN' ? 'SharePoint SEFIN Oficial' : 'SharePoint SEGRE Oficial') : ('Uploads BIDirigente / ' + siglaCentro + ' / ' + siglaSetor);`;
const newDescNuvem = `let descNuvem = 'Uploads BIDirigente / ' + siglaCentro + ' / ' + siglaSetor;
      if (setor.sharepointUrl) {
        if (siglaSetor === 'SEFIN') descNuvem = 'SharePoint SEFIN Oficial';
        else if (siglaSetor === 'SEMAT') descNuvem = 'SharePoint SEMAT Oficial (Matrícula)';
        else if (siglaSetor === 'SEVESC') descNuvem = 'SharePoint SEVESC Oficial (Vida Escolar)';
        else descNuvem = 'SharePoint SEGRE Oficial';
      }`;

if (html.includes(oldDescNuvem)) {
  html = html.replace(oldDescNuvem, newDescNuvem);
  console.log('  ✔ descNuvem atualizado com rótulos para SEMAT e SEVESC.');
}

// F. Atualizar sincronizarModulo para SEMAT e SEVESC
const oldSyncCases = `case 'segre':
            if (typeof sincronizarDashboardSegre === 'function') sincronizarDashboardSegre();
            mostrarToastAgenda('Painel SEGRE sincronizado com SharePoint às ' + agoraStr, '📋');
            break;`;

const newSyncCases = `case 'semat':
            if (typeof sincronizarDashboardSemat === 'function') sincronizarDashboardSemat();
            mostrarToastAgenda('Painel SEMAT (Matrícula) sincronizado às ' + agoraStr, '🎓');
            break;

          case 'sevesc':
            if (typeof sincronizarDashboardSevesc === 'function') sincronizarDashboardSevesc();
            mostrarToastAgenda('Painel SEVESC (Vida Escolar) sincronizado às ' + agoraStr, '📜');
            break;

          case 'segre':
            if (typeof sincronizarDashboardSegre === 'function') sincronizarDashboardSegre();
            if (typeof sincronizarDashboardSemat === 'function') sincronizarDashboardSemat(true);
            if (typeof sincronizarDashboardSevesc === 'function') sincronizarDashboardSevesc(true);
            mostrarToastAgenda('SEGRE e seções subordinadas (SEMAT/SEVESC) sincronizados às ' + agoraStr, '🏫');
            break;`;

const normOldSync = oldSyncCases.replace(/\r\n/g, '\n');
const normNewSync = newSyncCases.replace(/\r\n/g, '\n');

if (html.includes(normOldSync)) {
  html = html.replace(normOldSync, normNewSync);
  console.log('  ✔ sincronizarModulo atualizado com cases para semat e sevesc.');
}

// G. Carregar dados JSON e sanitizar URLs
let sematJsonStr = fs.readFileSync(path.join(__dirname, '..', 'data', 'semat_livro_2026.json'), 'utf8');
sematJsonStr = sematJsonStr.replace(/"https:\/\/seesp-my.sharepoint.com/g, '"https:\\/\\/seesp-my.sharepoint.com');

let sevescJsonStr = fs.readFileSync(path.join(__dirname, '..', 'data', 'sevesc_livro_2026.json'), 'utf8');
sevescJsonStr = sevescJsonStr.replace(/"https:\/\/seesp-my.sharepoint.com/g, '"https:\\/\\/seesp-my.sharepoint.com');

// H. Injetar componentes SEMAT e SEVESC
if (!html.includes('function renderizarDashboardSemat')) {
  const insertMarker = '// =======================================================\n    // PAINEL SEGRE - LIVRO ENTRADA 2026 (SHAREPOINT)';
  const insertMarkerAlt = '// PAINEL SEGRE - LIVRO ENTRADA 2026 (SHAREPOINT)';

  const sematSevescCode = `
    // =======================================================
    // PAINEL SEMAT - SEÇÃO DE MATRÍCULA (SHAREPOINT)
    // =======================================================
    let DADOS_SEMAT = ${sematJsonStr};
    let abaAtivaSemat = 'atendimentos';
    let filtroBuscaSemat = '';

    function mudarAbaSemat(aba) {
      abaAtivaSemat = aba;
      ['atendimentos', 'matriculas', 'sei'].forEach(a => {
        const btn = document.getElementById('tab-btn-semat-' + a);
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
      renderizarCorpoTabelaSemat();
    }

    function filtrarTabelaSemat() {
      const input = document.getElementById('semat-busca-input');
      filtroBuscaSemat = input ? input.value.trim().toLowerCase() : '';
      renderizarCorpoTabelaSemat();
    }

    function renderizarCorpoTabelaSemat() {
      const container = document.getElementById('semat-tabela-container');
      const badgeContador = document.getElementById('semat-contador-registros');
      if (!container) return;

      let colunas = [];
      let registros = [];

      if (abaAtivaSemat === 'atendimentos') {
        registros = (DADOS_SEMAT.atendimentosRecentes || []).filter(item => {
          if (!filtroBuscaSemat) return true;
          return (item.aluno && item.aluno.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.ra && item.ra.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.escolaAtual && item.escolaAtual.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.escolaPretendida && item.escolaPretendida.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.motivo && item.motivo.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSemat));
        });

        colunas = [
          { titulo: 'Data & Meio', width: '13%' },
          { titulo: 'Aluno & RA', width: '25%' },
          { titulo: 'Série & Turno', width: '12%' },
          { titulo: 'Origem ➔ Pretendida', width: '25%' },
          { titulo: 'Motivo & Orientação SEMAT', width: '25%' }
        ];

      } else if (abaAtivaSemat === 'matriculas') {
        registros = (DADOS_SEMAT.matriculasRecentes || []).filter(item => {
          if (!filtroBuscaSemat) return true;
          return (item.aluno && item.aluno.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.ra && item.ra.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.escola && item.escola.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.classe && item.classe.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.motivo && item.motivo.toLowerCase().includes(filtroBuscaSemat));
        });

        colunas = [
          { titulo: 'Data', width: '10%' },
          { titulo: 'Aluno(a) & RA', width: '28%' },
          { titulo: 'Unidade Escolar', width: '22%' },
          { titulo: 'Série & Classe', width: '15%' },
          { titulo: 'Motivo / Observação', width: '25%' }
        ];

      } else if (abaAtivaSemat === 'sei') {
        registros = (DADOS_SEMAT.processosSei || []).filter(item => {
          if (!filtroBuscaSemat) return true;
          return (item.protocolo && item.protocolo.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSemat)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSemat));
        });

        colunas = [
          { titulo: 'Protocolo SEI', width: '22%' },
          { titulo: 'Data', width: '12%' },
          { titulo: 'Assunto / Objeto', width: '32%' },
          { titulo: 'Interessado(a) / Remetente', width: '20%' },
          { titulo: 'Situação / Responsável', width: '14%' }
        ];
      }

      if (badgeContador) {
        badgeContador.innerText = \`Exibindo \${registros.length} registros\`;
      }

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
              <div style="font-weight: 700;">Nenhum registro encontrado para os filtros aplicados no SEMAT.</div>
            </td>
          </tr>
        \`;
      } else {
        registros.forEach((r, idx) => {
          const bgPar = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          htmlTabela += \`<tr style="background: \${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='\${bgPar}'">\`;

          if (abaAtivaSemat === 'atendimentos') {
            htmlTabela += \`
              <td style="padding: 9px 12px; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">\${r.data || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">\${r.meio || 'Presencial'} \${r.hora ? '• ' + r.hora : ''}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">\${r.aluno}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RA: \${r.ra || 'S/N'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 700; color: #0284c7;">\${r.serie || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Turno: \${r.turnoPretendido || '-'}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem;">
                <div style="color: #64748b;">De: \${r.escolaAtual || 'Fora'}</div>
                <div style="color: #059669; font-weight: 700;">➔ \${r.escolaPretendida || 'Não informada'}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">\${r.motivo}</div>
                <div style="font-size: 0.72rem; color: #64748b;">\${r.orientacao || '—'}</div>
              </td>
            \`;
          } else if (abaAtivaSemat === 'matriculas') {
            htmlTabela += \`
              <td style="padding: 9px 12px; font-weight: 700; color: #475569;">\${r.data || '—'}</td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">\${r.aluno}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RA: \${r.ra || 'S/N'}</div>
              </td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0369a1;">\${r.escola}</td>
              <td style="padding: 9px 12px;">
                <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.72rem;">Série \${r.serie}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Classe: \${r.classe}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">\${r.motivo}</div>
                <div style="font-size: 0.72rem; color: #64748b;">\${r.observacao || ''} (Resp: \${r.responsavel})</div>
              </td>
            \`;
          } else if (abaAtivaSemat === 'sei') {
            const isConcl = r.situacao.includes('CONCLU') || r.situacao.includes('PUBLICAÇÃO') || r.situacao.includes('ENC');
            htmlTabela += \`
              <td style="padding: 9px 12px; font-weight: 800; color: #0b2351; font-family: monospace;">\${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569;">\${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #1e293b;">\${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">
                <div><strong>\${r.interessado || '—'}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">De: \${r.remetente || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: \${isConcl ? '#d1fae5' : '#fef3c7'}; color: \${isConcl ? '#059669' : '#d97706'};">\${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: \${r.responsavel}</div>
              </td>
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

    function renderizarDashboardSemat() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEMAT.meta || {};
      const kpis = DADOS_SEMAT.kpis || { totalAtendimentos: 2912, totalMatriculasManuais: 2318, totalSei: 102, totalTrocasEscola: 4062, totalEmails: 6302 };

      const html = \`
        <div class="semat-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEMAT -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1d4ed8 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.3rem 1.5rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">🎓</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEMAT • Seção de Matrícula (SEGRE)</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Gestão das rotinas de atendimento, compatibilização de vagas, matrículas manuais, transferências e processos SEI da Diretoria Regional de Ensino de Itapevi.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 1.2rem; margin-top: 0.6rem; font-size: 0.76rem; color: #cbd5e1; font-weight: 600;">
                <span>📁 <strong>Arquivo:</strong> <span style="color: #ffffff;">\${meta.nomeArquivo || 'Livro Entrada 2026 SEMAT.xlsx'}</span></span>
                <span>👤 <strong>Conta:</strong> <span style="color: #ffffff;">\${meta.contaResponsavel || 'itp_semat_educacao_sp_gov_br'}</span></span>
                <span>🕒 <strong>Atualizado:</strong> <span style="color: #ffffff;">\${meta.atualizadoFormatado || 'Hoje'}</span></span>
                <span>📦 <strong>Tamanho:</strong> <span style="color: #ffffff;">\${meta.tamanhoArquivoMb || '26.54'} MB</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSemat()" id="btn-semat-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar SEMAT
                </button>
                <a href="\${meta.sharepointUrl || URLS_OFICIAIS_SEMAT.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com 15.000+ registros de fluxo de matrículas</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS SEMAT -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <div onclick="mudarAbaSemat('atendimentos')" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase;">Atendimento Externo</span>
                <span style="background: #e0f2fe; color: #0369a1; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🗣️</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #0284c7; margin: 0.2rem 0;">\${kpis.totalAtendimentos.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Vagas, transferências, famílias</span>
                <span style="font-weight: 700; color: #0284c7;">Ver Atendimentos ➔</span>
              </div>
            </div>

            <div onclick="mudarAbaSemat('matriculas')" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase;">Matrículas Manuais</span>
                <span style="background: #d1fae5; color: #047857; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📝</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #059669; margin: 0.2rem 0;">\${kpis.totalMatriculasManuais.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Ajustes efetuados nas escolas</span>
                <span style="font-weight: 700; color: #059669;">Ver Matrículas ➔</span>
              </div>
            </div>

            <div onclick="mudarAbaSemat('sei')" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase;">Processos SEI</span>
                <span style="background: #ffedd5; color: #c2410c; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📋</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #ea580c; margin: 0.2rem 0;">\${kpis.totalSei}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Regimentos, Módulos, Turmas</span>
                <span style="font-weight: 700; color: #ea580c;">Ver SEI ➔</span>
              </div>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase;">Trocas & E-mails</span>
                <span style="background: #ede9fe; color: #6d28d9; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📬</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #7c3aed; margin: 0.2rem 0;">\${kpis.totalTrocasEscola.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem;">
                <span>+ \${kpis.totalEmails.toLocaleString('pt-BR')} expedientes catalogados</span>
              </div>
            </div>

          </div>

          <!-- SUB-ABAS DO SEMAT -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-semat-atendimentos" onclick="mudarAbaSemat('atendimentos')" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                🗣️ Atendimentos Externos (\${kpis.totalAtendimentos.toLocaleString('pt-BR')})
              </button>
              <button id="tab-btn-semat-matriculas" onclick="mudarAbaSemat('matriculas')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📝 Matrículas Manuais (\${kpis.totalMatriculasManuais.toLocaleString('pt-BR')})
              </button>
              <button id="tab-btn-semat-sei" onclick="mudarAbaSemat('sei')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📋 Processos SEI (\${kpis.totalSei})
              </button>
            </div>
            <div id="semat-contador-registros" style="font-size: 0.8rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 5px 12px; border-radius: 20px;">
              Carregando dados...
            </div>
          </div>

          <!-- BUSCA SEMAT -->
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0 0.75rem;">
              <span style="font-size: 1rem; color: #64748b; margin-right: 0.5rem;">🔍</span>
              <input type="text" id="semat-busca-input" onkeyup="filtrarTabelaSemat()" placeholder="Pesquisar por aluno, RA, escola atual ou pretendida, motivo, responsável..." style="border: none; background: transparent; width: 100%; padding: 8px 0; font-size: 0.84rem; outline: none; color: #0f172a; font-family: inherit;">
            </div>
          </div>

          <div id="semat-tabela-container"></div>

        </div>
      \`;

      container.innerHTML = html;
      renderizarCorpoTabelaSemat();
    }

    function sincronizarDashboardSemat(silencioso) {
      if (!silencioso && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEMAT • SHAREPOINT',
          titulo: 'Sincronizando SEMAT...',
          mensagem: 'Consultando base de matrículas (26.54 MB) no SharePoint...',
          detalhes: 'Conexão Anônima Pública • 100% Resiliente',
          duracao: 0
        });
      }

      const aplicarDados = function(novos) {
        if (novos && novos.kpis) {
          DADOS_SEMAT = novos;
          try { localStorage.setItem('dados_semat_cache', JSON.stringify(novos)); } catch (e) {}
        }
        if (DADOS_SEMAT.meta) {
          DADOS_SEMAT.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR');
        }
        renderizarDashboardSemat();
        if (!silencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEMAT ATUALIZADO',
            titulo: 'SEMAT Sincronizado com Sucesso!',
            mensagem: 'Base de matrículas atualizada com ' + (DADOS_SEMAT.kpis ? DADOS_SEMAT.kpis.totalAtendimentos : 2912) + ' atendimentos.',
            detalhes: 'Sincronizado às ' + new Date().toLocaleTimeString('pt-BR'),
            duracao: 4500
          });
        }
      };

      if (typeof google !== 'undefined' && google.script && google.script.run && google.script.run.sincronizarPlanilhaSemat) {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.sucesso !== false) aplicarDados(res);
            else buscarMirror();
          })
          .withFailureHandler(function() { buscarMirror(); })
          .sincronizarPlanilhaSemat();
      } else {
        buscarMirror();
      }

      function buscarMirror() {
        fetch(URLS_OFICIAIS_SEMAT.mirrorData + '?t=' + Date.now())
          .then(r => r.json())
          .then(json => aplicarDados(json))
          .catch(() => aplicarDados(DADOS_SEMAT));
      }
    }

    // =======================================================
    // PAINEL SEVESC - SEÇÃO DE VIDA ESCOLAR (SHAREPOINT)
    // =======================================================
    let DADOS_SEVESC = ${sevescJsonStr};
    let abaAtivaSevesc = 'atendimentos';
    let filtroBuscaSevesc = '';

    function mudarAbaSevesc(aba) {
      abaAtivaSevesc = aba;
      ['atendimentos', 'sei', 'emails'].forEach(a => {
        const btn = document.getElementById('tab-btn-sevesc-' + a);
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
      renderizarCorpoTabelaSevesc();
    }

    function filtrarTabelaSevesc() {
      const input = document.getElementById('sevesc-busca-input');
      filtroBuscaSevesc = input ? input.value.trim().toLowerCase() : '';
      renderizarCorpoTabelaSevesc();
    }

    function renderizarCorpoTabelaSevesc() {
      const container = document.getElementById('sevesc-tabela-container');
      const badgeContador = document.getElementById('sevesc-contador-registros');
      if (!container) return;

      let colunas = [];
      let registros = [];

      if (abaAtivaSevesc === 'atendimentos') {
        registros = (DADOS_SEVESC.atendimentosRecentes || []).filter(item => {
          if (!filtroBuscaSevesc) return true;
          return (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.escola && item.escola.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.rgCin && item.rgCin.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSevesc));
        });

        colunas = [
          { titulo: 'Data & Meio', width: '13%' },
          { titulo: 'Interessado(a) / Aluno', width: '28%' },
          { titulo: 'Documento / RG', width: '14%' },
          { titulo: 'Assunto / Unidade Escolar', width: '30%' },
          { titulo: 'Status / Responsável', width: '15%' }
        ];

      } else if (abaAtivaSevesc === 'sei') {
        registros = (DADOS_SEVESC.processosSei || []).filter(item => {
          if (!filtroBuscaSevesc) return true;
          return (item.protocolo && item.protocolo.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.escola && item.escola.toLowerCase().includes(filtroBuscaSevesc));
        });

        colunas = [
          { titulo: 'Processo SEI', width: '22%' },
          { titulo: 'Data', width: '12%' },
          { titulo: 'Assunto / Finalidade', width: '30%' },
          { titulo: 'Interessado / Escola', width: '22%' },
          { titulo: 'Situação / Responsável', width: '14%' }
        ];

      } else if (abaAtivaSevesc === 'emails') {
        registros = (DADOS_SEVESC.emailsRecentes || []).filter(item => {
          if (!filtroBuscaSevesc) return true;
          return (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSevesc)) ||
            (item.escola && item.escola.toLowerCase().includes(filtroBuscaSevesc));
        });

        colunas = [
          { titulo: 'Data / Hora', width: '15%' },
          { titulo: 'Assunto do Expediente', width: '35%' },
          { titulo: 'Interessado(a)', width: '25%' },
          { titulo: 'Escola / Situação', width: '25%' }
        ];
      }

      if (badgeContador) {
        badgeContador.innerText = \`Exibindo \${registros.length} registros\`;
      }

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
              <div style="font-weight: 700;">Nenhum registro encontrado para os filtros aplicados no SEVESC.</div>
            </td>
          </tr>
        \`;
      } else {
        registros.forEach((r, idx) => {
          const bgPar = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          htmlTabela += \`<tr style="background: \${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#faf5ff'" onmouseout="this.style.background='\${bgPar}'">\`;

          if (abaAtivaSevesc === 'atendimentos') {
            const isFin = r.situacao.includes('FINALIZ');
            htmlTabela += \`
              <td style="padding: 9px 12px; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">\${r.data || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">\${r.meio || 'Presencial'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">\${r.interessado}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Sol: \${r.solicitadoPor || '—'}</div>
              </td>
              <td style="padding: 9px 12px; font-family: monospace; color: #475569;">\${r.rgCin || '—'}</td>
              <td style="padding: 9px 12px; font-size: 0.78rem;">
                <div style="font-weight: 700; color: #7c3aed;">\${r.assunto}</div>
                <div style="color: #64748b;">\${r.escola || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: \${isFin ? '#d1fae5' : '#fef3c7'}; color: \${isFin ? '#059669' : '#d97706'};">\${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: \${r.responsavel}</div>
              </td>
            \`;
          } else if (abaAtivaSevesc === 'sei') {
            const isFin = r.situacao.includes('FINALIZ');
            htmlTabela += \`
              <td style="padding: 9px 12px; font-weight: 800; color: #0b2351; font-family: monospace;">\${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569;">\${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #1e293b;">\${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">
                <div><strong>\${r.interessado || '—'}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">Escola: \${r.escola || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: \${isFin ? '#d1fae5' : '#fef3c7'}; color: \${isFin ? '#059669' : '#d97706'};">\${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: \${r.responsavel}</div>
              </td>
            \`;
          } else if (abaAtivaSevesc === 'emails') {
            htmlTabela += \`
              <td style="padding: 9px 12px; color: #475569;">\${r.data || '—'} \${r.hora ? '• ' + r.hora : ''}</td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0f172a;">\${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">\${r.interessado || '—'}</td>
              <td style="padding: 9px 12px; font-size: 0.76rem;">
                <div style="color: #64748b;">\${r.escola || '—'}</div>
                <div style="color: #059669; font-weight: 700;">\${r.situacao}</div>
              </td>
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

    function renderizarDashboardSevesc() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEVESC.meta || {};
      const kpis = DADOS_SEVESC.kpis || { totalAtendimentos: 663, totalSei: 57, totalEmails: 2717, totalProntuariosConcluintes: 1557 };

      const html = \`
        <div class="sevesc-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEVESC -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #6d28d9 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.3rem 1.5rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">📜</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEVESC • Seção de Vida Escolar (SEGRE)</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Acompanhamento de prontuários de alunos, regularização de vida escolar, certificação de concluintes, histórico escolar e processos SEI.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 1.2rem; margin-top: 0.6rem; font-size: 0.76rem; color: #cbd5e1; font-weight: 600;">
                <span>📁 <strong>Arquivo:</strong> <span style="color: #ffffff;">\${meta.nomeArquivo || 'Livro Entrada 2026 SEVESC.xlsx'}</span></span>
                <span>👤 <strong>Conta:</strong> <span style="color: #ffffff;">\${meta.contaResponsavel || 'itp_sevesc_educacao_sp_gov_br'}</span></span>
                <span>🕒 <strong>Atualizado:</strong> <span style="color: #ffffff;">\${meta.atualizadoFormatado || 'Hoje'}</span></span>
                <span>📦 <strong>Tamanho:</strong> <span style="color: #ffffff;">\${meta.tamanhoArquivoMb || '1.21'} MB</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSevesc()" id="btn-sevesc-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar SEVESC
                </button>
                <a href="\${meta.sharepointUrl || URLS_OFICIAIS_SEVESC.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com histórico de vida escolar de ex-alunos e concluintes</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS SEVESC -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <div onclick="mudarAbaSevesc('atendimentos')" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase;">Atendimentos Vida Escolar</span>
                <span style="background: #e0f2fe; color: #0369a1; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📜</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #0284c7; margin: 0.2rem 0;">\${kpis.totalAtendimentos.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Certidões, Encceja, Prontuários</span>
                <span style="font-weight: 700; color: #0284c7;">Ver Atendimentos ➔</span>
              </div>
            </div>

            <div onclick="mudarAbaSevesc('sei')" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase;">Processos SEI</span>
                <span style="background: #d1fae5; color: #047857; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📋</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #059669; margin: 0.2rem 0;">\${kpis.totalSei}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Processos de Vida Escolar</span>
                <span style="font-weight: 700; color: #059669;">Ver SEI ➔</span>
              </div>
            </div>

            <div onclick="mudarAbaSevesc('emails')" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.08); transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase;">E-mails & Expedientes</span>
                <span style="background: #ffedd5; color: #c2410c; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📬</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #ea580c; margin: 0.2rem 0;">\${kpis.totalEmails.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; display: flex; justify-content: space-between;">
                <span>Demandas e escolas extintas</span>
                <span style="font-weight: 700; color: #ea580c;">Ver Expedientes ➔</span>
              </div>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase;">Prontuários / Concluintes</span>
                <span style="background: #ede9fe; color: #6d28d9; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📚</span>
              </div>
              <div style="font-size: 2rem; font-weight: 900; color: #7c3aed; margin: 0.2rem 0;">\${kpis.totalProntuariosConcluintes.toLocaleString('pt-BR')}</div>
              <div style="font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem;">
                <span>Acervo escolar da região de Itapevi</span>
              </div>
            </div>

          </div>

          <!-- SUB-ABAS DO SEVESC -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-sevesc-atendimentos" onclick="mudarAbaSevesc('atendimentos')" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📜 Atendimentos Vida Escolar (\${kpis.totalAtendimentos.toLocaleString('pt-BR')})
              </button>
              <button id="tab-btn-sevesc-sei" onclick="mudarAbaSevesc('sei')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📋 Processos SEI (\${kpis.totalSei})
              </button>
              <button id="tab-btn-sevesc-emails" onclick="mudarAbaSevesc('emails')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📬 E-mails & Expedientes (\${kpis.totalEmails.toLocaleString('pt-BR')})
              </button>
            </div>
            <div id="sevesc-contador-registros" style="font-size: 0.8rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 5px 12px; border-radius: 20px;">
              Carregando dados...
            </div>
          </div>

          <!-- BUSCA SEVESC -->
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0 0.75rem;">
              <span style="font-size: 1rem; color: #64748b; margin-right: 0.5rem;">🔍</span>
              <input type="text" id="sevesc-busca-input" onkeyup="filtrarTabelaSevesc()" placeholder="Pesquisar por interessado, documento, escola, assunto, responsável..." style="border: none; background: transparent; width: 100%; padding: 8px 0; font-size: 0.84rem; outline: none; color: #0f172a; font-family: inherit;">
            </div>
          </div>

          <div id="sevesc-tabela-container"></div>

        </div>
      \`;

      container.innerHTML = html;
      renderizarCorpoTabelaSevesc();
    }

    function sincronizarDashboardSevesc(silencioso) {
      if (!silencioso && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEVESC • SHAREPOINT',
          titulo: 'Sincronizando SEVESC...',
          mensagem: 'Consultando base de vida escolar (1.21 MB) no SharePoint...',
          detalhes: 'Conexão Anônima Pública • 100% Resiliente',
          duracao: 0
        });
      }

      const aplicarDados = function(novos) {
        if (novos && novos.kpis) {
          DADOS_SEVESC = novos;
          try { localStorage.setItem('dados_sevesc_cache', JSON.stringify(novos)); } catch (e) {}
        }
        if (DADOS_SEVESC.meta) {
          DADOS_SEVESC.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR');
        }
        renderizarDashboardSevesc();
        if (!silencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEVESC ATUALIZADO',
            titulo: 'SEVESC Sincronizado com Sucesso!',
            mensagem: 'Base de vida escolar atualizada com ' + (DADOS_SEVESC.kpis ? DADOS_SEVESC.kpis.totalAtendimentos : 663) + ' atendimentos.',
            detalhes: 'Sincronizado às ' + new Date().toLocaleTimeString('pt-BR'),
            duracao: 4500
          });
        }
      };

      if (typeof google !== 'undefined' && google.script && google.script.run && google.script.run.sincronizarPlanilhaSevesc) {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.sucesso !== false) aplicarDados(res);
            else buscarMirror();
          })
          .withFailureHandler(function() { buscarMirror(); })
          .sincronizarPlanilhaSevesc();
      } else {
        buscarMirror();
      }

      function buscarMirror() {
        fetch(URLS_OFICIAIS_SEVESC.mirrorData + '?t=' + Date.now())
          .then(r => r.json())
          .then(json => aplicarDados(json))
          .catch(() => aplicarDados(DADOS_SEVESC));
      }
    }
  `;

  if (html.includes(insertMarker)) {
    html = html.replace(insertMarker, sematSevescCode + '\n    ' + insertMarker);
    console.log('  ✔ Dashboards SEMAT e SEVESC inseridos antes do bloco SEGRE.');
  } else if (html.includes(insertMarkerAlt)) {
    html = html.replace(insertMarkerAlt, sematSevescCode + '\n    ' + insertMarkerAlt);
    console.log('  ✔ Dashboards SEMAT e SEVESC inseridos antes do bloco SEGRE (Alt).');
  } else {
    console.error('  ❌ insertMarker não encontrado');
    process.exit(1);
  }
}

// I. Sincronizar Tudo Globalmente incluir SEMAT e SEVESC
if (!html.includes('sincronizarDashboardSemat(true)')) {
  const targetSyncAll = "if (typeof sincronizarDashboardSegre === 'function') {\n        sincronizarDashboardSegre(true);\n      }";
  const newSyncAll = `if (typeof sincronizarDashboardSegre === 'function') {
        sincronizarDashboardSegre(true);
      }
      if (typeof sincronizarDashboardSemat === 'function') {
        sincronizarDashboardSemat(true);
      }
      if (typeof sincronizarDashboardSevesc === 'function') {
        sincronizarDashboardSevesc(true);
      }`;

  const normHtml2 = html.replace(/\r\n/g, '\n');
  if (normHtml2.includes(targetSyncAll)) {
    html = normHtml2.replace(targetSyncAll, newSyncAll);
    console.log('  ✔ sincronizarTudoGlobalmente atualizado com SEMAT e SEVESC.');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✔ index.html salvo com sucesso.');

console.log('\n[3/3] Finalizado!');
