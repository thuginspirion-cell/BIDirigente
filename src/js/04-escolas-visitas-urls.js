    var esconderTodasAsPanes = window.esconderTodasAsPanes || function() {
      document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));
    };
    window.esconderTodasAsPanes = esconderTodasAsPanes;

    var rolarAoTopoSuave = window.rolarAoTopoSuave = function rolarAoTopoSuave() {
      try {
        const mc = document.querySelector('.main-content');
        if (mc) {
          if (typeof mc.scrollTo === 'function') {
            mc.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            mc.scrollTop = 0;
          }
        }
      } catch (e) {}
      try {
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (e) {
        try { window.scrollTo(0, 0); } catch (err) {}
      }
    };
    window.rolarAoTopoSuave = rolarAoTopoSuave;

    var atualizarBreadcrumbTopo = window.atualizarBreadcrumbTopo || function(texto) {
      const el = document.getElementById('topbar-view-indicator');
      if (el) {
        el.style.display = 'none';
        el.innerText = '';
      }
    };
    window.atualizarBreadcrumbTopo = atualizarBreadcrumbTopo;

    /* === IDENTIDADE VISUAL & BRASÃO OFICIAL URE ITAPEVI === */
    

    function aplicarIdentidadeVisual() {
      try {
        if (typeof google !== 'undefined' && google.script && google.script.run) {
          try {
            var runner = typeof google.script.run.withSuccessHandler === 'function'
              ? google.script.run.withSuccessHandler(function(dataUri) {
                  if (dataUri) {
                    document.querySelectorAll('.brand-logo-img').forEach(function(img) {
                      img.src = dataUri;
                    });
                  }
                })
              : google.script.run;
            if (runner && typeof runner.getLogoDataUri === 'function') {
              runner.getLogoDataUri();
            }
          } catch (e1) {
            console.warn("Logo URE via GAS:", e1);
          }

          try {
            var runnerSeintec = typeof google.script.run.withSuccessHandler === 'function'
              ? google.script.run.withSuccessHandler(function(dataUri) {
                  if (dataUri) {
                    const el = document.getElementById('seintec-sidebar-logo');
                    if (el) el.src = dataUri;
                  }
                })
              : google.script.run;
            if (runnerSeintec && typeof runnerSeintec.getSeintecLogoDataUri === 'function') {
              runnerSeintec.getSeintecLogoDataUri();
            }
          } catch (e2) {
            console.warn("Logo SEINTEC via GAS:", e2);
          }
        } else {
          document.querySelectorAll('.brand-logo-img').forEach(function(img) {
            img.src = './logo_ure_itapevi_480.png';
          });
          const el = document.getElementById('seintec-sidebar-logo');
          if (el) el.src = './logo_seintec.png';
        }
      } catch (errGlobal) {
        console.warn("Aviso na aplicação de identidade visual:", errGlobal);
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', aplicarIdentidadeVisual);
    } else {
      aplicarIdentidadeVisual();
    }

    /* === CONTROLE DE RECOLHIMENTO DA BARRA LATERAL (SIDEBAR TOGGLE) === */
    function toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const btn = document.getElementById('sidebar-toggle-btn') || document.querySelector('.sidebar-collapse-btn');
      if (!sidebar) return;

      const isCollapsed = sidebar.classList.toggle('collapsed');
      if (btn) {
        btn.setAttribute('title', isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral');
        btn.setAttribute('aria-label', isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral');
      }
    }

    function inicializarSidebar() {
      /* Barra lateral inicia sempre expandida (estado em memória, sem gravação local) */
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inicializarSidebar);
    } else {
      inicializarSidebar();
    }



    /* ======================================================== */
    /* GESTÃO COMPLETA DA REDE ESCOLAR (URE ITAPEVI) */
    /* ======================================================== */
        const BASE_ESCOLAS_PADRAO = [
  {
    "id": "esc-001",
    "cie": "009787",
    "nome": "Ivani Maria Paes, Professora",
    "nomeOficialBruto": "IVANI MARIA PAES PROFESSORA",
    "arquivoInventario": "9787 - IVANI MARIA PAES PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Professora Ivani Maira Paes, 21 – Vila Boa Vista",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Camila",
    "telefone": "(11) 2658-8082",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-002",
    "cie": "009799",
    "nome": "Caio Prado Junior, Deputado",
    "nomeOficialBruto": "CAIO PRADO JUNIOR DEPUTADO",
    "arquivoInventario": "9799 - CAIO PRADO JUNIOR DEPUTADO - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Oscar Bressane, 85 – Jd Califórnia",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Tereza",
    "telefone": "(11) 2658-8062",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-003",
    "cie": "009830",
    "nome": "Republica do Equador",
    "nomeOficialBruto": "REPUBLICA DO EQUADOR",
    "arquivoInventario": "9830 - REPUBLICA DO EQUADOR - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Maria Helena, 155 – Engenho Novo",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Fabiana",
    "telefone": "(11) 2658-8057",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-004",
    "cie": "009878",
    "nome": "Alayde Domingues Couto Macedo, Professora",
    "nomeOficialBruto": "ALAYDE DOMINGUES COUTO MACEDO PROFESSORA",
    "arquivoInventario": "9878 - ALAYDE DOMINGUES COUTO MACEDO PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Avenida Brigadeiro Manoel Rodrigues Jordão, 1135 -Jd Tupã",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Silvana",
    "telefone": "(11) 2658-8052",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-005",
    "cie": "009891",
    "nome": "Jose Wilson Padinha, Professor",
    "nomeOficialBruto": "JOSE WILSON PADINHA PROFESSOR",
    "arquivoInventario": "9891 - JOSE WILSON PADINHA PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Diogenes Ribeiro de Lima, 369 – Jd Belval",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Wilson",
    "telefone": "(11) 2658-8042",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-006",
    "cie": "009912",
    "nome": "Aldeia de Barueri",
    "nomeOficialBruto": "ALDEIA DE BARUERI",
    "arquivoInventario": "9912 - ALDEIA DE BARUERI - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Rio Paraná, 206 – Aldeia de Barueri",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Raquel",
    "telefone": "(11) 2658-8077",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-007",
    "cie": "009921",
    "nome": "Jose Domingos da Silveira, Professor",
    "nomeOficialBruto": "JOSE DOMINGOS DA SILVEIRA PROFESSOR",
    "arquivoInventario": "9921 - JOSE DOMINGOS DA SILVEIRA PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Avenida São Vicente de Paula, 100 – Jd São Vicente",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Robenícia",
    "telefone": "(11) 2658-8037",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-008",
    "cie": "010364",
    "nome": "Dorvalino Abilio Teixeira",
    "nomeOficialBruto": "DORVALINO ABILIO TEIXEIRA",
    "arquivoInventario": "10364 - DORVALINO ABILIO TEIXEIRA - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Rita do Nascimento Duca – Jd Belmonte",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Simone",
    "telefone": "(11) 2658-8217",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-009",
    "cie": "010376",
    "nome": "Maria Cristina Lopes",
    "nomeOficialBruto": "MARIA CRISTINA LOPES",
    "arquivoInventario": "10376 - MARIA CRISTINA LOPES - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Rio Grande do Sul, 59 – Jd Alvorada",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Cris",
    "telefone": "(11) 2658-8232",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-010",
    "cie": "010388",
    "nome": "Jose Chaluppe",
    "nomeOficialBruto": "JOSE CHALUPPE",
    "arquivoInventario": "10388 - JOSE CHALUPPE - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Largo Adelina Nunes Coelho, 2 – Vl São Francisco",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Debora",
    "telefone": "(11) 2658-8127",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-011",
    "cie": "010397",
    "nome": "Vicente Themudo Lessa, Professor",
    "nomeOficialBruto": "VICENTE THEMUDO LESSA PROFESSOR",
    "arquivoInventario": "10397 - VICENTE THEMUDO LESSA PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Avenida Joao Balhesteiro, 186 – Centro",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Regiane",
    "telefone": "(11) 2658-8247",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-012",
    "cie": "010424",
    "nome": "Celina de Barros Bairao, Professora",
    "nomeOficialBruto": "CELINA DE BARROS BAIRAO PROFESSORA",
    "arquivoInventario": "10424 - CELINA DE BARROS BAIRAO PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Eduardo de Abreu, 101 – Vl Dr Cardoso",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Aidê",
    "telefone": "(11) 2658-8167",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-013",
    "cie": "010431",
    "nome": "Americo Valentin Christianini",
    "nomeOficialBruto": "AMERICO VALENTIN CHRISTIANINI",
    "arquivoInventario": "10431 - AMERICO VALENTIN CHRISTIANINI - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "R. Rosemary Belli, 01 - Jardim Santa Rita, Itapevi - SP, 06660-150",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Elenice",
    "telefone": "(11) 2658-8187",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-014",
    "cie": "010443",
    "nome": "Nacif Amin Chalupe",
    "nomeOficialBruto": "NACIF AMIN CHALUPE",
    "arquivoInventario": "10443 - NACIF AMIN CHALUPE - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rodovia Engenheiro Rene Benedito Silva – Santa Flora",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Kelly",
    "telefone": "(11) 2658-8137",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-015",
    "cie": "010467",
    "nome": "Raul Briquet, Doutor",
    "nomeOficialBruto": "RAUL BRIQUET DOUTOR",
    "arquivoInventario": "10467 - RAUL BRIQUET DOUTOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Escolastica Chaluppe, 218 – Centro",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Marcia",
    "telefone": "(11) 2658-8102",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-016",
    "cie": "010479",
    "nome": "Claro Camargo Ribeiro",
    "nomeOficialBruto": "CLARO CAMARGO RIBEIRO",
    "arquivoInventario": "10479 - CLARO CAMARGO RIBEIRO - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Bambina Amirabille Chaluppe, 511 – Amador Bueno",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Elaine",
    "telefone": "(11) 2658-8207",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-017",
    "cie": "010480",
    "nome": "Dimaraes Antonio Sandei, Professor",
    "nomeOficialBruto": "DIMARAES ANTONIO SANDEI PROFESSOR",
    "arquivoInventario": "10480 - DIMARAES ANTONIO SANDEI PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Arnaldo Sergio Cordeiro da Neves, 105 – Jd Portela",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Etiene",
    "telefone": "(11) 2658-8147",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-018",
    "cie": "010613",
    "nome": "Candido Rondon, Marechal",
    "nomeOficialBruto": "CANDIDO RONDON MARECHAL",
    "arquivoInventario": "10613 - CANDIDO RONDON MARECHAL - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Avenida Rubens Caramez, 779 – Jd Jurema",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Simone",
    "telefone": "(11) 2658-8132",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-019",
    "cie": "010649",
    "nome": "Henrique Sammartino, Alferes",
    "nomeOficialBruto": "HENRIQUE SAMMARTINO ALFERES",
    "arquivoInventario": "10649 - HENRIQUE SAMMARTINO ALFERES - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Maria Aparecida Pedrosa, 35 – Vila Rosa Emilia",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Anderson",
    "telefone": "(11) 2658-8272",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-020",
    "cie": "010650",
    "nome": "Jose Neyde Cesar Lessa, Doutor",
    "nomeOficialBruto": "JOSE NEYDE CESAR LESSA DOUTOR",
    "arquivoInventario": "10650 - JOSE NEYDE CESAR LESSA DOUTOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Avenida Presidente Vargas, 900 – Vila Nova Itapevi",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Carla",
    "telefone": "(11) 2658-8122",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-021",
    "cie": "010662",
    "nome": "Oswaldo Sammartino",
    "nomeOficialBruto": "OSWALDO SAMMARTINO",
    "arquivoInventario": "10662 - OSWALDO SAMMARTINO - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Alberto Rufollo, 143 – Vl Anita Costa",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Josiane",
    "telefone": "(11) 2658-8242",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-022",
    "cie": "035440",
    "nome": "Republica de Cuba",
    "nomeOficialBruto": "REPUBLICA DE CUBA",
    "arquivoInventario": "35440 - REPUBLICA DE CUBA - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Governador Adhemar Pereira de Barros, 117 – Jd Itaquiti",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Guta",
    "telefone": "(11) 2658-8072",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-023",
    "cie": "040548",
    "nome": "Nestor de Camargo, Prefeito",
    "nomeOficialBruto": "NESTOR DE CAMARGO PREFEITO",
    "arquivoInventario": "40548 - NESTOR DE CAMARGO PREFEITO - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Vitorino, 206 – Jd Mutinga",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "João",
    "telefone": "(11) 2658-8022",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-024",
    "cie": "040551",
    "nome": "Lenio Vieira de Moraes, Professor",
    "nomeOficialBruto": "LENIO VIEIRA DE MORAES PROFESSOR",
    "arquivoInventario": "40551 - LENIO VIEIRA DE MORAES PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Via Tabajara, 45 – Jd Santa Mônica",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Valdinei",
    "telefone": "(11) 2658-8047",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-025",
    "cie": "041373",
    "nome": "Joao Batista Solde",
    "nomeOficialBruto": "JOAO BATISTA SOLDE",
    "arquivoInventario": "41373 - JOAO BATISTA SOLDE - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Visconde de Maua, 5 – Jd São Nicolau",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Rosana",
    "telefone": "(11) 2658-8212",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-026",
    "cie": "041385",
    "nome": "Moacir Thomaz da Silva",
    "nomeOficialBruto": "MOACIR THOMAZ DA SILVA",
    "arquivoInventario": "41385 - MOACIR THOMAZ DA SILVA - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Ana Maria Bonfadini, 200 – Jd Gabriela",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Mitcheel",
    "telefone": "(11) 2658-8237",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-027",
    "cie": "043333",
    "nome": "Nercy Amelia Martelini Daher, Professora",
    "nomeOficialBruto": "NERCY AMELIA MARTELINI DAHER PROFESSORA",
    "arquivoInventario": "43333 - NERCY AMELIA MARTELINI DAHER PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Pirapora do Bom Jesus",
    "bairro": "Rua Aluizio de Azevedo, 100 – Vila Nova",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Nalva",
    "telefone": "(11) 2658-8282",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-028",
    "cie": "043886",
    "nome": "Jose Theotonio dos Santos, Professor",
    "nomeOficialBruto": "JOSE THEOTONIO DOS SANTOS PROFESSOR",
    "arquivoInventario": "43886 - JOSE THEOTONIO DOS SANTOS PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Francisca Maria da Silva Ribeiro, 140 – Ambuitá",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Sandra",
    "telefone": "(11) 2658-8157",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-029",
    "cie": "044817",
    "nome": "Luis da Camara Cascudo",
    "nomeOficialBruto": "LUIS DA CAMARA CASCUDO",
    "arquivoInventario": "44817 - LUIS DA CAMARA CASCUDO - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua das Orquideas, 270 – Jd Marília",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Lilia",
    "telefone": "(11) 2658-8227",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-030",
    "cie": "044921",
    "nome": "Myrthes Therezinha Assad Villela, Professora",
    "nomeOficialBruto": "MYRTHES THEREZINHA ASSAD VILLELA PROFA",
    "arquivoInventario": "44921 - MYRTHES THEREZINHA ASSAD VILLELA PROFA - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Firmo de Oliveira, 8 – Centro",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Lucila",
    "telefone": "(11) 2658-8087",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-031",
    "cie": "044933",
    "nome": "Mario Joaquim Escobar de Andrade",
    "nomeOficialBruto": "MARIO JOAQUIM ESCOBAR DE ANDRADE",
    "arquivoInventario": "44933 - MARIO JOAQUIM ESCOBAR DE ANDRADE - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Estrada dos Pinheiros, 193 – Parque Viana",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Robson",
    "telefone": "(11) 2658-8017",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-032",
    "cie": "046607",
    "nome": "Joao Nascif Chalupp",
    "nomeOficialBruto": "JOAO NASCIF CHALUPP",
    "arquivoInventario": "46607 - JOAO NASCIF CHALUPP - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rodovia Eng. Rene Benedito Silva,sn – Amador Bueno",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Ricardo",
    "telefone": "(11) 2658-8117",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-033",
    "cie": "048161",
    "nome": "Iracema Rauen Maciel, Professora",
    "nomeOficialBruto": "IRACEMA RAUEN MACIEL PROFESSORA",
    "arquivoInventario": "48161 - IRACEMA RAUEN MACIEL PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Avenida Benfica, 295 – Vl Santa Rita",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Rosimeire",
    "telefone": "(11) 2658-8182",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-034",
    "cie": "048173",
    "nome": "Eliza de Oliveira Ribeiro",
    "nomeOficialBruto": "ELIZA DE OLIVEIRA RIBEIRO",
    "arquivoInventario": "48173 - ELIZA DE OLIVEIRA RIBEIRO - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Luiza Prebotti Tasso, 360 – Pq Miraflor",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Magda",
    "telefone": "(11) 2658-8107",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-035",
    "cie": "048975",
    "nome": "Mary Mallet Cyrino, Professora",
    "nomeOficialBruto": "MARY MALLET CYRINO PROFESSORA",
    "arquivoInventario": "48975 - MARY MALLET CYRINO PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Avenida Serra de Parima, 20 – Jd Bela Vista",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Miriam",
    "telefone": "(11) 2658-8202",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-036",
    "cie": "048999",
    "nome": "Romeo Mecca, Padre",
    "nomeOficialBruto": "ROMEO MECCA PADRE",
    "arquivoInventario": "48999 - ROMEO MECCA PADRE - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua dos Cariocas, 22 – Pq Suburbano",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Arcangela",
    "telefone": "(11) 2658-8112",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-037",
    "cie": "049013",
    "nome": "Manoel Augusto Vieira Neto, Desembargador",
    "nomeOficialBruto": "MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR",
    "arquivoInventario": "49013 - MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Marques de Santo Amaro, 66 – Vila Godinho",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Flavia",
    "telefone": "(11) 2658-8222",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-038",
    "cie": "049025",
    "nome": "Jardim Maria Helena I",
    "nomeOficialBruto": "JARDIM MARIA HELENA I",
    "arquivoInventario": "49025 - JARDIM MARIA HELENA I - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Cristiane, 25 – Pq dos Camargos",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Katia",
    "telefone": "(11) 2658-8007",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-039",
    "cie": "149317",
    "nome": "Jose Sergio Pereira, Professor",
    "nomeOficialBruto": "JOSE SERGIO PEREIRA PROFESSOR",
    "arquivoInventario": "149317 - JOSE SERGIO PEREIRA PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua dos Sul Americanos, sn – Pq Suburbano",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Ana Paula",
    "telefone": "(11) 2658-8152",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-040",
    "cie": "290075",
    "nome": "Henrique Fernando Gomes, Estudante",
    "nomeOficialBruto": "HENRIQUE FERNANDO GOMES ESTUDANTE",
    "arquivoInventario": "290075 - HENRIQUE FERNANDO GOMES ESTUDANTE - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Avenida Giovani Attilio Tolaine, 115 – Jd. Maria Helena",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Osnir",
    "telefone": "(11) 2658-8002",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-041",
    "cie": "352561",
    "nome": "Air Ferreira do Nascimento, Professor",
    "nomeOficialBruto": "AIR FERREIRA DO NASCIMENTO PROFESSOR",
    "arquivoInventario": "352561 - AIR FERREIRA DO NASCIMENTO PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Estrada Elias Alves da Costa,799 – Pq Boa Esperança",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Agnaldo",
    "telefone": "(11) 2658-8192",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-042",
    "cie": "496790",
    "nome": "Terezinha Palone da Silva Domingues, Professora",
    "nomeOficialBruto": "TEREZINHA PALONE DA SILVA DOMINGUES PROFA",
    "arquivoInventario": "496790 - TEREZINHA PALONE DA SILVA DOMINGUES PROFA - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Estrada Velha de Itapevi, sn – Jd Nossa Senhora de Fátima",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Angelica",
    "telefone": "(11) 2658-8262",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-043",
    "cie": "902044",
    "nome": "Ignes Amelia Oliveira Machado, Professora",
    "nomeOficialBruto": "IGNES AMELIA OLIVEIRA MACHADO PROFESSORA",
    "arquivoInventario": "902044 - IGNES AMELIA OLIVEIRA MACHADO PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Luis Belli, 800 – Cohab II",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Eduardo",
    "telefone": "(11) 2658-8177",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-044",
    "cie": "908548",
    "nome": "Paulo de Abreu",
    "nomeOficialBruto": "PAULO DE ABREU",
    "arquivoInventario": "908548 - PAULO DE ABREU - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Adilson Soares Santos, 70 – Jd Julieta",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Nilton",
    "telefone": "(11) 2658-8142",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-045",
    "cie": "908563",
    "nome": "Dolores Garcia Paschoalin",
    "nomeOficialBruto": "DOLORES GARCIA PASCHOALIN",
    "arquivoInventario": "908563 - DOLORES GARCIA PASCHOALIN - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Jose de Albuquerque, 68 – Jd Lindomar II",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Gilberto",
    "telefone": "(11) 2658-8257",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-046",
    "cie": "908617",
    "nome": "Jardim Paulista",
    "nomeOficialBruto": "JARDIM PAULISTA",
    "arquivoInventario": "908617 - JARDIM PAULISTA - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Avenida Anibal Correia, 2363 – Jd Paulista",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Alessandra",
    "telefone": "(11) 2658-8092",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-047",
    "cie": "908836",
    "nome": "Itajahy Feitosa Martins, Professor",
    "nomeOficialBruto": "ITAJAHY FEITOSA MARTINS PROFESSOR",
    "arquivoInventario": "908836 - ITAJAHY FEITOSA MARTINS PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Renata, 191 – Pq dos Camargos",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Edna",
    "telefone": "(11) 2658-8032",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-048",
    "cie": "910454",
    "nome": "Maria Soares Santos, Professora",
    "nomeOficialBruto": "MARIA SOARES SANTOS PROFESSORA",
    "arquivoInventario": "910454 - MARIA SOARES SANTOS PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Nelson Ezequiel de Farias, 629 – Jd Briquet",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Helaine",
    "telefone": "(11) 2658-8197",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-049",
    "cie": "910485",
    "nome": "Amador Aguiar",
    "nomeOficialBruto": "AMADOR AGUIAR",
    "arquivoInventario": "910485 - AMADOR AGUIAR - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Martins Fontes, 412 – Pq Imperial",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Marinez",
    "telefone": "FASE DE INSTALAÇÃO",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-050",
    "cie": "918787",
    "nome": "Wilmar Soares da Silva",
    "nomeOficialBruto": "WILMAR SOARES DA SILVA",
    "arquivoInventario": "918787 - WILMAR SOARES DA SILVA - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Guarujá, 500 – Vale do Sol",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Patricia",
    "telefone": "(11) 2658-8252",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-051",
    "cie": "918805",
    "nome": "Leonor Mendes de Barros",
    "nomeOficialBruto": "LEONOR MENDES DE BARROS",
    "arquivoInventario": "918805 - LEONOR MENDES DE BARROS - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Alameda Leblon, 105 – 18 do Forte",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Carlos",
    "telefone": "(11) 2658-8012",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-052",
    "cie": "920241",
    "nome": "Parque Imperial",
    "nomeOficialBruto": "PARQUE IMPERIAL",
    "arquivoInventario": "920241 - PARQUE IMPERIAL - INVENTÁRIO.xlsx",
    "cidade": "Barueri",
    "bairro": "Rua Padre Cicero Romao Batista, 269 – Pq Imperial",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Alessandro",
    "telefone": "(11) 2658-8027",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-053",
    "cie": "921439",
    "nome": "Paulo da Costa Pan Chacon, Professor",
    "nomeOficialBruto": "PAULO DA COSTA PAN CHACON PROFESSOR",
    "arquivoInventario": "921439 - PAULO DA COSTA PAN CHACON PROFESSOR - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Avenida Pedro Paulino, sn – Jd Paulista",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Luciana",
    "telefone": "(11) 2658-8162",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-054",
    "cie": "921440",
    "nome": "Giuseppe Angelo Bertolli, Padre",
    "nomeOficialBruto": "GIUSEPPE ANGELO BERTOLLI PADRE",
    "arquivoInventario": "921440 - GIUSEPPE ANGELO BERTOLLI PADRE - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Imirim, 1005 – Jd N Sra de Fátima",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Andrea",
    "telefone": "(11) 2658-8999",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-055",
    "cie": "923333",
    "nome": "Josepha Pinto Chiavelli, Professora",
    "nomeOficialBruto": "JOSEPHA PINTO CHIAVELLI PROFESSORA",
    "arquivoInventario": "923333 - JOSEPHA PINTO CHIAVELLI PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Jandira",
    "bairro": "Rua Joao Barbosa, 243 – Vila Eunice",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Sandra",
    "telefone": "(11) 2658-8267",
    "educatrons": 12,
    "status": "Regular",
    "motivo": ""
  },
  {
    "id": "esc-056",
    "cie": "923874",
    "nome": "Eliana Andres de Almeida Souza, Professora",
    "nomeOficialBruto": "ELIANA ANDRES DE ALMEIDA SOUZA PROFESSORA",
    "arquivoInventario": "923874 - ELIANA ANDRES DE ALMEIDA SOUZA PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Rua Eduarda Rios Trevisan, 88 – Jd Portela",
    "tipo": "PEI 9h",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Sueli",
    "telefone": "(11) 2658-8172",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-057",
    "cie": "925834",
    "nome": "Parque Payol",
    "nomeOficialBruto": "PARQUE PAYOL",
    "arquivoInventario": "925834 - PARQUE PAYOL - INVENTÁRIO.xlsx",
    "cidade": "Pirapora do Bom Jesus",
    "bairro": "Rua Orlando Bucci, 71 – Pq Payol",
    "tipo": "Regular",
    "segmento": "Anos Finais e Ensino Médio",
    "diretor": "Messias",
    "telefone": "(11) 2658-8277",
    "educatrons": 12,
    "status": "Normal",
    "motivo": "Unidade em monitoramento regular"
  },
  {
    "id": "esc-058",
    "cie": "011778",
    "nome": "Senor Abravanel",
    "nomeOficialBruto": "SENOR ABRAVANEL",
    "arquivoInventario": "11778 - SENOR ABRAVANEL - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Itapevi",
    "tipo": "Regular",
    "segmento": "Ensino Fundamental e Médio",
    "diretor": "Cíntia",
    "telefone": "(11) 2658-8122",
    "educatrons": 8,
    "status": "Normal",
    "motivo": "Unidade escolar integrada na regional (Polo Dr. José Neyde Cesar Lessa)"
  },
  {
    "id": "esc-059",
    "cie": "011779",
    "nome": "Ediner Ferreira de Moraes, Professora",
    "nomeOficialBruto": "EDINER FERREIRA DE MORAES PROFESSORA",
    "arquivoInventario": "11779 - EDINER FERREIRA DE MORAES PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Itapevi",
    "tipo": "Regular",
    "segmento": "Ensino Fundamental e Médio",
    "diretor": "Ilma",
    "telefone": "(11) 2658-8000",
    "educatrons": 8,
    "status": "Normal",
    "motivo": "Unidade escolar integrada na regional (Polo Prof. José Sérgio Pereira)"
  },
  {
    "id": "esc-060",
    "cie": "011780",
    "nome": "Michela Trevizan, Professora",
    "nomeOficialBruto": "MICHELA TREVIZAN PROFESSORA",
    "arquivoInventario": "11780 - MICHELA TREVIZAN PROFESSORA - INVENTÁRIO.xlsx",
    "cidade": "Itapevi",
    "bairro": "Itapevi",
    "tipo": "Regular",
    "segmento": "Ensino Fundamental e Médio",
    "diretor": "Victor",
    "telefone": "(11) 2658-8100",
    "educatrons": 8,
    "status": "Normal",
    "motivo": "Unidade escolar integrada na regional (Polo Paulo de Abreu)"
  }
];

    let listaEscolas = [];

    function carregarEscolasLocalStorage() {
      if (!Array.isArray(listaEscolas) || listaEscolas.length === 0) {
        listaEscolas = JSON.parse(JSON.stringify(BASE_ESCOLAS_PADRAO));
      }
      if (!window.__escolasCloudCarregado && typeof window.lerEstadoNuvem === 'function') {
        window.__escolasCloudCarregado = true;
        window.lerEstadoNuvem('ESCOLAS_DATA', function(dados) {
          if (Array.isArray(dados) && dados.length > 0) {
            listaEscolas = dados;
            if (typeof renderizarEscolas === 'function') renderizarEscolas();
            if (typeof atualizarKpisEscolas === 'function') atualizarKpisEscolas();
          }
        });
      }
    }

    function salvarEscolasLocalStorage() {
      if (typeof window.gravarEstadoNuvem === 'function') {
        window.gravarEstadoNuvem('ESCOLAS_DATA', listaEscolas);
      }
    }

        function abrirEscolaPorCie(cie) {
      abrirEscolas();
      setTimeout(() => {
        const input = document.getElementById('escolas-search-input');
        if (input) {
          input.value = cie;
          filtrarEscolas();
        }
      }, 120);
    }
    function abrirEscolas(filtroInicial) {
      esconderTodasAsPanes();
      const pane = document.getElementById('pane-escolas');
      if (pane) pane.classList.add('active');

      const sideBtn = document.getElementById('side-btn-escolas');
      if (sideBtn) sideBtn.classList.add('active');

      atualizarBreadcrumbTopo('06 - Rede Escolar • 60 Escolas');

      carregarEscolasLocalStorage();

      if (filtroInicial === 'atencao') {
        const statusSelect = document.getElementById('escolas-filter-status');
        if (statusSelect) statusSelect.value = 'ALTO_RISCO_OU_CRITICO';
      } else {
        const statusSelect = document.getElementById('escolas-filter-status');
        if (statusSelect && !filtroInicial) statusSelect.value = '';
      }

      filtrarEscolas();
      rolarAoTopoSuave();
    }

    function obterResumoIpreEscola(esc) {
  var _res = _obterResumoIpreEscolaInterno(esc);
  return _res;
}
var obterResumoImroEscola = obterResumoIpreEscola;
function _obterResumoIpreEscolaInterno(esc) {
      var fato = (esc && window.BI_DECISION_ENGINE && typeof window.BI_DECISION_ENGINE.obterFatoEscola === 'function')
        ? window.BI_DECISION_ENGINE.obterFatoEscola(esc.cie)
        : null;
      var score = fato ? (Number(fato.imro) || 0) : 0;
      var tier = fato ? (fato.tier || 'Regular') : 'Regular';
      var pilares = [];
      if (fato && fato.pts) {
        var mapaRotulos = [
          ['SEOM', 'SEOM'],
          ['SEINTEC', 'SEINTEC'],
          ['SEAFIN', 'PDDE'],
          ['SEPES', 'SEPES'],
          ['SEGRE', 'Rede'],
          ['ASURE', 'ASURE'],
          ['EEC', 'EEC']
        ];
        mapaRotulos.forEach(function(pair) {
          var v = Number(fato.pts[pair[0]]) || 0;
          if (v > 0) pilares.push({ nome: pair[1], pts: v });
        });
        pilares.sort(function(a, b) { return b.pts - a.pts; });
      }
      var badgeClass = 'badge-status-regular';
      var icon = '🟢';
      if (tier === 'Crítico') {
        badgeClass = 'badge-status-atencao';
        icon = '🔴';
      } else if (tier === 'Alto Risco') {
        badgeClass = 'badge-status-alto-risco';
        icon = '🟠';
      } else if (tier === 'Atenção') {
        badgeClass = 'badge-status-reforma';
        icon = '🟡';
      }
      var resumoTexto = pilares.slice(0, 3).map(function(p) { return p.nome + ' +' + p.pts; }).join(' • ');
      var resumoCompleto = pilares.map(function(p) { return p.nome + ' +' + p.pts; }).join(' • ');
      return {
        imro: score,
        tier: tier,
        icon: icon,
        badgeClass: badgeClass,
        badgeLabel: icon + ' ' + tier + ' • ' + score + ' pts',
        resumoPilares: resumoTexto,
        resumoCompleto: resumoCompleto,
        fato: fato
      };
    }

    function atualizarKpisEscolas() {
      const total = listaEscolas.length;
      const pei = listaEscolas.filter(e => e.tipo && e.tipo.includes('PEI')).length;
      const regular = listaEscolas.filter(e => e.tipo && !e.tipo.includes('PEI')).length;
      const atencao = listaEscolas.filter(e => obterResumoImroEscola(e).imro >= 50).length;

      const elTotal = document.getElementById('escolas-count-total');
      if (elTotal) elTotal.innerText = total;

      const elPei = document.getElementById('escolas-count-pei');
      if (elPei) elPei.innerText = pei;

      const elReg = document.getElementById('escolas-count-regular');
      if (elReg) elReg.innerText = regular;

      const elAt = document.getElementById('escolas-count-atencao');
      if (elAt) elAt.innerText = atencao;

      /* Atualiza também o contador da Home se existir */
      const kpiHome = document.getElementById('kpi-escolas');
      if (kpiHome) kpiHome.innerText = total;
    }

    /* === ESTADO E MECANISMO DE ORDENAÇÃO DE ESCOLAS === */
    var ordenacaoEscolasAtual = { campo: 'nome', ordem: 'asc' }; /* Padrão oficial: Ordem Alfabética (A-Z) */

    function ordenarTabelaEscolas(campo, ordem) {
      if (ordem) {
        ordenacaoEscolasAtual.campo = campo;
        ordenacaoEscolasAtual.ordem = ordem;
      } else {
        if (ordenacaoEscolasAtual.campo === campo) {
          ordenacaoEscolasAtual.ordem = ordenacaoEscolasAtual.ordem === 'asc' ? 'desc' : 'asc';
        } else {
          ordenacaoEscolasAtual.campo = campo;
          ordenacaoEscolasAtual.ordem = (campo === 'ipre' || campo === 'imro' || campo === 'status') ? 'desc' : 'asc';
        }
      }
      atualizarIndicadoresOrdenacaoEscolas();
      filtrarEscolas();
    }

    function alternarOrdenacaoThEscolas(campo) {
      ordenarTabelaEscolas(campo);
    }

    function atualizarIndicadoresOrdenacaoEscolas() {
      /* Atualizar botões de pílula da barra de ordenação */
      document.querySelectorAll('#toolbar-sort-escolas .btn-sort-pill').forEach(function(btn) {
        btn.classList.remove('active');
      });
      if (ordenacaoEscolasAtual.campo === 'nome') {
        var btnNome = document.getElementById(ordenacaoEscolasAtual.ordem === 'asc' ? 'btn-sort-esc-nome-asc' : 'btn-sort-esc-nome-desc');
        if (btnNome) btnNome.classList.add('active');
      } else if (ordenacaoEscolasAtual.campo === 'cidade') {
        var btnCid = document.getElementById('btn-sort-esc-cidade');
        if (btnCid) btnCid.classList.add('active');
      } else if (ordenacaoEscolasAtual.campo === 'cie') {
        var btnCie = document.getElementById('btn-sort-esc-cie');
        if (btnCie) btnCie.classList.add('active');
      }

      /* Atualizar ícones nos cabeçalhos <th> (apenas setinha ↕, ▲ ou ▼) */
      var campos = ['cie', 'nome', 'cidade', 'segmento', 'diretor', 'imro', 'ipre'];
      campos.forEach(function(c) {
        var arrowEl = document.getElementById('sort-arrow-esc-' + c) ||
                      document.getElementById('sort-icon-esc-' + c) ||
                      document.getElementById('sort-pill-esc-' + c);
        var th = arrowEl ? arrowEl.closest('th') : null;
        if (th) {
          th.classList.remove('sort-active-asc', 'sort-active-desc');
        }
        if (ordenacaoEscolasAtual.campo === c) {
          var arrow = ordenacaoEscolasAtual.ordem === 'asc' ? '▲' : '▼';
          if (arrowEl) arrowEl.textContent = arrow;
          if (th) th.classList.add(ordenacaoEscolasAtual.ordem === 'asc' ? 'sort-active-asc' : 'sort-active-desc');
        } else {
          if (arrowEl) arrowEl.textContent = '↕';
        }
      });
    }

    function filtrarEscolas() {
      const termo = (document.getElementById('escolas-search-input')?.value || '').toLowerCase().trim();
      const cidade = document.getElementById('escolas-filter-cidade')?.value || '';
      const tipo = document.getElementById('escolas-filter-tipo')?.value || '';
      const status = document.getElementById('escolas-filter-status')?.value || '';

      const filtradas = listaEscolas.filter(e => {
        const matchTermo = !termo || 
          (e.nome && e.nome.toLowerCase().includes(termo)) ||
          (e.cie && e.cie.toLowerCase().includes(termo)) ||
          (e.diretor && e.diretor.toLowerCase().includes(termo)) ||
          (e.bairro && e.bairro.toLowerCase().includes(termo));

        const matchCidade = !cidade || e.cidade === cidade || (cidade.toLowerCase().includes('pirapora') && (e.cidade || '').toLowerCase().includes('pirapora'));
        
        let matchTipo = true;
        if (tipo === 'PEI') {
          matchTipo = e.tipo && e.tipo.includes('PEI');
        } else if (tipo === 'PEI 9h') {
          matchTipo = e.tipo && e.tipo.includes('9h');
        } else if (tipo === 'PEI 7h') {
          matchTipo = e.tipo && e.tipo.includes('7h');
        } else if (tipo === 'Regular') {
          matchTipo = e.tipo && !e.tipo.includes('PEI');
        }

        let matchStatus = true;
        if (status) {
          const imroInfo = obterResumoImroEscola(e);
          if (status === 'ALTO_RISCO_OU_CRITICO') {
            matchStatus = imroInfo.imro >= 50;
          } else {
            matchStatus = imroInfo.tier === status;
          }
        }

        return matchTermo && matchCidade && matchTipo && matchStatus;
      });

      /* Aplica ordenação ativa aos registros filtrados */
      filtradas.sort(function(a, b) {
        if (ordenacaoEscolasAtual.campo === 'ipre' || ordenacaoEscolasAtual.campo === 'imro' || ordenacaoEscolasAtual.campo === 'status') {
          var sA = obterResumoImroEscola(a).imro;
          var sB = obterResumoImroEscola(b).imro;
          var diff = sA - sB;
          if (diff === 0) diff = String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', { sensitivity: 'base' });
          return ordenacaoEscolasAtual.ordem === 'asc' ? diff : -diff;
        }
        var valA = a[ordenacaoEscolasAtual.campo] !== undefined ? a[ordenacaoEscolasAtual.campo] : '';
        var valB = b[ordenacaoEscolasAtual.campo] !== undefined ? b[ordenacaoEscolasAtual.campo] : '';
        var strA = String(valA).trim();
        var strB = String(valB).trim();
        var comp = strA.localeCompare(strB, 'pt-BR', { sensitivity: 'base', numeric: true });
        return ordenacaoEscolasAtual.ordem === 'asc' ? comp : -comp;
      });

      renderizarTabelaEscolas(filtradas);
      atualizarKpisEscolas();

      const badgeCount = document.getElementById('escolas-count-badge');
      if (badgeCount) {
        badgeCount.textContent = 'Exibindo ' + filtradas.length + ' de ' + listaEscolas.length + ' escolas';
      }
    }

    /* aplicarPilulaEscola removida */

    function limparFiltrosEscolasAvancado() {
      const search = document.getElementById('escolas-search-input');
      const cid = document.getElementById('escolas-filter-cidade');
      const tip = document.getElementById('escolas-filter-tipo');
      const sta = document.getElementById('escolas-filter-status');
      if (search) search.value = '';
      if (cid) cid.value = '';
      if (tip) tip.value = '';
      if (sta) sta.value = '';

      /* pílulas de escolas descontinuadas */

      filtrarEscolas();
    }

    
    function rolarParaLegendaSetor(idElemento) {
      const el = document.getElementById(idElemento);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.style.border = '2px solid #38bdf8';
        el.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.4)';
        setTimeout(() => {
          el.style.border = '1px solid #1e293b';
          el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
        }, 2500);
      }
    }

    function rolarParaLegendaEscolas() {
      const legenda = document.getElementById('nota-explicativa-escolas');
      if (legenda) {
        legenda.scrollIntoView({ behavior: 'smooth', block: 'start' });
        legenda.style.border = '2px solid #38bdf8';
        legenda.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.4)';
        setTimeout(() => {
          legenda.style.border = '1px solid #1e293b';
          legenda.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
        }, 2500);
      }
    }

    /* ============================================================== */
    /* CONTROLE DO MODAL DE DETALHES DA ESCOLA */
    /* ============================================================== */
    let escolaSelecionadaParaDetalhes = null;

    function abrirModalDetalhesEscola(idOuCie) {
      const esc = listaEscolas.find(e => e.id === idOuCie || e.cie === idOuCie);
      if (!esc) return;

      escolaSelecionadaParaDetalhes = esc;

      const modal = document.getElementById('modal-escola-detalhes');
      if (!modal) return;

      /* Nome formatado */
      const nomeFormatado = typeof formatarNomeEscolaExecutivo === 'function' 
        ? formatarNomeEscolaExecutivo(esc.nome) 
        : esc.nome;

      document.getElementById('det-modal-nome').textContent = nomeFormatado;
      document.getElementById('det-modal-cie').textContent = 'CIE: ' + (esc.cie || '---');
      document.getElementById('det-modal-cidade').textContent = 'Município: ' + (esc.cidade || 'Itapevi');
      document.getElementById('det-modal-segmento').textContent = esc.segmento || 'Ensino Fundamental e Médio';

      /* Status Badge (IPRE) */
      const elStatus = document.getElementById('det-modal-status-badge');
      if (elStatus) {
        const imroDet = (typeof obterResumoIpreEscola === 'function') ? obterResumoIpreEscola(esc) : obterResumoImroEscola(esc);
        if (imroDet.tier === 'Crítico') {
          elStatus.style.background = 'rgba(239, 68, 68, 0.2)';
          elStatus.style.color = '#f87171';
          elStatus.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        } else if (imroDet.tier === 'Alto Risco') {
          elStatus.style.background = 'rgba(249, 115, 22, 0.2)';
          elStatus.style.color = '#fb923c';
          elStatus.style.borderColor = 'rgba(249, 115, 22, 0.4)';
        } else if (imroDet.tier === 'Atenção') {
          elStatus.style.background = 'rgba(245, 158, 11, 0.2)';
          elStatus.style.color = '#fbbf24';
          elStatus.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        } else {
          elStatus.style.background = 'rgba(16, 185, 129, 0.2)';
          elStatus.style.color = '#34d399';
          elStatus.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        }
        elStatus.textContent = imroDet.badgeLabel;
      }

      /* Tipo Badge */
      const elTipo = document.getElementById('det-modal-tipo-badge');
      if (elTipo) {
        elTipo.textContent = esc.tipo || 'Regular';
      }

      /* Dados cadastrais */
      document.getElementById('det-modal-endereco').textContent = esc.bairro || 'Endereço não informado';
      document.getElementById('det-modal-diretor').textContent = esc.diretor || 'Equipe Gestora';
      document.getElementById('det-modal-telefone').textContent = esc.telefone || '(11) 4141-0000';
      document.getElementById('det-modal-modelo').textContent = (esc.tipo || 'Regular') + ' • ' + (esc.segmento || 'Fundamental/Médio');

      /* CRUZAMENTO SEOM (Infraestrutura) */
      const seomEscolas = (typeof DADOS_SEOM !== 'undefined' && DADOS_SEOM.escolas) ? DADOS_SEOM.escolas : [];
      const seomInfo = seomEscolas.find(s => {
        const sNome = s.escola.toLowerCase().replace(/[^a-z0-9]/g, '');
        const bNome = (esc.nomeOficialBruto || esc.nome).toLowerCase().replace(/[^a-z0-9]/g, '');
        return sNome.includes(bNome) || bNome.includes(sNome);
      }) || {};

      let seomHtml = '';
      if (seomInfo.escola) {
        const statusFde = seomInfo.obraFde === 2 ? '<span style="color: #b45309; font-weight: 800;">🟠 Obra FDE Ativa em Andamento</span>' : '<span style="color: #047857;">🟢 Sem obras ativas</span>';
        const statusAvcb = seomInfo.avcb === 1 ? '<span style="color: #047857; font-weight: 700;">🟢 Regularizado (Bombeiros)</span>' : '<span style="color: #b91c1c; font-weight: 800;">🔴 Laudo Pendente</span>';
        const telhado = seomInfo.telhado === 2 ? '🔴 Intervenção crítica' : '🟢 Conforme';
        const eletrica = seomInfo.eletrica === 2 ? '🔴 Sobrecarga' : '🟢 Estável';
        const esgoto = seomInfo.esgoto === 2 ? '🔴 Crítico' : '🟢 Regular';
        const zelador = seomInfo.zeladoria === 1 ? '🟢 Residente' : '🟡 Sem zelador';
        const cuidador = seomInfo.cuidador === 2 ? '🔴 Demanda aberta' : '🟢 Atendido';

        seomHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div><strong>Obra FDE:</strong> ${statusFde}</div>
            <div><strong>Laudo AVCB:</strong> ${statusAvcb}</div>
            <div><strong>Telhado:</strong> ${telhado}</div>
            <div><strong>Rede Elétrica:</strong> ${eletrica}</div>
            <div><strong>Saneamento:</strong> ${esgoto}</div>
            <div><strong>Zeladoria:</strong> ${zelador}</div>
          </div>
          <div style="font-size: 0.76rem; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 0.4rem;">
            Cuidadores: ${cuidador} • Inconsistência SGI: ${seomInfo.sgi === 2 ? 'Sim' : 'Não'}
          </div>
        `;
      } else {
        seomHtml = '<span style="color: #64748b;">Dados de vistoria e infraestrutura em processo de compilação pela Seção de Obras.</span>';
      }
      document.getElementById('det-modal-seom-content').innerHTML = seomHtml;

      /* CRUZAMENTO SEINTEC (Tecnologia) */
      const ciePadEsc = String(esc.cie || '').trim().padStart(6, '0');
      const cieRawEsc = String(parseInt(ciePadEsc, 10) || ciePadEsc);
      const chamadosLista = (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros))
        ? SEINTEC_BASES_CONFIG['Atendimentos'].registros
        : [];
      const callsEscola = chamadosLista.filter(c => {
        const cPad = String(c.cie || '').trim().padStart(6, '0');
        return cPad === ciePadEsc || String(c.cie || '') === cieRawEsc;
      });

      let totalHw = 0;
      let badHw = 0;
      let eduCountEsc = 0;
      if (window.INVENTARIO_COMPLETO_TUPLES && Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.hardware)) {
        window.INVENTARIO_COMPLETO_TUPLES.hardware.forEach(it => {
          const itCie = String(it[0] || '').trim().padStart(6, '0');
          if (itCie === ciePadEsc || String(it[0] || '') === cieRawEsc) {
            totalHw++;
            const st = String(it[5] || '').toLowerCase();
            if (st.includes('inserv') || st.includes('manuten') || st.includes('danif') || st.includes('aguard') || st.includes('chamado')) {
              badHw++;
            }
          }
        });
      }
      if (window.INVENTARIO_COMPLETO_TUPLES && Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.educatrons)) {
        eduCountEsc = window.INVENTARIO_COMPLETO_TUPLES.educatrons.filter(it => {
          const itCie = String(it[0] || '').trim().padStart(6, '0');
          return itCie === ciePadEsc || String(it[0] || '') === cieRawEsc;
        }).length;
      }

      let seintecHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
          <div><strong>Parque Tecnológico:</strong> ${totalHw > 0 ? totalHw.toLocaleString('pt-BR') + ' equipamentos' : 'Inventário monitorado'}</div>
          <div><strong>Educatrons:</strong> ${eduCountEsc || esc.educatrons || 0} telas interativas</div>
          <div><strong>Com Defeito:</strong> <span style="color: ${badHw > 30 ? '#dc2626' : '#047857'}; font-weight: 700;">${badHw} itens</span></div>
          <div><strong>Chamados 2026:</strong> ${callsEscola.length} registrados</div>
        </div>
        <div style="font-size: 0.76rem; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 0.4rem;">
          Conectividade: Link Intragov de Fibra Operacional • Wi-Fi Pedagógico monitorado.
        </div>
      `;
      document.getElementById('det-modal-seintec-content').innerHTML = seintecHtml;

      modal.style.display = 'flex';
    }

    function fecharModalDetalhesEscola() {
      const modal = document.getElementById('modal-escola-detalhes');
      if (modal) modal.style.display = 'none';
      escolaSelecionadaParaDetalhes = null;
    }

    function editarEscolaDoDetalhes() {
      if (!escolaSelecionadaParaDetalhes) return;
      const id = escolaSelecionadaParaDetalhes.id;
      fecharModalDetalhesEscola();
      abrirModalEditarEscola(id);
    }

    function gerarRelatorioPdfEscolaAtualDetalhes() {
      if (!escolaSelecionadaParaDetalhes) return;
      if (typeof window.gerarRelatorioPdfEscola === 'function') {
        window.gerarRelatorioPdfEscola(escolaSelecionadaParaDetalhes.cie || escolaSelecionadaParaDetalhes.id);
      }
    }

    function filtrarPorKpi(filtro) {
      document.querySelectorAll('.escola-kpi-card').forEach(c => c.classList.remove('active-filter'));
      const statusSelect = document.getElementById('escolas-filter-status');
      const tipoSelect = document.getElementById('escolas-filter-tipo');

      if (filtro === 'todas') {
        if (statusSelect) statusSelect.value = '';
        if (tipoSelect) tipoSelect.value = '';
        document.getElementById('kpi-card-total')?.classList.add('active-filter');
      } else if (filtro === 'pei') {
        if (statusSelect) statusSelect.value = '';
        if (tipoSelect) tipoSelect.value = 'PEI';
        document.getElementById('kpi-card-pei')?.classList.add('active-filter');
      } else if (filtro === 'regular') {
        if (statusSelect) statusSelect.value = '';
        if (tipoSelect) tipoSelect.value = 'Regular';
        document.getElementById('kpi-card-regular')?.classList.add('active-filter');
      } else if (filtro === 'atencao') {
        if (statusSelect) statusSelect.value = 'ALTO_RISCO_OU_CRITICO';
        if (tipoSelect) tipoSelect.value = '';
        document.getElementById('kpi-card-atencao')?.classList.add('active-filter');
      }
      filtrarEscolas();
    }

    function renderizarTabelaEscolas(dados) {
      const tbody = document.getElementById('escolas-table-body');
      if (!tbody) return;

      if (!dados || dados.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
              <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🔍</span>
              <strong>Nenhuma escola encontrada com os filtros selecionados.</strong>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem;">Tente ajustar os termos de pesquisa ou clique em "Cadastrar Nova Escola".</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = dados.map(e => {
        const imroInfo = obterResumoImroEscola(e);
        const badgeStatus = `<span class="${imroInfo.badgeClass}" title="${imroInfo.resumoCompleto ? ('Ofensores IPRE: ' + imroInfo.resumoCompleto) : 'Operação regular no IPRE'}">${imroInfo.badgeLabel}</span>`;
        const subImro = imroInfo.resumoPilares
          ? `<div style="font-size: 0.69rem; color: #64748b; font-weight: 600; margin-top: 3px; line-height: 1.3;">${imroInfo.resumoPilares}</div>`
          : '';

        const descObs = (e.status === 'Alta prioridade' && e.motivo && !e.motivo.toLowerCase().includes('monitoramento regular')) ? `<div style="font-size: 0.74rem; color: #b91c1c; font-weight: 600; margin-top: 2px;">⚠️ ${e.motivo}</div>` : '';

        return `
          <tr>
            <td>
              <span class="escola-tag-cie">${e.cie || '---'}</span>
            </td>
            <td>
              <div class="escola-name-cell">
                <span onclick="abrirModalDetalhesEscola('${e.id}')" style="cursor: pointer; font-weight: 700; color: #0b2351;" title="Clique para abrir o Diagnóstico da Escola" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${e.nome}</span>
              </div>
              ${descObs}
            </td>
            <td>
              <div style="font-weight: 600; color: #1e293b;">${e.cidade}</div>
              <div style="font-size: 0.74rem; color: #64748b;">${e.bairro || 'Região Escolar'}</div>
            </td>
            <td>
              <span style="font-size: 0.78rem; color: #475569;">${e.segmento || 'Ensino Fundamental e Médio'}</span>
            </td>
            <td>
              <div style="font-weight: 600; color: #0f172a;">${e.diretor || 'Equipe Gestora'}</div>
              <div style="font-size: 0.74rem; color: #64748b;">${e.telefone || '(11) 4141-0000'}</div>
            </td>
            <td>
              ${badgeStatus}
              ${subImro}
            </td>
            <td style="text-align: right;">
              <div class="escola-actions-cell" style="justify-content: flex-end; display: flex; align-items: center; gap: 0.35rem; flex-wrap: nowrap;">
                <button class="btn-table-action" onclick="abrirModalDetalhesEscola('${e.id}')" title="Abrir Diagnóstico da Escola (Infraestrutura, Tecnologia, Finanças, Rede)" style="background: #0b2351; color: #ffffff; border: 1.5px solid #0b2351; font-weight: 700; font-size: 0.76rem; display: inline-flex; align-items: center; gap: 4px; padding: 0.35rem 0.65rem; border-radius: 6px; cursor: pointer; transition: all 0.15s; box-shadow: 0 2px 4px rgba(11,35,81,0.18);" onmouseover="this.style.background='#1e3a8a'; this.style.borderColor='#1e3a8a';" onmouseout="this.style.background='#0b2351'; this.style.borderColor='#0b2351';">
                  👁️ Detalhes da Escola
                </button>
                <button class="btn-table-action" onclick="abrirModalEditarEscola('${e.id}')" title="Editar dados da unidade" style="padding: 0.35rem 0.55rem; font-size: 0.76rem;">✏️ Editar</button>
                <button class="btn-table-action" onclick="gerarRelatorioPdfEscola('${e.id}')" title="Gerar Relatório Executivo Individual em PDF" style="background: #0f766e; color: #ffffff; border: 1.5px solid #0f766e; font-weight: 700; padding: 0.35rem 0.58rem; font-size: 0.76rem; display: inline-flex; align-items: center; gap: 3px; border-radius: 6px; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#0d9488'; this.style.borderColor='#0d9488';" onmouseout="this.style.background='#0f766e'; this.style.borderColor='#0f766e';">📄 PDF</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function abrirModalNovaEscola() {
      document.getElementById('form-escola').reset();
      document.getElementById('form-escola-id').value = '';
      document.getElementById('modal-escola-titulo').innerText = 'Acrescentar Nova Escola';
      document.getElementById('modal-escola').style.display = 'flex';
    }

    function abrirModalEditarEscola(id) {
      const esc = listaEscolas.find(e => e.id === id);
      if (!esc) return;

      document.getElementById('form-escola-id').value = esc.id;
      document.getElementById('form-escola-cie').value = esc.cie || '';
      document.getElementById('form-escola-cidade').value = esc.cidade || 'Itapevi';
      document.getElementById('form-escola-nome').value = esc.nome || '';
      document.getElementById('form-escola-tipo').value = esc.tipo || 'Regular Parcial';
      document.getElementById('form-escola-segmento').value = esc.segmento || 'Anos Finais e Ensino Médio';
      document.getElementById('form-escola-diretor').value = esc.diretor || '';
      document.getElementById('form-escola-telefone').value = esc.telefone || '';
      document.getElementById('form-escola-bairro').value = esc.bairro || '';
      const elEduInput = document.getElementById('form-escola-educatrons'); if (elEduInput) elEduInput.value = esc.educatrons || 12;
      document.getElementById('form-escola-status').value = esc.status || 'Regular';
      document.getElementById('form-escola-obs').value = esc.motivo || '';

      document.getElementById('modal-escola-titulo').innerText = 'Editar Escola • ' + esc.nome;
      document.getElementById('modal-escola').style.display = 'flex';
    }

    function fecharModalEscola() {
      document.getElementById('modal-escola').style.display = 'none';
    }

    function salvarEscolaForm(e) {
      e.preventDefault();
      const id = document.getElementById('form-escola-id').value;
      const cie = document.getElementById('form-escola-cie').value.trim();
      const cidade = document.getElementById('form-escola-cidade').value;
      const nome = document.getElementById('form-escola-nome').value.trim();
      const tipo = document.getElementById('form-escola-tipo').value;
      const segmento = document.getElementById('form-escola-segmento').value;
      const diretor = document.getElementById('form-escola-diretor').value.trim();
      const telefone = document.getElementById('form-escola-telefone').value.trim();
      const bairro = document.getElementById('form-escola-bairro').value.trim();
      const elEduInp = document.getElementById('form-escola-educatrons'); const educatrons = elEduInp ? (parseInt(elEduInp.value, 10) || 0) : 0;
      const status = document.getElementById('form-escola-status').value;
      const motivo = document.getElementById('form-escola-obs').value.trim();

      if (id) {
        /* Atualização */
        const idx = listaEscolas.findIndex(esc => esc.id === id);
        if (idx !== -1) {
          listaEscolas[idx] = { id, cie, cidade, nome, tipo, segmento, diretor, telefone, bairro, educatrons, status, motivo };
        }
        mostrarToastAgenda('Escola atualizada com sucesso!', '✅');
      } else {
        /* Novo cadastro */
        const novoId = 'esc-' + Date.now();
        listaEscolas.unshift({ id: novoId, cie, cidade, nome, tipo, segmento, diretor, telefone, bairro, educatrons, status, motivo });
        mostrarToastAgenda('Nova escola cadastrada com sucesso!', '🏫');
      }

      salvarEscolasLocalStorage();
      fecharModalEscola();
      filtrarEscolas();
    }

    function toggleAtencaoEscola(id) {
      const esc = listaEscolas.find(e => e.id === id);
      if (!esc) return;

      if (esc.status === 'Alta prioridade') {
        esc.status = 'Regular';
        esc.motivo = '';
        mostrarToastAgenda(esc.nome + ' marcada como Regular.', '✅');
      } else {
        esc.status = 'Alta prioridade';
        if (!esc.motivo) esc.motivo = 'Acompanhamento prioritário solicitado pela Dirigente';
        mostrarToastAgenda(esc.nome + ' incluída em Alta Prioridade!', '⚠️');
      }

      salvarEscolasLocalStorage();
      filtrarEscolas();
    }

    function restaurarEscolasPadrao() {
      if (confirm('Deseja restaurar a base padrão de escolas da URE Itapevi? Todas as edições manuais serão redefinidas para o padrão.')) {
        listaEscolas = JSON.parse(JSON.stringify(BASE_ESCOLAS_PADRAO));
        salvarEscolasLocalStorage();
        filtrarEscolas();
        mostrarToastAgenda('Base de escolas restaurada para o padrão oficial.', '🔄');
      }
    }

    function exportarEscolasExcel() {
      try {
        if (typeof XLSX === 'undefined') {
          alert('Biblioteca XLSX não carregada no momento.');
          return;
        }

        const dadosExportacao = listaEscolas.map(e => {
          const imroInfo = obterResumoImroEscola(e);
          return {
            'Código CIE': e.cie || '',
            'Unidade Escolar': e.nome || '',
            'Município': e.cidade || '',
            'Bairro': e.bairro || '',
            'Modelo': e.tipo || '',
            'Segmento': e.segmento || '',
            'Diretor(a)': e.diretor || '',
            'Telefone': e.telefone || '',
            'Educatrons': e.educatrons || 0,
            'Faixa IPRE': imroInfo.tier,
            'Pontuação IPRE (pts)': imroInfo.imro,
            'Pilares Ofensores IPRE': imroInfo.resumoCompleto || 'Conforme',
            'Observações': e.motivo || ''
          };
        });

        const ws = XLSX.utils.json_to_sheet(dadosExportacao);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rede_Escolar_URE_Itapevi");
        XLSX.writeFile(wb, "Escolas_URE_Itapevi_" + new Date().toISOString().slice(0, 10) + ".xlsx");
        mostrarToastAgenda('Planilha de escolas gerada com sucesso!', '📊');
      } catch (err) {
        alert('Erro ao exportar planilha: ' + err.message);
      }
    }

    function importarPlanilhaEscolas(input) {
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet);

          if (!rows || rows.length === 0) {
            alert('A planilha importada não possui registros válidos.');
            return;
          }

          let importadas = 0;
          rows.forEach((r, idx) => {
            const nome = r['Unidade Escolar'] || r['Nome'] || r['Escola'] || r['NOME DA ESCOLA'];
            if (!nome) return;

            const cie = String(r['Código CIE'] || r['CIE'] || r['CIE_ESCOLA'] || ('04' + (2900 + idx)));
            const cidade = r['Município'] || r['Cidade'] || r['MUNICIPIO'] || 'Itapevi';
            const tipo = r['Modelo'] || r['Tipo'] || (nome.includes('PEI') ? 'PEI 9h' : 'Regular Parcial');
            const segmento = r['Segmento'] || r['Etapa'] || 'Anos Finais e Ensino Médio';
            const diretor = r['Diretor'] || r['Diretor(a)'] || r['DIRETOR'] || '';
            const telefone = r['Telefone'] || r['Contato'] || '';
            const bairro = r['Bairro'] || '';
            const educatrons = parseInt(r['Educatrons'] || r['Equipamentos'] || 16, 10) || 16;
            const status = r['Situação'] || r['Status'] || 'Regular';
            const motivo = r['Motivo Atenção / Obs'] || r['Observações'] || '';

            listaEscolas.unshift({
              id: 'esc-imp-' + Date.now() + '-' + idx,
              cie, nome, cidade, tipo, segmento, diretor, telefone, bairro, educatrons, status, motivo
            });
            importadas++;
          });

          salvarEscolasLocalStorage();
          filtrarEscolas();
          mostrarToastAgenda(`${importadas} escolas importadas com sucesso!`, '📥');
          input.value = '';
        } catch (err) {
          alert('Erro ao processar a planilha: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    /* Inicializa as escolas no carregamento */
    carregarEscolasLocalStorage();

    /* ======================================================== */
    /* SISTEMA DE VISITAS DA DIRIGENTE (EXATO AO PRINT) */
    /* ======================================================== */
    let visitasRegistro = {};

    function carregarVisitasLocalStorage() {
      if (!visitasRegistro || Object.keys(visitasRegistro).length === 0) {
        visitasRegistro = {
          'esc-001': { visitada: true, data: '2026-10-17', tipo: 'Acompanhamento Pedagógico', obs: 'Acompanhamento da rede elétrica e Educatrons' },
          'esc-002': { visitada: true, data: '2026-10-17', tipo: 'Reunião com Equipe Gestora', obs: 'Alinhamento da modulação docente' },
          'esc-004': { visitada: true, data: '2026-10-10', tipo: 'Supervisão de Rotina', obs: 'Visita às salas e acompanhamento do PEI' },
          'esc-005': { visitada: true, data: '2026-10-08', tipo: 'Acompanhamento Pedagógico', obs: 'Visita com a supervisão escolar' },
          'esc-007': { visitada: true, data: '2026-10-03', tipo: 'SARESP e Fluência Leitora', obs: 'Simulados e projetos de reforço' },
          'esc-008': { visitada: true, data: '2026-09-28', tipo: 'Vistoria de Infraestrutura', obs: 'Reforma do refeitório e quadra' },
          'esc-010': { visitada: true, data: '2026-09-25', tipo: 'Supervisão de Rotina', obs: 'Visita às turmas de anos finais' }
        };
      }
      if (!window.__visitasCloudCarregado && typeof window.lerEstadoNuvem === 'function') {
        window.__visitasCloudCarregado = true;
        window.lerEstadoNuvem('VISITAS_DATA', function(dados) {
          if (dados && typeof dados === 'object' && Object.keys(dados).length > 0) {
            visitasRegistro = dados;
            if (typeof atualizarPainelVisitas === 'function') atualizarPainelVisitas();
            if (typeof renderizarMarcadoresNoMapa === 'function') renderizarMarcadoresNoMapa();
          }
        });
      }
    }

    function salvarVisitasLocalStorage() {
      if (typeof window.gravarEstadoNuvem === 'function') {
        window.gravarEstadoNuvem('VISITAS_DATA', visitasRegistro);
      }
    }

    function abrirVisitas() {
      esconderTodasAsPanes();
      const pane = document.getElementById('pane-visitas');
      if (pane) pane.classList.add('active');

      const sideBtn = document.getElementById('side-btn-visitas');
      if (sideBtn) sideBtn.classList.add('active');

      atualizarBreadcrumbTopo('05 - Visitas da Dirigente');

      carregarEscolasLocalStorage();
      carregarVisitasLocalStorage();

      atualizarPainelVisitas();
      rolarAoTopoSuave();
    }

    function atualizarPainelVisitas() {
      if (!listaEscolas || listaEscolas.length === 0) {
        carregarEscolasLocalStorage();
      }

      const total = listaEscolas.length;
      let visitadasCount = 0;

      listaEscolas.forEach(esc => {
        if (visitasRegistro[esc.id] && visitasRegistro[esc.id].visitada) {
          visitadasCount++;
        }
      });

      const pendentesCount = Math.max(0, total - visitadasCount);
      const percentual = total > 0 ? Math.round((visitadasCount / total) * 100) : 0;

      /* Atualiza Números nos Cards Superiores */
      const elNumVis = document.getElementById('visitas-num-visitadas');
      if (elNumVis) elNumVis.innerText = visitadasCount;

      const elNumPend = document.getElementById('visitas-num-pendentes');
      if (elNumPend) elNumPend.innerText = pendentesCount;

      const elNumTot = document.getElementById('visitas-num-total');
      if (elNumTot) elNumTot.innerText = total;

      const elNetTot = document.getElementById('visitas-net-total-display');
      if (elNetTot) elNetTot.innerText = total;

      /* Atualiza Badge das Colunas */
      const badgeVis = document.getElementById('col-count-badge-visitadas');
      if (badgeVis) badgeVis.innerText = visitadasCount;

      const badgePend = document.getElementById('col-count-badge-pendentes');
      if (badgePend) badgePend.innerText = pendentesCount;

      /* Atualiza Gauge Circular SVG */
      const percDisplay = document.getElementById('visitas-perc-display');
      if (percDisplay) percDisplay.innerText = percentual + '%';

      const circleFill = document.getElementById('visitas-circle-fill');
      if (circleFill) {
        /* Raio 32 -> Circunferência ≈ 201 */
        const circunferencia = 201;
        const offset = circunferencia - (circunferencia * percentual / 100);
        circleFill.style.strokeDashoffset = offset;
      }

      /* Atualiza KPI na Home */
      const kpiHomeVis = document.getElementById('kpi-visitas');
      if (kpiHomeVis) kpiHomeVis.innerText = visitadasCount;

      filtrarColunasVisitas();
    }

    function formatarDataBR(dataStr) {
      if (!dataStr) return 'Recente';
      const partes = dataStr.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataStr;
    }

    function filtrarColunasVisitas() {
      const termoVis = (document.getElementById('busca-visitas-realizadas')?.value || '').toLowerCase().trim();
      const termoPend = (document.getElementById('busca-visitas-pendentes')?.value || '').toLowerCase().trim();

      const containerVis = document.getElementById('container-lista-visitadas');
      const containerPend = document.getElementById('container-lista-pendentes');
      if (!containerVis || !containerPend) return;

      const listaVisitadas = [];
      const listaPendentes = [];

      listaEscolas.forEach(esc => {
        const info = visitasRegistro[esc.id];
        const matchGeral = (esc.nome && esc.nome.toLowerCase().includes(termoVis || termoPend)) ||
                           (esc.cie && esc.cie.toLowerCase().includes(termoVis || termoPend)) ||
                           (esc.cidade && esc.cidade.toLowerCase().includes(termoVis || termoPend)) ||
                           (esc.bairro && esc.bairro.toLowerCase().includes(termoVis || termoPend));

        if (info && info.visitada) {
          const matchVis = !termoVis || (esc.nome && esc.nome.toLowerCase().includes(termoVis)) || (esc.cie && esc.cie.toLowerCase().includes(termoVis)) || (esc.cidade && esc.cidade.toLowerCase().includes(termoVis));
          if (matchVis) listaVisitadas.push({ esc, info });
        } else {
          const matchPend = !termoPend || (esc.nome && esc.nome.toLowerCase().includes(termoPend)) || (esc.cie && esc.cie.toLowerCase().includes(termoPend)) || (esc.cidade && esc.cidade.toLowerCase().includes(termoPend));
          if (matchPend) listaPendentes.push(esc);
        }
      });

      /* Render Coluna Visitadas */
      if (listaVisitadas.length === 0) {
        containerVis.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: #64748b; font-size: 0.85rem;">
            Nenhuma escola visitada encontrada com este filtro.
          </div>
        `;
      } else {
        containerVis.innerHTML = listaVisitadas.map(({ esc, info }) => `
          <div class="visita-item-card">
            <div class="visita-item-left">
              <span class="visita-dot green">●</span>
              <div class="visita-item-details">
                <span class="visita-item-name">${esc.nome}</span>
                <span class="visita-item-sub">${esc.cidade} • CIE ${esc.cie || '---'}</span>
                <span class="visita-date-pill">
                  <span>📅</span>
                  <span>Visitada em ${formatarDataBR(info.data)}</span>
                </span>
              </div>
            </div>
            <div class="visita-item-actions">
              <button class="btn-visita-sm" onclick="abrirModalEditarDataVisita('${esc.id}')">Alterar data</button>
              <button class="btn-visita-sm danger" onclick="desmarcarVisita('${esc.id}')">Desmarcar</button>
            </div>
          </div>
        `).join('');
      }

      /* Render Coluna Pendentes */
      if (listaPendentes.length === 0) {
        containerPend.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: #64748b; font-size: 0.85rem;">
            Nenhuma escola pendente encontrada com este filtro.
          </div>
        `;
      } else {
        containerPend.innerHTML = listaPendentes.map(esc => `
          <div class="visita-item-card">
            <div class="visita-item-left">
              <span class="visita-dot amber">●</span>
              <div class="visita-item-details">
                <span class="visita-item-name">${esc.nome}</span>
                <span class="visita-item-sub">${esc.cidade} • ${esc.bairro || 'Rede Escolar'}</span>
              </div>
            </div>
            <div class="visita-item-actions">
              <button class="btn-marcar-visita-gold" onclick="abrirModalRegistrarVisita('${esc.id}')">Marcar visita</button>
            </div>
          </div>
        `).join('');
      }
    }

    function abrirModalRegistrarVisita(id) {
      const esc = listaEscolas.find(e => e.id === id);
      if (!esc) return;

      document.getElementById('form-visita-escola-id').value = esc.id;
      document.getElementById('form-visita-escola-nome').innerText = esc.nome + ' (' + esc.cidade + ')';
      document.getElementById('form-visita-data').value = new Date().toISOString().slice(0, 10);
      document.getElementById('form-visita-tipo').value = 'Acompanhamento Pedagógico';
      document.getElementById('form-visita-obs').value = '';
      if (document.getElementById('form-visita-marcar-atencao')) document.getElementById('form-visita-marcar-atencao').checked = false;

      document.getElementById('modal-visita-titulo').innerText = 'Registrar Visita da Dirigente';
      document.getElementById('modal-registro-visita').style.display = 'flex';
    }

    function abrirModalEditarDataVisita(id) {
      const esc = listaEscolas.find(e => e.id === id);
      if (!esc) return;

      const info = visitasRegistro[esc.id] || {};
      document.getElementById('form-visita-escola-id').value = esc.id;
      document.getElementById('form-visita-escola-nome').innerText = esc.nome + ' (' + esc.cidade + ')';
      document.getElementById('form-visita-data').value = info.data || new Date().toISOString().slice(0, 10);
      document.getElementById('form-visita-tipo').value = info.tipo || 'Acompanhamento Pedagógico';
      document.getElementById('form-visita-obs').value = info.obs || '';
      if (document.getElementById('form-visita-marcar-atencao')) document.getElementById('form-visita-marcar-atencao').checked = false;

      document.getElementById('modal-visita-titulo').innerText = 'Alterar Data / Dados da Visita';
      document.getElementById('modal-registro-visita').style.display = 'flex';
    }

    function fecharModalRegistroVisita() {
      document.getElementById('modal-registro-visita').style.display = 'none';
    }

    function salvarRegistroVisita(e) {
      e.preventDefault();
      const id = document.getElementById('form-visita-escola-id').value;
      const data = document.getElementById('form-visita-data').value;
      const tipo = document.getElementById('form-visita-tipo').value;
      const obs = document.getElementById('form-visita-obs').value.trim();

      visitasRegistro[id] = { visitada: true, data, tipo, obs };

      salvarVisitasLocalStorage();
      fecharModalRegistroVisita();
      atualizarPainelVisitas();
      mostrarToastAgenda('Visita registrada com sucesso!', '✅');
    }

    function desmarcarVisita(id) {
      const esc = listaEscolas.find(e => e.id === id);
      const nome = esc ? esc.nome : 'Escola';

      if (confirm('Deseja desmarcar a visita da unidade "' + nome + '" e movê-la para pendentes?')) {
        delete visitasRegistro[id];
        salvarVisitasLocalStorage();
        atualizarPainelVisitas();
        mostrarToastAgenda('Visita desmarcada.', '🔄');
      }
    }

    function fecharModalConfirmarLimparVisitas() {
      const m = document.getElementById('modal-confirmar-limpar-visitas');
      if (m) m.style.display = 'none';
    }

    function executarLimpezaMarcacoesVisitas() {
      fecharModalConfirmarLimparVisitas();
      visitasRegistro = {};
      salvarVisitasLocalStorage();
      atualizarPainelVisitas();
      mostrarToastAgenda('Todas as marcações foram redefinidas.', '🗑️');
    }

    function limparMarcacoesVisitas() {
      let modal = document.getElementById('modal-confirmar-limpar-visitas');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-confirmar-limpar-visitas';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(7,21,47,0.72);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;';
        modal.onclick = function(e) { if (e.target === modal) fecharModalConfirmarLimparVisitas(); };
        modal.innerHTML =
          '<div style="background:#ffffff;width:100%;max-width:440px;border-radius:16px;box-shadow:0 24px 48px -12px rgba(7,21,47,0.45);overflow:hidden;border:1px solid #e2e8f0;font-family:\'Plus Jakarta Sans\',Inter,sans-serif;">' +
            '<div style="background:linear-gradient(135deg,#07152f 0%,#0b2351 100%);padding:1.15rem 1.4rem;border-bottom:3px solid #d48208;display:flex;align-items:center;justify-content:space-between;color:#ffffff;">' +
              '<div style="display:flex;align-items:center;gap:0.65rem;">' +
                '<span style="font-size:1.3rem;">⚠️</span>' +
                '<div>' +
                  '<div style="font-size:0.68rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#fbbf24;">CONFIRMAÇÃO EXECUTIVA</div>' +
                  '<h3 style="margin:0;font-size:1.05rem;font-weight:700;color:#ffffff;">Limpar Marcações de Visitas</h3>' +
                '</div>' +
              '</div>' +
              '<button type="button" onclick="fecharModalConfirmarLimparVisitas()" style="background:rgba(255,255,255,0.14);border:none;color:#ffffff;width:30px;height:30px;border-radius:50%;font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>' +
            '</div>' +
            '<div style="padding:1.35rem 1.4rem;color:#334155;font-size:0.92rem;line-height:1.55;">' +
              '<p style="margin:0 0 0.5rem;font-weight:600;color:#0f172a;">Tem certeza de que deseja limpar TODAS as marcações de visitas da rede?</p>' +
              '<p style="margin:0;color:#64748b;font-size:0.84rem;">Todas as escolas retornarão imediatamente ao estado pendente.</p>' +
            '</div>' +
            '<div style="padding:0.95rem 1.4rem;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:0.65rem;">' +
              '<button type="button" onclick="fecharModalConfirmarLimparVisitas()" style="background:#ffffff;color:#334155;border:1px solid #cbd5e1;padding:0.55rem 1.1rem;border-radius:8px;font-weight:600;font-size:0.86rem;cursor:pointer;">Cancelar</button>' +
              '<button type="button" onclick="executarLimpezaMarcacoesVisitas()" style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:#ffffff;border:none;padding:0.55rem 1.2rem;border-radius:8px;font-weight:700;font-size:0.86rem;cursor:pointer;box-shadow:0 4px 12px rgba(220,38,38,0.28);">Sim, limpar tudo</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(modal);
      } else {
        modal.style.display = 'flex';
      }
    }

    function abrirModalMapaVisitas() {
      carregarEscolasLocalStorage();
      carregarVisitasLocalStorage();

      let visitadasCount = 0;
      listaEscolas.forEach(esc => {
        if (visitasRegistro[esc.id] && visitasRegistro[esc.id].visitada) visitadasCount++;
      });
      const pendentesCount = listaEscolas.length - visitadasCount;
      const taxa = listaEscolas.length > 0 ? Math.round((visitadasCount / listaEscolas.length) * 100) : 0;

      document.getElementById('mapa-count-visitadas').innerText = visitadasCount;
      document.getElementById('mapa-count-pendentes').innerText = pendentesCount;
      document.getElementById('mapa-cobertura-taxa').innerText = taxa + '%';

      /* Agrupa por municípios */
      const cidades = {};
      listaEscolas.forEach(esc => {
        if (!cidades[esc.cidade]) cidades[esc.cidade] = [];
        cidades[esc.cidade].push(esc);
      });

      const container = document.getElementById('mapa-visitas-grid');
      container.innerHTML = Object.keys(cidades).map(cid => {
        const escolasDaCidade = cidades[cid];
        const visNaCidade = escolasDaCidade.filter(e => visitasRegistro[e.id] && visitasRegistro[e.id].visitada).length;

        const cardsEscolas = escolasDaCidade.map(e => {
          const isVis = visitasRegistro[e.id] && visitasRegistro[e.id].visitada;
          const bgCor = isVis ? '#ecfdf5' : '#fffbeb';
          const bordaCor = isVis ? '#a7f3d0' : '#fde68a';
          const textoCor = isVis ? '#065f46' : '#92400e';
          const dotCor = isVis ? '#10b981' : '#f59e0b';
          const statusText = isVis ? 'Visitada' : 'Pendente';

          return `
            <div style="background: ${bgCor}; border: 1px solid ${bordaCor}; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
              <div>
                <span style="display: flex; align-items: center; gap: 5px; font-weight: 700; font-size: 0.82rem; color: #0f172a;">
                  <span style="color: ${dotCor};">●</span> ${e.nome}
                </span>
                <span style="font-size: 0.72rem; color: ${textoCor}; display: block; margin-top: 2px;">
                  ${e.bairro || 'Centro'} ${isVis ? '• ' + formatarDataBR(visitasRegistro[e.id].data) : ''}
                </span>
              </div>
              <span style="font-size: 0.68rem; font-weight: 800; color: ${textoCor}; background: #ffffff; padding: 2px 7px; border-radius: 6px; border: 1px solid ${bordaCor};">
                ${statusText}
              </span>
            </div>
          `;
        }).join('');

        return `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">
              <span style="font-size: 0.95rem; font-weight: 800; color: var(--brand-navy);">${cid}</span>
              <span style="font-size: 0.75rem; font-weight: 700; color: #64748b;">
                ${visNaCidade} de ${escolasDaCidade.length} visitadas
              </span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.65rem;">
              ${cardsEscolas}
            </div>
          </div>
        `;
      }).join('');

      document.getElementById('modal-mapa-visitas').style.display = 'flex';
    }

    function fecharModalMapaVisitas() {
      document.getElementById('modal-mapa-visitas').style.display = 'none';
    }

    function exportarVisitasExcel() {
      try {
        if (typeof XLSX === 'undefined') {
          alert('Biblioteca de exportação não carregada.');
          return;
        }

        const dadosExport = listaEscolas.map(e => {
          const info = visitasRegistro[e.id];
          const visitada = info && info.visitada;
          return {
            'Código CIE': e.cie || '',
            'Unidade Escolar': e.nome || '',
            'Município': e.cidade || '',
            'Bairro': e.bairro || '',
            'Status da Visita': visitada ? 'Visitada' : 'Pendente',
            'Data da Visita': visitada ? formatarDataBR(info.data) : '',
            'Foco da Visita': visitada ? (info.tipo || '') : '',
            'Observações': visitada ? (info.obs || '') : ''
          };
        });

        const ws = XLSX.utils.json_to_sheet(dadosExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Visitas_Dirigente_URE");
        XLSX.writeFile(wb, "Visitas_Dirigente_URE_Itapevi_" + new Date().toISOString().slice(0, 10) + ".xlsx");
        mostrarToastAgenda('Planilha de visitas gerada com sucesso!', '📊');
      } catch (err) {
        alert('Erro ao exportar visitas: ' + err.message);
      }
    }

    /* Inicializa sistema de visitas */
    carregarVisitasLocalStorage();



    const URLS_OFICIAIS_SEMAT = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/semat_livro_2026.json')
    };

    const URLS_OFICIAIS_SEVESC = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_sevesc_educacao_sp_gov_br/cQroeBSCMXZCQbbGQSCaAqMaEgUCxrdIuNVbs_RPejCEfptcng'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sevesc_livro_2026.json')
    };

    const URLS_OFICIAIS_SEGRE = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/segre_livro_2026.json')
    };

    const URLS_OFICIAIS_SEFREP = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_sefrep_educacao_sp_gov_br/cQrO53ta2ztgRYD5y6ke2QD2EgUC5Wx8sWTg9fgjf0asi90zMg?rtime=72HhmMNA30g'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sefrep_curated_2026.json')
    };

    const URLS_OFICIAIS_SEPES = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/rosineide_gazolla_educacao_sp_gov_br/cQoeOJnO6_6aTpffoLZQ-VZaEgUCZ4107PIc0qdIlEuWeWTsug'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sepes_demandas_2026.json')
    };

    const URLS_OFICIAIS_SEFIN = {
      siafem: 'https:' + String.fromCharCode(47, 47) + 'www.fazenda.sp.gov.br/',
      transparencia: 'https:' + String.fromCharCode(47, 47) + 'www.transparencia.sp.gov.br/',
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_sefin_educacao_sp_gov_br/IQBr3bmOIqpcRYIpOol6pEnAAe_BVRv5jGg9PVCkSBZU6rU?e=KukMi4'),
      bec: 'https:' + String.fromCharCode(47, 47) + 'www.bec.sp.gov.br/',
      lrf: 'https:' + String.fromCharCode(47, 47) + 'www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm'
    };

    
    const URLS_OFICIAIS_DPAT = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQrUUSVgiuz-Q7Q4AF8xf0lEEgUC1IcYXucrjniWi5yRn2ZN3A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQrUUSVgiuz-Q7Q4AF8xf0lEEgUC1IcYXucrjniWi5yRn2ZN3A'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/dpat_inventario_2026.json'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      nomeArquivo: 'Inventario URE - SAM Patrimônio 2026.xlsx',
      abaAlvo: 'Inventário Físico',
      setor: 'DPAT - Divisão de Patrimônio'
    };

    let DADOS_DPAT = {"sucesso":true,"setor":"DPAT","nomeSetor":"Departamento de Patrimônio","arquivoOrigem":"Inventario URE - SAM Patrimônio 2026.xlsx","linkOficial":"https:" + String.fromCharCode(47, 47) + "seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQrUUSVgiuz-Q7Q4AF8xf0lEEgUC1IcYXucrjniWi5yRn2ZN3A","abaConsiderada":"Inventário Físico","contaCorporativa":"itp_seom_educacao_sp_gov_br","dataExtracao":"","kpis":{"totalBens":0,"totalAmbientes":0,"bensLocalizados":0,"bensAvaliadosBomOtimo":0},"ambientes":[],"bens":[]};

    /* Dados DPAT alimentados exclusivamente pela nuvem (zero localStorage) */

    function parseTimestampDataTabela(dataStr, horaStr, tsFallback) {
      var mins = 0;
      if (horaStr) {
        var hm = String(horaStr).trim().match(/(\d{1,2})\s*[:hH]\s*(\d{2})/);
        if (hm) {
          mins = (parseInt(hm[1], 10) * 60 + parseInt(hm[2], 10)) * 60000;
        }
      }
      if (typeof tsFallback === 'number' && !isNaN(tsFallback) && tsFallback > 0) {
        return tsFallback + mins;
      }
      if (!dataStr) return 0;
      var s = String(dataStr).trim();
      var br = s.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
      if (br) {
        var d = parseInt(br[1], 10);
        var m = parseInt(br[2], 10) - 1;
        var y = br[3] ? parseInt(br[3], 10) : 2026;
        if (y < 100) y += 2000;
        var dt = new Date(y, m, d).getTime();
        if (!isNaN(dt) && dt > 0) return dt + mins;
      }
      var iso = s.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
      if (iso) {
        var dtIso = new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10)).getTime();
        if (!isNaN(dtIso) && dtIso > 0) return dtIso + mins;
      }
      return 0;
    }

    function ordenarListaPorColuna(lista, opts) {
      if (!Array.isArray(lista) || lista.length <= 1) return lista;
      var dir = opts.dir === 'asc' ? 'asc' : 'desc';
      var isDate = !!opts.isDate;
      var isNum = !!opts.isNum;
      var getter = opts.getter;
      var tieId = opts.tieId;

      lista.sort(function(a, b) {
        var vA = getter(a);
        var vB = getter(b);

        if (isDate) {
          var tA = typeof vA === 'number' ? vA : parseTimestampDataTabela(vA);
          var tB = typeof vB === 'number' ? vB : parseTimestampDataTabela(vB);
          if (tA <= 0 && tB <= 0) return 0;
          if (tA <= 0) return 1;
          if (tB <= 0) return -1;
          if (tA !== tB) return dir === 'desc' ? (tB - tA) : (tA - tB);
          if (tieId) {
            var idA = parseInt(String(tieId(a) || '').replace(/\D+/g, '') || '0', 10);
            var idB = parseInt(String(tieId(b) || '').replace(/\D+/g, '') || '0', 10);
            if (idA !== idB) return dir === 'desc' ? (idB - idA) : (idA - idB);
          }
          return 0;
        }

        if (isNum) {
          var nA = Number(vA) || 0;
          var nB = Number(vB) || 0;
          return dir === 'asc' ? (nA - nB) : (nB - nA);
        }

        var sA = String(vA == null ? '' : vA).trim();
        var sB = String(vB == null ? '' : vB).trim();
        if (!sA && !sB) return 0;
        if (!sA) return 1;
        if (!sB) return -1;
        var cmp = sA.localeCompare(sB, 'pt-BR', { sensitivity: 'base', numeric: true });
        return dir === 'asc' ? cmp : -cmp;
      });
      return lista;
    }

    function gerarThOrdenavelHtml(col, activeCol, activeDir, fnName, extraStyle) {
      var isAtiva = activeCol === col.key;
      var cls = 'th-sortable' + (isAtiva ? (activeDir === 'asc' ? ' sort-active-asc' : ' sort-active-desc') : '');
      var seta = isAtiva ? (activeDir === 'asc' ? '▲' : '▼') : '↕';
      var alignCls = col.align === 'center' ? 'th-sort-wrapper center' : 'th-sort-wrapper';
      var sty = 'padding: 10px 12px; font-weight: 800; color: #1e293b;' + (col.width ? (' width: ' + col.width + ';') : '') + (extraStyle || '');
      return '<th class="' + cls + '" onclick="' + fnName + '(\'' + col.key + '\')" style="' + sty + '" title="Clique para classificar por ' + col.titulo + '">' +
        '<div class="' + alignCls + '"><span class="th-title-text">' + col.titulo + '</span><span class="sort-arrow">' + seta + '</span></div>' +
      '</th>';
    }

    function sincronizarSetasTabelaPorEstado(tableSelector, colAtiva, dir) {
      document.querySelectorAll(tableSelector + ' th[data-col]').forEach(function(th) {
        var cName = th.getAttribute('data-col');
        th.classList.remove('sort-active-asc', 'sort-active-desc');
        var arrow = th.querySelector('.sort-arrow');
        if (cName === colAtiva) {
          th.classList.add(dir === 'asc' ? 'sort-active-asc' : 'sort-active-desc');
          if (arrow) arrow.textContent = dir === 'asc' ? '▲' : '▼';
        } else if (arrow) {
          arrow.textContent = '↕';
        }
      });
    }

    let estadoDpat = {
      termoBusca: '',
      filtroAmbiente: 'TODOS',
      filtroEstado: 'TODOS',
      paginaAtual: 1,
      itensPorPagina: 50,
      colOrdenacao: 'chapa',
      ordemDir: 'asc'
    };

    const URLS_OFICIAIS_SECOMSE = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?rtime=1RW0RI0630g'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/secomse_contratos_2026.json')
    };

    const URLS_OFICIAIS_SEOM = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQpHptlGiLQ_S6fnHiKPD8jIEgUCoTHvKXxEEJYjc-0WstW10A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQpHptlGiLQ_S6fnHiKPD8jIEgUCoTHvKXxEEJYjc-0WstW10A'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/seom_mapa_2026.json'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      abaAlvo: 'MAPA',
      setor: 'SEOM - Seção de Obras e Manutenção Escolar'
    };

    let DADOS_SEOM = {
  "sucesso": true,
  "setor": "SEOM",
  "nomeSetor": "Seção de Obras e Manutenção Escolar",
  "arquivoOrigem": "Acompanhamento SEOM.xlsx",
  "linkOficial": "https:" + String.fromCharCode(47, 47) + "seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQpHptlGiLQ_S6fnHiKPD8jIEgUCoTHvKXxEEJYjc-0WstW10A",
  "abaConsiderada": "MAPA",
  "contaCorporativa": "itp_seom_educacao_sp_gov_br",
  "dataExtracao": "2026-11-04",
  "indicadores": [
    {
      "campo": "obraFde",
      "nome": "Obra FDE",
      "responsavel": "Oswaldo"
    },
    {
      "campo": "avcb",
      "nome": "AVCB",
      "responsavel": "Nicolas"
    },
    {
      "campo": "cuidador",
      "nome": "Cuidador",
      "responsavel": "Márcia"
    },
    {
      "campo": "eletrica",
      "nome": "Elétrica",
      "responsavel": "Oswaldo"
    },
    {
      "campo": "limpeza",
      "nome": "Limpeza",
      "responsavel": "Oswaldo"
    },
    {
      "campo": "matriculaAtualizada",
      "nome": "Matrícula Atualizada",
      "responsavel": "Laura"
    },
    {
      "campo": "sgi",
      "nome": "SGI",
      "responsavel": "Laura"
    },
    {
      "campo": "telhado",
      "nome": "Telhado",
      "responsavel": "Oswaldo"
    },
    {
      "campo": "zeladoria",
      "nome": "Zeladoria",
      "responsavel": "Márcia"
    },
    {
      "campo": "esgoto",
      "nome": "Esgoto",
      "responsavel": "Oswaldo"
    },
    {
      "campo": "consumoAgua",
      "nome": "Consumo de Água",
      "responsavel": "Nicolas"
    }
  ],
  "totalEscolas": 60,
  "escolas": [
    {
      "escola": "AIR FERREIRA DO NASCIMENTO PROFESSOR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "ALAYDE DOMINGUES COUTO MACEDO PROFESSORA",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "ALDEIA DE BARUERI",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "AMADOR AGUIAR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "AMERICO VALENTIN CHRISTIANINI",
      "obraFde": 2,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 1,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "CAIO PRADO JUNIOR DEPUTADO",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 1,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 1,
      "consumoAgua": 0
    },
    {
      "escola": "CANDIDO RONDON MARECHAL",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "CELINA DE BARROS BAIRAO PROFESSORA",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 22,
      "consumoAgua": 0
    },
    {
      "escola": "CLARO CAMARGO RIBEIRO",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 1,
      "consumoAgua": 0
    },
    {
      "escola": "DIMARAES ANTONIO SANDEI PROFESSOR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "DOLORES GARCIA PASCHOALIN",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "DORVALINO ABILIO TEIXEIRA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "EDINER FERREIRA DE MORAES",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 1,
      "eletrica": 2,
      "limpeza": 1,
      "matriculaAtualizada": 0,
      "sgi": 0,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "ELIANA ANDRES DE ALMEIDA SOUZA PROFESSORA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "ELIZA DE OLIVEIRA RIBEIRO",
      "obraFde": 2,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "GIUSEPPE ANGELO BERTOLLI PADRE",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "HENRIQUE FERNANDO GOMES ESTUDANTE",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "HENRIQUE SAMMARTINO ALFERES",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "IGNES AMELIA OLIVEIRA MACHADO PROFESSORA",
      "obraFde": 2,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 1
    },
    {
      "escola": "IRACEMA RAUEN MACIEL PROFESSORA",
      "obraFde": 0,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "ITAJAHY FEITOSA MARTINS PROFESSOR",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "IVANI MARIA PAES PROFESSORA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "JARDIM MARIA HELENA I",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JARDIM PAULISTA",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "JOAO BATISTA SOLDE",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JOAO NASCIF CHALUPP",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JOSE CHALUPPE",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 1,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JOSE DOMINGOS DA SILVEIRA PROFESSOR",
      "obraFde": 1,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JOSE NEYDE CESAR LESSA DOUTOR",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 1,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 1,
      "consumoAgua": 0
    },
    {
      "escola": "JOSE SERGIO PEREIRA PROFESSOR",
      "obraFde": 1,
      "avcb": 1,
      "cuidador": 1,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JOSE THEOTONIO DOS SANTOS PROFESSOR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "JOSE WILSON PADINHA PROFESSOR",
      "obraFde": 1,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 1,
      "consumoAgua": 2
    },
    {
      "escola": "JOSEPHA PINTO CHIAVELLI PROFESSORA",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "LENIO VIEIRA DE MORAES PROFESSOR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "LEONOR MENDES DE BARROS",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "LUIS DA CAMARA CASCUDO",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "MARIA CRISTINA LOPES",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "MARIA SOARES SANTOS PROFESSORA",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "MARIO JOAQUIM ESCOBAR DE ANDRADE",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "MARY MALLET CYRINO PROFESSORA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 1,
      "consumoAgua": 0
    },
    {
      "escola": "MICHELA TREVISAN",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 0,
      "sgi": 0,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "MOACIR THOMAZ DA SILVA",
      "obraFde": 0,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "MYRTHES THEREZINHA ASSAD VILLELA PROFA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "NACIF AMIN CHALUPE",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "NERCY AMELIA MARTELINI DAHER PROFESSORA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "NESTOR DE CAMARGO PREFEITO",
      "obraFde": 0,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "OSWALDO SAMMARTINO",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 1,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "PARQUE IMPERIAL",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "PARQUE PAYOL",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "PAULO DA COSTA PAN CHACON PROFESSOR",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "PAULO DE ABREU",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "RAUL BRIQUET DOUTOR",
      "obraFde": 1,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 1,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 1,
      "consumoAgua": 0
    },
    {
      "escola": "REPUBLICA DE CUBA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "REPUBLICA DO EQUADOR",
      "obraFde": 2,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 1,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "ROMEO MECCA PADRE",
      "obraFde": 0,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 2,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 0
    },
    {
      "escola": "SENOR ABRAVANEL",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 1,
      "matriculaAtualizada": 0,
      "sgi": 0,
      "telhado": 2,
      "zeladoria": 0,
      "esgoto": 0,
      "consumoAgua": "-"
    },
    {
      "escola": "TEREZINHA PALONE DA SILVA DOMINGUES PROFA",
      "obraFde": 2,
      "avcb": 2,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 0,
      "esgoto": 1,
      "consumoAgua": 0
    },
    {
      "escola": "VICENTE THEMUDO LESSA PROFESSOR",
      "obraFde": 0,
      "avcb": 1,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 1,
      "esgoto": 0,
      "consumoAgua": 2
    },
    {
      "escola": "WILMAR SOARES DA SILVA",
      "obraFde": 2,
      "avcb": 0,
      "cuidador": 2,
      "eletrica": 2,
      "limpeza": 2,
      "matriculaAtualizada": 1,
      "sgi": 2,
      "telhado": 1,
      "zeladoria": 2,
      "esgoto": 0,
      "consumoAgua": 2
    }
  ]
};
    let estadoSeom = {
      filtroResp: 'TODOS',
      termoBusca: ''
    };

    /* Dados SEOM alimentados exclusivamente pela nuvem (zero localStorage) */

    const URLS_OFICIAIS_SEFISC = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/sefisc_zeladorias_2026.json'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      abaAlvo: 'SEFISC',
      setor: 'SEFISC - Seção de Fiscalização'
    };

    let DADOS_SEFISC = {
  "sucesso": true,
  "setor": "SEFISC",
  "centro": "SEOM",
  "nomeSetor": "Seção de Fiscalização",
  "abaConsiderada": "SEFISC",
  "arquivoOrigem": "CONTROLE - ZELADORIAS-ATUALIZADA-2026.xlsx",
  "linkOficial": "https:" + String.fromCharCode(47, 47) + "seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A",
  "totalRegistros": 34,
  "registros": [
    {
      "Unidade Escolar": "Alayde Domingues Couto Macedo",
      "Nome do Zelador": "Fabiano Vagne Moreira Brito",
      "RG": "22.686.337-2",
      "Cargo": "Professor Educação Básica II",
      "Unidade de Classificação": "Seduc",
      "Publicação": "9/8/25",
      "Venc.": "9/8/27",
      "Processo": "SEI - 015.00416518/2023-98",
      "OBS.": "giuseppe"
    },
    {
      "Unidade Escolar": "Alferes Henrique Sammartino",
      "Nome do Zelador": "Erivaldo Luiz da Silva",
      "RG": "33490804-8",
      "Cargo": "Ajudante Geral Masculino",
      "Unidade de Classificação": "Pref. Municipal de Jandira",
      "Publicação": "8/11/25",
      "Venc.": "6/9/27",
      "Processo": "SEI - 015.00522412/2025-94",
      "OBS.": "OK -DARE"
    },
    {
      "Unidade Escolar": "Américo Valentini Cristianini",
      "Publicação": "8/11/25",
      "Processo": "SEI - 015-00105369/2023-34",
      "OBS.": "NOVO"
    },
    {
      "Unidade Escolar": "Candido Rondon",
      "Nome do Zelador": "Silvia Maria Ventura Braz",
      "RG": "26261051-6",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/12/27",
      "Processo": "SEI - 015.00535073/2025-14",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Celina de Barros Bairão",
      "Nome do Zelador": "Bartira Aparecida de Souza Vasconcelos",
      "RG": "32.196.412-3",
      "Cargo": "Professor Educação Básica II",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/18/27",
      "Processo": "SEI - 015.00633952/2025-01",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Desembargador Manuel S. V.Neto",
      "Nome do Zelador": "Rodrigo dos Santos Marcelino",
      "RG": "40.128.102-4",
      "Cargo": "Professor Educação Básica II",
      "Unidade de Classificação": "Seduc",
      "Publicação": "9/29/24",
      "Venc.": "8/22/26",
      "Processo": "SEI - 015.00372109/2024-53",
      "OBS.": "RENOVAÇÃO"
    },
    {
      "Unidade Escolar": "Dimarães Antonio Sandei",
      "Nome do Zelador": "Alan Vitor Correa",
      "RG": "41.482.663-2",
      "Cargo": "Professor Educação Básica II",
      "Unidade de Classificação": "Seduc",
      "Publicação": "12/29/23",
      "Venc.": "12/29/25",
      "Processo": "SEI - 015.00469607/2023-37",
      "OBS.": "RENOVAÇÃO"
    },
    {
      "Unidade Escolar": "Dolores Garcia Paschoalim",
      "Nome do Zelador": "Ana Maria Silva",
      "RG": "19.696.936-0",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/2/27",
      "Processo": "SEI - 015.00539144/2025-40",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Dorvalino Abílio Teixeira",
      "Nome do Zelador": "Luciana Faustino De Jesus",
      "RG": "33.904.500-0",
      "Cargo": "Gerente De Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/2/27",
      "Processo": "SEI - 015.00546193/2025-39",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Eliana Andrés de Almeida Souza",
      "Nome do Zelador": "Mirian Aparecida de Oliveira Barducco",
      "RG": "48.798.288-5,",
      "Cargo": "Gerente Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "3/18/25",
      "Venc.": "2/14/27",
      "Processo": "SEI - 015.00223867/2025-20",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Giuseppe Angelo Bertolli",
      "Nome do Zelador": "Simone dos Santos Freitas",
      "RG": "32.203.577-6",
      "Cargo": "Monitora Prefeitura -Jandira",
      "Unidade de Classificação": "Pref. Municipal de Jandira",
      "Publicação": "8/11/25",
      "Venc.": "7/2/27",
      "Processo": "SEI - 015.00577251/2025-76",
      "OBS.": "OK -DARE"
    },
    {
      "Unidade Escolar": "Iracema Rauen Maciel",
      "Unidade de Classificação": "seduc",
      "Publicação": "8/29/24",
      "Venc.": "6/27/26",
      "Processo": "SEI - 015.00493115/2024-43",
      "OBS.": "NOVO"
    },
    {
      "Unidade Escolar": "Itajahy Feitosa Martins",
      "Nome do Zelador": "Debora Ferreira Paiva",
      "RG": "41.338.455-x",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "9/30/24",
      "Venc.": "2/27/26",
      "Processo": "SEI - 015.00623820/2024-81",
      "OBS.": "RENOVAÇÃO"
    },
    {
      "Unidade Escolar": "Ignês Amélia Machado",
      "Nome do Zelador": "Adeline Correia Marques",
      "RG": "25.543.933-7",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/10/27",
      "Processo": "SEI - 015.00520752/2025-81",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Jardim Maria Helena I",
      "Nome do Zelador": "Walmir Diffonso",
      "RG": "8.832.375-4",
      "Cargo": "Gerente De Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "12/18/25",
      "Venc.": "8/5/27",
      "Processo": "SEI –015.00968522/2025-07.",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Joao Batista Solde",
      "Nome do Zelador": "Marina Aparecida dos Santos",
      "RG": "34.908.360-5",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "7/10/24",
      "Processo": "SEI -015.00464623/2024-14"
    },
    {
      "Unidade Escolar": "José Neyde Cesar Lessa",
      "Unidade de Classificação": "Seduc",
      "Publicação": "3/18/25",
      "Venc.": "11/20/26",
      "Processo": "SEI - 015.00817958/2024-40",
      "OBS.": "NOVO"
    },
    {
      "Unidade Escolar": "José Wilson Padinha",
      "Nome do Zelador": "Wellington  Soares de Oliveira",
      "RG": "42.738.226-9",
      "Cargo": "Auxiliar de Serviços Gerais ",
      "Unidade de Classificação": "Pref. Municipal de Barueri",
      "Publicação": "6/19/24",
      "Venc.": "12/14/25",
      "Processo": "SEI - 015.00041520/2024-80",
      "OBS.": "RENOVAÇÃO"
    },
    {
      "Unidade Escolar": "Josepha Pinto Chiavelli",
      "Nome do Zelador": "Silvana Aparecida dos S. Moreira",
      "RG": "35.090.688-9",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "2/17/27",
      "Processo": "SEI - 015.00166435/2025-12",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Luis da Camara Cascudo",
      "Nome do Zelador": "Ana Paula da Silva",
      "RG": "17.378.036-2",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/11/27",
      "Processo": "SEI - 0015.00526918/2025-72",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Mary Mallet Cyrino",
      "Nome do Zelador": "Graziele Cristina Messias",
      "RG": "42.799.774-4",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/10/27",
      "Processo": "SEI - 015-00066471/2023-15",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Moacir Thomaz da Silva",
      "Nome do Zelador": "Maurício da Silva Martins",
      "RG": "28.063.601-5",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/10/27",
      "Processo": "SEI - 015.00597836/2025-11",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Nacif Amin Chalupe",
      "Nome do Zelador": "Viviane Santos do Carmo",
      "RG": "23.977.753-1",
      "Cargo": "Professor Educação Básica II",
      "Unidade de Classificação": "Seduc",
      "Publicação": "9/30/24",
      "Venc.": "8/23/26",
      "Processo": "SEI - 015.00636271/2024-13",
      "OBS.": "NOVO"
    },
    {
      "Unidade Escolar": "Nercy Amélia Martilini Daher",
      "Nome do Zelador": "Angela Maria da Silva",
      "RG": "21.588.322-6",
      "Cargo": "Agente de Serviço Escolares",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/4/27",
      "Processo": "SEI - 015-00066479/2023-73",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "OswalDo Sammartino",
      "Nome do Zelador": "Maria Celia da Silva",
      "RG": "59.951.935-6,",
      "Cargo": "Merendeira",
      "Unidade de Classificação": "Pref.de Jandira",
      "Publicação": "12/29/23",
      "Venc.": "9/25/25",
      "Processo": "SEI - 015.00452904/2023-43",
      "OBS.": "NOVO"
    },
    {
      "Unidade Escolar": "Paulo da Costa Pan Chacon",
      "Nome do Zelador": "Alcione Nazaré Pereira Ferreira",
      "RG": "37.362.971-0",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "6/10/27",
      "Processo": "SEI - 015-00064855/2023-95",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Paulo de Abreu",
      "Nome do Zelador": "Edinilson de Abreu ",
      "RG": "23.456.651-6",
      "Cargo": "Agente de mobolidade Urbana ",
      "Unidade de Classificação": "Pref. Municipal de Itapevi",
      "Publicação": "8/11/25",
      "Venc.": "6/13/27",
      "Processo": "SEI - 015.00555239/2025-19",
      "OBS.": "OK -DARE"
    },
    {
      "Unidade Escolar": "Raul Briquet",
      "Nome do Zelador": "Juan Silva Borges",
      "RG": "34.267.198-4",
      "Cargo": "Agente de Organização Escolares",
      "Unidade de Classificação": "Seduc",
      "Publicação": "6/10/25",
      "Venc.": "10/14/26",
      "Processo": "SEI - 015.00462806/2025-86",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Republica do Equador",
      "Nome do Zelador": "Ailton Xavier Santos",
      "RG": "38.385.776-4",
      "Cargo": "Agente de Organização Escolar",
      "Unidade de Classificação": "Seduc",
      "Publicação": "12/9/25",
      "Venc.": "12/26/27",
      "Processo": "SEI - 15.00368681/2023-37",
      "OBS.": "OK"
    },
    {
      "Unidade Escolar": "Romeo Mecca",
      "Nome do Zelador": "Jimmy Rocherard Mesquita",
      "RG": "44.056.362-8",
      "Cargo": "Prefeitura de Taboão da Serra",
      "Unidade de Classificação": "Pref. Municipal de Taboão ",
      "Publicação": "8/11/25",
      "Venc.": "5/7/27",
      "Processo": "SEI - 015.00555492/2025-64",
      "OBS.": "OK -DARE"
    },
    {
      "Unidade Escolar": "Vicente Themudo Lessa",
      "Nome do Zelador": "Janildo Rodrigues de Medeiros ",
      "RG": "32.028.332-X",
      "Cargo": "vigia",
      "Unidade de Classificação": "Pref. Municipal de Jandira",
      "Publicação": "6/19/24",
      "Venc.": "4/1/26",
      "Processo": "SEI - 015.00527298/2024-16",
      "OBS.": "RENOVAÇÃO"
    },
    {
      "Unidade Escolar": "Wilmar Soares da Silva",
      "Nome do Zelador": "Daniel Gama Figueiredo",
      "RG": "35.241.950-7",
      "Cargo": "Vigia",
      "Unidade de Classificação": "Pref. Municipal de Jandira",
      "Publicação": "8/11/25",
      "Venc.": "6/9/27",
      "Processo": "SEI - 015.00067129/2023-24",
      "OBS.": "DEVE DARE"
    },
    {
      "Unidade Escolar": "Mario Joaquim Escobar",
      "Nome do Zelador": "Amaurisio Umbrelino da Silva",
      "RG": "35.601.191-4",
      "Cargo": "Professor Educação Básica II",
      "Unidade de Classificação": "Seduc",
      "Publicação": "8/11/25",
      "Venc.": "8/11/27",
      "Processo": "SEI - 015.00536876/2025-88",
      "OBS.": "OK"
    },
    {
      "Processo": "015.00662182/2025-03-Desc."
    }
  ]
};
    let estadoSefisc = {
      filtroStatus: 'TODOS',
      termoBusca: '',
      colOrdenacao: 'vencimento',
      ordemDir: 'desc'
    };

    /* Dados SEFISC alimentados exclusivamente pela nuvem (zero localStorage) */
