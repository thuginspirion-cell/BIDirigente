    /* Estrutura Hierárquica: CENTROS -> SETORES */
    const ESTRUTURA_ORGANIZACIONAL = {
      'SEINTEC': {
        sigla: 'SEINTEC',
        nome: 'Serviço de Informações Educacionais e Tecnologia | SEINTEC',
        descricao: 'Gestão da infraestrutura tecnológica escolar, inventário de Educatrons, conectividade, sistemas e suporte técnico.',
        icone: '💻',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / CIE / SEINTEC',
        setores: [
          { sigla: 'Tecnologia', nome: 'Infraestrutura e Tecnologia', desc: 'Hardware, conectividade de rede, suporte e laboratórios escolares' },
          { sigla: 'CIE', nome: 'Centro de Informações Educacionais', desc: 'Estatísticas, coleta de dados e sistemas institucionais SEDUC' },
          { sigla: 'Suporte', nome: 'Atendimento e Suporte Técnico', desc: 'Chamados, manutenção de computadores e equipamentos' }
        ]
      },
      'SEAFIN': {
        sigla: 'SEAFIN',
        nome: 'Serviço de Administração e Finanças | SEAFIN',
        descricao: 'Setor responsável pela gestão orçamentária, prestação de contas, compras diretas, atas de registro de preços, contratos e patrimônio escolar.',
        icone: '💼',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / SEAFIN',
        setores: [
          {
            sigla: 'SEFIN',
            nome: 'SEFIN - Seção de Finanças',
            desc: 'Controle e acompanhamento da execução financeira, prestação de contas dos repasses de APM/PDDE, auditoria e reservas orçamentárias.',
            sharepointUrl: URLS_OFICIAIS_SEFIN.sharepoint
          },
          {
            sigla: 'SECOMSE',
            nome: 'SECOMSE - Seção de Compras e Serviços',
            desc: 'Gestão de compras diretas, licitações, atas de registro de preços, contratação de serviços contínuos e suprimentos escolares.',
            sharepointUrl: URLS_OFICIAIS_SECOMSE.sharepoint
          }
        ]
      },
      'SEOM': {
        sigla: 'SEOM',
        nome: 'Seção de Obras e Manutenção Escolar | SEOM',
        descricao: 'Planejamento e acompanhamento de intervenções prediais, reformas, vistorias estruturais, laudos técnicos de engenharia e SEFISC (Frota e Fiscalização).',
        icone: '🏗️',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / SEOM',
        setores: [
          {
            sigla: 'SEOM',
            nome: 'SEOM - Obras e Manutenção Escolar',
            desc: 'Acompanhamento de reformas prediais, adequações de acessibilidade e climatização, vistorias de engenharia e laudos estruturais da rede escolar.',
            sharepointUrl: URLS_OFICIAIS_SEOM.sharepoint
          },
          {
            sigla: 'SEFISC',
            nome: 'SEFISC - Seção de Fiscalização',
            desc: 'Fiscalização in loco de contratos de prestação de serviços terceirizados, gestão e escala da frota oficial de veículos e vistorias de campo.',
            sharepointUrl: URLS_OFICIAIS_SEFISC.sharepoint
          },
          {
            sigla: 'DPAT',
            nome: 'DPAT - Divisão de Patrimônio',
            desc: 'Inventário físico oficial de bens móveis permanentes, tombamento patrimonial (chapas ITP), localização por ambiente da Unidade Regional de Ensino e conservação de materiais.',
            sharepointUrl: URLS_OFICIAIS_DPAT.sharepoint
          }
        ]
      },
      'SEGRE': {
        sigla: 'SEGRE',
        nome: 'Serviço de Gestão da Rede Escolar | SEGRE',
        descricao: 'Supervisão do atendimento escolar, matrículas (SEMAT), vida escolar (SEVESC) e organização regional.',
        icone: '🏫',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / SEGRE',
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
            nome: 'SEGRE - Serviço de Gestão da Rede Escolar',
            desc: 'Serviço de Gestão da Rede Escolar, processos SEI, ofícios e acompanhamento administrativo das 60 escolas',
            sharepointUrl: URLS_OFICIAIS_SEGRE.sharepoint
          }
        ]
      },
      'SEPES': {
        sigla: 'SEPES',
        nome: 'Serviço de Pessoas | SEPES',
        descricao: 'Quadro docente, atribuição de aulas, evolução funcional, aposentadorias, designações, abonos e vida funcional dos servidores.',
        icone: '👥',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / SEPES',
        setores: [
          {
            sigla: 'SEAPE',
            nome: 'SEAPE - Seção de Administração de Pessoal',
            desc: 'Demandas estratégicas de vida funcional, aposentadorias, designações e abono de permanência.',
            sharepointUrl: URLS_OFICIAIS_SEPES.sharepoint
          },
          {
            sigla: 'SEFREP',
            nome: 'SEFREP - Seção de Serviço e Pagamento',
            desc: 'Gestão da vida funcional, controle de frequência, pagamento, adicionais e benefícios dos servidores.',
            sharepointUrl: ''
          }
        ]
      },
      'EEC': {
        sigla: 'EEC',
        nome: 'Equipe de Especialistas em Currículo | EEC',
        descricao: 'Portal integrado da EEC: Início, Consulta SAEB 2025, Plano de Ação 2.0 (2026), Devolutiva Pedagógica, Consulta de Docentes e Acompanhamento Pedagógico.',
        icone: '📚',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / EEC',
        setores: [
          { 
            sigla: 'INICIO', 
            nome: '🏠 Início EEC', 
            desc: 'Portal Central e Acesso Unificado da Equipe de Especialistas em Currículo (EEC).' 
          },
          { 
            sigla: 'SAEB', 
            nome: '📊 Consulta SAEB 2025', 
            desc: 'Sistema Oficial de Consulta ao SAEB 2025 - Diagnóstico e acompanhamento regional.' 
          },
          { 
            sigla: 'PLANO_ACAO', 
            nome: '🎯 Plano de Ação 2.0 2026', 
            desc: 'Plano de Ação 2.0 (2026) - Planejamento estratégico e metas pedagógicas das escolas.' 
          },
          { 
            sigla: 'DEVOLUTIVA', 
            nome: '📋 Devolutiva Pedagógica', 
            desc: 'Painel de Devolutivas Pedagógicas - Feedback formativo e alinhamento pedagógico.' 
          },
          { 
            sigla: 'DOCENTES', 
            nome: '👨‍🏫 Consulta de Docentes', 
            desc: 'Consulta de Docentes - Quadro de professores e atribuição curricular na rede regional.' 
          },
          { 
            sigla: 'ACOMPANHAMENTO', 
            nome: '🧭 Acompanhamento Pedagógico', 
            desc: 'Novo Acompanhamento Pedagógico 2026 - Registro de visitas escolares e tutoria EEC.' 
          }
        ]
      }
    };
    /* Aliases para retrocompatibilidade */
    ESTRUTURA_ORGANIZACIONAL['CAF'] = ESTRUTURA_ORGANIZACIONAL['SEAFIN']; /* Alias para compatibilidade */
    ESTRUTURA_ORGANIZACIONAL['NOM'] = ESTRUTURA_ORGANIZACIONAL['SEOM']; /* Redirecionamento legado NOM -> SEOM */
    ESTRUTURA_ORGANIZACIONAL['SOEM'] = ESTRUTURA_ORGANIZACIONAL['SEOM']; /* Redirecionamento amigável */
    ESTRUTURA_ORGANIZACIONAL['ASURE'] = { sigla: 'ASURE', nome: 'Assessoria Técnica da Unidade Regional de Ensino | ASURE', descricao: 'Gabinete da Dirigente, assessoria técnica e ouvidoria regional.', icone: '🏛️', cor: '#0b2351' };

    function carregarDadosConsolidados() {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        if (typeof window.__runGasQueued === 'function') {
          window.__runGasQueued('getConsolidatedData', [], 10000)
            .then(aplicarDados)
            .catch(function (err) {
              console.warn("Apps Script em modo autônomo:", err);
            });
          return;
        }
        google.script.run
          .withSuccessHandler(aplicarDados)
          .withFailureHandler(function (err) {
            console.warn("Apps Script em modo autônomo:", err);
          })
          .getConsolidatedData();
      } else {
        /* Ambiente GitHub Pages ou servidor local: aplica dados de referência */
        aplicarDados({
          indicadoresRede: { escolas: 60, nucleos: 6, visitas: 54, demandasAtivas: 0, eficiencia: "90%" },
          visitasDirigente: { concluidas: 54, meta: 60, percentual: 90 }
        });
      }
    }

    function aplicarDados(dados) {
      if (!dados) return;
      if (dados.indicadoresRede) {
        var elEsc = document.getElementById('kpi-escolas'); if (elEsc && dados.indicadoresRede.escolas) elEsc.innerText = dados.indicadoresRede.escolas;
        var elVis = document.getElementById('kpi-visitas'); if (elVis && dados.indicadoresRede.visitas) elVis.innerText = dados.indicadoresRede.visitas;
      }
    }

    /* === NAVEGAÇÃO DE VIEWS === */

    function navegarParaSecao(idElemento, idBotao) {
      if (idElemento === 'carro-section' || idBotao === 'side-btn-carro') {
        abrirCarroOficial();
        return;
      }
      if (idElemento === 'gestao-hoje-section' || idBotao === 'side-btn-gestao') {
        abrirMinhaGestao();
        return;
      }
      if (idElemento === 'agenda-section' || idBotao === 'side-btn-agenda') {
        abrirAgenda();
        return;
      }
      esconderTodasAsPanes();
      document.getElementById('pane-home').classList.add('active');
      const btnAtivo = document.getElementById(idBotao);
      if (btnAtivo) btnAtivo.classList.add('active');
      atualizarBreadcrumbTopo('');
      const el = document.getElementById(idElemento);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      } else {
        rolarAoTopoSuave();
      }
    }


    
    /* Filtro da Home por Escola Oficial do Inventário */
    function aoMudarFiltroEscolaHome(cie) {
      if (!cie) return;
      aplicarFiltrosHome();
    }

    /* ============================================================== */
    /* MOTOR DE FILTROS 100% REATIVO NA HOME (INÍCIO) */
    /* Permite consultar métricas e dados de escolas e setores */
    /* diretamente na página inicial sem navegar para outras abas. */
    /* ============================================================== */

    function obterMetricasEscolaHome(cie) {
      if (!cie) return null;
      const pad = String(cie).padStart(6, '0');
      const raw = String(parseInt(cie, 10));

      let esc = (typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO))
        ? BASE_ESCOLAS_PADRAO.find(e => e.cie === pad || e.cie === raw)
        : null;

      if (!esc && typeof DICIONARIO_OFICIAL_INVENTARIO !== 'undefined') {
        const dic = DICIONARIO_OFICIAL_INVENTARIO[pad] || DICIONARIO_OFICIAL_INVENTARIO[raw];
        if (dic) {
          esc = {
            cie: pad,
            nome: dic.nome,
            cidade: dic.cidade || 'Itapevi',
            bairro: dic.bairro || '-',
            tipo: 'Regular',
            segmento: 'Anos Finais e Ensino Médio',
            diretor: 'Equipe Gestora',
            telefone: '(11) 4141-0000',
            status: 'Normal',
            motivo: 'Monitoramento regular'
          };
        }
      }

      if (!esc) {
        esc = {
          cie: pad,
          nome: 'Escola Estadual (' + pad + ')',
          cidade: 'Itapevi',
          bairro: '-',
          tipo: 'Regular',
          segmento: 'Educação Básica',
          diretor: 'Equipe Gestora',
          telefone: '-',
          status: 'Normal',
          motivo: 'Monitoramento regular'
        };
      }

      /* Hardware SEINTEC da escola */
      let hwList = [];
      try {
        if (window.INVENTARIO_COMPLETO_TUPLES && Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.hardware)) {
          hwList = window.INVENTARIO_COMPLETO_TUPLES.hardware.filter(h => h[0] === pad || h[0] === raw);
        }
      } catch(e) {}

      const hwTotal = hwList.length;
      const hwDisp = hwList.filter(h => h[5] === 'Disponível').length;
      const hwManut = hwList.filter(h => h[5] === 'Em manutenção' || h[5] === 'Chamado aberto' || h[5] === 'Aguardando peça').length;
      const hwAdmin = hwList.filter(h => h[1] === 'Administrativo').length;
      const hwPedag = hwList.filter(h => h[1] === 'Pedagógico').length;
      const hwPctDisp = hwTotal > 0 ? ((hwDisp / hwTotal) * 100).toFixed(1) : '100.0';

      /* Chamados / Calls SEINTEC */
      let callsList = [];
      try {
        if (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros)) {
          callsList = SEINTEC_BASES_CONFIG['Atendimentos'].registros.filter(c => {
            const cPad = String(c.cie || '').padStart(6, '0');
            return cPad === pad || c.cie === raw;
          });
        }
      } catch(e) {}

      const callsTotal = callsList.length;
      const callsPend = callsList.filter(c => c.status === 'Pendente' || c.status === 'Em Aberto' || c.status === 'Em Atendimento').length;
      const callsConc = callsList.filter(c => c.status === 'Concluído').length;

      const emAtencao = esc.status === 'Alta prioridade' || esc.status === 'Atenção' || esc.status === 'Alerta' || esc.status === 'Prioritário';

      return {
        cie: pad,
        nome: esc.nome,
        cidade: esc.cidade || 'Itapevi',
        bairro: esc.bairro || '-',
        tipo: esc.tipo || 'Regular',
        segmento: esc.segmento || 'Ensino Fundamental e Médio',
        diretor: esc.diretor || 'Equipe Gestora',
        telefone: esc.telefone || '-',
        status: esc.status || 'Normal',
        motivo: esc.motivo || 'Monitoramento regular',
        emAtencao,
        hwTotal,
        hwDisp,
        hwManut,
        hwAdmin,
        hwPedag,
        hwPctDisp,
        callsTotal,
        callsPend,
        callsConc
      };
    }

    function aoMudarFiltroEscolaHome(cie) {
      aplicarFiltrosHome();
    }

    function aoMudarFiltroCentroHome(sigla) {
      aplicarFiltrosHome();
    }

    function selecionarEscolaNaHome(cie) {
      const selectEscola = document.getElementById('home-filter-escola');
      if (selectEscola) {
        selectEscola.value = String(cie).padStart(6, '0');
      }
      aplicarFiltrosHome();
      const spotlight = document.getElementById('home-school-spotlight');
      if (spotlight) {
        spotlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function aplicarFiltrosHome() {
      const selectEscola = document.getElementById('home-filter-escola');
      const searchInput = document.getElementById('home-search-input');
      const selectCentro = document.getElementById('home-filter-centro');

      let cie = selectEscola ? selectEscola.value : '';
      const termo = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const centro = selectCentro ? selectCentro.value : '';

      /* Se o usuário digitou na busca sem selecionar do dropdown, tenta encontrar a escola correspondente */
      if (!cie && termo) {
        if (typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO)) {
          const encontrada = BASE_ESCOLAS_PADRAO.find(e => 
            (e.cie && e.cie.includes(termo)) || 
            (e.nome && e.nome.toLowerCase().includes(termo)) ||
            (e.cidade && e.cidade.toLowerCase().includes(termo)) ||
            (e.diretor && e.diretor.toLowerCase().includes(termo))
          );
          if (encontrada) {
            cie = encontrada.cie;
            if (selectEscola) selectEscola.value = cie;
          }
        }
      }

      /* 1. ATUALIZAÇÃO REATIVA DE ESCOLA NA HOME */
      if (cie) {
        const dados = obterMetricasEscolaHome(cie);
        if (dados) {
          renderizarSpotlightEscolaHome(dados);
          atualizarKpisSuperioresHomeParaEscola(dados);
          atualizarSetoresHomeParaEscola(dados);
          destacarAtencaoHomeParaEscola(dados);
        }
      } else {
        restaurarVisaoConsolidadaHome();
      }

      /* 2. FOCO NO CENTRO SELECIONADO NA HOME (SEM MUDAR DE PÁGINA) */
      if (centro) {
        destacarCentroNaHome(centro);
      } else {
        limparDestaqueCentrosHome();
      }
    }

    function renderizarSpotlightEscolaHome(dados) {
      const spotlight = document.getElementById('home-school-spotlight');
      if (!spotlight) return;

      spotlight.style.display = 'block';

      const elNome = document.getElementById('spotlight-school-name');
      const elCie = document.getElementById('spotlight-school-cie');
      const elCity = document.getElementById('spotlight-school-city');
      const elDetails = document.getElementById('spotlight-school-details');

      if (elNome) elNome.textContent = dados.nome;
      if (elCie) elCie.textContent = 'CIE: ' + dados.cie;
      if (elCity) elCity.textContent = dados.cidade + (dados.bairro && dados.bairro !== '-' ? ' • ' + dados.bairro : '');

      if (elDetails) {
        elDetails.innerHTML = '<strong>Direção:</strong> ' + (dados.diretor || 'Equipe Gestora') + ' &nbsp;|&nbsp; <strong>Telefone:</strong> ' + (dados.telefone || '-') + ' &nbsp;|&nbsp; <strong>Modelo:</strong> ' + (dados.tipo || 'Regular') + ' (' + (dados.segmento || 'Ensino Fundamental e Médio') + ')';
      }

      if (window.BI_DECISION_ENGINE && typeof window.BI_DECISION_ENGINE.renderizarDossieEscola === 'function') {
        window.BI_DECISION_ENGINE.renderizarDossieEscola(dados.cie, dados);
      }
    }

    function atualizarKpisSuperioresHomeParaEscola(dados) {
      const kpiEscolas = document.getElementById('kpi-escolas');
      const lblEscolas = document.getElementById('kpi-lbl-escolas');
      const ctxEscolas = document.getElementById('kpi-ctx-escolas');

      /* SEOM */
      const kpiObrasHome = document.getElementById('kpi-obras-home');
      const lblObrasHome = document.getElementById('kpi-lbl-obras-home');
      const kpiAvcbHome = document.getElementById('kpi-avcb-home');
      const lblAvcbHome = document.getElementById('kpi-lbl-avcb-home');

      /* SEINTEC */
      const kpiHw = document.getElementById('kpi-hardware-home');
      const lblHw = document.getElementById('kpi-lbl-hardware');
      const kpiCallsHome = document.getElementById('kpi-chamados-home');
      const lblCallsHome = document.getElementById('kpi-lbl-chamados-home');

      /* SEAFIN */
      const kpiRec = document.getElementById('kpi-recursos-sefin');
      const lblRec = document.getElementById('kpi-lbl-recursos-sefin');
      const kpiExec = document.getElementById('kpi-execucao-sefin');
      const lblExec = document.getElementById('kpi-lbl-execucao-sefin');

      /* SEGRE */
      const kpiMatriculasHome = document.getElementById('kpi-matriculas-home');
      const lblMatriculasHome = document.getElementById('kpi-lbl-matriculas-home');
      const kpiEmailsHome = document.getElementById('kpi-emails-home');
      const lblEmailsHome = document.getElementById('kpi-lbl-emails-home');

      /* SEPES */
      const kpiRep = document.getElementById('kpi-repasses-sefin');
      const lblRep = document.getElementById('kpi-lbl-repasses-sefin');
      const kpiSeapeHome = document.getElementById('kpi-seape-home');
      const lblSeapeHome = document.getElementById('kpi-lbl-seape-home');

      const setCtx = function(id, txt, cls) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = txt;
        el.className = 'kpi-ctx-line' + (cls ? (' ' + cls) : '');
      };

      /* Se dados for nulo ou indefinido, restaura a visao consolidada de TODA a rede de 60 escolas */
      if (!dados) {
        if (kpiEscolas) kpiEscolas.textContent = '60';
        if (lblEscolas) lblEscolas.textContent = 'REDE ESTADUAL • URE ITAPEVI';
        setCtx('kpi-ctx-escolas', '12 Críticas • 10 Alto Risco • 38 Regulares', 'ctx-ok');

        /* SEOM */
        const obrasTot = (typeof DADOS_SEOM !== 'undefined' && Array.isArray(DADOS_SEOM.escolas))
          ? DADOS_SEOM.escolas.filter(e => e.obraFde == 1 || e.obraFde == 2).length : 34;
        if (kpiObrasHome) kpiObrasHome.textContent = obrasTot.toLocaleString('pt-BR');
        if (lblObrasHome) lblObrasHome.textContent = 'Obras FDE & Manutenção';
        setCtx('kpi-ctx-obras', '14 ativas • 20 previstas • 26 sem obra');

        const avcbTot = (typeof DADOS_SEOM !== 'undefined' && Array.isArray(DADOS_SEOM.escolas))
          ? DADOS_SEOM.escolas.filter(e => e.avcb == 0 || e.avcb == 'Vencido' || e.avcb == false).length : 49;
        if (kpiAvcbHome) kpiAvcbHome.textContent = avcbTot.toLocaleString('pt-BR');
        if (lblAvcbHome) lblAvcbHome.textContent = 'Alerta AVCB & Estrutural';
        setCtx('kpi-ctx-avcb', avcbTot + ' pendentes • ' + (60 - avcbTot) + ' regulares • 18 alertas', avcbTot > 20 ? 'ctx-warn' : 'ctx-ok');

        /* SEINTEC */
        const hwTot = (window.INVENTARIO_COMPLETO_TUPLES && window.INVENTARIO_COMPLETO_TUPLES.hardware && window.INVENTARIO_COMPLETO_TUPLES.hardware.length > 0) ? window.INVENTARIO_COMPLETO_TUPLES.hardware.length : 15973;
        if (kpiHw) kpiHw.textContent = hwTot.toLocaleString('pt-BR');
        if (lblHw) lblHw.textContent = 'Parque de Equipamentos';
        setCtx('kpi-ctx-hardware', '76,4% disponíveis • 3.768 em reparo/baixa');

        const callsTotHome = (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros) && SEINTEC_BASES_CONFIG['Atendimentos'].registros.length > 0)
          ? SEINTEC_BASES_CONFIG['Atendimentos'].registros.length : 1432;
        if (kpiCallsHome) kpiCallsHome.textContent = callsTotHome.toLocaleString('pt-BR');
        if (lblCallsHome) lblCallsHome.textContent = 'Chamados & Nível de Serviço';
        setCtx('kpi-ctx-chamados', '22 em aberto • SLA 98,5% concluído');

        /* SEAFIN */
        const sefinK = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN.kpisPorAno && DADOS_FINANCEIROS_SEFIN.kpisPorAno['2026'] && DADOS_FINANCEIROS_SEFIN.kpisPorAno['2026'].totalReceita > 0)
          ? DADOS_FINANCEIROS_SEFIN.kpisPorAno['2026']
          : { totalReceita: 10365829.83, totalDespesa: 5401990.45, taxaExecucao: 52.1, totalRepasses: 204 };
        const recFmt = typeof formatarMoedaAbreviada === 'function' ? formatarMoedaAbreviada(sefinK.totalReceita) : ('R$ ' + (sefinK.totalReceita / 1e6).toFixed(1).replace('.', ',') + 'M');
        const despFmt = typeof formatarMoedaAbreviada === 'function' ? formatarMoedaAbreviada(sefinK.totalDespesa) : ('R$ ' + (sefinK.totalDespesa / 1e6).toFixed(2).replace('.', ',') + 'M');
        const execPctFmt = (sefinK.taxaExecucao || 0).toFixed(1).replace('.', ',') + '%';
        if (kpiRec) kpiRec.textContent = recFmt;
        if (lblRec) lblRec.textContent = 'Recursos PDDE (APM 2026)';
        setCtx('kpi-ctx-recursos', 'Saldo ocioso APM: R$ 4,96M (47,9%)');

        if (kpiExec) kpiExec.textContent = execPctFmt;
        if (lblExec) lblExec.textContent = 'Taxa de Execução Orçamentária';
        setCtx('kpi-ctx-execucao', 'R$ 5,4M gastos • 5 contratos a vencer (≤60d)');

        /* SEGRE */
        const sematTot = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.kpis && DADOS_SEMAT.kpis.totalAtendimentos > 0) ? DADOS_SEMAT.kpis.totalAtendimentos : 2898;
        if (kpiMatriculasHome) kpiMatriculasHome.textContent = sematTot.toLocaleString('pt-BR');
        if (lblMatriculasHome) lblMatriculasHome.textContent = 'Demanda & Matrícula (SEMAT)';
        setCtx('kpi-ctx-matriculas', '2.331 manuais • 4.062 transferências');

        const segreEmails = (typeof DADOS_SEGRE !== 'undefined' && DADOS_SEGRE.kpis && DADOS_SEGRE.kpis.totalEmails > 0) ? DADOS_SEGRE.kpis.totalEmails : 162;
        if (kpiEmailsHome) kpiEmailsHome.textContent = segreEmails.toLocaleString('pt-BR');
        if (lblEmailsHome) lblEmailsHome.textContent = 'Processos SEI Abertos';
        setCtx('kpi-ctx-emails', '101 ativos >30 dias • 9.025 demandas');

        /* SEPES */
        const sefrepDevsGlobal = (typeof DADOS_SEFREP !== 'undefined' && DADOS_SEFREP && DADOS_SEFREP.kpis && DADOS_SEFREP.kpis.totalDevolucoes > 0) ? DADOS_SEFREP.kpis.totalDevolucoes : 333;
        if (kpiRep) kpiRep.textContent = sefrepDevsGlobal.toLocaleString('pt-BR');
        if (lblRep) lblRep.textContent = 'Folha de Pagamento (SEFREP)';
        setCtx('kpi-ctx-repasses', 'Taxa de devolução: 24,1% (333 dev.)', 'ctx-warn');

        const seapeProc = (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && DADOS_SEPES.kpis && DADOS_SEPES.kpis.totalEmTramitacao > 0) ? DADOS_SEPES.kpis.totalEmTramitacao : 72;
        if (kpiSeapeHome) kpiSeapeHome.textContent = seapeProc.toLocaleString('pt-BR');
        if (lblSeapeHome) lblSeapeHome.textContent = 'Vida Funcional & Benefícios';
        setCtx('kpi-ctx-seape', 'Aposentadorias, Designações e Abonos');
        return;
      }

      /* Visao filtrada com DADOS REAIS multissetoriais da escola selecionada */
      const fatoEsc = (window.BI_DECISION_ENGINE && typeof window.BI_DECISION_ENGINE.obterFatoEscola === 'function')
        ? window.BI_DECISION_ENGINE.obterFatoEscola(dados.cie)
        : null;

      if (kpiEscolas) kpiEscolas.textContent = fatoEsc ? (fatoEsc.imro + ' pts') : '1';
      if (lblEscolas) lblEscolas.textContent = fatoEsc ? (fatoEsc.escola || ('Escola CIE ' + dados.cie)) : ('Escola: CIE ' + (dados.cie || '---'));
      if (ctxEscolas) ctxEscolas.textContent = fatoEsc ? (fatoEsc.tier + ' • CIE ' + fatoEsc.cie + ' • ' + fatoEsc.cidade) : ('CIE: ' + dados.cie);

      const fmtCurto = function(v) {
        const n = Number(v || 0);
        if (n >= 1e6) return 'R$ ' + (n / 1e6).toFixed(2).replace('.', ',') + 'M';
        if (n >= 1000) return 'R$ ' + Math.round(n / 1000).toLocaleString('pt-BR') + ' mil';
        return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
      };

      /* SEINTEC */
      if (kpiHw) kpiHw.textContent = (dados.hwTotal || 0).toLocaleString('pt-BR');
      if (lblHw) lblHw.textContent = 'Equipamentos da Unidade';
      if (kpiCallsHome) kpiCallsHome.textContent = (dados.callsTotal || 0).toLocaleString('pt-BR');
      if (lblCallsHome) lblCallsHome.textContent = 'Chamados Técnicos';

      if (fatoEsc) {
        /* SEOM */
        var hasAvcbWarn = (fatoEsc.flags && fatoEsc.flags.SEOM && fatoEsc.flags.SEOM.some(f => f.toLowerCase().includes('avcb')));
        if (kpiObrasHome) kpiObrasHome.textContent = (fatoEsc.flags && fatoEsc.flags.SEOM) ? fatoEsc.flags.SEOM.length : 0;
        if (lblObrasHome) lblObrasHome.textContent = 'Alertas Prediais SEOM';
        if (kpiAvcbHome) kpiAvcbHome.textContent = hasAvcbWarn ? 'Pendente' : 'Regular';
        if (lblAvcbHome) lblAvcbHome.textContent = 'Situação do AVCB';

        /* SEAFIN */
        if (kpiRec) kpiRec.textContent = fmtCurto(fatoEsc.rec2026);
        if (lblRec) lblRec.textContent = 'PDDE 2026 da Unidade';
        if (kpiExec) kpiExec.textContent = (fatoEsc.execPct2026 || 0).toFixed(1).replace('.', ',') + '%';
        if (lblExec) lblExec.textContent = 'Execução Orçamentária';

        /* SEGRE */
        if (kpiMatriculasHome) kpiMatriculasHome.textContent = (fatoEsc.segreAtend || 0).toLocaleString('pt-BR');
        if (lblMatriculasHome) lblMatriculasHome.textContent = 'Atendimentos SEMAT';
        if (kpiEmailsHome) kpiEmailsHome.textContent = (fatoEsc.segreAbertos || 0).toLocaleString('pt-BR');
        if (lblEmailsHome) lblEmailsHome.textContent = 'Processos SEI Abertos';

        /* SEPES */
        if (kpiRep) kpiRep.textContent = (fatoEsc.sefrepDevolucoes || 0).toLocaleString('pt-BR');
        if (lblRep) lblRep.textContent = 'Devoluções Folha (SEFREP)';
        if (kpiSeapeHome) kpiSeapeHome.textContent = (fatoEsc.sepesPend || 0).toLocaleString('pt-BR');
        if (lblSeapeHome) lblSeapeHome.textContent = 'Processos SEAPE Ativos';

        /* Contextos específicos */
        setCtx('kpi-ctx-obras', (fatoEsc.flags.SEOM || []).slice(0, 2).join(' • ') || 'Sem intervenção crítica registrada', fatoEsc.pts.SEOM >= 40 ? 'ctx-alert' : 'ctx-ok');
        setCtx('kpi-ctx-avcb', hasAvcbWarn ? 'Exige renovação junto ao Corpo de Bombeiros' : 'Certificado AVCB válido', hasAvcbWarn ? 'ctx-alert' : 'ctx-ok');
        setCtx('kpi-ctx-hardware', (dados.hwDisp || 0) + ' disp. • ' + fatoEsc.hwBad + ' em reparo/baixa', fatoEsc.hwBad >= 60 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-chamados', (dados.callsConc || 0) + ' concluídos • ' + (dados.callsPend || 0) + ' abertos', (dados.callsPend || 0) > 2 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-recursos', 'Saldo ocioso APM: ' + fmtCurto(fatoEsc.saldoOcioso2026), fatoEsc.saldoOcioso2026 > 50000 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-execucao', 'Gastos realizados: ' + fmtCurto(fatoEsc.desp2026), fatoEsc.rec2026 > 0 && fatoEsc.execPct2026 < 45 ? 'ctx-alert' : 'ctx-ok');
        setCtx('kpi-ctx-matriculas', 'Atendimentos e matrículas na unidade escolar', 'ctx-ok');
        setCtx('kpi-ctx-emails', fatoEsc.segreAbertos > 0 ? (fatoEsc.segreAbertos + ' SEI em tramitação na rede') : 'Sem pendência SEI ativa', fatoEsc.segreAbertos > 0 ? 'ctx-warn' : 'ctx-ok');
        var sefrepUnitTxt = (fatoEsc.sefrepDevolucoes > 0) ? (fatoEsc.sefrepDevolucoes + ' inconsistências na folha') : 'Folha regular (0 devoluções)';
        setCtx('kpi-ctx-repasses', sefrepUnitTxt, fatoEsc.sefrepDevolucoes >= 2 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-seape', (fatoEsc.sepesPend || 0) + ' demandas funcionais ativas', fatoEsc.sepesPend >= 2 ? 'ctx-warn' : 'ctx-ok');
      }
    }

    function atualizarSetoresHomeParaEscola(dados) {
      /* SEINTEC */
      const sHw = document.getElementById('home-seintec-m1');
      const sDisp = document.getElementById('home-seintec-m2');
      const sManut = document.getElementById('home-seintec-m3');
      const sStatus = document.getElementById('home-seintec-status');

      if (sHw) sHw.textContent = dados.hwTotal.toLocaleString('pt-BR');
      if (sDisp) sDisp.textContent = dados.hwDisp.toLocaleString('pt-BR');
      if (sManut) sManut.textContent = dados.hwManut.toLocaleString('pt-BR');
      if (sStatus) sStatus.textContent = '🟢 ' + dados.hwPctDisp + '% Disp.';

      /* ASURE */
      const aM1 = document.getElementById('home-asure-m1');
      const aM2 = document.getElementById('home-asure-m2');
      const aM3 = document.getElementById('home-asure-m3');
      const aStatus = document.getElementById('home-asure-status');
      const aLbl1 = document.getElementById('home-asure-lbl1');
      const aLbl2 = document.getElementById('home-asure-lbl2');

      if (aM1) aM1.textContent = dados.callsTotal;
      if (aLbl1) aLbl1.textContent = 'Chamados SEINTEC';
      if (aM2) aM2.textContent = dados.callsConc;
      if (aLbl2) aLbl2.textContent = 'Concluídos';
      if (aM3) aM3.textContent = dados.callsTotal > 0 ? ((dados.callsConc / dados.callsTotal) * 100).toFixed(0) + '%' : '100%';
      if (aStatus) aStatus.textContent = dados.emAtencao ? '🟡 Em Atenção' : '🟢 Alinhado';

      /* SEAFIN */
      const sfM1 = document.getElementById('home-seafin-m1');
      const sfStatus = document.getElementById('home-seafin-status');
      if (sfM1) sfM1.textContent = dados.emAtencao ? '1' : '0';
      if (sfStatus) sfStatus.textContent = dados.emAtencao ? '🟡 Manutenção Foco' : '🟢 Regular';

      /* SEGRE */
      const sgM1 = document.getElementById('home-segre-m1');
      const sgLbl1 = document.getElementById('home-segre-lbl1');
      const sgStatus = document.getElementById('home-segre-status');
      if (sgM1) sgM1.textContent = '1';
      if (sgLbl1) sgLbl1.textContent = dados.tipo;
      if (sgStatus) sgStatus.textContent = '🟢 Polo Ativo';
    }

    function destacarAtencaoHomeParaEscola(dados) {
      const cards = document.querySelectorAll('#home-atencao-grid .atencao-card');
      cards.forEach(el => {
        if (!el) return;
        const cardCie = el.getAttribute('data-cie') || el.id || '';
        if (dados && dados.cie && cardCie.includes(dados.cie)) {
          el.style.border = '2px solid #ef4444';
          el.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.35)';
          el.style.opacity = '1';
        } else {
          el.style.border = '1px solid #e2e8f0';
          el.style.boxShadow = 'none';
          el.style.opacity = (dados && dados.emAtencao) ? '0.45' : '1';
        }
      });
      if (window.BI_DECISION_ENGINE && typeof window.BI_DECISION_ENGINE.destacarEscolaNoQuadrante === 'function') {
        window.BI_DECISION_ENGINE.destacarEscolaNoQuadrante(dados ? dados.cie : null);
      }
    }

    function restaurarVisaoConsolidadaHome() {
      const spotlight = document.getElementById('home-school-spotlight');
      if (spotlight) spotlight.style.display = 'none';

      /* Restaura os 10 cards setoriais e a faixa macro da governança */
      atualizarKpisSuperioresHomeParaEscola(null);

      /* Restaurar Atenção */
      const cards = document.querySelectorAll('#home-atencao-grid .atencao-card');
      cards.forEach(el => {
        if (el) {
          el.style.border = '';
          el.style.boxShadow = '';
          el.style.opacity = '1';
        }
      });
      if (window.BI_DECISION_ENGINE && typeof window.BI_DECISION_ENGINE.atualizar === 'function') {
        window.BI_DECISION_ENGINE.atualizar(null);
      }
    }

    /* ========================================================= */
    /* FILTRO DE NÚCLEOS DA MATRIZ DE TELEMETRIA SETORIAL (HOME) */
    /* ========================================================= */
    function filtrarKpisSetoriais(setor) {
      /* Atualiza classes ativas dos botões pill */
      var pills = document.querySelectorAll('.kpi-sector-filters .kpi-filter-pill');
      pills.forEach(function(p) {
        if (p.id === 'pill-kpi-' + setor) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      /* Exibe ou oculta os blocos setoriais */
      var cards = document.querySelectorAll('#home-sector-pillars-grid .sector-pillar-card');
      cards.forEach(function(card) {
        var cardSetor = card.getAttribute('data-setor');
        if (setor === 'todos' || cardSetor === setor) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function destacarCentroNaHome(sigla) {
      const mapaIds = {
        'SEINTEC': 'row-setor-seintec',
        'ASURE': 'row-setor-asure',
        'CAF': 'row-setor-seafin',
        'SEAFIN': 'row-setor-seafin',
        'SEOM': 'row-setor-seom',
        'SEGRE': 'row-setor-segre',
        'SEPES': 'row-setor-sepes',
        'EEC': 'row-setor-eec'
      };

      const todosIds = Object.values(mapaIds);
      const alvoId = mapaIds[sigla];

      todosIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === alvoId) {
          el.style.background = '#fef3c7';
          el.style.boxShadow = 'inset 4px 0 0 #f59e0b, 0 4px 12px rgba(245, 158, 11, 0.15)';
          el.style.opacity = '1';
        } else {
          el.style.background = 'transparent';
          el.style.boxShadow = 'none';
          el.style.opacity = '0.55';
        }
      });

      if (alvoId) {
        const row = document.getElementById(alvoId);
        if (row) {
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    function limparDestaqueCentrosHome() {
      const todosIds = [
        'row-setor-seintec', 'row-setor-asure', 'row-setor-seafin',
        'row-setor-seom', 'row-setor-segre', 'row-setor-sepes', 'row-setor-eec'
      ];
      todosIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.background = '';
          el.style.boxShadow = '';
          el.style.opacity = '1';
        }
      });
    }

    
    /* Formatação executiva de nomenclatura de escolas */
    function formatarNomeEscolaExecutivo(nomeBruto) {
      if (!nomeBruto) return '';
      let n = nomeBruto.trim();
      if (n.toLowerCase() === 'ure') return 'URE';
      n = n.replace(/^E\.?E\.?\s+/i, '');
      if (/^Deputad[oa]\s+/i.test(n)) n = n.replace(/^Deputad([oa])\s+(.*)/i, '$2, Deputad$1');
      else if (/^Padr?e\s+/i.test(n)) n = n.replace(/^Padr?e\s+(.*)/i, '$1, Padre');
      else if (/^Doutora\s+/i.test(n) || /^Dra\.?\s+/i.test(n)) n = n.replace(/^(Doutora|Dra\.?)\s+(.*)/i, '$2, Doutora');
      else if (/^Doutor\s+/i.test(n) || /^Dr\.?\s+/i.test(n)) n = n.replace(/^(Doutor|Dr\.?)\s+(.*)/i, '$2, Doutor');
      else if (/^Professora\s+/i.test(n) || /^Profa\.?\s+/i.test(n)) n = n.replace(/^(Professora|Profa\.?)\s+(.*)/i, '$2, Professora');
      else if (/^Professor\s+/i.test(n) || /^Prof\.?\s+/i.test(n)) n = n.replace(/^(Professor|Prof\.?)\s+(.*)/i, '$2, Professor');
      else if (/^Estudante\s+/i.test(n)) n = n.replace(/^Estudante\s+(.*)/i, '$1, Estudante');
      
      if (/\s+Professora$/i.test(n) && !/,\s*Professora$/i.test(n)) n = n.replace(/\s+(Professora)$/i, ', Professora');
      else if (/\s+Professor$/i.test(n) && !/,\s*Professor$/i.test(n)) n = n.replace(/\s+(Professor)$/i, ', Professor');
      else if (/\s+Doutora$/i.test(n) && !/,\s*Doutora$/i.test(n)) n = n.replace(/\s+(Doutora)$/i, ', Doutora');
      else if (/\s+Doutor$/i.test(n) && !/,\s*Doutor$/i.test(n)) n = n.replace(/\s+(Doutor)$/i, ', Doutor');
      else if (/\s+Estudante$/i.test(n) && !/,\s*Estudante$/i.test(n)) n = n.replace(/\s+(Estudante)$/i, ', Estudante');
      else if (/\s+Deputad([oa])$/i.test(n) && !/,\s*Deputad[oa]$/i.test(n)) n = n.replace(/\s+Deputad([oa])$/i, ', Deputad$1');
      else if (/\s+Padre$/i.test(n) && !/,\s*Padre$/i.test(n)) n = n.replace(/\s+(Padre)$/i, ', Padre');
      return n;
    }

    function rolarParaNotaMetodologica() {
      const nota = document.getElementById('nota-metodologica-imro');
      if (nota) {
        nota.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nota.style.border = '2px solid #38bdf8';
        setTimeout(() => { nota.style.border = '1px solid #1e293b'; }, 2500);
      }
    }
  
    function filtrarCardsAtencao(setor, btn) {
      document.querySelectorAll('.btn-filtro-atencao').forEach(b => {
        b.style.background = '#ffffff';
        b.style.color = '#475569';
        b.style.borderColor = '#cbd5e1';
      });
      if (btn) {
        btn.style.background = '#0b2351';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#0b2351';
      }
      const cards = document.querySelectorAll('.atencao-card');
      let visiveis = 0;
      cards.forEach(card => {
        const cardSetor = card.getAttribute('data-setor');
        if (setor === 'TODOS' || cardSetor === setor) {
          card.style.display = 'flex';
          visiveis++;
        } else {
          card.style.display = 'none';
        }
      });
      const counter = document.getElementById('atencao-counter-badge');
      if (counter) {
        counter.textContent = visiveis + ' Unidades ' + (setor === 'TODOS' ? 'Prioritárias' : 'em ' + setor);
      }
    }

    function filtrarHomePorTipoKPI(tipo) {
      if (tipo === 'escolas') {
        limparFiltrosHome();
        const kpi = document.getElementById('kpi-escolas');
        if (kpi) kpi.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (tipo === 'hardware' || tipo === 'chamados') {
        destacarCentroNaHome('SEINTEC');
      } else if (tipo === 'sefin') {
        destacarCentroNaHome('SEAFIN');
      } else if (tipo === 'seom') {
        destacarCentroNaHome('SEOM');
      } else if (tipo === 'segre') {
        destacarCentroNaHome('SEGRE');
      } else if (tipo === 'sepes') {
        destacarCentroNaHome('SEPES');
      } else if (tipo === 'visitas') {
        const gauge = document.getElementById('home-gauge-pct');
        if (gauge) gauge.scrollIntoView({ behavior: 'smooth', block: 'center' });
        destacarCentroNaHome('ASURE');
      } else if (tipo === 'atencao') {
        const grid = document.getElementById('home-atencao-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function limparFiltrosHome() {
      const selectEscola = document.getElementById('home-filter-escola');
      if (selectEscola) selectEscola.value = '';
      const searchInput = document.getElementById('home-search-input');
      if (searchInput) searchInput.value = '';
      const selectCentro = document.getElementById('home-filter-centro');
      if (selectCentro) selectCentro.value = '';

      restaurarVisaoConsolidadaHome();
      limparDestaqueCentrosHome();
    }

    function mostrarHome() {
      esconderTodasAsPanes();
      document.getElementById('pane-home').classList.add('active');
      document.getElementById('side-btn-home').classList.add('active');
      atualizarBreadcrumbTopo('');
      rolarAoTopoSuave();
    }

    function abrirCentro(siglaCentro) {
      if (siglaCentro === 'ASURE') {
        abrirAssessoriaTecnica();
        return;
      }
      if (siglaCentro === 'SEINTEC' || siglaCentro === 'CIE') {
        abrirSeintec();
        return;
      }
      const centro = ESTRUTURA_ORGANIZACIONAL[siglaCentro];
      if (!centro) return;

      /* Atualiza Header do Centro */
      const preTitleCentro = document.getElementById('banner-centro-pretitle');
      if (preTitleCentro) { preTitleCentro.innerText = ''; preTitleCentro.style.display = 'none'; }
      document.getElementById('banner-centro-nome').innerText = centro.nome;
      document.getElementById('banner-centro-desc').innerText = centro.descricao;
      document.getElementById('atual-centro-sigla').value = siglaCentro;
      const syncInfoCentro = document.getElementById('centro-drive-sync-info');
      if (syncInfoCentro) syncInfoCentro.innerText = 'SHAREPOINT INSTITUCIONAL • ' + siglaCentro + ' AO VIVO';
      const btnSyncCentro = document.getElementById('btn-sync-centro');
      if (btnSyncCentro) {
        btnSyncCentro.innerHTML = '<span class="sync-spin-icon" style="display:inline-flex;">' + (typeof biIcon === 'function' ? biIcon('refresh', 14) : '') + '</span> Sincronizar ' + siglaCentro;
        btnSyncCentro.title = 'Sincronizar dados, setores e arquivos do ' + siglaCentro;
      }

      /* Renderiza as abas de setores do Centro */
      const containerTabs = document.getElementById('container-setores-tabs');
      containerTabs.innerHTML = "";

      /* Limpa imediatamente o container dinâmico para eliminar qualquer resquício do centro anterior */
      const containerDinamicoInicial = document.getElementById('setor-conteudo-dinamico');
      if (containerDinamicoInicial) containerDinamicoInicial.innerHTML = "";

      if (siglaCentro === 'EEC') {
        /* Para EEC, a navegacao ocorre diretamente pelo Hub Executivo dos 6 Sistemas */
        containerTabs.style.display = 'none';
        selecionarSetor('EEC', 'INICIO', null);
      } else {
        containerTabs.style.display = 'flex';
        centro.setores.forEach((setor, index) => {
          const btn = document.createElement('button');
          btn.className = 'setor-tab-btn' + (index === 0 ? ' active' : '');
          btn.innerHTML = `<span>${setor.nome}</span>`;
          btn.onclick = function () {
            selecionarSetor(siglaCentro, setor.sigla, btn);
          };
          containerTabs.appendChild(btn);
        });

        /* Seleciona o primeiro setor por padrão */
        selecionarSetor(siglaCentro, centro.setores[0].sigla, containerTabs.children[0]);
      }

      /* Alterna Views */
      esconderTodasAsPanes();
      document.getElementById('pane-centro').classList.add('active');
      atualizarBreadcrumbTopo('04 - Visão do Centro Regional');

      /* Atualiza Sidebar */
      document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));
      const sideBtn = document.getElementById(`side-btn-${siglaCentro}`) || 
                      (siglaCentro === 'SEAFIN' ? document.getElementById('side-btn-CAF') : null) ||
                      (siglaCentro === 'SEOM' ? document.getElementById('side-btn-SEOM') : null) ||
                      (siglaCentro === 'SEGRE' ? document.getElementById('side-btn-SEGRE') : null) ||
                      (siglaCentro === 'SEPES' ? document.getElementById('side-btn-SEPES') : null) ||
                      (siglaCentro === 'EEC' ? document.getElementById('side-btn-EEC') : null) ||
                      (siglaCentro === 'ASURE' ? document.getElementById('side-btn-ASURE') : null);
      if (sideBtn) sideBtn.classList.add('active');

      rolarAoTopoSuave();
    }

    function selecionarSetor(siglaCentro, siglaSetor, botaoClicado) {
      const centro = ESTRUTURA_ORGANIZACIONAL[siglaCentro];
      if (!centro) return;
      const setor = centro.setores.find(s => s.sigla === siglaSetor);
      if (!setor) return;

      /* Atualiza Abas */
      document.querySelectorAll('.setor-tab-btn').forEach(b => b.classList.remove('active'));
      if (botaoClicado) botaoClicado.classList.add('active');

      /* Atualiza Painel do Setor */
      const elSigla = document.getElementById('atual-setor-sigla');
      if (elSigla) elSigla.value = siglaSetor;
      const elTitulo = document.getElementById('setor-ativo-titulo');
      if (elTitulo) elTitulo.innerText = `📂 ${setor.nome}`;
      const elDesc = document.getElementById('setor-ativo-desc');
      if (elDesc) elDesc.innerText = setor.desc;

      /* Limpeza obrigatória do container dinâmico para isolamento total entre setores e centros */
      const containerDinamico = document.getElementById('setor-conteudo-dinamico');
      if (containerDinamico) containerDinamico.innerHTML = '';

      if (siglaSetor === 'SEFIN') {
        renderizarDashboardFinanceiroSefin();
      } else if (siglaSetor === 'SECOMSE') {
        renderizarDashboardSecomse();
      } else if (siglaSetor === 'DPAT' || siglaSetor === 'SEPAT') {
        renderizarDashboardDpat();
      } else if (siglaSetor === 'SEOM') {
        renderizarDashboardSeom();
      } else if (siglaSetor === 'SEFISC') {
        renderizarDashboardSefisc();
      } else if (siglaSetor === 'SEMAT') {
        renderizarDashboardSemat();
      } else if (siglaSetor === 'SEVESC') {
        renderizarDashboardSevesc();
      } else if (siglaSetor === 'SEGRE' || siglaCentro === 'SEGRE') {
        renderizarDashboardSegre();
      } else if (siglaSetor === 'SEAPE' || siglaSetor === 'SEPES' || (siglaCentro === 'SEPES' && siglaSetor !== 'SEFREP')) {
        renderizarDashboardSepes();
      } else if (siglaSetor === 'SEFREP') {
        renderizarDashboardSefrep();
      } else if (siglaCentro === 'EEC' || siglaSetor === 'SAEB' || (typeof MODULOS_EEC !== 'undefined' && MODULOS_EEC[siglaSetor])) {
        renderizarModuloEec(siglaSetor);
      } else {
        if (containerDinamico) {
          containerDinamico.innerHTML = `
            <div style="margin-top: 0.75rem;">
              <div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); border: 2px solid #f09b0c; border-radius: 16px; padding: 1.3rem 1.5rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                    <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">${setor.nome}</h2>
                    <span style="background: #dbeafe; color: #1e40af; border: 1.5px solid #3b82f6; font-size: 0.76rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">${siglaCentro} • URE ITAPEVI</span>
                  </div>
                  <p style="font-size: 0.86rem; color: #f1f5f9; margin: 0; max-width: 820px; line-height: 1.45; font-weight: 500;">
                    ${setor.desc}
                  </p>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                  <span style="background: rgba(255,255,255,0.12); color: #ffffff; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.25);">
                    ☁️ ${centro.driveFolder || ('Uploads ' + siglaCentro)}
                  </span>
                </div>
              </div>
            </div>
          `;
        }
      }

      /* Limpa seleções anteriores */
      limparTodosArquivosCentro();
    }

    /* === SELEÇÃO E PREVIEW DE ARQUIVOS === */

    let arquivosSelecionadosCentro = [];

    function aoSelecionarArquivosCentro(event) {
      const input = event.target;
      if (!input.files || input.files.length === 0) return;

      Array.from(input.files).forEach(novo => {
        const jaExiste = arquivosSelecionadosCentro.some(existente => existente.name === novo.name && existente.size === novo.size);
        if (!jaExiste) arquivosSelecionadosCentro.push(novo);
      });

      renderizarListaArquivosCentro();
    }

    function renderizarListaArquivosCentro() {
      const container = document.getElementById('centro-selected-files-list');
      const toolbar = document.getElementById('centro-upload-toolbar');
      const dropzoneLabel = document.getElementById('dropzone-main-label');

      if (!container) return;
      container.innerHTML = "";

      if (arquivosSelecionadosCentro.length === 0) {
        toolbar.style.display = 'none';
        dropzoneLabel.innerText = 'Clique para selecionar ou arraste seus arquivos aqui (Excel e PDF)';
        return;
      }

      toolbar.style.display = 'flex';
      dropzoneLabel.innerText = `${arquivosSelecionadosCentro.length} arquivo(s) selecionado(s) no Centro`;

      arquivosSelecionadosCentro.forEach((file, index) => {
        const ext = file.name.toLowerCase();
        const isExcel = ext.endsWith('.xlsx') || ext.endsWith('.xls') || ext.endsWith('.csv');
        const isPdf = ext.endsWith('.pdf');

        const card = document.createElement('div');
        card.className = `file-item-card ${isExcel ? 'is-excel' : (isPdf ? 'is-pdf' : '')}`;

        let iconBox = isExcel
          ? `<div class="file-item-icon-box file-icon-excel">📊</div>`
          : (isPdf ? `<div class="file-item-icon-box file-icon-pdf">📕</div>` : `<div class="file-item-icon-box" style="background:#f1f5f9;">📄</div>`);

        let pill = isExcel
          ? `<span class="file-badge-pill pill-excel">Planilha Excel</span>`
          : (isPdf ? `<span class="file-badge-pill pill-pdf">Documento PDF</span>` : `<span class="file-badge-pill">Arquivo</span>`);

        let actionPdf = isPdf ? `<button class="btn-file-action" onclick="visualizarPdfDoCentro(${index})"><span>👁️ Ver PDF</span></button>` : '';

        card.innerHTML = `
          <div class="file-item-left">
            ${iconBox}
            <div class="file-item-details">
              <span class="file-item-title" title="${file.name}">${file.name}</span>
              <div class="file-item-meta">
                <span>${formatarTamanhoBytes(file.size)}</span>
                ${pill}
              </div>
            </div>
          </div>
          <div class="file-item-actions">
            ${actionPdf}
            <button class="btn-file-action btn-remove" onclick="removerArquivoCentro(${index})" title="Remover">✕</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function removerArquivoCentro(index) {
      if (index >= 0 && index < arquivosSelecionadosCentro.length) {
        arquivosSelecionadosCentro.splice(index, 1);
        renderizarListaArquivosCentro();
      }
    }

    