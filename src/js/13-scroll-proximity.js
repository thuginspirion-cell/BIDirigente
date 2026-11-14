    /* ========================================================================= */
    /* DETECTOR DE PROXIMIDADE DA BARRA DE ROLAGEM (OCULTA / ATIVA POR PROXIMIDADE) */
    /* ========================================================================= */
    (function() {
      function iniciarProximidadeScrollbar() {
        var mainEl = document.querySelector('.main-content');
        var sidebarEl = document.querySelector('.sidebar');
        var timerMain = null;
        var timerSidebar = null;

        /* Detector para a Área Principal (.main-content) */
        if (mainEl) {
          window.addEventListener('mousemove', function(e) {
            var rect = mainEl.getBoundingClientRect();
            var distDireita = rect.right - e.clientX;
            var distTelaDireita = window.innerWidth - e.clientX;
            /* Se o mouse estiver a 35px ou menos da borda direita da main-content ou da tela */
            if ((distDireita >= 0 && distDireita <= 35) || (distTelaDireita >= 0 && distTelaDireita <= 35)) {
              mainEl.classList.add('scrollbar-active');
            } else {
              mainEl.classList.remove('scrollbar-active');
            }
          }, { passive: true });

          mainEl.addEventListener('scroll', function() {
            mainEl.classList.add('scrollbar-active');
            clearTimeout(timerMain);
            timerMain = setTimeout(function() {
              mainEl.classList.remove('scrollbar-active');
            }, 1200);
          }, { passive: true });

          mainEl.addEventListener('mouseleave', function() {
            mainEl.classList.remove('scrollbar-active');
          }, { passive: true });
        }

        /* Detector para a Barra Lateral (.sidebar) */
        if (sidebarEl) {
          sidebarEl.addEventListener('mousemove', function(e) {
            var rect = sidebarEl.getBoundingClientRect();
            var distDireita = rect.right - e.clientX;
            if (distDireita >= 0 && distDireita <= 30) {
              sidebarEl.classList.add('scrollbar-active');
            } else {
              sidebarEl.classList.remove('scrollbar-active');
            }
          }, { passive: true });

          sidebarEl.addEventListener('scroll', function() {
            sidebarEl.classList.add('scrollbar-active');
            clearTimeout(timerSidebar);
            timerSidebar = setTimeout(function() {
              sidebarEl.classList.remove('scrollbar-active');
            }, 1200);
          }, { passive: true });

          sidebarEl.addEventListener('mouseleave', function() {
            sidebarEl.classList.remove('scrollbar-active');
          }, { passive: true });
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarProximidadeScrollbar);
      } else {
        iniciarProximidadeScrollbar();
      }
    })();

    /* ========================================================================= */
    /* COMMAND PALETTE GLOBAL (CTRL + K) & BRIEFING MATINAL EXECUTIVO            */
    /* ========================================================================= */
    var __cmdkResultadosAtuais = [];
    var __cmdkIndiceSelecionado = 0;

    function abrirCommandPalette() {
      var overlay = document.getElementById('modal-command-palette');
      var input = document.getElementById('cmdk-input');
      if (!overlay) return;
      overlay.classList.add('active');
      if (input) {
        input.value = '';
        renderizarResultadosCommandPalette('');
        setTimeout(function() { input.focus(); }, 30);
      }
    }

    function fecharCommandPalette() {
      var overlay = document.getElementById('modal-command-palette');
      if (overlay) overlay.classList.remove('active');
    }

    function coletarItensCommandPalette(termo) {
      var q = String(termo || '').toLowerCase().trim();
      var grupos = [];

      var svgPlus = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>';
      var svgCar = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
      var svgSync = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>';
      var svgHome = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
      var svgCal = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>';
      var svgCheck = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      var svgSchool = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/></svg>';
      var svgMap = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>';
      var svgSector = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>';

      var acoesRapidas = [
        { grupo: 'Ações Rápidas', icone: svgPlus, titulo: 'Novo Compromisso na Agenda', sub: 'Agendar reunião, despacho ou visita na rotina da Dirigente', tag: 'Ação', fn: function() { fecharCommandPalette(); if (typeof abrirModalNovoCompromisso === 'function') abrirModalNovoCompromisso(); } },
        { grupo: 'Ações Rápidas', icone: svgCar, titulo: 'Solicitar Carro Oficial', sub: 'Abrir formulário de reserva de veículo oficial', tag: 'Ação', fn: function() { fecharCommandPalette(); if (typeof abrirModalNovaSolicitacaoCarro === 'function') abrirModalNovaSolicitacaoCarro(); } },
        { grupo: 'Ações Rápidas', icone: svgSync, titulo: 'Sincronizar Todas as Bases', sub: 'Atualizar todos os 12 setores e SharePoint em tempo real', tag: 'Sistema', fn: function() { fecharCommandPalette(); if (typeof sincronizarTudoGlobalmente === 'function') sincronizarTudoGlobalmente(); } }
      ];

      var modulos = [
        { grupo: 'Navegação & Setores', icone: svgHome, titulo: 'Início — Resumo Executivo', sub: 'Painel geral da URE Itapevi e telemetria', tag: 'Módulo', fn: function() { fecharCommandPalette(); if (typeof mostrarHome === 'function') mostrarHome(); } },
        { grupo: 'Navegação & Setores', icone: svgCal, titulo: 'Agenda & Rotina da Dirigente', sub: 'Calendário mensal, linha do tempo 07h–17h e pauta', tag: 'Módulo', fn: function() { fecharCommandPalette(); if (typeof abrirAgenda === 'function') abrirAgenda(); } },
        { grupo: 'Navegação & Setores', icone: svgCar, titulo: 'Carro Oficial — Frota & Logística', sub: 'Spin TLH 1B63, HB20 FZG 0H22 e Modelo 30', tag: 'Módulo', fn: function() { fecharCommandPalette(); if (typeof abrirCarroOficial === 'function') abrirCarroOficial(); } },
        { grupo: 'Navegação & Setores', icone: svgCheck, titulo: 'Visitas Escolares', sub: 'Acompanhamento de visitas realizadas e pendentes', tag: 'Módulo', fn: function() { fecharCommandPalette(); if (typeof abrirVisitas === 'function') abrirVisitas(); } },
        { grupo: 'Navegação & Setores', icone: svgSchool, titulo: 'Escolas — Rede Estadual', sub: 'Panorama das unidades escolares da URE Itapevi', tag: 'Módulo', fn: function() { fecharCommandPalette(); if (typeof abrirEscolas === 'function') abrirEscolas(); } },
        { grupo: 'Navegação & Setores', icone: svgMap, titulo: 'Mapa da Rede & Rotas', sub: 'Visualização geográfica das escolas e deslocamentos', tag: 'Módulo', fn: function() { fecharCommandPalette(); if (typeof abrirMapaRede === 'function') abrirMapaRede(); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'ASURE — Assessoria e Gabinete', sub: 'Assessoria Técnica da Unidade Regional de Ensino', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirCentro === 'function') abrirCentro('ASURE'); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'SEINTEC — Seção de Tecnologia', sub: 'Inventário, parque tecnológico e chamados', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirSeintec === 'function') abrirSeintec(); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'SEAFIN — Administração e Finanças', sub: 'Orçamento, contratos SECOMSE e finanças', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirCentro === 'function') abrirCentro('SEAFIN'); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'SEOM — Obras & Manutenção', sub: 'Manutenção predial, obras e fiscalização', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirCentro === 'function') abrirCentro('SEOM'); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'SEGRE — Gestão da Rede Escolar', sub: 'Vida escolar (SEVESC), matrícula (SEMAT) e demandas', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirCentro === 'function') abrirCentro('SEGRE'); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'SEPES — Serviço de Pessoas', sub: 'Aposentadorias, designações e abono de permanência', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirCentro === 'function') abrirCentro('SEPES'); } },
        { grupo: 'Navegação & Setores', icone: svgSector, titulo: 'EEC — Currículo e Formação', sub: 'Portal pedagógico, avaliações e formação docente', tag: 'Centro', fn: function() { fecharCommandPalette(); if (typeof abrirCentro === 'function') abrirCentro('EEC'); } }
      ];

      var listaFinal = [];
      acoesRapidas.concat(modulos).forEach(function(it) {
        if (!q || (it.titulo + ' ' + it.sub).toLowerCase().indexOf(q) !== -1) {
          listaFinal.push(it);
        }
      });

      if (q && typeof AGENDA_COMPROMISSOS !== 'undefined' && Array.isArray(AGENDA_COMPROMISSOS)) {
        var countAg = 0;
        AGENDA_COMPROMISSOS.forEach(function(ev) {
          if (countAg >= 5) return;
          var txt = ((ev.titulo || '') + ' ' + (ev.local || '') + ' ' + (ev.setor || '') + ' ' + (ev.tipo || '')).toLowerCase();
          if (txt.indexOf(q) !== -1) {
            countAg++;
            listaFinal.push({
              grupo: 'Agenda & Rotina',
              icone: '📅',
              titulo: ev.titulo,
              sub: (ev.data || '') + ' · ' + (ev.horaInicio || '') + '–' + (ev.horaFim || '') + ' · ' + (ev.local || 'Gabinete'),
              tag: ev.status || 'Agendado',
              fn: function() {
                fecharCommandPalette();
                if (typeof abrirAgenda === 'function') abrirAgenda(ev.data, 'timeline');
              }
            });
          }
        });
      }

      if (q && typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas)) {
        var countEsc = 0;
        listaEscolas.forEach(function(esc) {
          if (countEsc >= 6) return;
          var nome = esc.nome || esc.escola || '';
          var cie = String(esc.cie || '');
          var mun = esc.municipio || '';
          if ((nome + ' ' + cie + ' ' + mun).toLowerCase().indexOf(q) !== -1) {
            countEsc++;
            listaFinal.push({
              grupo: 'Escolas da Rede',
              icone: '🏫',
              titulo: nome,
              sub: 'CIE ' + cie + (mun ? ' · ' + mun : ''),
              tag: esc.tipo || 'EE',
              fn: function() {
                fecharCommandPalette();
                if (typeof abrirEscolas === 'function') abrirEscolas();
                var inp = document.getElementById('escolas-search-input');
                if (inp) {
                  inp.value = nome;
                  if (typeof filtrarEscolas === 'function') filtrarEscolas();
                }
              }
            });
          }
        });
      }

      if (q && typeof CARRO_DATA !== 'undefined' && CARRO_DATA && Array.isArray(CARRO_DATA.registros)) {
        var countCar = 0;
        CARRO_DATA.registros.forEach(function(reg) {
          if (countCar >= 4) return;
          var txt = ((reg.solicitante || '') + ' ' + (reg.destino || '') + ' ' + (reg.placa || '') + ' ' + (reg.veiculo || '')).toLowerCase();
          if (txt.indexOf(q) !== -1) {
            countCar++;
            listaFinal.push({
              grupo: 'Carro Oficial',
              icone: '🚗',
              titulo: (reg.veiculo || 'Veículo') + ' (' + (reg.placa || '') + ') — ' + (reg.solicitante || ''),
              sub: (reg.data || '') + ' · ' + (reg.destino || ''),
              tag: reg.status || 'Agendado',
              fn: function() {
                fecharCommandPalette();
                if (typeof abrirCarroOficial === 'function') abrirCarroOficial();
                if (typeof abrirModalDetalhesAgendamentoCarro === 'function') abrirModalDetalhesAgendamentoCarro(reg.id);
              }
            });
          }
        });
      }

      return listaFinal.slice(0, 14);
    }

    function renderizarResultadosCommandPalette(termo) {
      var container = document.getElementById('cmdk-results');
      if (!container) return;
      __cmdkResultadosAtuais = coletarItensCommandPalette(termo);
      __cmdkIndiceSelecionado = 0;

      if (__cmdkResultadosAtuais.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 2rem; color: #64748b; font-size: 0.88rem;">Nenhum resultado encontrado para esta busca.</div>';
        return;
      }

      var html = '';
      var ultimoGrupo = '';
      __cmdkResultadosAtuais.forEach(function(item, idx) {
        if (item.grupo !== ultimoGrupo) {
          ultimoGrupo = item.grupo;
          html += '<div class="cmdk-group-label">' + item.grupo + '</div>';
        }
        html += '<div class="cmdk-item ' + (idx === 0 ? 'is-selected' : '') + '" data-cmdk-idx="' + idx + '" onclick="executarItemCommandPalette(' + idx + ')">' +
          '<div class="cmdk-item-left">' +
            '<span class="cmdk-item-icon">' + item.icone + '</span>' +
            '<div style="min-width:0;">' +
              '<div class="cmdk-item-title">' + item.titulo + '</div>' +
              '<div class="cmdk-item-sub">' + item.sub + '</div>' +
            '</div>' +
          '</div>' +
          '<span class="cmdk-item-tag">' + item.tag + '</span>' +
        '</div>';
      });
      container.innerHTML = html;
    }

    function executarItemCommandPalette(idx) {
      var item = __cmdkResultadosAtuais[idx];
      if (item && typeof item.fn === 'function') {
        item.fn();
      }
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') {
        e.preventDefault();
        var overlay = document.getElementById('modal-command-palette');
        if (overlay && overlay.classList.contains('active')) {
          fecharCommandPalette();
        } else {
          abrirCommandPalette();
        }
        return;
      }
      var overlayAtivo = document.getElementById('modal-command-palette');
      if (!overlayAtivo || !overlayAtivo.classList.contains('active')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        fecharCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (__cmdkResultadosAtuais.length > 0) {
          __cmdkIndiceSelecionado = (__cmdkIndiceSelecionado + 1) % __cmdkResultadosAtuais.length;
          atualizarSelecaoCommandPalette();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (__cmdkResultadosAtuais.length > 0) {
          __cmdkIndiceSelecionado = (__cmdkIndiceSelecionado - 1 + __cmdkResultadosAtuais.length) % __cmdkResultadosAtuais.length;
          atualizarSelecaoCommandPalette();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executarItemCommandPalette(__cmdkIndiceSelecionado);
      }
    });

    function atualizarSelecaoCommandPalette() {
      var itens = document.querySelectorAll('#cmdk-results .cmdk-item');
      itens.forEach(function(el, i) {
        if (i === __cmdkIndiceSelecionado) {
          el.classList.add('is-selected');
          el.scrollIntoView({ block: 'nearest' });
        } else {
          el.classList.remove('is-selected');
        }
      });
    }

    function atualizarBriefingMatinalHome() {
      var hojeIso = typeof obterDataHojeIso === 'function' ? obterDataHojeIso() : new Date().toISOString().slice(0, 10);

      /* 1. Agenda Hoje + Badge Sidebar */
      var qtdAgendaHoje = 0;
      if (typeof AGENDA_COMPROMISSOS !== 'undefined' && Array.isArray(AGENDA_COMPROMISSOS)) {
        qtdAgendaHoje = AGENDA_COMPROMISSOS.filter(function(c) { return c.data === hojeIso && c.status !== 'Cancelado'; }).length;
      }
      var elAg = document.getElementById('briefing-agenda-hoje');
      if (elAg) elAg.innerText = qtdAgendaHoje + ' compromisso(s)';
      var badgeAg = document.getElementById('side-badge-agenda');
      if (badgeAg) {
        badgeAg.innerText = qtdAgendaHoje;
        badgeAg.style.display = qtdAgendaHoje > 0 ? 'inline-block' : 'none';
      }

      /* 2. Frota Oficial Hoje + Badge Sidebar */
      var qtdCarroHoje = 0;
      if (typeof CARRO_DATA !== 'undefined' && CARRO_DATA && Array.isArray(CARRO_DATA.registros)) {
        qtdCarroHoje = CARRO_DATA.registros.filter(function(r) {
          if (r.status === 'Cancelado') return false;
          if (typeof registroAtivoNoPeriodoCarro === 'function') return registroAtivoNoPeriodoCarro(r, hojeIso, hojeIso);
          return r.data === hojeIso;
        }).length;
      }
      var elCar = document.getElementById('briefing-carro-hoje');
      if (elCar) elCar.innerText = qtdCarroHoje + ' saída(s)';
      var badgeCar = document.getElementById('side-badge-carro');
      if (badgeCar) {
        badgeCar.innerText = qtdCarroHoje;
        badgeCar.style.display = qtdCarroHoje > 0 ? 'inline-block' : 'none';
      }

      /* 3. Visitas */
      var qtdVisitas = 0;
      if (typeof visitasRegistro !== 'undefined' && Array.isArray(visitasRegistro)) {
        qtdVisitas = visitasRegistro.length;
      }
      var elVis = document.getElementById('briefing-visitas-resumo');
      if (elVis) elVis.innerText = qtdVisitas + ' registradas';

      /* 4. Escolas */
      var qtdEsc = (typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas) && listaEscolas.length > 0) ? listaEscolas.length : 60;
      var elEsc = document.getElementById('briefing-escolas-total');
      if (elEsc) elEsc.innerText = qtdEsc + ' escolas';
    }

    function toggleSetoresSidebar(forceOpen) {
      var btn = document.getElementById('sidebar-setores-toggle');
      var list = document.getElementById('sidebar-setores-list');
      if (!btn || !list) return;
      var willOpen = typeof forceOpen === 'boolean' ? forceOpen : !list.classList.contains('is-open');
      btn.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      list.classList.toggle('is-open', willOpen);
    }
    window.toggleSetoresSidebar = toggleSetoresSidebar;

    function iniciarObserverSetoresSidebar() {
      var setoresList = document.getElementById('sidebar-setores-list');
      if (setoresList && typeof MutationObserver === 'function') {
        var obs = new MutationObserver(function() {
          if (setoresList.querySelector('.nav-item-btn.active')) {
            toggleSetoresSidebar(true);
          }
        });
        obs.observe(setoresList, { subtree: true, attributes: true, attributeFilter: ['class'] });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(atualizarBriefingMatinalHome, 450);
        iniciarObserverSetoresSidebar();
      });
    } else {
      setTimeout(atualizarBriefingMatinalHome, 450);
      iniciarObserverSetoresSidebar();
    }