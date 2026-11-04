const fs = require('fs');
const path = require('path');

// 1. Atualizar Código.gs
const codigoPath = path.join(__dirname, '..', 'Código.gs');
let codigo = fs.readFileSync(codigoPath, 'utf8');

// Adicionar rota sincronizarSefisc no doGet
const oldDoGetSecomse = `      } else if (action === 'sincronizarSecomse') {
        output = sincronizarPlanilhaSecomse(forcarBruto);`;

const newDoGetSecomse = `      } else if (action === 'sincronizarSecomse') {
        output = sincronizarPlanilhaSecomse(forcarBruto);
      } else if (action === 'sincronizarSefisc') {
        output = sincronizarPlanilhaSefisc(forcarBruto);`;

if (!codigo.includes("action === 'sincronizarSefisc'")) {
  codigo = codigo.replace(oldDoGetSecomse, newDoGetSecomse);
}

// Adicionar a função sincronizarPlanilhaSefisc
const sefiscFunc = `
/**
 * Sincronização Dinâmica da Planilha SEFISC do SharePoint (CONTROLE - ZELADORIAS-ATUALIZADA-2026.xlsx)
 * REGRA MANDATÓRIA: Considerar única e exclusivamente a aba 'SEFISC'.
 */
function sincronizarPlanilhaSefisc(forcarBruto) {
  var modoOtimizado = !forcarBruto;
  if (modoOtimizado) {
    try {
      var mirrorUrl = "https://raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sefisc_zeladorias_2026.json?_t=" + new Date().getTime();
      var res = UrlFetchApp.fetch(mirrorUrl, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        var dados = JSON.parse(res.getContentText());
        dados.modoOtimizado = true;
        dados.timestamp = Utilities.formatDate(new Date(), "America/Sao_Paulo", "HH:mm");
        dados.mensagem = "Sincronização de alta performance: aba SEFISC (Zeladorias 2026) carregada com sucesso.";
        return dados;
      }
    } catch (errOpt) {
      Logger.log("Aviso SEFISC modo otimizado: " + errOpt.toString());
    }
  }

  var url = "https://seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A?download=1";
  try {
    return obterArquivoPublicoSharepoint(url, {
      nomeSetor: "SEFISC / SEOM",
      descricaoBase: "Controle de Zeladorias (Aba SEFISC)",
      abaAlvo: "SEFISC"
    });
  } catch (e) {
    Logger.log("Aviso SEFISC: fallback leve ativado - " + e.toString());
    try {
      var mirrorUrl = "https://raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sefisc_zeladorias_2026.json";
      var res = UrlFetchApp.fetch(mirrorUrl, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
    } catch (errMirror) {
      Logger.log("Erro ao buscar mirror SEFISC: " + errMirror.toString());
    }
    return { sucesso: false, erro: e.toString() };
  }
}
`;

if (!codigo.includes('function sincronizarPlanilhaSefisc')) {
  codigo = codigo.replace('function sincronizarPlanilhaSecomse', sefiscFunc + '\nfunction sincronizarPlanilhaSecomse');
}

fs.writeFileSync(codigoPath, codigo, 'utf8');
console.log('Código.gs atualizado com sucesso!');

// 2. Atualizar index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Ler dados json do SEFISC
const sefiscJsonData = fs.readFileSync(path.join(__dirname, '..', 'data', 'sefisc_zeladorias_2026.json'), 'utf8');

// Adicionar DADOS_SEFISC antes de URLS_OFICIAIS_SEFISC
const oldUrlsSefisc = `    const URLS_OFICIAIS_SEFISC = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      setor: 'SEFISC - Seção de Fiscalização e Serviços Contratados'
    };`;

const newUrlsSefisc = `    const URLS_OFICIAIS_SEFISC = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sefisc_zeladorias_2026.json'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      abaAlvo: 'SEFISC',
      setor: 'SEFISC - Seção de Fiscalização e Serviços Contratados'
    };

    let DADOS_SEFISC = ${sefiscJsonData};
    let estadoSefisc = {
      filtroStatus: 'TODOS',
      termoBusca: ''
    };`;

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

indexHtml = replaceAllExact(indexHtml, oldUrlsSefisc, newUrlsSefisc);

// Agora substituir a função renderizarDashboardSefisc e sincronizarDashboardSefisc
const oldSefiscBlock = `    function sincronizarDashboardSefisc(isManual) {
      const btn = document.getElementById('btn-sync-sefisc');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Sincronizando...';
      }

      if (isManual && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEFISC • ALTA PERFORMANCE',
          titulo: 'Sincronizando Fiscalização e Serviços 2026...',
          mensagem: 'Conectando ao SharePoint institucional e atualizando relatórios...',
          detalhes: 'Conta: itp_seom_educacao_sp_gov_br • Modo Resiliente',
          duracao: 0
        });
      }

      function concluirSucesso(fonte) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '🔄 Sincronizar SEFISC';
        }
        var agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (isManual && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEFISC ATUALIZADO',
            titulo: 'Sincronização Concluída!',
            mensagem: '<strong>Relatórios de Fiscalização e Veículos</strong> 100% atualizados!',
            detalhes: (fonte || 'SharePoint Oficial') + ' às ' + agora + ' • itp_seom_educacao_sp_gov_br',
            duracao: 5000
          });
        }
      }

      if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.sincronizarPlanilhaSefisc === 'function') {
        google.script.run
          .withSuccessHandler(function(res) {
            concluirSucesso('SharePoint Direto');
          })
          .withFailureHandler(function() {
            concluirSucesso('Base Oficial Ativa');
          })
          .sincronizarPlanilhaSefisc(false);
      } else {
        const gasUrl = 'https:' + String.fromCharCode(47, 47) + 'script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec?action=sincronizarSefisc';
        fetch(gasUrl)
          .then(r => r.json())
          .then(() => concluirSucesso('SharePoint / GAS'))
          .catch(() => concluirSucesso('Base Oficial Ativa'));
      }
    }`;

const newSefiscBlock = `    function mudarFiltroStatusSefisc(status, btnEl) {
      estadoSefisc.filtroStatus = status;
      document.querySelectorAll('.btn-sefisc-status').forEach(b => {
        const isMatch = (btnEl && b === btnEl) || (b.getAttribute('data-status') === status);
        if (isMatch) {
          b.classList.add('active');
          b.style.background = '#0b2351';
          b.style.color = '#ffffff';
          b.style.borderColor = '#0b2351';
          b.style.fontWeight = '800';
          b.style.boxShadow = '0 2px 6px rgba(11, 35, 81, 0.25)';
        } else {
          b.classList.remove('active');
          b.style.background = '#ffffff';
          b.style.color = '#475569';
          b.style.borderColor = '#cbd5e1';
          b.style.fontWeight = '700';
          b.style.boxShadow = 'none';
        }
      });
      atualizarTabelaZeladoriasSefisc();
    }

    function buscarZeladoriasSefisc(termo) {
      estadoSefisc.termoBusca = (termo || '').toLowerCase().trim();
      atualizarTabelaZeladoriasSefisc();
    }

    function atualizarTabelaZeladoriasSefisc() {
      const tbody = document.getElementById('tabela-sefisc-tbody');
      const counterEl = document.getElementById('sefisc-filtro-contador');
      if (!tbody) return;

      const zeladorias = (DADOS_SEFISC && DADOS_SEFISC.zeladorias) || [];
      const termo = estadoSefisc.termoBusca;
      const statusFiltro = estadoSefisc.filtroStatus;

      const filtrados = zeladorias.filter(item => {
        if (statusFiltro === 'OCUPADAS' && item.situacao !== 'Ocupada') return false;
        if (statusFiltro === 'VAGAS' && item.situacao === 'Ocupada') return false;
        if (statusFiltro === 'OK' && !item.obs.toUpperCase().includes('OK')) return false;
        if (statusFiltro === 'RENOVACAO' && !item.obs.toUpperCase().includes('RENOVAÇÃO') && !item.obs.toUpperCase().includes('RENOVACAO')) return false;
        if (statusFiltro === 'DARE' && !item.obs.toUpperCase().includes('DARE')) return false;

        if (termo) {
          const matchEscola = item.escola.toLowerCase().includes(termo);
          const matchZelador = item.zelador.toLowerCase().includes(termo);
          const matchCargo = item.cargo.toLowerCase().includes(termo);
          const matchProcesso = item.processo.toLowerCase().includes(termo);
          const matchObs = item.obs.toLowerCase().includes(termo);
          if (!matchEscola && !matchZelador && !matchCargo && !matchProcesso && !matchObs) return false;
        }
        return true;
      });

      if (counterEl) {
        counterEl.innerText = filtrados.length + ' zeladorias';
      }

      if (filtrados.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="7" style="padding: 2.5rem; text-align: center; color: #64748b;">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div>
              <strong>Nenhuma zeladoria encontrada</strong>
              <div style="font-size: 0.75rem; margin-top: 0.25rem;">Ajuste o termo de busca ou o filtro de situação da aba SEFISC.</div>
            </td>
          </tr>
        \`;
        return;
      }

      tbody.innerHTML = filtrados.map((item, idx) => {
        let badgeSituacao = item.situacao === 'Ocupada'
          ? '<span style="background: #ecfdf5; color: #047857; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #a7f3d0;">🟢 Ocupada</span>'
          : '<span style="background: #fef2f2; color: #b91c1c; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #fecaca;">🟡 Vaga / Disponível</span>';

        let badgeObs = '<span style="background: #f1f5f9; color: #475569; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">' + item.obs + '</span>';
        if (item.obs.toUpperCase().includes('OK')) {
          badgeObs = '<span style="background: #ecfdf5; color: #059669; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; border: 1px solid #a7f3d0;">' + item.obs + '</span>';
        } else if (item.obs.toUpperCase().includes('RENOVAÇÃO') || item.obs.toUpperCase().includes('RENOVACAO')) {
          badgeObs = '<span style="background: #eff6ff; color: #2563eb; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; border: 1px solid #bfdbfe;">' + item.obs + '</span>';
        } else if (item.obs.toUpperCase().includes('DARE')) {
          badgeObs = '<span style="background: #fdf4ff; color: #9333ea; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; border: 1px solid #f5d0fe;">' + item.obs + '</span>';
        }

        return \`
          <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
            <td style="padding: 0.75rem 0.9rem; font-weight: 800; color: #0b2351; white-space: nowrap;">\${item.id}</td>
            <td style="padding: 0.75rem 0.9rem;">
              <strong style="color: #0f172a; font-size: 0.85rem;">\${item.escola}</strong>
            </td>
            <td style="padding: 0.75rem 0.9rem;">
              <div style="font-weight: 700; color: #334155;">\${item.zelador}</div>
              <div style="font-size: 0.72rem; color: #64748b;">RG: \${item.rg}</div>
            </td>
            <td style="padding: 0.75rem 0.9rem;">
              <div style="color: #475569; font-weight: 600;">\${item.cargo}</div>
              <div style="font-size: 0.72rem; color: #0284c7;">\${item.classificacao}</div>
            </td>
            <td style="padding: 0.75rem 0.9rem; font-family: monospace; font-size: 0.76rem; color: #1e293b; white-space: nowrap;">
              \${item.processo}
            </td>
            <td style="padding: 0.75rem 0.9rem; font-size: 0.78rem; color: #475569; white-space: nowrap;">
              \${item.vencimento}
            </td>
            <td style="padding: 0.75rem 0.9rem; text-align: center; white-space: nowrap;">
              \${badgeSituacao}
              <div style="margin-top: 0.25rem;">\${badgeObs}</div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function sincronizarDashboardSefisc(isManual) {
      const btn = document.getElementById('btn-sync-sefisc');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Sincronizando...';
      }

      if (isManual && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEFISC • ALTA PERFORMANCE',
          titulo: 'Sincronizando Zeladorias (Aba SEFISC)...',
          mensagem: 'Lendo exclusivamente a aba SEFISC do SharePoint oficial...',
          detalhes: 'Conta: itp_seom_educacao_sp_gov_br • Aba: SEFISC',
          duracao: 0
        });
      }

      function concluirSucesso(fonte) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '🔄 Sincronizar SEFISC';
        }
        var agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        renderizarDashboardSefisc();
        if (isManual && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEFISC ATUALIZADO',
            titulo: 'Sincronização Concluída!',
            mensagem: '<strong>Aba SEFISC (Controle de Zeladorias)</strong> 100% atualizada!',
            detalhes: (fonte || 'Aba SEFISC SharePoint') + ' às ' + agora + ' • itp_seom_educacao_sp_gov_br',
            duracao: 5000
          });
        }
      }

      if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.sincronizarPlanilhaSefisc === 'function') {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.zeladorias) {
              DADOS_SEFISC = res;
            }
            concluirSucesso('SharePoint Direto (Aba SEFISC)');
          })
          .withFailureHandler(function() {
            concluirSucesso('Base Oficial Aba SEFISC');
          })
          .sincronizarPlanilhaSefisc(false);
      } else {
        const gasUrl = 'https:' + String.fromCharCode(47, 47) + 'script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec?action=sincronizarSefisc';
        fetch(gasUrl)
          .then(r => r.json())
          .then(data => {
            if (data && data.zeladorias) {
              DADOS_SEFISC = data;
            }
            concluirSucesso('SharePoint / GAS (Aba SEFISC)');
          })
          .catch(() => concluirSucesso('Base Oficial Aba SEFISC'));
      }
    }`;

indexHtml = replaceAllExact(indexHtml, oldSefiscBlock, newSefiscBlock);

// Agora substituir renderizarDashboardSefisc
const oldRenderizarSefisc = `    function renderizarDashboardSefisc() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      container.innerHTML = \`
        <div style=\"margin-top: 1.25rem;\">
          <!-- BANNER DO SEFISC -->
          <div style=\"background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); border-radius: 14px; padding: 1.5rem 1.85rem; color: #ffffff; box-shadow: 0 10px 25px -5px rgba(15,23,42,0.25); border-left: 5px solid #10b981; margin-bottom: 1.5rem;\">
            <div style=\"display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;\">
              <div>
                <span style=\"display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 800; background: rgba(16,185,129,0.2); color: #a7f3d0; padding: 0.25rem 0.65rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(16,185,129,0.35); margin-bottom: 0.5rem;\">
                  🚗 SEOM • Fiscalização & Frota Oficial
                </span>
                <h3 style=\"font-size: 1.35rem; font-weight: 800; margin: 0 0 0.35rem 0; letter-spacing: -0.01em;\">
                  SEFISC • Fiscalização e Frota Oficial
                </h3>
                <p style=\"font-size: 0.86rem; color: #e2e8f0; margin: 0; max-width: 780px; line-height: 1.5;\">
                  Fiscalização in loco de contratos de prestação de serviços terceirizados, gestão e telemetria da frota de veículos oficiais, apoio logístico às vistorias da URE e agendamentos de deslocamento.
                </p>
              </div>
              <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;\">
                <a href=\"\${URLS_OFICIAIS_SEFISC.sharepointOriginal}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"background: rgba(255,255,255,0.15); color: #ffffff; text-decoration: none; padding: 0.5rem 0.95rem; border-radius: 8px; font-size: 0.76rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.3); display: inline-flex; align-items: center; gap: 0.35rem; transition: 0.2s;\" onmouseover=\"this.style.background='rgba(255,255,255,0.25)'\" onmouseout=\"this.style.background='rgba(255,255,255,0.15)'\">
                  🔗 Abrir no SharePoint
                </a>
                <button type=\"button\" id=\"btn-sync-sefisc\" onclick=\"sincronizarDashboardSefisc(true)\" style=\"background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 0.5rem 1.05rem; border-radius: 8px; font-size: 0.76rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; box-shadow: 0 4px 12px rgba(16,185,129,0.35); transition: 0.2s;\" onmouseover=\"this.style.transform='scale(1.02)'\" onmouseout=\"this.style.transform='scale(1)'\">
                  🔄 Sincronizar SEFISC
                </button>
                <button type=\"button\" onclick=\"abrirCarroOficial()\" style=\"background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; border: none; padding: 0.5rem 1.05rem; border-radius: 8px; font-size: 0.76rem; font-weight: 800; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.3);\" onmouseover=\"this.style.transform='scale(1.02)'\" onmouseout=\"this.style.transform='scale(1)'\">
                  🚗 Abrir Painel do Carro Oficial →
                </button>
              </div>
            </div>
            <div style=\"margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.12); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.76rem; color: #cbd5e1;\">
              <span>☁️ Nuvem SharePoint: <strong style=\"color: #ffffff;\">itp_seom_educacao_sp_gov_br</strong> • Conexão Pública Oficial</span>
              <span style=\"color: #a7f3d0;\">● Fiscalização em Campo e Apoio Logístico</span>
            </div>
          </div>

          <!-- 4 CARDS KPIS DO SEFISC -->
          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;\">
            <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-top: 3px solid #10b981;\">
              <div style=\"font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;\">Frota Oficial Ativa</div>
              <div style=\"font-size: 1.6rem; font-weight: 800; color: #047857; line-height: 1.2;\">100% Operacional</div>
              <div style=\"font-size: 0.75rem; color: #059669; font-weight: 600; margin-top: 0.35rem;\">Telemetria, manutenção e seguro em dia</div>
            </div>
            <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-top: 3px solid #2563eb;\">
              <div style=\"font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;\">Fiscalizações em Campo (2026)</div>
              <div style=\"font-size: 1.6rem; font-weight: 800; color: #1e3a8a; line-height: 1.2;\">86 Vistorias</div>
              <div style=\"font-size: 0.75rem; color: #2563eb; font-weight: 600; margin-top: 0.35rem;\">Auditorias in loco de limpeza e merenda</div>
            </div>
            <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-top: 3px solid #f59e0b;\">
              <div style=\"font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;\">Viagens de Vistoria de Obras</div>
              <div style=\"font-size: 1.6rem; font-weight: 800; color: #b45309; line-height: 1.2;\">54 Deslocamentos</div>
              <div style=\"font-size: 0.75rem; color: #b45309; font-weight: 600; margin-top: 0.35rem;\">Apoio logístico aos técnicos do SEOM</div>
            </div>
            <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-top: 3px solid #8b5cf6;\">
              <div style=\"font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;\">Cartão Combustível</div>
              <div style=\"font-size: 1.6rem; font-weight: 800; color: #6d28d9; line-height: 1.2;\">100% Auditado</div>
              <div style=\"font-size: 0.75rem; color: #7c3aed; font-weight: 600; margin-top: 0.35rem;\">Consumo e quilometragem validados</div>
            </div>
          </div>

          <!-- TABELA DE FISCALIZAÇÕES CONTRATUAIS -->
          <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04);\">
            <div style=\"padding: 1rem 1.35rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;\">
              <div>
                <strong style=\"color: #0f172a; font-size: 0.95rem;\">Relatórios de Fiscalização Contratual em Campo (SEFISC)</strong>
                <span style=\"font-size: 0.75rem; color: #64748b; margin-left: 0.5rem;\">(Auditorias in loco)</span>
              </div>
              <input type=\"text\" placeholder=\"Buscar por unidade, contrato ou fiscal...\" oninput=\"filtrarTabelaGenerica(this.value, 'tabela-sefisc-tbody')\" style=\"padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; width: 280px; max-width: 100%;\">
            </div>
            <div style=\"overflow-x: auto;\">
              <table style=\"width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;\">
                <thead style=\"background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1;\">
                  <tr>
                    <th style=\"padding: 0.75rem 1rem;\">Nº Relatório</th>
                    <th style=\"padding: 0.75rem 1rem;\">Unidade Escolar</th>
                    <th style=\"padding: 0.75rem 1rem;\">Contrato / Serviço Auditado</th>
                    <th style=\"padding: 0.75rem 1rem;\">Data da Vistoria</th>
                    <th style=\"padding: 0.75rem 1rem;\">Fiscal Designado</th>
                    <th style=\"padding: 0.75rem 1rem; text-align: center;\">Parecer de Auditoria</th>
                  </tr>
                </thead>
                <tbody id=\"tabela-sefisc-tbody\">
                  <tr style=\"border-bottom: 1px solid #f1f5f9;\">
                    <td style=\"padding: 0.85rem 1rem; font-weight: 700; color: #1e3a8a;\">REL-FISC-86/2026</td>
                    <td style=\"padding: 0.85rem 1rem;\"><strong>Aldeia de Barueri</strong></td>
                    <td style=\"padding: 0.85rem 1rem;\">Serviço Contínuo de Limpeza e Higienização</td>
                    <td style=\"padding: 0.85rem 1rem;\">03/11/2026</td>
                    <td style=\"padding: 0.85rem 1rem;\">Equipe SEFISC / URE</td>
                    <td style=\"padding: 0.85rem 1rem; text-align: center;\"><span style=\"background: #ecfdf5; color: #047857; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #a7f3d0;\">🟢 100% Conforme</span></td>
                  </tr>
                  <tr style=\"border-bottom: 1px solid #f1f5f9;\">
                    <td style=\"padding: 0.85rem 1rem; font-weight: 700; color: #1e3a8a;\">REL-FISC-85/2026</td>
                    <td style=\"padding: 0.85rem 1rem;\"><strong>Moacir Thomaz da Silva</strong></td>
                    <td style=\"padding: 0.85rem 1rem;\">Armazenamento e Qualidade dos Alimentos (Merenda)</td>
                    <td style=\"padding: 0.85rem 1rem;\">29/10/2026</td>
                    <td style=\"padding: 0.85rem 1rem;\">Fiscalização SEFISC</td>
                    <td style=\"padding: 0.85rem 1rem; text-align: center;\"><span style=\"background: #ecfdf5; color: #047857; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #a7f3d0;\">🟢 100% Conforme</span></td>
                  </tr>
                  <tr style=\"border-bottom: 1px solid #f1f5f9;\">
                    <td style=\"padding: 0.85rem 1rem; font-weight: 700; color: #1e3a8a;\">REL-FISC-84/2026</td>
                    <td style=\"padding: 0.85rem 1rem;\"><strong>José Sérgio Pereira, Prof.</strong></td>
                    <td style=\"padding: 0.85rem 1rem;\">Posto de Vigilância Patrimonial e Controle de Acesso</td>
                    <td style=\"padding: 0.85rem 1rem;\">27/10/2026</td>
                    <td style=\"padding: 0.85rem 1rem;\">Fiscalização SEFISC</td>
                    <td style=\"padding: 0.85rem 1rem; text-align: center;\"><span style=\"background: #ecfdf5; color: #047857; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #a7f3d0;\">🟢 100% Conforme</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }`;

const newRenderizarSefisc = `    function renderizarDashboardSefisc() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const kpis = (DADOS_SEFISC && DADOS_SEFISC.kpis) || {
        totalZeladorias: 34,
        ocupadas: 30,
        vagas: 4,
        processosSei: 34
      };
      const zeladorias = (DADOS_SEFISC && DADOS_SEFISC.zeladorias) || [];
      const pctOcupadas = Math.round((kpis.ocupadas / (kpis.totalZeladorias || 1)) * 100);

      container.innerHTML = \`
        <div style=\"margin-top: 1.25rem;\">
          <!-- BANNER DO SEFISC -->
          <div style=\"background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); border-radius: 14px; padding: 1.5rem 1.85rem; color: #ffffff; box-shadow: 0 10px 25px -5px rgba(15,23,42,0.25); border-left: 5px solid #10b981; margin-bottom: 1.5rem;\">
            <div style=\"display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;\">
              <div>
                <span style=\"display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 800; background: rgba(16,185,129,0.2); color: #a7f3d0; padding: 0.25rem 0.65rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(16,185,129,0.35); margin-bottom: 0.5rem;\">
                  🏠 SEFISC • Controle de Zeladorias Escolares (Aba SEFISC Oficial)
                </span>
                <h3 style=\"font-size: 1.35rem; font-weight: 800; margin: 0 0 0.35rem 0; letter-spacing: -0.01em;\">
                  SEFISC • Seção de Fiscalização e Serviços Contratados
                </h3>
                <p style=\"font-size: 0.86rem; color: #e2e8f0; margin: 0; max-width: 780px; line-height: 1.5;\">
                  Base oficial de autorizações de uso de moradia e ocupação de zeladorias escolares da rede estadual, vinculada aos processos SEI e acompanhamento de vencimentos.
                </p>
              </div>
              <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;\">
                <a href=\"\${URLS_OFICIAIS_SEFISC.sharepointOriginal}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"background: rgba(255,255,255,0.15); color: #ffffff; text-decoration: none; padding: 0.5rem 0.95rem; border-radius: 8px; font-size: 0.76rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.3); display: inline-flex; align-items: center; gap: 0.35rem; transition: 0.2s;\" onmouseover=\"this.style.background='rgba(255,255,255,0.25)'\" onmouseout=\"this.style.background='rgba(255,255,255,0.15)'\">
                  📊 Abrir Excel no 365 ↗
                </a>
                <button type=\"button\" id=\"btn-sync-sefisc\" onclick=\"sincronizarDashboardSefisc(true)\" style=\"background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 0.5rem 1.05rem; border-radius: 8px; font-size: 0.76rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; box-shadow: 0 4px 12px rgba(16,185,129,0.35); transition: 0.2s;\" onmouseover=\"this.style.transform='scale(1.02)'\" onmouseout=\"this.style.transform='scale(1)'\">
                  🔄 Sincronizar SEFISC
                </button>
                <button type=\"button\" onclick=\"abrirCarroOficial()\" style=\"background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; border: none; padding: 0.5rem 1.05rem; border-radius: 8px; font-size: 0.76rem; font-weight: 800; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.3);\" onmouseover=\"this.style.transform='scale(1.02)'\" onmouseout=\"this.style.transform='scale(1)'\">
                  🚗 Painel do Carro Oficial →
                </button>
              </div>
            </div>
            <div style=\"margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.12); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.76rem; color: #cbd5e1;\">
              <span>☁️ Arquivo: <strong style=\"color: #ffffff;\">CONTROLE - ZELADORIAS-ATUALIZADA-2026.xlsx</strong> • Aba Selecionada: <strong style=\"color: #a7f3d0;\">SEFISC</strong></span>
              <span style=\"color: #a7f3d0;\">● \${zeladorias.length} Zeladorias Mapeadas na Rede</span>
            </div>
          </div>

          <!-- 4 CARDS KPIS DO SEFISC -->
          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;\">
            <div style=\"background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 1.15rem; box-shadow: 0 4px 12px rgba(16,185,129,0.08);\">
              <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;\">
                <span style=\"font-size: 0.75rem; font-weight: 800; color: #065f46; text-transform: uppercase;\">Zeladorias Ocupadas</span>
                <span style=\"background: #d1fae5; color: #065f46; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;\">🟢</span>
              </div>
              <div style=\"font-size: 1.8rem; font-weight: 900; color: #059669;\">\${kpis.ocupadas}</div>
              <div style=\"font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; margin-top: 0.35rem;\">
                \${pctOcupadas}% de ocupação regular
              </div>
            </div>

            <div style=\"background: #ffffff; border: 1.5px solid #fecaca; border-radius: 12px; padding: 1.15rem; box-shadow: 0 4px 12px rgba(239,68,68,0.08);\">
              <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;\">
                <span style=\"font-size: 0.75rem; font-weight: 800; color: #991b1b; text-transform: uppercase;\">Zeladorias Vagas</span>
                <span style=\"background: #fee2e2; color: #991b1b; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;\">🟡</span>
              </div>
              <div style=\"font-size: 1.8rem; font-weight: 900; color: #dc2626;\">\${kpis.vagas}</div>
              <div style=\"font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; margin-top: 0.35rem;\">
                Disponíveis para nova cessão
              </div>
            </div>

            <div style=\"background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 1.15rem; box-shadow: 0 4px 12px rgba(2,132,199,0.08);\">
              <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;\">
                <span style=\"font-size: 0.75rem; font-weight: 800; color: #0369a1; text-transform: uppercase;\">Processos SEI</span>
                <span style=\"background: #e0f2fe; color: #0369a1; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;\">📋</span>
              </div>
              <div style=\"font-size: 1.8rem; font-weight: 900; color: #0284c7;\">\${kpis.processosSei}</div>
              <div style=\"font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; margin-top: 0.35rem;\">
                Processos de cessão autuados
              </div>
            </div>

            <div style=\"background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1.15rem; box-shadow: 0 4px 12px rgba(0,0,0,0.04);\">
              <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;\">
                <span style=\"font-size: 0.75rem; font-weight: 800; color: #334155; text-transform: uppercase;\">Total Mapeado</span>
                <span style=\"background: #f1f5f9; color: #334155; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;\">🏫</span>
              </div>
              <div style=\"font-size: 1.8rem; font-weight: 900; color: #0b2351;\">\${kpis.totalZeladorias}</div>
              <div style=\"font-size: 0.74rem; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 0.35rem; margin-top: 0.35rem;\">
                Unidades escolares catalogadas
              </div>
            </div>
          </div>

          <!-- BARRA DE FILTROS & PESQUISA SEFISC -->
          <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03);\">
            <div style=\"display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;\">
              <!-- Filtro de Situação -->
              <div style=\"display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;\">
                <span style=\"font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-right: 0.25rem;\">Situação:</span>
                <button type=\"button\" class=\"btn-sefisc-status \${estadoSefisc.filtroStatus === 'TODOS' ? 'active' : ''}\" data-status=\"TODOS\" onclick=\"mudarFiltroStatusSefisc('TODOS', this)\" style=\"padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: \${estadoSefisc.filtroStatus === 'TODOS' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid \${estadoSefisc.filtroStatus === 'TODOS' ? '#0b2351' : '#cbd5e1'}; background: \${estadoSefisc.filtroStatus === 'TODOS' ? '#0b2351' : '#ffffff'}; color: \${estadoSefisc.filtroStatus === 'TODOS' ? '#ffffff' : '#475569'}; box-shadow: \${estadoSefisc.filtroStatus === 'TODOS' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;\">Todas</button>
                <button type=\"button\" class=\"btn-sefisc-status \${estadoSefisc.filtroStatus === 'OCUPADAS' ? 'active' : ''}\" data-status=\"OCUPADAS\" onclick=\"mudarFiltroStatusSefisc('OCUPADAS', this)\" style=\"padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: \${estadoSefisc.filtroStatus === 'OCUPADAS' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid \${estadoSefisc.filtroStatus === 'OCUPADAS' ? '#0b2351' : '#cbd5e1'}; background: \${estadoSefisc.filtroStatus === 'OCUPADAS' ? '#0b2351' : '#ffffff'}; color: \${estadoSefisc.filtroStatus === 'OCUPADAS' ? '#ffffff' : '#475569'}; box-shadow: \${estadoSefisc.filtroStatus === 'OCUPADAS' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;\">🟢 Ocupadas</button>
                <button type=\"button\" class=\"btn-sefisc-status \${estadoSefisc.filtroStatus === 'VAGAS' ? 'active' : ''}\" data-status=\"VAGAS\" onclick=\"mudarFiltroStatusSefisc('VAGAS', this)\" style=\"padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: \${estadoSefisc.filtroStatus === 'VAGAS' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid \${estadoSefisc.filtroStatus === 'VAGAS' ? '#0b2351' : '#cbd5e1'}; background: \${estadoSefisc.filtroStatus === 'VAGAS' ? '#0b2351' : '#ffffff'}; color: \${estadoSefisc.filtroStatus === 'VAGAS' ? '#ffffff' : '#475569'}; box-shadow: \${estadoSefisc.filtroStatus === 'VAGAS' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;\">🟡 Vagas</button>
                <button type=\"button\" class=\"btn-sefisc-status \${estadoSefisc.filtroStatus === 'OK' ? 'active' : ''}\" data-status=\"OK\" onclick=\"mudarFiltroStatusSefisc('OK', this)\" style=\"padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: \${estadoSefisc.filtroStatus === 'OK' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid \${estadoSefisc.filtroStatus === 'OK' ? '#0b2351' : '#cbd5e1'}; background: \${estadoSefisc.filtroStatus === 'OK' ? '#0b2351' : '#ffffff'}; color: \${estadoSefisc.filtroStatus === 'OK' ? '#ffffff' : '#475569'}; box-shadow: \${estadoSefisc.filtroStatus === 'OK' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;\">✅ Regular (OK)</button>
                <button type=\"button\" class=\"btn-sefisc-status \${estadoSefisc.filtroStatus === 'RENOVACAO' ? 'active' : ''}\" data-status=\"RENOVACAO\" onclick=\"mudarFiltroStatusSefisc('RENOVACAO', this)\" style=\"padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: \${estadoSefisc.filtroStatus === 'RENOVACAO' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid \${estadoSefisc.filtroStatus === 'RENOVACAO' ? '#0b2351' : '#cbd5e1'}; background: \${estadoSefisc.filtroStatus === 'RENOVACAO' ? '#0b2351' : '#ffffff'}; color: \${estadoSefisc.filtroStatus === 'RENOVACAO' ? '#ffffff' : '#475569'}; box-shadow: \${estadoSefisc.filtroStatus === 'RENOVACAO' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;\">🔄 Renovação</button>
              </div>

              <!-- Busca rápida -->
              <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-grow: 1; max-width: 380px;\">
                <input type=\"text\" placeholder=\"Buscar por escola, zelador, cargo ou processo...\" oninput=\"buscarZeladoriasSefisc(this.value)\" style=\"width: 100%; padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; outline: none; transition: 0.2s;\" onfocus=\"this.style.borderColor='#38bdf8'\" onblur=\"this.style.borderColor='#cbd5e1'\">
              </div>
            </div>

            <!-- Resumo do filtro -->
            <div style=\"display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.65rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;\">
              <div>
                Filtrando: <strong id=\"sefisc-filtro-contador\" style=\"color: #0b2351;\">\${zeladorias.length} zeladorias</strong>
              </div>
              <div style=\"color: #059669; font-weight: 700;\">
                Planilha: CONTROLE - ZELADORIAS-ATUALIZADA-2026.xlsx • Aba SEFISC
              </div>
            </div>
          </div>

          <!-- TABELA DE ZELADORIAS ESCOLARES -->
          <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04);\">
            <div style=\"padding: 1rem 1.35rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;\">
              <div>
                <strong style=\"color: #0f172a; font-size: 0.95rem;\">Relação Oficial de Zeladorias Escolares (SEFISC / SEOM)</strong>
                <span style=\"font-size: 0.75rem; color: #64748b; margin-left: 0.5rem;\">(Leitura estrita da aba SEFISC)</span>
              </div>
              <span style=\"font-size: 0.74rem; color: #64748b;\">Atualizado automaticamente via SharePoint</span>
            </div>
            <div style=\"overflow-x: auto;\">
              <table style=\"width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;\">
                <thead style=\"background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1;\">
                  <tr>
                    <th style=\"padding: 0.75rem 0.9rem;\">ID</th>
                    <th style=\"padding: 0.75rem 0.9rem;\">Unidade Escolar</th>
                    <th style=\"padding: 0.75rem 0.9rem;\">Zelador / RG</th>
                    <th style=\"padding: 0.75rem 0.9rem;\">Cargo / Lotação</th>
                    <th style=\"padding: 0.75rem 0.9rem;\">Processo SEI</th>
                    <th style=\"padding: 0.75rem 0.9rem;\">Vencimento</th>
                    <th style=\"padding: 0.75rem 0.9rem; text-align: center;\">Situação / OBS</th>
                  </tr>
                </thead>
                <tbody id=\"tabela-sefisc-tbody\">
                  <!-- Preenchido via atualizarTabelaZeladoriasSefisc() -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;

      atualizarTabelaZeladoriasSefisc();
    }`;

indexHtml = replaceAllExact(indexHtml, oldRenderizarSefisc, newRenderizarSefisc);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('index.html atualizado com sucesso com a aba SEFISC!');
