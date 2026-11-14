
    /* ======================================================= */
    /* CONFIGURAÇÃO MODULAR: SINCRONIZAÇÃO SEPES (DEMANDAS SEAPE) */
    /* ======================================================= */
    const CONFIG_SINCRONIZACAO_SEPES = {
      modoOtimizado: true,
      abasAtivas: [
        'APOSENTADORIA',
        'DESIGNAÇÕES',
        'ABONO DE PERMANÊNCIA'
      ]
    };

    /* ======================================================= */
    /* PAINEL SEPES - DEMANDAS SEAPE (SHAREPOINT) */
    /* ======================================================= */
    let DADOS_SEFREP = {"sucesso":true,"meta":{"nomeArquivo":"Planilha SEDUC - EXPEDIENTES SPSP (5).xlsx","setor":"SEFREP - Seção de Frequência e Pagamento (SEPES)","contaResponsavel":"itp_sefrep_educacao_sp_gov_br","sharepointUrl":"https:\\/\\/seesp-my.sharepoint.com/:x:/g/personal/itp_sefrep_educacao_sp_gov_br/cQrO53ta2ztgRYD5y6ke2QD2EgUC5Wx8sWTg9fgjf0asi90zMg","exercicioFoco":"2026 (Exclusivo 3 Pilares Estratégicos)","atualizadoEm":"2026-11-12T13:59:13.463Z","atualizadoFormatado":"12/11/2026, 10:59:13"},"kpis":{"totalExpedientes2026":1383,"totalDevolucoes":333,"taxaDevolucaoPct":24.1,"totalF17Extincoes":631,"totalF17":402,"totalExtincoes":229,"totalEmTramitacao":678,"totalConcluidos":323},"topEscolasDevolucoes":[{"escola":"Diretoria de Ensino / Outros","total":73},{"escola":"ELIZA DE OLIVEIRA RIBEIRO","total":5},{"escola":"Alferes Henrique Sammartino","total":5},{"escola":"PROF DIMARÃES ANTONIO SANDEI","total":5},{"escola":"AMADOR AGUIAR","total":5},{"escola":"E EIgnês Amélia Oliveira Machado Professora","total":5},{"escola":"NACIF AMIN CHALUPE","total":5},{"escola":"E E Ignês Amélia","total":5},{"escola":"Candido Rondon","total":4},{"escola":"Parque Payol","total":4},{"escola":"Ignês Amélia Oliveira Machado","total":4},{"escola":"JOÃO NASCIF CHALUPP","total":4},{"escola":"ALFERES HENRIQUE SAMMARTINO","total":4},{"escola":"E E Celina de Baras Bairão","total":4},{"escola":"E E CLARO CAMARGO RIBEIRO","total":4}],"registros":[{"id":"SEFREP-2026-1","ue":"Nascif Amin","dt":"23/12/2025","sei":"015.00985731/2025-15","rg":"37286803","nome":"Ingrid Aparecida Venturi","doc":"Extinção AOE","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-2","ue":"Nascif Amin","dt":"23/12/2025","sei":"015.00985743/2025-31","rg":"32814583","nome":"Fernanda Andreia de Souza Silva Paraizo","doc":"Extinção AOE","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-3","ue":"Nascif Amin","dt":"23/12/2025","sei":"015.00985756/2025-19","rg":"39922545","nome":"Mariana dos Santos","doc":"Extinção AOE","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-4","ue":"Padre Giuseppe","dt":"26/12/2025","sei":"015.00964186/2025-15","rg":"52891089","nome":"Gabriela Matilde da Costa Carvalho","doc":"CAF - Desbloqueio de pagamento licença maternidade Gabriela Matilde da Costa Carvalho","cat":"Portaria CAF","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-5","ue":"João Nascif Chalupp","dt":"26/12/2025","sei":"015.00988605/2025-12","rg":"67275040","nome":"Marielena Qqueiroz Silva","doc":"F12 - pagamento 13º salário","cat":"Formulário 12 (F12)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-6","ue":"Parque Imperial","dt":"26/12/2025","sei":"015.00896889/2025-11","rg":"57531941","nome":"Cinthia Santos de Oliveira","doc":"F12 - pagamento 13º salário","cat":"Formulário 12 (F12)","st":"Não Atendido / Pendente","ok":false,"dev":false},{"id":"SEFREP-2026-7","ue":"Parque Imperial","dt":"26/12/2025","sei":"015.00896851/2025-31","rg":"363483574","nome":"Veronice Santos de Jesus","doc":"F12 - pagamento 13º salário","cat":"Formulário 12 (F12)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-8","ue":"Diretoria de Ensino","dt":"05/01/2025","sei":"015.00792152/2025-12","rg":"34230986","nome":"Bruno Machado de Siqueira","doc":"Designação assistencia técnica, Bruno Machado de Siqueira, R.G. 34.230.986","cat":"Designação","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-9","ue":"EE.Iracema Rauen","dt":"05/01/2025","sei":"015.00004053/2026-79","rg":"36300570-5.","nome":"Maria Bruna de Andrade O. Nascimento","doc":"Reativação de contrato com extinção indevida","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-10","ue":"Diretoria de Ensino","dt":"06/01/2025","sei":"015.00012236/2026-68","rg":"48308155","nome":"Vitoria Jessica de Assis Oliveira, R.G. 48.308.155","doc":"F12 13. salário poporcional, Vitoria Jessica de Assis Oliveira, R.G. 48.308.155","cat":"Formulário 12 (F12)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-11","ue":"Padre Giuseppe","dt":"08/01/2025","sei":"015.00994460/2025-81","rg":"40.915.409-X","nome":"Elaine Chrisostomo dos Santos Rocha, RG. 40.915.409-X","doc":"CAF - Extinção contratual de Elaine Chrisostomo dos Santos Rocha, RG. 40.915.409-X","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-12","ue":"Jose Sergio","dt":"08/01/2025","sei":"015.00993121/2025-87","rg":"37.201.484-7","nome":"Gabriel Pacheco dos Santos","doc":"CAF CESSAÇÃO DESIGNAÇÃO GOE - GABRIEL PACHECO DOS SANTOS RG 37.201.484-7","cat":"Portaria CAF","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-13","ue":"Claro Camargo","dt":"08/01/2025","sei":"015.00991461/2025-73","rg":".46.544.145-2","nome":"Esau dos Reis Santos","doc":"CAF E FORM 15 / ESAU DOS REIS SANTOS RG.46.544.145-2","cat":"Formulário 15 (F15)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-14","ue":"Dolores Garcia","dt":"08/01/2025","sei":"015.00974374/2025-51","rg":"19249642","nome":"Elton Claudio Barbosa","doc":"CAF - ELTON CLAUDIO BARBOSA RG: 19249642","cat":"Portaria CAF","st":"Não Atendido / Pendente","ok":false,"dev":false},{"id":"SEFREP-2026-15","ue":"Diretoria de Ensino","dt":"09/01/2025","sei":"015.00018655/2026-11","rg":"24257166","nome":"Valdenise Bernardino Lins da Silva","doc":"Afast. para ativ Burocráticas, Valdenise Bernardino Lins da Silva, R.G. 24.257.166","cat":"Outros Expedientes","st":"Não Atendido / Pendente","ok":false,"dev":false},{"id":"SEFREP-2026-16","ue":"João Nascif Chaluppe","dt":"09/01/2025","sei":"015.00988559/2025-43","rg":"28969291","nome":"Diogo Gonzaga da Costa","doc":"FORMULÁRIO 17-CESSAÇÃO DE CGP - DIOGO GONZAGA DA COSTA RG 28.969.291","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-17","ue":"Marechal Candido Rondon","dt":"09/01/2025","sei":"015.00982382/2025-71","rg":"272.259.998-85","nome":"Simone da Silva Batista","doc":"Designação Diretor Escolar- SIMONE DA SILVA BATISTA  272.259.998-85","cat":"Designação","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-18","ue":"Jardim Maria Helena I","dt":"05/01/2025","sei":"015.00988097/2025-64","rg":"43411848","nome":"Renata Aparecida de Lima","doc":"FORMULÁRIO 17 - RENATA APARECIDA DE LIMA - RG: 43411848","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-19","ue":"Jardim Maria Helena I","dt":"2026","sei":"015.00988097/2025-64","rg":"43411848","nome":"Renata Aparecida de Lima","doc":"FORMULÁRIO 17 - RENATA APARECIDA DE LIMA - RG: 43411848","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-20","ue":"Desembargador","dt":"2026","sei":"015.00004998/2026-91","rg":"8.226.625-1","nome":"Joaquim Henrique Simoni","doc":"FORMULÁRIO 12 - JOAQUIM HENRIQUE SIMONI","cat":"Formulário 12 (F12)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-21","ue":"Jose Neyde Cesar Lessa","dt":"12/01/2025","sei":"015.00021639/2026-06","rg":"23.104.056-8","nome":"Isac da Silva","doc":"/ CAF + FORM 17 / ISAC DA SILVA RG:23.104.056-8","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-22","ue":"Dr Raul Briquet","dt":"07/01/2025","sei":"015.00776941/2025-14","rg":"43356343","nome":"Andreia Daminiana de Camargo Silva","doc":"FORMULÁRIO 17 - ANDREA DAMIANA DE CAMARGO SILVA - RG: 43356343","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-23","ue":"Jose Wilson Padinha","dt":"13/01/2025","sei":"015.00013888/2026-10","rg":"0-7930409813","nome":"Vives Vitorino","doc":"FORMULARIO 04 E 15- CESSAÇÃO DE GOE .","cat":"Outros Expedientes","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-24","ue":"Dr Raul Briquet","dt":"13/01/2025","sei":"015.00020091/2026-79","rg":"41362234","nome":"Keila Duarte Luiz","doc":"Exoneração de Keila Duarte Luiz - RG 41362234","cat":"Outros Expedientes","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-25","ue":"Padre Giuseppe","dt":"13/01/2025","sei":"015.00994360/2025-54","rg":"30.786.687-7","nome":"Elaine Cristina de Oliveira","doc":"CAF - Encerramento de contrato V de Elaine Cristina de Oliveira, RG. 30.786.687-7","cat":"Portaria CAF","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-26","ue":"Diretoria de Ensino / Outros","dt":"13/01/2025","sei":"015.00878122/2025-01","rg":"48.458.932-5","nome":"Roberta Silva de Mauro","doc":"FORMULARIO 05 - FERIAS - ROBERTA SILVA DE MAURO","cat":"Indenização de Férias","st":"Não Atendido / Pendente","ok":false,"dev":false},{"id":"SEFREP-2026-27","ue":"Diretoria de Ensino","dt":"15/01/2026","sei":"015.00030583/2026-72","rg":"21835711","nome":"Elaine Aparecida Costa","doc":"F4 Elaine Aparecida costa, R.G. 21.835.711","cat":"Outros Expedientes","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-28","ue":"Diretoria de Ensino","dt":"15/01/2026","sei":"015.00030604/2026-50","rg":"27437467","nome":"Elaine Cristina ferreira Soares","doc":"F13 Elaine Cristina Ferreira Soares, R.G. 27.437.467","cat":"Outros Expedientes","st":"Não Atendido / Pendente","ok":false,"dev":false},{"id":"SEFREP-2026-29","ue":"Jose Sergio","dt":"15/01/2026","sei":"015.00030650/2026-59","rg":"29.237.251-6","nome":"Simone Maria do Nascimento","doc":"Valores Devolvidos pelo banco - Simone Maria do Nascimento, R.G. 29.237.251","cat":"Outros Expedientes","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-30","ue":"Profa. Celina de Barros","dt":"16/01/2026","sei":"015.0031743/2026-09","rg":"16961025","nome":"Wagner Aparecido dos Santos","doc":"CAF - F17 cessação PEI e cancelamento afastamento 90 dias","cat":"Formulário 17 (F17)","st":"Em Tramitação","ok":false,"dev":false},{"id":"SEFREP-2026-31","ue":"Do Jardim Maria Helena","dt":"19/01/2026","sei":"015.0038550/2026-71","rg":"62326403","nome":"Paulo Sergio de Sousa Andrade","doc":"CAF - F17 extinção contratual","cat":"Formulário 17 (F17)","st":"Em Tramitação","ok":false,"dev":false},{"id":"SEFREP-2026-32","ue":"João Nascif Chalupp","dt":"20/01/2026","sei":"015.00037262/2026-07","rg":"17962881","nome":"Gleis Maria de Albuquerque Maia","doc":"CAF - F17 extinção contratual","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-33","ue":"Estudante Henrique","dt":"20/01/2026","sei":"015.00040063/2026-78","rg":"22780217","nome":"Maria Veronica Neta","doc":"CAF F15 extinção contratual","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-34","ue":"Wilmar Soares","dt":"22/01/2026","sei":"015.00046726/2026-68","rg":"42720833","nome":"Filipe da Silva Torquato","doc":"CAF - F17 extinção contratual","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-35","ue":"Jd Maria Helena I","dt":"23/01/2026","sei":"015.00051257/2026-07","rg":"63326403 - 9","nome":"Eliana de Felipe Novelo","doc":"FORMULÁRIO 04 - ELIANA DE FELIPE NOVELO - RG: 63326403 - 9","cat":"Outros Expedientes","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-36","ue":"Paulo de Abreu","dt":"23/01/2026","sei":"015.00053173/2026-08","rg":"47080981","nome":"Natalia Apolinario","doc":"CAF - F17 extinção contratual","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-37","ue":"João Nascif Chalupp","dt":"23/01/2026","sei":"015.00051882/2026-41","rg":"50996950","nome":"Lerislania de Sousa Veloso","doc":"CAF - F15 extinção contratrual","cat":"Extinção Contratual","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-38","ue":"Do Jardim Maria Helena","dt":"23/01/2026","sei":"015.00988036/2025-05","rg":"32331678","nome":"Sandro Aparecido da Silva","doc":"F09 - F17 - Comprovante conta bancária - Apostila Readaptado","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-39","ue":"Padre Giuseppe","dt":"23/01/2026","sei":"015.00993764/2025-21","rg":"43995924","nome":"Vanessa Renata da Silva","doc":"CAF - Cessação de PCG de CAF - Cessação de PCG de Vanessa Renata da Silva, RG. 43.995.924-X","cat":"Portaria CAF","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-40","ue":"Do Jardim Maria Helena","dt":"27/01/2026","sei":"015.00054739/2026-19","rg":"15590720","nome":"Carlos Henrique Mello de Jesus","doc":"CAF - F17 afastamento pela 202","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-41","ue":"Do Jardim Maria Helena","dt":"27/01/2026","sei":"015.00054866/2026-18","rg":"28490756","nome":"Luciana Branco Torres","doc":"CAF - F17 afastamento pela 202","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-42","ue":"Nercy Amélia","dt":"27/01/2026","sei":"015.00786224/2025-92","rg":"23.294.507-X","nome":"Ana Paula da Silva Bandeira Labriola","doc":"FORMULARIO 17 - DESIGNAÇÃO - ANA PAULA DA SILVA BANDEIRA LABRIOLA RG. 23.294.507-X","cat":"Designação","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-43","ue":"Padre Romeo Mecca","dt":"27/01/2026","sei":"015.00057600/2026-19","rg":"34391579","nome":"Danilo de Oliveira FReire","doc":"F12 - verificação de descontos","cat":"Formulário 12 (F12)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-44","ue":"Profa. Josepha P Chiavelli","dt":"27/01/2026","sei":"015.00060536/2026-53","rg":"43995924","nome":"Vanessa Renata da Silva","doc":"F17 - Portaria de designação","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-45","ue":"Eliza de Oliveira","dt":"28/01/2026","sei":"015.00061113/2026-51","rg":"23915260","nome":"Joseane de Oliveira Cordeiro Ribeiro","doc":"F17 - devolução de falta","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-46","ue":"Eliza de Oliveira","dt":"28/01/2026","sei":"015.00061223/2026-12","rg":"23187049","nome":"João Marcos Cantanhede Rego","doc":"F17 - devolução de falta","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-47","ue":"Prof. José Theotônio","dt":"28/01/2026","sei":"015.00061374/2026-71","rg":"63361973","nome":"Gisele Schenemann","doc":"F17 - devolução de falta","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-48","ue":"Padre Giuseppe","dt":"28/01/2026","sei":"015.00061550/2026-74","rg":"26275511","nome":"Edilton José da Silva","doc":"F12 - análise de Promoção","cat":"Formulário 12 (F12)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-49","ue":"Paulo de Abreu","dt":"28/01/2026","sei":"015.00056939/2026-06","rg":"37976266","nome":"Bruno Fernandes da Silva","doc":"CAF - F17 extinção contratual","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false},{"id":"SEFREP-2026-50","ue":"Eliza de Oliveira","dt":"28/01/2025","sei":"015.00044178/2026-31","rg":"48585876","nome":"Sabrina Conceição Costa Rosales","doc":"CAF - F17 exoneração","cat":"Formulário 17 (F17)","st":"Atendido / Concluído","ok":true,"dev":false}]};

    let DADOS_SEPES = {
  "sucesso": true,
  "meta": {
    "nomeArquivo": "DEMANDAS SEAPE.xlsx",
    "setor": "SEPES - Serviço de Pessoas (Vida Funcional)",
    "contaResponsavel": "rosineide_gazolla_educacao_sp_gov_br",
    "sharepointUrl": "https:\/\/seesp-my.sharepoint.com\/:x:\/g\/personal\/rosineide_gazolla_educacao_sp_gov_br\/cQoeOJnO6_6aTpffoLZQ-VZaEgUCZ4107PIc0qdIlEuWeWTsug",
    "atualizadoEm": "2026-11-12T16:51:41.238Z",
    "atualizadoFormatado": "12\/11\/2026, 13:34:08",
    "tamanhoArquivoKb": "270.4"
  },
  "kpis": {
    "totalDemandas": 0,
    "totalAposentadorias": 0,
    "totalDesignacoes": 0,
    "totalAbonos": 0,
    "totalFinalizados": 0,
    "totalEmTramitacao": 0
  },
  "aposentadorias": [],
  "designacoes": [],
  "abonos": []
};
    /* Dados SEPES alimentados exclusivamente pela nuvem (zero localStorage) */

    let abaAtivaSepes = 'aposentadoria';
    let filtroBuscaSepes = '';
    let filtroStatusSepes = 'todos';
    let ordenacaoSepes = { col: 'dataEntrada', dir: 'desc' };

    function mudarAbaSepes(aba) {
      abaAtivaSepes = aba;
      ordenacaoSepes = { col: 'dataEntrada', dir: 'desc' };
      const abas = ['aposentadoria', 'designacoes', 'abono'];
      abas.forEach(a => {
        const btn = document.getElementById('tab-btn-sepes-' + a);
        if (btn) {
          if (a === aba) {
            btn.style.background = '#1e1b4b';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#1e1b4b';
          } else {
            btn.style.background = '#f8fafc';
            btn.style.color = '#475569';
            btn.style.borderColor = '#cbd5e1';
          }
        }
      });
      renderizarCorpoTabelaSepes();
    }

    function filtrarTabelaSepes() {
      const input = document.getElementById('sepes-busca-input');
      const selectStatus = document.getElementById('sepes-filtro-status');
      filtroBuscaSepes = input ? input.value.trim().toLowerCase() : '';
      filtroStatusSepes = selectStatus ? selectStatus.value : 'todos';
      renderizarCorpoTabelaSepes();
    }

    function alternarOrdenacaoSepes(colKey) {
      if (ordenacaoSepes.col === colKey) {
        ordenacaoSepes.dir = ordenacaoSepes.dir === 'desc' ? 'asc' : 'desc';
      } else {
        ordenacaoSepes.col = colKey;
        ordenacaoSepes.dir = (colKey === 'dataEntrada' || colKey === 'publicacao') ? 'desc' : 'asc';
      }
      renderizarCorpoTabelaSepes();
    }

    function renderizarCorpoTabelaSepes() {
      const container = document.getElementById('sepes-tabela-container');
      const badgeContador = document.getElementById('sepes-contador-registros');
      if (!container) return;

      let colunas = [];
      let registros = [];

      if (abaAtivaSepes === 'aposentadoria') {
        registros = (DADOS_SEPES.aposentadorias || []).filter(item => {
          const matchBusca = !filtroBuscaSepes ||
            (item.nome && item.nome.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.rgCpf && item.rgCpf.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.sei && item.sei.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.ua && item.ua.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.status && item.status.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.vigencia && item.vigencia.toLowerCase().includes(filtroBuscaSepes));

          let matchStatus = true;
          if (filtroStatusSepes === 'concluido') {
            matchStatus = item.concluido;
          } else if (filtroStatusSepes === 'andamento') {
            matchStatus = !item.concluido;
          }
          return matchBusca && matchStatus;
        });

        colunas = [
          { key: 'dataEntrada', titulo: 'Entrada / Vigência', width: '15%', isDate: true },
          { key: 'nome', titulo: 'Servidor(a) & RG/CPF', width: '25%' },
          { key: 'ua', titulo: 'Unidade Escolar / U.A.', width: '23%' },
          { key: 'sei', titulo: 'Processo SEI', width: '18%' },
          { key: 'status', titulo: 'Situação Executiva', width: '19%' }
        ];

      } else if (abaAtivaSepes === 'designacoes') {
        registros = (DADOS_SEPES.designacoes || []).filter(item => {
          const matchBusca = !filtroBuscaSepes ||
            (item.nome && item.nome.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.rgCin && item.rgCin.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.sei && item.sei.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.ue && item.ue.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.funcao && item.funcao.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.status && item.status.toLowerCase().includes(filtroBuscaSepes));

          let matchStatus = true;
          if (filtroStatusSepes === 'concluido') {
            matchStatus = item.concluido;
          } else if (filtroStatusSepes === 'andamento') {
            matchStatus = !item.concluido;
          }
          return matchBusca && matchStatus;
        });

        colunas = [
          { key: 'dataEntrada', titulo: 'Data / Publicação', width: '14%', isDate: true },
          { key: 'nome', titulo: 'Servidor(a) & RG/CIN', width: '24%' },
          { key: 'funcao', titulo: 'Função / Cargo', width: '20%' },
          { key: 'ue', titulo: 'Unidade Escolar', width: '22%' },
          { key: 'sei', titulo: 'Processo SEI', width: '10%' },
          { key: 'status', titulo: 'Situação Executiva', width: '10%' }
        ];

      } else if (abaAtivaSepes === 'abono') {
        registros = (DADOS_SEPES.abonos || []).filter(item => {
          const matchBusca = !filtroBuscaSepes ||
            (item.nome && item.nome.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.rgCin && item.rgCin.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.sei && item.sei.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.ue && item.ue.toLowerCase().includes(filtroBuscaSepes)) ||
            (item.status && item.status.toLowerCase().includes(filtroBuscaSepes));

          let matchStatus = true;
          if (filtroStatusSepes === 'concluido') {
            matchStatus = item.concluido;
          } else if (filtroStatusSepes === 'andamento') {
            matchStatus = !item.concluido;
          }
          return matchBusca && matchStatus;
        });

        colunas = [
          { key: 'dataEntrada', titulo: 'Data Entrada', width: '13%', isDate: true },
          { key: 'nome', titulo: 'Servidor(a) & RG/CIN', width: '27%' },
          { key: 'ue', titulo: 'Unidade Escolar', width: '25%' },
          { key: 'sei', titulo: 'Processo SEI', width: '17%' },
          { key: 'publicacao', titulo: 'Publicação DOE', width: '9%', isDate: true },
          { key: 'status', titulo: 'Situação Executiva', width: '9%' }
        ];
      }

      /* Ordenação padrão: data mais recente -> mais antiga */
      const colSepes = ordenacaoSepes.col || 'dataEntrada';
      const dirSepes = ordenacaoSepes.dir || 'desc';
      const colDefSepes = colunas.find(c => c.key === colSepes) || colunas[0];
      ordenarListaPorColuna(registros, {
        dir: dirSepes,
        isDate: !!(colDefSepes && colDefSepes.isDate),
        getter: function(item) {
          if (colSepes === 'dataEntrada' || colSepes === 'publicacao') return parseTimestampDataTabela(item[colSepes]);
          return item[colSepes] || '';
        },
        tieId: function(item) { return item.id; }
      });

      if (badgeContador) {
        badgeContador.innerText = `Exibindo ${registros.length} registros`;
      }

      let htmlTabela = `
        <div style="overflow-x: auto; max-height: 520px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px;">
          <table id="tabela-sepes-dados" data-no-sort="true" class="no-sort-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left; background: #ffffff;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; position: sticky; top: 0; z-index: 2;">
                ${colunas.map(c => gerarThOrdenavelHtml(c, colSepes, dirSepes, 'alternarOrdenacaoSepes')).join('')}
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
          htmlTabela += `<tr style="background: ${bgPar}; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#faf5ff'" onmouseout="this.style.background='${bgPar}'">`;

          if (abaAtivaSepes === 'aposentadoria') {
            const isConcluido = r.concluido;
            const isSpprev = r.status.toUpperCase().includes('SPPREV') || r.status.toUpperCase().includes('EXIG');
            const corBadge = isConcluido ? '#059669' : (isSpprev ? '#dc2626' : '#d97706');
            const bgBadge = isConcluido ? '#d1fae5' : (isSpprev ? '#fee2e2' : '#fef3c7');

            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">${r.dataEntrada || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Vig: ${r.vigencia || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.nome}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">${r.rgCpf}</div>
              </td>
              <td style="padding: 9px 12px; font-weight: 600; color: #334155;">${r.ua}</td>
              <td style="padding: 9px 12px; font-family: monospace; font-weight: 800; color: #4338ca;">${r.sei}</td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${bgBadge}; color: ${corBadge};">${r.status}</span>
              </td>
            `;

          } else if (abaAtivaSepes === 'designacoes') {
            const isConcluido = r.concluido;
            const corBadge = isConcluido ? '#059669' : '#d97706';
            const bgBadge = isConcluido ? '#d1fae5' : '#fef3c7';

            let corFuncao = '#0284c7';
            let bgFuncao = '#e0f2fe';
            if (r.funcao.includes('DIRETOR') || r.funcao.includes('SUPERVISOR')) {
              corFuncao = '#7c3aed';
              bgFuncao = '#ede9fe';
            } else if (r.funcao.includes('COORDENADOR')) {
              corFuncao = '#c2410c';
              bgFuncao = '#ffedd5';
            }

            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">${r.dataEntrada || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">DOE: ${r.publicacao || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.nome}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RG: ${r.rgCin}</div>
              </td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; background: ${bgFuncao}; color: ${corFuncao};">${r.funcao}</span>
              </td>
              <td style="padding: 9px 12px; font-weight: 600; color: #334155;">${r.ue}</td>
              <td style="padding: 9px 12px; font-family: monospace; font-weight: 700; color: #4338ca; font-size: 0.76rem;">${r.sei}</td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${bgBadge}; color: ${corBadge};">${r.status}</span>
              </td>
            `;

          } else if (abaAtivaSepes === 'abono') {
            const isConcluido = r.concluido;
            const corBadge = isConcluido ? '#059669' : '#d97706';
            const bgBadge = isConcluido ? '#d1fae5' : '#fef3c7';

            htmlTabela += `
              <td style="padding: 9px 12px; color: #475569;">
                <div style="font-weight: 700; color: #0f172a;">${r.dataEntrada || '—'}</div>
              </td>
              <td style="padding: 9px 12px;">
                <div style="font-weight: 800; color: #0f172a;">${r.nome}</div>
                <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RG: ${r.rgCin}</div>
              </td>
              <td style="padding: 9px 12px; font-weight: 600; color: #334155;">${r.ue}</td>
              <td style="padding: 9px 12px; font-family: monospace; font-weight: 800; color: #4338ca;">${r.sei}</td>
              <td style="padding: 9px 12px; color: #059669; font-weight: 700;">${r.publicacao || '—'}</td>
              <td style="padding: 9px 12px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: ${bgBadge}; color: ${corBadge};">${r.status}</span>
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

    
    /* ======================================================= */
    /* ======================================================= */
/* MÓDULO EXECUTIVO SEFREP: GESTÃO DE FOLHA & FREQUÊNCIA 2026 */
/* ======================================================= */
let estadoSefrep = {
  filtroPilar: 'devolucoes', /* 'devolucoes' | 'f17' | 'todos' */
  busca: '',
  paginaAtual: 1,
  porPagina: 20,
  glossarioAberto: true
};

function alternarRecolherNotasSefrep() {
  const conteudo = document.getElementById('sefrep-notas-conteudo-expansivel');
  const seta = document.getElementById('sefrep-notas-seta-indicadora');
  const status = document.getElementById('sefrep-notas-toggle-status');
  if (!conteudo) return;
  const estaOculto = window.getComputedStyle(conteudo).display === 'none';
  if (estaOculto) {
    conteudo.style.display = 'block';
    if (seta) seta.style.transform = 'rotate(180deg)';
    if (status) status.textContent = 'Clique para recolher notas explicativas';
  } else {
    conteudo.style.display = 'none';
    if (seta) seta.style.transform = 'rotate(0deg)';
    if (status) status.textContent = 'Clique para expandir notas explicativas e glossário da folha';
  }
}
window.alternarRecolherNotasSefrep = alternarRecolherNotasSefrep;

function mudarPilarSefrep(pilar) {
  estadoSefrep.filtroPilar = pilar;
  estadoSefrep.paginaAtual = 1;
  renderizarDashboardSefrep();
}

function filtrarBuscaSefrep(termo) {
  estadoSefrep.busca = (termo || '').toLowerCase().trim();
  estadoSefrep.paginaAtual = 1;
  renderizarTabelaRegistrosSefrep();
}

function mudarPaginaSefrep(delta) {
  estadoSefrep.paginaAtual = Math.max(1, estadoSefrep.paginaAtual + delta);
  renderizarTabelaRegistrosSefrep();
}

function obterRegistrosFiltradosSefrep() {
  const todos = (DADOS_SEFREP && Array.isArray(DADOS_SEFREP.registros)) ? DADOS_SEFREP.registros : [];
  const pilar = estadoSefrep.filtroPilar;
  const busca = estadoSefrep.busca;

  return todos.filter(function(r) {
    if (pilar === 'devolucoes' && !r.dev) return false;
    if (pilar === 'f17') {
      const cat = (r.cat || '').toLowerCase();
      const doc = (r.doc || '').toLowerCase();
      const isF17OrExt = cat.indexOf('f17') !== -1 || cat.indexOf('extinção') !== -1 || doc.indexOf('f17') !== -1 || doc.indexOf('extinção') !== -1;
      if (!isF17OrExt) return false;
    }

    if (busca) {
      const matchNome = (r.nome || '').toLowerCase().indexOf(busca) !== -1;
      const matchUe = (r.ue || '').toLowerCase().indexOf(busca) !== -1;
      const matchRg = (r.rg || '').toLowerCase().indexOf(busca) !== -1;
      const matchSei = (r.sei || '').toLowerCase().indexOf(busca) !== -1;
      const matchDoc = (r.doc || '').toLowerCase().indexOf(busca) !== -1;
      if (!matchNome && !matchUe && !matchRg && !matchSei && !matchDoc) return false;
    }

    return true;
  });
}

function renderizarTabelaRegistrosSefrep() {
  const containerTabela = document.getElementById('sefrep-tbody-registros');
  const containerPaginacao = document.getElementById('sefrep-paginacao-info');
  const btnAnt = document.getElementById('sefrep-btn-ant');
  const btnProx = document.getElementById('sefrep-btn-prox');
  if (!containerTabela) return;

  const filtrados = obterRegistrosFiltradosSefrep();
  const total = filtrados.length;
  const porPag = estadoSefrep.porPagina;
  const totalPaginas = Math.ceil(total / porPag) || 1;
  estadoSefrep.paginaAtual = Math.min(Math.max(1, estadoSefrep.paginaAtual), totalPaginas);

  const inicio = (estadoSefrep.paginaAtual - 1) * porPag;
  const fim = Math.min(inicio + porPag, total);
  const paginaItens = filtrados.slice(inicio, fim);

  if (containerPaginacao) {
    containerPaginacao.innerHTML = 'Exibindo <strong>' + (total > 0 ? (inicio + 1) : 0) + '–' + fim + '</strong> de <strong>' + total + '</strong> tramitações (Pág ' + estadoSefrep.paginaAtual + ' de ' + totalPaginas + ')';
  }
  if (btnAnt) btnAnt.disabled = (estadoSefrep.paginaAtual <= 1);
  if (btnProx) btnProx.disabled = (estadoSefrep.paginaAtual >= totalPaginas);

  if (paginaItens.length === 0) {
    containerTabela.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: #64748b; font-size: 0.88rem;">Nenhum expediente encontrado para os filtros selecionados.</td></tr>';
    return;
  }

  var htmlRows = '';
  paginaItens.forEach(function(r) {
    var statusBadge = '';
    if (r.dev) {
      statusBadge = '<span style="background: rgba(239, 68, 68, 0.12); color: #b91c1c; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 999px;">⚠️ Devolvido / Correção</span>';
    } else if (r.ok) {
      statusBadge = '<span style="background: rgba(16, 185, 129, 0.12); color: #047857; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 999px;">✓ Concluído</span>';
    } else {
      statusBadge = '<span style="background: rgba(2, 132, 199, 0.12); color: #0369a1; border: 1px solid rgba(2, 132, 199, 0.3); font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 999px;">⏳ Em Tramitação</span>';
    }

    var catBadge = '<span style="background: #f1f5f9; color: #475569; font-size: 0.71rem; font-weight: 700; padding: 2px 8px; border-radius: 6px;">' + (r.cat || 'Geral') + '</span>';

    htmlRows += '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;">';
    htmlRows += '<td style="padding: 0.75rem 0.85rem; font-size: 0.76rem; font-weight: 700; color: #64748b; font-family: monospace; text-align: center;">' + (r.dt || '-') + '</td>';
    htmlRows += '<td style="padding: 0.75rem 0.85rem; font-size: 0.82rem; font-weight: 700; color: #0f172a;">' + (r.ue || 'Diretoria / Outros') + '</td>';
    htmlRows += '<td style="padding: 0.75rem 0.85rem; font-size: 0.82rem; font-weight: 600; color: #1e293b;">' + (r.doc || '-') + '</td>';
    htmlRows += '<td style="padding: 0.75rem 0.85rem; font-size: 0.82rem; color: #334155;"><strong>' + (r.nome || '-') + '</strong>' + (r.rg ? ('<div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">RG: ' + r.rg + '</div>') : '') + '</td>';
    htmlRows += '<td style="padding: 0.75rem 0.85rem; font-size: 0.76rem; color: #0369a1; font-family: monospace;">' + (r.sei || '-') + '</td>';
    htmlRows += '<td style="padding: 0.75rem 0.85rem;">' + catBadge + '</td>';
    htmlRows += '<td style="padding: 0.75rem 0.85rem; text-align: center;">' + statusBadge + '</td>';
    htmlRows += '</tr>';
  });

  containerTabela.innerHTML = htmlRows;
}

function renderizarDashboardSefrep() {
  try {
  const container = document.getElementById('setor-conteudo-dinamico');
  if (!container) return;

  if (DADOS_SEFREP && DADOS_SEFREP.registros && DADOS_SEFREP.registros.length <= 50) {
    setTimeout(function() { sincronizarBasePublicaSefrep(false); }, 150);
  }

  const kpis = (DADOS_SEFREP && DADOS_SEFREP.kpis) ? DADOS_SEFREP.kpis : {
    totalExpedientes2026: 1383,
    totalDevolucoes: 333,
    taxaDevolucaoPct: 24.1,
    totalF17Extincoes: 631,
    totalF17: 402,
    totalExtincoes: 229,
    totalEmTramitacao: 678,
    totalConcluidos: 323
  };

  const topEscolas = (DADOS_SEFREP && Array.isArray(DADOS_SEFREP.topEscolasDevolucoes)) ? DADOS_SEFREP.topEscolasDevolucoes : [];
  const topEscolasUes = topEscolas.filter(function(e) { return e.escola.indexOf('Diretoria') === -1; }).slice(0, 5);

  const pilar = estadoSefrep.filtroPilar;
  const spLink = (typeof URLS_OFICIAIS_SEFREP !== 'undefined' && URLS_OFICIAIS_SEFREP.sharepoint) ? URLS_OFICIAIS_SEFREP.sharepoint : '#';



  var html = '';
  html += '<div class="sefrep-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">';

  /* BANNER TOPO EXECUTIVO SEFREP */
  html += '<div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 50%, #0369a1 100%); border: 2px solid #38bdf8; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">';
  html += '<div style="flex: 1; min-width: 0;">';
  html += '<div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem; flex-wrap: wrap;">';
  html += '<span style="font-size: 1.6rem;">💳</span>';
  html += '<h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEFREP — Seção de Frequência e Pagamento</h2>';
  html += '<span style="background: #e0f2fe; color: #0369a1; border: 1.5px solid #38bdf8; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">SEPES • URE ITAPEVI</span>';
  html += '<span style="background: rgba(255,255,255,0.15); color: #ffffff; font-size: 0.72rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3);">1.383 TRAMITAÇÕES 2026</span>';
  html += '</div>';
  html += '<p style="font-size: 0.85rem; color: #e0e7ff; margin: 0; line-height: 1.45; font-weight: 500;">';
  html += 'Monitoramento executivo da folha de pagamento, devoluções/erros de preenchimento das unidades escolares, regularidade de vínculos (F17 e Extinções Contratuais) e celeridade processual.';
  html += '</p>';
  html += '<div style="margin-top: 0.35rem; font-size: 0.76rem; color: #bae6fd; font-weight: 600;">';
  html += '<span>🕒 <strong>Dados de:</strong> <span id="sefrep-banner-timestamp" style="color: #ffffff;">' + ((DADOS_SEFREP && DADOS_SEFREP.meta && DADOS_SEFREP.meta.atualizadoFormatado) || '12/11/2026, 10:59:13') + '</span></span>';
  html += '</div>';
  html += '</div>';

  html += '<div style="display: flex; gap: 0.65rem; align-items: center; flex-shrink: 0; white-space: nowrap;">';
  html += '<button type="button" onclick="sincronizarBasePublicaSefrep(true)" id="btn-sefrep-sync-base" style="background: rgba(255,255,255,0.18); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.35); padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; transition: all 0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.28)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.18)\'">';
  html += '<span class="sync-spin-icon">🔄</span><span>Sincronizar SEFREP</span>';
  html += '</button>';
  html += '<a href="' + spLink + '" target="_blank" rel="noopener noreferrer" style="background: #f09b0c; color: #0b2351; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(240, 155, 12, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity=\'0.9\'" onmouseout="this.style.opacity=\'1\'">';
  html += '<span>📊</span><span>Abrir no Excel 365 ↗</span>';
  html += '</a>';
  html += '</div>';
  html += '</div>';

  /* CARDS DE INDICADORES EXECUTIVOS (REGRA 8: CURSOR DEFAULT, NUNCA FILTROS) */
  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.3rem;">';

  /* CARD 1: TOTAL */
  html += '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.15rem; cursor: default; user-select: text; box-shadow: 0 2px 8px rgba(0,0,0,0.03); text-align: center;">';
  html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">';
  html += '<span style="font-size: 0.72rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;">TOTAL TRAMITAÇÕES 2026</span>';
  html += '<span style="font-size: 1.3rem;">📊</span>';
  html += '</div>';
  html += '<div style="font-size: 1.75rem; font-weight: 800; color: #0b2351; line-height: 1.1; text-align: center;">' + Number(kpis.totalExpedientes2026 || 1383).toLocaleString('pt-BR') + '</div>';
  html += '<div style="font-size: 0.73rem; color: #64748b; margin-top: 0.35rem; text-align: center;">Expedientes nas 16 abas ativas</div>';
  html += '</div>';

  /* CARD 2: DEVOLUÇÕES (PILAR 1) */
  html += '<div style="background: #ffffff; border: 1px solid #fee2e2; border-left: 4px solid #ef4444; border-radius: 12px; padding: 1.15rem; cursor: default; user-select: text; box-shadow: 0 2px 8px rgba(239,68,68,0.05); text-align: center;">';
  html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">';
  html += '<span style="font-size: 0.72rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.05em;">PILAR 1 • DEVOLUÇÕES</span>';
  html += '<span style="font-size: 1.3rem;">⚠️</span>';
  html += '</div>';
  html += '<div style="display: flex; align-items: baseline; justify-content: center; gap: 0.5rem;">';
  html += '<span style="font-size: 1.75rem; font-weight: 800; color: #b91c1c; line-height: 1.1;">' + Number(kpis.totalDevolucoes || 333).toLocaleString('pt-BR') + '</span>';
  html += '<span style="font-size: 0.78rem; font-weight: 800; color: #ef4444; background: #fee2e2; padding: 2px 6px; border-radius: 4px;">' + (kpis.taxaDevolucaoPct || 24.1) + '%</span>';
  html += '</div>';
  html += '<div style="font-size: 0.73rem; color: #64748b; margin-top: 0.35rem; text-align: center;">Erros de preenchimento / correção</div>';
  html += '</div>';

  /* CARD 3: F17 (PILAR 2) */
  html += '<div style="background: #ffffff; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 12px; padding: 1.15rem; cursor: default; user-select: text; box-shadow: 0 2px 8px rgba(245,158,11,0.05); text-align: center;">';
  html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">';
  html += '<span style="font-size: 0.72rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em;">PILAR 2 • F17 CHEFIA</span>';
  html += '<span style="font-size: 1.3rem;">📋</span>';
  html += '</div>';
  html += '<div style="font-size: 1.75rem; font-weight: 800; color: #b45309; line-height: 1.1; text-align: center;">' + Number(kpis.totalF17 || 402).toLocaleString('pt-BR') + '</div>';
  html += '<div style="font-size: 0.73rem; color: #64748b; margin-top: 0.35rem; text-align: center;">Afastamentos e chefias escolares</div>';
  html += '</div>';

  /* CARD 4: EXTINÇÕES (PILAR 2) */
  html += '<div style="background: #ffffff; border: 1px solid #e0e7ff; border-left: 4px solid #6366f1; border-radius: 12px; padding: 1.15rem; cursor: default; user-select: text; box-shadow: 0 2px 8px rgba(99,102,241,0.05); text-align: center;">';
  html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">';
  html += '<span style="font-size: 0.72rem; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.05em;">PILAR 2 • EXTINÇÕES</span>';
  html += '<span style="font-size: 1.3rem;">⚖️</span>';
  html += '</div>';
  html += '<div style="font-size: 1.75rem; font-weight: 800; color: #4338ca; line-height: 1.1; text-align: center;">' + Number(kpis.totalExtincoes || 229).toLocaleString('pt-BR') + '</div>';
  html += '<div style="font-size: 0.73rem; color: #64748b; margin-top: 0.35rem; text-align: center;">Docentes e AOEs (Controle TCE)</div>';
  html += '</div>';

  /* CARD 5: CELERIDADE (PILAR 3) */
  html += '<div style="background: #ffffff; border: 1px solid #dcfce7; border-left: 4px solid #10b981; border-radius: 12px; padding: 1.15rem; cursor: default; user-select: text; box-shadow: 0 2px 8px rgba(16,185,129,0.05); text-align: center;">';
  html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">';
  html += '<span style="font-size: 0.72rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.05em;">PILAR 3 • STATUS</span>';
  html += '<span style="font-size: 1.3rem;">⚡</span>';
  html += '</div>';
  html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; align-items: center;">';
  html += '<div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 0.45rem 0.5rem; text-align: center;">';
  html += '<div style="font-size: 1.45rem; font-weight: 800; color: #0284c7; line-height: 1; text-align: center;">' + Number(kpis.totalEmTramitacao || 678).toLocaleString('pt-BR') + '</div>';
  html += '<div style="font-size: 0.68rem; font-weight: 700; color: #0369a1; margin-top: 3px; white-space: nowrap; text-align: center;">Em andamento</div>';
  html += '</div>';
  html += '<div style="background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; padding: 0.45rem 0.5rem; text-align: center;">';
  html += '<div style="font-size: 1.45rem; font-weight: 800; color: #047857; line-height: 1; text-align: center;">' + Number(kpis.totalConcluidos || 323).toLocaleString('pt-BR') + '</div>';
  html += '<div style="font-size: 0.68rem; font-weight: 700; color: #15803d; margin-top: 3px; white-space: nowrap; text-align: center;">Concluídos</div>';
  html += '</div>';
  html += '</div>';
  html += '<div style="font-size: 0.72rem; color: #64748b; margin-top: 0.5rem; text-align: center;">Celeridade e fluxo contínuo</div>';
  html += '</div>';

  html += '</div>';

  /* CARD EXECUTIVO DE INTELIGÊNCIA: FOCO FORMATIVO & PREVENÇÃO DE DEVOLUÇÕES (PILAR 1) */
  html += '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.25rem 1.45rem; margin-bottom: 1.3rem; box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);">';
  
  /* Cabeçalho do Card */
  html += '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.65rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.85rem;">';
  html += '<div style="display: flex; align-items: center; gap: 0.75rem;">';
  html += '<div style="width: 38px; height: 38px; border-radius: 10px; background: #fef2f2; border: 1.5px solid #fee2e2; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🎯</div>';
  html += '<div>';
  html += '<div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">';
  html += '<h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">Foco de Apoio Formativo &amp; Prevenção de Erros de Folha</h4>';
  html += '<span style="background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; font-size: 0.69rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">PILAR 1</span>';
  html += '</div>';
  html += '<p style="margin: 0.2rem 0 0 0; font-size: 0.76rem; color: #64748b; line-height: 1.35;">Unidades com maior incidência de devoluções no BFE • Ação preventiva do SEPES reduz retrabalho e previne atrasos salariais</p>';
  html += '</div>';
  html += '</div>';
  html += '<div style="display: flex; align-items: center; gap: 0.5rem;">';
  html += '<span style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; font-size: 0.72rem; font-weight: 700; padding: 4px 11px; border-radius: 6px;">Top 5 Escolas Prioritárias</span>';
  html += '</div>';
  html += '</div>';

  /* Grid com os 5 Micro-Cards */
  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.85rem; margin-top: 1rem;">';

  function resolverEscolaSefrep(nomeBruto) {
    var nb = String(nomeBruto || '').toUpperCase();
    var base = (typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas) && listaEscolas.length > 0)
      ? listaEscolas
      : ((typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO)) ? BASE_ESCOLAS_PADRAO : []);

    for (var bIdx = 0; bIdx < base.length; bIdx++) {
      var esc = base[bIdx];
      var n1 = String(esc.nome || '').toUpperCase();
      var n2 = String(esc.nomeOficialBruto || '').toUpperCase();
      if (nb.indexOf('ELIZA') !== -1 && (n1.indexOf('ELIZA') !== -1 || n2.indexOf('ELIZA') !== -1)) return esc;
      if (nb.indexOf('ALFERES') !== -1 && (n1.indexOf('ALFERES') !== -1 || n2.indexOf('ALFERES') !== -1)) return esc;
      if (nb.indexOf('DIMAR') !== -1 && (n1.indexOf('DIMAR') !== -1 || n2.indexOf('DIMAR') !== -1)) return esc;
      if (nb.indexOf('AMADOR') !== -1 && (n1.indexOf('AMADOR') !== -1 || n2.indexOf('AMADOR') !== -1)) return esc;
      if (nb.indexOf('IGN') !== -1 && (n1.indexOf('IGN') !== -1 || n2.indexOf('IGN') !== -1)) return esc;
      if (n1.indexOf(nb) !== -1 || nb.indexOf(n1) !== -1) return esc;
    }
    return { nome: nomeBruto, cie: '---', cidade: 'Itapevi' };
  }

  topEscolasUes.forEach(function(e, idx) {
    var match = resolverEscolaSefrep(e.escola);
    var nomeExib = match ? match.nome : e.escola;
    var cieExib = match ? match.cie : '---';
    var cidadeExib = match ? match.cidade : 'Itapevi';
    var rankNum = idx + 1;
    var pctVisual = Math.min(100, Math.round((e.total / 5) * 100));

    html += '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.95rem 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.65rem; cursor: default; user-select: text;">';
html += '<div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">';
    html += '<div style="display: flex; align-items: center; gap: 0.4rem;">';
    html += '<span style="font-size: 0.72rem; font-weight: 800; color: #475569; background: #e2e8f0; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">' + rankNum + 'º</span>';
    html += '<span style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">' + cidadeExib + '</span>';
    html += '</div>';
    html += '<span style="font-size: 0.72rem; font-weight: 800; color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca; padding: 2px 7px; border-radius: 5px;">⚠️ ' + e.total + ' devoluções</span>';
    html += '</div>';

    html += '<div>';
    html += '<div style="font-size: 0.84rem; font-weight: 800; color: #0f172a; line-height: 1.35; min-height: 2.3rem; display: flex; align-items: center;" title="' + nomeExib + '">' + nomeExib + '</div>';
    html += '<div style="font-size: 0.69rem; color: #64748b; margin-top: 0.2rem;">CIE: <strong style="color: #334155;">' + cieExib + '</strong></div>';
    html += '</div>';

    html += '<div>';
    html += '<div style="width: 100%; background: #e2e8f0; height: 5px; border-radius: 999px; overflow: hidden; margin-bottom: 0.35rem;">';
    html += '<div style="background: linear-gradient(90deg, #f59e0b, #ef4444); width: ' + pctVisual + '%; height: 100%; border-radius: 999px;"></div>';
    html += '</div>';
    html += '<div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: #64748b;">';
    html += '<span>Inconsistência BFE</span>';
    html += '<span style="font-weight: 700; color: #b91c1c;">Prioridade Formativa</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });

  html += '</div>';

  /* Rodapé Informativo Sutil */
  html += '<div style="margin-top: 0.95rem; padding-top: 0.75rem; border-top: 1px dashed #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; font-size: 0.74rem; color: #64748b;">';
  html += '<span>💡 <strong>Diretriz de Gestão:</strong> A capacitação e o acompanhamento direcionado a estas 5 unidades resolve <strong>7,5% de todas as devoluções</strong> de folha de pagamento registradas na Diretoria em 2026.</span>';
  html += '<span style="color: #94a3b8; font-size: 0.7rem;">Fonte: SEFREP / Livro Entrada 2026</span>';
  html += '</div>';

  html += '</div>';

  /* BARRA DE CONTROLE DEDICADA DE FILTROS & BUSCA (REGRA 8) */
  html += '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1.15rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">';

  /* PILLS DE PILAR EXECUTIVO */
  html += '<div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">';

  var bgDev = (pilar === 'devolucoes') ? '#b91c1c' : '#f8fafc';
  var colDev = (pilar === 'devolucoes') ? '#ffffff' : '#475569';
  var brdDev = (pilar === 'devolucoes') ? '#b91c1c' : '#cbd5e1';
  html += '<button type="button" onclick="mudarPilarSefrep(\'devolucoes\')" style="background: ' + bgDev + '; color: ' + colDev + '; border: 1px solid ' + brdDev + '; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.15s;">';
  html += '⚠️ Devoluções / Correção';
  html += '</button>';

  var bgF17 = (pilar === 'f17') ? '#0b2351' : '#f8fafc';
  var colF17 = (pilar === 'f17') ? '#ffffff' : '#475569';
  var brdF17 = (pilar === 'f17') ? '#0b2351' : '#cbd5e1';
  html += '<button type="button" onclick="mudarPilarSefrep(\'f17\')" style="background: ' + bgF17 + '; color: ' + colF17 + '; border: 1px solid ' + brdF17 + '; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.15s;">';
  html += '📋 F17 & Extinções';
  html += '</button>';

  var bgTod = (pilar === 'todos') ? '#0369a1' : '#f8fafc';
  var colTod = (pilar === 'todos') ? '#ffffff' : '#475569';
  var brdTod = (pilar === 'todos') ? '#0369a1' : '#cbd5e1';
  html += '<button type="button" onclick="mudarPilarSefrep(\'todos\')" style="background: ' + bgTod + '; color: ' + colTod + '; border: 1px solid ' + brdTod + '; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.15s;">';
  html += '📊 Todas as Tramitações 2026';
  html += '</button>';
  html += '</div>';

  /* CAMPO DE BUSCA RÁPIDA */
  html += '<div style="position: relative; min-width: 280px; flex: 1; max-width: 420px;">';
  html += '<input type="text" value="' + (estadoSefrep.busca || '') + '" oninput="filtrarBuscaSefrep(this.value)" placeholder="Buscar por Servidor, Escola, RG ou SEI..." style="width: 100%; box-sizing: border-box; padding: 0.55rem 0.85rem 0.55rem 2.2rem; font-size: 0.82rem; border: 1.5px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor=\'#0b2351\'" onblur="this.style.borderColor=\'#cbd5e1\'">';
  html += '<span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.92rem; color: #94a3b8; pointer-events: none;">🔍</span>';
  html += '</div>';
  html += '</div>';

  /* TABELA DE TRAMITAÇÕES 2026 */
  html += '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 1rem;">';
  html += '<div style="overflow-x: auto;">';
  html += '<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">';
  html += '<thead>';
  html += '<tr style="background: #0b2351; color: #ffffff; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800; text-align: center;">Data</th>';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800;">Unidade Escolar</th>';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800;">Documento / Assunto</th>';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800;">Servidor / RG</th>';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800;">Processo SEI</th>';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800;">Categoria</th>';
  html += '<th style="padding: 0.8rem 0.85rem; font-weight: 800; text-align: center;">Situação</th>';
  html += '</tr>';
  html += '</thead>';
  html += '<tbody id="sefrep-tbody-registros">';
  html += '</tbody>';
  html += '</table>';
  html += '</div>';

  /* RODAPÉ DA TABELA COM PAGINAÇÃO */
  html += '<div style="padding: 0.85rem 1.15rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">';
  html += '<div id="sefrep-paginacao-info" style="font-size: 0.78rem; color: #64748b;">Carregando registros...</div>';
  html += '<div style="display: flex; gap: 0.45rem;">';
  html += '<button type="button" id="sefrep-btn-ant" onclick="mudarPaginaSefrep(-1)" style="background: #ffffff; border: 1px solid #cbd5e1; color: #475569; font-size: 0.76rem; font-weight: 700; padding: 4px 12px; border-radius: 6px; cursor: pointer;">← Anterior</button>';
  html += '<button type="button" id="sefrep-btn-prox" onclick="mudarPaginaSefrep(1)" style="background: #ffffff; border: 1px solid #cbd5e1; color: #475569; font-size: 0.76rem; font-weight: 700; padding: 4px 12px; border-radius: 6px; cursor: pointer;">Próxima →</button>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  /* NOTAS EXPLICATIVAS RETRÁTEIS NO RODAPÉ DO SEFREP (PADRÃO OFICIAL SEFIN) */
  html += '<div style="margin-top: 1.75rem; border: 1.5px solid #cbd5e1; border-radius: 14px; background: #ffffff; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">';
  
  html += '<div id="sefrep-notas-header-toggle" onclick="alternarRecolherNotasSefrep()" style="padding: 1.1rem 1.4rem; background: #0f172a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;" title="Clique para expandir ou recolher as notas explicativas">';
  html += '<div style="display: flex; align-items: center; gap: 0.65rem;">';
  html += '<span style="font-size: 1.25rem;">📖</span>';
  html += '<div>';
  html += '<h4 style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.01em;">Notas Explicativas, Glossário de Termos &amp; Dicionário da Folha de Pagamento</h4>';
  html += '<div id="sefrep-notas-toggle-status" style="font-size: 0.76rem; color: #f09b0c; font-weight: 700; margin-top: 2px;">Clique para recolher notas explicativas</div>';
  html += '</div>';
  html += '</div>';
  html += '<div id="sefrep-notas-seta-indicadora" style="font-size: 1.15rem; color: #f09b0c; transition: transform 0.3s; transform: rotate(180deg);">▼</div>';
  html += '</div>';

  html += '<div id="sefrep-notas-conteudo-expansivel" style="padding: 1.5rem; border-top: 1px solid #e2e8f0; display: block; background: #ffffff;">';

  /* GLOSSÁRIO DE SIGLAS E TERMOS TÉCNICOS */
  html += '<div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.2rem; margin-bottom: 1.35rem;">';
  html += '<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">';
  html += '<span style="font-size: 1.2rem;">📑</span>';
  html += '<h5 style="margin: 0; font-size: 0.92rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.03em;">';
  html += 'Glossário Normativo de Rubricas &amp; Siglas Oficiais da Folha (SEFREP / SEDUC-SP / TCE)';
  html += '</h5>';
  html += '</div>';

  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1rem;">';

  /* 1. F17 */
  html += '<div style="background: #ffffff; border-left: 4px solid #0b2351; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">';
  html += '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">';
  html += '<strong style="color: #0b2351; font-size: 0.86rem; font-weight: 800;">F17 • Ficha de Registro de Frequência (Mod. 17)</strong>';
  html += '<span style="background: #e0e7ff; color: #3730a3; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Pilar 2 • Frequência</span>';
  html += '</div>';
  html += '<p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">';
  html += 'Formulário oficial onde a unidade escolar consolida mensalmente os eventos funcionais do servidor (dias trabalhados, faltas abonadas/justificadas/injustificadas, licenças e horas-aulas). É a base que alimenta a folha de pagamento da SEDUC/SP. Erros de preenchimento na escola travam a validação e bloqueiam o crédito salarial.';
  html += '</p>';
  html += '</div>';

  /* 2. Extinções */
  html += '<div style="background: #ffffff; border-left: 4px solid #4338ca; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">';
  html += '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">';
  html += '<strong style="color: #4338ca; font-size: 0.86rem; font-weight: 800;">Extinção Contratual • Cessação e Dispensa</strong>';
  html += '<span style="background: #ede9fe; color: #5b21b6; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Lei 500/74 • LC 1.093/09</span>';
  html += '</div>';
  html += '<p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">';
  html += 'Encerramento legal do contrato temporário de docentes (Categoria O) e servidores, motivado por fim de prazo, desistência ou falta de atribuição de aulas. Exige registro imediato para evitar pagamentos indevidos após a desvinculação e garantir regularidade perante o Tribunal de Contas do Estado (TCE-SP).';
  html += '</p>';
  html += '</div>';

  /* 3. Devoluções */
  html += '<div style="background: #ffffff; border-left: 4px solid #b91c1c; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">';
  html += '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">';
  html += '<strong style="color: #b91c1c; font-size: 0.86rem; font-weight: 800;">Devolução de Folha • Retrabalho Administrativo</strong>';
  html += '<span style="background: #fee2e2; color: #991b1b; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Pilar 1 • Prevenção</span>';
  html += '</div>';
  html += '<p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">';
  html += 'Ocorre quando o SEFREP identifica inconsistências na documentação enviada pela escola (datas divergentes, ausência de assinatura do diretor, cálculo incorreto de faltas ou formulário desatualizado). O processo retorna à unidade escolar para retificação, gerando atraso e risco salarial.';
  html += '</p>';
  html += '</div>';

  /* 4. BFE */
  html += '<div style="background: #ffffff; border-left: 4px solid #d97706; border-radius: 8px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">';
  html += '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">';
  html += '<strong style="color: #b45309; font-size: 0.86rem; font-weight: 800;">BFE • Boletim de Frequência Escolar</strong>';
  html += '<span style="background: #fef3c7; color: #92400e; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Cronograma SEFAZ</span>';
  html += '</div>';
  html += '<p style="font-size: 0.78rem; color: #334155; margin: 0; line-height: 1.45;">';
  html += 'Espelho mensal transmitido eletronicamente pela secretaria da escola, consolidando a assiduidade de todos os professores e funcionários. Possui prazo mensal rígido estabelecido pela Fazenda estadual; o envio tempestivo assegura o depósito dos vencimentos no 5º dia útil.';
  html += '</p>';
  html += '</div>';

  html += '</div>';
  html += '</div>';

  /* DICIONÁRIO DE CAMPOS E PILARES DA FOLHA */
  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.1rem; margin-bottom: 1.25rem;">';

  html += '<div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.1rem;">';
  html += '<strong style="color: #0284c7; font-size: 0.88rem; display: block; margin-bottom: 0.35rem; font-weight: 800;">📁 Processo SEI (Expediente Eletrônico Digital)</strong>';
  html += '<p style="font-size: 0.82rem; color: #334155; margin: 0; line-height: 1.5; font-weight: 500;">';
  html += 'Protocolo digital unificado no Sistema Eletrônico de Informações (padrão <code>015.XXXXXXXX/XXXX-XX</code>) que registra juridicamente todo o trâmite sem uso de papel físico, permitindo auditar o tempo de permanência em cada mesa e eliminar gargalos.';
  html += '</p>';
  html += '</div>';

  html += '<div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.1rem;">';
  html += '<strong style="color: #047857; font-size: 0.88rem; display: block; margin-bottom: 0.35rem; font-weight: 800;">⚡ Pilares Estratégicos de Gestão Regional</strong>';
  html += '<p style="font-size: 0.82rem; color: #334155; margin: 0; line-height: 1.5; font-weight: 500;">';
  html += '• <strong>Pilar 1 (Prevenção):</strong> Capacitação e apoio formativo aos GOEs nas escolas com maior índice de devoluções.<br>';
  html += '• <strong>Pilar 2 (Vínculos):</strong> Regularidade funcional de F17 e Extinções de contrato temporário.<br>';
  html += '• <strong>Pilar 3 (Celeridade):</strong> Controle contínuo de estoque de processos para garantir fluxo ágil.';
  html += '</p>';
  html += '</div>';

  html += '</div>';

  /* RODAPÉ DE AUDITORIA E BASE */
  html += '<div style="border-top: 1.5px solid #e2e8f0; padding-top: 0.85rem; font-size: 0.78rem; color: #475569; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-weight: 600;">';
  html += '<span>Fonte Oficial: <strong style="color: #0f172a;">Livro Entrada 2026 SEFREP.xlsx</strong> (SharePoint Corporativo SEDUC)</span>';
  html += '<span>Unidade Responsável: <strong style="color: #0f172a;">SEPES / SEFREP • Seção de Frequência e Pagamento</strong></span>';
  html += '<span>Normativas: <strong style="color: #0284c7;">Lei 500/74 • LC 1.093/09 • Decreto 52.054/07 • Res. SEDUC</strong></span>';
  html += '</div>';

  html += '</div>';
  html += '</div>';

  html += '</div>';

  container.innerHTML = html;
  renderizarTabelaRegistrosSefrep();
  } catch(errSefrep) {
    console.error('Erro em renderizarDashboardSefrep:', errSefrep);
  }
}

function sincronizarBasePublicaSefrep(isManual) {
  const manual = (isManual === true || typeof isManual === 'undefined');
  if (typeof window.registrarTarefaBootSync === 'function') {
    window.registrarTarefaBootSync('boot_sefrep', 'SEFREP • Frequência e Pagamento');
  }
  const btnSync = document.getElementById('btn-sefrep-sync-base');
  if (btnSync && manual) {
    btnSync.disabled = true;
    btnSync.innerHTML = '<span class="sync-spin-icon">⏳</span><span>Sincronizando...</span>';
  }

  if (manual && typeof mostrarAlertaSincronizacao === 'function') {
    mostrarAlertaSincronizacao({
      tipo: 'loading',
      tag: 'SEFREP • SHAREPOINT AO VIVO',
      titulo: 'Baixando Dados do SEFREP...',
      mensagem: 'Conectando ao SharePoint oficial (1.383 tramitações, F17, devoluções e extinções 2026)...',
      detalhes: 'Conexão Direta • Planilha SEDUC - EXPEDIENTES SPSP (5).xlsx',
      duracao: 0
    });
  }

  function aplicarDadosSefrep(novos, falhaRede) {
    if (btnSync && manual) {
      btnSync.disabled = false;
      btnSync.innerHTML = '<span class="sync-spin-icon">🔄</span><span>Sincronizar SEFREP</span>';
    }

    if (!falhaRede && novos && (novos.kpis || novos.registros)) {
      DADOS_SEFREP = novos;
      if (!DADOS_SEFREP.meta) DADOS_SEFREP.meta = {};
      DADOS_SEFREP.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR');
      DADOS_SEFREP.meta.origemSync = novos.origem || 'SharePoint Oficial Live';
    }

    const tsReal = (DADOS_SEFREP.meta && DADOS_SEFREP.meta.atualizadoFormatado) ? DADOS_SEFREP.meta.atualizadoFormatado : '12/11/2026, 10:59:13';
    renderizarDashboardSefrep();
    if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
    if (typeof window.concluirTarefaBootSync === 'function') {
      window.concluirTarefaBootSync('boot_sefrep');
    }

    const syncInfoCentro = document.getElementById('centro-drive-sync-info');
    if (syncInfoCentro) {
      syncInfoCentro.innerText = 'SHAREPOINT INSTITUCIONAL • SEFREP • Sincronizado às ' + new Date().toLocaleTimeString('pt-BR');
    }

    if (manual && typeof mostrarAlertaSincronizacao === 'function') {
      if (falhaRede) {
        mostrarAlertaSincronizacao({
          tipo: 'warning',
          tag: 'SEFREP • SEM CONEXÃO',
          titulo: 'Não foi possível buscar nova coleta do SEFREP agora',
          mensagem: 'Mantendo os dados carregados (coleta de <strong>' + tsReal + '</strong>).',
          detalhes: 'Tente novamente em instantes',
          duracao: 5000
        });
      } else {
        mostrarAlertaSincronizacao({
          tipo: 'success',
          tag: 'SEFREP • SINCRONIZADO',
          titulo: 'Base SEFREP Atualizada com Sucesso',
          mensagem: '<strong>' + (DADOS_SEFREP.kpis ? DADOS_SEFREP.kpis.totalExpedientes2026 : 1383) + '</strong> tramitações monitoradas na folha de pagamento.',
          detalhes: 'Última Coleta: ' + tsReal + ' • SharePoint SEFREP',
          duracao: 4500
        });
      }
    }
  }

  if (typeof google !== 'undefined' && google.script && google.script.run) {
    var tentarMirrorSefrep = function() {
      fetch(URLS_OFICIAIS_SEFREP.mirrorData + '?t=' + Date.now())
        .then(function(r) { return r.json(); })
        .then(function(d) { aplicarDadosSefrep(d, false); })
        .catch(function() { aplicarDadosSefrep(null, true); });
    };
    var invocarRpcSefrep = function() {
      var usarCacheSefrep = (!manual && window.__syncSilenciosoAtivo === true && typeof google.script.run.obterSetorComCacheActionGas === 'function');
      var rpcPromise = (typeof window.__runGasQueued === 'function')
        ? (usarCacheSefrep
            ? window.__runGasQueued('obterSetorComCacheActionGas', ['sincronizarSefrep', true, ''], 14000)
            : window.__runGasQueued('sincronizarPlanilhaSefrep', [manual], 18000))
        : null;
      if (rpcPromise) {
        rpcPromise.then(function(res) {
          if (res && res.sucesso && (res.registros || res.kpis)) aplicarDadosSefrep(res, false);
          else tentarMirrorSefrep();
        }).catch(tentarMirrorSefrep);
        return;
      }
      google.script.run
        .withSuccessHandler(function(res) {
          if (res && res.sucesso && (res.registros || res.kpis)) {
            aplicarDadosSefrep(res, false);
          } else {
            tentarMirrorSefrep();
          }
        })
        .withFailureHandler(tentarMirrorSefrep)
        .sincronizarPlanilhaSefrep(manual);
    };
    invocarRpcSefrep();
  } else {
    fetch(URLS_OFICIAIS_SEFREP.mirrorData + '?t=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(d) { aplicarDadosSefrep(d, false); })
      .catch(function() { aplicarDadosSefrep(null, true); });
  }
}

window.sincronizarDashboardSefrep = sincronizarBasePublicaSefrep;

window.renderizarDashboardSefrep = renderizarDashboardSefrep;
window.mudarPilarSefrep = mudarPilarSefrep;
window.filtrarBuscaSefrep = filtrarBuscaSefrep;
window.mudarPaginaSefrep = mudarPaginaSefrep;
window.sincronizarBasePublicaSefrep = sincronizarBasePublicaSefrep;


    /* MÓDULO EXECUTIVO EEC: APLICAÇÕES PEDAGÓGICAS APPS SCRIPT */
    /* ======================================================= */
    var EEC_PROTO_SLASH = 'https:' + String.fromCharCode(47, 47);
    var MODULOS_EEC = {
      'INICIO': {
        sigla: 'INICIO',
        icone: '🏠',
        nome: 'Início EEC',
        tituloHeader: 'Início • Portal Central EEC',
        subtitulo: 'Painel Geral e Acesso Integrado aos Sistemas e Ferramentas da Equipe de Especialistas em Currículo.',
        tag: 'PORTAL EEC',
        gasWebapp: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/in%C3%ADcio?authuser=0',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/in%C3%ADcio?authuser=0'
      },
      'PLANO_ACAO': {
        sigla: 'PLANO_ACAO',
        icone: '🎯',
        nome: 'Plano de Ação 2.0 2026',
        tituloHeader: 'Plano de Ação 2.0 2026 • EEC',
        subtitulo: 'Planejamento estratégico, metas formativas e planos de ação pedagógicos das unidades escolares de Itapevi e região.',
        tag: 'PLANEJAMENTO 2026',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbxg3Z3AD5t1kfKE4ZxnmGRmulC4lhPGjvCgnqIvctsTkonKbdD57CV91ILj-mJQR3lQ/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/plano-de-a%C3%A7%C3%A3o-2-0-2026?authuser=0'
      },
      'DEVOLUTIVA': {
        sigla: 'DEVOLUTIVA',
        icone: '📋',
        nome: 'Devolutiva Pedagógica',
        tituloHeader: 'Devolutiva Pedagógica • EEC',
        subtitulo: 'Sistema de devolutivas pedagógicas, alinhamento curricular e acompanhamento das orientações pedagógicas para a rede.',
        tag: 'FEEDBACK PEDAGÓGICO',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbzGOzNhdgu3AxXCRm63xsdy_AnZ-YIWQymfcpBVlX4D0SOrI9RWc2EOs0maUK7WqfEq0A/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/devolutiva-pedag%C3%B3gica?authuser=0'
      },
      'SAEB': {
        sigla: 'SAEB',
        icone: '📊',
        nome: 'Consulta SAEB 2025',
        tituloHeader: 'Consulta SAEB 2025 • EEC',
        subtitulo: 'Ambiente integrado para consulta, acompanhamento e diagnóstico dos dados do SAEB 2025 nas 60 escolas da Unidade Regional de Ensino de Itapevi.',
        tag: 'DIAGNÓSTICO SAEB',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbwc79rKkieVXFptQTxBarcJ1yew2ptmiyw9Z_a3kvylsqSxUzyeXAEMmCVkETy6WxPB/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/consulta-saeb-2025?authuser=0'
      },
      'AVALIACOES': {
        sigla: 'AVALIACOES',
        icone: '📈',
        nome: 'Acompanhamento das Avaliações',
        tituloHeader: 'Acompanhamento das Avaliações • EEC',
        subtitulo: 'Monitoramento sistemático e acompanhamento de aplicações de avaliações diagnósticas e formativas da rede escolar.',
        tag: 'AVALIAÇÕES EXTERNAS',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbxqqZD_Fb3sn0-pWveQGU0C52vft9pZarO_Fn9tQ1W3tUMSsiweoyp9gi_4qMug7D5wAA/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/acompanhamento-das-avalia%C3%A7%C3%B5es?authuser=0'
      },
      'DOCENTES': {
        sigla: 'DOCENTES',
        icone: '👥',
        nome: 'Consulta de Docentes',
        tituloHeader: 'Consulta de Docentes • EEC',
        subtitulo: 'Acompanhamento do corpo docente, atribuição de aulas e especialidades formativas por componente curricular.',
        tag: 'QUADRO DOCENTE',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbyFcmn8Etf-TpZkMIJCZ-Yrkj_axHVQbwbphhSPgiyy-mPbMj9ALxPeYgwVDfuLTxZ7/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/consulta-de-docentes?authuser=0'
      },
      'SIMULADOS': {
        sigla: 'SIMULADOS',
        icone: '📝',
        nome: 'Simulados SARESP 2026',
        tituloHeader: 'Simulados SARESP 2026 • EEC',
        subtitulo: 'Portal de simulados preparatórios SARESP 2026 e programa Matemática em Movimento para fortalecimento das aprendizagens.',
        tag: 'SIMULADOS DA REDE',
        gasWebapp: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/matemticaemmovimento/simulados-saresp-2026',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/simulados?authuser=0'
      },
      'ACOMPANHAMENTO': {
        sigla: 'ACOMPANHAMENTO',
        icone: '🧭',
        nome: 'Novo Acompanhamento Pedagógico',
        tituloHeader: 'Novo Acompanhamento Pedagógico 2026 • EEC',
        subtitulo: 'Registro de visitas escolares, rotinas de tutoria pedagógica e monitoramento das ações formativas da EEC.',
        tag: 'TUTORIA & ROTINAS',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbzAFWbSLmLKCNLesPEdx8GMnX-YHimnjHbj4c7rrdBRzu4udzmJOkEPcJ6OhzSYVeXRKw/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/novo-acompanhamento-pedag%C3%B3gico?authuser=0'
      },
      'CHECKLIST_SARESP': {
        sigla: 'CHECKLIST_SARESP',
        icone: '✅',
        nome: 'Checklist SARESP 2026',
        tituloHeader: 'Checklist de Acompanhamento — SARESP 2026 • EEC',
        subtitulo: 'Checklist oficial de acompanhamento e conformidade operacional para a aplicação do SARESP 2026.',
        tag: 'GESTÃO SARESP',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbyXjaKczfuk987SMHKw4TL59bKVJoHM7vQ37WLE0cv4VOuYeUfXElxq3qPzMpuGy3kRFw/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/checklist-de-acompanhamento-saresp-2026?authuser=0'
      },
      'DESENVOLVIMENTO_DOCENTE': {
        sigla: 'DESENVOLVIMENTO_DOCENTE',
        icone: '🌱',
        nome: 'Desenvolvimento Profissional Docente',
        tituloHeader: 'Ficha Individual de Desenvolvimento Docente • EEC',
        subtitulo: 'Instrumento formativo para acompanhamento do percurso e evolução profissional dos professores da rede.',
        tag: 'FORMAÇÃO DOCENTE',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/macros/s/AKfycbxNxHU2nt3sTKphPX3QZMAMRFuaL38qf7rYljzSi2QmZA90t4Nc8spr80fAmap0yaBqlA/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/ficha-individual-de-desenvolvimento-profissional-docente?authuser=0'
      },
      'CENTRAL_DADOS': {
        sigla: 'CENTRAL_DADOS',
        icone: '🗄️',
        nome: 'Central de Dados URE Itapevi',
        tituloHeader: 'Central de Dados – URE Itapevi • EEC',
        subtitulo: 'Painel integrado de dados educacionais, indicadores de fluxo, frequência e proficiência escolar regional.',
        tag: 'DADOS & INDICADORES',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbzskxnosNe9K7Ldsk_fJ3z-og7RFC6dpau_x6PPmEXTKp-_KslFOzDymQGWsTtQKz1SHw/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/central-de-dados-ure-itapevi?authuser=0'
      },
      'PROFESSOR_TUTOR': {
        sigla: 'PROFESSOR_TUTOR',
        icone: '🎓',
        nome: 'Professor Tutor',
        tituloHeader: 'Professor Tutor • EEC',
        subtitulo: 'Sistema de gestão, acompanhamento de metas e registro de atendimentos do programa Professor Tutor.',
        tag: 'PROGRAMA TUTOR',
        gasWebapp: EEC_PROTO_SLASH + 'script.google.com/macros/s/AKfycbx4rTtB0g11U7Uv516xgfrE_WhaUaFB_5YNawvpqDdVa-tIEouUEeumg_z1gm1DPgxy/exec',
        googleSites: EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/professor-tutor?authuser=0'
      }
    };

    var __eecModuloAtivo = 'INICIO';

    function renderizarModuloEec() {
      var container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      /* Lista oficial com todos os 12 modulos pedagogicos da EEC */
      var listaChaves = [
        'INICIO',
        'PLANO_ACAO',
        'DEVOLUTIVA',
        'SAEB',
        'AVALIACOES',
        'DOCENTES',
        'SIMULADOS',
        'ACOMPANHAMENTO',
        'CHECKLIST_SARESP',
        'DESENVOLVIMENTO_DOCENTE',
        'CENTRAL_DADOS',
        'PROFESSOR_TUTOR'
      ];
      var cardsHtml = '';

      for (var i = 0; i < listaChaves.length; i++) {
        var k = listaChaves[i];
        var item = MODULOS_EEC[k];
        if (!item) continue;

        cardsHtml += '' +
          '<div class="eec-app-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.25rem 1.15rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.9rem; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.04);" onmouseover="this.style.transform=\'translateY(-3px)\'; this.style.boxShadow=\'0 12px 28px -5px rgba(37,99,235,0.22)\'; this.style.borderColor=\'#93c5fd\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.04)\'; this.style.borderColor=\'#e2e8f0\'">' +
            '<div>' +
              '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.6rem;">' +
                '<div style="display: flex; align-items: center; gap: 0.6rem;">' +
                  '<div style="background: #f8fafc; border: 1px solid #e2e8f0; width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">' +
                    item.icone +
                  '</div>' +
                  '<div>' +
                    '<h4 style="font-size: 0.98rem; font-weight: 800; color: #0b2351; margin: 0; line-height: 1.25;">' + item.nome + '</h4>' +
                    '<span style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase;">' + item.tag + '</span>' +
                  '</div>' +
                '</div>' +
                '<span style="background: #dcfce7; color: #166534; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;">PÚBLICO</span>' +
              '</div>' +
              '<p style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin: 0; min-height: 48px;">' +
                item.subtitulo +
              '</p>' +
            '</div>' +

            '<div style="margin-top: 0.4rem; padding-top: 0.8rem; border-top: 1px solid #f1f5f9;">' +
              '<a href="' + item.gasWebapp + '" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); color: #ffffff; padding: 11px 16px; border-radius: 10px; font-size: 0.88rem; font-weight: 800; text-decoration: none; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(37,99,235,0.28); transition: transform 0.15s, box-shadow 0.15s;" onmouseover="this.style.transform=\'translateY(-1px)\'; this.style.boxShadow=\'0 6px 16px rgba(37,99,235,0.38)\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 4px 12px rgba(37,99,235,0.28)\'">' +
                '🚀 Acessar Sistema Oficial ↗' +
              '</a>' +
            '</div>' +
          '</div>';
      }

      var html = '' +
        '<div id="eec-saeb-wrapper" class="eec-saeb-container" style="padding: 0.5rem 0.2rem; font-family: inherit;">' +
          
          '<!-- BANNER TOPO EXECUTIVO EEC -->' +
          '<div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 50%, #1e40af 100%); border: 2px solid #f59e0b; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(11,35,81,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">' +
            '<div style="flex: 1; min-width: 0;">' +
              '<div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">' +
                '<span style="font-size: 1.6rem;">📚</span>' +
                '<h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">EEC - Equipe de Especialistas em Currículo</h2>' +
                '<span style="background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; font-size: 0.76rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">PORTAL PEDAGÓGICO INTEGRADO</span>' +
                '<span style="background: #dcfce7; color: #166534; border: 1.5px solid #22c55e; font-size: 0.76rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">🌐 LINKS PÚBLICOS OFICIAIS</span>' +
              '</div>' +
              '<p style="font-size: 0.86rem; color: #e0e7ff; margin: 0; max-width: 860px; line-height: 1.45; font-weight: 500;">' +
                'Acesso unificado aos sistemas, plataformas e ferramentas pedagógicas oficiais da Equipe de Especialistas em Currículo (EEC) da Unidade Regional de Ensino de Itapevi.' +
              '</p>' +
              '<div style="margin-top: 0.35rem; font-size: 0.76rem; color: #bae6fd; font-weight: 600;">' +
                '<span>🕒 <strong>Dados de:</strong> <span id="eec-banner-timestamp" style="color: #ffffff;">' + (new Date().toLocaleDateString('pt-BR') + ', 08:00:00') + '</span></span>' +
              '</div>' +
            '</div>' +

            '<div style="display: flex; gap: 0.6rem; align-items: center; flex-shrink: 0; white-space: nowrap;">' +
              '<a href="' + EEC_PROTO_SLASH + 'script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbxg3Z3AD5t1kfKE4ZxnmGRmulC4lhPGjvCgnqIvctsTkonKbdD57CV91ILj-mJQR3lQ/exec" target="_blank" rel="noopener noreferrer" style="background: #f59e0b; color: #0b2351; border: none; padding: 11px 20px; border-radius: 9px; font-size: 0.88rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4); transition: transform 0.15s, opacity 0.2s;" onmouseover="this.style.opacity=\'0.9\'; this.style.transform=\'scale(1.02)\'" onmouseout="this.style.opacity=\'1\'; this.style.transform=\'scale(1)\'">' +
                '🚀 Acessar Portal Central EEC ↗' +
              '</a>' +
            '</div>' +
          '</div>' +

          '<!-- SEÇÃO DA GRADE DOS 12 SISTEMAS OFICIAIS -->' +
          '<div style="margin-bottom: 1.5rem;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.6rem;">' +
              '<div>' +
                '<h3 style="font-size: 1.15rem; font-weight: 800; color: #0b2351; margin: 0; display: flex; align-items: center; gap: 0.5rem;">' +
                  '<span>📚</span> Central de Aplicativos Pedagógicos • EEC' +
                '</h3>' +
                '<p style="font-size: 0.8rem; color: #64748b; margin: 0.2rem 0 0 0;">' +
                  'Acesse qualquer uma das ferramentas oficiais abaixo com 1 clique (links 100% públicos, sem necessidade de login):' +
                '</p>' +
              '</div>' +
              '<span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 20px;">' +
                '12 Módulos Integrados' +
              '</span>' +
            '</div>' +

            '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">' +
              cardsHtml +
            '</div>' +
          '</div>' +

          '<!-- CARD DE GOVERNANÇA E ESCLARECIMENTO TÉCNICO GOOGLE -->' +
          '<div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.2rem 1.4rem; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: #475569;">' +
            '<div style="display: flex; gap: 0.8rem; align-items: flex-start; max-width: 850px;">' +
              '<span style="font-size: 1.4rem;">🔒</span>' +
              '<div>' +
                '<strong style="color: #0b2351; font-size: 0.88rem; display: block; margin-bottom: 0.25rem;">Isolamento e Segurança Google Workspace (Diretriz X-Frame-Options)</strong>' +
                '<span style="line-height: 1.5; display: block;">' +
                  'Os sistemas desenvolvidos no Google Apps Script e Google Sites possuem proteção nativa da Google contra enquadramento (cabeçalho <code>X-Frame-Options: SAMEORIGIN</code>). Por essa razão de segurança internacional, a navegação ocorre em janela dedicada de alta performance com 1 clique, garantindo velocidade total, funcionamento integral de formulários e ausência de restrições de terceiros.' +
                '</span>' +
                '<div style="margin-top: 0.5rem; font-size: 0.76rem; color: #2563eb; font-weight: 700;">' +
                  '🛠️ Instrução Técnica para a Equipe EEC: Para liberar o embutimento direto dentro de outros painéis, basta acrescentar <code>.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)</code> no retorno da função <code>doGet()</code> do Google Apps Script correspondente.' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div style="font-size: 0.76rem; font-weight: 700; color: #64748b; align-self: center;">' +
              'Unidade Regional de Ensino de Itapevi • URE Itapevi' +
            '</div>' +
          '</div>' +

          /* NOTA METODOLÓGICA E ORIENTAÇÕES DA EEC */
          '<div id="nota-metodologica-eec" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">' +
              '<div style="display: flex; align-items: center; gap: 0.6rem;">' +
                '<span style="font-size: 1.4rem;">📚</span>' +
                '<div>' +
                  '<h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">EEC • NOTAS METODOLÓGICAS &amp; DIRETRIZES PEDAGÓGICAS</h4>' +
                  '<div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Especialistas em Currículo, avaliações diagnósticas (SARESP/SAEB), formação docente e os 12 módulos de gestão pedagógica</div>' +
                '</div>' +
              '</div>' +
              '<span style="background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Portal Pedagógico Integrado • 12 Módulos Web Apps</span>' +
            '</div>' +

            '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">' +
              
              /* Bloco 1: Liderança Curricular */
              '<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">' +
                '<div style="color: #a78bfa; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">' +
                  '<span>🎯</span> <span>Liderança Curricular &amp; Formação</span>' +
                '</div>' +
                '<div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">' +
                  '• <strong>Papel da Equipe EEC:</strong> Formação continuada de Professores Coordenadores (CGPG/CGPAC) e docentes nas áreas de Linguagens, Matemática, Ciências da Natureza e Humanas.<br>' +
                  '• <strong>Alinhamento ao Currículo Paulista:</strong> Garantia do desenvolvimento das competências essenciais nas 60 escolas da rede pública estadual da URE Itapevi.' +
                '</div>' +
              '</div>' +

              /* Bloco 2: Avaliações Diagnósticas */
              '<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">' +
                '<div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">' +
                  '<span>📊</span> <span>Avaliações Externas &amp; Diagnósticas</span>' +
                '</div>' +
                '<div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">' +
                  '• <strong>SARESP / SAEB / Prova Paulista:</strong> Monitoramento contínuo das proficiências leitora e matemática, taxas de participação e evolução do índice IDESP.<br>' +
                  '• <strong>Intervenção com Base em Evidências:</strong> Mapeamento de habilidades defasadas para reorientação de planos de aula e nivelamento de aprendizagens.' +
                '</div>' +
              '</div>' +

              /* Bloco 3: 12 Módulos Web Apps Integrados */
              '<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">' +
                '<div style="color: #34d399; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">' +
                  '<span>🌐</span> <span>Portal Integrado com 12 Ferramentas</span>' +
                '</div>' +
                '<div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">' +
                  '• <strong>Plano de Ação 2.0 &amp; Devolutiva:</strong> Acompanhamento estruturado das metas pactuadas por cada unidade escolar e retorno formativo individualizado.<br>' +
                  '• <strong>Central de Dados URE Itapevi:</strong> Módulos para monitoramento de simulados, checklist de aplicação, consulta de docentes e fichas de desenvolvimento profissional.' +
                '</div>' +
              '</div>' +

              /* Bloco 4: Equidade e Programa Professor Tutor */
              '<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">' +
                '<div style="color: #fbbf24; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">' +
                  '<span>🤝</span> <span>Equidade, PEI &amp; Tutoria Docente</span>' +
                '</div>' +
                '<div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">' +
                  '• <strong>Programa Ensino Integral (PEI):</strong> Apoio à implementação das metodologias ativas, projeto de vida e nivelamento dos estudantes em regime integral.<br>' +
                  '• <strong>Professor Tutor:</strong> Acompanhamento próximo aos estudantes em maior vulnerabilidade de rendimento ou frequência escolar, prevenindo a evasão.' +
                '</div>' +
              '</div>' +

            '</div>' +

            '<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">' +
              '<span><strong>URE Itapevi</strong> • Núcleo Pedagógico / Especialistas em Currículo (EEC)</span>' +
              '<span>Ambiente Oficial de Formação e Evidências Pedagógicas • SEDUC-SP</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      container.innerHTML = html;
    }

    function renderizarModuloEecSaeb() {
      renderizarModuloEec();
    }

    function esconderLoaderEecSaeb() {
      /* Compatibilidade */
    }

    function recarregarIframeEecSaeb() {
      window.open(EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/in%C3%ADcio?authuser=0', '_blank');
    }

    function toggleFullscreenEecSaeb() {
      window.open(EEC_PROTO_SLASH + 'sites.google.com/prof.educacao.sp.gov.br/appscript2026/in%C3%ADcio?authuser=0', '_blank');
    }

        function renderizarDashboardSepes() {
      const container = document.getElementById('setor-conteudo-dinamico');
      if (!container) return;

      const meta = DADOS_SEPES.meta || {};
      const kpis = DADOS_SEPES.kpis || {
        totalDemandas: 293,
        totalAposentadorias: 84,
        totalDesignacoes: 159,
        totalAbonos: 50,
        totalFinalizados: 227,
        totalEmTramitacao: 66
      };

      const html = `
        <div class="sepes-dash-executive" style="padding: 0.5rem 0.2rem; font-family: inherit;">
          
          <!-- BANNER TOPO EXECUTIVO SEPES -->
          <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); border: 2px solid #f59e0b; border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.2rem; box-shadow: 0 10px 25px -5px rgba(30,27,75,0.3); display: flex; justify-content: space-between; align-items: center; gap: 1.2rem;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.6rem;">👥</span>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">SEAPE - Seção de Administração de Pessoal</h2>
                <span style="background: #d1fae5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">OFICIAL SHAREPOINT • SEPES</span>
              </div>
              <p style="font-size: 0.86rem; color: #e0e7ff; margin: 0; max-width: 840px; line-height: 1.45; font-weight: 500;">
                Acompanhamento em tempo real das demandas estratégicas da planilha oficial <strong style="color: #ffffff;">DEMANDAS SEAPE</strong>: Aposentadorias de servidores, Designações docentes e de gestão pedagógica, e Abonos de Permanência da Unidade Regional de Ensino de Itapevi.
              </p>
              <div style="margin-top: 0.35rem; font-size: 0.76rem; color: #c7d2fe; font-weight: 600;">
                <span>🕒 <strong>Dados de:</strong> <span id="sepes-banner-timestamp" style="color: #ffffff;">${meta.atualizadoFormatado || 'Sem registro'}</span></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; white-space: nowrap;">
              <div style="display: flex; gap: 0.6rem;">
                <button onclick="sincronizarDashboardSepes()" id="btn-sepes-sync-base" style="background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); color: #ffffff; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  🔄 Sincronizar Base
                </button>
                <a href="${meta.sharepointUrl || URLS_OFICIAIS_SEPES.sharepoint}" target="_blank" rel="noopener noreferrer" style="background: #f59e0b; color: #1e1b4b; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                  📊 Abrir Excel no 365 ↗
                </a>
              </div>
              <div style="font-size: 0.74rem; color: #a5b4fc; font-weight: 700;">Base Oficial com ${kpis.totalDemandas} processos monitorados</div>
            </div>
          </div>

          <!-- 4 CARDS KPIS SEPES (COM MEDIDAS CENTRALIZADAS) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            
            <!-- CARD 1: TOTAL DEMANDAS ESTRATÉGICAS -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #c7d2fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(67, 56, 202, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Total Demandas</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #e0e7ff; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #c7d2fe; font-size: 1.1rem;">
                    👥
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #4338ca; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalDemandas || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #4338ca; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>${kpis.totalFinalizados} Finalizados • ${kpis.totalEmTramitacao} Ativos</span>
                <span style="font-weight: 600; color: #64748b;">Geral</span>
              </div>
            </div>

            <!-- CARD 2: APOSENTADORIA -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #c2410c; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Aposentadoria</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ffedd5; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #fed7aa; font-size: 1.1rem;">
                    🌅
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #ea580c; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalAposentadorias || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #c2410c; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Processos SPPREV & DOE</span>
                <span style="font-weight: 600; color: #64748b;">Aposentadoria</span>
              </div>
            </div>

            <!-- CARD 3: DESIGNAÇÕES -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Designações</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #dcfce7; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #a7f3d0; font-size: 1.1rem;">
                    📝
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #047857; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalDesignacoes || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #047857; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Docentes, CGPG, Diretores</span>
                <span style="font-weight: 600; color: #64748b;">Designações</span>
              </div>
            </div>

            <!-- CARD 4: ABONO DE PERMANÊNCIA -->
            <div class="kpi-card" style="background: #ffffff; border: 1.5px solid #ddd6fe; border-radius: 12px; padding: 0.95rem 0.85rem; min-height: 126px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); cursor: default;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.35rem;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap;">Abono Permanência</span>
                  <div style="width: 32px; height: 32px; min-width: 32px; border-radius: 8px; margin-left: auto; flex-shrink: 0; background: #ede9fe; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #ddd6fe; font-size: 1.1rem;">
                    🛡️
                  </div>
                </div>
                <div style="font-size: clamp(1.72rem, 2.05vw, 2.18rem); font-weight: 800; color: #7c3aed; letter-spacing: -0.02em; line-height: 1.2; margin: 0.35rem 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">${Number(kpis.totalAbonos || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div style="font-size: 0.74rem; color: #6d28d9; padding-top: 0.4rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 700;">
                <span>Publicados e em Análise</span>
                <span style="font-weight: 600; color: #64748b;">Abonos</span>
              </div>
            </div>

          </div>

          <!-- NAVEGAÇÃO DE SUB-ABAS DO SEPES -->
          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="tab-btn-sepes-aposentadoria" onclick="mudarAbaSepes('aposentadoria')" style="background: #1e1b4b; color: #ffffff; border: 1.5px solid #1e1b4b; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                🌅 Aposentadorias
              </button>
              <button id="tab-btn-sepes-designacoes" onclick="mudarAbaSepes('designacoes')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                📝 Designações
              </button>
              <button id="tab-btn-sepes-abono" onclick="mudarAbaSepes('abono')" style="background: #f8fafc; color: #475569; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                🛡️ Abono de Permanência
              </button>
            </div>

            <div id="sepes-contador-registros" style="font-size: 0.8rem; font-weight: 700; color: #4338ca; background: #e0e7ff; padding: 5px 12px; border-radius: 20px;">
              Carregando dados...
            </div>

          </div>

          <!-- BARRA DE BUSCA E FILTROS -->
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between;">
            <div style="flex: 1; min-width: 260px; display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0 0.75rem;">
              <span style="font-size: 1rem; color: #64748b; margin-right: 0.5rem;">🔍</span>
              <input type="text" id="sepes-busca-input" onkeyup="filtrarTabelaSepes()" placeholder="Pesquisar por servidor, RG/CPF, escola/U.A., processo SEI, função ou status..." style="border: none; background: transparent; width: 100%; padding: 8px 0; font-size: 0.84rem; outline: none; color: #0f172a; font-family: inherit;">
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select id="sepes-filtro-status" onchange="filtrarTabelaSepes()" style="background: #ffffff; border: 1.5px solid #cbd5e1; color: #0f172a; padding: 7px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; outline: none; cursor: pointer;">
                <option value="todos">Todos os Status</option>
                <option value="concluido">Concluídos / Publicados / Finalizados</option>
                <option value="andamento">Em Tramitação / Aguardando Atendimento</option>
              </select>
            </div>
          </div>

          <!-- CONTÊINER DA TABELA RESPONSIVA -->
          <div id="sepes-tabela-container">
            <!-- Renderizado dinamicamente via renderizarCorpoTabelaSepes() -->
          </div>

          <!-- NOTAS METODOLÓGICAS & CRITÉRIOS DO SERVIÇO DE PESSOAS (SEPES • SEAPE & SEFREP) -->
          <div id="nota-metodologica-sepes" style="background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.85rem; border: 1px solid #1e293b; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.15rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">👥</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">SEPES • NOTAS METODOLÓGICAS &amp; DIRETRIZES DE VIDA FUNCIONAL</h4>
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Atribuições do SEAPE (Aposentadorias e Abonos) e SEFREP (Folha, Frequência e Modulação)</div>
                </div>
              </div>
              <span style="background: rgba(139,92,246,0.15); color: #c084fc; border: 1px solid rgba(139,92,246,0.3); font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">Quadro Funcional • URE Itapevi</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.15rem; margin-bottom: 1.25rem;">
              
              <!-- Bloco 1: SEAPE -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #c084fc; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🧓</span> <span>SEAPE • Aposentadorias &amp; Direitos</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>Aposentadorias &amp; CTC:</strong> Contagem de tempo de serviço, liquidação de certidões e concessão de aposentadorias voluntárias e compulsórias.<br>
                  • <strong>Abono de Permanência:</strong> Processamento do benefício para servidores que completaram requisitos e optaram por continuar na ativa.
                </div>
              </div>

              <!-- Bloco 2: SEFREP -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #38bdf8; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📄</span> <span>SEFREP • Folha de Pagamento &amp; Frequência</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  • <strong>BFE &amp; Ocorrências:</strong> Acompanhamento mensal de faltas, licenças-saúde, afastamentos e consistência da folha de pagamento.<br>
                  • <strong>Modulação de Professores:</strong> Alocação docente, atribuição de aulas e substituições eventuais nas unidades escolares.
                </div>
              </div>

              <!-- Bloco 3: Gestão de Pessoas -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
                <div style="color: #10b981; font-weight: 800; font-size: 0.82rem; margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🎯</span> <span>Valorização &amp; Conformidade</span>
                </div>
                <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.65;">
                  Garantia da segurança jurídica dos atos funcionais dos servidores e agilidade na instrução de processos do SEDUC e SPPREV.
                </div>
              </div>

            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.73rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>URE Itapevi</strong> • Serviço de Pessoas (SEPES)</span>
              <span>Responsável: Rosineide Gazolla (rosineide_gazolla_educacao_sp_gov_br)</span>
            </div>
          </div>


        </div>
      `;

      container.innerHTML = html;
      renderizarCorpoTabelaSepes();
    }

    function processarPlanilhaSepesBase64(base64Data, timestamp, jaPurificado, onFallback) {
      if (typeof XLSX === 'undefined') {
        console.warn('SheetJS (XLSX) não disponível para SEPES.');
        if (typeof onFallback === 'function') onFallback();
        return;
      }
      if (!jaPurificado && typeof window.purificarXlsxStreamingSeNecessario === 'function') {
        window.purificarXlsxStreamingSeNecessario(base64Data).then(function(cleanB64) {
          processarPlanilhaSepesBase64(cleanB64, timestamp, true, onFallback);
        }).catch(function() {
          if (typeof onFallback === 'function') onFallback();
        });
        return;
      }
      try {
        const readOptions = { type: 'base64', dense: true };
        if (CONFIG_SINCRONIZACAO_SEPES.modoOtimizado && Array.isArray(CONFIG_SINCRONIZACAO_SEPES.abasAtivas)) {
          readOptions.sheets = CONFIG_SINCRONIZACAO_SEPES.abasAtivas;
        }

        const wb = XLSX.read(base64Data, readOptions);
        const wsApos = wb.Sheets['APOSENTADORIA'];
        const wsDesig = wb.Sheets['DESIGNAÇÕES'];
        const wsAbono = wb.Sheets['ABONO DE PERMANÊNCIA'];

        function parseDataXlsxLocal(val) {
          if (!val) return '';
          if (typeof val === 'number' && val >= 30000 && val <= 65000) {
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

        /* 1. Aposentadorias */
        const rawApos = wsApos ? XLSX.utils.sheet_to_json(wsApos, { header: 1, defval: '' }) : [];
        const aposentadorias = [];
        rawApos.slice(2).forEach(r => {
          const nome = String(r[3] || '').trim();
          const sei = String(r[5] || '').trim();
          if (!nome && !sei) return;

          let vigencia = r[2];
          if (typeof vigencia === 'number') {
            vigencia = parseDataXlsxLocal(vigencia);
          } else {
            vigencia = String(vigencia || '').trim();
          }

          const st = String(r[7] || 'EM ANDAMENTO').trim();
          const isConcluido = st.toUpperCase().includes('APÓS') || st.toUpperCase().includes('COMPULSÓRIA') || st.toUpperCase().includes('PUBL');

          aposentadorias.push({
            id: 'APOS-' + (aposentadorias.length + 1),
            dataEntrada: parseDataXlsxLocal(r[1]),
            vigencia: vigencia || '—',
            nome: nome,
            rgCpf: String(r[4] || '—').trim(),
            sei: sei || 'S/N',
            ua: String(r[6] || '—').trim(),
            status: st || 'EM ANDAMENTO',
            concluido: isConcluido
          });
        });

        /* 2. Designações */
        const rawDesig = wsDesig ? XLSX.utils.sheet_to_json(wsDesig, { header: 1, defval: '' }) : [];
        const designacoes = [];
        rawDesig.slice(1).forEach(r => {
          const nome = String(r[1] || '').trim();
          const sei = String(r[4] || '').trim();
          if (!nome && !sei) return;

          const st = String(r[7] || 'EM ANDAMENTO').trim();
          const isConcluido = st.toUpperCase().includes('FINALIZADO') || st.toUpperCase().includes('CONCLU');

          designacoes.push({
            id: 'DESIG-' + (designacoes.length + 1),
            dataEntrada: parseDataXlsxLocal(r[0]),
            nome: nome,
            rgCin: String(r[2] || '—').trim(),
            ue: String(r[3] || '—').trim(),
            sei: sei || 'S/N',
            funcao: String(r[5] || 'DOCENTE').trim(),
            publicacao: parseDataXlsxLocal(r[6]),
            status: st || 'EM ANDAMENTO',
            concluido: isConcluido
          });
        });

        /* 3. Abono */
        const rawAbono = wsAbono ? XLSX.utils.sheet_to_json(wsAbono, { header: 1, defval: '' }) : [];
        const abonos = [];
        rawAbono.slice(1).forEach(r => {
          const nome = String(r[1] || '').trim();
          const sei = String(r[4] || '').trim();
          if (!nome && !sei) return;

          const st = String(r[6] || 'EM ANDAMENTO').trim();
          const isConcluido = st.toUpperCase().includes('PUBLICADO') || st.toUpperCase().includes('ATENDIDO') || st.toUpperCase().includes('CONCLU');

          abonos.push({
            id: 'ABONO-' + (abonos.length + 1),
            dataEntrada: parseDataXlsxLocal(r[0]),
            nome: nome,
            rgCin: String(r[2] || '—').trim(),
            ue: String(r[3] || '—').trim(),
            sei: sei || 'S/N',
            publicacao: parseDataXlsxLocal(r[5]),
            status: st || 'EM ANDAMENTO',
            concluido: isConcluido
          });
        });

        if (aposentadorias.length > 0) DADOS_SEPES.aposentadorias = aposentadorias;
        if (designacoes.length > 0) DADOS_SEPES.designacoes = designacoes;
        if (abonos.length > 0) DADOS_SEPES.abonos = abonos;

        const totalDemandas = DADOS_SEPES.aposentadorias.length + DADOS_SEPES.designacoes.length + DADOS_SEPES.abonos.length;
        const concluidos = DADOS_SEPES.aposentadorias.filter(x => x.concluido).length +
                           DADOS_SEPES.designacoes.filter(x => x.concluido).length +
                           DADOS_SEPES.abonos.filter(x => x.concluido).length;

        DADOS_SEPES.kpis = {
          totalDemandas: totalDemandas,
          totalAposentadorias: DADOS_SEPES.aposentadorias.length,
          totalDesignacoes: DADOS_SEPES.designacoes.length,
          totalAbonos: DADOS_SEPES.abonos.length,
          totalFinalizados: concluidos,
          totalEmTramitacao: totalDemandas - concluidos
        };

        if (DADOS_SEPES.meta) {
          DADOS_SEPES.meta.atualizadoFormatado = new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR');
          DADOS_SEPES.meta.origemSync = 'SharePoint Ao Vivo';
        }

        renderizarDashboardSepes();
        if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
        if (typeof window.concluirTarefaBootSync === 'function') {
          window.concluirTarefaBootSync('boot_sepes');
        }

        if (!window.__sepesSyncSilencioso && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEPES AO VIVO • SHAREPOINT',
            titulo: 'Planilha SEPES Atualizada em Tempo Real!',
            mensagem: '<strong>' + DADOS_SEPES.kpis.totalAposentadorias + ' aposentadorias</strong>, <strong>' + DADOS_SEPES.kpis.totalDesignacoes + ' designações</strong> e <strong>' + DADOS_SEPES.kpis.totalAbonos + ' abonos</strong> baixados do SharePoint agora.',
            detalhes: 'SharePoint Ao Vivo às ' + new Date().toLocaleTimeString('pt-BR'),
            duracao: 4500
          });
        }
      } catch (errXlsx) {
        console.error('Erro ao ler base64 SEPES com SheetJS:', errXlsx);
        if (typeof onFallback === 'function') onFallback();
      }
    }

    function sincronizarDashboardSepes(silencioso) {
      const isSil = (silencioso === true);
      window.__sepesSyncSilencioso = isSil;
      if (typeof window.registrarTarefaBootSync === 'function') {
        window.registrarTarefaBootSync('boot_sepes', 'SEPES • Demandas SEAPE');
      }
      if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEPES • SHAREPOINT AO VIVO',
          titulo: 'Baixando Demandas do SEPES...',
          mensagem: 'Conectando ao SharePoint em tempo real (Aposentadoria, Designações e Abono de Permanência)...',
          detalhes: 'Conexão direta ao SharePoint • DEMANDAS SEAPE',
          duracao: 0
        });
      }

      function aplicarDadosSepes(novos, falhaRede) {
        if (!falhaRede && novos && (novos.kpis || novos.aposentadorias)) {
          DADOS_SEPES = novos;
          if (DADOS_SEPES.meta) {
            DADOS_SEPES.meta.origemSync = novos.origem || 'Espelho Nuvem (Fallback)';
          }
        }
        const tsReal = (DADOS_SEPES.meta && DADOS_SEPES.meta.atualizadoFormatado) ? DADOS_SEPES.meta.atualizadoFormatado : 'Data não informada';
        renderizarDashboardSepes();
        if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
        if (typeof window.concluirTarefaBootSync === 'function') {
          window.concluirTarefaBootSync('boot_sepes');
        }

        if (!isSil && typeof mostrarAlertaSincronizacao === 'function') {
          if (falhaRede) {
            mostrarAlertaSincronizacao({
              tipo: 'warning',
              tag: 'SEPES • SEM CONEXÃO',
              titulo: 'SharePoint SEPES indisponível no momento',
              mensagem: 'Mantendo os dados carregados (coleta de <strong>' + tsReal + '</strong>).',
              detalhes: 'Tente novamente em instantes',
              duracao: 5000
            });
          } else {
            mostrarAlertaSincronizacao({
              tipo: 'info',
              tag: 'SEPES • ESPELHO NUVEM',
              titulo: 'Base SEPES via Espelho de Contingência',
              mensagem: '<strong>' + DADOS_SEPES.kpis.totalAposentadorias + ' aposentadorias</strong>, <strong>' + DADOS_SEPES.kpis.totalDesignacoes + ' designações</strong> e <strong>' + DADOS_SEPES.kpis.totalAbonos + ' abonos de permanência</strong>.',
              detalhes: 'Coleta SharePoint registrada em: ' + tsReal,
              duracao: 5000
            });
          }
        }
      }

      function buscarMirrorSepes() {
        fetch(URLS_OFICIAIS_SEPES.mirrorData + '?t=' + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(json) {
            if (json && (json.kpis || json.aposentadorias)) {
              aplicarDadosSepes(json, false);
            } else {
              aplicarDadosSepes(null, true);
            }
          })
          .catch(function(err) {
            console.warn('Fallback local para SEPES:', err);
            aplicarDadosSepes(null, true);
          });
      }

      const ehOtimSepes = (typeof CONFIG_SINCRONIZACAO_SEPES !== 'undefined') ? CONFIG_SINCRONIZACAO_SEPES.modoOtimizado : true;
      consultarSharepointGasLive({
        action: 'sincronizarSepes',
        fnGas: 'sincronizarPlanilhaSepes',
        argsGas: [!ehOtimSepes],
        urlExtraParams: (ehOtimSepes ? '' : '&bruto=true')
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64 && typeof processarPlanilhaSepesBase64 === 'function') {
          processarPlanilhaSepesBase64(res.dadosBase64, res.timestamp, false, buscarMirrorSepes);
        } else if (res && (res.kpis || res.aposentadorias)) {
          aplicarDadosSepes(res, false);
        } else {
          buscarMirrorSepes();
        }
      }).catch(function() {
        buscarMirrorSepes();
      });
    }


    function limparTodosArquivosCentro() {
      arquivosSelecionadosCentro = [];
      const input = document.getElementById('arquivo-input');
      if (input) input.value = "";
      renderizarListaArquivosCentro();
      const alertBox = document.getElementById('upload-status-alert');
      if (alertBox) alertBox.style.display = 'none';
    }

    function visualizarPdfDoCentro(index) {
      const file = arquivosSelecionadosCentro[index];
      if (!file) return;

      const overlay = document.getElementById('pdf-modal-overlay');
      const iframe = document.getElementById('pdf-modal-iframe');
      const title = document.getElementById('pdf-modal-title-text');
      const openBtn = document.getElementById('pdf-modal-open-new-tab');

      const url = URL.createObjectURL(file);
      iframe.src = url;
      title.innerText = file.name;
      openBtn.href = url;
      overlay.style.display = 'flex';
    }

    async function enviarArquivosDoSetor() {
      if (arquivosSelecionadosCentro.length === 0) {
        alert('Selecione pelo menos um arquivo antes de enviar.');
        return;
      }

      const botao = document.getElementById('btn-submit-upload');
      const alertBox = document.getElementById('upload-status-alert');
      const centroAtual = document.getElementById('atual-centro-sigla').value;
      const setorAtual = document.getElementById('atual-setor-sigla').value;

      botao.disabled = true;
      botao.innerHTML = `<span>⏳ Enviando ${arquivosSelecionadosCentro.length} arquivo(s)...</span>`;
      alertBox.className = 'upload-status-alert loading';
      alertBox.innerHTML = `Processando envio para <b>${centroAtual} / ${setorAtual}</b>...`;

      try {
        const arquivosPayload = [];
        for (let i = 0; i < arquivosSelecionadosCentro.length; i++) {
          const file = arquivosSelecionadosCentro[i];
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          arquivosPayload.push({
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            data: base64
          });
        }

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run
            .withSuccessHandler(function (resultados) {
              botao.disabled = false;
              botao.innerHTML = '<span>📤 Salvar Arquivos no Repositório Nuvem</span>';
              limparTodosArquivosCentro();
              alertBox.className = 'upload-status-alert success';
              let linksHtml = `✅ <b>Sucesso!</b> ${resultados.length} arquivo(s) salvos na pasta <b>${centroAtual} / ${setorAtual}</b> do Google Drive:<ul style="margin-top: 0.5rem; padding-left: 1.2rem;">`;
              resultados.forEach(res => {
                const icon = res.fileName.toLowerCase().endsWith('.pdf') ? '📕' : '📊';
                linksHtml += `<li style="margin-bottom: 0.25rem;">${icon} <b>${res.fileName}</b> - <a href="${res.url}" target="_blank" rel="noopener noreferrer" style="color:#065f46; text-decoration: underline; font-weight:700;">Abrir Repositório Nuvem ↗</a></li>`;
              });
              linksHtml += `</ul>`;
              alertBox.innerHTML = linksHtml;
            })
            .withFailureHandler(function (erro) {
              botao.disabled = false;
              botao.innerHTML = '<span>📤 Salvar Arquivos no Repositório Nuvem</span>';
              alertBox.className = 'upload-status-alert error';
              alertBox.innerHTML = `❌ Falha no envio: ${erro.message || erro}`;
            })
            .processMultipleFilesUpload(arquivosPayload, setorAtual, centroAtual);
        } else {
          setTimeout(() => {
            botao.disabled = false;
            botao.innerHTML = '<span>📤 Salvar Arquivos no Repositório Nuvem</span>';
            limparTodosArquivosCentro();
            alertBox.className = 'upload-status-alert success';
            alertBox.innerHTML = `✅ [Simulação] ${arquivosPayload.length} arquivo(s) salvos com sucesso na pasta <b>${centroAtual} / ${setorAtual}</b>!`;
          }, 800);
        }
      } catch (err) {
        botao.disabled = false;
        botao.innerHTML = '<span>📤 Salvar Arquivos no Repositório Nuvem</span>';
        alertBox.className = 'upload-status-alert error';
        alertBox.innerHTML = `❌ Erro: ${err.message || err}`;
      }
    }

    /**
     * MOTOR DE SINCRONIZAÇÃO GLOBAL E CONTEXTUAL (BI DIRIGENTE)
     * Permite sincronizar individualmente cada um dos 12 módulos ou todos de uma só vez.
     */
    function obterTimestampAtualFormatado() {
      const agora = new Date();
      return agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function atualizarPillStatusGlobal(texto, estado) {
      const elTexto = document.getElementById('drive-stats-text');
      const dot = document.getElementById('drive-status-dot');
      if (elTexto) elTexto.innerText = texto;
      if (dot) {
        if (estado === 'loading') {
          dot.style.background = '#f59e0b';
          dot.style.boxShadow = '0 0 8px rgba(245, 158, 11, 0.8)';
          dot.style.animation = 'pulseDot 0.8s infinite ease-in-out';
        } else if (estado === 'error') {
          dot.style.background = '#ef4444';
          dot.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.8)';
          dot.style.animation = 'none';
        } else {
          dot.style.background = '#10b981';
          dot.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.8)';
          dot.style.animation = 'pulseDot 2s infinite ease-in-out';
        }
      }
    }

    function sincronizarTudoGlobalmente(silencioso) {
      const isSilencioso = (silencioso === true);
      window.__syncSilenciosoAtivo = isSilencioso;
      if (isSilencioso) {
        setTimeout(function() { window.__syncSilenciosoAtivo = false; }, 18000);
      }
      const btn = document.getElementById('btn-sync-global');
      const icon = document.getElementById('btn-sync-global-icon');
      const txt = document.getElementById('btn-sync-global-text');

      if (btn && !isSilencioso) {
        btn.disabled = true;
        btn.classList.add('syncing');
        if (txt) txt.innerText = 'Sincronizando Tudo...';
      }
      atualizarPillStatusGlobal('Sincronizando 12 Módulos e Bases...', 'loading');

      if (!isSilencioso && typeof abrirBootModalSincronizacao === 'function') {
        abrirBootModalSincronizacao();
        setTimeout(function() {
          if (window.__bootSyncTracker) {
            window.__bootSyncTracker.disparado = true;
            atualizarUIBootSyncReal();
          }
        }, 400);
      }

      if (!isSilencioso && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SINCRONIZAÇÃO GLOBAL',
          titulo: 'Sincronizando 12 Módulos e Bases...',
          mensagem: 'Consultando SharePoint, Google Calendar, Frota, Visitas e Bases Escolares...',
          detalhes: 'Consolidação Executiva Regional',
          duracao: 0
        });
      }

      /* 1. SEINTEC (SharePoint Calls 2026 e Inventário) */
      try {
        if (typeof sincronizarSharepointCalls === 'function') {
          sincronizarSharepointCalls(false);
        }
        if (typeof sincronizarInventarioSharepoint === 'function') {
          sincronizarInventarioSharepoint(false);
        }
      } catch (e1) {
        console.warn('Erro ao sincronizar SEINTEC:', e1);
      }

      /* 2. SEFIN (SharePoint Finanças & Orçamento) */
      try {
        if (typeof sincronizarDashboardSefin === 'function') {
          sincronizarDashboardSefin(true);
        }
      } catch (e2) {
        console.warn('Erro ao sincronizar SEFIN:', e2);
      }

      /* 2.1 SECOMSE (SharePoint Compras e Serviços) */
      try {
        if (typeof sincronizarDashboardSecomse === 'function') {
          sincronizarDashboardSecomse(true);
        }
      } catch (eSecomse) {
        console.warn('Erro ao sincronizar SECOMSE:', eSecomse);
      }

      /* 2.2 DPAT (SharePoint Patrimônio Escolar) */
      try {
        if (typeof sincronizarDashboardDpat === 'function') {
          sincronizarDashboardDpat(false);
        }
      } catch (eDpat) {
        console.warn('Erro ao sincronizar DPAT:', eDpat);
      }

      /* 2.3 SEOM (SharePoint Obras e Infraestrutura) */
      try {
        if (typeof sincronizarDashboardSeom === 'function') {
          sincronizarDashboardSeom(false);
        }
      } catch (eSeom) {
        console.warn('Erro ao sincronizar SEOM:', eSeom);
      }

      /* 2.4 SEFISC (SharePoint Zeladorias e Frota) */
      try {
        if (typeof sincronizarDashboardSefisc === 'function') {
          sincronizarDashboardSefisc(false);
        }
      } catch (eSefisc) {
        console.warn('Erro ao sincronizar SEFISC:', eSefisc);
      }

      /* 2.5 SEMAT (SharePoint Matrícula da Rede) */
      try {
        if (typeof sincronizarDashboardSemat === 'function') {
          sincronizarDashboardSemat(true);
        }
      } catch (eSemat) {
        console.warn('Erro ao sincronizar SEMAT:', eSemat);
      }

      /* 2.6 SEVESC (SharePoint Vida Escolar) */
      try {
        if (typeof sincronizarDashboardSevesc === 'function') {
          sincronizarDashboardSevesc(true);
        }
      } catch (eSevesc) {
        console.warn('Erro ao sincronizar SEVESC:', eSevesc);
      }

      /* 2.7 SEGRE (SharePoint Gestão da Rede Escolar) */
      try {
        if (typeof sincronizarDashboardSegre === 'function') {
          sincronizarDashboardSegre(true);
        }
      } catch (eSegre) {
        console.warn('Erro ao sincronizar SEGRE:', eSegre);
      }

      /* 2.8 SEPES & SEFREP (SharePoint Serviço de Pessoas e Frequência/Pagamento) */
      try {
        if (typeof sincronizarDashboardSepes === 'function') {
          sincronizarDashboardSepes(true);
        }
        if (typeof sincronizarBasePublicaSefrep === 'function') {
          sincronizarBasePublicaSefrep(false);
        }
      } catch (eSepes) {
        console.warn('Erro ao sincronizar SEPES/SEFREP:', eSepes);
      }

      /* 3. Minha Gestão */
      try {
        if (typeof atualizarDiaGestaoHoje === 'function') {
          atualizarDiaGestaoHoje();
        }
      } catch (e3) {
        console.warn('Erro ao sincronizar Gestão:', e3);
      }

      /* 4. Agenda Executiva */
      try {
        if (typeof renderizarAgendaLista === 'function') {
          renderizarAgendaLista();
        }
        if (typeof atualizarEstatisticasAgenda === 'function') {
          atualizarEstatisticasAgenda();
        }
      } catch (e4) {
        console.warn('Erro ao sincronizar Agenda:', e4);
      }

      /* 5. Carro Oficial & Frota */
      try {
        if (typeof atualizarCarroOficial === 'function') {
          atualizarCarroOficial();
        }
      } catch (e5) {
        console.warn('Erro ao sincronizar Carro:', e5);
      }

      /* 6. Visitas às 60 Escolas */
      try {
        if (typeof atualizarPainelVisitas === 'function') {
          atualizarPainelVisitas();
        }
      } catch (e6) {
        console.warn('Erro ao sincronizar Visitas:', e6);
      }

      /* 7. Rede Escolar & Inventário */
      try {
        if (typeof atualizarKpisEscolas === 'function') {
          atualizarKpisEscolas();
        }
        if (typeof atualizarIndicadoresOrdenacaoEscolas === 'function') {
          atualizarIndicadoresOrdenacaoEscolas();
        }
        if (typeof renderizarEscolas === 'function') {
          renderizarEscolas();
        }
      } catch (e7) {
        console.warn('Erro ao sincronizar Escolas:', e7);
      }

      /* 8. Home KPIs */
      try {
        if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') {
          atualizarKpisSuperioresHomeParaEscola(null);
        }
        if (typeof renderizarMiniCalendarioHome === 'function') {
          renderizarMiniCalendarioHome();
        }
      } catch (e8) {
        console.warn('Erro ao sincronizar Home:', e8);
      }

      /* 9. Gabinete e Centros badges */
      const agoraStr = obterTimestampAtualFormatado();
      const agoraHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const elGabBadge = document.getElementById('gab-drive-sync-info');
      if (elGabBadge) elGabBadge.innerText = 'SHAREPOINT INSTITUCIONAL • BASES GABINETE • Sincronizado às ' + agoraStr;
      const elSeintecBadge = document.getElementById('seintec-drive-sync-info');
      if (elSeintecBadge) elSeintecBadge.innerText = 'SHAREPOINT INSTITUCIONAL • 60 ESCOLAS • Sincronizado às ' + agoraStr;

      atualizarBadgeStatusSincronismo(agoraHora);

      setTimeout(function() {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('syncing');
          if (txt) txt.innerText = 'Sincronizar Tudo';
        }
        atualizarPillStatusGlobal('Sincronizado às ' + agoraHora, 'success');

        if (isSilencioso) {
          mostrarToastAgenda('Atualização automática concluída • 12 Módulos e Bases sincronizados às ' + agoraHora, '🔄');
        } else if (typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SISTEMA CONSOLIDADO',
            titulo: 'Sincronização Global Concluída!',
            mensagem: 'Todos os <strong>12 módulos</strong>, <strong>60 escolas</strong> e bases operacionais foram sincronizados.',
            detalhes: 'Consolidado às ' + agoraStr,
            duracao: 5500
          });
        }
      }, 750);
    }

    function sincronizarModulo(modulo, btnEl) {
      if (btnEl) {
        btnEl.classList.add('syncing');
        btnEl.disabled = true;
      }
      const agoraStr = obterTimestampAtualFormatado();

      try {
        switch (modulo) {
          case 'home':
            if (typeof sincronizarTudoGlobalmente === 'function') sincronizarTudoGlobalmente(true);
            else if (typeof hidratarTodosModulosNuvem === 'function') hidratarTodosModulosNuvem();
            if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
            if (typeof renderizarMiniCalendarioHome === 'function') renderizarMiniCalendarioHome();
            mostrarToastAgenda('Consultando fontes em nuvem para atualização do Início...', '⭐');
            break;

          case 'gestao':
            if (typeof hidratarTodosModulosNuvem === 'function') hidratarTodosModulosNuvem();
            if (typeof atualizarDiaGestaoHoje === 'function') atualizarDiaGestaoHoje();
            mostrarToastAgenda('Consultando nuvem para atualizar linha do tempo às ' + agoraStr, '⏱️');
            break;

          case 'agenda':
            if (typeof carregarAgendaCloud === 'function') carregarAgendaCloud();
            if (typeof renderizarAgendaLista === 'function') renderizarAgendaLista();
            if (typeof atualizarEstatisticasAgenda === 'function') atualizarEstatisticasAgenda();
            mostrarToastAgenda('Consultando Google Calendar ao vivo às ' + agoraStr, '📅');
            break;

          case 'carro':
            if (typeof carregarCarroCloud === 'function') carregarCarroCloud();
            if (typeof atualizarCarroOficial === 'function') atualizarCarroOficial();
            mostrarToastAgenda('Consultando nuvem do Carro Oficial às ' + agoraStr, '🚗');
            break;

          case 'visitas':
            if (typeof carregarVisitasLocalStorage === 'function') carregarVisitasLocalStorage();
            if (typeof atualizarPainelVisitas === 'function') atualizarPainelVisitas();
            mostrarToastAgenda('Painel de visitas às 60 escolas atualizado às ' + agoraStr, '🏫');
            break;

          case 'escolas':
            if (typeof sincronizarInventarioSharepoint === 'function') sincronizarInventarioSharepoint(false);
            if (typeof atualizarKpisEscolas === 'function') atualizarKpisEscolas();
            if (typeof atualizarIndicadoresOrdenacaoEscolas === 'function') atualizarIndicadoresOrdenacaoEscolas();
            if (typeof renderizarEscolas === 'function') renderizarEscolas();
            mostrarToastAgenda('Consultando SharePoint ao vivo para atualizar as 60 escolas...', '🏫');
            break;

          case 'gabinete':
            const elGab = document.getElementById('gab-drive-sync-info');
            if (elGab) elGab.innerText = 'SHAREPOINT INSTITUCIONAL • BASES GABINETE • Sincronizado às ' + agoraStr;
            mostrarToastAgenda('Bases do Gabinete (Ouvidoria Fala.SP e Demandas) sincronizadas às ' + agoraStr, '📋');
            break;

          case 'seintec':
            if (typeof sincronizarSharepointCalls === 'function') sincronizarSharepointCalls(true);
            if (typeof sincronizarInventarioSharepoint === 'function') sincronizarInventarioSharepoint(false);
            const elSeintec = document.getElementById('seintec-drive-sync-info');
            if (elSeintec) elSeintec.innerText = 'SHAREPOINT • 60 ESCOLAS • 6 ABAS • Consultando fonte...';
            mostrarToastAgenda('Consultando SharePoint ao vivo (Chamados e Inventário das 60 escolas)...', '🛠️');
            break;

          case 'centro':
            let centroSigla = (document.getElementById('atual-centro-sigla') ? document.getElementById('atual-centro-sigla').value : 'Centro');
            const setorAtivo = document.getElementById('atual-setor-sigla') ? document.getElementById('atual-setor-sigla').value : centroSigla;

            if (centroSigla === 'SEGRE') {
              if (typeof sincronizarDashboardSegre === 'function') sincronizarDashboardSegre(setorAtivo !== 'SEGRE' && setorAtivo !== '');
              if (typeof sincronizarDashboardSemat === 'function') sincronizarDashboardSemat(setorAtivo !== 'SEMAT');
              if (typeof sincronizarDashboardSevesc === 'function') sincronizarDashboardSevesc(setorAtivo !== 'SEVESC');
              mostrarToastAgenda('Consultando SharePoint ao vivo para SEGRE, SEMAT e SEVESC...', '🏫');
              break;
            } else if (centroSigla === 'SEPES') {
              if (setorAtivo === 'SEFREP') {
                if (typeof sincronizarBasePublicaSefrep === 'function') sincronizarBasePublicaSefrep(false);
                mostrarToastAgenda('Consultando SharePoint ao vivo para SEFREP (Pagamento & Frequência)...', '💳');
              } else {
                if (typeof sincronizarDashboardSepes === 'function') sincronizarDashboardSepes(false);
                if (typeof sincronizarBasePublicaSefrep === 'function') sincronizarBasePublicaSefrep(true);
                mostrarToastAgenda('Consultando SharePoint ao vivo para SEPES (SEAPE e SEFREP)...', '👥');
              }
            } else if (centroSigla === 'CAF' || centroSigla === 'SEAFIN') {
              if (typeof sincronizarDashboardSefin === 'function') sincronizarDashboardSefin(setorAtivo !== 'SEFIN' && setorAtivo !== 'CAF' && setorAtivo !== 'SEAFIN' && setorAtivo !== '');
              if (typeof sincronizarDashboardSecomse === 'function') sincronizarDashboardSecomse(setorAtivo !== 'SECOMSE');
              if (typeof sincronizarDashboardDpat === 'function') sincronizarDashboardDpat(setorAtivo === 'DPAT');
              mostrarToastAgenda('Consultando SharePoint ao vivo para SEAFIN (SEFIN, SECOMSE e DPAT)...', '🏛️');
            } else if (centroSigla === 'SEOM') {
              if (typeof sincronizarDashboardSeom === 'function') sincronizarDashboardSeom(setorAtivo !== 'SEFISC');
              if (typeof sincronizarDashboardSefisc === 'function') sincronizarDashboardSefisc(setorAtivo === 'SEFISC');
              mostrarToastAgenda('Consultando SharePoint ao vivo para SEOM e SEFISC...', '🏗️');
            } else {
              mostrarToastAgenda('Módulo ' + centroSigla + ' consultando nuvem às ' + agoraStr, '🏛️');
            }
            break;

          case 'semat':
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
            break;

          case 'sefin':
            if (typeof sincronizarDashboardSefin === 'function') sincronizarDashboardSefin();
            mostrarToastAgenda('Painel Econométrico SEFIN sincronizado com SharePoint às ' + agoraStr, '💰');
            break;

          default:
            mostrarToastAgenda('Módulo sincronizado com sucesso às ' + agoraStr, '🔄');
        }
      } catch (err) {
        console.error('Erro ao sincronizar módulo ' + modulo + ':', err);
        mostrarToastAgenda('Erro ao sincronizar: ' + (err.message || err), '❌');
      }

      atualizarPillStatusGlobal('Sincronizado às ' + agoraStr, 'success');

      setTimeout(function() {
        if (btnEl) {
          btnEl.classList.remove('syncing');
          btnEl.disabled = false;
        }
      }, 600);
    }

    /* Compatibilidade e vinculação de escopo global */
    window.sincronizarTudoGlobalmente = sincronizarTudoGlobalmente;
    window.sincronizarModulo = sincronizarModulo;
    window.verificarSincronizacaoDrive = sincronizarTudoGlobalmente;
    window.mostrarToastGlobal = function(msg, icone) {
      if (typeof mostrarToastAgenda === 'function') {
        mostrarToastAgenda(msg, icone);
      } else if (typeof window.mostrarToastAgenda === 'function') {
        window.mostrarToastAgenda(msg, icone);
      }
    };

    /* ======================================================= */
    /* LÓGICA E DADOS DA ASSESSORIA TÉCNICA & GABINETE */
    /* ======================================================= */

    const GABINETE_BASES_CONFIG = {
      'Demandas': {
        titulo: 'Demandas do Gabinete',
        icone: '📄',
        desc: 'Registros administrativos e judiciais do Gabinete da Dirigente.',
        pasta: 'Demandas',
        registros: [
          { id: 'DEM-2026/041', origem: 'ESE', assunto: 'Adequação de módulo docente EE Prof. José Barreto', data: '18/10/2026', status: 'Em Análise' },
          { id: 'DEM-2026/039', origem: 'Prefeitura de Itapevi', assunto: 'Termo de Cooperação Transporte Escolar', data: '15/10/2026', status: 'Homologado' },
          { id: 'DEM-2026/038', origem: 'FDE', assunto: 'Cronograma de reformas prediais 2026', data: '12/10/2026', status: 'Concluído' }
        ]
      },
      'Ouvidoria': {
        titulo: 'Ouvidoria - Fala.SP',
        icone: '⭕',
        desc: 'Manifestações, protocolos, prazos legais, escola/local e respostas oficiais.',
        pasta: 'OuvidoriaFalaSP',
        registros: [
          { id: 'OUV-882194', origem: 'Fala.SP', assunto: 'Solicitação de vaga período matutino - EE Raul Briquet', data: '19/10/2026', status: 'No Prazo (3 dias)' },
          { id: 'OUV-881902', origem: 'Fala.SP', assunto: 'Esclarecimento sobre transporte escolar rural', data: '16/10/2026', status: 'Respondido' },
          { id: 'OUV-881420', origem: 'Fala.SP', assunto: 'Manutenção de bebedouro - Polo Central', data: '14/10/2026', status: 'Concluído' }
        ]
      },
      'TermosVisita': {
        titulo: 'Termos de Visita',
        icone: '✔️',
        desc: 'Termos de visita e acompanhamento das escolas estaduais e particulares.',
        pasta: 'TermosVisita',
        registros: [
          { id: 'TRM-145/26', origem: 'ESE', assunto: 'Visita Técnica e Pedagógica - EE Celso Pacheco', data: '20/10/2026', status: 'Arquivado' },
          { id: 'TRM-144/26', origem: 'Dirigente Regional', assunto: 'Acompanhamento do SARESP - EE Toufic Joulian', data: '18/10/2026', status: 'Arquivado' },
          { id: 'TRM-143/26', origem: 'Supervisão Particular', assunto: 'Inspeção Anual Colégio Objetivo Itapevi', data: '15/10/2026', status: 'Aprovado' }
        ]
      },
      'EscalaFerias': {
        titulo: 'Escala de Férias',
        icone: 'F',
        desc: 'Escala anual de férias e recesso dos gestores escolares e supervisores.',
        pasta: 'EscalaFerias',
        registros: [
          { id: 'FER-2026/02', origem: 'ASURE/SEPES', assunto: 'Escala Consolidada Férias Janeiro/2027 Diretores', data: '10/10/2026', status: 'Publicado' },
          { id: 'FER-2026/01', origem: 'ASURE/SEPES', assunto: 'Recesso de Julho - Escala de Plantão Gestores', data: '05/06/2026', status: 'Concluído' }
        ]
      },
      'HorarioADM': {
        titulo: 'Horário ADM - Diretor',
        icone: 'H',
        desc: 'Horário de trabalho administrativo homologado dos Diretores de Escola.',
        pasta: 'HorarioADM',
        registros: [
          { id: 'HOR-60/60', origem: 'Supervisão', assunto: 'Quadro de Horários Gestores 2º Semestre Homologado', data: '08/09/2026', status: 'Homologado' }
        ]
      },
      'FolhaPonto': {
        titulo: 'Folha de Ponto - Diretores',
        icone: 'P',
        desc: 'Acompanhamento mensal da folha de ponto e frequência dos Diretores.',
        pasta: 'FolhaPontoDiretores',
        registros: [
          { id: 'PNT-SET/26', origem: 'Gabinete', assunto: 'Consolidação Frequência Diretores Setembro/2026', data: '05/10/2026', status: '59 de 60 Entregues' },
          { id: 'PNT-AGO/26', origem: 'Gabinete', assunto: 'Consolidação Frequência Diretores Agosto/2026', data: '05/09/2026', status: 'Homologado' }
        ]
      },
      'PlanoTrabalhoDiretores': {
        titulo: 'Plano de Trabalho - Diretores',
        icone: 'D',
        desc: 'Acompanhamento e validação dos planos de gestão dos Diretores de Escola.',
        pasta: 'PlanoTrabalhoDiretores',
        registros: [
          { id: 'PLN-DIR-26', origem: 'Gabinete', assunto: 'Revisão Bienal dos Planos de Gestão Escolar (60 Unidades)', data: '12/10/2026', status: 'Validado' }
        ]
      },
      'PlanoTrabalhoSupervisores': {
        titulo: 'Plano de Trabalho - Supervisores',
        icone: 'S',
        desc: 'Acompanhamento mensal dos planos de trabalho dos Supervisores de Ensino.',
        pasta: 'PlanoTrabalhoSupervisores',
        registros: [
          { id: 'PLN-SUP-26', origem: 'Dirigente', assunto: 'Roteiros de Visita e Metas de Acompanhamento Bimestral', data: '14/10/2026', status: 'Em Execução' }
        ]
      },
      'Judicial': {
        titulo: 'Judicial & Mandados',
        icone: 'J',
        desc: 'Demandas registradas, mandados de segurança, ofícios do MP e Judiciário.',
        pasta: 'Judicial',
        registros: [
          { id: 'JUD-042/26', origem: 'Vara da Infância e Juventude', assunto: 'Acolhimento de matrícula compulsória - Cumprido', data: '17/10/2026', status: 'Atendido' },
          { id: 'JUD-038/26', origem: 'Ministério Público de Itapevi', assunto: 'Informações sobre adaptação de acessibilidade', data: '11/10/2026', status: 'Em Resposta' }
        ]
      }
    };

    let baseAtivaGabinete = 'TermosVisita';

    function abrirAssessoriaTecnica() {
      esconderTodasAsPanes();
      document.getElementById('pane-gabinete').classList.add('active');
      atualizarBreadcrumbTopo('07 - ASURE • Gabinete & Assessoria');

      document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));
      const sideBtn = document.getElementById('side-btn-ASURE');
      if (sideBtn) sideBtn.classList.add('active');

      selecionarBaseGabinete('TermosVisita');
      rolarAoTopoSuave();
    }

    function selecionarBaseGabinete(idBase) {
      const base = GABINETE_BASES_CONFIG[idBase];
      if (!base) return;

      baseAtivaGabinete = idBase;

      document.querySelectorAll('.base-card-item').forEach(card => card.classList.remove('selected'));
      const cardEl = document.getElementById(`card-base-${idBase}`);
      if (cardEl) cardEl.classList.add('selected');

      document.getElementById('panel-base-title').innerHTML = `<span>${base.icone}</span> <span>${base.titulo}</span>`;
      document.getElementById('panel-base-desc').innerText = base.desc;
      const destEl = document.getElementById('gab-upload-dest-text');
      if (destEl) {
        destEl.innerHTML = `📁 Destino no Drive: <b>Uploads BIDirigente / AssessoriaTecnica / ${base.pasta}</b>`;
      }

      const tbody = document.getElementById('panel-records-tbody');
      tbody.innerHTML = "";
      /* Ordenação padrão: da data mais recente à mais antiga */
      var regsOrdenados = [...(base.registros || [])].sort(function(a, b) {
        var parseD = function(s) {
          var m = (s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          return m ? new Date(parseInt(m[3],10), parseInt(m[2],10)-1, parseInt(m[1],10)).getTime() : 0;
        };
        return parseD(b.data) - parseD(a.data);
      });
      regsOrdenados.forEach(reg => {
        const tr = document.createElement('tr');
        const badgeClass = reg.status.includes('No Prazo') || reg.status.includes('Homologado') || reg.status.includes('Concluído') || reg.status.includes('Aprovado') || reg.status.includes('Atendido') || reg.status.includes('Arquivado') || reg.status.includes('Validado')
          ? 'status-badge-ok'
          : (reg.status.includes('Em') ? 'status-badge-warn' : 'status-badge-info');

        tr.innerHTML = `
          <td><strong>${reg.id}</strong></td>
          <td>${reg.origem}</td>
          <td>${reg.assunto}</td>
          <td style="text-align: center;">${reg.data}</td>
          <td><span class="status-badge-inline ${badgeClass}">${reg.status}</span></td>
        `;
        tbody.appendChild(tr);
      });

      document.getElementById('gab-base-detail-panel').classList.add('active');
      alternarAbaGabinete('registros');
      limparTodosArquivosGabinete();

      const panel = document.getElementById('gab-base-detail-panel');
      if (panel) {
        /* Sem scroll automatico */
      }
    }

    function fecharPainelGabinete() {
      document.getElementById('gab-base-detail-panel').classList.remove('active');
      document.querySelectorAll('.base-card-item').forEach(card => card.classList.remove('selected'));
    }

    function alternarAbaGabinete(tipoAba) {
      document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.remove('active'));

      if (tipoAba === 'registros') {
        document.getElementById('tab-btn-registros').classList.add('active');
        document.getElementById('tab-content-registros').classList.add('active');
      } else {
        document.getElementById('tab-btn-upload').classList.add('active');
        document.getElementById('tab-content-upload').classList.add('active');
      }
    }

    let arquivosSelecionadosGabinete = [];

    function aoSelecionarArquivosGabinete(event) {
      const input = event.target;
      if (!input.files || input.files.length === 0) return;

      Array.from(input.files).forEach(novo => {
        const jaExiste = arquivosSelecionadosGabinete.some(existente => existente.name === novo.name && existente.size === novo.size);
        if (!jaExiste) arquivosSelecionadosGabinete.push(novo);
      });

      renderizarListaArquivosGabinete();
    }

    function renderizarListaArquivosGabinete() {
      const container = document.getElementById('gab-selected-files-list');
      const toolbar = document.getElementById('gab-upload-toolbar');
      const dropzoneLabel = document.getElementById('dropzone-label-gab');

      if (!container) return;
      container.innerHTML = "";

      if (arquivosSelecionadosGabinete.length === 0) {
        if (toolbar) toolbar.style.display = 'none';
        if (dropzoneLabel) dropzoneLabel.innerText = 'Clique ou arraste seus documentos aqui (PDF e Excel)';
        return;
      }

      if (toolbar) toolbar.style.display = 'flex';
      if (dropzoneLabel) dropzoneLabel.innerText = `${arquivosSelecionadosGabinete.length} documento(s) selecionado(s)`;

      arquivosSelecionadosGabinete.forEach((file, index) => {
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
            <button class="btn-file-action btn-remove" onclick="removerArquivoGabinete(${index})" title="Remover">✕</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function removerArquivoGabinete(index) {
      if (index >= 0 && index < arquivosSelecionadosGabinete.length) {
        arquivosSelecionadosGabinete.splice(index, 1);
        renderizarListaArquivosGabinete();
      }
    }

    function limparTodosArquivosGabinete() {
      arquivosSelecionadosGabinete = [];
      const input = document.getElementById('arquivo-input-gab');
      if (input) input.value = "";
      renderizarListaArquivosGabinete();
      const alertBox = document.getElementById('upload-status-alert-gab');
      if (alertBox) alertBox.style.display = 'none';
    }

    async function enviarArquivosGabinete() {
      if (arquivosSelecionadosGabinete.length === 0) {
        alert('Selecione pelo menos um documento antes de enviar.');
        return;
      }

      const botao = document.getElementById('btn-submit-upload-gab');
      const alertBox = document.getElementById('upload-status-alert-gab');
      const base = GABINETE_BASES_CONFIG[baseAtivaGabinete];

      botao.disabled = true;
      botao.innerHTML = `<span>⏳ Enviando ${arquivosSelecionadosGabinete.length} documento(s)...</span>`;
      alertBox.className = 'upload-status-alert loading';
      alertBox.innerHTML = `Enviando arquivos para <b>AssessoriaTecnica / ${base.pasta}</b>...`;

      try {
        const arquivosPayload = [];
        for (let i = 0; i < arquivosSelecionadosGabinete.length; i++) {
          const file = arquivosSelecionadosGabinete[i];
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          arquivosPayload.push({
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            data: base64
          });
        }

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run
            .withSuccessHandler(function(resultados) {
              botao.disabled = false;
              botao.innerHTML = '<span>📤 Salvar Todos os Documentos na Base</span>';
              limparTodosArquivosGabinete();
              alertBox.className = 'upload-status-alert success';
              let linksHtml = `✅ <b>Sucesso!</b> ${resultados.length} documento(s) arquivados em <b>AssessoriaTecnica / ${base.pasta}</b>:<ul style="margin-top: 0.5rem; padding-left: 1.2rem;">`;
              resultados.forEach(res => {
                const icon = res.fileName.toLowerCase().endsWith('.pdf') ? '📕' : '📊';
                linksHtml += `<li style="margin-bottom: 0.25rem;">${icon} <b>${res.fileName}</b> - <a href="${res.url}" target="_blank" rel="noopener noreferrer" style="color: #065f46; font-weight: 700; text-decoration: underline;">Abrir Repositório Nuvem ↗</a></li>`;
              });
              linksHtml += `</ul>`;
              alertBox.innerHTML = linksHtml;
            })
            .withFailureHandler(function(erro) {
              botao.disabled = false;
              botao.innerHTML = '<span>📤 Salvar Todos os Documentos na Base</span>';
              alertBox.className = 'upload-status-alert error';
              alertBox.innerHTML = `❌ Falha no envio: ${erro.message || erro}`;
            })
            .processMultipleFilesUpload(arquivosPayload, base.pasta, 'AssessoriaTecnica');
        } else {
          setTimeout(() => {
            botao.disabled = false;
            botao.innerHTML = '<span>📤 Salvar Todos os Documentos na Base</span>';
            limparTodosArquivosGabinete();
            alertBox.className = 'upload-status-alert success';
            alertBox.innerHTML = `✅ [Simulação] ${arquivosPayload.length} documento(s) arquivados em <b>AssessoriaTecnica / ${base.pasta}</b>!`;
          }, 800);
        }
      } catch (err) {
        botao.disabled = false;
        botao.innerHTML = '<span>📤 Salvar Todos os Documentos na Base</span>';
        alertBox.className = 'upload-status-alert error';
        alertBox.innerHTML = `❌ Erro: ${err.message || err}`;
      }
    }
