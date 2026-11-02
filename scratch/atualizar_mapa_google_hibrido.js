const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Substituir a seção HTML pane-mapas pelo layout Split Command Center Executivo
const oldPaneMapasRegex = /<!-- ======================================================== -->\s*<!-- VIEW 10: MAPA GEOGRÁFICO DA REDE ESCOLAR \(URE ITAPEVI\) -->\s*<!-- ======================================================== -->\s*<section id="pane-mapas" class="view-pane">[\s\S]*?<\/section>/;

const newPaneMapasHtml = `<!-- ======================================================== -->
      <!-- VIEW 10: MAPA GEOGRÁFICO DA REDE ESCOLAR (URE ITAPEVI) -->
      <!-- ======================================================== -->
      <section id="pane-mapas" class="view-pane">

        <!-- HEADER PRINCIPAL COMPACTO & EXECUTIVO -->
        <div style="background: linear-gradient(135deg, #0b2351 0%, #173877 100%); border-radius: 12px; padding: 1.15rem 1.5rem; margin-bottom: 1rem; color: #ffffff; box-shadow: 0 4px 14px rgba(11,35,81,0.12); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #f09b0c; letter-spacing: 0.06em; text-transform: uppercase;">DIRETORIA REGIONAL DE ENSINO • URE ITAPEVI</span>
              <span style="font-size: 0.68rem; font-weight: 700; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); padding: 1px 7px; border-radius: 999px;">Google Maps Integrado</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0.2rem 0 0.1rem 0; color: #ffffff; letter-spacing: -0.01em;">Centro de Inteligência Territorial • 60 Escolas</h2>
            <p style="margin: 0; font-size: 0.8rem; color: #cbd5e1;">
              Delimitação estrita da URE Itapevi (Itapevi, Barueri, Jandira e Pirapora do Bom Jesus) com camadas do Google Maps e rotas GPS.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn-visitas-action" onclick="abrirCarroOficial()" style="background: #f09b0c; color: #ffffff; border: none; padding: 0.45rem 0.95rem; border-radius: 7px; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 6px rgba(240,155,12,0.35);">
              <span>🚗</span> Solicitar Carro Oficial
            </button>
            <button type="button" class="btn-visitas-action" onclick="abrirVisitas()" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.22); padding: 0.45rem 0.85rem; border-radius: 7px; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 5px;">
              <span>✔️</span> Visitas
            </button>
            <button type="button" class="btn-visitas-action" onclick="abrirEscolas()" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.22); padding: 0.45rem 0.85rem; border-radius: 7px; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 5px;">
              <span>🏫</span> Escolas
            </button>
          </div>
        </div>

        <!-- LAYOUT SPLIT COMMAND CENTER: COLUNA DE GESTÃO + COLUNA DE MAPA GOOGLE -->
        <div style="display: grid; grid-template-columns: 360px 1fr; gap: 1rem; align-items: start;">

          <!-- COLUNA ESQUERDA: LISTA DE ESCOLAS, BUSCA E FILTROS RÁPIDOS -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; height: 580px;">
            
            <!-- Campo de Busca Instantânea -->
            <div style="position: relative; margin-bottom: 0.75rem;">
              <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.84rem; color: #94a3b8;">🔍</span>
              <input type="text" id="mapa-search-input" placeholder="Buscar por escola, CIE ou bairro..." oninput="buscarNoMapaRede(this.value)" style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2rem; border: 1.5px solid #cbd5e1; border-radius: 7px; font-size: 0.8rem; outline: none; background: #f8fafc;">
            </div>

            <!-- Abas de Município da URE -->
            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 0.65rem;" id="mapa-filter-municipios">
              <button type="button" class="btn-inv-filter active" id="map-pill-todas" onclick="filtrarMapaPorMunicipio('todas', this)" style="padding: 4px 9px; font-size: 11px;">
                Todas <span class="filter-count-badge" id="map-cnt-todas">60</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-itapevi" onclick="filtrarMapaPorMunicipio('Itapevi', this)" style="padding: 4px 9px; font-size: 11px;">
                Itapevi <span class="filter-count-badge" id="map-cnt-itapevi">25</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-barueri" onclick="filtrarMapaPorMunicipio('Barueri', this)" style="padding: 4px 9px; font-size: 11px;">
                Barueri <span class="filter-count-badge" id="map-cnt-barueri">19</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-jandira" onclick="filtrarMapaPorMunicipio('Jandira', this)" style="padding: 4px 9px; font-size: 11px;">
                Jandira <span class="filter-count-badge" id="map-cnt-jandira">14</span>
              </button>
              <button type="button" class="btn-inv-filter" id="map-pill-pirapora" onclick="filtrarMapaPorMunicipio('Pirapora', this)" style="padding: 4px 9px; font-size: 11px;">
                Pirapora <span class="filter-count-badge" id="map-cnt-pirapora">2</span>
              </button>
            </div>

            <!-- Filtros de Visitas da Dirigente -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; padding-bottom: 0.65rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.65rem;">
              <div style="display: flex; gap: 5px;">
                <button type="button" class="btn-inv-filter" id="map-pill-visitadas" onclick="filtrarMapaPorVisita('visitadas', this)" style="padding: 3px 8px; font-size: 10.5px;">
                  🟢 Visitadas <span class="filter-count-badge" id="map-cnt-visitadas">54</span>
                </button>
                <button type="button" class="btn-inv-filter" id="map-pill-pendentes" onclick="filtrarMapaPorVisita('pendentes', this)" style="padding: 3px 8px; font-size: 10.5px;">
                  🟠 Pendentes <span class="filter-count-badge" id="map-cnt-pendentes">6</span>
                </button>
              </div>
              <span id="mapa-status-exibicao" style="font-size: 11px; font-weight: 700; color: #0b2351; white-space: nowrap;">60 escolas</span>
            </div>

            <!-- Lista Scrollável de Escolas Filtradas com Distância até a Sede -->
            <div id="mapa-lista-escolas-container" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
              <!-- Cards gerados dinamicamente via JS -->
            </div>

          </div>

          <!-- COLUNA DIREITA: MAPA GOOGLE MAPS DELIMITADO & CAMADAS -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
            
            <!-- Barra Superior Flutuante de Camadas Google Maps & Ações Rápidas -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
              <!-- Seletor de Camadas Google Maps -->
              <div style="display: flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 8px;">
                <button type="button" id="btn-camada-google-ruas" class="btn-inv-filter active" onclick="alternarCamadaMapa('ruas', this)" style="padding: 4px 10px; font-size: 11px; border: none; border-radius: 6px;">
                  🗺️ Google Ruas
                </button>
                <button type="button" id="btn-camada-google-satelite" class="btn-inv-filter" onclick="alternarCamadaMapa('satelite', this)" style="padding: 4px 10px; font-size: 11px; border: none; border-radius: 6px;">
                  🛰️ Google Satélite
                </button>
                <button type="button" id="btn-camada-google-transito" class="btn-inv-filter" onclick="alternarCamadaMapa('transito', this)" style="padding: 4px 10px; font-size: 11px; border: none; border-radius: 6px;">
                  🚗 Trânsito ao Vivo
                </button>
              </div>

              <!-- Ações Rápidas de Foco Territorial -->
              <div style="display: flex; gap: 5px;">
                <button type="button" class="btn-inv-filter" onclick="focarSedeDiretoriaMapa()" title="Centralizar na Sede da Diretoria de Ensino" style="padding: 4px 9px; font-size: 11px;">
                  🏛️ Sede URE
                </button>
                <button type="button" class="btn-inv-filter" onclick="resetarVisualizacaoMapaRede()" title="Enquadrar toda a URE Itapevi" style="padding: 4px 9px; font-size: 11px;">
                  🔄 Focar Região
                </button>
                <a href="https://www.google.com/maps/search/Diretoria+de+Ensino+Itapevi" target="_blank" rel="noopener noreferrer" class="btn-inv-filter" title="Abrir visualização completa no site do Google Maps" style="padding: 4px 9px; font-size: 11px; text-decoration: none; color: #1e40af; background: #eff6ff; border-color: #bfdbfe;">
                  ↗️ Google Maps
                </a>
              </div>
            </div>

            <!-- CONTAINER DO MAPA DELIMITADO (URE ITAPEVI FOCUS) -->
            <div style="position: relative; width: 100%; height: 520px; border-radius: 10px; overflow: hidden; border: 1.5px solid #cbd5e1; background: #e2e8f0;">
              <div id="mapa-container-leaflet" style="width: 100%; height: 100%; z-index: 1;"></div>
            </div>

            <!-- Legenda Compacta no Rodapé -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; margin-top: 0.5rem; padding: 0 4px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="display: flex; align-items: center; gap: 4px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
                  <b>Verde:</b> Visitada
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></span>
                  <b>Laranja:</b> Pendente
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #0284c7;"></span>
                  <b>Azul:</b> Sede URE Itapevi
                </span>
              </div>
              <span style="color: #94a3b8; font-size: 10.5px;">Área Restrita: URE Itapevi • Camadas Google Maps</span>
            </div>

          </div>

        </div>

      </section>`;

if (oldPaneMapasRegex.test(content)) {
  content = content.replace(oldPaneMapasRegex, newPaneMapasHtml);
  console.log('1. Layout HTML Split Command Center inserido com sucesso.');
} else {
  console.error('ERRO: oldPaneMapasRegex não encontrado!');
  process.exit(1);
}

// 2. Substituir o bloco JS do mapa pelas camadas Google Maps reais e lógica de foco estrito
const oldJsRegex = /\/\* ========================================================\s*MÓDULO: MAPA GEOGRÁFICO DA REDE ESCOLAR \(URE ITAPEVI\)[\s\S]*?window\.resetarVisualizacaoMapaRede = resetarVisualizacaoMapaRede;/;

const newJsCode = `/* ========================================================
       MÓDULO: MAPA GEOGRÁFICO DA REDE ESCOLAR (URE ITAPEVI)
       Leaflet + Camadas Google Maps Reais + Delimitação Territorial
       ======================================================== */
    let mapaRedeInstancia = null;
    let marcadoresEscolasMapa = [];
    let camadaGoogleAtual = null;
    let camadaGoogleTrafegoOverlay = null;
    let tipoCamadaGoogleAtiva = 'ruas';
    let filtroMapaMunicipioAtivo = 'todas';
    let filtroMapaVisitaAtivo = 'todas';

    // Bounding Box Estrita da Região da URE Itapevi (Itapevi, Barueri, Jandira, Pirapora)
    const LIMITES_URE_ITAPEVI = [
      [-23.6050, -47.0450], // Sudoeste (limite de Itapevi com São Roque)
      [-23.3750, -46.7900]  // Nordeste (limite de Barueri e Pirapora com Santana de Parnaíba)
    ];

    // Centro regional exato entre os 4 municípios
    const CENTRO_REGIONAL_URE = [-23.5350, -46.9150];

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

    const COORDENADA_SEDE_DIRETORIA = [-23.5415, -46.9385];

    // Cálculo de distância haversine em km a partir da sede
    function calcularDistanciaSedeKm(coords) {
      if (!coords) return 0;
      const R = 6371; // km
      const dLat = (coords[0] - COORDENADA_SEDE_DIRETORIA[0]) * Math.PI / 180;
      const dLon = (coords[1] - COORDENADA_SEDE_DIRETORIA[1]) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(COORDENADA_SEDE_DIRETORIA[0] * Math.PI / 180) * Math.cos(coords[0] * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return (R * c).toFixed(1).replace('.', ',');
    }

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

    function alternarCamadaMapa(tipo, btnEl) {
      if (!mapaRedeInstancia || typeof L === 'undefined') return;
      tipoCamadaGoogleAtiva = tipo;

      document.querySelectorAll('#pane-mapas div[style*="f1f5f9"] button').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');

      if (camadaGoogleAtual) {
        mapaRedeInstancia.removeLayer(camadaGoogleAtual);
      }
      if (camadaGoogleTrafegoOverlay) {
        mapaRedeInstancia.removeLayer(camadaGoogleTrafegoOverlay);
        camadaGoogleTrafegoOverlay = null;
      }

      let tileUrl = '';
      if (tipo === 'satelite') {
        // Google Satélite Híbrido (fotos de satélite com nomes de ruas e avenidas)
        tileUrl = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        camadaGoogleAtual = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }).addTo(mapaRedeInstancia);
      } else if (tipo === 'transito') {
        // Google Maps Ruas com Camada de Trânsito ao Vivo
        tileUrl = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}';
        camadaGoogleAtual = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '&copy; Google Maps • Trânsito em Tempo Real'
        }).addTo(mapaRedeInstancia);
      } else {
        // Google Maps Ruas Padrão (Oficial Google)
        tileUrl = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        camadaGoogleAtual = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }).addTo(mapaRedeInstancia);
      }
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
        // Delimitação restrita à URE Itapevi
        const limitesMaximos = L.latLngBounds(LIMITES_URE_ITAPEVI);

        mapaRedeInstancia = L.map('mapa-container-leaflet', {
          center: CENTRO_REGIONAL_URE,
          zoom: 12,
          minZoom: 11,
          maxZoom: 18,
          maxBounds: limitesMaximos,
          maxBoundsViscosity: 0.9,
          zoomControl: true
        });

        // Camada inicial padrão: Google Maps Ruas
        alternarCamadaMapa('ruas', document.getElementById('btn-camada-google-ruas'));

        // Marcador Especial: Sede da Diretoria de Ensino (URE Itapevi)
        const iconeSede = criarIconeMarcadorMapa('#0284c7', '🏛️');
        if (iconeSede) {
          L.marker(COORDENADA_SEDE_DIRETORIA, { icon: iconeSede })
            .addTo(mapaRedeInstancia)
            .bindPopup(
              '<div style="font-family: inherit; padding: 4px; min-width: 220px;">' +
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

    function focarSedeDiretoriaMapa() {
      if (mapaRedeInstancia) {
        mapaRedeInstancia.setView(COORDENADA_SEDE_DIRETORIA, 15);
      }
    }

    function focarEscolaNoMapaPorCie(cie) {
      if (!mapaRedeInstancia) return;
      const coords = COORDENADAS_REDE_ESCOLAS[cie];
      if (!coords) return;

      mapaRedeInstancia.flyTo(coords, 16, { animate: true, duration: 0.8 });
      const markerObj = marcadoresEscolasMapa.find(m => m.cieEscola === cie);
      if (markerObj) {
        setTimeout(() => markerObj.openPopup(), 450);
      }
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

      // Renderizar Cards na Lista Lateral da Esquerda
      const listaContainer = document.getElementById('mapa-lista-escolas-container');
      if (listaContainer) {
        if (escolasFiltradas.length === 0) {
          listaContainer.innerHTML = '<div style="text-align: center; color: #94a3b8; font-size: 0.78rem; padding: 2rem 0.5rem;">Nenhuma escola encontrada com este filtro.</div>';
        } else {
          listaContainer.innerHTML = escolasFiltradas.map(e => {
            const isVis = visitasRegistro[e.id] && visitasRegistro[e.id].visitada;
            const distKm = calcularDistanciaSedeKm(COORDENADAS_REDE_ESCOLAS[e.cie]);
            const borderLeft = isVis ? '3.5px solid #10b981' : '3.5px solid #f59e0b';
            return '<div onclick="focarEscolaNoMapaPorCie(\\' + e.cie + \\')" style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: ' + borderLeft + '; border-radius: 8px; padding: 7px 9px; cursor: pointer; transition: all 0.15s ease;" onmouseenter="this.style.background=\\'#f1f5f9\\'" onmouseleave="this.style.background=\\'#f8fafc\\'">' +
              '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;">' +
                '<strong style="font-size: 0.8rem; color: #0b2351; line-height: 1.2;">' + e.nome + '</strong>' +
                '<span style="font-size: 9.5px; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: ' + (isVis ? '#dcfce7' : '#fef3c7') + '; color: ' + (isVis ? '#047857' : '#b45309') + '; white-space: nowrap;">' + (isVis ? 'Visitada' : 'Pendente') + '</span>' +
              '</div>' +
              '<div style="font-size: 0.71rem; color: #64748b; margin-top: 2px;">CIE ' + (e.cie || '---') + ' • ' + e.cidade + '</div>' +
              '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3px; font-size: 0.68rem; color: #475569;">' +
                '<span>📍 ' + distKm + ' km da Sede</span>' +
                '<span style="color: #0284c7; font-weight: 700;">Ver no Mapa ➔</span>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      }

      // Renderizar Marcadores e Popups no Mapa
      escolasFiltradas.forEach(e => {
        const coords = COORDENADAS_REDE_ESCOLAS[e.cie];
        if (!coords) return;

        const isVis = visitasRegistro[e.id] && visitasRegistro[e.id].visitada;
        const iconUsado = isVis ? iconVerde : iconLaranja;
        const distKm = calcularDistanciaSedeKm(coords);

        const gmapsDirUrl = 'https:' + String.fromCharCode(47, 47) + 'www.google.com/maps/dir/?api=1&destination=' +
          encodeURIComponent(e.nome + ', ' + (e.bairro || '') + ', ' + e.cidade + ' - SP');

        const popupContent =
          '<div style="font-family: inherit; min-width: 250px; max-width: 310px; padding: 2px;">' +
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
            '<div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #475569; background: #f8fafc; padding: 5px 8px; border-radius: 6px; margin-bottom: 6px; border: 1px solid #e2e8f0;">' +
              '<div><b>Dir:</b> ' + (e.diretor || 'Equipe Gestora') + '</div>' +
              '<div><b>Tel:</b> ' + (e.telefone || '---') + '</div>' +
            '</div>' +
            '<div style="font-size: 0.69rem; color: #0369a1; font-weight: 700; margin-bottom: 7px; background: #f0f9ff; padding: 3px 6px; border-radius: 4px; text-align: center;">' +
              '📏 Aprox. ' + distKm + ' km da Sede da Diretoria de Ensino' +
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

        marker.cieEscola = e.cie;
        marcadoresEscolasMapa.push(marker);
      });

      const statusEl = document.getElementById('mapa-status-exibicao');
      if (statusEl) {
        statusEl.innerText = escolasFiltradas.length + ' de ' + listaEscolas.length + ' escolas';
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
      document.querySelectorAll('#mapa-filter-municipios button').forEach(btn => btn.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');

      renderizarMarcadoresNoMapa(document.getElementById('mapa-search-input') ? document.getElementById('mapa-search-input').value : '');

      if (mapaRedeInstancia) {
        if (mun === 'Itapevi') mapaRedeInstancia.flyTo([-23.548, -46.932], 13);
        else if (mun === 'Barueri') mapaRedeInstancia.flyTo([-23.511, -46.876], 13);
        else if (mun === 'Jandira') mapaRedeInstancia.flyTo([-23.528, -46.903], 14);
        else if (mun === 'Pirapora') mapaRedeInstancia.flyTo([-23.405, -46.990], 13);
        else mapaRedeInstancia.flyTo(CENTRO_REGIONAL_URE, 12);
      }
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

      document.querySelectorAll('#mapa-filter-municipios button').forEach(b => b.classList.remove('active'));
      const bTodas = document.getElementById('map-pill-todas');
      if (bTodas) bTodas.classList.add('active');

      const bVis = document.getElementById('map-pill-visitadas');
      const bPend = document.getElementById('map-pill-pendentes');
      if (bVis) bVis.classList.remove('active');
      if (bPend) bPend.classList.remove('active');

      renderizarMarcadoresNoMapa();
      if (mapaRedeInstancia) {
        mapaRedeInstancia.flyTo(CENTRO_REGIONAL_URE, 12);
      }
    }

    window.abrirMapaRede = abrirMapaRede;
    window.alternarCamadaMapa = alternarCamadaMapa;
    window.focarSedeDiretoriaMapa = focarSedeDiretoriaMapa;
    window.focarEscolaNoMapaPorCie = focarEscolaNoMapaPorCie;
    window.filtrarMapaPorMunicipio = filtrarMapaPorMunicipio;
    window.filtrarMapaPorVisita = filtrarMapaPorVisita;
    window.buscarNoMapaRede = buscarNoMapaRede;
    window.resetarVisualizacaoMapaRede = resetarVisualizacaoMapaRede;`;

if (oldJsRegex.test(content)) {
  content = content.replace(oldJsRegex, newJsCode);
  console.log('2. Módulo JS com camadas Google Maps reais e limites da URE inserido com sucesso.');
} else {
  console.error('ERRO: oldJsRegex não encontrado!');
  process.exit(1);
}

// Normalizar quebras de linha para LF com BOM UTF-8
content = content.replace(/\r\n/g, '\n');
fs.writeFileSync(filePath, '\ufeff' + content.replace(/^\ufeff/, ''), 'utf8');
console.log('index.html atualizado com sucesso com a nova experiência Google Maps URE Itapevi!');
