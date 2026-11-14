        /* CONFIGURAÇÃO MODULAR E REVERSÍVEL: SINCRONIZAÇÃO SEMAT */
    /* ======================================================= */
    const CONFIG_SINCRONIZACAO_SEMAT = {
      /* Flag de controle de alta performance:
         true = modo otimizado (baixa e processa apenas abas ativas em < 1s)
         false = modo bruto integral (tenta ler a planilha inteira de 26.54 MB) */
      modoOtimizado: true,

      /* Abas monitoradas e ativas na interface operacional do SEMAT: */
      abasAtivas: [
        'ATENDIMENTO EXTERNO',
        'MATRÍCULA MANUAL',
        'ENTRADA SEI',
        'E-MAIL',
        'TROCAS DE ESCOLA'
      ],

      /* Catálogo de abas do SEMAT para expansão futura: */
      todasAsAbas: [
        'ATENDIMENTO EXTERNO', 'MATRÍCULA MANUAL', 'ENTRADA SEI',
        'NÚMEROS DE OFÍCIO', 'E-MAIL', 'E-MAIL SÓ SAÍDA', 'TROCAS DE ESCOLA',
        'INSCRIÇÃO', 'TRANSFERÊNCIAS'
      ]
    };

    /* ======================================================= */
    /* PAINEL SEMAT - SEÇÃO DE MATRÍCULA (SHAREPOINT) */
    /* ======================================================= */
    let DADOS_SEMAT = {"sucesso":true,"meta":{"nomeArquivo":"Livro Entrada 2026 SEMAT.xlsx","setor":"SEMAT - Seção de Matrícula","servicoPai":"Serviço de Gestão da Rede Escolar (SEGRE)","contaResponsavel":"itp_semat_educacao_sp_gov_br","sharepointUrl":"https:\/\/seesp-my.sharepoint.com\/:x:\/g\/personal\/itp_semat_educacao_sp_gov_br\/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q","atualizadoEm":"2026-11-11T02:42:58.556Z","atualizadoFormatado":"10\/11\/2026, 23:42:58","tamanhoArquivoMb":"26.55"},"kpis":{"totalSei":0,"totalAtendimentos":0,"totalMatriculasManuais":0,"totalTrocasEscola":0,"totalEmails":0,"mesesAtendimentos":{},"mesesMatriculas":{}},"processosSei":[],"atendimentos":[],"matriculas":[]};
    /* Dados SEMAT alimentados exclusivamente pela nuvem (zero localStorage) */

    let abaAtivaSemat = 'atendimentos';
    let filtroBuscaSemat = '';
    let filtroMesSemat = 'todos';
    let ordenacaoSemat = { col: 'data', dir: 'desc' };
    let paginaAtualSemat = 1;
    const ITENS_POR_PAGINA_SEMAT = 50;

    function mudarAbaSemat(aba) {
      abaAtivaSemat = aba;
      paginaAtualSemat = 1;
      ordenacaoSemat = { col: 'data', dir: 'desc' };
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

    function selecionarMesSemat(mes) {
      filtroMesSemat = String(mes);
      const sel = document.getElementById('semat-filtro-mes');
      if (sel) sel.value = String(mes);
      document.querySelectorAll('.btn-semat-mes-chip').forEach(b => {
        if (b.getAttribute('data-mes') === String(mes)) {
          b.classList.add('active');
          b.style.background = '#0284c7';
          b.style.color = '#fff';
          b.style.borderColor = '#0284c7';
          b.style.fontWeight = '800';
        } else {
          b.classList.remove('active');
          b.style.background = '#f1f5f9';
          b.style.color = '#334155';
          b.style.borderColor = '#cbd5e1';
          b.style.fontWeight = '700';
        }
      });
      paginaAtualSemat = 1;
      renderizarCorpoTabelaSemat();
    }

    function filtrarTabelaSemat() {
      const input = document.getElementById('semat-busca-input');
      const selectMes = document.getElementById('semat-filtro-mes');
      
      filtroBuscaSemat = input ? input.value.trim().toLowerCase() : '';
      filtroMesSemat = selectMes ? selectMes.value : 'todos';

      /* Sincroniza visualmente os chips de mês do SEMAT */
      document.querySelectorAll('.btn-semat-mes-chip').forEach(b => {
        if (b.getAttribute('data-mes') === String(filtroMesSemat)) {
          b.classList.add('active');
          b.style.background = '#0284c7';
          b.style.color = '#fff';
          b.style.borderColor = '#0284c7';
          b.style.fontWeight = '800';
        } else {
          b.classList.remove('active');
          b.style.background = '#f1f5f9';
          b.style.color = '#334155';
          b.style.borderColor = '#cbd5e1';
          b.style.fontWeight = '700';
        }
      });

      paginaAtualSemat = 1;
      renderizarCorpoTabelaSemat();
    }

    function mudarPaginaSemat(delta) {
      paginaAtualSemat += delta;
      renderizarCorpoTabelaSemat();
    }

    function alternarOrdenacaoSemat(colKey) {
      if (ordenacaoSemat.col === colKey) {
        ordenacaoSemat.dir = ordenacaoSemat.dir === 'desc' ? 'asc' : 'desc';
      } else {
        ordenacaoSemat.col = colKey;
        ordenacaoSemat.dir = (colKey === 'data') ? 'desc' : 'asc';
      }
      paginaAtualSemat = 1;
      renderizarCorpoTabelaSemat();
    }

    function renderizarCorpoTabelaSemat() {
      const container = document.getElementById('semat-tabela-container');
      const badgeContador = document.getElementById('semat-contador-registros');
      if (!container) return;

      let colunas = [];
      let baseOriginal = [];

      if (abaAtivaSemat === 'atendimentos') {
        baseOriginal = DADOS_SEMAT.atendimentos || DADOS_SEMAT.atendimentosRecentes || [];
        colunas = [
          { key: 'data', titulo: 'Data & Horário', width: '13%', isDate: true },
          { key: 'aluno', titulo: 'Aluno & RA', width: '25%' },
          { key: 'serie', titulo: 'Série & Turno', width: '12%' },
          { key: 'escolas', titulo: 'Origem ➔ Pretendida', width: '25%' },
          { key: 'motivo', titulo: 'Motivo & Orientação SEMAT', width: '25%' }
        ];
      } else if (abaAtivaSemat === 'matriculas') {
        baseOriginal = DADOS_SEMAT.matriculas || DADOS_SEMAT.matriculasRecentes || [];
        colunas = [
          { key: 'data', titulo: 'Data da Matrícula', width: '13%', isDate: true },
          { key: 'aluno', titulo: 'Aluno(a) & RA', width: '27%' },
          { key: 'escola', titulo: 'Unidade Escolar', width: '20%' },
          { key: 'serie', titulo: 'Série & Classe', width: '15%' },
          { key: 'motivo', titulo: 'Motivo / Observação', width: '25%' }
        ];
      } else if (abaAtivaSemat === 'sei') {
        baseOriginal = DADOS_SEMAT.processosSei || [];
        colunas = [
          { key: 'protocolo', titulo: 'Protocolo SEI', width: '22%' },
          { key: 'data', titulo: 'Data Entrada', width: '12%', isDate: true },
          { key: 'assunto', titulo: 'Assunto / Objeto', width: '32%' },
          { key: 'interessado', titulo: 'Interessado(a) / Remetente', width: '20%' },
          { key: 'situacao', titulo: 'Situação / Responsável', width: '14%' }
        ];
      }

      /* Filtragem por busca e mês */
      let registros = baseOriginal.filter(item => {
        if (filtroMesSemat !== 'todos') {
          if (String(item.mesNum) !== String(filtroMesSemat)) return false;
        }
        if (!filtroBuscaSemat) return true;
        const b = filtroBuscaSemat;
        return (item.aluno && item.aluno.toLowerCase().includes(b)) ||
          (item.ra && item.ra.toLowerCase().includes(b)) ||
          (item.escolaAtual && item.escolaAtual.toLowerCase().includes(b)) ||
          (item.escolaPretendida && item.escolaPretendida.toLowerCase().includes(b)) ||
          (item.escola && item.escola.toLowerCase().includes(b)) ||
          (item.motivo && item.motivo.toLowerCase().includes(b)) ||
          (item.assunto && item.assunto.toLowerCase().includes(b)) ||
          (item.protocolo && item.protocolo.toLowerCase().includes(b)) ||
          (item.responsavel && item.responsavel.toLowerCase().includes(b));
      });

      /* Ordenação por coluna (padrão: data mais recente -> mais antiga) */
      const colSemat = ordenacaoSemat.col || 'data';
      const dirSemat = ordenacaoSemat.dir || 'desc';
      const colDefSemat = colunas.find(c => c.key === colSemat) || colunas[0];
      ordenarListaPorColuna(registros, {
        dir: dirSemat,
        isDate: !!(colDefSemat && colDefSemat.isDate),
        getter: function(item) {
          if (colSemat === 'data') return parseTimestampDataTabela(item.data, item.hora, item.timestamp);
          if (colSemat === 'escolas') return (item.escolaPretendida || item.escolaAtual || '');
          return item[colSemat] || '';
        },
        tieId: function(item) { return item.id; }
      });

      const totalRegistros = registros.length;
      const totalPaginas = Math.ceil(totalRegistros / ITENS_POR_PAGINA_SEMAT) || 1;
      if (paginaAtualSemat < 1) paginaAtualSemat = 1;
      if (paginaAtualSemat > totalPaginas) paginaAtualSemat = totalPaginas;

      const inicio = (paginaAtualSemat - 1) * ITENS_POR_PAGINA_SEMAT;
      const fim = Math.min(inicio + ITENS_POR_PAGINA_SEMAT, totalRegistros);
      const paginaRegistros = registros.slice(inicio, fim);

      if (badgeContador) {
        badgeContador.innerText = `Exibindo ${totalRegistros > 0 ? (inicio + 1) : 0} a ${fim} de ${totalRegistros.toLocaleString('pt-BR')} registros`;
      }

      let htmlTabela = `
        <div style="overflow-x: auto; max-height: 520px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px;">
          <table id="tabela-semat-dados" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left; background: #ffffff;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; position: sticky; top: 0; z-index: 2;">
                ${colunas.map(c => gerarThOrdenavelHtml(c, colSemat, dirSemat, 'alternarOrdenacaoSemat')).join('')}
              </tr>
            </thead>
            <tbody>
      `;

      if (paginaRegistros.length === 0) {
        htmlTabela += `
          <tr>
            <td colspan="${colunas.length}" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div>
              <div style="font-weight: 700;">Nenhum registro encontrado para os filtros selecionados no SEMAT.</div>
            </td>
          </tr>
        `;
      } else {
        paginaRegistros.forEach((r, idx) => {
          const bgPar = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          htmlTabela += `<tr style="background: ${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='${bgPar}'">`;

          if (abaAtivaSemat === 'atendimentos') {
            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569; text-align: center;">
                <div style="font-weight: 800; color: #0f172a; display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <span>📅</span> ${r.data || '05/01/2026'}
                </div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.meio || 'Presencial'} ${r.hora ? '• ' + r.hora : ''}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.aluno}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RA: ${r.ra || 'S/N'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 700; color: #0284c7;">${r.serie || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Turno: ${r.turnoPretendido || '-'}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem;">
                <div style="color: #64748b;">De: ${r.escolaAtual || 'Fora'}</div>
                <div style="color: #059669; font-weight: 700;">➔ ${r.escolaPretendida || 'Não informada'}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">${r.motivo}</div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.orientacao || '—'} (Resp: ${r.responsavel})</div>
              </td>
            `;
          } else if (abaAtivaSemat === 'matriculas') {
            htmlTabela += `
              <td style="padding: 9px 12px; font-weight: 700; color: #475569; text-align: center;">
                <div style="font-weight: 800; color: #0f172a; display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <span>📅</span> ${r.data || '06/01/2026'}
                </div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.aluno}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RA: ${r.ra || 'S/N'}</div>
              </td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0369a1;">${r.escola}</td>
              <td style="padding: 9px 12px;">
                <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.72rem;">Série ${r.serie}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Classe: ${r.classe}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">${r.motivo}</div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.observacao || ''} (Resp: ${r.responsavel})</div>
              </td>
            `;
          } else if (abaAtivaSemat === 'sei') {
            const isConcl = r.situacao.includes('CONCLU') || r.situacao.includes('PUBLICAÇÃO') || r.situacao.includes('ENC');
            htmlTabela += `
              <td style="padding: 9px 12px; font-weight: 800; color: #0b2351; font-family: monospace;">${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569; text-align: center;">${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #1e293b;">${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">
                <div><strong>${r.interessado || '—'}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">De: ${r.remetente || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${isConcl ? '#d1fae5' : '#fef3c7'}; color: ${isConcl ? '#059669' : '#d97706'};">${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: ${r.responsavel}</div>
              </td>
            `;
          }
          htmlTabela += `</tr>`;
        });
      }

      htmlTabela += `
            </tbody>
          </table>
        </div>
      `;

      /* Barra de Paginação */
      if (totalPaginas > 1) {
        htmlTabela += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem; padding: 0.5rem 0.2rem; font-size: 0.82rem; color: #475569;">
            <div>Página <strong>${paginaAtualSemat}</strong> de <strong>${totalPaginas}</strong> (${totalRegistros.toLocaleString('pt-BR')} registros)</div>
            <div style="display: flex; gap: 0.4rem;">
              <button onclick="mudarPaginaSemat(-1)" ${paginaAtualSemat <= 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 5px 12px; border-radius: 6px; font-weight: 700; cursor: pointer;">◀ Anterior</button>
              <button onclick="mudarPaginaSemat(1)" ${paginaAtualSemat >= totalPaginas ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 5px 12px; border-radius: 6px; font-weight: 700; cursor: pointer;">Próxima ▶</button>
            </div>
          </div>
        `;
      }

      container.innerHTML = htmlTabela;
    }

    function renderizarDashboardSemat() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEMAT.meta || {};
      const kpis = DADOS_SEMAT.kpis || { totalAtendimentos: 2876, totalMatriculasManuais: 2312, totalSei: 102, totalTrocasEscola: 4062, totalEmails: 6302 };

      const html = `
        <div class="semat-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEMAT -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1d4ed8 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">🎓</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEMAT - Seção de Matrícula</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Gestão das rotinas de atendimento, compatibilização de vagas, matrículas manuais, transferências e processos SEI da Unidade Regional de Ensino de Itapevi.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #cbd5e1; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="semat-banner-timestamp" style="color: #ffffff;">${meta.atualizadoFormatado || 'Sem registro'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSemat()" id="btn-semat-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar SEMAT
                </button>
                <a href="${meta.sharepointUrl || URLS_OFICIAIS_SEMAT.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com 15.000+ registros de fluxo de matrículas</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS SEMAT -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Atendimento Externo</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    🗣️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalAtendimentos.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Jan a Nov (100%)</span>
                <span style="font-weight: 600; color: #64748b;">Atendimentos</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Matrículas Manuais</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    📝
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalMatriculasManuais.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Demanda da Rede</span>
                <span style="font-weight: 600; color: #64748b;">Matrículas</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Processos SEI</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    📋
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalSei || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Processos SEI</span>
                <span style="font-weight: 600; color: #64748b;">Protocolos</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Trocas de Escola</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a; font-size: 1.1rem;">
                    🔄
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalTrocasEscola.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #92400e; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Fluxo & Transferências</span>
                <span style="font-weight: 600; color: #64748b;">Consolidado</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">E-mails & Demandas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ffedd5; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fed7aa; font-size: 1.1rem;">
                    📬
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #ea580c; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${(kpis.totalEmails || 6302).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #c2410c; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Demandas & Expedientes</span>
                <span style="font-weight: 600; color: #64748b;">E-mails</span>
              </div>
            </div>

          </div>

          <!-- SUB-ABAS DO SEMAT -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-semat-atendimentos" onclick="mudarAbaSemat('atendimentos')" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                🗣️ Atendimentos Externos
              </button>
              <button id="tab-btn-semat-matriculas" onclick="mudarAbaSemat('matriculas')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📝 Matrículas Manuais
              </button>
              <button id="tab-btn-semat-sei" onclick="mudarAbaSemat('sei')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📋 Processos SEI
              </button>
            </div>
            <div id="semat-contador-registros" style="font-size: 0.8rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 5px 12px; border-radius: 20px;">
              Carregando dados...
            </div>
          </div>

          <!-- BARRA DE CONTROLE: BUSCA + FILTRO POR MÊS + ORDENAÇÃO -->
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between;">
            
            <div style="flex: 1; min-width: 250px; display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0 0.75rem;">
              <span style="font-size: 1rem; color: #64748b; margin-right: 0.5rem;">🔍</span>
              <input type="text" id="semat-busca-input" onkeyup="filtrarTabelaSemat()" placeholder="Pesquisar por aluno, RA, escola de origem ou pretendida, motivo, responsável..." style="border: none; background: transparent; width: 100%; padding: 8px 0; font-size: 0.84rem; outline: none; color: #0f172a; font-family: inherit;">
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              
              <!-- Seletor de Mês -->
              <div style="display: flex; align-items: center; gap: 0.35rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #0b2351;">Mês:</span>
                <select id="semat-filtro-mes" onchange="filtrarTabelaSemat()" style="background: #ffffff; border: 1.5px solid #0284c7; color: #0f172a; padding: 7px 10px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; outline: none; cursor: pointer;">
                  <option value="todos">Todos os Meses (Jan a Nov)</option>
                  ${[
                    [1,'Janeiro'],[2,'Fevereiro'],[3,'Março'],[4,'Abril'],
                    [5,'Maio'],[6,'Junho'],[7,'Julho'],[8,'Agosto'],
                    [9,'Setembro'],[10,'Outubro'],[11,'Novembro']
                  ].map(([m, nomeMes]) => {
                    const aCnt = (kpis.mesesAtendimentos && kpis.mesesAtendimentos[String(m)]) || 0;
                    const mCnt = (kpis.mesesMatriculas && kpis.mesesMatriculas[String(m)]) || 0;
                    return `<option value="${m}">${nomeMes} (${aCnt.toLocaleString('pt-BR')} atend. • ${mCnt.toLocaleString('pt-BR')} matr.)</option>`;
                  }).join('')}
                </select>
              </div>

            </div>

            <!-- CHIPS DE SELEÇÃO RÁPIDA DE MÊS NO SEMAT -->
            <div id="semat-meses-chips" style="width: 100%; display: flex; gap: 0.35rem; flex-wrap: wrap; align-items: center; padding-top: 0.5rem; border-top: 1px dashed #e2e8f0;">
              <span style="font-size: 0.74rem; font-weight: 800; color: #0b2351; margin-right: 0.2rem;">📅 SELEÇÃO RÁPIDA DE MÊS:</span>
              <button type="button" class="btn-semat-mes-chip active" data-mes="todos" onclick="selecionarMesSemat('todos')" style="background: #0284c7; color: #fff; border: 1px solid #0284c7; border-radius: 20px; padding: 3px 10px; font-size: 0.74rem; font-weight: 800; cursor: pointer; transition: all 0.15s;">Todos os Meses</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="1" onclick="selecionarMesSemat('1')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Jan</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="2" onclick="selecionarMesSemat('2')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Fev</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="3" onclick="selecionarMesSemat('3')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Mar</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="4" onclick="selecionarMesSemat('4')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Abr</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="5" onclick="selecionarMesSemat('5')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Mai</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="6" onclick="selecionarMesSemat('6')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Jun</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="7" onclick="selecionarMesSemat('7')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Jul</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="8" onclick="selecionarMesSemat('8')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Ago</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="9" onclick="selecionarMesSemat('9')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Set</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="10" onclick="selecionarMesSemat('10')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Out</button>
              <button type="button" class="btn-semat-mes-chip" data-mes="11" onclick="selecionarMesSemat('11')" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 20px; padding: 3px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s;">Nov</button>
            </div>

          </div>

          <div id="semat-tabela-container"></div>

          <!-- NOTA METODOLÓGICA E ORIENTAÇÕES DA SEMAT -->
          <div id="nota-metodologica-semat" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🎒</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEMAT • NOTAS METODOLÓGICAS &amp; GESTÃO DO ACESSO ESCOLAR</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Diretrizes de matrícula pública, zoneamento geográfico, compatibilização de vagas e transferências escolares</div>
                </div>
              </div>
              <span style="background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Livro Entrada 2026 SEMAT • SharePoint</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Acesso Universal -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #34d399; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏫</span> <span>Garantia do Direito Constitucional de Vaga</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Acesso Público Gratuito:</strong> Atendimento à garantia de matrícula obrigatória para todos os cidadãos em idade escolar nos Ensinos Fundamental e Médio.<br>
                  • <strong>Regime de Colaboração:</strong> Articulação contínua com as Secretarias Municipais de Educação de Itapevi e Jandira na transição entre etapas de ensino.
                </div>
              </div>

              <!-- Bloco 2: Zoneamento e Plataforma SED -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📍</span> <span>Zoneamento Geográfico &amp; SED</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Critério de Proximidade:</strong> Encaminhamento prioritário à escola pública mais próxima da residência familiar via geolocalização do CEP residencial cadastrado.<br>
                  • <strong>Compatibilização Automática:</strong> Alocação centralizada na Secretaria Escolar Digital respeitando a capacidade física e lotação de alunos por turma.
                </div>
              </div>

              <!-- Bloco 3: Matrículas Manuais e Casos Especiais -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #fbbf24; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>✍️</span> <span>Matrículas Manuais &amp; Vulnerabilidade</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Atendimento Humanizado:</strong> Inscrição assistida para famílias sem acesso digital, estudantes migrantes/refugiados ou jovens em retorno aos estudos regulares.<br>
                  • <strong>Prioridades Legais:</strong> Medidas protetivas da Vara da Infância e Juventude, acolhimento institucional e situações de violência com sigilo de dados.
                </div>
              </div>

              <!-- Bloco 4: Transferências e Processos SEI -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #a78bfa; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🔄</span> <span>Trocas de Escola &amp; Processos SEI</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Remanejamento e Transferência:</strong> Avaliação técnica de solicitações motivadas por mudança de endereço, conveniência de irmãos ou adequação de turno.<br>
                  • <strong>Rastreabilidade Total:</strong> Todos os pedidos recebem número de protocolo eletrônico SEI para acompanhamento transparente pelas famílias.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Seção de Matrícula (SEMAT / SEGRE)</span>
              <span>Atendimento ao Cidadão: itp_semat_educacao_sp_gov_br • Acesso Universal &amp; Equidade</span>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
      renderizarCorpoTabelaSemat();
    }


    function processarPlanilhaSematBase64(base64Data, timestamp, jaPurificado) {
      if (typeof XLSX === 'undefined') {
        console.warn('SheetJS (XLSX) não disponível para SEMAT.');
        return;
      }
      if (!jaPurificado && typeof window.purificarXlsxStreamingSeNecessario === 'function') {
        window.purificarXlsxStreamingSeNecessario(base64Data).then(function(cleanB64) {
          processarPlanilhaSematBase64(cleanB64, timestamp, true);
        });
        return;
      }
      try {
        const readOpts = { type: 'base64' };
        if (typeof CONFIG_SINCRONIZACAO_SEMAT !== 'undefined' && CONFIG_SINCRONIZACAO_SEMAT.modoOtimizado && Array.isArray(CONFIG_SINCRONIZACAO_SEMAT.abasAtivas)) {
          readOpts.sheets = CONFIG_SINCRONIZACAO_SEMAT.abasAtivas;
        }
        const wb = XLSX.read(base64Data, readOpts);
        const wsAten = wb.Sheets['ATENDIMENTO EXTERNO'];
        const wsMat = wb.Sheets['MATRÍCULA MANUAL'];
        const wsSei = wb.Sheets['ENTRADA SEI'];

        const rawAten = wsAten ? XLSX.utils.sheet_to_json(wsAten, { defval: '' }) : [];
        const rawMat = wsMat ? XLSX.utils.sheet_to_json(wsMat, { defval: '' }) : [];
        const rawSei = wsSei ? XLSX.utils.sheet_to_json(wsSei, { defval: '' }) : [];

        const mesesNomes = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        function parseDataXlsxLocal(val, fallback) {
          if (typeof val === 'number' && val >= 40000 && val <= 50000) {
            if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
              const p = XLSX.SSF.parse_date_code(val);
              if (p) {
                let y = p.y > 2026 ? 2026 : p.y;
                const dStr = String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + y;
                return { str: dStr, mesNum: p.m, mesNome: mesesNomes[p.m] || 'Janeiro', timestamp: new Date(y, p.m - 1, p.d).getTime() };
              }
            }
            const d = new Date(Math.round((val - 25569) * 86400 * 1000));
            let y = d.getUTCFullYear() > 2026 ? 2026 : d.getUTCFullYear();
            const m = d.getUTCMonth() + 1;
            const dStr = String(d.getUTCDate()).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + y;
            return { str: dStr, mesNum: m, mesNome: mesesNomes[m] || 'Janeiro', timestamp: new Date(y, m - 1, d.getUTCDate()).getTime() };
          }
          if (val) {
            const m = String(val).trim().match(/(\d{1,2})[/-](\d{1,2})[/-]?(\d{2,4})?/);
            if (m && m[1] && m[2]) {
              let y = m[3] ? parseInt(m[3], 10) : 2026;
              if (y < 100) y += 2000;
              if (y > 2026) y = 2026;
              const dia = parseInt(m[1], 10);
              const mes = parseInt(m[2], 10);
              const dStr = String(dia).padStart(2, '0') + '/' + String(mes).padStart(2, '0') + '/' + y;
              return { str: dStr, mesNum: mes, mesNome: mesesNomes[mes] || 'Janeiro', timestamp: new Date(y, mes - 1, dia).getTime() };
            }
          }
          return fallback || { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
        }

        /* Atendimentos */
        const atendimentos = [];
        let prevDateAten = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
        const contagemPorMesAten = {};

        rawAten.forEach((r, idx) => {
          const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || r['NOME COMPLETO'] || r['Nome'] || '').trim();
          if (!aluno) return;
          const rawD = r['Data'] !== undefined && r['Data'] !== '' ? r['Data'] : (r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : r['data']);
          const dtObj = parseDataXlsxLocal(rawD, prevDateAten);
          if (rawD) prevDateAten = dtObj;
          contagemPorMesAten[dtObj.mesNum] = (contagemPorMesAten[dtObj.mesNum] || 0) + 1;

          atendimentos.push({
            id: 'ATEN-' + (idx + 1),
            data: dtObj.str,
            mesNum: dtObj.mesNum,
            mesNome: dtObj.mesNome,
            timestamp: dtObj.timestamp,
            hora: String(r['Hora'] || r['HORA'] || '').trim(),
            meio: String(r['MEIO DE ATENDIMENTO'] || 'Presencial').trim(),
            solicitadoPor: String(r['SOLICITADO POR:'] || r['SOLICITADO POR'] || 'Responsável').trim(),
            aluno: aluno,
            ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
            escolaAtual: String(r['ESCOLA ATUAL'] || 'Fora da rede').trim(),
            serie: String(r['SÉRIE '] || r['SÉRIE'] || '').trim(),
            turnoAtual: String(r['TURNO ATUAL '] || '-').trim(),
            escolaPretendida: String(r['ESCOLA PRETENDIDA'] || 'Não especificada').trim(),
            turnoPretendido: String(r['TURNO PRETENDIDO'] || '-').trim(),
            motivo: String(r['MOTIVO'] || 'Solicitação de vaga/transferência').trim(),
            orientacao: String(r['ORIENTAÇÃO SEMAT'] || '').trim(),
            responsavel: String(r['RESPONSÁVEL'] || r['RESPONSÁVEL '] || 'SEMAT').trim()
          });
        });

        /* Matrículas */
        const matriculas = [];
        let prevDateMat = { str: '06/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 6).getTime() };
        const contagemPorMesMat = {};

        rawMat.forEach((r, idx) => {
          const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || r['NOME COMPLETO'] || r['ALUNO'] || r['Nome'] || '').trim();
          if (!aluno) return;
          const rawD = r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : (r['Data'] !== undefined && r['Data'] !== '' ? r['Data'] : r['data']);
          const dtObj = parseDataXlsxLocal(rawD, prevDateMat);
          if (rawD) prevDateMat = dtObj;
          contagemPorMesMat[dtObj.mesNum] = (contagemPorMesMat[dtObj.mesNum] || 0) + 1;

          matriculas.push({
            id: 'MAT-' + (idx + 1),
            data: dtObj.str,
            mesNum: dtObj.mesNum,
            mesNome: dtObj.mesNome,
            timestamp: dtObj.timestamp,
            aluno: aluno,
            ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
            escola: String(r['ESCOLA'] || '').trim(),
            serie: String(r['SÉRIE '] || '').trim(),
            classe: String(r['Nº CLASSE '] || '').trim(),
            motivo: String(r['MOTIVO'] || 'Ajuste Escolar').trim(),
            responsavel: String(r['RESPONSÁVEL '] || 'SEMAT').trim(),
            observacao: String(r['OBSERVAÇÃO'] || '').trim()
          });
        });

        /* SEI */
        const processosSei = [];
        let prevDateSei = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };

        rawSei.forEach((r, idx) => {
          const prot = String(r['PROTOCOLO'] || '').trim();
          const ass = String(r['ASSUNTO'] || '').trim();
          if (!prot && !ass) return;
          const rawD = r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : r['Data'];
          const dtObj = parseDataXlsxLocal(rawD, prevDateSei);
          if (rawD) prevDateSei = dtObj;

          processosSei.push({
            id: 'SEMAT-SEI-' + (idx + 1),
            protocolo: prot || 'S/N',
            data: dtObj.str,
            mesNum: dtObj.mesNum,
            mesNome: dtObj.mesNome,
            timestamp: dtObj.timestamp,
            assunto: ass || 'Processo Administrativo',
            remetente: String(r['REMETENTE'] || '').trim(),
            interessado: String(r['INTERESSADO (A)'] || '').trim(),
            situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
            responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEMAT').trim()
          });
        });

        /* Atualiza base viva */
        const wsEmailSemat = wb.Sheets['E-MAIL'];
        const wsTrocasSemat = wb.Sheets['TROCAS DE ESCOLA'];
        if (wsEmailSemat) {
          DADOS_SEMAT.kpis = DADOS_SEMAT.kpis || {};
          DADOS_SEMAT.kpis.totalEmails = XLSX.utils.sheet_to_json(wsEmailSemat, { header: 1 }).length;
        }
        if (wsTrocasSemat) {
          DADOS_SEMAT.kpis = DADOS_SEMAT.kpis || {};
          DADOS_SEMAT.kpis.totalTrocasEscola = XLSX.utils.sheet_to_json(wsTrocasSemat, { header: 1 }).length;
        }
        DADOS_SEMAT.atendimentos = atendimentos;
        DADOS_SEMAT.matriculas = matriculas;
        DADOS_SEMAT.processosSei = processosSei;
        DADOS_SEMAT.kpis = DADOS_SEMAT.kpis || {};
        DADOS_SEMAT.kpis.totalAtendimentos = atendimentos.length;
        DADOS_SEMAT.kpis.totalMatriculasManuais = matriculas.length;
        DADOS_SEMAT.kpis.totalSei = processosSei.length;
        DADOS_SEMAT.kpis.mesesAtendimentos = contagemPorMesAten;
        DADOS_SEMAT.kpis.mesesMatriculas = contagemPorMesMat;
        if (DADOS_SEMAT.meta) {
          DADOS_SEMAT.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          DADOS_SEMAT.meta.origemSync = 'SharePoint Ao Vivo (Download Direto)';
        }

        renderizarDashboardSemat();
        if (typeof window.gravarEstadoNuvem === 'function') {
          window.gravarEstadoNuvem('SEMAT_DATA', DADOS_SEMAT);
        }

        if (!window.__sematSyncSilencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEMAT AO VIVO • SHAREPOINT',
            titulo: 'Planilha SEMAT Atualizada em Tempo Real!',
            mensagem: '<strong>' + atendimentos.length.toLocaleString('pt-BR') + ' atendimentos</strong> e <strong>' + matriculas.length.toLocaleString('pt-BR') + ' matrículas</strong> baixados diretamente do SharePoint agora.',
            detalhes: 'SharePoint Ao Vivo às ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            duracao: 4500
          });
        }
      } catch (errXlsx) {
        console.error('Erro ao ler base64 SEMAT com SheetJS:', errXlsx);
      }
    }

    function sincronizarDashboardSemat(silencioso) {
      const isSil = (silencioso === true);
      window.__sematSyncSilencioso = isSil;
      if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEMAT • SHAREPOINT AO VIVO',
          titulo: 'Sincronizando Base do SEMAT...',
          mensagem: 'Conectando ao SharePoint em tempo real para baixar a planilha oficial...',
          detalhes: 'Conexão Direta Ao Vivo • Sem Login',
          duracao: 0
        });
      }

      function aplicarDadosSemat(novos, falhaRede) {
        if (!falhaRede && novos && (novos.kpis || novos.processosSei)) {
          DADOS_SEMAT = novos;
          if (DADOS_SEMAT.meta) {
            DADOS_SEMAT.meta.origemSync = novos.origem || 'Espelho Automático Nuvem (GitHub)';
          }
          if (typeof window.gravarEstadoNuvem === 'function') {
            window.gravarEstadoNuvem('SEMAT_DATA', DADOS_SEMAT);
          }
        }
        const tsReal = (DADOS_SEMAT.meta && DADOS_SEMAT.meta.atualizadoFormatado) ? DADOS_SEMAT.meta.atualizadoFormatado : 'Data não informada';
        renderizarDashboardSemat();

        if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
          if (falhaRede) {
            mostrarAlertaSincronizacao({
              tipo: 'warning',
              tag: 'SEMAT • SEM CONEXÃO',
              titulo: 'Não foi possível buscar nova coleta agora',
              mensagem: 'Mantendo os últimos dados carregados (coleta de <strong>' + tsReal + '</strong>).',
              detalhes: 'Tente novamente em instantes',
              duracao: 5000
            });
          } else {
            mostrarAlertaSincronizacao({
              tipo: 'success',
              tag: 'SEMAT • ESPELHO NUVEM',
              titulo: 'Dados do SEMAT Carregados',
              mensagem: '<strong>' + (DADOS_SEMAT.kpis ? DADOS_SEMAT.kpis.totalAtendimentos : 0).toLocaleString('pt-BR') + ' atendimentos</strong> e <strong>' + (DADOS_SEMAT.kpis ? DADOS_SEMAT.kpis.totalMatriculasManuais : 0).toLocaleString('pt-BR') + ' matrículas</strong>.',
              detalhes: 'Coleta oficial SharePoint registrada em: ' + tsReal,
              duracao: 5000
            });
          }
        }
      }

      function buscarMirror() {
        fetch(URLS_OFICIAIS_SEMAT.mirrorData + '?t=' + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(json) {
            if (json && json.kpis) {
              aplicarDadosSemat(json, false);
            } else {
              aplicarDadosSemat(null, true);
            }
          })
          .catch(function(e) {
            console.warn('Aviso mirror SEMAT:', e);
            aplicarDadosSemat(null, true);
          });
      }

      const ehOtimizado = (typeof CONFIG_SINCRONIZACAO_SEMAT !== 'undefined') ? CONFIG_SINCRONIZACAO_SEMAT.modoOtimizado : true;
      consultarSharepointGasLive({
        action: 'sincronizarSemat',
        fnGas: 'sincronizarPlanilhaSemat',
        argsGas: [!ehOtimizado],
        urlExtraParams: (ehOtimizado ? '' : '&bruto=true')
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64 && typeof processarPlanilhaSematBase64 === 'function') {
          processarPlanilhaSematBase64(res.dadosBase64, res.timestamp);
        } else if (res && res.kpis) {
          aplicarDadosSemat(res, false);
        } else {
          buscarMirror();
        }
      }).catch(function() {
        buscarMirror();
      });
    }

    /* ======================================================= */
    /* CONFIGURAÇÃO MODULAR E REVERSÍVEL: SINCRONIZAÇÃO SEVESC */
    /* ======================================================= */
    const CONFIG_SINCRONIZACAO_SEVESC = {
      /* Flag de controle de alta performance:
         true = modo otimizado (baixa e processa apenas abas ativas em < 1s)
         false = modo bruto integral */
      modoOtimizado: true,

      /* Abas monitoradas e ativas na interface operacional da SEVESC: */
      abasAtivas: [
        'ATENDIMENTO ',
        'ENTRADA SEI',
        'E-MAIL'
      ],

      /* Catálogo de abas conhecidas da SEVESC para expansão futura: */
      todasAsAbas: [
        'ATENDIMENTO ', 'ENTRADA SEI', 'E-MAIL', 'CONCLUINTES GDAE', 'HISTÓRICO ESCOLAR'
      ]
    };

    /* ======================================================= */
    /* PAINEL SEVESC - SEÇÃO DE VIDA ESCOLAR (SHAREPOINT) */
    /* ======================================================= */
    let DADOS_SEVESC = {"sucesso":true,"meta":{"nomeArquivo":"Livro Entrada 2026 SEVESC.xlsx","setor":"SEVESC - Seção de Vida Escolar","servicoPai":"Serviço de Gestão da Rede Escolar (SEGRE)","contaResponsavel":"itp_sevesc_educacao_sp_gov_br","sharepointUrl":"https:\/\/seesp-my.sharepoint.com\/:x:\/g\/personal\/itp_sevesc_educacao_sp_gov_br\/cQroeBSCMXZCQbbGQSCaAqMaEgUCxrdIuNVbs_RPejCEfptcng","atualizadoEm":"2026-11-11T02:42:41.997Z","atualizadoFormatado":"10\/11\/2026, 23:42:41","tamanhoArquivoMb":"1.22"},"kpis":{"totalSei":0,"totalAtendimentos":0,"totalEmails":0,"totalProntuariosConcluintes":0,"mesesAtendimentos":{}},"processosSei":[],"atendimentos":[],"emails":[]};
    /* Dados SEVESC alimentados exclusivamente pela nuvem (zero localStorage) */

    let abaAtivaSevesc = 'atendimentos';
    let filtroBuscaSevesc = '';
    let filtroMesSevesc = 'todos';
    let ordenacaoSevesc = { col: 'data', dir: 'desc' };
    let paginaAtualSevesc = 1;
    const ITENS_POR_PAGINA_SEVESC = 50;

    function mudarAbaSevesc(aba) {
      abaAtivaSevesc = aba;
      paginaAtualSevesc = 1;
      ordenacaoSevesc = { col: 'data', dir: 'desc' };
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
      const selectMes = document.getElementById('sevesc-filtro-mes');

      filtroBuscaSevesc = input ? input.value.trim().toLowerCase() : '';
      filtroMesSevesc = selectMes ? selectMes.value : 'todos';
      paginaAtualSevesc = 1;
      renderizarCorpoTabelaSevesc();
    }

    function mudarPaginaSevesc(delta) {
      paginaAtualSevesc += delta;
      renderizarCorpoTabelaSevesc();
    }

    function alternarOrdenacaoSevesc(colKey) {
      if (ordenacaoSevesc.col === colKey) {
        ordenacaoSevesc.dir = ordenacaoSevesc.dir === 'desc' ? 'asc' : 'desc';
      } else {
        ordenacaoSevesc.col = colKey;
        ordenacaoSevesc.dir = (colKey === 'data') ? 'desc' : 'asc';
      }
      paginaAtualSevesc = 1;
      renderizarCorpoTabelaSevesc();
    }

    function renderizarCorpoTabelaSevesc() {
      const container = document.getElementById('sevesc-tabela-container');
      const badgeContador = document.getElementById('sevesc-contador-registros');
      if (!container) return;

      let colunas = [];
      let baseOriginal = [];

      if (abaAtivaSevesc === 'atendimentos') {
        baseOriginal = DADOS_SEVESC.atendimentos || DADOS_SEVESC.atendimentosRecentes || [];
        colunas = [
          { key: 'data', titulo: 'Data & Meio', width: '13%', isDate: true },
          { key: 'interessado', titulo: 'Interessado(a) / Aluno', width: '28%' },
          { key: 'rgCin', titulo: 'Documento / RG', width: '14%' },
          { key: 'assunto', titulo: 'Assunto / Unidade Escolar', width: '30%' },
          { key: 'situacao', titulo: 'Status / Responsável', width: '15%' }
        ];
      } else if (abaAtivaSevesc === 'sei') {
        baseOriginal = DADOS_SEVESC.processosSei || [];
        colunas = [
          { key: 'protocolo', titulo: 'Processo SEI', width: '22%' },
          { key: 'data', titulo: 'Data Entrada', width: '12%', isDate: true },
          { key: 'assunto', titulo: 'Assunto / Finalidade', width: '30%' },
          { key: 'interessado', titulo: 'Interessado / Escola', width: '22%' },
          { key: 'situacao', titulo: 'Situação / Responsável', width: '14%' }
        ];
      } else if (abaAtivaSevesc === 'emails') {
        baseOriginal = DADOS_SEVESC.emails || DADOS_SEVESC.emailsRecentes || [];
        colunas = [
          { key: 'data', titulo: 'Data / Horário', width: '15%', isDate: true },
          { key: 'assunto', titulo: 'Assunto do Expediente', width: '35%' },
          { key: 'interessado', titulo: 'Interessado(a)', width: '25%' },
          { key: 'escola', titulo: 'Escola / Situação', width: '25%' }
        ];
      }

      /* Filtragem */
      let registros = baseOriginal.filter(item => {
        if (filtroMesSevesc !== 'todos') {
          if (String(item.mesNum) !== String(filtroMesSevesc)) return false;
        }
        if (!filtroBuscaSevesc) return true;
        const b = filtroBuscaSevesc;
        return (item.interessado && item.interessado.toLowerCase().includes(b)) ||
          (item.escola && item.escola.toLowerCase().includes(b)) ||
          (item.assunto && item.assunto.toLowerCase().includes(b)) ||
          (item.protocolo && item.protocolo.toLowerCase().includes(b)) ||
          (item.rgCin && item.rgCin.toLowerCase().includes(b)) ||
          (item.responsavel && item.responsavel.toLowerCase().includes(b));
      });

      /* Ordenação por coluna (padrão: data mais recente -> mais antiga) */
      const colSevesc = ordenacaoSevesc.col || 'data';
      const dirSevesc = ordenacaoSevesc.dir || 'desc';
      const colDefSevesc = colunas.find(c => c.key === colSevesc) || colunas[0];
      ordenarListaPorColuna(registros, {
        dir: dirSevesc,
        isDate: !!(colDefSevesc && colDefSevesc.isDate),
        getter: function(item) {
          if (colSevesc === 'data') return parseTimestampDataTabela(item.data, item.hora, item.timestamp);
          return item[colSevesc] || '';
        },
        tieId: function(item) { return item.id; }
      });

      const totalRegistros = registros.length;
      const totalPaginas = Math.ceil(totalRegistros / ITENS_POR_PAGINA_SEVESC) || 1;
      if (paginaAtualSevesc < 1) paginaAtualSevesc = 1;
      if (paginaAtualSevesc > totalPaginas) paginaAtualSevesc = totalPaginas;

      const inicio = (paginaAtualSevesc - 1) * ITENS_POR_PAGINA_SEVESC;
      const fim = Math.min(inicio + ITENS_POR_PAGINA_SEVESC, totalRegistros);
      const paginaRegistros = registros.slice(inicio, fim);

      if (badgeContador) {
        badgeContador.innerText = `Exibindo ${totalRegistros > 0 ? (inicio + 1) : 0} a ${fim} de ${totalRegistros.toLocaleString('pt-BR')} registros`;
      }

      let htmlTabela = `
        <div style="overflow-x: auto; max-height: 520px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px;">
          <table id="tabela-sevesc-dados" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left; background: #ffffff;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; position: sticky; top: 0; z-index: 2;">
                ${colunas.map(c => gerarThOrdenavelHtml(c, colSevesc, dirSevesc, 'alternarOrdenacaoSevesc')).join('')}
              </tr>
            </thead>
            <tbody>
      `;

      if (paginaRegistros.length === 0) {
        htmlTabela += `
          <tr>
            <td colspan="${colunas.length}" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div>
              <div style="font-weight: 700;">Nenhum registro encontrado para os filtros selecionados no SEVESC.</div>
            </td>
          </tr>
        `;
      } else {
        paginaRegistros.forEach((r, idx) => {
          const bgPar = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          htmlTabela += `<tr style="background: ${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#faf5ff'" onmouseout="this.style.background='${bgPar}'">`;

          if (abaAtivaSevesc === 'atendimentos') {
            const isFin = r.situacao.includes('FINALIZ');
            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569; text-align: center;">
                <div style="font-weight: 800; color: #0f172a; display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <span>📅</span> ${r.data || '05/01/2026'}
                </div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.meio || 'Presencial'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.interessado}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Sol: ${r.solicitadoPor || '—'}</div>
              </td>
              <td style="padding: 9px 12px; font-family: monospace; color: #475569;">${r.rgCin || '—'}</td>
              <td style="padding: 9px 12px; font-size: 0.78rem;">
                <div style="font-weight: 700; color: #7c3aed;">${r.assunto}</div>
                <div style="color: #64748b;">${r.escola || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${isFin ? '#d1fae5' : '#fef3c7'}; color: ${isFin ? '#059669' : '#d97706'};">${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: ${r.responsavel}</div>
              </td>
            `;
          } else if (abaAtivaSevesc === 'sei') {
            const isFin = r.situacao.includes('FINALIZ');
            htmlTabela += `
              <td style="padding: 9px 12px; font-weight: 800; color: #0b2351; font-family: monospace;">${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569; text-align: center;">${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #1e293b;">${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">
                <div><strong>${r.interessado || '—'}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">Escola: ${r.escola || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${isFin ? '#d1fae5' : '#fef3c7'}; color: ${isFin ? '#059669' : '#d97706'};">${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: ${r.responsavel}</div>
              </td>
            `;
          } else if (abaAtivaSevesc === 'emails') {
            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569; text-align: center;">${r.data || '—'} ${r.hora ? '• ' + r.hora : ''}</td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0f172a;">${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">${r.interessado || '—'}</td>
              <td style="padding: 9px 12px; font-size: 0.76rem;">
                <div style="color: #64748b;">${r.escola || '—'}</div>
                <div style="color: #059669; font-weight: 700;">${r.situacao}</div>
              </td>
            `;
          }
          htmlTabela += `</tr>`;
        });
      }

      htmlTabela += `
            </tbody>
          </table>
        </div>
      `;

      if (totalPaginas > 1) {
        htmlTabela += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem; padding: 0.5rem 0.2rem; font-size: 0.82rem; color: #475569;">
            <div>Página <strong>${paginaAtualSevesc}</strong> de <strong>${totalPaginas}</strong> (${totalRegistros.toLocaleString('pt-BR')} registros)</div>
            <div style="display: flex; gap: 0.4rem;">
              <button onclick="mudarPaginaSevesc(-1)" ${paginaAtualSevesc <= 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 5px 12px; border-radius: 6px; font-weight: 700; cursor: pointer;">◀ Anterior</button>
              <button onclick="mudarPaginaSevesc(1)" ${paginaAtualSevesc >= totalPaginas ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 5px 12px; border-radius: 6px; font-weight: 700; cursor: pointer;">Próxima ▶</button>
            </div>
          </div>
        `;
      }

      container.innerHTML = htmlTabela;
    }

    function renderizarDashboardSevesc() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEVESC.meta || {};
      const kpis = DADOS_SEVESC.kpis || { totalAtendimentos: 662, totalSei: 57, totalEmails: 2717, totalProntuariosConcluintes: 1557 };

      const html = `
        <div class="sevesc-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEVESC -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #6d28d9 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">📜</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEVESC - Seção de Vida Escolar</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Acompanhamento de prontuários de alunos, regularização de vida escolar, certificação de concluintes, histórico escolar e processos SEI.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #cbd5e1; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="sevesc-banner-timestamp" style="color: #ffffff;">${meta.atualizadoFormatado || 'Sem registro'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSevesc()" id="btn-sevesc-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar SEVESC
                </button>
                <a href="${meta.sharepointUrl || URLS_OFICIAIS_SEVESC.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com histórico de vida escolar de ex-alunos e concluintes</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS SEVESC -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Vida Escolar</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    📜
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalAtendimentos.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Jan a Nov (100%)</span>
                <span style="font-weight: 600; color: #64748b;">Atendimentos</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Processos SEI</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    📋
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalSei || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Processos Vida Escolar</span>
                <span style="font-weight: 600; color: #64748b;">Protocolos</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">E-mails & Expedientes</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ffedd5; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fed7aa; font-size: 1.1rem;">
                    📬
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #ea580c; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalEmails.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #c2410c; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Demandas & escolas extintas</span>
                <span style="font-weight: 600; color: #64748b;">Expedientes</span>
              </div>
            </div>

            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Prontuários / Concluintes</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    🗂️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalProntuariosConcluintes.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Acervo escolar da região</span>
                <span style="font-weight: 600; color: #64748b;">Consolidado</span>
              </div>
            </div>

          </div>

          <!-- SUB-ABAS DO SEVESC -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-sevesc-atendimentos" onclick="mudarAbaSevesc('atendimentos')" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📜 Atendimentos Vida Escolar
              </button>
              <button id="tab-btn-sevesc-sei" onclick="mudarAbaSevesc('sei')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📋 Processos SEI
              </button>
              <button id="tab-btn-sevesc-emails" onclick="mudarAbaSevesc('emails')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
                📬 E-mails & Expedientes
              </button>
            </div>
            <div id="sevesc-contador-registros" style="font-size: 0.8rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 5px 12px; border-radius: 20px;">
              Carregando dados...
            </div>
          </div>

          <!-- BARRA DE CONTROLE: BUSCA + FILTRO POR MÊS + ORDENAÇÃO -->
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between;">
            
            <div style="flex: 1; min-width: 250px; display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0 0.75rem;">
              <span style="font-size: 1rem; color: #64748b; margin-right: 0.5rem;">🔍</span>
              <input type="text" id="sevesc-busca-input" onkeyup="filtrarTabelaSevesc()" placeholder="Pesquisar por interessado, documento, escola, assunto, responsável..." style="border: none; background: transparent; width: 100%; padding: 8px 0; font-size: 0.84rem; outline: none; color: #0f172a; font-family: inherit;">
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              
              <!-- Seletor de Mês -->
              <div style="display: flex; align-items: center; gap: 0.35rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: #0b2351;">Mês:</span>
                <select id="sevesc-filtro-mes" onchange="filtrarTabelaSevesc()" style="background: #ffffff; border: 1.5px solid #7c3aed; color: #0f172a; padding: 7px 10px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; outline: none; cursor: pointer;">
                  <option value="todos">Todos os Meses (Jan a Dez)</option>
                  ${[
                    [1,'Janeiro'],[2,'Fevereiro'],[3,'Março'],[4,'Abril'],
                    [5,'Maio'],[6,'Junho'],[7,'Julho'],[8,'Agosto'],
                    [9,'Setembro'],[10,'Outubro'],[12,'Dezembro']
                  ].map(([m, nomeMes]) => {
                    const aCnt = (kpis.mesesAtendimentos && kpis.mesesAtendimentos[String(m)]) || 0;
                    const suf = m === 1 ? ' atendimentos' : '';
                    return `<option value="${m}">${nomeMes} (${aCnt.toLocaleString('pt-BR')}${suf})</option>`;
                  }).join('')}
                </select>
              </div>

            </div>

          </div>

          <div id="sevesc-tabela-container"></div>

          <!-- NOTA METODOLÓGICA E ORIENTAÇÕES DO SEVESC -->
          <div id="nota-metodologica-sevesc" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">📜</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEVESC • NOTAS METODOLÓGICAS &amp; DOCUMENTAÇÃO ESCOLAR</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Validação de concluintes, autenticidade de históricos, acervos de escolas extintas e equivalência de estudos</div>
                </div>
              </div>
              <span style="background: rgba(236,72,153,0.15); color: #f472b6; border: 1px solid rgba(236,72,153,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Livro Entrada 2026 SEVESC • SharePoint</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Concluintes e GDAE -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #f472b6; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🎓</span> <span>Validação de Concluintes &amp; GDAE</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Publicação Oficial:</strong> Homologação dos registros de conclusão do Ensino Médio e Técnico no sistema GDAE e Diário Oficial do Estado (DOE).<br>
                  • <strong>Segurança e Fé Pública:</strong> Mecanismo que confere validade jurídica nacional aos diplomas e impede fraudes em concursos públicos e universidades.
                </div>
              </div>

              <!-- Bloco 2: Históricos e Prontuários -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📋</span> <span>Prontuários &amp; Segunda Via de Documentos</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Históricos Escolares:</strong> Emissão, conferência e autenticação de vias de histórico escolar, certidões de comparecimento e declarações de escolaridade.<br>
                  • <strong>Auditoria Documental:</strong> Conferência rigorosa de matrizes curriculares, cargas horárias e notas de aproveitamento conforme diretrizes do CEE-SP.
                </div>
              </div>

              <!-- Bloco 3: Escolas Extintas -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #fbbf24; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏛️</span> <span>Acervo Custodiado de Escolas Extintas</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Guarda Definitiva:</strong> Custódia e conservação dos prontuários e livros de registro de escolas públicas e particulares desativadas em Itapevi e Jandira.<br>
                  • <strong>Atendimento aos Egressos:</strong> Emissão de 2ª via oficial de certificados e históricos para ex-alunos de unidades que encerraram atividades.
                </div>
              </div>

              <!-- Bloco 4: Regularização e Equivalência -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #34d399; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🌐</span> <span>Equivalência Internacional &amp; Regularizações</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Estudos no Exterior:</strong> Instrução e emissão de parecer conclusivo para equivalência de estudos cursados fora do Brasil (Deliberação CEE 21/2001).<br>
                  • <strong>Regularização de Vida Escolar:</strong> Sanar pendências, lacunas e discrepâncias documentais acumuladas ao longo da trajetória acadêmica do aluno.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Seção de Vida Escolar (SEVESC / SEGRE)</span>
              <span>Atendimento ao Cidadão: itp_sevesc_educacao_sp_gov_br • Fé Pública &amp; Preservação Histórica</span>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
      renderizarCorpoTabelaSevesc();
    }

    function processarPlanilhaSevescBase64(base64Data, timestamp, jaPurificado) {
      if (typeof XLSX === 'undefined') {
        console.warn('SheetJS (XLSX) não disponível para SEVESC.');
        return;
      }
      if (!jaPurificado && typeof window.purificarXlsxStreamingSeNecessario === 'function') {
        window.purificarXlsxStreamingSeNecessario(base64Data).then(function(cleanB64) {
          processarPlanilhaSevescBase64(cleanB64, timestamp, true);
        });
        return;
      }
      try {
        const readOpts = { type: 'base64' };
        if (typeof CONFIG_SINCRONIZACAO_SEVESC !== 'undefined' && CONFIG_SINCRONIZACAO_SEVESC.modoOtimizado && Array.isArray(CONFIG_SINCRONIZACAO_SEVESC.abasAtivas)) {
          readOpts.sheets = CONFIG_SINCRONIZACAO_SEVESC.abasAtivas;
        }
        const wb = XLSX.read(base64Data, readOpts);
        const wsAten = wb.Sheets['ATENDIMENTO '];
        const wsSei = wb.Sheets['ENTRADA SEI'];
        const wsEmail = wb.Sheets['E-MAIL'];

        const rawAten = wsAten ? XLSX.utils.sheet_to_json(wsAten, { defval: '' }) : [];
        const rawSei = wsSei ? XLSX.utils.sheet_to_json(wsSei, { defval: '' }) : [];
        const rawEmail = wsEmail ? XLSX.utils.sheet_to_json(wsEmail, { defval: '' }) : [];

        const mesesNomes = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        function parseDataXlsxLocal(val, fallback) {
          if (typeof val === 'number' && val >= 40000 && val <= 50000) {
            if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
              const p = XLSX.SSF.parse_date_code(val);
              if (p) {
                let y = p.y > 2026 ? 2026 : p.y;
                const dStr = String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + y;
                return { str: dStr, mesNum: p.m, mesNome: mesesNomes[p.m] || 'Janeiro', timestamp: new Date(y, p.m - 1, p.d).getTime() };
              }
            }
            const d = new Date(Math.round((val - 25569) * 86400 * 1000));
            let y = d.getUTCFullYear() > 2026 ? 2026 : d.getUTCFullYear();
            const m = d.getUTCMonth() + 1;
            const dStr = String(d.getUTCDate()).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + y;
            return { str: dStr, mesNum: m, mesNome: mesesNomes[m] || 'Janeiro', timestamp: new Date(y, m - 1, d.getUTCDate()).getTime() };
          }
          if (val) {
            const m = String(val).trim().match(/(\d{1,2})[/-](\d{1,2})[/-]?(\d{2,4})?/);
            if (m && m[1] && m[2]) {
              let y = m[3] ? parseInt(m[3], 10) : 2026;
              if (y < 100) y += 2000;
              if (y > 2026) y = 2026;
              const dia = parseInt(m[1], 10);
              const mes = parseInt(m[2], 10);
              const dStr = String(dia).padStart(2, '0') + '/' + String(mes).padStart(2, '0') + '/' + y;
              return { str: dStr, mesNum: mes, mesNome: mesesNomes[mes] || 'Janeiro', timestamp: new Date(y, mes - 1, dia).getTime() };
            }
          }
          return fallback || { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
        }

        /* Atendimentos */
        const atendimentos = [];
        let prevDateAten = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
        const contagemPorMesAten = {};

        rawAten.forEach((r, idx) => {
          const aluno = String(r['ELIZABETH FERREIRA DE FARIAS'] || r['SOLICITADO POR:'] || '').trim();
          const ass = String(r['ASSUNTO'] || '').trim();
          if (!aluno && !ass) return;

          const rawD = r['Data'] !== undefined && r['Data'] !== '' ? r['Data'] : r['DATA'];
          const dtObj = parseDataXlsxLocal(rawD, prevDateAten);
          if (rawD) prevDateAten = dtObj;

          contagemPorMesAten[dtObj.mesNum] = (contagemPorMesAten[dtObj.mesNum] || 0) + 1;

          atendimentos.push({
            id: 'SEVESC-ATEN-' + (idx + 1),
            data: dtObj.str,
            mesNum: dtObj.mesNum,
            mesNome: dtObj.mesNome,
            timestamp: dtObj.timestamp,
            meio: String(r['MEIO DE ATENDIMENTO'] || 'Presencial').trim(),
            solicitadoPor: String(r['SOLICITADO POR:'] || '').trim(),
            interessado: aluno,
            rgCin: String(r['RG/CIN'] || '').trim(),
            escola: String(r['ESCOLA'] || '').trim(),
            assunto: ass,
            numSei: String(r['Nº SEI'] || r['N° SEI'] || '-').trim(),
            situacao: String(r['SITUAÇÃO ATUAL'] || 'FINALIZADO').trim().toUpperCase(),
            responsavel: String(r['RESPONSÁVEL'] || r['RESPONSÁVEL '] || 'SEVESC').trim()
          });
        });

        /* Processos SEI */
        const processosSei = [];
        let prevDateSei = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };

        rawSei.forEach((r, idx) => {
          const prot = String(r['PROCESSO'] || r['PROTOCOLO'] || '').trim();
          const ass = String(r['ASSUNTO'] || '').trim();
          if (!prot && !ass) return;
          const rawD = r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : r['Data'];
          const dtObj = parseDataXlsxLocal(rawD, prevDateSei);
          if (rawD) prevDateSei = dtObj;

          processosSei.push({
            id: 'SEVESC-SEI-' + (idx + 1),
            protocolo: prot || 'S/N',
            data: dtObj.str,
            mesNum: dtObj.mesNum,
            mesNome: dtObj.mesNome,
            timestamp: dtObj.timestamp,
            assunto: ass || 'Processo de Vida Escolar',
            escola: String(r['ESCOLA'] || '').trim(),
            interessado: String(r['INTERESSADO (A)'] || '').trim(),
            situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
            responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEVESC').trim()
          });
        });

        /* E-mails */
        const emails = [];
        let prevDateEmail = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
        const startEmail = Math.max(0, rawEmail.length - 400);

        for (let i = rawEmail.length - 1; i >= startEmail; i--) {
          const r = rawEmail[i];
          const ass = String(r['ASSUNTO'] || '').trim();
          const inter = String(r['Interessado'] || '').trim();
          if (!ass && !inter) continue;
          const rawD = r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : r['Data'];
          const dtObj = parseDataXlsxLocal(rawD, prevDateEmail);
          if (rawD) prevDateEmail = dtObj;

          emails.push({
            id: 'SEVESC-MAIL-' + (i + 1),
            data: dtObj.str,
            mesNum: dtObj.mesNum,
            mesNome: dtObj.mesNome,
            timestamp: dtObj.timestamp,
            hora: String(r['HORA'] || '').trim(),
            assunto: ass,
            interessado: inter,
            escola: String(r['ESCOLA'] || '').trim(),
            situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
            responsavel: String(r['RESPONSÁVEL '] || 'SEVESC').trim()
          });
        }

        DADOS_SEVESC.atendimentos = atendimentos;
        DADOS_SEVESC.processosSei = processosSei;
        DADOS_SEVESC.emails = emails;
        DADOS_SEVESC.kpis = DADOS_SEVESC.kpis || {};
        DADOS_SEVESC.kpis.totalAtendimentos = atendimentos.length;
        DADOS_SEVESC.kpis.totalSei = processosSei.length;
        DADOS_SEVESC.kpis.totalEmails = rawEmail.length;
        DADOS_SEVESC.kpis.mesesAtendimentos = contagemPorMesAten;
        if (DADOS_SEVESC.meta) {
          DADOS_SEVESC.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR');
          DADOS_SEVESC.meta.origemSync = 'SharePoint Ao Vivo';
        }

        renderizarDashboardSevesc();
        if (typeof window.gravarEstadoNuvem === 'function') {
          window.gravarEstadoNuvem('SEVESC_DATA', DADOS_SEVESC);
        }

        if (!window.__sevescSyncSilencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEVESC AO VIVO • SHAREPOINT',
            titulo: 'Planilha SEVESC Atualizada em Tempo Real!',
            mensagem: '<strong>' + atendimentos.length.toLocaleString('pt-BR') + ' atendimentos</strong> e <strong>' + processosSei.length.toLocaleString('pt-BR') + ' processos SEI</strong> baixados do SharePoint agora.',
            detalhes: 'SharePoint Ao Vivo às ' + new Date().toLocaleTimeString('pt-BR'),
            duracao: 4500
          });
        }
      } catch (errXlsx) {
        console.error('Erro ao ler base64 SEVESC com SheetJS:', errXlsx);
      }
    }

    function sincronizarDashboardSevesc(silencioso) {
      const isSil = (silencioso === true);
      window.__sevescSyncSilencioso = isSil;
      if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEVESC • SHAREPOINT AO VIVO',
          titulo: 'Baixando Planilha SEVESC do SharePoint...',
          mensagem: 'Conectando ao SharePoint em tempo real (1,22 MB • Atendimentos, SEI e E-mails)...',
          detalhes: 'Conexão Direta Ao Vivo • Sem Login',
          duracao: 0
        });
      }

      function aplicarDadosSevesc(novos, falhaRede) {
        if (!falhaRede && novos && (novos.kpis || novos.processosSei)) {
          DADOS_SEVESC = novos;
          if (DADOS_SEVESC.meta) {
            DADOS_SEVESC.meta.origemSync = novos.origem || 'Espelho Automático Nuvem (Fallback)';
          }
          if (typeof window.gravarEstadoNuvem === 'function') {
            window.gravarEstadoNuvem('SEVESC_DATA', DADOS_SEVESC);
          }
        }
        const tsReal = (DADOS_SEVESC.meta && DADOS_SEVESC.meta.atualizadoFormatado) ? DADOS_SEVESC.meta.atualizadoFormatado : 'Data não informada';
        renderizarDashboardSevesc();

        if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
          if (falhaRede) {
            mostrarAlertaSincronizacao({
              tipo: 'warning',
              tag: 'SEVESC • SEM CONEXÃO',
              titulo: 'SharePoint SEVESC indisponível no momento',
              mensagem: 'Mantendo os dados carregados (coleta de <strong>' + tsReal + '</strong>).',
              detalhes: 'Tente novamente em instantes',
              duracao: 5000
            });
          } else {
            mostrarAlertaSincronizacao({
              tipo: 'info',
              tag: 'SEVESC • ESPELHO NUVEM',
              titulo: 'Base SEVESC via Espelho de Contingência',
              mensagem: '<strong>' + (DADOS_SEVESC.kpis ? DADOS_SEVESC.kpis.totalAtendimentos : 0).toLocaleString('pt-BR') + ' atendimentos</strong> carregados do espelho nuvem.',
              detalhes: 'Coleta SharePoint registrada em: ' + tsReal,
              duracao: 5000
            });
          }
        }
      }

      function buscarMirror() {
        fetch(URLS_OFICIAIS_SEVESC.mirrorData + '?t=' + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(json) {
            if (json && json.kpis) {
              aplicarDadosSevesc(json, false);
            } else {
              aplicarDadosSevesc(null, true);
            }
          })
          .catch(function(e) {
            console.warn('Aviso mirror SEVESC:', e);
            aplicarDadosSevesc(null, true);
          });
      }

      consultarSharepointGasLive({
        action: 'sincronizarSevesc',
        fnGas: 'sincronizarPlanilhaSevesc',
        argsGas: [false]
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64 && typeof processarPlanilhaSevescBase64 === 'function') {
          processarPlanilhaSevescBase64(res.dadosBase64, res.timestamp);
        } else if (res && res.kpis) {
          aplicarDadosSevesc(res, false);
        } else {
          buscarMirror();
        }
      }).catch(function() {
        buscarMirror();
      });
    }

    /* ======================================================= */
    /* CONFIGURAÇÃO MODULAR E REVERSÍVEL: SINCRONIZAÇÃO SEGRE */
    /* ======================================================= */
    const CONFIG_SINCRONIZACAO_SEGRE = {
      /* Flag de controle de alta performance:
         true = modo otimizado (baixa e processa apenas abas ativas em < 1s)
         false = modo bruto integral (tenta ler as 33 abas / 65.55 MB inteiras) */
      modoOtimizado: true,

      /* Abas monitoradas e ativas na interface operacional do SEGRE:
         Para acrescentar mais abas no futuro (ex: 'CONCLUINTES', 'E-MAIL', 'TRANSPORTE'),
         basta incluir o nome exato da aba neste array: */
      abasAtivas: [
        'ENTRADA SEI',
        'ATENDIMENTO VAGA',
        'OUVIDORIA',
        'CONCLUINTES',
        'E-MAIL'
      ],

      /* Catálogo completo das 33 abas da planilha oficial do SEGRE para expansão futura: */
      todasAsAbas: [
        'ENTRADA SEI', 'ATENDIMENTO VAGA', 'OUVIDORIA', 'CONCLUINTES', 'E-MAIL',
        'OCORRÊNCIAS SEDUC ', 'E-MAIL SÓ SAÍDA', 'GDAE INATIVAS', 'TRANSPORTE',
        'ATENDIMENTOS INTERNOS', 'CENSO', 'MATRÍCULA MANUAL', 'SIGILO DE DADOS ',
        'BX TRANSF', 'AT. FICHA ALUNO', 'EXCLUSÃO DE INSCRIÇÃO ', 'EXCLUSÃO DE MATRÍCULA ',
        'OC. PLANTÃO', 'CAPACIDADE FÍSICA ', 'CLASSES ', 'CLASSES ACIMA ', 'AJUSTE RA',
        'ALTERAÇÕES SCE', 'PRÉ INSCRIÇÃO ONLINE', 'REMANEJAMENTO', 'TROCAS DE ESCOLA',
        'CONSELHO', 'DUPLICIDADE', 'EXCLUSÃO RA POR ERRO', 'IDADE MÍNIMA ',
        'CIRCULAR DERI', 'COMUNICADO DERI ', 'TT GERAL'
      ]
    };

    /* ======================================================= */
    /* PAINEL SEGRE - LIVRO ENTRADA 2026 (SHAREPOINT) */
    /* ======================================================= */
    let DADOS_SEGRE = {"sucesso":true,"meta":{"nomeArquivo":"Livro Entrada 2026 SEGRE.xlsx","setor":"SEGRE - Gestão da Rede Escolar e Matrícula","contaResponsavel":"itp_segre_educacao_sp_gov_br","sharepointUrl":"https:\/\/seesp-my.sharepoint.com\/:x:\/g\/personal\/itp_segre_educacao_sp_gov_br\/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw","atualizadoEm":"2026-11-11T02:43:36.286Z","atualizadoFormatado":"10\/11\/2026, 23:43:36","tamanhoArquivoMb":"65.64"},"kpis":{"totalSei":0,"totalVagas":0,"totalOuvidoria":0,"totalConcluintes":0,"totalEmails":0},"processosSei":[],"atendimentosVaga":[],"ouvidorias":[],"concluintesRecentes":[],"emails":[]};
    /* Dados SEGRE alimentados exclusivamente pela nuvem (zero localStorage) */

    let abaAtivaSegre = 'sei';
    let filtroBuscaSegre = '';
    let filtroStatusSegre = 'todos';
    let ordenacaoSegre = { col: 'data', dir: 'desc' };

    function mudarAbaSegre(aba) {
      abaAtivaSegre = aba;
      ordenacaoSegre = { col: 'data', dir: 'desc' };
      const abas = ['sei', 'vagas', 'ouvidoria', 'concluintes', 'emails'];
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

    function alternarOrdenacaoSegre(colKey) {
      if (ordenacaoSegre.col === colKey) {
        ordenacaoSegre.dir = ordenacaoSegre.dir === 'desc' ? 'asc' : 'desc';
      } else {
        ordenacaoSegre.col = colKey;
        ordenacaoSegre.dir = (colKey === 'data' || colKey === 'dataConclusao') ? 'desc' : 'asc';
      }
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
          { key: 'protocolo', titulo: 'Protocolo SEI', width: '22%' },
          { key: 'data', titulo: 'Data', width: '12%', isDate: true },
          { key: 'assunto', titulo: 'Assunto / Objeto', width: '32%' },
          { key: 'interessado', titulo: 'Interessado / Remetente', width: '20%' },
          { key: 'situacao', titulo: 'Situação / Responsável', width: '14%' }
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
          { key: 'data', titulo: 'Data & Meio', width: '13%', isDate: true },
          { key: 'aluno', titulo: 'Aluno & RA', width: '25%' },
          { key: 'serie', titulo: 'Série', width: '8%' },
          { key: 'escolas', titulo: 'Escola Atual ➔ Pretendida', width: '27%' },
          { key: 'motivo', titulo: 'Motivo & Orientação', width: '27%' }
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
          { key: 'protocolo', titulo: 'Protocolo Fala.SP', width: '20%' },
          { key: 'data', titulo: 'Data Entrada', width: '12%', isDate: true },
          { key: 'interessado', titulo: 'Interessado(a)', width: '25%' },
          { key: 'assunto', titulo: 'Assunto da Manifestação', width: '30%' },
          { key: 'situacao', titulo: 'Status / Responsável', width: '13%' }
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
          { key: 'data', titulo: 'Data Registro', width: '15%', isDate: true },
          { key: 'aluno', titulo: 'Aluno Concluinte', width: '35%' },
          { key: 'escola', titulo: 'Unidade Escolar', width: '25%' },
          { key: 'anoConclusao', titulo: 'Ano Conclusão', width: '12%', isNum: true },
          { key: 'tipoEnsino', titulo: 'Ensino', width: '13%' }
        ];
      } else if (abaAtivaSegre === 'emails') {
        registros = (DADOS_SEGRE.emails || []).filter(item => {
          const matchBusca = !filtroBuscaSegre || 
            (item.assunto && item.assunto.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.remetente && item.remetente.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.interessado && item.interessado.toLowerCase().includes(filtroBuscaSegre)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(filtroBuscaSegre));
          
          let matchStatus = true;
          if (filtroStatusSegre === 'concluido') {
            matchStatus = item.situacao.includes('CIENTE') || item.situacao.includes('CONCLU') || item.situacao.includes('RESPONDID') || item.situacao.includes('ENCAMINHADO');
          } else if (filtroStatusSegre === 'andamento') {
            matchStatus = !item.situacao.includes('CIENTE') && !item.situacao.includes('CONCLU') && !item.situacao.includes('RESPONDID');
          }
          return matchBusca && matchStatus;
        });

        colunas = [
          { key: 'data', titulo: 'Entrada / Hora', width: '14%', isDate: true },
          { key: 'remetente', titulo: 'Remetente / Interessado', width: '26%' },
          { key: 'assunto', titulo: 'Assunto da Mensagem / Demanda', width: '34%' },
          { key: 'situacao', titulo: 'Situação Executiva', width: '13%' },
          { key: 'dataConclusao', titulo: 'Conclusão & Resp.', width: '13%', isDate: true }
        ];
      }

      /* Ordenação padrão: data mais recente -> mais antiga */
      const colSegre = ordenacaoSegre.col || 'data';
      const dirSegre = ordenacaoSegre.dir || 'desc';
      const colDefSegre = colunas.find(c => c.key === colSegre) || colunas[0];
      ordenarListaPorColuna(registros, {
        dir: dirSegre,
        isDate: !!(colDefSegre && colDefSegre.isDate),
        isNum: !!(colDefSegre && colDefSegre.isNum),
        getter: function(item) {
          if (colSegre === 'data') return parseTimestampDataTabela(item.data, item.hora, item.timestamp);
          if (colSegre === 'dataConclusao') return parseTimestampDataTabela(item.dataConclusao, item.horaConclusao);
          if (colSegre === 'escolas') return item.escolaPretendida || item.escolaAtual || '';
          return item[colSegre] || '';
        },
        tieId: function(item) { return item.id; }
      });

      if (badgeContador) {
        badgeContador.innerText = `Exibindo ${registros.length} registros`;
      }

      /* Monta tabela HTML */
      let htmlTabela = `
        <div style="overflow-x: auto; max-height: 520px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px;">
          <table id="tabela-segre-dados" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left; background: #ffffff;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; position: sticky; top: 0; z-index: 2;">
                ${colunas.map(c => gerarThOrdenavelHtml(c, colSegre, dirSegre, 'alternarOrdenacaoSegre')).join('')}
              </tr>
            </thead>
            <tbody>
      `;

      if (registros.length === 0) {
        htmlTabela += `
          <tr>
            <td colspan="${colunas.length}" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔍</div>
              <div style="font-weight: 700;">Nenhum registro encontrado para os filtros aplicados.</div>
            </td>
          </tr>
        `;
      } else {
        registros.forEach((r, idx) => {
          const bgPar = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          htmlTabela += `<tr style="background: ${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='${bgPar}'">`;
          
          if (abaAtivaSegre === 'sei') {
            const isConcluido = r.situacao.includes('CONCLU') || r.situacao.includes('ENCAMINHADO');
            const corBadge = isConcluido ? '#059669' : '#d97706';
            const bgBadge = isConcluido ? '#d1fae5' : '#fef3c7';

            htmlTabela += `
              <td style="padding: 9px 12px; font-weight: 800; color: #0b2351; font-family: monospace;">${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569; text-align: center;">${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #1e293b;">${r.assunto}</td>
              <td style="padding: 9px 12px; color: #475569;">
                <div><strong>${r.interessado || '—'}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">De: ${r.remetente || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${bgBadge}; color: ${corBadge};">${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: ${r.responsavel}</div>
              </td>
            `;
          } else if (abaAtivaSegre === 'vagas') {
            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569; text-align: center;">
                <div style="font-weight: 700; color: #0f172a;">${r.data || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.meio || 'Presencial'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.aluno}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RA: ${r.ra || 'S/N'}</div>
              </td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0284c7;">${r.serie || '—'}</td>
              <td style="padding: 9px 12px; font-size: 0.76rem;">
                <div style="color: #64748b;">Atual: <strong style="color: #334155;">${r.escolaAtual || '—'}</strong></div>
                <div style="color: #059669; font-weight: 700;">➔ ${r.escolaPretendida || 'Não informada'}</div>
              </td>
              <td style="padding: 9px 12px; font-size: 0.76rem; color: #475569;">
                <div><strong>${r.motivo}</strong></div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.orientacao || '—'}</div>
              </td>
            `;
          } else if (abaAtivaSegre === 'ouvidoria') {
            const isResp = r.situacao.includes('RESPONDID');
            htmlTabela += `
              <td style="padding: 9px 12px; font-weight: 800; color: #7c3aed; font-family: monospace;">${r.protocolo}</td>
              <td style="padding: 9px 12px; color: #475569; text-align: center;">${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 700; color: #0f172a;">${r.interessado || '—'}</td>
              <td style="padding: 9px 12px; color: #334155;">${r.assunto}</td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${isResp ? '#d1fae5' : '#fef3c7'}; color: ${isResp ? '#059669' : '#d97706'};">${r.situacao}</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Resp: ${r.responsavel}</div>
              </td>
            `;
          } else if (abaAtivaSegre === 'concluintes') {
            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569; text-align: center;">${r.data || '—'}</td>
              <td style="padding: 9px 12px; font-weight: 800; color: #0f172a;">${r.aluno}</td>
              <td style="padding: 9px 12px; font-weight: 600; color: #0369a1;">${r.escola}</td>
              <td style="padding: 9px 12px; font-weight: 700; color: #475569;">${r.anoConclusao || '2026'}</td>
              <td style="padding: 9px 12px;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${r.tipoEnsino || 'EM'}</span></td>
            `;
          } else if (abaAtivaSegre === 'emails') {
            const isConcluido = r.situacao.includes('CIENTE') || r.situacao.includes('CONCLU') || r.situacao.includes('RESPONDID') || r.situacao.includes('ENCAMINHADO');
            const corBadge = isConcluido ? '#059669' : '#db2777';
            const bgBadge = isConcluido ? '#d1fae5' : '#fce7f3';

            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569; text-align: center;">
                <div style="font-weight: 700; color: #0f172a;">${r.data || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">${r.hora ? '⏰ ' + r.hora : ''}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.remetente || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Para: ${r.interessado || '—'}</div>
              </td>
              <td style="padding: 9px 12px; color: #1e293b; font-weight: 600;">
                <div style="max-height: 48px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${r.assunto || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${bgBadge}; color: ${corBadge};">${r.situacao || 'REGISTRADO'}</span>
              </td>
              <td style="padding: 9px 12px; font-size: 0.74rem; color: #475569; text-align: center;">
                <div>${r.dataConclusao ? '✔ ' + r.dataConclusao : '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">${r.responsavel ? 'Resp: ' + r.responsavel : ''}</div>
              </td>
            `;
          }

          htmlTabela += `</tr>`;
        });
      }

      htmlTabela += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = htmlTabela;
    }

    function renderizarDashboardSegre() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEGRE.meta || {};
      const kpis = DADOS_SEGRE.kpis || { totalSei: 123, totalVagas: 297, totalOuvidoria: 26, totalConcluintes: 5252, totalEmails: 8921 };

      const html = `
        <div class="segre-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEGRE -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">🏫</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEGRE - Serviço de Gestão da Rede Escolar</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Acompanhamento em tempo real do <strong style="color: #ffffff;">Livro de Entrada 2026</strong>: Processos SEI, Atendimentos de Vagas e Transferências, Ouvidorias Fala.SP e Registros de Concluintes da Unidade Regional de Ensino de Itapevi.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #cbd5e1; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="segre-banner-timestamp" style="color: #ffffff;">${meta.atualizadoFormatado || 'Sem registro'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSegre()" id="btn-segre-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar SEGRE
                </button>
                <a href="${meta.sharepointUrl || URLS_OFICIAIS_SEGRE.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Livro Oficial de Entradas com ${((kpis.totalSei || 0) + (kpis.totalVagas || 0) + (kpis.totalOuvidoria || 0) + (kpis.totalConcluintes || 0) + (kpis.totalEmails || 0)).toLocaleString('pt-BR')} registros consolidados</div>
            </div>
          </div>

          <!-- 5 CARDS KPIS SEGRE -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(195px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <!-- CARD 1: PROCESSOS SEI -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Processos SEI</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    📋
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalSei || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Encaminhados e Análise</span>
                <span style="font-weight: 600; color: #64748b;">Processos SEI</span>
              </div>
            </div>

            <!-- CARD 2: VAGAS & ATENDIMENTOS -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Vagas & Atendimento</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    🎓
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalVagas || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Demandas e Matrícula</span>
                <span style="font-weight: 600; color: #64748b;">Vagas</span>
              </div>
            </div>

            <!-- CARD 3: OUVIDORIA -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Ouvidoria</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a; font-size: 1.1rem;">
                    📣
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalOuvidoria || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #92400e; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Demandas Ouvidoria</span>
                <span style="font-weight: 600; color: #64748b;">Ouvidoria</span>
              </div>
            </div>

            <!-- CARD 4: CONCLUINTES -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Concluintes & Históricos</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    📜
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${kpis.totalConcluintes.toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Registros Históricos</span>
                <span style="font-weight: 600; color: #64748b;">Concluintes</span>
              </div>
            </div>

            <!-- CARD 5: E-MAIL -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">E-mails & Expedientes</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ffedd5; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fed7aa; font-size: 1.1rem;">
                    📬
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #ea580c; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${(kpis.totalEmails || 8921).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #c2410c; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Comunicações e Caixas</span>
                <span style="font-weight: 600; color: #64748b;">E-mails</span>
              </div>
            </div>

          </div>

          <!-- NAVEGAÇÃO DE SUB-ABAS DO SEGRE -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-segre-sei" onclick="mudarAbaSegre('sei')" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📋 Processos SEI
              </button>
              <button id="tab-btn-segre-vagas" onclick="mudarAbaSegre('vagas')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                🎓 Atendimento Vagas
              </button>
              <button id="tab-btn-segre-ouvidoria" onclick="mudarAbaSegre('ouvidoria')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📢 Ouvidoria Fala.SP
              </button>
              <button id="tab-btn-segre-concluintes" onclick="mudarAbaSegre('concluintes')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📜 Concluintes
              </button>
              <button id="tab-btn-segre-emails" onclick="mudarAbaSegre('emails')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📬 E-mails & Demandas
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

          <!-- NOTAS METODOLÓGICAS & CRITÉRIOS DE GESTÃO DA REDE (SEGRE • SEMAT & SEVESC) -->
          <div id="nota-metodologica-segre" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🏫</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEGRE • NOTAS METODOLÓGICAS &amp; COMPETÊNCIAS DA REDE ESCOLAR</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Atribuições oficiais da SEMAT (Matrículas) e SEVESC (Vida Escolar e GDAE)</div>
                </div>
              </div>
              <span style="background: rgba(234,88,12,0.15); color: #fb923c; border: 1px solid rgba(234,88,12,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">${(kpis.totalEmails || 8921).toLocaleString('pt-BR')} E-mails &amp; Demandas Monitoradas</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: SEMAT -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #f97316; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🎓</span> <span>SEMAT • Seção de Matrícula</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Fluxo de Atendimento:</strong> Mediação de vagas, compatibilização regional de matrículas manuais, transferências e processos SEI.<br>
                  • <strong>Equilíbrio Regional:</strong> Prevenção de turmas superlotadas e garantia do direito à vaga pública próxima à residência.
                </div>
              </div>

              <!-- Bloco 2: SEVESC -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📜</span> <span>SEVESC • Seção de Vida Escolar</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Históricos &amp; Prontuários:</strong> Regularização de vida escolar de alunos, certificação de concluintes e publicações no GDAE.<br>
                  • <strong>Processos Especiais:</strong> Equivalência de estudos internacionais e regularização de documentação escolar de escolas ativas e extintas.
                </div>
              </div>

              <!-- Bloco 3: Volume de E-mails -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #a7f3d0; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📬</span> <span>Monitoramento Contínuo de Demandas</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  Acompanhamento de mais de 8.700 comunicações oficiais em tempo real para eliminação de filas e redução de prazos de resposta ao cidadão.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Serviço de Gestão da Rede Escolar (SEGRE)</span>
              <span>Contas Corporativas: itp_semat_educacao_sp_gov_br e itp_sevesc_educacao_sp_gov_br</span>
            </div>
          </div>


        </div>
      `;

      container.innerHTML = html;
      renderizarCorpoTabelaSegre();
    }

    function processarPlanilhaSegreBase64(base64Data, timestamp, jaPurificado) {
      if (typeof XLSX === 'undefined') {
        console.warn('SheetJS (XLSX) não disponível para SEGRE.');
        return;
      }
      if (!jaPurificado && typeof window.purificarXlsxStreamingSeNecessario === 'function') {
        window.purificarXlsxStreamingSeNecessario(base64Data).then(function(cleanB64) {
          processarPlanilhaSegreBase64(cleanB64, timestamp, true);
        });
        return;
      }
      try {
        /* Otimização Seletiva de Abas (Reversível):
           Filtra a leitura do SheetJS exclusivamente para as abas ativas,
           economizando mais de 63 MB de descompressão inútil na memória */
        const readOptions = { type: 'base64', dense: true };
        if (CONFIG_SINCRONIZACAO_SEGRE.modoOtimizado && Array.isArray(CONFIG_SINCRONIZACAO_SEGRE.abasAtivas)) {
          readOptions.sheets = CONFIG_SINCRONIZACAO_SEGRE.abasAtivas;
        }

        const wb = XLSX.read(base64Data, readOptions);
        const wsSei = wb.Sheets['ENTRADA SEI'];
        const wsVagas = wb.Sheets['ATENDIMENTO VAGA'];
        const wsOuv = wb.Sheets['OUVIDORIA'];
        const wsConc = wb.Sheets['CONCLUINTES'];
        const wsEmail = wb.Sheets['E-MAIL'];

        const rawSei = wsSei ? XLSX.utils.sheet_to_json(wsSei, { defval: '' }) : [];
        const rawVagas = wsVagas ? XLSX.utils.sheet_to_json(wsVagas, { defval: '' }) : [];
        const rawOuv = wsOuv ? XLSX.utils.sheet_to_json(wsOuv, { defval: '' }) : [];

        function parseDataXlsxLocal(val) {
          if (!val) return '';
          if (typeof val === 'number' && val >= 40000 && val <= 50000) {
            if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
              const p = XLSX.SSF.parse_date_code(val);
              if (p) return String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
            }
            const d = new Date(Math.round((val - 25569) * 86400 * 1000));
            return String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + d.getUTCFullYear();
          }
          const str = String(val).trim();
          const m = str.match(/(\d{1,2})[/-](\d{1,2})[/-]?(\d{2,4})?/);
          if (m && m[1] && m[2]) {
            let y = m[3] ? parseInt(m[3], 10) : 2026;
            if (y < 100) y += 2000;
            return String(m[1]).padStart(2, '0') + '/' + String(m[2]).padStart(2, '0') + '/' + y;
          }
          return str;
        }

        /* 1. Processos SEI */
        const processosSei = [];
        rawSei.forEach((r, idx) => {
          const prot = String(r['PROTOCOLO'] || '').trim();
          const ass = String(r['ASSUNTO'] || '').trim();
          if (!prot && !ass) return;
          processosSei.push({
            id: 'SEI-' + (idx + 1),
            protocolo: prot || 'S/N',
            data: parseDataXlsxLocal(r['DATA']),
            assunto: ass || 'Processo Administrativo',
            remetente: String(r['REMETENTE'] || '').trim(),
            interessado: String(r['INTERESSADO (A)'] || '').trim(),
            situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
            responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEGRE').trim()
          });
        });

        /* 2. Atendimentos de Vagas */
        const atendimentosVagas = [];
        rawVagas.forEach((r, idx) => {
          const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || r['ALUNO(A)'] || r['NOME DO ALUNO'] || '').trim();
          const escAtual = String(r['ESCOLA ATUAL'] || '').trim();
          const escPret = String(r['ESCOLA PRETENDIDA'] || r['ESCOLA DE INTERESSE'] || '').trim();
          if (!aluno && !escAtual && !escPret) return;
          atendimentosVagas.push({
            id: 'VAGA-' + (idx + 1),
            data: parseDataXlsxLocal(r['Data'] || r['DATA']),
            aluno: aluno || 'Aluno',
            ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
            serie: String(r['SÉRIE '] || r['SÉRIE'] || r['ETAPA/ANO'] || r['ETAPA'] || '').trim(),
            escolaAtual: escAtual || 'Rede / Fora',
            escolaPretendida: escPret || 'Não especificada',
            motivo: String(r['MOTIVO'] || '').trim(),
            orientacao: String(r['ORIENTAÇÃO '] || r['ORIENTAÇÃO'] || '').trim(),
            meio: String(r['MEIO DE ATENDIMENTO'] || 'Presencial').trim(),
            responsavel: String(r['RESPONSÁVEL'] || r['RESPONSÁVEL '] || r['ATENDENTE'] || 'SEGRE').trim()
          });
        });

        /* 3. Ouvidorias */
        const ouvidorias = [];
        rawOuv.forEach((r, idx) => {
          const prot = String(r['PROTOCOLO'] || '').trim();
          const ass = String(r['ASSUNTO'] || '').trim();
          if (!prot && !ass) return;
          ouvidorias.push({
            id: 'OUV-' + (idx + 1),
            protocolo: prot,
            data: parseDataXlsxLocal(r['ENTRADA'] || r['DATA']),
            assunto: ass,
            interessado: String(r['INTERESSADO (A)'] || '').trim(),
            situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
            responsavel: String(r['RESPONSÁVEL '] || 'VAGA / SEGRE').trim()
          });
        });

        /* 3.5 Concluintes (total + 250 mais recentes) */
        const rawConc = wsConc ? XLSX.utils.sheet_to_json(wsConc, { defval: '' }) : [];
        const concluintesRecentes = [];
        if (rawConc.length > 0) {
          const startConc = Math.max(0, rawConc.length - 250);
          for (let i = rawConc.length - 1; i >= startConc; i--) {
            const rc = rawConc[i];
            const alC = String(rc['ALUNO '] || rc['ALUNO'] || '').trim();
            const escC = String(rc['ESCOLA '] || rc['ESCOLA'] || '').trim();
            if (alC || escC) {
              concluintesRecentes.push({
                id: 'CONC-' + (i + 1),
                data: parseDataXlsxLocal(rc['DATA '] || rc['DATA']),
                escola: escC,
                aluno: alC,
                anoConclusao: rc['ANO '] || rc['ANO'] || 2026,
                tipoEnsino: String(rc['TIPO ENSINO'] || 'EM').trim(),
                responsavel: String(rc['RESPONSÁVEL '] || 'SEGRE').trim()
              });
            }
          }
        }

        /* 4. E-mails & Demandas */
        const rawEmail = wsEmail ? XLSX.utils.sheet_to_json(wsEmail, { defval: '' }) : [];
        const emailsLidos = [];
        if (rawEmail.length > 0) {
          function parseHoraLocal(val) {
            if (!val || val === '-') return '';
            if (typeof val === 'number') {
              const totalSec = Math.round(val * 86400);
              const h = Math.floor(totalSec / 3600);
              const min = Math.floor((totalSec % 3600) / 60);
              return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
            }
            return String(val).trim();
          }

          rawEmail.forEach((r, idx) => {
            const assunto = String(r['ASSUNTO'] || '').trim();
            const remetente = String(r['REMETENTE'] || '').trim();
            const interessado = String(r['INTERESSADO (A)'] || '').trim();
            if (!assunto && !remetente && !interessado) return;
            emailsLidos.push({
              id: 'EML-' + (idx + 1),
              data: parseDataXlsxLocal(r['DATA']),
              hora: parseHoraLocal(r['HORA']),
              assunto: assunto || 'E-mail / Demanda',
              remetente: remetente || 'Não informado',
              interessado: interessado || 'SEGRE',
              situacao: String(r['SITUAÇÃO ATUAL'] || 'REGISTRADO').trim().toUpperCase(),
              dataConclusao: parseDataXlsxLocal(r['DATA_1']),
              horaConclusao: parseHoraLocal(r['HORA_1']),
              responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEGRE').trim()
            });
          });
        }

        DADOS_SEGRE.processosSei = processosSei;
        if (atendimentosVagas.length > 0) DADOS_SEGRE.atendimentosVaga = atendimentosVagas;
        if (ouvidorias.length > 0) DADOS_SEGRE.ouvidorias = ouvidorias;
        if (concluintesRecentes.length > 0) DADOS_SEGRE.concluintesRecentes = concluintesRecentes;
        if (emailsLidos.length > 0) DADOS_SEGRE.emails = emailsLidos;

        DADOS_SEGRE.kpis = DADOS_SEGRE.kpis || {};
        DADOS_SEGRE.kpis.totalSei = processosSei.length;
        if (atendimentosVagas.length > 0) DADOS_SEGRE.kpis.totalVagas = atendimentosVagas.length;
        if (ouvidorias.length > 0) DADOS_SEGRE.kpis.totalOuvidoria = ouvidorias.length;
        if (rawConc.length > 0) DADOS_SEGRE.kpis.totalConcluintes = rawConc.length;
        if (emailsLidos.length > 0) DADOS_SEGRE.kpis.totalEmails = emailsLidos.length;

        if (DADOS_SEGRE.meta) {
          DADOS_SEGRE.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          DADOS_SEGRE.meta.origemSync = 'SharePoint Ao Vivo (Download Direto)';
        }

        renderizarDashboardSegre();
        if (typeof window.gravarEstadoNuvem === 'function') {
          window.gravarEstadoNuvem('SEGRE_DATA', {
            meta: DADOS_SEGRE.meta,
            kpis: DADOS_SEGRE.kpis,
            processosSei: (DADOS_SEGRE.processosSei || []).slice(0, 300),
            atendimentosVaga: DADOS_SEGRE.atendimentosVaga,
            ouvidorias: DADOS_SEGRE.ouvidorias,
            concluintesRecentes: DADOS_SEGRE.concluintesRecentes
          });
        }

        if (!window.__segreSyncSilencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEGRE AO VIVO • SHAREPOINT',
            titulo: 'Planilha SEGRE Atualizada em Tempo Real!',
            mensagem: '<strong>' + processosSei.length.toLocaleString('pt-BR') + ' processos SEI</strong>, <strong>' + DADOS_SEGRE.kpis.totalVagas + ' atendimentos de vagas</strong>, <strong>' + (DADOS_SEGRE.kpis.totalOuvidoria || 0) + ' ouvidorias</strong> e <strong>' + (DADOS_SEGRE.kpis.totalEmails || 0).toLocaleString('pt-BR') + ' e-mails</strong> baixados diretamente do SharePoint agora.',
            detalhes: 'SharePoint Ao Vivo às ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            duracao: 4500
          });
        }
      } catch (errXlsx) {
        console.error('Erro ao ler base64 SEGRE com SheetJS:', errXlsx);
      }
    }

    function sincronizarDashboardSegre(silencioso) {
      const isSil = (silencioso === true);
      window.__segreSyncSilencioso = isSil;
      if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEGRE • SHAREPOINT AO VIVO',
          titulo: 'Sincronizando Base do SEGRE...',
          mensagem: 'Conectando ao SharePoint em tempo real para baixar a planilha oficial...',
          detalhes: 'Conexão Direta Ao Vivo • Sem Login',
          duracao: 0
        });
      }

      function aplicarDadosSegre(novos, falhaRede) {
        if (!falhaRede && novos && (novos.kpis || novos.processosSei)) {
          DADOS_SEGRE = novos;
          if (DADOS_SEGRE.meta) {
            DADOS_SEGRE.meta.origemSync = novos.origem || 'Espelho Automático Nuvem (GitHub)';
          }
          if (typeof window.gravarEstadoNuvem === 'function') {
            window.gravarEstadoNuvem('SEGRE_DATA', {
              meta: DADOS_SEGRE.meta,
              kpis: DADOS_SEGRE.kpis,
              processosSei: (DADOS_SEGRE.processosSei || []).slice(0, 300),
              atendimentosVaga: DADOS_SEGRE.atendimentosVaga,
              ouvidorias: DADOS_SEGRE.ouvidorias,
              concluintesRecentes: DADOS_SEGRE.concluintesRecentes
            });
          }
        }
        const tsReal = (DADOS_SEGRE.meta && DADOS_SEGRE.meta.atualizadoFormatado) ? DADOS_SEGRE.meta.atualizadoFormatado : 'Data não informada';
        renderizarDashboardSegre();

        if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
          if (falhaRede) {
            mostrarAlertaSincronizacao({
              tipo: 'warning',
              tag: 'SEGRE • SEM CONEXÃO',
              titulo: 'Não foi possível buscar nova coleta agora',
              mensagem: 'Mantendo os últimos dados carregados (coleta de <strong>' + tsReal + '</strong>).',
              detalhes: 'Tente novamente em instantes',
              duracao: 5000
            });
          } else {
            mostrarAlertaSincronizacao({
              tipo: 'success',
              tag: 'SEGRE • ESPELHO NUVEM',
              titulo: 'Dados do SEGRE Carregados',
              mensagem: '<strong>' + (DADOS_SEGRE.kpis ? DADOS_SEGRE.kpis.totalSei : 0) + ' processos SEI</strong>, <strong>' + (DADOS_SEGRE.kpis ? DADOS_SEGRE.kpis.totalVagas : 0) + ' vagas</strong>, <strong>' + (DADOS_SEGRE.kpis ? DADOS_SEGRE.kpis.totalOuvidoria : 0) + ' ouvidorias</strong> e <strong>' + (DADOS_SEGRE.kpis ? DADOS_SEGRE.kpis.totalEmails : 0).toLocaleString('pt-BR') + ' e-mails</strong>.',
              detalhes: 'Coleta oficial SharePoint registrada em: ' + tsReal,
              duracao: 5000
            });
          }
        }
      }

      function buscarMirrorSegre() {
        fetch(URLS_OFICIAIS_SEGRE.mirrorData + '?t=' + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(json) {
            if (json && (json.kpis || json.processosSei)) {
              aplicarDadosSegre(json, false);
            } else {
              aplicarDadosSegre(null, true);
            }
          })
          .catch(function(err) {
            console.warn('Fallback local para SEGRE:', err);
            aplicarDadosSegre(null, true);
          });
      }

      const ehOtimSegre = (typeof CONFIG_SINCRONIZACAO_SEGRE !== 'undefined') ? CONFIG_SINCRONIZACAO_SEGRE.modoOtimizado : true;
      consultarSharepointGasLive({
        action: 'sincronizarSegre',
        fnGas: 'sincronizarPlanilhaSegre',
        argsGas: [!ehOtimSegre],
        urlExtraParams: (ehOtimSegre ? '' : '&bruto=true')
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64 && typeof processarPlanilhaSegreBase64 === 'function') {
          processarPlanilhaSegreBase64(res.dadosBase64, res.timestamp);
        } else if (res && (res.kpis || res.processosSei)) {
          aplicarDadosSegre(res, false);
        } else {
          buscarMirrorSegre();
        }
      }).catch(function() {
        buscarMirrorSegre();
      });
    }
