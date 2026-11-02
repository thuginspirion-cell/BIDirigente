const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Substituir a barra HTML de botões de filtro rápido do SEINTEC (linhas ~10442-10477)
const oldHtmlButtonsRegex = /<!-- SEINTEC INVENTÁRIO \(HARDWARE\) FAST-FILTER PILLS -->[\s\S]*?id="seintec-inventario-filter-buttons"[\s\S]*?<\/div>\s*(?=\r?\n\s*<!-- PAINEL EXECUTIVO DA DIRIGENTE)/;

const newHtmlButtons = `<!-- SEINTEC INVENTÁRIO (HARDWARE) FAST-FILTER PILLS -->
            <div id="seintec-inventario-filter-buttons" style="display: none; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; padding: 10px 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
              <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-right: 4px; display: flex; align-items: center; gap: 5px;">
                <span>⚡ Filtros Rápidos:</span>
              </span>

              <button type="button" class="btn-inv-filter active" id="btn-inv-filter-todos" onclick="filtrarInventarioPorCategoria('todos', this)">
                Todos os Equipamentos <span class="filter-count-badge" id="badge-inv-cnt-todos">15.873</span>
              </button>

              <span class="inv-filter-sep-hw" style="height: 18px; width: 1px; background: #cbd5e1; margin: 0 4px;"></span>

              <!-- Tipos de Equipamentos -->
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-cat-notebook" onclick="filtrarInventarioPorCategoria('cat:Notebook', this)">
                💻 Notebooks <span class="filter-count-badge" id="badge-inv-cnt-notebook">8.059</span>
              </button>
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-cat-tablet" onclick="filtrarInventarioPorCategoria('cat:Tablet', this)">
                📱 Tablets <span class="filter-count-badge" id="badge-inv-cnt-tablet">6.556</span>
              </button>
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-cat-desktop" onclick="filtrarInventarioPorCategoria('cat:Desktop', this)">
                🖥️ Desktops <span class="filter-count-badge" id="badge-inv-cnt-desktop">957</span>
              </button>
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-cat-smartphone" onclick="filtrarInventarioPorCategoria('cat:Smartphone', this)">
                📞 Smartphones <span class="filter-count-badge" id="badge-inv-cnt-smartphone">301</span>
              </button>

              <span class="inv-filter-sep-hw" style="height: 18px; width: 1px; background: #cbd5e1; margin: 0 4px;"></span>

              <!-- Modelos / Perfis de Uso -->
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-cat-sala-aula" onclick="filtrarInventarioPorCategoria('cat:SalaAula', this)">
                🏫 Sala de Aula <span class="filter-count-badge" id="badge-inv-cnt-sala-aula">6.563</span>
              </button>
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-cat-avancado" onclick="filtrarInventarioPorCategoria('cat:Avancado', this)">
                💼 Avançados <span class="filter-count-badge" id="badge-inv-cnt-avancado">864</span>
              </button>

              <span style="height: 18px; width: 1px; background: #cbd5e1; margin: 0 4px;"></span>

              <!-- Ambientes / Finalidade -->
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-amb-pedagogico" onclick="filtrarInventarioPorCategoria('amb:Pedagógico', this)">
                🎓 Pedagógico <span class="filter-count-badge" id="badge-inv-cnt-pedagogico">14.553</span>
              </button>
              <button type="button" class="btn-inv-filter" id="btn-inv-filter-amb-admin" onclick="filtrarInventarioPorCategoria('amb:Administrativo', this)">
                🏢 Administrativo <span class="filter-count-badge" id="badge-inv-cnt-admin">1.320</span>
              </button>
            </div>`;

if (!oldHtmlButtonsRegex.test(content)) {
  console.error('ERRO: oldHtmlButtonsRegex não encontrado!');
  process.exit(1);
}
content = content.replace(oldHtmlButtonsRegex, newHtmlButtons);
console.log('1. Botões HTML de filtros rápidos substituídos com sucesso.');

// 2. Atualizar funções JS (apenas de let filtroInventarioStatusAtivo até o fim de filtrarInventarioPorStatus)
const oldJsRegex = /let\s+filtroInventarioStatusAtivo\s*=\s*'todos';[\s\S]*?function\s+filtrarInventarioPorStatus\([\s\S]*?limiteExibicaoInventario\s*=\s*100;\s*\r?\n\s*renderizarTabelaInventario\(baseAtivaSeintec\);\s*\r?\n\s*\}/;

const newJsCode = `let filtroInventarioStatusAtivo = 'todos';
    let filtroInventarioCategoriaAtiva = 'todos';

    function atualizarMetricasInventario(idBase) {
      const base = SEINTEC_BASES_CONFIG[idBase || baseAtivaSeintec];
      if (!base || !base.isInventario) return;

      const tipo = base.tipoInventario; // 'hardware', 'rede', 'educatrons', 'recarga'
      const rawTuples = (window.INVENTARIO_COMPLETO_TUPLES && window.INVENTARIO_COMPLETO_TUPLES[tipo]) || [];

      // Filtro por escola selecionada no dropdown se houver
      const filteredTuples = (filtroEscolaCieAtivo && filtroEscolaCieAtivo !== '' && filtroEscolaCieAtivo !== 'todas')
        ? rawTuples.filter(item => String(item[0]) === String(filtroEscolaCieAtivo))
        : rawTuples;

      const total = filteredTuples.length;
      let disponiveis = 0;
      let danificados = 0;
      let manutencao = 0;
      let inserviveis = 0;

      let catNotebook = 0;
      let catTablet = 0;
      let catDesktop = 0;
      let catSmartphone = 0;
      let catSalaAula = 0;
      let catAvancado = 0;
      let ambPedagogico = 0;
      let ambAdmin = 0;

      for (let i = 0; i < total; i++) {
        const item = filteredTuples[i];
        const ambiente = (item[1] || '').trim();
        const categoria = (item[2] || '').trim();
        const status = (item[5] || '').trim();

        const sNorm = status.toLowerCase();
        if (sNorm === 'disponível' || sNorm === 'disponivel') {
          disponiveis++;
        } else if (sNorm.includes('danif')) {
          danificados++;
        } else if (sNorm.includes('manuten') || sNorm.includes('chamado') || sNorm.includes('peça') || sNorm.includes('peca')) {
          manutencao++;
        } else if (sNorm.includes('inserv') || sNorm.includes('descarte') || sNorm.includes('baixa')) {
          inserviveis++;
        } else {
          disponiveis++; // fallback
        }

        // Ambientes
        if (ambiente.toLowerCase().includes('pedag')) {
          ambPedagogico++;
        } else {
          ambAdmin++;
        }

        // Categorias e Modelos de Hardware
        const cNorm = categoria.toLowerCase();
        if (cNorm.includes('notebook')) {
          catNotebook++;
          if (cNorm.includes('sala de aula')) catSalaAula++;
          if (cNorm.includes('avançado') || cNorm.includes('avancado')) catAvancado++;
        } else if (cNorm.includes('tablet')) {
          catTablet++;
        } else if (cNorm.includes('desktop') || cNorm.includes('computador')) {
          catDesktop++;
        } else if (cNorm.includes('smartphone') || cNorm.includes('celular') || cNorm.includes('cel')) {
          catSmartphone++;
        }
      }

      // 1. Atualizar Banner Executivo
      const bannerIcon = document.getElementById('seintec-inv-banner-icon');
      const bannerTitle = document.getElementById('seintec-inv-banner-title');
      const bannerSub = document.getElementById('seintec-inv-banner-subtitle');
      const bannerUptime = document.getElementById('seintec-inv-uptime-pct');
      const bannerEscolas = document.getElementById('seintec-inv-escolas-count');

      if (bannerIcon) bannerIcon.innerText = base.icone || '💻';
      if (bannerTitle) bannerTitle.innerText = \`Gestão Executiva: \${base.titulo}\`;

      const uptimePct = total > 0 ? ((disponiveis / total) * 100).toFixed(1).replace('.', ',') : '0,0';
      if (bannerUptime) bannerUptime.innerText = \`\${uptimePct}%\`;

      if (bannerSub) {
        if (filtroEscolaCieAtivo && filtroEscolaCieAtivo !== '' && filtroEscolaCieAtivo !== 'todas') {
          const escObj = (typeof ESCOLAS_CONFIG !== 'undefined' && ESCOLAS_CONFIG[filtroEscolaCieAtivo]) || null;
          const escNome = escObj ? escObj.nome : \`CIE \${filtroEscolaCieAtivo}\`;
          bannerSub.innerText = \`Visão Detalhada da Unidade: \${escNome} (\${total.toLocaleString('pt-BR')} itens catalogados)\`;
        } else {
          bannerSub.innerText = \`Inventário Oficial Consolidado das 60 Escolas + Sede Regional (\${total.toLocaleString('pt-BR')} equipamentos)\`;
        }
      }

      if (bannerEscolas) {
        bannerEscolas.innerText = (filtroEscolaCieAtivo && filtroEscolaCieAtivo !== '' && filtroEscolaCieAtivo !== 'todas')
          ? '1'
          : '60';
      }

      // 2. Atualizar Cards KPI Superiores (Situação / Status Operacional)
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val.toLocaleString('pt-BR');
      };

      setVal('inv-kpi-val-total', total);
      setVal('inv-kpi-val-disponivel', disponiveis);
      setVal('inv-kpi-val-danificado', danificados);
      setVal('inv-kpi-val-manutencao', manutencao);
      setVal('inv-kpi-val-inservivel', inserviveis);

      const subTotal = document.getElementById('inv-kpi-sub-total');
      const subDisp = document.getElementById('inv-kpi-sub-disponivel');
      const subDani = document.getElementById('inv-kpi-sub-danificado');
      const subManu = document.getElementById('inv-kpi-sub-manutencao');
      const subInse = document.getElementById('inv-kpi-sub-inservivel');

      if (subTotal) subTotal.innerText = \`100% dos ativos mapeados\`;
      if (subDisp) {
        const pct = total > 0 ? ((disponiveis / total) * 100).toFixed(1).replace('.', ',') : '0,0';
        subDisp.innerText = \`\${pct}% em uso normal\`;
      }
      if (subDani) {
        const pct = total > 0 ? ((danificados / total) * 100).toFixed(1).replace('.', ',') : '0,0';
        subDani.innerText = \`\${pct}% requerem reparo\`;
      }
      if (subManu) {
        const pct = total > 0 ? ((manutencao / total) * 100).toFixed(1).replace('.', ',') : '0,0';
        subManu.innerText = \`\${pct}% em assistência/OS\`;
      }
      if (subInse) {
        const pct = total > 0 ? ((inserviveis / total) * 100).toFixed(1).replace('.', ',') : '0,0';
        subInse.innerText = \`\${pct}% prontos p/ descarte\`;
      }

      // 3. Atualizar Badges das Pills de Categorias, Modelos e Ambientes
      const setBadge = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val.toLocaleString('pt-BR');
      };

      setBadge('badge-inv-cnt-todos', total);
      setBadge('badge-inv-cnt-notebook', catNotebook);
      setBadge('badge-inv-cnt-tablet', catTablet);
      setBadge('badge-inv-cnt-desktop', catDesktop);
      setBadge('badge-inv-cnt-smartphone', catSmartphone);
      setBadge('badge-inv-cnt-sala-aula', catSalaAula);
      setBadge('badge-inv-cnt-avancado', catAvancado);
      setBadge('badge-inv-cnt-pedagogico', ambPedagogico);
      setBadge('badge-inv-cnt-admin', ambAdmin);

      // 4. Controle de Visibilidade de Pills Específicas por Base
      const btnNotebook = document.getElementById('btn-inv-filter-cat-notebook');
      const btnTablet = document.getElementById('btn-inv-filter-cat-tablet');
      const btnDesktop = document.getElementById('btn-inv-filter-cat-desktop');
      const btnSmartphone = document.getElementById('btn-inv-filter-cat-smartphone');
      const btnSalaAula = document.getElementById('btn-inv-filter-cat-sala-aula');
      const btnAvancado = document.getElementById('btn-inv-filter-cat-avancado');
      const btnPedagogico = document.getElementById('btn-inv-filter-amb-pedagogico');
      const btnAdmin = document.getElementById('btn-inv-filter-amb-admin');
      const sepsHw = document.querySelectorAll('.inv-filter-sep-hw');

      if (tipo === 'hardware') {
        if (btnNotebook) btnNotebook.style.display = 'inline-flex';
        if (btnTablet) btnTablet.style.display = 'inline-flex';
        if (btnDesktop) btnDesktop.style.display = 'inline-flex';
        if (btnSmartphone) btnSmartphone.style.display = 'inline-flex';
        if (btnSalaAula) btnSalaAula.style.display = 'inline-flex';
        if (btnAvancado) btnAvancado.style.display = 'inline-flex';
        sepsHw.forEach(s => s.style.display = 'inline-block');
      } else {
        if (btnNotebook) btnNotebook.style.display = 'none';
        if (btnTablet) btnTablet.style.display = 'none';
        if (btnDesktop) btnDesktop.style.display = 'none';
        if (btnSmartphone) btnSmartphone.style.display = 'none';
        if (btnSalaAula) btnSalaAula.style.display = 'none';
        if (btnAvancado) btnAvancado.style.display = 'none';
        sepsHw.forEach(s => s.style.display = 'none');
      }
      // Ambientes continuam visíveis em todas as bases
      if (btnPedagogico) btnPedagogico.style.display = 'inline-flex';
      if (btnAdmin) btnAdmin.style.display = 'inline-flex';
    }

    function filtrarInventarioPorStatus(statusKey, cardEl) {
      if (statusKey && (statusKey.startsWith('cat:') || statusKey.startsWith('amb:'))) {
        return filtrarInventarioPorCategoria(statusKey);
      }

      filtroInventarioStatusAtivo = statusKey || 'todos';

      // Sincronizar estilo dos Cards KPI
      document.querySelectorAll('#seintec-inventario-kpi-bar .inv-kpi-card').forEach(c => c.classList.remove('selected'));
      if (cardEl) {
        cardEl.classList.add('selected');
      } else {
        if (statusKey === 'todos') {
          const c = document.getElementById('inv-kpi-total');
          if (c) c.classList.add('selected');
        } else if (statusKey === 'Disponível') {
          const c = document.getElementById('inv-kpi-disponivel');
          if (c) c.classList.add('selected');
        } else if (statusKey === 'Danificado') {
          const c = document.getElementById('inv-kpi-danificado');
          if (c) c.classList.add('selected');
        } else if (statusKey === 'Em manutenção') {
          const c = document.getElementById('inv-kpi-manutencao');
          if (c) c.classList.add('selected');
        } else if (statusKey === 'Inservível') {
          const c = document.getElementById('inv-kpi-inservivel');
          if (c) c.classList.add('selected');
        }
      }

      limiteExibicaoInventario = 100;
      renderizarTabelaInventario(baseAtivaSeintec);
    }

    function filtrarInventarioPorCategoria(catKey, pillEl) {
      filtroInventarioCategoriaAtiva = catKey || 'todos';

      // Se o usuário clicar em "Todos os Equipamentos", reseta também o filtro de status dos cards para total
      if (catKey === 'todos') {
        filtroInventarioStatusAtivo = 'todos';
        document.querySelectorAll('#seintec-inventario-kpi-bar .inv-kpi-card').forEach(c => c.classList.remove('selected'));
        const cTotal = document.getElementById('inv-kpi-total');
        if (cTotal) cTotal.classList.add('selected');
      }

      // Sincronizar estilo dos Botões Pills
      document.querySelectorAll('#seintec-inventario-filter-buttons .btn-inv-filter').forEach(btn => btn.classList.remove('active'));
      if (pillEl) {
        pillEl.classList.add('active');
      } else {
        let btnMatch = null;
        if (catKey === 'todos') btnMatch = document.getElementById('btn-inv-filter-todos');
        else if (catKey === 'cat:Notebook') btnMatch = document.getElementById('btn-inv-filter-cat-notebook');
        else if (catKey === 'cat:Tablet') btnMatch = document.getElementById('btn-inv-filter-cat-tablet');
        else if (catKey === 'cat:Desktop') btnMatch = document.getElementById('btn-inv-filter-cat-desktop');
        else if (catKey === 'cat:Smartphone') btnMatch = document.getElementById('btn-inv-filter-cat-smartphone');
        else if (catKey === 'cat:SalaAula') btnMatch = document.getElementById('btn-inv-filter-cat-sala-aula');
        else if (catKey === 'cat:Avancado') btnMatch = document.getElementById('btn-inv-filter-cat-avancado');
        else if (catKey === 'amb:Pedagógico') btnMatch = document.getElementById('btn-inv-filter-amb-pedagogico');
        else if (catKey === 'amb:Administrativo') btnMatch = document.getElementById('btn-inv-filter-amb-admin');
        if (btnMatch) btnMatch.classList.add('active');
      }

      limiteExibicaoInventario = 100;
      renderizarTabelaInventario(baseAtivaSeintec);
    }

    window.filtrarInventarioPorStatus = filtrarInventarioPorStatus;
    window.filtrarInventarioPorCategoria = filtrarInventarioPorCategoria;`;

if (!oldJsRegex.test(content)) {
  console.error('ERRO: oldJsRegex não encontrado!');
  process.exit(1);
}
content = content.replace(oldJsRegex, newJsCode);
console.log('2. Funções de filtro e métricas atualizadas com sucesso preservando aoMudarFiltroEscolaSeintec.');

// 3. Atualizar o bloco de filtragem dentro de renderizarTabelaInventario (linhas ~17503-17530)
const oldTableFilterRegex = /\/\/\s*Filtro Executivo de Status \/ Categoria \/ Ambiente dos Cards e Pills do Inventário[\s\S]*?(?=\s*\/\/\s*Filtro Métrico Superior dos Cards)/;

const newTableFilterCode = `// Filtro 1: Status Operacional dos Cards Superiores (Disponível, Danificado, Manutenção, Inservível)
      if (filtroInventarioStatusAtivo && filtroInventarioStatusAtivo !== 'todos') {
        if (filtroInventarioStatusAtivo === 'Disponível') {
          filtrados = filtrados.filter(item => {
            const s = (item[5] || '').toLowerCase();
            return s === 'disponível' || s === 'disponivel';
          });
        } else if (filtroInventarioStatusAtivo === 'Danificado') {
          filtrados = filtrados.filter(item => (item[5] || '').toLowerCase().includes('danif'));
        } else if (filtroInventarioStatusAtivo === 'Em manutenção') {
          filtrados = filtrados.filter(item => {
            const s = (item[5] || '').toLowerCase();
            return s.includes('manuten') || s.includes('chamado') || s.includes('peça') || s.includes('peca');
          });
        } else if (filtroInventarioStatusAtivo === 'Inservível') {
          filtrados = filtrados.filter(item => {
            const s = (item[5] || '').toLowerCase();
            return s.includes('inserv') || s.includes('descarte') || s.includes('baixa');
          });
        }
      }

      // Filtro 2: Categorias, Modelos e Ambientes das Pills Rápidas
      if (filtroInventarioCategoriaAtiva && filtroInventarioCategoriaAtiva !== 'todos') {
        if (filtroInventarioCategoriaAtiva === 'cat:Notebook') {
          filtrados = filtrados.filter(item => (item[2] || '').toLowerCase().includes('notebook'));
        } else if (filtroInventarioCategoriaAtiva === 'cat:Tablet') {
          filtrados = filtrados.filter(item => (item[2] || '').toLowerCase().includes('tablet'));
        } else if (filtroInventarioCategoriaAtiva === 'cat:Desktop') {
          filtrados = filtrados.filter(item => {
            const c = (item[2] || '').toLowerCase();
            return c.includes('desktop') || c.includes('computador');
          });
        } else if (filtroInventarioCategoriaAtiva === 'cat:Smartphone') {
          filtrados = filtrados.filter(item => {
            const c = (item[2] || '').toLowerCase();
            return c.includes('smartphone') || c.includes('celular') || c.includes('cel');
          });
        } else if (filtroInventarioCategoriaAtiva === 'cat:SalaAula') {
          filtrados = filtrados.filter(item => (item[2] || '').toLowerCase().includes('sala de aula'));
        } else if (filtroInventarioCategoriaAtiva === 'cat:Avancado') {
          filtrados = filtrados.filter(item => {
            const c = (item[2] || '').toLowerCase();
            return c.includes('avançado') || c.includes('avancado');
          });
        } else if (filtroInventarioCategoriaAtiva === 'amb:Pedagógico') {
          filtrados = filtrados.filter(item => (item[1] || '').toLowerCase().includes('pedag'));
        } else if (filtroInventarioCategoriaAtiva === 'amb:Administrativo') {
          filtrados = filtrados.filter(item => {
            const amb = (item[1] || '').toLowerCase();
            return amb.includes('admin') || (!amb.includes('pedag') && amb !== '');
          });
        }
      }`;

if (!oldTableFilterRegex.test(content)) {
  console.error('ERRO: oldTableFilterRegex não encontrado!');
  process.exit(1);
}
content = content.replace(oldTableFilterRegex, newTableFilterCode);
console.log('3. Lógica de renderização de tabela com filtros combinados atualizada com sucesso.');

// 4. Atualizar fecharPainelSeintec para resetar também filtroInventarioCategoriaAtiva
content = content.replace(/filtroInventarioStatusAtivo = 'todos';/g, (match, offset) => {
  if (content.substring(offset - 60, offset).includes('fecharPainelSeintec')) {
    return "filtroInventarioStatusAtivo = 'todos';\n      filtroInventarioCategoriaAtiva = 'todos';";
  }
  return match;
});

// Normalizar quebras de linha para LF com BOM UTF-8
content = content.replace(/\r\n/g, '\n');
fs.writeFileSync(filePath, '\ufeff' + content.replace(/^\ufeff/, ''), 'utf8');
console.log('Todas as alterações aplicadas em index.html com sucesso!');
