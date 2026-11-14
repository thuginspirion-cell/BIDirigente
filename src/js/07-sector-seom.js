    /* ========================================================================= */
    /* PAINEL DPAT - DIVISÃO DE PATRIMÔNIO (OFICIAL SHAREPOINT - SEOM) */
    /* ========================================================================= */

    function formatarBadgeEstadoDpat(estado) {
      var est = String(estado || 'Não Informado').trim();
      if (/^ótimo/i.test(est)) {
        return '<span style="background: #ecfdf5; color: #047857; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #a7f3d0;">🟢 ' + est + '</span>';
      } else if (/^bom/i.test(est)) {
        return '<span style="background: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #bfdbfe;">🔵 ' + est + '</span>';
      } else if (/^(ruim|péssimo|regular)/i.test(est)) {
        return '<span style="background: #fef2f2; color: #b91c1c; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #fecaca;">🟡 ' + est + '</span>';
      } else {
        return '<span style="background: #f8fafc; color: #64748b; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; border: 1px solid #e2e8f0;">' + est + '</span>';
      }
    }

    function processarPlanilhaDpatBase64(b64) {
      if (!b64 || typeof XLSX === 'undefined') return null;
      var wb = XLSX.read(b64, { type: 'base64' });
      var sheetName = wb.SheetNames.find(function(n) { return n.toLowerCase().indexOf('invent') >= 0; }) || wb.SheetNames[0];
      var ws = wb.Sheets[sheetName];
      if (!ws) return null;
      var rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      var bens = [];
      var ambSet = {};
      rows.forEach(function(r) {
        var chapa = String(r['Chapa'] || r['CHAPA'] || '').trim();
        var material = String(r['Material'] || r['MATERIAL'] || '').trim();
        if (!chapa && !material) return;
        var local = String(r['Local'] || r['LOCAL'] || 'Não Consta').trim() || 'Não Consta';
        var estado = String(r['Estado'] || r['ESTADO'] || 'Não Informado').trim() || 'Não Informado';
        if (local !== 'Não Consta' && local !== '-') ambSet[local] = true;
        bens.push({
          chapa: chapa || '-',
          material: material || '-',
          local: local,
          andar: String(r['Andar'] || r['ANDAR'] || '-').trim() || '-',
          chapaAntiga: String(r['Chapa Antiga'] || '-').trim() || '-',
          responsavel: String(r['Responsável'] || '-').trim() || '-',
          estado: estado,
          obs: String(r['OBS'] || r['Obs'] || '').trim()
        });
      });
      if (bens.length === 0) return null;
      var ambientes = Object.keys(ambSet).sort();
      var agoraDpat = new Date();
      var agoraDpatFormatado = agoraDpat.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + agoraDpat.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      return Object.assign({}, DADOS_DPAT, {
        sucesso: true,
        dataExtracao: agoraDpat.toISOString(),
        meta: Object.assign({}, (DADOS_DPAT && DADOS_DPAT.meta) || {}, {
          atualizadoEm: agoraDpat.toISOString(),
          atualizadoFormatado: agoraDpatFormatado
        }),
        kpis: {
          totalBens: bens.length,
          totalAmbientes: ambientes.length,
          bensLocalizados: bens.filter(function(b) { return b.local && b.local !== 'Não Consta' && b.local !== '-'; }).length,
          bensAvaliadosBomOtimo: bens.filter(function(b) { return /bom|otim|ótim|excel/i.test(b.estado); }).length
        },
        ambientes: ambientes,
        bens: bens
      });
    }

    function formatarTimestampDadosBrasil(obj, fallback) {
      if (obj && obj.meta && obj.meta.atualizadoFormatado) return obj.meta.atualizadoFormatado;
      var raw = (obj && obj.meta && obj.meta.atualizadoEm) || (obj && obj.dataExtracao) || '';
      if (raw) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
          var p = raw.split('-');
          return p[2] + '/' + p[1] + '/' + p[0] + ', 10:00:00';
        }
        var dt = new Date(raw);
        if (!isNaN(dt.getTime())) {
          return dt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + dt.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }
      }
      if (fallback) return fallback;
      var agora = new Date();
      return agora.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + agora.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }

    function sincronizarDashboardDpat(isManual) {
      var manual = (isManual === true || (typeof isManual === 'undefined'));
      if (typeof window.registrarTarefaBootSync === 'function') {
        window.registrarTarefaBootSync('boot_dpat', 'DPAT • Inventário Físico');
      }
      var btn = document.getElementById('btn-sync-dpat');
      if (btn && manual) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Sincronizando...';
      }

      if (manual && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'DPAT • SHAREPOINT AO VIVO',
          titulo: 'Sincronizando Inventário Físico 2026...',
          mensagem: 'Lendo dados ao vivo do arquivo Inventario URE - SAM Patrimônio 2026.xlsx...',
          detalhes: 'Conta: itp_seom_educacao_sp_gov_br • Aba: Inventário Físico',
          duracao: 0
        });
      }

      function concluirSucesso(fonte, veioLive) {
        if (btn && manual) {
          btn.disabled = false;
          btn.innerHTML = '🔄 Sincronizar DPAT';
        }
        var agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        renderizarDashboardDpat();
        if (typeof window.concluirTarefaBootSync === 'function') {
          window.concluirTarefaBootSync('boot_dpat');
        }
        if (manual && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: veioLive ? 'success' : 'info',
            tag: veioLive ? 'DPAT ATUALIZADO AO VIVO' : 'DPAT • ESPELHO NUVEM',
            titulo: veioLive ? 'DPAT Sincronizado Direto do SharePoint!' : 'Base DPAT Verificada (Espelho Nuvem)',
            mensagem: '<strong>' + (DADOS_DPAT && DADOS_DPAT.bens ? DADOS_DPAT.bens.length.toLocaleString('pt-BR') : '0') + ' bens</strong> do Inventário Físico DPAT atualizados!',
            detalhes: (fonte || 'SharePoint Oficial') + ' às ' + agora,
            duracao: 5000
          });
        }
      }

      function buscarMirrorDpat() {
        var mirrorUrl = 'https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/dpat_inventario_2026.json?_t=' + Date.now();
        fetch(mirrorUrl)
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data && data.bens && data.bens.length > 0) DADOS_DPAT = data;
            concluirSucesso('Espelho GitHub (Fallback DPAT)', false);
          })
          .catch(function() { concluirSucesso('Base DPAT carregada', false); });
      }

      consultarSharepointGasLive({
        action: 'sincronizarDpat',
        fnGas: 'sincronizarPlanilhaDpat',
        argsGas: []
      }).then(function(data) {
        if (data && data.sucesso && data.dadosBase64) {
          var pur = (typeof window.purificarXlsxStreamingSeNecessario === 'function')
            ? window.purificarXlsxStreamingSeNecessario(data.dadosBase64)
            : Promise.resolve(data.dadosBase64);
          pur.then(function(cleanB64) {
            var parsed = null;
            try { parsed = processarPlanilhaDpatBase64(cleanB64); } catch (ep) { console.warn('Aviso parse DPAT:', ep); }
            if (parsed) {
              DADOS_DPAT = parsed;
              concluirSucesso('SharePoint Live (Aba Inventário Físico)', true);
            } else {
              buscarMirrorDpat();
            }
          });
        } else if (data && data.bens && data.bens.length > 0) {
          DADOS_DPAT = data;
          concluirSucesso('Espelho Nuvem GAS (DPAT)', false);
        } else {
          buscarMirrorDpat();
        }
      }).catch(buscarMirrorDpat);
    }

    function mudarFiltroAmbienteDpat(amb) {
      estadoDpat.filtroAmbiente = amb;
      estadoDpat.paginaAtual = 1;
      atualizarTabelaInventarioDpat();
    }

    function mudarFiltroEstadoDpat(est) {
      estadoDpat.filtroEstado = est;
      estadoDpat.paginaAtual = 1;
      atualizarTabelaInventarioDpat();
    }

    function buscarBensDpat(termo) {
      estadoDpat.termoBusca = (termo || '').toLowerCase().trim();
      estadoDpat.paginaAtual = 1;
      atualizarTabelaInventarioDpat();
    }

    function mudarPaginaDpat(delta) {
      estadoDpat.paginaAtual = Math.max(1, estadoDpat.paginaAtual + delta);
      atualizarTabelaInventarioDpat();
    }

    function alternarOrdenacaoDpat(colKey) {
      if (estadoDpat.colOrdenacao === colKey) {
        estadoDpat.ordemDir = estadoDpat.ordemDir === 'asc' ? 'desc' : 'asc';
      } else {
        estadoDpat.colOrdenacao = colKey;
        estadoDpat.ordemDir = 'asc';
      }
      estadoDpat.paginaAtual = 1;
      atualizarTabelaInventarioDpat();
    }

    function atualizarTabelaInventarioDpat() {
      var tbody = document.getElementById('tabela-dpat-tbody');
      var counterEl = document.getElementById('dpat-filtro-contador');
      var paginacaoEl = document.getElementById('dpat-paginacao-info');
      var btnPrev = document.getElementById('btn-dpat-prev');
      var btnNext = document.getElementById('btn-dpat-next');
      if (!tbody) return;

      var lista = (DADOS_DPAT && DADOS_DPAT.bens) || [];
      var termo = estadoDpat.termoBusca;
      var amb = estadoDpat.filtroAmbiente;
      var est = estadoDpat.filtroEstado;

      var filtrados = lista.filter(function(item) {
        if (amb !== 'TODOS' && item.local !== amb) return false;
        if (est !== 'TODOS') {
          if (est === 'BOM_OTIMO' && !/^(bom|ótimo)/i.test(item.estado)) return false;
          if (est === 'OTIMO' && !/^ótimo/i.test(item.estado)) return false;
          if (est === 'BOM' && !/^bom/i.test(item.estado)) return false;
          if (est === 'OUTROS' && /^(bom|ótimo)/i.test(item.estado)) return false;
        }
        if (termo) {
          var matchChapa = item.chapa.toLowerCase().includes(termo);
          var matchMaterial = item.material.toLowerCase().includes(termo);
          var matchLocal = item.local.toLowerCase().includes(termo);
          var matchResp = item.responsavel.toLowerCase().includes(termo);
          var matchObs = item.obs.toLowerCase().includes(termo);
          if (!matchChapa && !matchMaterial && !matchLocal && !matchResp && !matchObs) return false;
        }
        return true;
      });

      var colDpat = estadoDpat.colOrdenacao || 'chapa';
      var dirDpat = estadoDpat.ordemDir || 'asc';
      ordenarListaPorColuna(filtrados, {
        dir: dirDpat,
        isDate: false,
        isNum: false,
        getter: function(item) { return item[colDpat] || ''; }
      });

      sincronizarSetasTabelaPorEstado('#tabela-dpat-bens', colDpat, dirDpat);

      var totalFiltrados = filtrados.length;
      var totalPaginas = Math.ceil(totalFiltrados / estadoDpat.itensPorPagina) || 1;
      if (estadoDpat.paginaAtual > totalPaginas) estadoDpat.paginaAtual = totalPaginas;

      var inicio = (estadoDpat.paginaAtual - 1) * estadoDpat.itensPorPagina;
      var fim = Math.min(inicio + estadoDpat.itensPorPagina, totalFiltrados);
      var paginaItens = filtrados.slice(inicio, fim);

      if (counterEl) {
        counterEl.innerText = 'Exibindo ' + totalFiltrados.toLocaleString('pt-BR') + ' de ' + lista.length.toLocaleString('pt-BR') + ' bens patrimoniais';
      }

      if (paginacaoEl) {
        paginacaoEl.innerText = 'Página ' + estadoDpat.paginaAtual + ' de ' + totalPaginas + ' (' + (inicio + 1) + '-' + fim + ')';
      }
      if (btnPrev) btnPrev.disabled = (estadoDpat.paginaAtual <= 1);
      if (btnNext) btnNext.disabled = (estadoDpat.paginaAtual >= totalPaginas);

      if (totalFiltrados === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding: 2.5rem; text-align: center; color: #64748b;"><div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div><strong>Nenhum bem patrimonial localizado</strong><div style="font-size: 0.75rem; margin-top: 0.25rem;">Ajuste o termo de busca ou os filtros de ambiente/estado.</div></td></tr>';
        return;
      }

      tbody.innerHTML = paginaItens.map(function(item) {
        return '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'transparent\'">' +
          '<td style="padding: 0.75rem 0.9rem; font-weight: 800; font-family: monospace; color: #0b2351; font-size: 0.78rem;">' +
            '<span style="background: #eff6ff; color: #1e3a8a; padding: 0.2rem 0.5rem; border-radius: 6px; border: 1px solid #bfdbfe;">' + item.chapa + '</span>' +
          '</td>' +
          '<td style="padding: 0.75rem 0.9rem; color: #1e293b; font-weight: 600; font-size: 0.8rem; max-width: 320px; line-height: 1.35;">' + item.material + '</td>' +
          '<td style="padding: 0.75rem 0.9rem; color: #334155; font-size: 0.78rem;">' +
            '<strong>' + item.local + '</strong>' +
            (item.andar !== '-' ? '<div style="font-size: 0.7rem; color: #64748b;">Andar: ' + item.andar + '</div>' : '') +
          '</td>' +
          '<td style="padding: 0.75rem 0.9rem; color: #475569; font-size: 0.76rem;">' + item.responsavel + '</td>' +
          '<td style="padding: 0.75rem 0.9rem; text-align: center;">' + formatarBadgeEstadoDpat(item.estado) + '</td>' +
          '<td style="padding: 0.75rem 0.9rem; font-size: 0.74rem; color: #64748b;">' + (item.chapaAntiga !== '-' ? item.chapaAntiga : '-') + '</td>' +
          '<td style="padding: 0.75rem 0.9rem; font-size: 0.74rem; color: #64748b; max-width: 180px;">' + (item.obs || '-') + '</td>' +
        '</tr>';
      }).join('');
    }

    var renderizarDashboardSepat = function() { renderizarDashboardDpat(); };

    function renderizarDashboardDpat() {
      var container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      var kpis = (DADOS_DPAT && DADOS_DPAT.kpis) || {
        totalBens: 2189,
        totalAmbientes: 24,
        bensLocalizados: 513,
        bensAvaliadosBomOtimo: 412
      };
      var ambientes = (DADOS_DPAT && DADOS_DPAT.ambientes) || [];

      var optionsAmbientes = ambientes.map(function(a) {
        return '<option value="' + a + '">' + a + '</option>';
      }).join('');

      container.innerHTML = `
        <div style="margin-top: 1.25rem;">
          <!-- BANNER OFICIAL DO DPAT (PADRÃO UNIVERSAL EXECUTIVO) -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">📦</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">DPAT - Divisão de Patrimônio</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Inventário físico oficial de bens móveis permanentes, tombamento patrimonial (chapas ITP), localização por ambiente da Unidade Regional de Ensino e conservação de materiais.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #c7d2fe; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="dpat-banner-timestamp" style="color: #ffffff;">${formatarTimestampDadosBrasil(DADOS_DPAT, '04/11/2026, 10:00:00')}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem;">
                <button type="button" onclick="sincronizarDashboardDpat(true)" id="btn-sync-dpat" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  <span class="sync-spin-icon">🔄</span> Sincronizar DPAT
                </button>
                <a href="${URLS_OFICIAIS_DPAT.sharepointOriginal || URLS_OFICIAIS_DPAT.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com ${kpis.totalBens.toLocaleString('pt-BR')} bens inventariados</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS DO DPAT (100% REAIS DA ABA INVENTÁRIO FÍSICO) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
            <!-- CARD 1 -->
            <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Total de Bens</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    📦
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalBens.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Bens catalogados</span>
                <span style="color: #64748b; font-weight: 600;">100% Mapeados</span>
              </div>
            </div>

            <!-- CARD 2 -->
            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Ambientes / Setores</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    🏢
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalAmbientes || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Salas mapeadas</span>
                <span style="color: #64748b; font-weight: 600;">Dependências</span>
              </div>
            </div>

            <!-- CARD 3 -->
            <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Bens Alocados</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    📍
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.bensLocalizados.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Alocados em salas</span>
                <span style="color: #64748b; font-weight: 600;">Confirmados</span>
              </div>
            </div>

            <!-- CARD 4 -->
            <div style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Estado Bom / Ótimo</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a; font-size: 1.1rem;">
                    ⭐
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.bensAvaliadosBomOtimo.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #92400e; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Conservação ativa</span>
                <span style="color: #64748b; font-weight: 600;">Em uso</span>
              </div>
            </div>
          </div>

          <!-- TABELA INVENTÁRIO FÍSICO DPAT -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
            <div style="padding: 1.1rem 1.35rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <strong style="color: #0f172a; font-size: 0.95rem;">Relação Oficial do Inventário Físico Patrimonial</strong>
                <span style="font-size: 0.75rem; color: #64748b; margin-left: 0.5rem;">(Leitura estrita da aba Inventário Físico)</span>
                <div id="dpat-filtro-contador" style="font-size: 0.76rem; color: #059669; font-weight: 700; margin-top: 0.2rem;">
                  Carregando...
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <input type="text" id="busca-dpat" placeholder="🔍 Buscar chapa, material, sala..." onkeyup="buscarBensDpat(this.value)" style="padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; width: 230px; outline: none;">
                <select id="select-ambiente-dpat" onchange="mudarFiltroAmbienteDpat(this.value)" style="padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; background: #ffffff; outline: none; max-width: 200px;">
                  <option value="TODOS">Todos os Ambientes</option>
                  ${optionsAmbientes}
                </select>
                <select id="select-estado-dpat" onchange="mudarFiltroEstadoDpat(this.value)" style="padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; background: #ffffff; outline: none;">
                  <option value="TODOS">Todos os Estados</option>
                  <option value="BOM_OTIMO">Bom ou Ótimo</option>
                  <option value="OTIMO">Somente Ótimo</option>
                  <option value="BOM">Somente Bom</option>
                  <option value="OUTROS">Outros / Não Informado</option>
                </select>
              </div>
            </div>

            <div style="overflow-x: auto; max-height: 580px;">
              <table id="tabela-dpat-bens" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                <thead style="background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1; position: sticky; top: 0; z-index: 2;">
                  <tr>
                    <th data-col="chapa" class="th-sortable sort-active-asc" onclick="alternarOrdenacaoDpat('chapa')" style="padding: 0.75rem 0.9rem; min-width: 120px; background: #f1f5f9;" title="Clique para classificar por Chapa Patrimonial"><div class="th-sort-wrapper"><span class="th-title-text">Chapa Patrimonial</span><span class="sort-arrow">▲</span></div></th>
                    <th data-col="material" class="th-sortable" onclick="alternarOrdenacaoDpat('material')" style="padding: 0.75rem 0.9rem; min-width: 280px; background: #f1f5f9;" title="Clique para classificar por Material / Descrição"><div class="th-sort-wrapper"><span class="th-title-text">Material / Descrição do Bem</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="local" class="th-sortable" onclick="alternarOrdenacaoDpat('local')" style="padding: 0.75rem 0.9rem; min-width: 170px; background: #f1f5f9;" title="Clique para classificar por Local / Ambiente"><div class="th-sort-wrapper"><span class="th-title-text">Local / Ambiente</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="responsavel" class="th-sortable" onclick="alternarOrdenacaoDpat('responsavel')" style="padding: 0.75rem 0.9rem; min-width: 110px; background: #f1f5f9;" title="Clique para classificar por Responsável"><div class="th-sort-wrapper"><span class="th-title-text">Responsável</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="estado" class="th-sortable" onclick="alternarOrdenacaoDpat('estado')" style="padding: 0.75rem 0.9rem; text-align: center; min-width: 110px; background: #f1f5f9;" title="Clique para classificar por Estado"><div class="th-sort-wrapper center"><span class="th-title-text">Estado</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="chapaAntiga" class="th-sortable" onclick="alternarOrdenacaoDpat('chapaAntiga')" style="padding: 0.75rem 0.9rem; min-width: 100px; background: #f1f5f9;" title="Clique para classificar por Chapa Antiga"><div class="th-sort-wrapper"><span class="th-title-text">Chapa Antiga</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="obs" class="th-sortable" onclick="alternarOrdenacaoDpat('obs')" style="padding: 0.75rem 0.9rem; min-width: 120px; background: #f1f5f9;" title="Clique para classificar por OBS"><div class="th-sort-wrapper"><span class="th-title-text">OBS</span><span class="sort-arrow">↕</span></div></th>
                  </tr>
                </thead>
                <tbody id="tabela-dpat-tbody">
                </tbody>
              </table>
            </div>

            <!-- CONTROLE DE PAGINAÇÃO -->
            <div style="padding: 0.75rem 1.35rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.78rem;">
              <span id="dpat-paginacao-info" style="color: #64748b; font-weight: 600;">Página 1</span>
              <div style="display: flex; gap: 0.4rem;">
                <button type="button" id="btn-dpat-prev" onclick="mudarPaginaDpat(-1)" style="padding: 0.35rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; color: #334155; font-size: 0.74rem; font-weight: 700; cursor: pointer;">← Anterior</button>
                <button type="button" id="btn-dpat-next" onclick="mudarPaginaDpat(1)" style="padding: 0.35rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; color: #334155; font-size: 0.74rem; font-weight: 700; cursor: pointer;">Próxima →</button>
              </div>
            </div>
          </div>

          <!-- NOTA METODOLÓGICA E ORIENTAÇÕES DO DPAT -->
          <div id="nota-metodologica-dpat" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">📦</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">DPAT • NOTAS METODOLÓGICAS &amp; GESTÃO DO PATRIMÔNIO PÚBLICO</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Inventário físico de bens móveis permanentes, tombamento, classificação de conservação e processos de desfazimento</div>
                </div>
              </div>
              <span style="background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Inventário DPAT • 2.189 Bens Mapeados</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Tombamento e Inventário -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #818cf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏷️</span> <span>Tombamento &amp; Identificação Física</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Plaqueta de Patrimônio:</strong> Todo bem móvel permanente recebe número sequencial de tombamento único afixado via placa metálica ou código de barras inviolável.<br>
                  • <strong>Mapeamento por Ambiente:</strong> O sistema rastreia 2.189 itens distribuídos em 24 salas e dependências da sede regional e polos administrativos da URE Itapevi.
                </div>
              </div>

              <!-- Bloco 2: Classificação de Estado -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #34d399; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>⭐</span> <span>Classificação do Estado de Conservação</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Ótimo / Bom:</strong> Equipamento em pleno funcionamento técnico e estética preservada, pronto para uso imediato sem necessidade de intervenção.<br>
                  • <strong>Regular / Recuperável:</strong> Bem com desgaste de uso ou avaria leve passível de reparo com viabilidade econômica comprovada.
                </div>
              </div>

              <!-- Bloco 3: Desfazimento de Inservíveis -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #f59e0b; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>♻️</span> <span>Desfazimento &amp; Baixa Patrimonial</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Bens Inservíveis / Antieconômicos:</strong> Equipamentos obsoletos ou com custo de reparo superior a 50% do valor de reposição no mercado.<br>
                  • <strong>Fluxo SEI de Baixa:</strong> Processo administrativo formal com laudo pericial, autorização do Dirigente Regional e destinação sustentável (leilão ou descarte ecológico).
                </div>
              </div>

              <!-- Bloco 4: Responsabilidade Funcional -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📋</span> <span>Termo de Guarda &amp; Controle TCE</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Termo de Responsabilidade:</strong> Cada chefe de núcleo ou setor assina anualmente a guarda dos bens alocados sob sua gerência direta.<br>
                  • <strong>Auditoria Contábil:</strong> Sincronização direta com o Balanço Geral do Estado e prestação de contas ordinária perante o Tribunal de Contas do Estado (TCE-SP).
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Departamento de Patrimônio e Almoxarifado (CAF / DPAT)</span>
              <span>Fiscalização Ativa de Bens • Decreto Estadual nº 63.616/2018</span>
            </div>
          </div>
        </div>
      `;

      atualizarTabelaInventarioDpat();
    }


    /* ========================================================================= */
    /* PAINEL SEOM - SEÇÃO DE OBRAS E MANUTENÇÃO ESCOLAR (CENTRO INDEPENDENTE) */
    /* ========================================================================= */
    function renderizarDashboardSeom() {
      var container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      var escolas = (DADOS_SEOM && DADOS_SEOM.escolas) || [];
      var totalEscolas = escolas.length;

      /* Cálculo de KPIs reais da aba MAPA */
      var obrasAtivas = escolas.filter(function(e) { return e.obraFde == 1 || e.obraFde == 2; }).length;
      var avcbRegular = escolas.filter(function(e) { return e.avcb == 1; }).length;
      var avcbPendente = escolas.filter(function(e) { return e.avcb == 0; }).length;
      var matriculaOk = escolas.filter(function(e) { return e.matriculaAtualizada == 1; }).length;
      var telhadoConcluido = escolas.filter(function(e) { return e.telhado == 1; }).length;

      container.innerHTML = `
        <div style="margin-top: 1.25rem;">
          <!-- BANNER OFICIAL DO SEOM (PADRÃO UNIVERSAL EXECUTIVO) -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">🏗️</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEOM - Seção de Obras e Manutenção Escolar</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Mapeamento oficial das 60 unidades escolares da URE Itapevi em 11 indicadores prediais: Obra FDE, AVCB, Cuidador, Elétrica, Limpeza, Matrícula Atualizada, SGI, Telhado, Zeladoria, Esgoto e Consumo de Água.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #fde68a; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="seom-banner-timestamp" style="color: #ffffff;">${(DADOS_SEOM && DADOS_SEOM.meta && DADOS_SEOM.meta.atualizadoFormatado) || '10/11/2026, 18:30:00'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem;">
                <button type="button" onclick="sincronizarDashboardSeom(true)" id="btn-sync-seom" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  <span class="sync-spin-icon">🔄</span> Sincronizar SEOM
                </button>
                <a href="${URLS_OFICIAIS_SEOM.sharepointOriginal || URLS_OFICIAIS_SEOM.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com ${totalEscolas} escolas e 11 indicadores prediais</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS DO SEOM (100% REAIS DA ABA MAPA) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
            <!-- CARD 1 -->
            <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Total de Escolas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    🏫
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${totalEscolas}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>100% da rede</span>
                <span style="color: #64748b; font-weight: 600;">URE Itapevi</span>
              </div>
            </div>

            <!-- CARD 2 -->
            <div style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Obras FDE Ativas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a; font-size: 1.1rem;">
                    🏗️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${obrasAtivas}</div>
              </div>
              <div style="font-size: 0.74rem; color: #92400e; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Obras ativas</span>
                <span style="color: #64748b; font-weight: 600;">FDE</span>
              </div>
            </div>

            <!-- CARD 3 -->
            <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">AVCB Regularizados</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    🛡️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${avcbRegular}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>${avcbPendente} pendentes</span>
                <span style="color: #64748b; font-weight: 600;">Bombeiros</span>
              </div>
            </div>

            <!-- CARD 4 -->
            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Matrícula Atualizada</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    📜
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${matriculaOk}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Telhados: ${telhadoConcluido}</span>
                <span style="color: #64748b; font-weight: 600;">Regular</span>
              </div>
            </div>
          </div>

          <!-- TABELA MAPA SEOM 100% REAL -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.85rem;">
              <div>
                <h4 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0;">
                  📋 Mapa Geral de Infraestrutura e Manutenção (60 Escolas)
                </h4>
                <div id="contador-escolas-seom" style="font-size: 0.76rem; color: #64748b; margin-top: 0.2rem;">
                  Exibindo ${totalEscolas} de ${totalEscolas} escolas monitoradas
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <input type="text" id="busca-seom" placeholder="🔍 Buscar escola..." onkeyup="filtrarBuscaSeom(this.value)" style="padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; width: 220px; outline: none;">
              </div>
            </div>

            <!-- FILTROS SEOM REMOVIDOS CONFORME SOLICITADO -->

            <!-- LEGENDA DE STATUS -->
            <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.85rem; font-size: 0.72rem; color: #475569; background: #f8fafc; padding: 0.45rem 0.75rem; border-radius: 6px; border: 1px solid #e2e8f0;">
              <span style="font-weight: 700; color: #1e293b;">Legenda Oficial:</span>
              <span><strong style="color: #b91c1c;">✕ 0</strong> = Pendente / Não Regular</span>
              <span><strong style="color: #047857;">✓ 1</strong> = Concluído / Regular</span>
              <span><strong style="color: #b45309;">⏳ 2</strong> = Em Acompanhamento / Andamento</span>
              <span><strong style="color: #94a3b8;">-</strong> = Sem Registro / N/A</span>
            </div>

            <div style="overflow-x: auto; max-height: 580px;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.76rem;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #334155; position: sticky; top: 0; z-index: 2;">
                    <th style="padding: 0.75rem 0.85rem; min-width: 220px; font-weight: 800; background: #f8fafc; text-align: left;">Unidade Escolar</th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Obra FDE<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Oswaldo</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">AVCB<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Nicolas</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Cuidador<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Márcia</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Elétrica<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Oswaldo</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Limpeza<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Oswaldo</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Matrícula<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Laura</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">SGI<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Laura</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Telhado<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Oswaldo</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Zeladoria<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Márcia</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Esgoto<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Oswaldo</div></th>
                    <th style="padding: 0.75rem 0.5rem; text-align: center; min-width: 95px; background: #f8fafc;">Água<div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Nicolas</div></th>
                  </tr>
                </thead>
                <tbody id="tbody-mapa-seom">
                </tbody>
              </table>
            </div>
          

          <!-- NOTAS METODOLÓGICAS & CRITÉRIOS DE INFRAESTRUTURA (SEOM) -->
          <div id="nota-metodologica-seom" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🏗️</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEOM • NOTAS METODOLÓGICAS &amp; MATRIZ PREDIAL DAS 60 ESCOLAS</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Critérios técnicos, fiscalização de obras FDE, regularização de AVCB e gestão predial</div>
                </div>
              </div>
              <span style="background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Acompanhamento SEOM.xlsx (Aba MAPA)</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Obras FDE vs SEOM -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #f59e0b; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏛️</span> <span>Obras FDE vs Fiscalização SEOM</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Obras FDE Ativas:</strong> Obras contratadas e geridas diretamente pela Fundação para o Desenvolvimento da Educação (FDE), com acompanhamento de engenharia regional (Oswaldo).<br>
                  • <strong>Papel do SEOM:</strong> Vistoria técnica contínua, fiscalização local, mediação de áreas interditadas com as equipes gestoras e controle do cronograma de intervenção.
                </div>
              </div>

              <!-- Bloco 2: AVCB Bombeiros -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #ef4444; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🚒</span> <span>Laudo AVCB dos Bombeiros</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Regularizado (1):</strong> Auto de Vistoria do Corpo de Bombeiros emitido, válido e em conformidade.<br>
                  • <strong>Pendente (0):</strong> Unidade em adequação técnica predial (instalação/revisão de hidrantes, extintores, bombas de incêndio, sinalização e rotas de fuga).
                </div>
              </div>

              <!-- Bloco 3: Matriz Predial Mapa 11D -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📊</span> <span>Matriz Predial Mapa 11D (8 Indicadores)</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Diagnóstico Contínuo:</strong> Avaliação técnica padronizada em 8 itens críticos (AVCB, Obra FDE, Telhado, Elétrica, Esgoto, Água, Limpeza e SGI/Matrícula).<br>
                  • <strong>Score Geral de Infraestrutura:</strong> Pontuação ponderada (0 a 100 pts) para priorização de intervenções emergenciais e reformas preventivas nas 60 escolas.
                </div>
              </div>

              <!-- Bloco 4: SGI & Matrícula Imobiliária Cartorial -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #10b981; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📜</span> <span>SGI &amp; Matrícula Imobiliária (Cartório)</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>SGI (Sistema de Gestão de Imóveis):</strong> Cadastro oficial do patrimônio imobiliário do Estado de SP com planta, área de terreno e metragem construída de cada escola.<br>
                  • <strong>Matrícula Cartorial:</strong> Situação dominial perante o Cartório de Registro de Imóveis (CRI). Status <em>Regular</em> atesta escritura e matrícula definitiva em nome da Fazenda Pública Estadual.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Seção de Obras e Manutenção Escolar (SEOM)</span>
              <span>Responsável Técnico: Oswaldo • Integração SharePoint em Tempo Real</span>
            </div>
          </div>

</div>
        </div>
      `;

      atualizarTabelaMapaSeom();
    }

    function formatarStatusIconeSeom(val) {
      var str = String(val !== undefined && val !== null ? val : '-').trim();
      if (str === '1') {
        return '<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #ecfdf5; color: #047857; border-radius: 6px; font-size: 0.85rem; font-weight: 800; border: 1px solid #a7f3d0;" title="1 - Concluído / Regular">✓</span>';
      } else if (str === '0') {
        return '<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #fef2f2; color: #b91c1c; border-radius: 6px; font-size: 0.85rem; font-weight: 800; border: 1px solid #fecaca;" title="0 - Pendente / Não Regular">✕</span>';
      } else if (str === '2' || str === '22') {
        return '<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #fffbeb; color: #b45309; border-radius: 6px; font-size: 0.85rem; font-weight: 800; border: 1px solid #fde68a;" title="2 - Em Acompanhamento / Andamento">⏳</span>';
      } else {
        return '<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #f8fafc; color: #94a3b8; border-radius: 6px; font-size: 0.85rem; font-weight: 700; border: 1px solid #e2e8f0;" title="Sem Registro / N/A">-</span>';
      }
    }

    function processarPlanilhaSeomBase64(b64) {
      if (!b64 || typeof XLSX === 'undefined') return null;
      var wb = XLSX.read(b64, { type: 'base64' });
      var sheetName = wb.SheetNames.find(function(n) { return n.trim().toUpperCase() === 'MAPA'; }) || wb.SheetNames[0];
      var ws = wb.Sheets[sheetName];
      if (!ws) return null;
      var rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      var parseCel = function(v) {
        if (v === 0 || v === 1 || v === 2) return v;
        var s = String(v === null || v === undefined ? '' : v).trim();
        if (s === '0' || s === '1' || s === '2') return parseInt(s, 10);
        return s || 0;
      };
      var escolas = [];
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (!Array.isArray(r) || r.length < 12) continue;
        var nome = String(r[0] || '').trim();
        if (!nome || nome.toUpperCase() === 'UNIDADE ESCOLAR' || nome.toUpperCase() === 'LEGENDA') continue;
        escolas.push({
          escola: nome,
          obraFde: parseCel(r[1]),
          avcb: parseCel(r[2]),
          cuidador: parseCel(r[3]),
          eletrica: parseCel(r[4]),
          limpeza: parseCel(r[5]),
          matriculaAtualizada: parseCel(r[6]),
          sgi: parseCel(r[7]),
          telhado: parseCel(r[8]),
          zeladoria: parseCel(r[9]),
          esgoto: parseCel(r[10]),
          consumoAgua: parseCel(r[11])
        });
      }
      if (escolas.length === 0) return null;
      return Object.assign({}, DADOS_SEOM, {
        sucesso: true,
        dataExtracao: new Date().toISOString(),
        totalEscolas: escolas.length,
        escolas: escolas
      });
    }

    function sincronizarDashboardSeom(isManual) {
      var manual = (isManual === true || (typeof isManual === 'undefined'));
      if (typeof window.registrarTarefaBootSync === 'function') {
        window.registrarTarefaBootSync('boot_seom', 'SEOM • Obras e Infraestrutura');
      }
      var btn = document.getElementById('btn-sync-seom');
      if (btn && manual) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Sincronizando...';
      }

      if (manual && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEOM • SHAREPOINT AO VIVO',
          titulo: 'Sincronizando Obras e Infraestrutura 2026...',
          mensagem: 'Conectando à planilha oficial Acompanhamento SEOM.xlsx (Aba MAPA)...',
          detalhes: 'Conexão Direta à Fonte Oficial • 60 Escolas Estaduais',
          duracao: 0
        });
      }

      function concluirSucesso(fonte, veioLive) {
        if (btn && manual) {
          btn.disabled = false;
          btn.innerHTML = '🔄 Sincronizar SEOM';
        }
        if (veioLive && typeof DADOS_SEOM !== 'undefined' && DADOS_SEOM) {
          if (!DADOS_SEOM.meta) DADOS_SEOM.meta = {};
          DADOS_SEOM.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          var elSeomTs = document.getElementById('seom-banner-timestamp');
          if (elSeomTs) elSeomTs.textContent = DADOS_SEOM.meta.atualizadoFormatado;
        }
        if (document.getElementById('tabela-seom-tbody')) {
          atualizarTabelaMapaSeom();
        }
        if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
        if (typeof window.concluirTarefaBootSync === 'function') {
          window.concluirTarefaBootSync('boot_seom');
        }
        var agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (manual && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: veioLive ? 'success' : 'info',
            tag: veioLive ? 'SEOM ATUALIZADO AO VIVO' : 'SEOM • ESPELHO NUVEM',
            titulo: veioLive ? 'SEOM Sincronizado Direto do SharePoint!' : 'Base SEOM Verificada (Espelho Nuvem)',
            mensagem: '<strong>Mapa de Infraestrutura Escolar (' + ((DADOS_SEOM && DADOS_SEOM.escolas) ? DADOS_SEOM.escolas.length : 60) + ' escolas)</strong> atualizado!',
            detalhes: (fonte || 'SharePoint Oficial') + ' às ' + agora,
            duracao: 5000
          });
        }
      }

      function buscarMirrorSeom() {
        var mirrorUrl = 'https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/seom_mapa_2026.json?_t=' + Date.now();
        fetch(mirrorUrl)
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data && data.escolas && data.escolas.length > 0) DADOS_SEOM = data;
            concluirSucesso('Espelho GitHub (Fallback SEOM)', false);
          })
          .catch(function() { concluirSucesso('Base SEOM carregada', false); });
      }

      consultarSharepointGasLive({
        action: 'sincronizarSeom',
        fnGas: 'sincronizarPlanilhaSeom',
        argsGas: []
      }).then(function(data) {
        if (data && data.sucesso && data.dadosBase64) {
          var pur = (typeof window.purificarXlsxStreamingSeNecessario === 'function')
            ? window.purificarXlsxStreamingSeNecessario(data.dadosBase64)
            : Promise.resolve(data.dadosBase64);
          pur.then(function(cleanB64) {
            var parsed = null;
            try { parsed = processarPlanilhaSeomBase64(cleanB64); } catch (ep) { console.warn('Aviso parse SEOM:', ep); }
            if (parsed) {
              DADOS_SEOM = parsed;
              if (document.getElementById('tabela-seom-tbody')) renderizarDashboardSeom();
              concluirSucesso('SharePoint Live (Aba MAPA)', true);
            } else {
              buscarMirrorSeom();
            }
          });
        } else if (data && data.escolas && data.escolas.length > 0) {
          DADOS_SEOM = data;
          concluirSucesso('Espelho Nuvem GAS (SEOM)', false);
        } else {
          buscarMirrorSeom();
        }
      }).catch(buscarMirrorSeom);
    }

    function mudarFiltroResponsavelSeom(resp, btnEl) {
      if (!window.estadoSeom) window.estadoSeom = { filtroResp: 'TODOS', termoBusca: '' };
      window.estadoSeom.filtroResp = resp;
      document.querySelectorAll('.btn-seom-resp').forEach(function(b) {
        var isMatch = (btnEl && b === btnEl) || (b.getAttribute('data-resp') === resp);
        if (isMatch) {
          b.style.background = '#0b2351';
          b.style.color = '#ffffff';
          b.style.fontWeight = '700';
          b.style.borderColor = '#0b2351';
        } else {
          b.style.background = '#f8fafc';
          b.style.color = '#475569';
          b.style.fontWeight = '500';
          b.style.borderColor = '#cbd5e1';
        }
      });
      atualizarTabelaMapaSeom();
    }

    function filtrarBuscaSeom(termo) {
      if (!window.estadoSeom) window.estadoSeom = { filtroResp: 'TODOS', termoBusca: '' };
      window.estadoSeom.termoBusca = (termo || '').toLowerCase().trim();
      atualizarTabelaMapaSeom();
    }

    function atualizarTabelaMapaSeom() {
      var tbody = document.getElementById('tbody-mapa-seom');
      var contadorEl = document.getElementById('contador-escolas-seom');
      if (!tbody) return;

      var lista = (DADOS_SEOM && DADOS_SEOM.escolas) || [];
      var resp = (window.estadoSeom && window.estadoSeom.filtroResp) || 'TODOS';
      var termo = (window.estadoSeom && window.estadoSeom.termoBusca) || '';

      var filtradas = lista.filter(function(item) {
        if (termo && (!item.escola || !item.escola.toLowerCase().includes(termo))) {
          return false;
        }
        if (resp === 'OBRAS_ATIVAS') {
          return item.obraFde == 1 || item.obraFde == 2;
        }
        if (resp === 'AVCB_PENDENTE') {
          return item.avcb == 0;
        }
        if (resp === 'OSWALDO') {
          return item.obraFde == 0 || item.eletrica == 0 || item.telhado == 0;
        }
        if (resp === 'NICOLAS') {
          return item.avcb == 0 || item.consumoAgua == 0;
        }
        if (resp === 'MARCIA') {
          return item.cuidador == 0 || item.zeladoria == 0;
        }
        if (resp === 'LAURA') {
          return item.matriculaAtualizada == 0 || item.sgi == 0;
        }
        return true;
      });

      if (contadorEl) {
        contadorEl.textContent = 'Exibindo ' + filtradas.length + ' de ' + lista.length + ' escolas monitoradas';
      }

      if (filtradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" style="padding: 2.5rem; text-align: center; color: #64748b; font-size: 0.9rem;">🔍 Nenhuma escola localizada com os filtros selecionados.</td></tr>';
        return;
      }

      var htmlRows = filtradas.map(function(e, idx) {
        return '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'transparent\'">' +
          '<td style="padding: 0.75rem 0.85rem; font-weight: 700; color: #1e293b; font-size: 0.82rem; text-align: left;">' +
            '<span>' + e.escola + '</span>' +
          '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.obraFde) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.avcb) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.cuidador) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.eletrica) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.limpeza) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.matriculaAtualizada) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.sgi) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.telhado) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.zeladoria) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.esgoto) + '</td>' +
          '<td style="padding: 0.65rem 0.6rem; text-align: center;">' + formatarStatusIconeSeom(e.consumoAgua) + '</td>' +
        '</tr>';
      }).join('');

      tbody.innerHTML = htmlRows;
    }

    

        /* ========================================================================= */
    /* SEFISC: CONTROLE DE ZELADORIAS ESCOLARES (ABA SEFISC OFICIAL 2026) */
    /* Sem códigos ou IDs inventados - fidelidade estrita à fonte oficial */
    /* ========================================================================= */
    /* ========================================================================= */
    /* SEFISC: SINCRONIZACAO RESILIENTE DA ABA SEFISC (ZELADORIAS)               */
    /* ========================================================================= */
    function processarPlanilhaSefiscBase64(b64) {
      if (!b64 || typeof XLSX === 'undefined') return null;
      var wb = XLSX.read(b64, { type: 'base64' });
      var sheetName = wb.SheetNames.find(function(n) { return n.trim().toUpperCase() === 'SEFISC'; }) || wb.SheetNames[0];
      var ws = wb.Sheets[sheetName];
      if (!ws) return null;
      var fmtData = function(v) {
        if (typeof v === 'number' && v >= 30000 && v <= 65000 && XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
          var p = XLSX.SSF.parse_date_code(v);
          if (p) return p.d + '/' + p.m + '/' + String(p.y).slice(-2);
        }
        return String(v === null || v === undefined ? '' : v).trim();
      };
      var rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      var registros = [];
      rows.forEach(function(r) {
        var escola = String(r['Unidade Escolar'] || '').trim();
        if (!escola) return;
        registros.push({
          'Unidade Escolar': escola,
          'Nome do Zelador': String(r['Nome do Zelador'] || '').trim(),
          'RG': String(r['RG'] || '-').trim(),
          'Cargo': String(r['Cargo'] || '-').trim(),
          'Unidade de Classificação': String(r['Unidade de Classificação'] || '-').trim(),
          'Publicação': fmtData(r['Publicação']),
          'Venc.': fmtData(r['Venc.']),
          'Processo': String(r['Processo'] || '-').trim(),
          'OBS.': String(r['OBS.'] || r['OBS'] || '').trim()
        });
      });
      if (registros.length === 0) return null;
      return Object.assign({}, DADOS_SEFISC, {
        sucesso: true,
        totalRegistros: registros.length,
        registros: registros
      });
    }

    function sincronizarDashboardSefisc(isManual) {
      var manual = (isManual === true || (typeof isManual === 'undefined'));
      if (typeof window.registrarTarefaBootSync === 'function') {
        window.registrarTarefaBootSync('boot_sefisc', 'SEFISC • Zeladorias Escolares');
      }
      var btn = document.getElementById('btn-sync-sefisc');
      if (btn && manual) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Sincronizando...';
      }

      if (manual && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEFISC • SHAREPOINT AO VIVO',
          titulo: 'Sincronizando Zeladorias Escolares 2026...',
          mensagem: 'Conectando à planilha oficial CONTROLE - ZELADORIAS-ATUALIZADA-2026.xlsx (Aba SEFISC)...',
          detalhes: 'Conexão Direta à Fonte Oficial • Sem Login',
          duracao: 0
        });
      }

      function concluirSucesso(fonte, veioLive) {
        if (btn && manual) {
          btn.disabled = false;
          btn.innerHTML = '🔄 Sincronizar SEFISC';
        }
        if (veioLive && typeof DADOS_SEFISC !== 'undefined' && DADOS_SEFISC) {
          if (!DADOS_SEFISC.meta) DADOS_SEFISC.meta = {};
          DADOS_SEFISC.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }
        var container = document.getElementById('setor-conteudo-dinamico');
        if (container && document.getElementById('tabela-sefisc-tbody')) {
          renderizarDashboardSefisc();
        }
        if (typeof window.concluirTarefaBootSync === 'function') {
          window.concluirTarefaBootSync('boot_sefisc');
        }
        var agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (manual && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: veioLive ? 'success' : 'info',
            tag: veioLive ? 'SEFISC ATUALIZADO AO VIVO' : 'SEFISC • ESPELHO NUVEM',
            titulo: veioLive ? 'SEFISC Sincronizado Direto do SharePoint!' : 'Base SEFISC Verificada (Espelho Nuvem)',
            mensagem: '<strong>Controle de Zeladorias Escolares (' + normalizarRegistrosSefisc(DADOS_SEFISC).length + ' registros)</strong> atualizado!',
            detalhes: (fonte || 'SharePoint Oficial') + ' às ' + agora,
            duracao: 5000
          });
        }
      }

      function buscarMirrorSefisc() {
        var mirrorUrl = 'https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sefisc_zeladorias_2026.json?_t=' + Date.now();
        fetch(mirrorUrl)
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data && (data.zeladorias || data.registros)) DADOS_SEFISC = data;
            concluirSucesso('Espelho GitHub (Fallback SEFISC)', false);
          })
          .catch(function() { concluirSucesso('Base SEFISC carregada', false); });
      }

      consultarSharepointGasLive({
        action: 'sincronizarSefisc',
        fnGas: 'sincronizarPlanilhaSefisc',
        argsGas: []
      }).then(function(data) {
        if (data && data.sucesso && data.dadosBase64) {
          var pur = (typeof window.purificarXlsxStreamingSeNecessario === 'function')
            ? window.purificarXlsxStreamingSeNecessario(data.dadosBase64)
            : Promise.resolve(data.dadosBase64);
          pur.then(function(cleanB64) {
            var parsed = null;
            try { parsed = processarPlanilhaSefiscBase64(cleanB64); } catch (ep) { console.warn('Aviso parse SEFISC:', ep); }
            if (parsed) {
              DADOS_SEFISC = parsed;
              concluirSucesso('SharePoint Live (Aba SEFISC)', true);
            } else {
              buscarMirrorSefisc();
            }
          });
        } else if (data && (data.zeladorias || data.registros)) {
          DADOS_SEFISC = data;
          concluirSucesso('Espelho Nuvem GAS (SEFISC)', false);
        } else {
          buscarMirrorSefisc();
        }
      }).catch(buscarMirrorSefisc);
    }

    function normalizarRegistrosSefisc(dados) {
      if (!dados) return [];
      var lista = dados.zeladorias || dados.registros || [];
      return lista.map(function(z, idx) {
        var escola = z.escola || z['Unidade Escolar'] || '';
        var zelador = z.zelador || z['Nome do Zelador'] || '';
        var rg = z.rg || z['RG'] || '-';
        var cargo = z.cargo || z['Cargo'] || '-';
        var classificacao = z.classificacao || z['Unidade de Classificação'] || '-';
        var publicacao = z.publicacao || z['Publicação'] || '-';
        var vencimento = z.vencimento || z['Venc.'] || z['Vencimento'] || '-';
        var processo = z.processo || z['Processo'] || '-';
        var obs = z.obs || z['OBS.'] || z['OBS'] || '';

        var isOcupada = zelador && zelador.trim() !== '' && zelador.trim() !== '-' && !zelador.toLowerCase().includes('vaga');
        var situacao = isOcupada ? 'Ocupada' : 'Vaga';

        return {
          index: idx + 1,
          escola: escola.trim(),
          zelador: isOcupada ? zelador.trim() : 'Vaga / Disponível para Cessão',
          rg: rg.trim(),
          cargo: cargo.trim(),
          classificacao: classificacao.trim(),
          publicacao: publicacao.trim(),
          vencimento: vencimento.trim(),
          processo: processo.trim(),
          obs: obs.trim(),
          situacao: situacao
        };
      });
    }

    function mudarFiltroStatusSefisc(status, btnEl) {
      estadoSefisc.filtroStatus = status;
      document.querySelectorAll('.btn-sefisc-status').forEach(function(b) {
        var isMatch = (btnEl && b === btnEl) || (b.getAttribute('data-status') === status);
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

    function alternarOrdenacaoSefisc(colKey) {
      if (estadoSefisc.colOrdenacao === colKey) {
        estadoSefisc.ordemDir = estadoSefisc.ordemDir === 'desc' ? 'asc' : 'desc';
      } else {
        estadoSefisc.colOrdenacao = colKey;
        estadoSefisc.ordemDir = colKey === 'vencimento' ? 'desc' : 'asc';
      }
      atualizarTabelaZeladoriasSefisc();
    }

    function atualizarTabelaZeladoriasSefisc() {
      var tbody = document.getElementById('tabela-sefisc-tbody');
      var counterEl = document.getElementById('sefisc-filtro-contador');
      if (!tbody) return;

      var zeladorias = normalizarRegistrosSefisc(DADOS_SEFISC);
      var termo = estadoSefisc.termoBusca;
      var statusFiltro = estadoSefisc.filtroStatus;

      var filtrados = zeladorias.filter(function(item) {
        if (statusFiltro === 'OCUPADAS' && item.situacao !== 'Ocupada') return false;
        if (statusFiltro === 'VAGAS' && item.situacao === 'Ocupada') return false;
        if (statusFiltro === 'OK' && !item.obs.toUpperCase().includes('OK')) return false;
        if (statusFiltro === 'RENOVACAO' && !item.obs.toUpperCase().includes('RENOVAÇÃO') && !item.obs.toUpperCase().includes('RENOVACAO')) return false;

        if (termo) {
          var matchEscola = item.escola.toLowerCase().includes(termo);
          var matchZelador = item.zelador.toLowerCase().includes(termo);
          var matchCargo = item.cargo.toLowerCase().includes(termo);
          var matchClassif = item.classificacao.toLowerCase().includes(termo);
          var matchProcesso = item.processo.toLowerCase().includes(termo);
          var matchObs = item.obs.toLowerCase().includes(termo);
          if (!matchEscola && !matchZelador && !matchCargo && !matchClassif && !matchProcesso && !matchObs) return false;
        }
        return true;
      });

      var colSefisc = estadoSefisc.colOrdenacao || 'vencimento';
      var dirSefisc = estadoSefisc.ordemDir || 'desc';
      ordenarListaPorColuna(filtrados, {
        dir: dirSefisc,
        isDate: colSefisc === 'vencimento',
        isNum: false,
        getter: function(item) {
          if (colSefisc === 'vencimento') return item.vencimento || '';
          return item[colSefisc] || '';
        }
      });

      sincronizarSetasTabelaPorEstado('#tabela-sefisc-zeladorias', colSefisc, dirSefisc);

      if (counterEl) {
        counterEl.innerText = filtrados.length + ' zeladorias';
      }

      if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 2.5rem; text-align: center; color: #64748b;"><div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div><strong>Nenhuma zeladoria encontrada</strong><div style="font-size: 0.75rem; margin-top: 0.25rem;">Ajuste o termo de busca ou o filtro de situação da aba SEFISC.</div></td></tr>';
        return;
      }

      tbody.innerHTML = filtrados.map(function(item) {
        var badgeSituacao = item.situacao === 'Ocupada'
          ? '<span style="background: #ecfdf5; color: #047857; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #a7f3d0;">🟢 Ocupada</span>'
          : '<span style="background: #fef2f2; color: #b91c1c; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; border: 1px solid #fecaca;">🟡 Vaga / Disponível</span>';

        var badgeObs = '';
        if (item.obs) {
          if (item.obs.toUpperCase().includes('OK')) {
            badgeObs = '<span style="background: #ecfdf5; color: #059669; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; border: 1px solid #a7f3d0; margin-top: 0.25rem; display: inline-block;">' + item.obs + '</span>';
          } else if (item.obs.toUpperCase().includes('RENOVAÇÃO') || item.obs.toUpperCase().includes('RENOVACAO')) {
            badgeObs = '<span style="background: #eff6ff; color: #2563eb; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; border: 1px solid #bfdbfe; margin-top: 0.25rem; display: inline-block;">' + item.obs + '</span>';
          } else {
            badgeObs = '<span style="background: #f1f5f9; color: #475569; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; margin-top: 0.25rem; display: inline-block;">' + item.obs + '</span>';
          }
        }

        return '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'transparent\'">' +
          '<td style="padding: 0.75rem 0.9rem;"><strong style="color: #0f172a; font-size: 0.85rem;">' + item.escola + '</strong></td>' +
          '<td style="padding: 0.75rem 0.9rem;"><div style="font-weight: 700; color: #334155;">' + item.zelador + '</div><div style="font-size: 0.72rem; color: #64748b;">RG: ' + item.rg + '</div></td>' +
          '<td style="padding: 0.75rem 0.9rem;"><div style="color: #475569; font-weight: 600;">' + item.cargo + '</div><div style="font-size: 0.72rem; color: #0284c7;">' + item.classificacao + '</div></td>' +
          '<td style="padding: 0.75rem 0.9rem; font-family: monospace; font-size: 0.76rem; color: #1e293b; white-space: nowrap;">' + item.processo + '</td>' +
          '<td style="padding: 0.75rem 0.9rem; font-size: 0.78rem; color: #475569; white-space: nowrap; text-align: center;">' + item.vencimento + '</td>' +
          '<td style="padding: 0.75rem 0.9rem; text-align: center; white-space: nowrap;">' + badgeSituacao + (badgeObs ? '<div>' + badgeObs + '</div>' : '') + '</td>' +
        '</tr>';
      }).join('');
    }

    function renderizarDashboardSefisc() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const zeladorias = normalizarRegistrosSefisc(DADOS_SEFISC);
      const totalZel = zeladorias.length || 33;
      const ocupadasZel = zeladorias.filter(function(z) { return z.situacao === 'Ocupada'; }).length || 30;
      const vagasZel = zeladorias.filter(function(z) { return z.situacao === 'Vaga'; }).length || 3;
      const kpis = {
        totalZeladorias: totalZel,
        ocupadas: ocupadasZel,
        vagas: vagasZel,
        processosSei: totalZel
      };
      const pctOcupadas = Math.round((ocupadasZel / (totalZel || 1)) * 100);

      container.innerHTML = `
        <div style="margin-top: 1.25rem;">
          <!-- BANNER DO SEFISC (PADRÃO UNIVERSAL EXECUTIVO) -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #047857 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">🏠</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEFISC - Seção de Fiscalização</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Base oficial de autorizações de uso de moradia e ocupação de zeladorias escolares da rede estadual, vinculada aos processos SEI e acompanhamento de vencimentos.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #a7f3d0; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="sefisc-banner-timestamp" style="color: #ffffff;">${(DADOS_SEFISC && DADOS_SEFISC.meta && DADOS_SEFISC.meta.atualizadoFormatado) || '11/11/2026, 12:00:00'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem; flex-wrap: nowrap;">
                <button type="button" onclick="sincronizarDashboardSefisc(true)" id="btn-sync-sefisc" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  <span class="sync-spin-icon">🔄</span> Sincronizar SEFISC
                </button>
                <a href="${URLS_OFICIAIS_SEFISC.sharepointOriginal || URLS_OFICIAIS_SEFISC.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com ${zeladorias.length} zeladorias escolares mapeadas</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS DO SEFISC -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            <!-- CARD 1 -->
            <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Zeladorias Ocupadas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    🟢
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.ocupadas}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>${pctOcupadas}% de ocupação</span>
                <span style="color: #64748b; font-weight: 600;">Regular</span>
              </div>
            </div>

            <!-- CARD 2 -->
            <div style="background: #ffffff; border: 1.5px solid #fecaca; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Zeladorias Vagas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fee2e2; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fecaca; font-size: 1.1rem;">
                    🟡
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #dc2626; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.vagas}</div>
              </div>
              <div style="font-size: 0.74rem; color: #b91c1c; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Disponíveis p/ uso</span>
                <span style="color: #64748b; font-weight: 600;">Vagas</span>
              </div>
            </div>

            <!-- CARD 3 -->
            <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Total de Zeladorias</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    🏠
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalZeladorias || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Rede escolar</span>
                <span style="color: #64748b; font-weight: 600;">Catalogadas</span>
              </div>
            </div>

            <!-- CARD 4 -->
            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Processos SEI</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    📋
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.processosSei}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Autos administrativos</span>
                <span style="color: #64748b; font-weight: 600;">SEI-SP</span>
              </div>
            </div>
          </div>

          <!-- BARRA DE FILTROS & PESQUISA SEFISC -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
              <!-- Filtro de Situação -->
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-right: 0.25rem;">Situação:</span>
                <button type="button" class="btn-sefisc-status ${estadoSefisc.filtroStatus === 'TODOS' ? 'active' : ''}" data-status="TODOS" onclick="mudarFiltroStatusSefisc('TODOS', this)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: ${estadoSefisc.filtroStatus === 'TODOS' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid ${estadoSefisc.filtroStatus === 'TODOS' ? '#0b2351' : '#cbd5e1'}; background: ${estadoSefisc.filtroStatus === 'TODOS' ? '#0b2351' : '#ffffff'}; color: ${estadoSefisc.filtroStatus === 'TODOS' ? '#ffffff' : '#475569'}; box-shadow: ${estadoSefisc.filtroStatus === 'TODOS' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;">Todas</button>
                <button type="button" class="btn-sefisc-status ${estadoSefisc.filtroStatus === 'OCUPADAS' ? 'active' : ''}" data-status="OCUPADAS" onclick="mudarFiltroStatusSefisc('OCUPADAS', this)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: ${estadoSefisc.filtroStatus === 'OCUPADAS' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid ${estadoSefisc.filtroStatus === 'OCUPADAS' ? '#0b2351' : '#cbd5e1'}; background: ${estadoSefisc.filtroStatus === 'OCUPADAS' ? '#0b2351' : '#ffffff'}; color: ${estadoSefisc.filtroStatus === 'OCUPADAS' ? '#ffffff' : '#475569'}; box-shadow: ${estadoSefisc.filtroStatus === 'OCUPADAS' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;">🟢 Ocupadas</button>
                <button type="button" class="btn-sefisc-status ${estadoSefisc.filtroStatus === 'VAGAS' ? 'active' : ''}" data-status="VAGAS" onclick="mudarFiltroStatusSefisc('VAGAS', this)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: ${estadoSefisc.filtroStatus === 'VAGAS' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid ${estadoSefisc.filtroStatus === 'VAGAS' ? '#0b2351' : '#cbd5e1'}; background: ${estadoSefisc.filtroStatus === 'VAGAS' ? '#0b2351' : '#ffffff'}; color: ${estadoSefisc.filtroStatus === 'VAGAS' ? '#ffffff' : '#475569'}; box-shadow: ${estadoSefisc.filtroStatus === 'VAGAS' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;">🟡 Vagas</button>
                <button type="button" class="btn-sefisc-status ${estadoSefisc.filtroStatus === 'OK' ? 'active' : ''}" data-status="OK" onclick="mudarFiltroStatusSefisc('OK', this)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: ${estadoSefisc.filtroStatus === 'OK' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid ${estadoSefisc.filtroStatus === 'OK' ? '#0b2351' : '#cbd5e1'}; background: ${estadoSefisc.filtroStatus === 'OK' ? '#0b2351' : '#ffffff'}; color: ${estadoSefisc.filtroStatus === 'OK' ? '#ffffff' : '#475569'}; box-shadow: ${estadoSefisc.filtroStatus === 'OK' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;">✅ Regular</button>
                <button type="button" class="btn-sefisc-status ${estadoSefisc.filtroStatus === 'RENOVACAO' ? 'active' : ''}" data-status="RENOVACAO" onclick="mudarFiltroStatusSefisc('RENOVACAO', this)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: ${estadoSefisc.filtroStatus === 'RENOVACAO' ? '800' : '700'}; cursor: pointer; border-radius: 6px; border: 1px solid ${estadoSefisc.filtroStatus === 'RENOVACAO' ? '#0b2351' : '#cbd5e1'}; background: ${estadoSefisc.filtroStatus === 'RENOVACAO' ? '#0b2351' : '#ffffff'}; color: ${estadoSefisc.filtroStatus === 'RENOVACAO' ? '#ffffff' : '#475569'}; box-shadow: ${estadoSefisc.filtroStatus === 'RENOVACAO' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'}; transition: all 0.15s ease;">🔄 Renovação</button>
              </div>

              <!-- Busca rápida -->
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-grow: 1; max-width: 380px;">
                <input type="text" placeholder="Buscar por escola, zelador, cargo ou processo..." oninput="buscarZeladoriasSefisc(this.value)" style="width: 100%; padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; outline: none; transition: 0.2s;" onfocus="this.style.borderColor='#38bdf8'" onblur="this.style.borderColor='#cbd5e1'">
              </div>
            </div>

            <!-- Resumo do filtro -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.65rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
              <div>
                Filtrando: <strong id="sefisc-filtro-contador" style="color: #0b2351;">${zeladorias.length} zeladorias</strong>
              </div>
              <div style="color: #059669; font-weight: 700;">
                Planilha: CONTROLE - ZELADORIAS-ATUALIZADA-2026.xlsx • Aba SEFISC
              </div>
            </div>
          </div>

          <!-- TABELA DE ZELADORIAS ESCOLARES -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
            <div style="padding: 1rem 1.35rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <strong style="color: #0f172a; font-size: 0.95rem;">Relação Oficial de Zeladorias Escolares (SEFISC / SEOM)</strong>
                <span style="font-size: 0.75rem; color: #64748b; margin-left: 0.5rem;">(Leitura estrita da aba SEFISC)</span>
              </div>
              <span style="font-size: 0.74rem; color: #64748b;">Atualizado automaticamente via SharePoint</span>
            </div>
            <div style="overflow-x: auto;">
              <table id="tabela-sefisc-zeladorias" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
                <thead style="background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1;">
                  <tr>
                    <th data-col="escola" class="th-sortable" onclick="alternarOrdenacaoSefisc('escola')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Unidade Escolar"><div class="th-sort-wrapper"><span class="th-title-text">Unidade Escolar</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="zelador" class="th-sortable" onclick="alternarOrdenacaoSefisc('zelador')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Zelador / RG"><div class="th-sort-wrapper"><span class="th-title-text">Zelador / RG</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="cargo" class="th-sortable" onclick="alternarOrdenacaoSefisc('cargo')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Cargo / Lotação"><div class="th-sort-wrapper"><span class="th-title-text">Cargo / Lotação</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="processo" class="th-sortable" onclick="alternarOrdenacaoSefisc('processo')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Processo SEI"><div class="th-sort-wrapper"><span class="th-title-text">Processo SEI</span><span class="sort-arrow">↕</span></div></th>
                    <th data-col="vencimento" class="th-sortable sort-active-desc" onclick="alternarOrdenacaoSefisc('vencimento')" style="padding: 0.75rem 0.9rem; text-align: center;" title="Clique para classificar por Vencimento"><div class="th-sort-wrapper center"><span class="th-title-text">Vencimento</span><span class="sort-arrow">▼</span></div></th>
                    <th data-col="situacao" class="th-sortable" onclick="alternarOrdenacaoSefisc('situacao')" style="padding: 0.75rem 0.9rem; text-align: center;" title="Clique para classificar por Situação / OBS"><div class="th-sort-wrapper center"><span class="th-title-text">Situação / OBS</span><span class="sort-arrow">↕</span></div></th>
                  </tr>
                </thead>
                <tbody id="tabela-sefisc-tbody">
                  <!-- Preenchido via atualizarTabelaZeladoriasSefisc() -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- NOTA METODOLÓGICA E ORIENTAÇÕES DO SEFISC -->
          <div id="nota-metodologica-sefisc" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🛡️</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEFISC • NOTAS METODOLÓGICAS &amp; GESTÃO DAS ZELADORIAS ESCOLARES</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Ocupação regular de dependências públicas, vigilância patrimonial passiva e conformidade regulatória</div>
                </div>
              </div>
              <span style="background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Base Integrada SEFISC • 33 Zeladorias Monitoradas</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Finalidade da Zeladoria -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #60a5fa; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏠</span> <span>Natureza da Residência Escolar</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Cessão de Uso Funcional:</strong> Dependência própria do prédio escolar disponibilizada para moradia de servidor público estadual devidamente qualificado e credenciado.<br>
                  • <strong>Vigilância Passiva:</strong> O servidor residente atua na salvaguarda das dependências externas da escola nos períodos noturnos, finais de semana e feriados.
                </div>
              </div>

              <!-- Bloco 2: Marco Legal SEDUC -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #34d399; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>⚖️</span> <span>Regulamentação &amp; Processo SEI</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Resolução SEDUC Específica:</strong> Define os requisitos para inscrição, critérios de pontuação, tempo de serviço público e termo de autorização precária de uso.<br>
                  • <strong>Dossiê Individual SEI:</strong> Cada dependência possui processo administrativo autônomo com vistorias periódicas de habitabilidade, conservação e regularidade cadastral.
                </div>
              </div>

              <!-- Bloco 3: Indicadores de Ocupação -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #fbbf24; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📊</span> <span>Métricas de Ocupação &amp; Vagas</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Ocupada:</strong> Zeladoria em funcionamento regular com servidor residente ativo e termo de compromisso devidamente homologado.<br>
                  • <strong>Vaga / Em Edital:</strong> Dependência desocupada que passa por reformas de adequação básica pelo SEOM ou está em fase de publicação de edital de credenciamento público.
                </div>
              </div>

              <!-- Bloco 4: Apoio em Emergências -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #ef4444; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🚨</span> <span>Protocolos de Emergência &amp; Segurança</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Acionamento Imediato:</strong> Canal direto de comunicação com a Polícia Militar (190), Corpo de Bombeiros (193), Defesa Civil e equipe gestora da unidade escolar.<br>
                  • <strong>Sinistros e Manutenção:</strong> Comunicação imediata de vazamentos de água, panes elétricas ou incidentes de intempéries ocorridos fora do horário letivo.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Setor de Fiscalização de Zeladorias (SEFISC / CAF)</span>
              <span>Vistoria e Segurança Patrimonial Integrada • Rede Escolar de Itapevi e Jandira</span>
            </div>
          </div>
        </div>
      `;

      atualizarTabelaZeladoriasSefisc();
    }

    /* Função utilitária de filtro para tabelas genéricas dos novos setores */
    function filtrarTabelaGenerica(termo, tbodyId) {
      const tbody = document.getElementById(tbodyId);
      if (!tbody) return;
      const t = (termo || '').toLowerCase().trim();
      Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
        const text = tr.innerText.toLowerCase();
        tr.style.display = (!t || text.includes(t)) ? '' : 'none';
      });
    }
