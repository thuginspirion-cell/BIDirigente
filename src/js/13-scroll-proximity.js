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