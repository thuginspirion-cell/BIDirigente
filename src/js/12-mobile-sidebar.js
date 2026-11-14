    /* ========================================================
       CONTROLE RESPONSIVO MOBILE & DRAWER DA SIDEBAR
       ======================================================== */
    function toggleMobileSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('mobile-sidebar-backdrop');
      if (!sidebar) return;
      const isOpen = sidebar.classList.toggle('mobile-open');
      if (backdrop) {
        if (isOpen) {
          backdrop.classList.add('active');
        } else {
          backdrop.classList.remove('active');
        }
      }
    }

    /* Auto-fecha a sidebar no celular quando o usuário clica em qualquer botão do menu */
    document.addEventListener('DOMContentLoaded', function() {
      const navButtons = document.querySelectorAll('.sidebar-nav .nav-item-btn, .sidebar-brand-crest');
      navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const backdrop = document.getElementById('mobile-sidebar-backdrop');
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (backdrop) backdrop.classList.remove('active');
          }
        });
      });
    });