    /* ========================================================================= */
    /* PAINEL DE INTELIGÊNCIA FINANCEIRA E ORÇAMENTÁRIA (SEFIN / SEAFIN) */
    /* Filtros e Métricas Avançadas de Econometria, Finanças e Ciência de Dados */
    /* ========================================================================= */

    let DADOS_FINANCEIROS_SEFIN = {"meta":{"exercicioPadrao":2026,"ultimaAtualizacao":"11\/11\/2026 17:35","fonteOficial":"Planilha Oficial SharePoint \/ SEAFIN \/ SEFIN","nomeArquivo":"Controle prestação de contas U.E..xlsx","pastaSharePoint":"Business Intelligence\/Prestação de Contas U.E\/","contaResponsavel":"itp_sefin_educacao_sp_gov_br","totalRegistros":0},"kpisPorAno":{"2019":{"ano":2019,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2019","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2020":{"ano":2020,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2020","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2021":{"ano":2021,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2021","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2022":{"ano":2022,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2022","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2023":{"ano":2023,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2023","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2024":{"ano":2024,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2024","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2025":{"ano":2025,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2025","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"2026":{"ano":2026,"totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"2026","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0},"todos":{"ano":"todos","totalReceita":0,"recCusteio":0,"recCapital":0,"totalDespesa":0,"despCusteio":0,"despCapital":0,"totalSaldo":0,"saldoCusteio":0,"saldoCapital":0,"totalRepasses":0,"aprovadas":0,"ressalvas":0,"emAndamento":0,"outros":0,"programas":{},"legenda":"Todos os Exercícios","totalEscolas":0,"taxaExecucao":0,"taxaAprovacao":0}},"repassesCompactos":[]};

    

    let filtrosSefinAvancados = {
      ano: '2026',
      programa: 'todos',
      origem: 'todos',
      statusSed: 'todos',
      termoBusca: '',
      subAba: 'repasses',
      limiteLinhas: 100,
      ordenarPor: 'ano',
      ordenarDirecao: 'desc'
    };

    function descompactarRepasseSefin(r) {
      return {
        ano: r[0],
        programa: r[1],
        escola: r[2],
        cie: r[3],
        recTotal: r[4],
        despTotal: r[5],
        saldoTotal: r[6],
        statusSed: r[7],
        origem: r[8],
        recC: r[9],
        recK: r[10],
        despC: r[11],
        despK: r[12],
        saldoC: r[13],
        saldoK: r[14]
      };
    }

    function formatarMoedaBrl(valor) {
      if (typeof valor !== 'number' || isNaN(valor)) valor = 0;
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarMoedaAbreviada(val) {
      if (typeof val !== 'number' || isNaN(val)) val = 0;
      if (Math.abs(val) >= 1000000) {
        return 'R$ ' + (val / 1000000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'M';
      }
      if (Math.abs(val) >= 1000) {
        return 'R$ ' + (val / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + 'k';
      }
      return formatarMoedaBrl(val);
    }

    function formatarPct(valor) {
      if (typeof valor !== 'number' || isNaN(valor)) valor = 0;
      return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
    }

    function alterarExercicioSefin(novoAno) {
      filtrosSefinAvancados.ano = novoAno;
      filtrosSefinAvancados.programa = 'todos';
      filtrosSefinAvancados.origem = 'todos';
      filtrosSefinAvancados.statusSed = 'todos';
      filtrosSefinAvancados.termoBusca = '';
      filtrosSefinAvancados.limiteLinhas = 100;
      filtrosSefinAvancados.ordenarPor = 'ano';
      filtrosSefinAvancados.ordenarDirecao = 'desc';
      renderizarDashboardFinanceiroSefin();
      
    }

    function alternarSubAbaSefin(subAba) {
      filtrosSefinAvancados.subAba = subAba;
      ['repasses', 'programas', 'regularidade'].forEach(aba => {
        const btn = document.getElementById('btn-subaba-sefin-' + aba);
        const cont = document.getElementById('conteudo-subaba-sefin-' + aba);
        if (btn) {
          btn.removeAttribute('style');
          if (aba === subAba) {
            btn.classList.add('ativo');
          } else {
            btn.classList.remove('ativo');
          }
        }
        if (cont) {
          cont.style.display = (aba === subAba) ? 'block' : 'none';
        }
      });
    }

    function alternarRecolherNotasSefin() {
      const conteudo = document.getElementById('sefin-notas-conteudo-expansivel');
      const seta = document.getElementById('sefin-notas-seta-indicadora');
      const status = document.getElementById('sefin-notas-toggle-status');
      if (!conteudo) return;
      const estaOculto = window.getComputedStyle(conteudo).display === 'none';
      if (estaOculto) {
        conteudo.style.display = 'block';
        if (seta) seta.style.transform = 'rotate(180deg)';
        if (status) status.textContent = 'Clique para recolher notas explicativas';
      } else {
        conteudo.style.display = 'none';
        if (seta) seta.style.transform = 'rotate(0deg)';
        if (status) status.textContent = 'Clique para expandir notas e dicionário da planilha';
      }
    }

    function obterRepassesFiltradosSefin() {
      const anoAtivo = filtrosSefinAvancados.ano || '2026';
      const termo = (filtrosSefinAvancados.termoBusca || '').trim().toLowerCase();
      const prog = filtrosSefinAvancados.programa;
      const orig = filtrosSefinAvancados.origem;
      const status = filtrosSefinAvancados.statusSed;

      const filtrados = DADOS_FINANCEIROS_SEFIN.repassesCompactos
        .map(descompactarRepasseSefin)
        .filter(r => {
          if (anoAtivo !== 'todos' && String(r.ano) !== String(anoAtivo)) return false;
          if (prog !== 'todos' && r.programa !== prog) return false;
          if (orig !== 'todos' && r.origem !== orig) return false;
          if (status !== 'todos' && r.statusSed !== status) return false;
          if (termo) {
            const escolaNorm = (r.escola || '').toLowerCase();
            const cieNorm = String(r.cie || '').toLowerCase();
            const progNorm = (r.programa || '').toLowerCase();
            if (!escolaNorm.includes(termo) && !cieNorm.includes(termo) && !progNorm.includes(termo)) {
              return false;
            }
          }
          return true;
        });

      const col = filtrosSefinAvancados.ordenarPor || 'ano';
      const dir = filtrosSefinAvancados.ordenarDirecao || 'desc';

      filtrados.sort((a, b) => {
        if (col === 'ano') {
          if (a.ano !== b.ano) {
            return (dir === 'desc') ? (b.ano - a.ano) : (a.ano - b.ano);
          }
          return b.recTotal - a.recTotal;
        }
        if (col === 'recTotal') {
          if (a.recTotal !== b.recTotal) {
            return (dir === 'desc') ? (b.recTotal - a.recTotal) : (a.recTotal - b.recTotal);
          }
          return b.ano - a.ano;
        }
        if (col === 'despTotal') {
          if (a.despTotal !== b.despTotal) {
            return (dir === 'desc') ? (b.despTotal - a.despTotal) : (a.despTotal - b.despTotal);
          }
          return b.ano - a.ano;
        }
        if (col === 'saldoTotal') {
          if (a.saldoTotal !== b.saldoTotal) {
            return (dir === 'desc') ? (b.saldoTotal - a.saldoTotal) : (a.saldoTotal - b.saldoTotal);
          }
          return b.ano - a.ano;
        }
        if (col === 'escola') {
          const cmp = (a.escola || '').localeCompare(b.escola || '', 'pt-BR');
          if (cmp !== 0) return (dir === 'desc') ? -cmp : cmp;
          return b.ano - a.ano;
        }
        if (col === 'programa') {
          const cmp = (a.programa || '').localeCompare(b.programa || '', 'pt-BR');
          if (cmp !== 0) return (dir === 'desc') ? -cmp : cmp;
          return b.recTotal - a.recTotal;
        }
        if (col === 'statusSed') {
          const cmp = (a.statusSed || '').localeCompare(b.statusSed || '', 'pt-BR');
          if (cmp !== 0) return (dir === 'desc') ? -cmp : cmp;
          return b.ano - a.ano;
        }
        return 0;
      });

      return filtrados;
    }

    function alternarOrdenacaoTabelaSefin(coluna) {
      if (filtrosSefinAvancados.ordenarPor === coluna) {
        filtrosSefinAvancados.ordenarDirecao = (filtrosSefinAvancados.ordenarDirecao === 'desc') ? 'asc' : 'desc';
      } else {
        filtrosSefinAvancados.ordenarPor = coluna;
        if (coluna === 'escola' || coluna === 'programa' || coluna === 'statusSed') {
          filtrosSefinAvancados.ordenarDirecao = 'asc';
        } else {
          filtrosSefinAvancados.ordenarDirecao = 'desc';
        }
      }
      filtrosSefinAvancados.limiteLinhas = 100;
      aplicarFiltrosEAtualizarTabela();

      
    }

    function gerarIndicadorOrdenacaoSefin(coluna) {
      const ativa = (filtrosSefinAvancados.ordenarPor || 'ano') === coluna;
      const dir = filtrosSefinAvancados.ordenarDirecao || 'desc';
      if (ativa) {
        const seta = (dir === 'desc') ? '▼' : '▲';
        return '<span class="sort-arrow" style="color: #38bdf8; font-weight: 900; margin-left: 5px; font-size: 0.82rem; line-height: 1;">' + seta + '</span>';
      }
      return '<span class="sort-arrow" style="color: #94a3b8; font-size: 0.82rem; margin-left: 5px; line-height: 1;">↕</span>';
    }

    function atualizarFiltroAvancadoSefin(campo, valor) {
      filtrosSefinAvancados[campo] = valor;
      filtrosSefinAvancados.limiteLinhas = 100;
      aplicarFiltrosEAtualizarTabela();
    }

    function limparTodosFiltrosSefin() {
      filtrosSefinAvancados.programa = 'todos';
      filtrosSefinAvancados.origem = 'todos';
      filtrosSefinAvancados.statusSed = 'todos';
      filtrosSefinAvancados.termoBusca = '';
      filtrosSefinAvancados.limiteLinhas = 100;

      const selP = document.getElementById('sefin-filtro-programa');
      if (selP) selP.value = 'todos';
      const selO = document.getElementById('sefin-filtro-origem');
      if (selO) selO.value = 'todos';
      const selS = document.getElementById('sefin-filtro-status');
      if (selS) selS.value = 'todos';
      const inpB = document.getElementById('sefin-busca-escola');
      if (inpB) inpB.value = '';

      aplicarFiltrosEAtualizarTabela();
      
    }

    function carregarMaisLinhasSefin() {
      filtrosSefinAvancados.limiteLinhas = (filtrosSefinAvancados.limiteLinhas || 100) + 100;
      aplicarFiltrosEAtualizarTabela();
    }

    function aplicarFiltrosEAtualizarTabela() {
      const containerTabela = document.getElementById('sefin-tabela-container');
      const contador = document.getElementById('sefin-contador-linhas');
      if (!containerTabela) return;

      const lista = obterRepassesFiltradosSefin();
      if (contador) {
        let descOrd = '';
        if (filtrosSefinAvancados.ordenarPor === 'ano') {
          descOrd = (filtrosSefinAvancados.ordenarDirecao === 'desc') ? ' (Ano mais recente primeiro: 2026 → 2019)' : ' (Ano mais antigo primeiro: 2019 → 2026)';
        } else if (filtrosSefinAvancados.ordenarPor === 'recTotal') {
          descOrd = (filtrosSefinAvancados.ordenarDirecao === 'desc') ? ' (Maior receita primeiro)' : ' (Menor receita primeiro)';
        } else if (filtrosSefinAvancados.ordenarPor === 'escola') {
          descOrd = (filtrosSefinAvancados.ordenarDirecao === 'desc') ? ' (Escola Z → A)' : ' (Escola A → Z)';
        }
        contador.textContent = 'Exibindo ' + Math.min(lista.length, filtrosSefinAvancados.limiteLinhas) + ' de ' + lista.length + ' repasses encontrados' + descOrd;
      }
      containerTabela.innerHTML = renderizarTabelaRepassesHtml(lista);
    }

    function renderizarTabelaRepassesHtml(lista) {
      if (!lista || lista.length === 0) {
        return '<div style="text-align: center; padding: 2.5rem; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; color: #475569;"><p style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">🔍 Nenhum repasse escolar encontrado com os filtros selecionados.</p><button onclick="limparTodosFiltrosSefin()" style="background: #0284c7; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 800;">Limpar Filtros</button></div>';
      }

      const limite = filtrosSefinAvancados.limiteLinhas || 100;
      const exibidos = lista.slice(0, limite);

      let html = '<div style="overflow-x: auto; max-width: 100%; border-radius: 10px; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.06); background: #ffffff;">';
      html += '<table id="tabela-repasses-sefin" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left;">';
      html += '<thead style="background: #0f172a; color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 0.74rem; letter-spacing: 0.05em; position: sticky; top: 0; z-index: 10;">';
      html += '<tr>';
      
      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'ano\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; width: 85px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Ano">';
      html += '<div style="display: inline-flex; align-items: center; gap: 0.25rem;"><span>Ano</span>' + gerarIndicadorOrdenacaoSefin('ano') + '</div></th>';

      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'escola\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; min-width: 260px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Unidade Escolar">';
      html += '<div style="display: inline-flex; align-items: center; gap: 0.25rem;"><span>Unidade Escolar & CIE</span>' + gerarIndicadorOrdenacaoSefin('escola') + '</div></th>';

      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'programa\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; min-width: 220px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Programa">';
      html += '<div style="display: inline-flex; align-items: center; gap: 0.25rem;"><span>Programa / Objeto</span>' + gerarIndicadorOrdenacaoSefin('programa') + '</div></th>';

      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'recTotal\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 165px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Receita Total">';
      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Receita Total (Custeio + Capital)</span>' + gerarIndicadorOrdenacaoSefin('recTotal') + '</div></th>';

      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'despTotal\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 165px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Despesa">';
      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Despesa Executada (Custeio + Capital)</span>' + gerarIndicadorOrdenacaoSefin('despTotal') + '</div></th>';

      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'saldoTotal\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 155px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Saldo em Conta">';
      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Saldo Remanescente (Contas APM)</span>' + gerarIndicadorOrdenacaoSefin('saldoTotal') + '</div></th>';

      html += '<th data-no-sort="true" class="no-sort" onclick="alternarOrdenacaoTabelaSefin(\'statusSed\')" style="padding: 12px 14px; border-bottom: 2px solid #0284c7; text-align: center; min-width: 130px; cursor: pointer; user-select: none; transition: background 0.15s;" onmouseover="this.style.background=\'#1e293b\'" onmouseout="this.style.background=\'#0f172a\'" title="Classificar por Situação SED">';
      html += '<div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; width: 100%;"><span>Status SED</span>' + gerarIndicadorOrdenacaoSefin('statusSed') + '</div></th>';
      
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>';

      exibidos.forEach((r, idx) => {
        const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        const st = (r.statusSed || '').toUpperCase();
        let badgeBg = '#f1f5f9';
        let badgeColor = '#1e293b';
        let badgeBorder = '#94a3b8';

        if (st.includes('APROVADA COM RESSALVA')) {
          badgeBg = '#fef3c7';
          badgeColor = '#92400e';
          badgeBorder = '#f59e0b';
        } else if (st.includes('APROVADA')) {
          badgeBg = '#d1fae5';
          badgeColor = '#065f46';
          badgeBorder = '#10b981';
        } else if (st.includes('ANDAMENTO')) {
          badgeBg = '#e0f2fe';
          badgeColor = '#075985';
          badgeBorder = '#0284c7';
        } else if (st.includes('OMISSÃO') || st.includes('REPROVADA')) {
          badgeBg = '#fee2e2';
          badgeColor = '#991b1b';
          badgeBorder = '#ef4444';
        }

        const tagOrigem = r.origem === 'Paulista' 
          ? '<span style="background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; font-size: 0.68rem; padding: 2px 7px; border-radius: 4px; font-weight: 800; margin-left: 5px;">Paulista</span>' 
          : '<span style="background: #e0f2fe; color: #0369a1; border: 1.5px solid #0284c7; font-size: 0.68rem; padding: 2px 7px; border-radius: 4px; font-weight: 800; margin-left: 5px;">Federal</span>';

        html += '<tr style="background: ' + bg + '; border-bottom: 1px solid #e2e8f0; transition: background 0.15s;" onmouseover="this.style.background=\'#f0f9ff\'" onmouseout="this.style.background=\'' + bg + '\'">';
        html += '<td style="padding: 10px 14px; font-weight: 800; color: #0f172a; font-size: 0.88rem; text-align: center;">' + r.ano + '</td>';
        html += '<td style="padding: 10px 14px; text-align: left;"><div style="font-weight: 800; color: #0f172a; font-size: 0.88rem; line-height: 1.35;">' + r.escola + '</div><div style="font-size: 0.74rem; font-weight: 700; color: #0284c7; margin-top: 3px;">CIE: ' + r.cie + '</div></td>';
        html += '<td style="padding: 10px 14px; text-align: center;"><div style="color: #0f172a; font-weight: 700; font-size: 0.82rem; line-height: 1.3; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">' + r.programa + ' ' + tagOrigem + '</div></td>';
        html += '<td style="padding: 8px 14px; text-align: center; vertical-align: middle;"><div style="font-weight: 800; color: #0369a1; font-size: 0.92rem; line-height: 1.25; margin-bottom: 3px;">' + formatarMoedaBrl(r.recTotal) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Custeio: Materiais de consumo e pequenos reparos"><span style="color: #64748b; font-weight: 600;">Custeio (C):</span> ' + formatarMoedaBrl(r.recC) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Capital: Bens permanentes e equipamentos patrimoniais"><span style="color: #64748b; font-weight: 600;">Capital (K):</span> ' + formatarMoedaBrl(r.recK) + '</div></td>';
        html += '<td style="padding: 8px 14px; text-align: center; vertical-align: middle;"><div style="font-weight: 800; color: #047857; font-size: 0.92rem; line-height: 1.25; margin-bottom: 3px;">' + formatarMoedaBrl(r.despTotal) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Custeio: Gastos executados em consumo/serviços"><span style="color: #64748b; font-weight: 600;">Custeio (C):</span> ' + formatarMoedaBrl(r.despC) + '</div><div style="font-size: 0.72rem; color: #334155; font-weight: 700; line-height: 1.35; white-space: nowrap;" title="Capital: Gastos executados em equipamentos permanentes"><span style="color: #64748b; font-weight: 600;">Capital (K):</span> ' + formatarMoedaBrl(r.despK) + '</div></td>';
        html += '<td style="padding: 10px 14px; text-align: center;"><div style="font-weight: 800; color: #b45309; font-size: 0.92rem;">' + formatarMoedaBrl(r.saldoTotal) + '</div></td>';
        html += '<td style="padding: 10px 14px; text-align: center;"><span style="display: inline-block; background: ' + badgeBg + '; color: ' + badgeColor + '; border: 1.5px solid ' + badgeBorder + '; padding: 4px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 800; white-space: nowrap;">' + (r.statusSed || 'Não Iniciado') + '</span></td>';
        html += '</tr>';
      });

      html += '</tbody>';
      html += '</table>';
      html += '</div>';

      if (lista.length > limite) {
        html += '<div style="text-align: center; margin-top: 1.25rem;">';
        html += '<button onclick="carregarMaisLinhasSefin()" style="background: #ffffff; border: 2px solid #0284c7; color: #0284c7; font-weight: 800; font-size: 0.86rem; padding: 10px 26px; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(2,132,199,0.15); transition: all 0.2s;" onmouseover="this.style.background=\'#0284c7\'; this.style.color=\'#ffffff\';" onmouseout="this.style.background=\'#ffffff\'; this.style.color=\'#0284c7\';">Carregar Mais 100 Registros ↓</button>';
        html += '</div>';
      }

      return html;
    }

    function exportarBalanceteSefinXlsx() {
      const lista = obterRepassesFiltradosSefin();
      if (!lista || lista.length === 0) {
        if (typeof mostrarToastAgenda === 'function') mostrarToastAgenda('Nenhum registro para exportar!', '⚠️');
        return;
      }

      const dadosPlanilha = lista.map(r => ({
        'Exercício': r.ano,
        'Unidade Escolar': r.escola,
        'Código CIE': r.cie,
        'Programa / Objeto': r.programa,
        'Origem': r.origem,
        'Receita Custeio (R$)': r.recC,
        'Receita Capital (R$)': r.recK,
        'Receita Total (R$)': r.recTotal,
        'Despesa Custeio (R$)': r.despC,
        'Despesa Capital (R$)': r.despK,
        'Despesa Total (R$)': r.despTotal,
        'Saldo em Conta (R$)': r.saldoTotal,
        'Status SED': r.statusSed
      }));

      const anoAtivo = filtrosSefinAvancados.ano || '2026';
      const nomeArquivo = 'Prestacao_Contas_SEFIN_' + anoAtivo + '.xlsx';

      if (window.XLSX && XLSX.utils) {
        const ws = XLSX.utils.json_to_sheet(dadosPlanilha);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Prestação de Contas");
        XLSX.writeFile(wb, nomeArquivo);
        if (typeof mostrarToastAgenda === 'function') {
          mostrarToastAgenda('Planilha Excel exportada com sucesso!', '📊');
        }
      } else {
        /* Fallback CSV */
        exportarBalanceteSefinCsv();
      }
    }

    function exportarBalanceteSefinCsv() {
      const lista = obterRepassesFiltradosSefin();
      if (!lista || lista.length === 0) return;

      let csv = '\uFEFF';
      csv += 'Exercício;Escola;CIE;Programa;Origem;Receita_Custeio;Receita_Capital;Receita_Total;Despesa_Custeio;Despesa_Capital;Despesa_Total;Saldo_Total;Status_SED\r\n';

      lista.forEach(r => {
        csv += [
          r.ano,
          '"' + (r.escola || '').replace(/"/g, '""') + '"',
          r.cie,
          '"' + (r.programa || '').replace(/"/g, '""') + '"',
          r.origem,
          r.recC.toFixed(2),
          r.recK.toFixed(2),
          r.recTotal.toFixed(2),
          r.despC.toFixed(2),
          r.despK.toFixed(2),
          r.despTotal.toFixed(2),
          r.saldoTotal.toFixed(2),
          '"' + (r.statusSed || '').replace(/"/g, '""') + '"'
        ].join(';') + '\r\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const anoAtivo = filtrosSefinAvancados.ano || '2026';
      link.setAttribute('href', url);
      link.setAttribute('download', 'Prestacao_Contas_SEFIN_' + anoAtivo + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /* ========================================================================= */
    /* MOTOR UNIVERSAL DE CONSULTA AO VIVO SHAREPOINT -> GAS (TIER 1 + JSONP)   */
    /* Usado por TODOS os setores presentes e futuros ao acionar "Sincronizar"  */
    /* ========================================================================= */
    function consultarSharepointGasLive(opts) {
      var o = opts || {};
      var bootTrackId = (window.__bootSyncTracker && window.__bootSyncTracker.ativo)
        ? ('gas_' + String(o.action || o.fnGas || 'req') + '_' + Math.floor(Math.random() * 100000))
        : null;
      if (bootTrackId && typeof window.registrarTarefaBootSync === 'function') {
        window.registrarTarefaBootSync(bootTrackId, String(o.action || o.fnGas || 'Base'));
      }
      var finalizarTrackBoot = function() {
        if (bootTrackId && typeof window.concluirTarefaBootSync === 'function') {
          setTimeout(function() { window.concluirTarefaBootSync(bootTrackId); }, 180);
        }
      };
      return new Promise(function(resolve, reject) {
        var timeoutMs = o.timeoutMs || 35000;
        var fnGas = o.fnGas;
        var argsGas = Array.isArray(o.argsGas) ? o.argsGas : [];
        var extra = o.urlExtraParams || '';
        if (window.__syncSilenciosoAtivo === true && extra.indexOf('cache=') === -1 && extra.indexOf('bruto=true') === -1) {
          extra += '&cache=1';
        }
        var resolveTracked = function(res) { resolve(res); finalizarTrackBoot(); };
        var rejectTracked = function(err) { reject(err); finalizarTrackBoot(); };

        function rodarTier2Jsonp() {
          try {
            var cbId = '__cb_live_' + String(o.action || 'gas').replace(/[^a-zA-Z0-9]/g, '') + '_' + Math.floor(Math.random() * 10000000);
            var timerId = null;
            window[cbId] = function(res) {
              if (timerId) clearTimeout(timerId);
              delete window[cbId];
              var el = document.getElementById(cbId);
              if (el && el.parentNode) el.parentNode.removeChild(el);
              resolveTracked(res);
            };
            var sc = document.createElement('script');
            sc.id = cbId;
            sc.src = 'https:' + String.fromCharCode(47, 47) + 'script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec?action=' + encodeURIComponent(o.action || 'ping') + extra + '&callback=' + cbId + '&_t=' + Date.now();
            sc.onerror = function() {
              if (timerId) clearTimeout(timerId);
              delete window[cbId];
              if (sc.parentNode) sc.parentNode.removeChild(sc);
              rejectTracked(new Error('Falha de rede/JSONP ao consultar ' + (o.action || 'GAS')));
            };
            timerId = setTimeout(function() {
              if (window[cbId]) {
                delete window[cbId];
                if (sc.parentNode) sc.parentNode.removeChild(sc);
                rejectTracked(new Error('Timeout ao consultar fonte ao vivo (' + (o.action || 'GAS') + ')'));
              }
            }, timeoutMs);
            document.head.appendChild(sc);
          } catch (eJsonp) {
            rejectTracked(eJsonp);
          }
        }

        if (typeof google !== 'undefined' && google.script && google.script.run && fnGas && typeof google.script.run[fnGas] === 'function') {
          try {
            var runner = google.script.run
              .withSuccessHandler(function(res) { resolveTracked(res); })
              .withFailureHandler(function() { rodarTier2Jsonp(); });
            runner[fnGas].apply(runner, argsGas);
            return;
          } catch (eTier1) {}
        }
        rodarTier2Jsonp();
      });
    }
    window.consultarSharepointGasLive = consultarSharepointGasLive;

    function processarPlanilhaSefinBase64(b64, timestampStr) {
      if (!b64 || typeof XLSX === 'undefined') return false;
      var wb = XLSX.read(b64, { type: 'base64' });
      var sheetName = wb.SheetNames.find(function(n) { return n.toLowerCase().indexOf('presta') >= 0; }) || wb.SheetNames[0];
      var ws = wb.Sheets[sheetName];
      if (!ws) return false;
      var rows = XLSX.utils.sheet_to_json(ws, { defval: 0 });
      if (!Array.isArray(rows) || rows.length === 0) return false;

      var num = function(v) {
        if (typeof v === 'number') return isNaN(v) ? 0 : v;
        var n = parseFloat(String(v || '0').replace(/[R$\s.]/g, '').replace(',', '.'));
        return isNaN(n) ? 0 : n;
      };

      var compactos = [];
      var kpisPorAno = {};
      var escolasSetPorAno = {};

      function getBucket(key, anoVal, legenda) {
        if (!kpisPorAno[key]) {
          escolasSetPorAno[key] = {};
          kpisPorAno[key] = {
            ano: anoVal,
            totalReceita: 0, recCusteio: 0, recCapital: 0,
            totalDespesa: 0, despCusteio: 0, despCapital: 0,
            totalSaldo: 0, saldoCusteio: 0, saldoCapital: 0,
            totalRepasses: 0, aprovadas: 0, ressalvas: 0, emAndamento: 0, outros: 0,
            programas: {}, legenda: legenda, totalEscolas: 0, taxaExecucao: 0, taxaAprovacao: 0
          };
        }
        return kpisPorAno[key];
      }

      rows.forEach(function(rOrig) {
        var r = {};
        if (rOrig && typeof rOrig === 'object') {
          Object.keys(rOrig).forEach(function(colKey) {
            r[String(colKey).trim()] = rOrig[colKey];
          });
        }
        var ano = parseInt(r['Exercício'] || r['Exercicio'] || 0, 10);
        var escola = String(r['Escola'] || '').trim();
        if (!ano || !escola) return;
        var prog = String(r['Objeto Repasse'] || '').trim() || 'OUTROS';
        var cie = String(r['Cód CIE'] || r['Cod CIE'] || '').replace(/\D/g, '');
        var recC = num(r['Total Receita(C)']);
        var recK = num(r['Total Receita(K)']);
        var recT = recC + recK;
        var despC = num(r['Despesa(C)']);
        var despK = num(r['Despesa(K)']);
        var despT = despC + despK;
        var salC = num(r['Saldo a Reprogramar(C)']);
        var salK = num(r['Saldo a Reprogramar(K)']);
        var salT = salC + salK;
        var stSed = String(r['Status SED'] || '').trim() || 'OUTROS';
        var orig = String(r['Paulista/Federal'] || '').trim() || 'Federal';

        compactos.push([ano, prog, escola, cie, recT, despT, salT, stSed, orig, recC, recK, despC, despK, salC, salK]);

        var stUp = stSed.toUpperCase();
        var keys = [String(ano), 'todos'];
        keys.forEach(function(k) {
          var leg = k === 'todos'
            ? '🌐 Série Histórica Completa Consolidada'
            : (k === '2026' ? '🏛️ Exercício Vigente 2026 (Em Execução na SED)' : ('📊 Exercício ' + k));
          var b = getBucket(k, k === 'todos' ? 'todos' : ano, leg);
          b.totalReceita += recT; b.recCusteio += recC; b.recCapital += recK;
          b.totalDespesa += despT; b.despCusteio += despC; b.despCapital += despK;
          b.totalSaldo += salT; b.saldoCusteio += salC; b.saldoCapital += salK;
          b.totalRepasses++;
          if (stUp.indexOf('RESSALVA') >= 0) b.ressalvas++;
          else if (stUp.indexOf('APROVAD') >= 0) b.aprovadas++;
          else if (stUp.indexOf('ANDAMENTO') >= 0 || stUp.indexOf('REVIS') >= 0 || stUp.indexOf('PEND') >= 0) b.emAndamento++;
          else b.outros++;
          escolasSetPorAno[k][escola] = true;
          if (!b.programas[prog]) b.programas[prog] = { repasses: 0, receita: 0, despesa: 0 };
          b.programas[prog].repasses++;
          b.programas[prog].receita += recT;
          b.programas[prog].despesa += despT;
        });
      });

      if (compactos.length === 0) return false;
      Object.keys(kpisPorAno).forEach(function(k) {
        var b = kpisPorAno[k];
        b.totalEscolas = Object.keys(escolasSetPorAno[k] || {}).length;
        b.taxaExecucao = b.totalReceita > 0 ? Math.round((b.totalDespesa / b.totalReceita) * 1000) / 10 : 0;
        b.taxaAprovacao = b.totalRepasses > 0 ? Math.round(((b.aprovadas + b.ressalvas) / b.totalRepasses) * 1000) / 10 : 0;
      });

      DADOS_FINANCEIROS_SEFIN.kpisPorAno = kpisPorAno;
      DADOS_FINANCEIROS_SEFIN.repassesCompactos = compactos;
      if (!DADOS_FINANCEIROS_SEFIN.meta) DADOS_FINANCEIROS_SEFIN.meta = {};
      DADOS_FINANCEIROS_SEFIN.meta.ultimaAtualizacao = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ' ' + (timestampStr || new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }));
      DADOS_FINANCEIROS_SEFIN.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      return true;
    }

    function sincronizarDashboardSefin(silencioso) {
      const isSil = (silencioso === true);
      if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEFIN • SHAREPOINT AO VIVO',
          titulo: 'Sincronizando SEFIN Ao Vivo...',
          mensagem: 'Conectando ao SharePoint em tempo real para atualizar prestações de contas PDDE...',
          detalhes: 'Conexão Direta à Fonte Oficial • Sem Login',
          duracao: 0
        });
      }

      function concluirSefin(agora, veioLive) {
        const timestampFormatado = agora || new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
        if (!DADOS_FINANCEIROS_SEFIN.meta) DADOS_FINANCEIROS_SEFIN.meta = {};
        if (veioLive) {
          DADOS_FINANCEIROS_SEFIN.meta.ultimaAtualizacao = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ' ' + timestampFormatado;
          DADOS_FINANCEIROS_SEFIN.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }
        renderizarDashboardFinanceiroSefin();
        if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
        if (typeof window.gravarEstadoNuvem === 'function' && typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN) {
          window.gravarEstadoNuvem('SEFIN_DATA', DADOS_FINANCEIROS_SEFIN);
        }
        if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: veioLive ? 'success' : 'info',
            tag: veioLive ? 'SEFIN ATUALIZADO AO VIVO' : 'SEFIN • BASE OFICIAL',
            titulo: veioLive ? 'SEFIN Sincronizado Direto do SharePoint!' : 'Base SEFIN Verificada',
            mensagem: veioLive
              ? '<strong>' + (DADOS_FINANCEIROS_SEFIN.repassesCompactos ? DADOS_FINANCEIROS_SEFIN.repassesCompactos.length.toLocaleString('pt-BR') : '0') + ' repasses</strong> auditados em tempo real direto da planilha oficial do SharePoint!'
              : 'Mantendo os dados consolidados carregados (SharePoint indisponível no momento).',
            detalhes: (veioLive ? 'SharePoint Live às ' : 'Verificado às ') + timestampFormatado,
            duracao: 4500
          });
        }
      }

      consultarSharepointGasLive({
        action: 'sincronizarSefin',
        fnGas: 'sincronizarPlanilhaSefin',
        argsGas: [false]
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64) {
          var pur = (typeof window.purificarXlsxStreamingSeNecessario === 'function')
            ? window.purificarXlsxStreamingSeNecessario(res.dadosBase64)
            : Promise.resolve(res.dadosBase64);
          pur.then(function(cleanB64) {
            var ok = false;
            try { ok = processarPlanilhaSefinBase64(cleanB64, res.timestamp); } catch (ep) { console.warn('Aviso parse SEFIN:', ep); }
            concluirSefin(res ? res.timestamp : null, ok);
          });
        } else {
          concluirSefin(res ? res.timestamp : null, false);
        }
      }).catch(function() {
        concluirSefin(null, false);
      });
    }

    function renderizarDashboardFinanceiroSefin() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const anoAtivo = filtrosSefinAvancados.ano || '2026';
      const mapaAnos = DADOS_FINANCEIROS_SEFIN.kpisPorAno || {};
      const kpis = mapaAnos[anoAtivo] || mapaAnos[String(anoAtivo).toLowerCase()] || mapaAnos[String(anoAtivo).toUpperCase()] || mapaAnos["2026"];
      const anosOrdenadosSefin = Object.keys(mapaAnos).filter(k => /^\d{4}$/.test(k)).sort((a, b) => Number(b) - Number(a));
      const totalHistoricoSefin = (mapaAnos.todos || mapaAnos.TODOS || kpis || {}).totalRepasses || 0;
      const opcoesAnoSefinHtml = anosOrdenadosSefin.map(y => {
        const repAno = ((mapaAnos[y] && mapaAnos[y].totalRepasses) || 0).toLocaleString('pt-BR');
        const rotulo = (y === '2026') ? `${y} (Exercício Vigente - ${repAno} repasses)` : `${y} (${repAno} repasses)`;
        return `<option value="${y}" ${anoAtivo === y ? 'selected' : ''}>${rotulo}</option>`;
      }).join('') + `<option value="todos" ${String(anoAtivo).toLowerCase() === 'todos' ? 'selected' : ''}>Todos os Exercícios (Série Histórica Completa - ${totalHistoricoSefin.toLocaleString('pt-BR')} repasses)</option>`;
      const listaRepasses = obterRepassesFiltradosSefin();
      const programasDoAno = Object.keys(kpis.programas || {});
      function formatarValorKpiCard(valor) {
        if (typeof valor !== 'number' || isNaN(valor)) valor = 0;
        const numStr = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        /* Fontes ampliadas em mais +15% com margem lateral estrita de 5px */
        let fontSizeCard = '1.65rem';
        if (numStr.length >= 14) {
          fontSizeCard = 'clamp(1.26rem, 1.42vw, 1.45rem)';
        } else if (numStr.length >= 12) {
          fontSizeCard = 'clamp(1.38rem, 1.58vw, 1.56rem)';
        } else if (numStr.length >= 10) {
          fontSizeCard = 'clamp(1.52rem, 1.72vw, 1.66rem)';
        } else {
          fontSizeCard = 'clamp(1.60rem, 1.84vw, 1.78rem)';
        }
        return {
          html: '<span style="font-size: 0.82em; font-weight: 700; opacity: 0.85; margin-right: 3px;">R$</span>' + numStr,
          fontSize: fontSizeCard
        };
      }
      const fonteKpiContagem = 'clamp(1.72rem, 2.05vw, 2.18rem)';
      let html = `
        <div class="sefin-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEFIN (ALTO PADRÃO PROFISSIONAL) -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #38bdf8; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                <span style="font-size: 1.6rem;">💼</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEFIN - Seção de Finanças</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Controle e acompanhamento da execução financeira e prestação de contas dos repasses do <strong style="color: #ffffff;">PDDE Paulista</strong> e <strong style="color: #ffffff;">PDDE Federal</strong> para as Associações de Pais e Mestres (APMs) das 60 unidades escolares da Unidade Regional de Ensino de Itapevi.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #bae6fd; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="sefin-banner-timestamp" style="color: #ffffff;">${(DADOS_FINANCEIROS_SEFIN && DADOS_FINANCEIROS_SEFIN.meta && DADOS_FINANCEIROS_SEFIN.meta.atualizadoFormatado) || '11/11/2026, 15:40:22'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem; flex-wrap: nowrap;">
                <button onclick="sincronizarDashboardSefin(false)" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.3); color: #ffffff; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s ease;">
                  <span class="sync-spin-icon">🔄</span> Sincronizar Base
                </button>
                <a href="${URLS_OFICIAIS_SEFIN.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f59e0b; color: #1e1b4b; border: 1.5px solid #f59e0b; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s ease;">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <span style="font-size: 0.74rem; color: #93c5fd; font-weight: 600;">Base oficial com ${(kpis.totalRepasses || 2999).toLocaleString('pt-BR')} repasses auditáveis</span>
            </div>
          </div>
          </div>

          <!-- BARRA DE SELEÇÃO DE EXERCÍCIO (ANO) -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1.25rem; margin-bottom: 1.2rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <span style="font-size: 1.3rem;">📅</span>
              <div>
                <label for="sefin-seletor-ano-header" style="font-size: 0.78rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem;">Exercício / Ano da Prestação de Contas:</label>
                <select id="sefin-seletor-ano-header" onchange="alterarExercicioSefin(this.value)" style="background: #f8fafc; border: 2px solid #0284c7; color: #0f172a; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.92rem; cursor: pointer; outline: none;">
                  ${opcoesAnoSefinHtml}
                </select>
              </div>
            </div>

            <div style="font-size: 0.84rem; color: #0369a1; font-weight: 800; background: #e0f2fe; border: 1.5px solid #0284c7; padding: 6px 16px; border-radius: 8px;">
              <span>${kpis.legenda}</span>
            </div>
          </div>

          <!-- GRID DE 5 KPIS REAIS (TITULOS RESUMIDOS, TIPOGRAFIA EQUILIBRADA, SEM TRANSBORDAMENTO) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <!-- CARD 1: RECEITA TOTAL -->
            <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); min-width: 0;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em;">Receita Total</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                </div>
                ${(() => {
                  const val = formatarValorKpiCard(kpis.totalReceita);
                  return `<div style="font-size: ${val.fontSize}; font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0; padding: 0 5px; white-space: nowrap; text-align: center; display: flex; justify-content: center; align-items: center; width: 100%;" title="Receita Total: ${formatarMoedaBrl(kpis.totalReceita)}">${val.html}</div>`;
                })()}
              </div>
              <div style="font-size: 0.74rem; color: #475569; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 600;">
                <span>Custeio: <strong style="color: #0f172a; font-weight: 800;">${formatarMoedaAbreviada(kpis.recCusteio)}</strong></span>
                <span>Capital: <strong style="color: #0f172a; font-weight: 800;">${formatarMoedaAbreviada(kpis.recCapital)}</strong></span>
              </div>
            </div>

            <!-- CARD 2: DESPESAS -->
            <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); min-width: 0;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em;">Despesas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                </div>
                ${(() => {
                  const val = formatarValorKpiCard(kpis.totalDespesa);
                  return `<div style="font-size: ${val.fontSize}; font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0; padding: 0 5px; white-space: nowrap; text-align: center; display: flex; justify-content: center; align-items: center; width: 100%;" title="Despesas Realizadas: ${formatarMoedaBrl(kpis.totalDespesa)}">${val.html}</div>`;
                })()}
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 800;">
                <span>${formatarPct(kpis.taxaExecucao)} executado</span>
                <span style="color: #475569; font-weight: 600;">C: <strong style="color: #0f172a;">${formatarMoedaAbreviada(kpis.despCusteio)}</strong></span>
              </div>
            </div>

            <!-- CARD 3: SALDO EM CONTA -->
            <div style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); min-width: 0;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em;">Saldo em Conta</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z"></path></svg>
                  </div>
                </div>
                ${(() => {
                  const val = formatarValorKpiCard(kpis.totalSaldo);
                  return `<div style="font-size: ${val.fontSize}; font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0; padding: 0 5px; white-space: nowrap; text-align: center; display: flex; justify-content: center; align-items: center; width: 100%;" title="Saldo em Conta APMs: ${formatarMoedaBrl(kpis.totalSaldo)}">${val.html}</div>`;
                })()}
              </div>
              <div style="font-size: 0.74rem; color: #78350f; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 800;">
                <span>${anoAtivo === '2026' && !kpis.totalSaldo ? 'Em execução (SED)' : 'A Reprogramar'}</span>
                <span style="color: #475569; font-weight: 600;">${anoAtivo === '2026' && !kpis.totalSaldo ? ('Disp.: ' + formatarMoedaAbreviada(Math.max(0, (kpis.totalReceita || 0) - (kpis.totalDespesa || 0)))) : 'Contas APMs'}</span>
              </div>
            </div>

            <!-- CARD 4: REPASSES (NÚMERO LIMPO) -->
            <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.05); min-width: 0;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.03em;">Total Repasses</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #f1f5f9; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #cbd5e1;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>
                <div style="font-size: ${fonteKpiContagem}; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">
                  ${kpis.totalRepasses.toLocaleString('pt-BR')}
                </div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>${kpis.totalEscolas} Escolas</span>
                <span style="color: #475569; font-weight: 600;">Rede Regional</span>
              </div>
            </div>

            <!-- CARD 5: SITUAÇÃO SED (NÚMERO LIMPO) -->
            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.08); min-width: 0;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #5b21b6; text-transform: uppercase; letter-spacing: 0.03em;">
                    ${anoAtivo === '2026' ? 'Andamento SED' : 'Aprovação SED'}
                  </span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                </div>
                <div style="font-size: ${fonteKpiContagem}; font-weight: 800; color: #6d28d9; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">
                  ${anoAtivo === '2026' ? kpis.emAndamento.toLocaleString('pt-BR') : formatarPct(kpis.taxaAprovacao)}
                </div>
              </div>
              <div style="font-size: 0.74rem; color: #4c1d95; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                ${anoAtivo === '2026'
                  ? '<span><strong>' + kpis.emAndamento + '</strong> em andamento</span><span>' + kpis.outros + ' em análise</span>'
                  : '<span><strong>' + kpis.aprovadas.toLocaleString('pt-BR') + '</strong> aprovadas</span><span><strong>' + kpis.ressalvas.toLocaleString('pt-BR') + '</strong> ressalvas</span>'}
              </div>
            </div>

          </div>

          <!-- NAVEGAÇÃO DE SUB-ABAS (ALTO CONTRASTE ROBUSTO 100% GARANTIDO POR CSS) -->
          <style>
            .btn-sefin-subaba {
              background: #ffffff !important;
              color: #0f172a !important;
              border: 1.5px solid #cbd5e1 !important;
              padding: 8px 18px !important;
              border-radius: 8px !important;
              font-size: 0.84rem !important;
              font-weight: 700 !important;
              cursor: pointer !important;
              display: inline-flex !important;
              align-items: center !important;
              gap: 0.4rem !important;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
              transition: all 0.15s ease !important;
              user-select: none !important;
            }
            .btn-sefin-subaba:hover {
              background: #f1f5f9 !important;
              border-color: #94a3b8 !important;
              color: #0b2351 !important;
            }
            .btn-sefin-subaba.ativo {
              background: #0b2351 !important;
              color: #ffffff !important;
              border-color: #0b2351 !important;
              font-weight: 800 !important;
              box-shadow: 0 3px 8px rgba(11,35,81,0.25) !important;
            }
            .btn-sefin-subaba.ativo:hover {
              background: #172554 !important;
              color: #ffffff !important;
              border-color: #172554 !important;
            }
          </style>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.15rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.75rem;">
            <button id="btn-subaba-sefin-repasses" class="btn-sefin-subaba ${filtrosSefinAvancados.subAba === 'repasses' ? 'ativo' : ''}" onclick="alternarSubAbaSefin('repasses')">
              🏫 Repasses por Unidade Escolar
            </button>
            <button id="btn-subaba-sefin-programas" class="btn-sefin-subaba ${filtrosSefinAvancados.subAba === 'programas' ? 'ativo' : ''}" onclick="alternarSubAbaSefin('programas')">
              📊 Distribuição por Programa
            </button>
            <button id="btn-subaba-sefin-regularidade" class="btn-sefin-subaba ${filtrosSefinAvancados.subAba === 'regularidade' ? 'ativo' : ''}" onclick="alternarSubAbaSefin('regularidade')">
              📋 Prestação de Contas SED
            </button>
          </div>

          <!-- SUB-ABA 1: REPASSES POR ESCOLA (TABELA INTERATIVA COM FILTROS DE ALTO CONTRASTE) -->
          <div id="conteudo-subaba-sefin-repasses" style="display: block;">
            
            <!-- FILTROS DA TABELA (SEM O BOTÃO CSV ESPALHAFATOSO) -->
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: flex-end; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              
              <div style="flex: 1 1 240px;">
                <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 0.35rem;">Buscar Escola ou CIE:</label>
                <input id="sefin-busca-escola" type="text" placeholder="Digite o nome da escola ou CIE..." value="${filtrosSefinAvancados.termoBusca || ''}" oninput="atualizarFiltroAvancadoSefin('termoBusca', this.value)" style="width: 100%; background: #ffffff; border: 1.5px solid #94a3b8; color: #0f172a; padding: 8px 12px; border-radius: 8px; font-size: 0.86rem; font-weight: 700; outline: none;">
              </div>

              <div style="flex: 1 1 200px;">
                <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 0.35rem;">Programa / Objeto:</label>
                <select id="sefin-filtro-programa" onchange="atualizarFiltroAvancadoSefin('programa', this.value)" style="width: 100%; background: #ffffff; border: 1.5px solid #94a3b8; color: #0f172a; padding: 8px 12px; border-radius: 8px; font-size: 0.84rem; font-weight: 700; outline: none;">
                  <option value="todos">Todos os Programas</option>
                  ${programasDoAno.map(p => '<option value="' + p + '" ' + (filtrosSefinAvancados.programa === p ? 'selected' : '') + '>' + p + '</option>').join('')}
                </select>
              </div>

              <div style="flex: 0 1 140px;">
                <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 0.35rem;">Origem:</label>
                <select id="sefin-filtro-origem" onchange="atualizarFiltroAvancadoSefin('origem', this.value)" style="width: 100%; background: #ffffff; border: 1.5px solid #94a3b8; color: #0f172a; padding: 8px 12px; border-radius: 8px; font-size: 0.84rem; font-weight: 700; outline: none;">
                  <option value="todos">Todas</option>
                  <option value="Paulista" ${filtrosSefinAvancados.origem === 'Paulista' ? 'selected' : ''}>Paulista</option>
                  <option value="Federal" ${filtrosSefinAvancados.origem === 'Federal' ? 'selected' : ''}>Federal</option>
                </select>
              </div>

              <div style="flex: 0 1 160px;">
                <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 0.35rem;">Status SED:</label>
                <select id="sefin-filtro-status" onchange="atualizarFiltroAvancadoSefin('statusSed', this.value)" style="width: 100%; background: #ffffff; border: 1.5px solid #94a3b8; color: #0f172a; padding: 8px 12px; border-radius: 8px; font-size: 0.84rem; font-weight: 700; outline: none;">
                  <option value="todos">Todos os Status</option>
                  <option value="APROVADA" ${filtrosSefinAvancados.statusSed === 'APROVADA' ? 'selected' : ''}>Aprovada</option>
                  <option value="APROVADA COM RESSALVA" ${filtrosSefinAvancados.statusSed === 'APROVADA COM RESSALVA' ? 'selected' : ''}>Aprovada com Ressalva</option>
                  <option value="EM ANDAMENTO" ${filtrosSefinAvancados.statusSed === 'EM ANDAMENTO' ? 'selected' : ''}>Em Andamento</option>
                  <option value="EM REVISÃO" ${filtrosSefinAvancados.statusSed === 'EM REVISÃO' ? 'selected' : ''}>Em Revisão</option>
                </select>
              </div>

              <div style="display: flex; gap: 0.6rem; align-items: center;">
                <button onclick="limparTodosFiltrosSefin()" style="background: #ffffff; border: 1.5px solid #cbd5e1; color: #0f172a; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#ffffff'">
                  Limpar
                </button>
              </div>

            </div>

            <!-- BARRA DE CONTAGEM E BOTÃO SUTIL EXPORTAR XLSX -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem; padding: 0 0.25rem;">
              <div id="sefin-contador-linhas" style="font-size: 0.82rem; color: #475569; font-weight: 700;">
                Exibindo ${Math.min(listaRepasses.length, filtrosSefinAvancados.limiteLinhas)} de ${listaRepasses.length} repasses encontrados ${filtrosSefinAvancados.ordenarPor === 'ano' ? (filtrosSefinAvancados.ordenarDirecao === 'desc' ? '(Ano mais recente primeiro: 2026 → 2019)' : '(Ano mais antigo primeiro: 2019 → 2026)') : ''}
              </div>
              <button onclick="exportarBalanceteSefinXlsx()" style="background: #ffffff; border: 1.5px solid #cbd5e1; color: #475569; padding: 5px 13px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'; this.style.borderColor='#94a3b8'; this.style.color='#0f172a';" onmouseout="this.style.background='#ffffff'; this.style.borderColor='#cbd5e1'; this.style.color='#475569';" title="Exportar dados filtrados para Excel">
                <span>📊 Baixar Excel</span>
              </button>
            </div>

            <!-- TABELA REAL DE REPASSES -->
            <div id="sefin-tabela-container">
              ${renderizarTabelaRepassesHtml(listaRepasses)}
            </div>

          </div>

          <!-- SUB-ABA 2: DISTRIBUIÇÃO POR PROGRAMA -->
          <div id="conteudo-subaba-sefin-programas" style="display: none;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.1rem; margin-top: 0.5rem;">
              ${programasDoAno.map(progNome => {
                const p = kpis.programas[progNome];
                const pct = p.receita > 0 ? (p.despesa / p.receita) * 100 : 0;
                return `
                  <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="font-weight: 800; font-size: 0.94rem; color: #0f172a; margin-bottom: 0.35rem; line-height: 1.3;">${progNome}</div>
                    <div style="font-size: 0.78rem; color: #0369a1; font-weight: 700; margin-bottom: 0.75rem;">${p.repasses} repasses cadastrados no ano</div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 0.35rem;">
                      <span style="color: #475569; font-weight: 600;">Receita Total:</span>
                      <span style="color: #0369a1; font-weight: 800;">${formatarMoedaBrl(p.receita)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 0.65rem;">
                      <span style="color: #475569; font-weight: 600;">Despesa Realizada:</span>
                      <span style="color: #047857; font-weight: 800;">${formatarMoedaBrl(p.despesa)}</span>
                    </div>
                    <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.4rem;">
                      <div style="background: #047857; height: 100%; width: ${Math.min(100, Math.round(pct))}%;"></div>
                    </div>
                    <div style="font-size: 0.76rem; color: #047857; text-align: right; font-weight: 800;">${formatarPct(pct)} de execução</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- SUB-ABA 3: PRESTAÇÃO DE CONTAS SED -->
          <div id="conteudo-subaba-sefin-regularidade" style="display: none;">
            <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.5rem; margin-top: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 1.25rem 0;">Status Oficial da Prestação de Contas no Sistema SED (Ano ${anoAtivo})</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.1rem; margin-bottom: 1.5rem;">
                <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 1.2rem; text-align: center;">
                  <div style="font-size: 2rem; font-weight: 900; color: #166534; text-align: center; width: 100%; display: flex; justify-content: center; align-items: center;">${kpis.aprovadas}</div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #15803d; text-transform: uppercase;">Aprovadas sem Ressalva</div>
                </div>
                <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 1.2rem; text-align: center;">
                  <div style="font-size: 2rem; font-weight: 900; color: #92400e; text-align: center; width: 100%; display: flex; justify-content: center; align-items: center;">${kpis.ressalvas}</div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #b45309; text-transform: uppercase;">Aprovadas com Ressalva</div>
                </div>
                <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 1.2rem; text-align: center;">
                  <div style="font-size: 2rem; font-weight: 900; color: #075985; text-align: center; width: 100%; display: flex; justify-content: center; align-items: center;">${kpis.emAndamento}</div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">Em Andamento</div>
                </div>
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.2rem; text-align: center;">
                  <div style="font-size: 2rem; font-weight: 900; color: #1e293b; text-align: center; width: 100%; display: flex; justify-content: center; align-items: center;">${kpis.outros}</div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #475569; text-transform: uppercase;">Em Análise / Outros</div>
                </div>
              </div>
              <p style="font-size: 0.86rem; color: #334155; line-height: 1.5; margin: 0; font-weight: 500;">
                A regularidade das Associações de Pais e Mestres (APMs) no sistema SED é pré-requisito indispensável para a liberação de novos repasses e parcelas do PDDE Paulista pela SEDUC-SP.
              </p>
            </div>
          </div>

          <!-- NOTAS EXPLICATIVAS RETRÁTEIS -->
          <div style="margin-top: 1.75rem; border: 1.5px solid #cbd5e1; border-radius: 14px; background: #ffffff; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            
            <div id="sefin-notas-header-toggle" onclick="alternarRecolherNotasSefin()" style="padding: 1.1rem 1.4rem; background: #0f172a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;" title="Clique para expandir ou recolher as notas metodológicas">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <span style="font-size: 1.25rem;">📖</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.01em;">Notas Metodológicas e Dicionário de Colunas da Planilha Oficial</h4>
                  <div id="sefin-notas-toggle-status" style="font-size: 0.76rem; color: #f09b0c; font-weight: 700; margin-top: 2px;">Clique para recolher notas explicativas</div>
                </div>
              </div>
              <div id="sefin-notas-seta-indicadora" style="font-size: 1.15rem; color: #f09b0c; transition: transform 0.3s; transform: rotate(180deg);">▼</div>
            </div>

            <div id="sefin-notas-conteudo-expansivel" style="padding: 1.5rem; border-top: 1px solid #e2e8f0; display: block; background: #ffffff;">
              
              <!-- GLOSSÁRIO DE SIGLAS & CLASSIFICAÇÃO ORÇAMENTÁRIA (SEDUC-SP / FNDE) -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.2rem; margin-bottom: 1.35rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <span style="font-size: 1.2rem;">📑</span>
                  <h5 style="margin: 0; font-size: 0.92rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.03em;">
                    Glossário Normativo de Rubricas & Siglas Oficiais (SEDUC / FNDE)
                  </h5>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1rem;">
                  <!-- C: CUSTEIO -->
                  <div style="background: #ffffff; border-left: 4px solid #0284c7; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                      <strong style="color: #0369a1; font-size: 0.86rem; font-weight: 800;">Rubrica "C" • Custeio (Despesas Correntes)</strong>
                      <span style="background: #e0f2fe; color: #0369a1; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Lei Federal 4.320/64</span>
                    </div>
                    <p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">
                      Destinado à manutenção diária da unidade escolar. <strong>Exemplos permitidos:</strong> aquisição de material de consumo (papel, toner, itens pedagógicos, kits de robótica e materiais do Novo Ensino Médio), materiais descartáveis e de higiene (Dignidade Íntima), pequenas reformas e manutenções prediais/elétricas e contratação de serviços contábeis da APM. <em>É vedada a conversão unilateral para bens permanentes.</em>
                    </p>
                  </div>

                  <!-- K: CAPITAL -->
                  <div style="background: #ffffff; border-left: 4px solid #059669; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                      <strong style="color: #047857; font-size: 0.86rem; font-weight: 800;">Rubrica "K" • Capital (Bens Permanentes & Patrimônio)</strong>
                      <span style="background: #d1fae5; color: #065f46; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Res. SEDUC 11/2024</span>
                    </div>
                    <p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">
                      A sigla <strong>"K"</strong> adota a convenção contábil e econômica internacional para <em>Kapital</em> (diferenciando de Custo/Consumo). Aplica-se exclusivamente a bens com vida útil superior a 2 anos e incorporação patrimonial obrigatória: computadores, telas Educatron, condicionadores de ar, impressoras, armários de aço, mobiliário e equipamentos de laboratório.
                    </p>
                  </div>

                  <!-- APM -->
                  <div style="background: #ffffff; border-left: 4px solid #d97706; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <strong style="color: #b45309; font-size: 0.86rem; display: block; margin-bottom: 0.25rem; font-weight: 800;">APM • Associação de Pais e Mestres</strong>
                    <p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">
                      Entidade jurídica de direito privado sem fins lucrativos que gerencia os recursos públicos escolares e responde legalmente pela correta execução e prestação de contas dos repasses perante a Unidade Regional de Ensino e órgãos de controle externo (TCE-SP e TCU).
                    </p>
                  </div>

                  <!-- PDDE Paulista & Federal -->
                  <div style="background: #ffffff; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <strong style="color: #6d28d9; font-size: 0.86rem; display: block; margin-bottom: 0.25rem; font-weight: 800;">Origens: PDDE Paulista (Lei 17.149/19) e PDDE Federal (FNDE)</strong>
                    <p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">
                      <strong>Paulista:</strong> Recursos estaduais transferidos pela SEDUC-SP via subcontas específicas (Manutenção, Sala Maker, Novo Ensino Médio, AVCB, etc.).<br>
                      <strong>Federal:</strong> Transferências diretas do FNDE/MEC (Educação Básica, Qualidade, Estrutura e Mais Educação).
                    </p>
                  </div>
                </div>
              </div>

              <!-- DICIONÁRIO DE CAMPOS DA PLANILHA OFICIAL -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.1rem; margin-bottom: 1.25rem;">
                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.1rem;">
                  <strong style="color: #0369a1; font-size: 0.88rem; display: block; margin-bottom: 0.35rem; font-weight: 800;">💰 Receita Total (Custeio + Capital)</strong>
                  <p style="font-size: 0.82rem; color: #334155; margin: 0; line-height: 1.5; font-weight: 500;">
                    Montante total creditado na conta bancária da APM escolar, segregado em <strong>Custeio (C)</strong> e <strong>Capital (K)</strong>. Corresponde às colunas P e Q da base oficial. Inclui os repasses iniciais, complementações e eventuais rendimentos de aplicação financeira.
                  </p>
                </div>

                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.1rem;">
                  <strong style="color: #047857; font-size: 0.88rem; display: block; margin-bottom: 0.35rem; font-weight: 800;">📝 Despesas Executadas (Custeio + Capital)</strong>
                  <p style="font-size: 0.82rem; color: #334155; margin: 0; line-height: 1.5; font-weight: 500;">
                    Gastos efetivamente executados e comprovados pela equipe gestora da Unidade Escolar (colunas U e V), comprovados mediante notas fiscais eletrônicas, orçamentos prévios (mínimo de três propostas), recibos e balancetes validados pela Unidade Regional de Ensino.
                  </p>
                </div>

                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.1rem;">
                  <strong style="color: #b45309; font-size: 0.88rem; display: block; margin-bottom: 0.35rem; font-weight: 800;">🏦 Saldo Remanescente a Reprogramar</strong>
                  <p style="font-size: 0.82rem; color: #334155; margin: 0; line-height: 1.5; font-weight: 500;">
                    Recursos que permaneceram em conta bancária ao término do exercício fiscal (colunas W e X). Esses valores não são perdidos: são formalmente reprogramados para utilização no ano seguinte mediante novo Plano de Aplicação Financeira aprovado pelo Conselho da APM.
                  </p>
                </div>

                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.1rem;">
                  <strong style="color: #6d28d9; font-size: 0.88rem; display: block; margin-bottom: 0.35rem; font-weight: 800;">🏛️ Situação SED (Parecer Conclusivo da SEFIN)</strong>
                  <p style="font-size: 0.82rem; color: #334155; margin: 0; line-height: 1.5; font-weight: 500;">
                    Parecer formal auditado pela equipe técnica do SEAFIN/SEFIN na Secretaria Escolar Digital:<br>
                    • <strong>Aprovada:</strong> Prestação regular, sem inconformidades.<br>
                    • <strong>Aprovada com Ressalva:</strong> Aprovada com pequenas pendências formais corrigíveis.<br>
                    • <strong>Em Andamento:</strong> Documentação em análise técnica dentro do prazo regulamentar.
                  </p>
                </div>
              </div>

              <!-- RODAPÉ DE AUDITORIA E BASE -->
              <div style="border-top: 1.5px solid #e2e8f0; padding-top: 0.85rem; font-size: 0.78rem; color: #475569; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-weight: 600;">
                <span>Fonte Oficial: <strong style="color: #0f172a;">Controle prestação de contas U.E..xlsx</strong> (SharePoint Corporativo SEDUC)</span>
                <span>Unidade Responsável: <strong style="color: #0f172a;">SEAFIN / SEFIN • Unidade Regional de Ensino de Itapevi</strong></span>
                <span>Normativas: <strong style="color: #0284c7;">Res. SEDUC 11/2024 • Res. CD/FNDE 15/2021</strong></span>
              </div>

            </div>

          </div>

          <!-- NOTA METODOLÓGICA E ORIENTAÇÕES DO SEFIN -->
          <div id="nota-metodologica-sefin" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">💰</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEFIN • NOTAS METODOLÓGICAS &amp; DIRETRIZES DE EXECUÇÃO FINANCEIRA</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Gestão de recursos descentralizados às APMs, repasses estaduais/federais, taxas de execução e prestação de contas</div>
                </div>
              </div>
              <span style="background: rgba(14,165,233,0.15); color: #38bdf8; border: 1px solid rgba(14,165,233,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Base Integrada SEFIN • Planilha Oficial SharePoint</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Recursos Descentralizados & APM -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏛️</span> <span>Recursos Descentralizados &amp; APMs</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Associação de Pais e Mestres (APM):</strong> Entidade privada com finalidade pública que gere as verbas descentralizadas sob fiscalização do Conselho Fiscal.<br>
                  • <strong>Autonomia Gerencial:</strong> Recursos aplicados pela direção escolar e comunidade para despesas de custeio (manutenção, insumos) e capital (pequenos equipamentos).
                </div>
              </div>

              <!-- Bloco 2: PDDE Paulista vs PDDE Federal -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #34d399; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📑</span> <span>PDDE Paulista x PDDE Federal</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>PDDE Paulista (Estadual):</strong> Regulamentado pela Lei Estadual nº 17.149/2019 e Resolução SEDUC nº 11/2024 para reformas emergenciais, climatização e melhorias prediais.<br>
                  • <strong>PDDE Básico &amp; Ações Integradas (Federal):</strong> Vinculado ao FNDE/MEC (Res. CD/FNDE nº 15/2021), cobrindo Educação Conectada, Salas de Recursos e programas nacionais.
                </div>
              </div>

              <!-- Bloco 3: Taxa de Execução vs Saldo Ocioso -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #fbbf24; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📊</span> <span>Taxa de Execução &amp; Gestão de Saldos</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Taxa de Execução (%):</strong> Percentual do recurso financeiro liquidado e pago em relação ao montante disponibilizado no exercício orçamentário anual.<br>
                  • <strong>Alerta de Saldo Ocioso:</strong> Saldos não utilizados permanecem em conta vinculada e exigem reprogramação anual. O acompanhamento previne o represamento de recursos essenciais.
                </div>
              </div>

              <!-- Bloco 4: Prestação de Contas & Transparência -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #a78bfa; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>⚖️</span> <span>Prestação de Contas &amp; Fiscalização</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Plataforma SED / FDE:</strong> Todas as despesas, notas fiscais eletrônicas e cotações de preços (mínimo de 3 orçamentos) são registradas eletronicamente na Secretaria Escolar Digital.<br>
                  • <strong>Aprovação Regulatória:</strong> Prestação de contas examinada pelo SEFIN e auditada pelo Tribunal de Contas do Estado de São Paulo (TCE-SP).
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Centro de Administração, Finanças e Infraestrutura (CAF / SEFIN)</span>
              <span>Contato Oficial: itp_sefin_educacao_sp_gov_br • Prestação de Contas Pública &amp; Auditável</span>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    
    
    /* ======================================================= */


    /* ========================================================================= */
    /* DADOS CONSOLIDADOS SECOMSE - CONTROLE OFICIAL DE CONTRATOS SHAREPOINT     */
    /* Conta: itp_secomse_educacao_sp_gov_br | Controle de contratos.xlsx        */
    /* ========================================================================= */
    let DADOS_SECOMSE = {"sucesso":true,"setor":"SECOMSE","centro":"SEAFIN","nomeSetor":"Seção de Compras e Serviços","descricao":"Controle Oficial de Contratos - SECOMSE","origem":"SharePoint Oficial - itp_secomse_educacao_sp_gov_br","urlOficial":("https:" + String.fromCharCode(47, 47) + "seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?rtime=1RW0RI0630g"),"arquivo":"Controle de contratos.xlsx","ultimaAtualizacao":"","kpis":{"totalContratos2026":0,"valorTotal2026":0,"valorTotal2026Formatado":"R$ 0,00","totalContratos2025":0,"valorTotal2025":0,"valorTotal2025Formatado":"R$ 0,00"},"exerciciosDisponiveis":["2026","2025"],"contratos":{"2025":[],"2026":[]}};

    /* Dados SECOMSE alimentados exclusivamente pela nuvem (zero localStorage) */

    let estadoSecomse = {
      exercicio: '2026',
      categoria: 'TODOS',
      filtroPub: 'TODOS',
      termoBusca: '',
      colunaOrdenacao: 'dataAssinatura',
      ordemAsc: false
    };

    function mudarExercicioSecomse(ano) {
      estadoSecomse.exercicio = ano;
      renderizarDashboardSecomse();
    }

    function mudarCategoriaSecomse(cat, btnEl) {
      estadoSecomse.categoria = cat;
      document.querySelectorAll('.btn-secomse-cat').forEach(b => {
        const isMatch = (btnEl && b === btnEl) || (b.getAttribute('data-cat') === cat);
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
      atualizarTabelaSecomse();
    }

    function mudarFiltroPubSecomse(filtro) {
      estadoSecomse.filtroPub = filtro;
      atualizarTabelaSecomse();
    }

    function buscarContratosSecomse(termo) {
      estadoSecomse.termoBusca = (termo || '').toLowerCase().trim();
      atualizarTabelaSecomse();
    }

    function ordenarTabelaSecomse(coluna) {
      if (estadoSecomse.colunaOrdenacao === coluna) {
        estadoSecomse.ordemAsc = !estadoSecomse.ordemAsc;
      } else {
        estadoSecomse.colunaOrdenacao = coluna;
        estadoSecomse.ordemAsc = (coluna === 'dataAssinatura' || coluna === 'valor') ? false : true;
      }
      atualizarTabelaSecomse();
    }

    function processarPlanilhaSecomseBase64(b64, timestampStr) {
      if (!b64 || typeof XLSX === 'undefined') return null;
      var wb = XLSX.read(b64, { type: 'base64' });
      var mesesNomes = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

      function parseDt(val) {
        if (typeof val === 'number' && val >= 30000 && val <= 65000 && XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
          var p = XLSX.SSF.parse_date_code(val);
          if (p) {
            return { str: String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y, mesNome: mesesNomes[p.m] || '', ts: new Date(p.y, p.m - 1, p.d).getTime() };
          }
        }
        if (val) {
          var s = String(val).trim();
          var m = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?/);
          if (m && m[1] && m[2]) {
            var y = m[3] ? parseInt(m[3], 10) : 2026;
            if (y < 100) y += 2000;
            var d = parseInt(m[1], 10), mo = parseInt(m[2], 10);
            return { str: String(d).padStart(2, '0') + '/' + String(mo).padStart(2, '0') + '/' + y, mesNome: mesesNomes[mo] || '', ts: new Date(y, mo - 1, d).getTime() };
          }
        }
        return { str: '-', mesNome: '-', ts: 0 };
      }

      function fmtPub(val) {
        if (val === null || val === undefined || val === '') return 'Não se Aplica';
        var num = Number(val);
        if (!isNaN(num) && num >= 30000 && num <= 65000 && XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
          var p = XLSX.SSF.parse_date_code(num);
          if (p) return String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
        }
        var s = String(val).trim();
        return (s.toLowerCase() === 'não se aplica' || s.toLowerCase() === 'nao se aplica' || s === '-') ? 'Não se Aplica' : s;
      }

      function numVal(v) {
        if (typeof v === 'number') return isNaN(v) ? 0 : v;
        if (!v) return 0;
        var n = parseFloat(String(v).replace(/[R$\s.]/g, '').replace(',', '.'));
        return isNaN(n) ? 0 : n;
      }

      function procSheet(sheetName) {
        var ws = wb.Sheets[sheetName];
        if (!ws) return [];
        return XLSX.utils.sheet_to_json(ws, { defval: '' }).map(function(r, idx) {
          var contrato = String(r['Contrato'] || r['CONTRATO'] || '').trim();
          var processoSei = String(r['Processo SEI'] || r['PROCESSO SEI'] || '').trim();
          var licit = String(r['Nº da licitação Compras.Gov'] || r['LICITACAO'] || '').trim();
          var empresa = String(r['Empresa'] || r['EMPRESA'] || '').trim();
          var dtAss = parseDt(r['Data da assinatura'] !== undefined ? r['Data da assinatura'] : r['DATA ASSINATURA']);
          var vig = String(r['Data de vigência'] || r['VIGENCIA'] || '').trim();
          var val = numVal(r['Valor do contrato'] !== undefined ? r['Valor do contrato'] : r['VALOR']);
          var objeto = String(r['Objeto'] || r['OBJETO'] || '').trim();
          var ol = objeto.toLowerCase();
          var cat = 'Outros Serviços';
          if (ol.indexOf('transporte') >= 0 || ol.indexOf('veículo') >= 0 || ol.indexOf('ônibus') >= 0) cat = 'Transporte Escolar';
          else if (ol.indexOf('elevador') >= 0 || ol.indexOf('manutenção') >= 0 || ol.indexOf('reforma') >= 0 || ol.indexOf('obra') >= 0 || ol.indexOf('extintor') >= 0 || ol.indexOf('dedetiza') >= 0 || ol.indexOf('limpeza') >= 0) cat = 'Manutenção e Conservação';
          else if (ol.indexOf('locação') >= 0 || ol.indexOf('imóvel') >= 0 || ol.indexOf('aluguel') >= 0) cat = 'Locação de Imóveis';
          else if (ol.indexOf('software') >= 0 || ol.indexOf('computador') >= 0 || ol.indexOf('informática') >= 0 || /\bti\b/.test(ol) || ol.indexOf('internet') >= 0) cat = 'Tecnologia';
          var st = 'Vigente';
          if (ol.indexOf('rescindido') >= 0 || vig.toLowerCase().indexOf('rescind') >= 0) st = 'Rescindido';
          else if (ol.indexOf('encerrado') >= 0 || vig.toLowerCase().indexOf('encerr') >= 0) st = 'Encerrado';
          return {
            id: 'SECOMSE-' + sheetName + '-' + (idx + 1),
            exercicio: sheetName,
            contrato: contrato || ('Contrato ' + (idx + 1)),
            processoSei: processoSei || '-',
            licitacaoComprasGov: licit || 'Não se Aplica',
            empresa: empresa || 'Não informada',
            dataAssinatura: dtAss.str,
            mesAssinatura: dtAss.mesNome,
            timestampAssinatura: dtAss.ts,
            vigencia: vig || '-',
            valor: val,
            valorFormatado: val > 0 ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
            publicacaoDoe: fmtPub(r['Publicação no D.O.E.'] !== undefined ? r['Publicação no D.O.E.'] : r['DOE']),
            publicacaoPncp: fmtPub(r['Publicação PNCP'] !== undefined ? r['Publicação PNCP'] : r['PNCP']),
            publicacaoJornal: fmtPub(r['Publicação Jornal de Grande Circulação'] !== undefined ? r['Publicação Jornal de Grande Circulação'] : r['JORNAL']),
            publicacaoAudesp: fmtPub(r['Publicação AUDESP (superior a R$ 9.255,00)'] !== undefined ? r['Publicação AUDESP (superior a R$ 9.255,00)'] : r['AUDESP']),
            licitacaoAudesp: String(r['Nº da licitação AUDESP'] || '').trim() || '-',
            objeto: objeto || 'Objeto não especificado',
            categoria: cat,
            statusVigencia: st
          };
        }).filter(function(c) { return c.empresa !== 'Não informada' || c.processoSei !== '-' || c.valor > 0; });
      }

      var c26 = procSheet('2026');
      var c25 = procSheet('2025');
      var v26 = c26.reduce(function(a, c) { return a + c.valor; }, 0);
      var v25 = c25.reduce(function(a, c) { return a + c.valor; }, 0);
      if (c26.length === 0 && c25.length === 0) return null;

      return Object.assign({}, DADOS_SECOMSE, {
        sucesso: true,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-BR') + ' ' + (timestampStr || new Date().toLocaleTimeString('pt-BR')),
        kpis: {
          totalContratos2026: c26.length,
          valorTotal2026: v26,
          valorTotal2026Formatado: v26.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          totalContratos2025: c25.length,
          valorTotal2025: v25,
          valorTotal2025Formatado: v25.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        },
        exerciciosDisponiveis: ['2026', '2025'],
        contratos: { '2026': c26, '2025': c25 }
      });
    }

    function sincronizarDashboardSecomse(silencioso) {
      const isSil = (silencioso === true);
      const btnSync = document.getElementById('btn-secomse-sync-base');
      if (btnSync && !isSil) {
        btnSync.disabled = true;
        btnSync.innerHTML = '⏳ Sincronizando...';
      }

      if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SECOMSE • SHAREPOINT LIVE',
          titulo: 'Sincronizando Contratos SECOMSE...',
          mensagem: 'Conectando ao SharePoint oficial em tempo real para auditar contratos...',
          detalhes: 'Conexão Direta à Fonte Oficial • Sem Login',
          duracao: 0
        });
      }

      function aplicarDados(novos, fonteNome, veioLive) {
        if (novos && novos.kpis && novos.contratos) {
          DADOS_SECOMSE = novos;
        }
        if (veioLive) {
          var tsSecomseBr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ', ' + new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          DADOS_SECOMSE.ultimaAtualizacao = tsSecomseBr.replace(', ', ' ');
          if (!DADOS_SECOMSE.meta) DADOS_SECOMSE.meta = {};
          DADOS_SECOMSE.meta.atualizadoFormatado = tsSecomseBr;
        }
        renderizarDashboardSecomse();
        if (typeof window.gravarEstadoNuvem === 'function' && typeof DADOS_SECOMSE !== 'undefined' && DADOS_SECOMSE) {
          window.gravarEstadoNuvem('SECOMSE_DATA', DADOS_SECOMSE);
        }

        if (btnSync) {
          btnSync.disabled = false;
          btnSync.innerHTML = '🔄 Sincronizar SECOMSE';
        }

        if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
          const tot = DADOS_SECOMSE.kpis ? (DADOS_SECOMSE.kpis.totalContratos2026 + ' Contratos 2026') : 'Base Oficial';
          const val = DADOS_SECOMSE.kpis ? DADOS_SECOMSE.kpis.valorTotal2026Formatado : '';
          mostrarAlertaSincronizacao({
            tipo: veioLive ? 'success' : 'info',
            tag: veioLive ? 'SECOMSE ATUALIZADO AO VIVO' : 'SECOMSE • ESPELHO NUVEM',
            titulo: veioLive ? 'SECOMSE Sincronizado Direto do SharePoint!' : 'Base SECOMSE Carregada (Espelho Nuvem)',
            mensagem: '<strong>' + tot + '</strong> • Valor Global: <strong>' + val + '</strong>.',
            detalhes: (fonteNome || 'SharePoint Oficial') + ' • ' + (DADOS_SECOMSE.ultimaAtualizacao || ''),
            duracao: 4500
          });
        }
      }

      function buscarMirror() {
        fetch(URLS_OFICIAIS_SECOMSE.mirrorData + '?t=' + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(json) {
            if (json && json.kpis) {
              aplicarDados(json, 'Espelho GitHub (Fallback)', false);
            } else {
              aplicarDados(null, 'Base carregada', false);
            }
          })
          .catch(function() {
            aplicarDados(null, 'Base carregada', false);
          });
      }

      consultarSharepointGasLive({
        action: 'sincronizarSecomse',
        fnGas: 'sincronizarPlanilhaSecomse',
        argsGas: []
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64) {
          var pur = (typeof window.purificarXlsxStreamingSeNecessario === 'function')
            ? window.purificarXlsxStreamingSeNecessario(res.dadosBase64)
            : Promise.resolve(res.dadosBase64);
          pur.then(function(cleanB64) {
            var parsed = null;
            try { parsed = processarPlanilhaSecomseBase64(cleanB64, res.timestamp); } catch (ep) { console.warn('Aviso parse SECOMSE:', ep); }
            if (parsed) aplicarDados(parsed, 'SharePoint Live', true);
            else buscarMirror();
          });
        } else if (res && res.kpis) {
          aplicarDados(res, 'Espelho Nuvem', false);
        } else {
          buscarMirror();
        }
      }).catch(function() {
        buscarMirror();
      });
    }

    function abrirModalDetalheContratoSecomse(idContrato) {
      const lista = (DADOS_SECOMSE.contratos && DADOS_SECOMSE.contratos[estadoSecomse.exercicio]) || [];
      const item = lista.find(c => c.id === idContrato);
      if (!item) return;

      let modalEl = document.getElementById('modal-detalhe-secomse');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'modal-detalhe-secomse';
        modalEl.style.cssText = 'position: fixed; inset: 0; background: rgba(15,23,42,0.65); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        document.body.appendChild(modalEl);
      }

      modalEl.innerHTML = `
        <div style="background: #ffffff; width: 100%; max-width: 680px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); overflow: hidden; border: 1px solid #e2e8f0; animation: fadeInScale 0.2s ease-out;">
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); padding: 1.25rem 1.5rem; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.4rem;">📄</span>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; letter-spacing: -0.01em;">Contrato ${item.contrato} (${item.exercicio})</h3>
                <span style="font-size: 0.76rem; color: #93c5fd;">Processo SEI: ${item.processoSei}</span>
              </div>
            </div>
            <button onclick="fecharModalDetalheContratoSecomse()" style="background: rgba(255,255,255,0.15); border: none; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; font-size: 1.1rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">✕</button>
          </div>

          <div style="padding: 1.5rem; max-height: 75vh; overflow-y: auto; font-size: 0.85rem; line-height: 1.6; color: #334155;">
            <!-- CARD EMPRESA & VALOR -->
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Empresa Contratada</div>
                <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">${item.empresa}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Valor Global</div>
                <div style="font-size: 1.2rem; font-weight: 900; color: #047857;">${item.valorFormatado}</div>
              </div>
            </div>

            <!-- OBJETO -->
            <div style="margin-bottom: 1.25rem;">
              <strong style="color: #0f172a; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">Objeto do Contrato:</strong>
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.85rem; color: #1e293b; font-size: 0.88rem; line-height: 1.5;">
                ${item.objeto}
              </div>
            </div>

            <!-- DETALHAMENTO DE CAMPOS -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div style="background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.72rem; font-weight: 700; color: #64748b;">DATA DA ASSINATURA</div>
                <div style="font-size: 0.92rem; font-weight: 800; color: #1e3a8a;">📅 ${item.dataAssinatura}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.72rem; font-weight: 700; color: #64748b;">PRAZO DE VIGÊNCIA</div>
                <div style="font-size: 0.92rem; font-weight: 800; color: #0f172a;">⏳ ${item.vigencia}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.72rem; font-weight: 700; color: #64748b;">LICITAÇÃO COMPRAS.GOV</div>
                <div style="font-size: 0.88rem; font-weight: 800; color: #334155;">🏛️ ${item.licitacaoComprasGov}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.72rem; font-weight: 700; color: #64748b;">LICITAÇÃO AUDESP</div>
                <div style="font-size: 0.88rem; font-weight: 800; color: #334155;">⚖️ ${item.licitacaoAudesp}</div>
              </div>
            </div>

            <!-- PUBLICAÇÕES OFICIAIS -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-top: 0.5rem;">
              <strong style="color: #0f172a; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.6rem;">Publicações Oficiais & Transparência:</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
                <span style="background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700;">
                  📰 D.O.E.: ${item.publicacaoDoe}
                </span>
                <span style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700;">
                  🌐 PNCP: ${item.publicacaoPncp}
                </span>
                <span style="background: #fefce8; border: 1px solid #fef08a; color: #854d0e; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700;">
                  🗞️ Jornal: ${item.publicacaoJornal}
                </span>
                <span style="background: #f5f3ff; border: 1px solid #ddd6fe; color: #5b21b6; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700;">
                  📊 AUDESP: ${item.publicacaoAudesp}
                </span>
              </div>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 0.75rem 1.5rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; align-items: center;">
            <button onclick="fecharModalDetalheContratoSecomse()" style="background: #0b2351; color: #ffffff; border: none; padding: 0.5rem 1.3rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#1e3a8a'" onmouseout="this.style.background='#0b2351'">Fechar</button>
          </div>
        </div>
      `;
      modalEl.style.display = 'flex';
    }

    function fecharModalDetalheContratoSecomse() {
      const modalEl = document.getElementById('modal-detalhe-secomse');
      if (modalEl) modalEl.style.display = 'none';
    }

    function atualizarTabelaSecomse() {
      const tbody = document.getElementById('tabela-secomse-tbody');
      const counterEl = document.getElementById('secomse-filtro-contador');
      const somaEl = document.getElementById('secomse-filtro-soma');
      if (!tbody) return;

      const ano = estadoSecomse.exercicio;
      const contratos = (DADOS_SECOMSE.contratos && DADOS_SECOMSE.contratos[ano]) || [];

      /* Filtragem */
      let filtrados = contratos.filter(item => {
        /* Categoria */
        if (estadoSecomse.categoria === 'Outros Serviços') {
          if (item.categoria === 'Transporte Escolar' || item.categoria === 'Manutenção e Conservação') {
            return false;
          }
        } else if (estadoSecomse.categoria !== 'TODOS' && item.categoria !== estadoSecomse.categoria) {
          return false;
        }
        /* Filtro publicação */
        if (estadoSecomse.filtroPub === 'PNCP' && (item.publicacaoPncp === 'Não se Aplica' || item.publicacaoPncp === '-')) {
          return false;
        }
        if (estadoSecomse.filtroPub === 'AUDESP' && (item.publicacaoAudesp === 'Não se Aplica' || item.publicacaoAudesp === '-')) {
          return false;
        }
        if (estadoSecomse.filtroPub === 'COMPRASGOV' && (item.licitacaoComprasGov === 'Não se Aplica' || item.licitacaoComprasGov === '-')) {
          return false;
        }
        /* Busca textual */
        if (estadoSecomse.termoBusca) {
          const t = estadoSecomse.termoBusca;
          const matchContrato = item.contrato.toLowerCase().includes(t);
          const matchSei = item.processoSei.toLowerCase().includes(t);
          const matchEmpresa = item.empresa.toLowerCase().includes(t);
          const matchObjeto = item.objeto.toLowerCase().includes(t);
          const matchLicit = item.licitacaoComprasGov.toLowerCase().includes(t);
          if (!matchContrato && !matchSei && !matchEmpresa && !matchObjeto && !matchLicit) {
            return false;
          }
        }
        return true;
      });

      /* Ordenação */
      var colSec = estadoSecomse.colunaOrdenacao || 'dataAssinatura';
      var dirSec = estadoSecomse.ordemAsc ? 'asc' : 'desc';
      ordenarListaPorColuna(filtrados, {
        dir: dirSec,
        isDate: colSec === 'dataAssinatura',
        isNum: colSec === 'valor',
        getter: function(item) {
          if (colSec === 'dataAssinatura') return item.timestampAssinatura || item.dataAssinatura || '';
          if (colSec === 'valor') return item.valor || 0;
          return item[colSec] || '';
        },
        tieId: function(item) { return item.id || item.contrato || ''; }
      });

      document.querySelectorAll('#tabela-secomse-contratos th[data-col]').length && sincronizarSetasTabelaPorEstado('#tabela-secomse-contratos', colSec, dirSec);

      /* Atualiza contadores */
      const totalSoma = filtrados.reduce((acc, c) => acc + c.valor, 0);
      if (counterEl) counterEl.textContent = filtrados.length + ' de ' + contratos.length + ' contratos';
      if (somaEl) somaEl.textContent = totalSoma > 0 ? totalSoma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

      if (filtrados.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="padding: 2.5rem 1rem; text-align: center; color: #64748b;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
              <strong style="color: #0f172a; font-size: 0.95rem;">Nenhum contrato encontrado com os filtros aplicados</strong>
              <div style="font-size: 0.8rem; margin-top: 0.25rem;">Tente ajustar o termo de busca ou selecione "Todos os Contratos".</div>
            </td>
          </tr>
        `;
        return;
      }

      /* Renderiza as linhas */
      tbody.innerHTML = filtrados.map(c => {
        let badgeCatCor = '#64748b';
        let badgeCatBg = '#f1f5f9';
        if (c.categoria === 'Transporte Escolar') { badgeCatCor = '#0284c7'; badgeCatBg = '#e0f2fe'; }
        else if (c.categoria === 'Manutenção e Conservação') { badgeCatCor = '#b45309'; badgeCatBg = '#fef3c7'; }
        else if (c.categoria === 'Vigilância e Limpeza') { badgeCatCor = '#7c3aed'; badgeCatBg = '#f5f3ff'; }
        else if (c.categoria === 'Outros Serviços' || c.categoria === 'Merenda/Insumos' || c.categoria === 'Alimentação e Insumos') { badgeCatCor = '#059669'; badgeCatBg = '#ecfdf5'; }

        return `
          <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
            <td style="padding: 0.75rem 0.9rem; font-weight: 800; color: #0b2351; white-space: nowrap;">
              ${c.contrato}
              <div style="font-size: 0.7rem; color: #64748b; font-weight: 500;">SEI: ${c.processoSei}</div>
            </td>
            <td style="padding: 0.75rem 0.9rem;">
              <strong style="color: #1e293b; font-size: 0.83rem;">${c.empresa}</strong>
            </td>
            <td style="padding: 0.75rem 0.9rem; color: #334155; font-size: 0.8rem; max-width: 260px;">
              <div style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" title="${c.objeto}">
                ${c.objeto}
              </div>
            </td>
            <td style="padding: 0.75rem 0.9rem; font-size: 0.76rem; color: #475569; white-space: nowrap;">
              ${c.licitacaoComprasGov}
            </td>
            <td style="padding: 0.75rem 0.9rem; font-weight: 900; color: #047857; text-align: right; white-space: nowrap;">
              ${c.valorFormatado}
            </td>
            <td style="padding: 0.75rem 0.9rem; text-align: center; white-space: nowrap; font-size: 0.78rem; color: #1e3a8a; font-weight: 700;">
              ${c.dataAssinatura}
            </td>
            <td style="padding: 0.75rem 0.9rem; font-size: 0.75rem; color: #475569; white-space: nowrap; text-align: center;">
              ${c.vigencia}
            </td>
            <td style="padding: 0.75rem 0.9rem; text-align: center; white-space: nowrap;">
              <button onclick="abrirModalDetalheContratoSecomse('${c.id}')" style="background: #0b2351; color: #ffffff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: 0.15s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#0b2351'">
                Ver Detalhes ↗
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    /* ========================================================================= */
    /* RENDERIZAÇÃO DO DASHBOARD EXECUTIVO SECOMSE (COMPRAS & SERVIÇOS) */
    /* ========================================================================= */
    function renderizarDashboardSecomse() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const ano = estadoSecomse.exercicio;
      const kpis = DADOS_SECOMSE.kpis || {};
      const contratos = (DADOS_SECOMSE.contratos && DADOS_SECOMSE.contratos[ano]) || [];
      const valorTotal = ano === '2026' ? (kpis.valorTotal2026Formatado || 'R$ 470.945,74') : (kpis.valorTotal2025Formatado || 'R$ 67.082.611,83');
      const totalContratos = ano === '2026' ? (kpis.totalContratos2026 || 57) : (kpis.totalContratos2025 || 25);

      const html = `
        <div class="secomse-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SECOMSE -->
          <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #38bdf8; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                <span style="font-size: 1.6rem;">💼</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SECOMSE - Seção de Compras e Serviços</h2>
                <span style="background: #dbeafe; color: #1e40af; border: 1.5px solid #3b82f6; font-size: 0.76rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT</span>
              </div>
              <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                Gestão centralizada do controle de contratos administrativos, atas de registro de preços, processos licitatórios (Compras.Gov / BEC) e publicações de transparência (D.O.E., PNCP e AUDESP).
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #bae6fd; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="secomse-banner-timestamp" style="color: #ffffff;">${(DADOS_SECOMSE && DADOS_SECOMSE.meta && DADOS_SECOMSE.meta.atualizadoFormatado) || '11/11/2026, 17:15:00'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem; flex-wrap: nowrap;">
                <button onclick="sincronizarDashboardSecomse()" id="btn-secomse-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar SECOMSE
                </button>
                <a href="${URLS_OFICIAIS_SECOMSE.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #38bdf8; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(56,189,248,0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #93c5fd; font-weight: 700;">Base oficial com ${totalContratos} contratos no exercício ${ano}</div>
            </div>
          </div>

          <!-- SELETOR DE EXERCÍCIO -->
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem;">
            <span style="font-size: 0.78rem; font-weight: 800; color: #475569; text-transform: uppercase;">Exercício:</span>
            <button onclick="mudarExercicioSecomse('2026')" style="padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; transition: 0.2s; border: 1.5px solid ${ano === '2026' ? '#0b2351' : '#cbd5e1'}; background: ${ano === '2026' ? '#0b2351' : '#ffffff'}; color: ${ano === '2026' ? '#ffffff' : '#334155'}; box-shadow: ${ano === '2026' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'};">
              🚀 Exercício 2026
            </button>
            <button onclick="mudarExercicioSecomse('2025')" style="padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; transition: 0.2s; border: 1.5px solid ${ano === '2025' ? '#0b2351' : '#cbd5e1'}; background: ${ano === '2025' ? '#0b2351' : '#ffffff'}; color: ${ano === '2025' ? '#ffffff' : '#334155'}; box-shadow: ${ano === '2025' ? '0 2px 6px rgba(11, 35, 81, 0.25)' : 'none'};">
              📜 Exercício 2025
            </button>
          </div>

          <!-- 4 CARDS KPIS SECOMSE -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            <!-- CARD 1 -->
            <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Contratos Registrados</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0f2fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #bae6fd; font-size: 1.1rem;">
                    📑
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #0284c7; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${totalContratos}</div>
              </div>
              <div style="font-size: 0.74rem; color: #0369a1; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Contratos monitorados</span>
                <span style="color: #64748b; font-weight: 600;">Exercício ${ano}</span>
              </div>
            </div>

            <!-- CARD 2 -->
            <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Valor Global Contratado</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    💰
                  </div>
                </div>
                <div style="font-size: clamp(1.48rem, 1.8vw, 1.82rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${valorTotal}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Soma dos contratos</span>
                <span style="color: #64748b; font-weight: 600;">Ano ${ano}</span>
              </div>
            </div>

            <!-- CARD 3 -->
            <div style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Compras.Gov / BEC</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #fef3c7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fde68a; font-size: 1.1rem;">
                    🏛️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #b45309; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">
                  ${contratos.filter(c => c.licitacaoComprasGov !== 'Não se Aplica' && c.licitacaoComprasGov !== '-').length}
                </div>
              </div>
              <div style="font-size: 0.74rem; color: #92400e; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Pregões & Licitações</span>
                <span style="color: #64748b; font-weight: 600;">Compras.gov</span>
              </div>
            </div>

            <!-- CARD 4 -->
            <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">AUDESP / Transparência</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    ⚖️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">
                  ${contratos.filter(c => c.publicacaoAudesp !== 'Não se Aplica' && c.publicacaoAudesp !== '-').length}
                </div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Superior a R$ 9.255</span>
                <span style="color: #64748b; font-weight: 600;">TCE-SP</span>
              </div>
            </div>
          </div>

          <!-- BARRA DE FILTROS & PESQUISA -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
              <!-- Busca rápida -->
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-grow: 1;">
                <input type="text" placeholder="Buscar por contrato, empresa, objeto ou processo SEI..." oninput="buscarContratosSecomse(this.value)" style="width: 100%; padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.8rem; outline: none; transition: 0.2s;" onfocus="this.style.borderColor='#38bdf8'" onblur="this.style.borderColor='#cbd5e1'">
              </div>
            </div>

            <!-- Resumo do filtro -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.65rem; margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
              <div>
                Filtrando: <strong id="secomse-filtro-contador" style="color: #0b2351;">${contratos.length} contratos</strong>
              </div>
              <div>
                Total filtrado: <strong id="secomse-filtro-soma" style="color: #047857; font-weight: 800;">${valorTotal}</strong>
              </div>
            </div>
          </div>

          <!-- TABELA DE CONTRATOS DO EXERCÍCIO -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
            <div style="padding: 0.85rem 1.25rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: #0f172a; font-size: 0.92rem;">Contratações - Exercício ${ano}</strong>
              <span style="font-size: 0.74rem; color: #64748b;">Clique nas colunas para ordenar</span>
            </div>
            <div style="overflow-x: auto;">
              <table id="tabela-secomse-contratos" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
                <thead style="background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1; user-select: none;">
                  <tr>
                    <th data-col="contrato" class="th-sortable" onclick="ordenarTabelaSecomse('contrato')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Contrato / SEI">
                      <div class="th-sort-wrapper"><span class="th-title-text">Contrato / SEI</span><span class="sort-arrow">↕</span></div>
                    </th>
                    <th data-col="empresa" class="th-sortable" onclick="ordenarTabelaSecomse('empresa')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Empresa Contratada">
                      <div class="th-sort-wrapper"><span class="th-title-text">Empresa Contratada</span><span class="sort-arrow">↕</span></div>
                    </th>
                    <th data-col="objeto" class="th-sortable" onclick="ordenarTabelaSecomse('objeto')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Objeto Contratual">
                      <div class="th-sort-wrapper"><span class="th-title-text">Objeto Contratual</span><span class="sort-arrow">↕</span></div>
                    </th>
                    <th data-col="licitacaoComprasGov" class="th-sortable" onclick="ordenarTabelaSecomse('licitacaoComprasGov')" style="padding: 0.75rem 0.9rem;" title="Clique para classificar por Compras.Gov">
                      <div class="th-sort-wrapper"><span class="th-title-text">Compras.Gov</span><span class="sort-arrow">↕</span></div>
                    </th>
                    <th data-col="valor" class="th-sortable" onclick="ordenarTabelaSecomse('valor')" style="padding: 0.75rem 0.9rem; text-align: right;" title="Clique para classificar por Valor Global">
                      <div class="th-sort-wrapper" style="justify-content: flex-end;"><span class="th-title-text">Valor Global</span><span class="sort-arrow">↕</span></div>
                    </th>
                    <th data-col="dataAssinatura" class="th-sortable sort-active-desc" onclick="ordenarTabelaSecomse('dataAssinatura')" style="padding: 0.75rem 0.9rem; text-align: center;" title="Clique para classificar por Data da Assinatura">
                      <div class="th-sort-wrapper center"><span class="th-title-text">Assinatura</span><span class="sort-arrow">▼</span></div>
                    </th>
                    <th data-col="vigencia" class="th-sortable" onclick="ordenarTabelaSecomse('vigencia')" style="padding: 0.75rem 0.9rem; text-align: center;" title="Clique para classificar por Vigência">
                      <div class="th-sort-wrapper"><span class="th-title-text">Vigência</span><span class="sort-arrow">↕</span></div>
                    </th>
                    <th class="no-sort" data-no-sort="true" style="padding: 0.75rem 0.9rem; text-align: center;">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody id="tabela-secomse-tbody">
                  <!-- Inserido dinamicamente por atualizarTabelaSecomse() -->
                </tbody>
              </table>
            </div>
          </div>

        
          <!-- NOTAS METODOLÓGICAS & CRITÉRIOS DE CONTRATOS (SECOMSE) -->
          <div id="nota-metodologica-secomse" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">💼</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SECOMSE • NOTAS METODOLÓGICAS &amp; DIRETRIZES DE CONTRATAÇÕES</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Gestão de contratos administrativos, atas de registro de preços, processos licitatórios e transparência pública</div>
                </div>
              </div>
              <span style="background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Base Oficial SharePoint • Controle de Contratos</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: Processos SEI & Contratos -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📋</span> <span>Processos SEI &amp; Contratos</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Processo SEI:</strong> Tramitação eletrônica do processo administrativo de instrução, pareceres jurídicos e termos aditivos.<br>
                  • <strong>Vigência e Aditivos:</strong> Monitoramento contínuo dos prazos de execução para evitar descontinuidade de serviços essenciais (transporte, vigilância, manutenção).
                </div>
              </div>

              <!-- Bloco 2: Portais de Compras & Licitações -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #10b981; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏛️</span> <span>Licitações &amp; Compras.Gov</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Compras.Gov / BEC:</strong> Modalidades licitatórias eletrônicas conforme a Lei Federal 14.133/21 (Pregão Eletrônico, Dispensa e Inexigibilidade).<br>
                  • <strong>Atas de Registro de Preços:</strong> Adesões a atas centralizadas para fornecimento corporativo de insumos e transportes.
                </div>
              </div>

              <!-- Bloco 3: Publicidade & Tribunal de Contas -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #fbbf24; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>⚖️</span> <span>Transparência (D.O.E., PNCP &amp; AUDESP)</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>PNCP &amp; D.O.E.:</strong> Publicações obrigatórias em diário oficial e no Portal Nacional de Contratações Públicas para eficácia contratual.<br>
                  • <strong>AUDESP (TCE-SP):</strong> Transmissão dos dados da Fase IV de despesas e contratos para auditoria externa do Tribunal de Contas.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Seção de Compras e Serviços (SECOMSE / SEAFIN)</span>
              <span>Conta Corporativa: itp_secomse_educacao_sp_gov_br</span>
            </div>
          </div>

</div>
      `;

      container.innerHTML = html;
      atualizarTabelaSecomse();
    }

