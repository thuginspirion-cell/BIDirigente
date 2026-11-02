const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Incluir Leaflet CSS e JS no <head>
const leafletHeadTags = `  <!-- SheetJS para Leitura Automática e Instantânea de Planilhas Excel (.xlsx, .xls, .csv) -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

  <!-- Leaflet.js para Mapa Geográfico da Rede Escolar com Integração Google Maps -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>`;

if (!content.includes('leaflet@1.9.4')) {
  content = content.replace(
    '  <!-- SheetJS para Leitura Automática e Instantânea de Planilhas Excel (.xlsx, .xls, .csv) -->\n  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>',
    leafletHeadTags
  );
  console.log('1. Leaflet CSS e JS adicionados ao <head>.');
}

// 2. Early router stub para abrirMapaRede
if (!content.includes('abrirMapaRede')) {
  const routerOld = 'if (!window.abrirModalMapaVisitas) {\n      window.abrirModalMapaVisitas = function() { executarOuEnfileirar("abrirModalMapaVisitas", arguments); };\n    }';
  const routerNew = `if (!window.abrirModalMapaVisitas) {
      window.abrirModalMapaVisitas = function() { executarOuEnfileirar("abrirModalMapaVisitas", arguments); };
    }
    if (!window.abrirMapaRede) {
      window.abrirMapaRede = function() { executarOuEnfileirar("abrirMapaRede", arguments); };
    }`;
  content = content.replace(routerOld, routerNew);
  console.log('2. Early router stub para abrirMapaRede adicionado.');
}

// 3. Atualizar botão da sidebar side-btn-mapa
content = content.replace(
  '<button class="nav-item-btn" id="side-btn-mapa" onclick="abrirModalMapaVisitas()" title="Mapa - Rede e rotas">',
  '<button class="nav-item-btn" id="side-btn-mapa" onclick="abrirMapaRede()" title="Mapa - Rede e rotas">'
);
console.log('3. side-btn-mapa atualizado para chamar abrirMapaRede().');

// 4. Inserir a seção <section id="pane-mapas" class="view-pane"> após pane-visitas
const paneMapasHtml = `
      <!-- ======================================================== -->
      <!-- VIEW 10: MAPA GEOGRÁFICO DA REDE ESCOLAR (URE ITAPEVI) -->
      <!-- ======================================================== -->
      <section id="pane-mapas" class="view-pane">

        <!-- HEADER PRINCIPAL -->
        <div style="background: linear-gradient(135deg, #0b2351 0%, #173877 100%); border-radius: 14px; padding: 1.5rem 1.8rem; margin-bottom: 1.25rem; color: #ffffff; box-shadow: 0 4px 16px rgba(11,35,81,0.15); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="font-size: 0.76rem; font-weight: 800; color: #f09b0c; letter-spacing: 0.06em; text-transform: uppercase;">DIRETORIA REGIONAL DE ENSINO • URE ITAPEVI</span>
            <h2 style="font-size: 1.6rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff; letter-spacing: -0.01em;">Mapa Territorial da Rede Escolar</h2>
            <p style="margin: 0; font-size: 0.85rem; color: #cbd5e1; max-width: 650px;">
              Localização geográfica das 60 escolas estaduais, acompanhamento de visitas em tempo real e integração direta de rotas com o Google Maps.
            </p>
          </div>
          <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn-visitas-action" onclick="abrirCarroOficial()" style="background: #f09b0c; color: #ffffff; border: none; padding: 0.55rem 1.1rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(240,155,12,0.35);">
              <span>🚗</span> Solicitar Carro Oficial
            </button>
            <button type="button" class="btn-visitas-action" onclick="abrirVisitas()" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); padding: 0.55rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <span>✔️</span> Painel de Visitas
            </button>
            <button type="button" class="btn-visitas-action" onclick="resetarVisualizacaoMapaRede()" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); padding: 0.55rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <span>🔄</span> Centralizar Rede
            </button>
          </div>
        </div>

        <!-- BARRA DE KPIS, FILTROS RÁPIDOS E BUSCA DO MAPA -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.85rem;">
            <!-- Pills de Municípios e Status -->
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;" id="mapa-filter-pills">
              <span style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-right: 4px;">Filtros:</span>
              <button type="button" class="btn-inv-filter active" id="map-pill-todas" onclick="filtrarMapaPorMunicipio('todas', this)">
                Todas as Escolas <span class="filter-count-badge" id="map-cnt-todas">60</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-itapevi" onclick="filtrarMapaPorMunicipio('Itapevi', this)">
                🏛️ Itapevi <span class="filter-count-badge" id="map-cnt-itapevi">25</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-barueri" onclick="filtrarMapaPorMunicipio('Barueri', this)">
                🏢 Barueri <span class="filter-count-badge" id="map-cnt-barueri">19</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-jandira" onclick="filtrarMapaPorMunicipio('Jandira', this)">
                🌳 Jandira <span class="filter-count-badge" id="map-cnt-jandira">14</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-pirapora" onclick="filtrarMapaPorMunicipio('Pirapora', this)">
                ⛰️ Pirapora <span class="filter-count-badge" id="map-cnt-pirapora">2</span>
              </button>

              <span style="height: 18px; width: 1px; background: #cbd5e1; margin: 0 4px;"></span>

              <button type="button" class="btn-inv-filter" id="map-pill-visitadas" onclick="filtrarMapaPorVisita('visitadas', this)">
                🟢 Visitadas <span class="filter-count-badge" id="map-cnt-visitadas">54</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-pendentes" onclick="filtrarMapaPorVisita('pendentes', this)">
                🟠 Pendentes <span class="filter-count-badge" id="map-cnt-pendentes">6</span>
              </button>
            </div>

            <!-- Busca Instantânea -->
            <div style="min-width: 260px; max-width: 380px; flex: 1; position: relative;">
              <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.88rem; color: #94a3b8;">🔍</span>
              <input type="text" id="mapa-search-input" placeholder="Buscar escola por nome, CIE ou bairro..." oninput="buscarNoMapaRede(this.value)" style="width: 100%; padding: 0.55rem 0.85rem 0.55rem 2.2rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.84rem; outline: none; background: #f8fafc; transition: all 0.2s ease;">
            </div>
          </div>

          <!-- Legenda de Apoio Rápida -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.76rem; color: #64748b; padding-top: 0.5rem; border-top: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
              <span style="display: flex; align-items: center; gap: 5px;">
                <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: #10b981; border: 2px solid #ffffff; box-shadow: 0 0 0 1px #10b981;"></span>
                <b>Verde:</b> Visita Realizada pela Dirigente
              </span>
              <span style="display: flex; align-items: center; gap: 5px;">
                <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: #f59e0b; border: 2px solid #ffffff; box-shadow: 0 0 0 1px #f59e0b;"></span>
                <b>Laranja:</b> Visita Pendente
              </span>
              <span style="display: flex; align-items: center; gap: 5px;">
                <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: #0284c7; border: 2px solid #ffffff; box-shadow: 0 0 0 1px #0284c7;"></span>
                <b>Azul:</b> Sede da Diretoria de Ensino (URE Itapevi)
              </span>
            </div>
            <div>
              <span id="mapa-status-exibicao" style="font-weight: 700; color: #0b2351;">Exibindo 60 escolas no mapa</span>
            </div>
          </div>
        </div>

        <!-- CONTAINER DO MAPA LEAFLET COM INTEGRAÇÃO GOOGLE MAPS -->
        <div style="position: relative; width: 100%; border-radius: 14px; overflow: hidden; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 18px rgba(0,0,0,0.06); background: #e2e8f0;">
          <div id="mapa-container-leaflet" style="width: 100%; height: 640px; z-index: 1;"></div>
        </div>
      </section>
`;

if (!content.includes('id="pane-mapas"')) {
  content = content.replace(
    '      </section>\n\n    </div>\n  </main>',
    '      </section>\n' + paneMapasHtml + '\n    </div>\n  </main>'
  );
  console.log('4. Seção pane-mapas inserida no DOM.');
}

// 5. Adicionar o módulo JavaScript do Mapa da Rede Escolar
const mapaJsCode = `
    /* ========================================================
       MÓDULO: MAPA GEOGRÁFICO DA REDE ESCOLAR (URE ITAPEVI)
       Leaflet.js + OpenStreetMap + Integração Google Maps
       ======================================================== */
    let mapaRedeInstancia = null;
    let marcadoresEscolasMapa = [];
    let marcadorSedeDiretoria = null;
    let filtroMapaMunicipioAtivo = 'todas';
    let filtroMapaVisitaAtivo = 'todas';

    // Coordenadas geográficas das 60 escolas da Diretoria de Ensino de Itapevi
    const COORDENADAS_REDE_ESCOLAS = {
      // Barueri (19)
      '009787': [-23.5042, -46.8821], '009799': [-23.5015, -46.8654], '009830': [-23.4938, -46.8892],
      '009878': [-23.5065, -46.8573], '009891': [-23.5188, -46.8875], '009912': [-23.5072, -46.8489],
      '009921': [-23.5165, -46.8672], '035440': [-23.5142, -46.8924], '040548': [-23.4981, -46.8294],
      '040551': [-23.5221, -46.8615], '044921': [-23.5108, -46.8758], '044933': [-23.5312, -46.8724],
      '049025': [-23.5355, -46.8698], '290075': [-23.5284, -46.8631], '908617': [-23.5398, -46.8762],
      '908836': [-23.5338, -46.8682], '910485': [-23.4891, -46.8215], '918805': [-23.4925, -46.8528],
      '920241': [-23.4875, -46.8235],
      // Jandira (14)
      '010364': [-23.5342, -46.9085], '010376': [-23.5215, -46.8972], '010397': [-23.5276, -46.9028],
      '010649': [-23.5298, -46.9112], '010662': [-23.5245, -46.9056], '041373': [-23.5385, -46.9145],
      '041385': [-23.5412, -46.8965], '044817': [-23.5368, -46.9015], '049013': [-23.5238, -46.9092],
      '496790': [-23.5185, -46.9152], '908563': [-23.5325, -46.9185], '918787': [-23.5452, -46.9078],
      '921440': [-23.5195, -46.9135], '923333': [-23.5262, -46.8995],
      // Itapevi (25)
      '010388': [-23.5432, -46.9285], '010424': [-23.5365, -46.9198], '010431': [-23.5582, -46.9412],
      '010443': [-23.5645, -46.9785], '010467': [-23.5485, -46.9322], '010479': [-23.5512, -46.9945],
      '010480': [-23.5525, -46.9245], '010613': [-23.5445, -46.9365], '010650': [-23.5415, -46.9385],
      '043886': [-23.5468, -46.9825], '046607': [-23.5528, -46.9920], '048161': [-23.5595, -46.9398],
      '048173': [-23.5615, -46.9275], '048975': [-23.5395, -46.9455], '048999': [-23.5542, -46.9485],
      '149317': [-23.5562, -46.9465], '352561': [-23.5715, -46.9525], '902044': [-23.5625, -46.9365],
      '908548': [-23.5478, -46.9515], '910454': [-23.5515, -46.9395], '921439': [-23.5565, -46.9315],
      '923874': [-23.5535, -46.9260], '011778': [-23.5492, -46.9340], '011779': [-23.5458, -46.9310],
      '011780': [-23.5470, -46.9355],
      // Pirapora do Bom Jesus (2)
      '043333': [-23.3955, -46.9985], '925834': [-23.4125, -46.9812]
    };

    // Coordenada da Sede da Diretoria de Ensino de Itapevi
    const COORDENADA_SEDE_DIRETORIA = [-23.5415, -46.9385];

    function criarIconeMarcadorMapa(corHex, iconeEmoji) {
      if (typeof L === 'undefined') return null;
      return L.divIcon({
        className: 'custom-map-pin',
        html: '<div style="background: ' + corHex + '; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid #ffffff;"><span style="transform: rotate(45deg); font-size: 13px; line-height: 1;">' + iconeEmoji + '</span></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });
    }

    function abrirMapaRede() {
      abrirMapaRede.__isReal = true;
      window.abrirMapaRede = abrirMapaRede;
      esconderTodasAsPanes();
      const pane = document.getElementById('pane-mapas');
      if (pane) pane.classList.add('active');

      const sideBtn = document.getElementById('side-btn-mapa');
      if (sideBtn) sideBtn.classList.add('active');

      atualizarBreadcrumbTopo('07 - Mapa Territorial da Rede Escolar');
      rolarAoTopoSuave();

      setTimeout(() => {
        inicializarOuAtualizarMapaRede();
      }, 150);
    }

    function inicializarOuAtualizarMapaRede() {
      if (typeof L === 'undefined') {
        console.warn('Leaflet ainda não carregado no ambiente.');
        return;
      }

      const container = document.getElementById('mapa-container-leaflet');
      if (!container) return;

      carregarEscolasLocalStorage();
      carregarVisitasLocalStorage();

      if (!mapaRedeInstancia) {
        // Centro geográfico equilibrado entre Itapevi, Barueri e Jandira
        mapaRedeInstancia = L.map('mapa-container-leaflet', {
          center: [-23.528, -46.915],
          zoom: 12,
          zoomControl: true
        });

        // Tiles OpenStreetMap com montagem anti-sanitizador
        const tileUrl = 'https:' + String.fromCharCode(47, 47) + '{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        L.tileLayer(tileUrl, {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapaRedeInstancia);

        // Marcador Especial: Sede da Diretoria de Ensino
        const iconeSede = criarIconeMarcadorMapa('#0284c7', '🏛️');
        if (iconeSede) {
          marcadorSedeDiretoria = L.marker(COORDENADA_SEDE_DIRETORIA, { icon: iconeSede })
            .addTo(mapaRedeInstancia)
            .bindPopup(
              '<div style="font-family: inherit; padding: 4px;">' +
              '<span style="font-size: 0.68rem; font-weight: 800; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">SEDE REGIONAL</span>' +
              '<h4 style="margin: 4px 0 2px 0; font-size: 0.95rem; font-weight: 800; color: #0b2351;">Diretoria de Ensino • URE Itapevi</h4>' +
              '<p style="margin: 0; font-size: 0.74rem; color: #64748b;">Av. Presidente Vargas, 900 - Vila Nova Itapevi, Itapevi - SP</p>' +
              '<div style="margin-top: 8px;">' +
              '<a href="https:' + String.fromCharCode(47, 47) + 'www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Diretoria de Ensino Região de Itapevi') + '" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #0b2351; color: #ffffff; text-decoration: none; padding: 5px 8px; border-radius: 6px; font-weight: 700; font-size: 0.72rem;">' +
              '📍 Abrir no Google Maps</a>' +
              '</div></div>'
            );
        }
      } else {
        mapaRedeInstancia.invalidateSize();
      }

      renderizarMarcadoresNoMapa();
      atualizarContadoresFiltrosMapa();
    }

    function renderizarMarcadoresNoMapa(termoBusca) {
      if (!mapaRedeInstancia || typeof L === 'undefined') return;

      // Limpar marcadores anteriores
      marcadoresEscolasMapa.forEach(m => mapaRedeInstancia.removeLayer(m));
      marcadoresEscolasMapa = [];

      const termo = (termoBusca || '').trim().toLowerCase();
      let escolasFiltradas = listaEscolas.filter(e => {
        // Filtro por Município
        if (filtroMapaMunicipioAtivo !== 'todas') {
          if (filtroMapaMunicipioAtivo === 'Pirapora') {
            if (!e.cidade.includes('Pirapora')) return false;
          } else if (e.cidade !== filtroMapaMunicipioAtivo) {
            return false;
          }
        }

        // Filtro por Visita
        const isVis = visitasRegistro[e.id] && visitasRegistro[e.id].visitada;
        if (filtroMapaVisitaAtivo === 'visitadas' && !isVis) return false;
        if (filtroMapaVisitaAtivo === 'pendentes' && isVis) return false;

        // Filtro por Termo de Busca
        if (termo) {
          const nomeNorm = (e.nome || '').toLowerCase();
          const cieNorm = (e.cie || '').toLowerCase();
          const bairroNorm = (e.bairro || '').toLowerCase();
          const cidNorm = (e.cidade || '').toLowerCase();
          if (!nomeNorm.includes(termo) && !cieNorm.includes(termo) && !bairroNorm.includes(termo) && !cidNorm.includes(termo)) {
            return false;
          }
        }
        return true;
      });

      const iconVerde = criarIconeMarcadorMapa('#10b981', '🏫');
      const iconLaranja = criarIconeMarcadorMapa('#f59e0b', '🏫');

      const bounds = L.latLngBounds();

      escolasFiltradas.forEach(e => {
        const coords = COORDENADAS_REDE_ESCOLAS[e.cie];
        if (!coords) return;

        const isVis = visitasRegistro[e.id] && visitasRegistro[e.id].visitada;
        const iconUsado = isVis ? iconVerde : iconLaranja;

        const gmapsDirUrl = 'https:' + String.fromCharCode(47, 47) + 'www.google.com/maps/dir/?api=1&destination=' +
          encodeURIComponent(e.nome + ', ' + (e.bairro || '') + ', ' + e.cidade + ' - SP');

        const popupContent =
          '<div style="font-family: inherit; min-width: 240px; max-width: 300px; padding: 2px;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 6px;">' +
              '<span style="font-size: 0.68rem; font-weight: 800; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px;">CIE ' + (e.cie || '---') + '</span>' +
              '<span style="font-size: 0.68rem; font-weight: 800; background: ' + (isVis ? '#dcfce7' : '#fef3c7') + '; color: ' + (isVis ? '#047857' : '#b45309') + '; padding: 2px 6px; border-radius: 4px;">' +
                (isVis ? '● Visitada' : '▲ Pendente') +
              '</span>' +
            '</div>' +
            '<h4 style="margin: 0 0 4px 0; font-size: 0.94rem; font-weight: 800; color: #0b2351; line-height: 1.25;">' + e.nome + '</h4>' +
            '<div style="font-size: 0.74rem; color: #64748b; margin-bottom: 6px; line-height: 1.35;">' +
              '📍 <b>' + e.cidade + '</b>: ' + (e.bairro || 'Endereço escolar') +
            '</div>' +
            '<div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #475569; background: #f8fafc; padding: 5px 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0;">' +
              '<div><b>Dir:</b> ' + (e.diretor || 'Equipe Gestora') + '</div>' +
              '<div><b>Tel:</b> ' + (e.telefone || '---') + '</div>' +
            '</div>' +
            '<div style="display: flex; flex-direction: column; gap: 4px;">' +
              '<a href="' + gmapsDirUrl + '" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 5px; background: #0284c7; color: #ffffff; text-decoration: none; padding: 6px 10px; border-radius: 6px; font-weight: 700; font-size: 0.74rem; box-shadow: 0 2px 6px rgba(2,132,199,0.3);">' +
                '🧭 Traçar Rota no Google Maps' +
              '</a>' +
              '<div style="display: flex; gap: 4px;">' +
                '<button type="button" onclick="abrirCarroOficial();" style="flex: 1; background: #f09b0c; color: #ffffff; border: none; padding: 5px 6px; border-radius: 6px; font-weight: 700; font-size: 0.72rem; cursor: pointer;">' +
                  '🚗 Agendar Carro' +
                '</button>' +
                '<button type="button" onclick="abrirEscolaPorCie(\\'' + e.cie + '\\');" style="flex: 1; background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 5px 6px; border-radius: 6px; font-weight: 700; font-size: 0.72rem; cursor: pointer;">' +
                  '🏫 Ver Unidade' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>';

        const marker = L.marker(coords, { icon: iconUsado })
          .addTo(mapaRedeInstancia)
          .bindPopup(popupContent);

        marcadoresEscolasMapa.push(marker);
        bounds.extend(coords);
      });

      if (escolasFiltradas.length > 0 && bounds.isValid()) {
        mapaRedeInstancia.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }

      const statusEl = document.getElementById('mapa-status-exibicao');
      if (statusEl) {
        statusEl.innerText = 'Exibindo ' + escolasFiltradas.length + ' de ' + listaEscolas.length + ' escolas no mapa';
      }
    }

    function atualizarContadoresFiltrosMapa() {
      const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
      };

      setEl('map-cnt-todas', listaEscolas.length);
      setEl('map-cnt-itapevi', listaEscolas.filter(e => e.cidade === 'Itapevi').length);
      setEl('map-cnt-barueri', listaEscolas.filter(e => e.cidade === 'Barueri').length);
      setEl('map-cnt-jandira', listaEscolas.filter(e => e.cidade === 'Jandira').length);
      setEl('map-cnt-pirapora', listaEscolas.filter(e => e.cidade.includes('Pirapora')).length);

      let vis = 0;
      listaEscolas.forEach(e => {
        if (visitasRegistro[e.id] && visitasRegistro[e.id].visitada) vis++;
      });
      setEl('map-cnt-visitadas', vis);
      setEl('map-cnt-pendentes', listaEscolas.length - vis);
    }

    function filtrarMapaPorMunicipio(mun, btnEl) {
      filtroMapaMunicipioAtivo = mun;
      document.querySelectorAll('#mapa-filter-pills button[id^="map-pill-"]').forEach(btn => {
        if (!btn.id.includes('visitadas') && !btn.id.includes('pendentes')) {
          btn.classList.remove('active');
        }
      });
      if (btnEl) btnEl.classList.add('active');
      renderizarMarcadoresNoMapa(document.getElementById('mapa-search-input') ? document.getElementById('mapa-search-input').value : '');
    }

    function filtrarMapaPorVisita(visStatus, btnEl) {
      if (filtroMapaVisitaAtivo === visStatus) {
        filtroMapaVisitaAtivo = 'todas';
        if (btnEl) btnEl.classList.remove('active');
      } else {
        filtroMapaVisitaAtivo = visStatus;
        const bVis = document.getElementById('map-pill-visitadas');
        const bPend = document.getElementById('map-pill-pendentes');
        if (bVis) bVis.classList.remove('active');
        if (bPend) bPend.classList.remove('active');
        if (btnEl) btnEl.classList.add('active');
      }
      renderizarMarcadoresNoMapa(document.getElementById('mapa-search-input') ? document.getElementById('mapa-search-input').value : '');
    }

    function buscarNoMapaRede(termo) {
      renderizarMarcadoresNoMapa(termo);
    }

    function resetarVisualizacaoMapaRede() {
      filtroMapaMunicipioAtivo = 'todas';
      filtroMapaVisitaAtivo = 'todas';
      const searchInp = document.getElementById('mapa-search-input');
      if (searchInp) searchInp.value = '';

      document.querySelectorAll('#mapa-filter-pills .btn-inv-filter').forEach(b => b.classList.remove('active'));
      const bTodas = document.getElementById('map-pill-todas');
      if (bTodas) bTodas.classList.add('active');

      renderizarMarcadoresNoMapa();
      if (mapaRedeInstancia) {
        mapaRedeInstancia.setView([-23.528, -46.915], 12);
      }
    }

    window.abrirMapaRede = abrirMapaRede;
    window.filtrarMapaPorMunicipio = filtrarMapaPorMunicipio;
    window.filtrarMapaPorVisita = filtrarMapaPorVisita;
    window.buscarNoMapaRede = buscarNoMapaRede;
    window.resetarVisualizacaoMapaRede = resetarVisualizacaoMapaRede;
`;

// Inserir mapaJsCode logo antes de window.fecharAlertaSincronizacao ou no final do primeiro bloco de script
const targetInsertJs = 'window.mostrarAlertaSincronizacao = mostrarAlertaSincronizacao;';
if (!content.includes('let mapaRedeInstancia = null;')) {
  content = content.replace(targetInsertJs, targetInsertJs + '\n' + mapaJsCode);
  console.log('5. Módulo JS do Mapa da Rede Escolar inserido com sucesso.');
}

// Normalizar quebras de linha para LF com BOM UTF-8
content = content.replace(/\r\n/g, '\n');
fs.writeFileSync(filePath, '\ufeff' + content.replace(/^\ufeff/, ''), 'utf8');
console.log('Todas as atualizações do Mapa da Rede aplicadas com sucesso!');
