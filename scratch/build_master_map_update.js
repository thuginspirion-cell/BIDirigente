const fs = require('fs');

const coords = JSON.parse(fs.readFileSync('scratch/coords_60.json', 'utf8'));
const coordsStringified = JSON.stringify(coords, null, 4);

let html = fs.readFileSync('index.html', 'utf8');

// 1. UPDATE SECTION pane-mapas
const sectionStart = html.indexOf('<section id="pane-mapas"');
const sectionEnd = html.indexOf('</section>', sectionStart) + '</section>'.length;

if (sectionStart === -1 || sectionEnd === -1) {
  console.error('Section pane-mapas não encontrada!');
  process.exit(1);
}

const novoSectionMapas = `      <section id="pane-mapas" class="view-pane">

        <style>
          .card-escola-mapa {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 7px 9px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .card-escola-mapa:hover {
            background: #f1f5f9;
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .card-escola-mapa.ativo {
            background: #e0f2fe !important;
            border-color: #0284c7 !important;
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2) !important;
          }
        </style>

        <!-- HEADER PRINCIPAL EXECUTIVO COM RIBBON DE KPIS TERRITORIAIS -->
        <div style="background: linear-gradient(135deg, #0b2351 0%, #173877 100%); border-radius: 12px; padding: 1.15rem 1.5rem; margin-bottom: 0.85rem; color: #ffffff; box-shadow: 0 4px 14px rgba(11,35,81,0.12); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #f09b0c; letter-spacing: 0.06em; text-transform: uppercase;">DIRETORIA REGIONAL DE ENSINO • URE ITAPEVI</span>
              <span style="font-size: 0.68rem; font-weight: 700; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); padding: 1px 7px; border-radius: 999px;">Google Maps Corporativo</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0.2rem 0 0 0; color: #ffffff; letter-spacing: -0.02em;">Centro de Inteligência Territorial • 60 Escolas</h2>
            <p style="margin: 0.15rem 0 0 0; font-size: 0.8rem; color: #cbd5e1; opacity: 0.95;">
              Delimitação operacional da URE Itapevi (Itapevi, Barueri, Jandira e Pirapora do Bom Jesus) com camadas oficiais Google Maps e rotas GPS.
            </p>
          </div>

          <!-- BOTÕES RÁPIDOS DA GESTÃO -->
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" onclick="abrirCarroOficial();" style="display: inline-flex; align-items: center; gap: 6px; background: #f09b0c; color: #ffffff; border: none; padding: 7px 14px; border-radius: 8px; font-weight: 700; font-size: 0.78rem; cursor: pointer; box-shadow: 0 2px 6px rgba(240,155,12,0.3); transition: all 0.2s ease;">
              <span>🚗 Solicitar Carro Oficial</span>
            </button>
            <button type="button" onclick="abrirVisitas();" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); padding: 7px 12px; border-radius: 8px; font-weight: 600; font-size: 0.78rem; cursor: pointer; transition: all 0.2s ease;">
              <span>📝 Visitas</span>
            </button>
            <button type="button" onclick="abrirEscolaPorCie(''); abrirEscolas();" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); padding: 7px 12px; border-radius: 8px; font-weight: 600; font-size: 0.78rem; cursor: pointer; transition: all 0.2s ease;">
              <span>🏫 Escolas</span>
            </button>
          </div>
        </div>

        <!-- RIBBON EXECUTIVO DE KPIS TERRITORIAIS (VISÃO ANALÍTICA SÊNIOR) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.65rem; margin-bottom: 0.85rem;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 0.9rem; display: flex; align-items: center; gap: 0.7rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🏫</div>
            <div>
              <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Unidades na Rede</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #0b2351; line-height: 1.2;">60 Escolas <span style="font-size: 0.68rem; color: #10b981; font-weight: 700;">(100% Pessoal/Ativa)</span></div>
            </div>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 0.9rem; display: flex; align-items: center; gap: 0.7rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🏛️</div>
            <div>
              <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Sede da URE</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #0b2351; line-height: 1.2;">Itapevi <span style="font-size: 0.68rem; color: #64748b; font-weight: 600;">(Av. Pres. Vargas, 900)</span></div>
            </div>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 0.9rem; display: flex; align-items: center; gap: 0.7rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #dcfce7; color: #047857; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">📏</div>
            <div>
              <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Raio de Atendimento</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #0b2351; line-height: 1.2;">~24,8 km <span style="font-size: 0.68rem; color: #64748b; font-weight: 600;">(Pirapora ao Norte)</span></div>
            </div>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 0.9rem; display: flex; align-items: center; gap: 0.7rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #f1f5f9; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🚦</div>
            <div>
              <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Malha Rodoviária</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #0b2351; line-height: 1.2;">SP-280 & SP-274 <span style="font-size: 0.68rem; color: #0284c7; font-weight: 700;">(Tráfego Ativo)</span></div>
            </div>
          </div>
        </div>

        <!-- SPLIT COMMAND CENTER: COLUNA ESQUERDA (BUSCA & ESCOLAS) + COLUNA DIREITA (GOOGLE MAPS) -->
        <div style="display: flex; gap: 0.9rem; align-items: stretch; flex-wrap: wrap;">

          <!-- COLUNA ESQUERDA: LISTA EXECUTIVA DE UNIDADES ESCOLARES -->
          <div style="width: 360px; min-width: 320px; flex-shrink: 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; height: 570px;">
            
            <!-- BARRA DE PESQUISA SUPERIOR -->
            <div style="padding: 0.85rem 0.9rem 0.6rem 0.9rem; border-bottom: 1px solid #f1f5f9;">
              <div style="position: relative;">
                <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.82rem; color: #94a3b8;">🔍</span>
                <input type="text" id="mapa-search-input" placeholder="Buscar por escola, CIE ou bairro..." oninput="buscarNoMapaRede(this.value);" style="width: 100%; box-sizing: border-box; padding: 7px 10px 7px 30px; font-size: 0.78rem; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.15s ease;" onfocus="this.style.borderColor='#0284c7'" onblur="this.style.borderColor='#cbd5e1'" />
              </div>

              <!-- PILLS DE FILTROS POR MUNICÍPIO -->
              <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 0.55rem;">
                <button type="button" id="map-pill-todas" onclick="filtrarMapaPorMunicipio('todas', this);" class="btn-filter-pill active" style="font-size: 10.5px; padding: 3px 8px; border-radius: 999px; border: 1px solid #cbd5e1; background: #0284c7; color: #ffffff; cursor: pointer; font-weight: 700;">Todas 60</button>
                <button type="button" id="map-pill-itapevi" onclick="filtrarMapaPorMunicipio('Itapevi', this);" class="btn-filter-pill" style="font-size: 10.5px; padding: 3px 8px; border-radius: 999px; border: 1px solid #cbd5e1; background: #f8fafc; color: #475569; cursor: pointer; font-weight: 600;">Itapevi 25</button>
                <button type="button" id="map-pill-barueri" onclick="filtrarMapaPorMunicipio('Barueri', this);" class="btn-filter-pill" style="font-size: 10.5px; padding: 3px 8px; border-radius: 999px; border: 1px solid #cbd5e1; background: #f8fafc; color: #475569; cursor: pointer; font-weight: 600;">Barueri 19</button>
                <button type="button" id="map-pill-jandira" onclick="filtrarMapaPorMunicipio('Jandira', this);" class="btn-filter-pill" style="font-size: 10.5px; padding: 3px 8px; border-radius: 999px; border: 1px solid #cbd5e1; background: #f8fafc; color: #475569; cursor: pointer; font-weight: 600;">Jandira 14</button>
                <button type="button" id="map-pill-pirapora" onclick="filtrarMapaPorMunicipio('Pirapora', this);" class="btn-filter-pill" style="font-size: 10.5px; padding: 3px 8px; border-radius: 999px; border: 1px solid #cbd5e1; background: #f8fafc; color: #475569; cursor: pointer; font-weight: 600;">Pirapora 2</button>
              </div>

              <!-- FILTRO STATUS DE VISITAÇÃO & CONTADOR -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 11px;">
                <div style="display: flex; gap: 4px;">
                  <button type="button" id="map-vis-todas" onclick="filtrarMapaPorVisita('todas', this);" style="background: #e2e8f0; color: #1e293b; border: none; padding: 2px 6px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 10px;">Todas</button>
                  <button type="button" id="map-vis-visitadas" onclick="filtrarMapaPorVisita('visitadas', this);" style="background: #f1f5f9; color: #047857; border: 1px solid #d1fae5; padding: 2px 6px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 10px;">● Visitadas</button>
                  <button type="button" id="map-vis-pendentes" onclick="filtrarMapaPorVisita('pendentes', this);" style="background: #f1f5f9; color: #b45309; border: 1px solid #fef3c7; padding: 2px 6px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 10px;">▲ Pendentes</button>
                </div>
                <span id="mapa-status-exibicao" style="font-weight: 700; color: #64748b; font-size: 10.5px;">60 de 60 escolas</span>
              </div>
            </div>

            <!-- LISTAGEM COM ROLAGEM SUAVE DAS ESCOLAS -->
            <div id="mapa-lista-escolas-container" style="flex: 1; overflow-y: auto; padding: 0.6rem; display: flex; flex-direction: column; gap: 0.45rem;">
              <!-- Cards gerados via JS dinamicamente -->
            </div>

            <!-- RODAPÉ DA LISTA -->
            <div style="padding: 0.45rem 0.8rem; border-top: 1px solid #f1f5f9; background: #f8fafc; border-radius: 0 0 12px 12px; font-size: 10.5px; color: #64748b; display: flex; justify-content: space-between; align-items: center;">
              <span>💡 Clique na escola para focar no mapa</span>
              <span id="mapa-total-visitas-badge" style="font-weight: 700; color: #0284c7;">Diretoria de Ensino</span>
            </div>
          </div>

          <!-- COLUNA DIREITA: MAPA GOOGLE MAPS LEAFLET -->
          <div style="flex: 1; min-width: 480px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; height: 570px; overflow: hidden; position: relative;">
            
            <!-- BARRA DE FERRAMENTAS SUPERIOR DO MAPA (CAMADAS GOOGLE MAPS & CONTROLES) -->
            <div style="padding: 0.55rem 0.85rem; border-bottom: 1px solid #e2e8f0; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; z-index: 10;">
              
              <!-- SELETOR DE CAMADAS NATIVAS GOOGLE MAPS -->
              <div style="display: flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 8px;">
                <button type="button" id="btn-camada-google-ruas" onclick="alternarCamadaMapa('ruas', this);" class="btn-camada-mapa active" style="font-size: 11px; padding: 4px 10px; border-radius: 6px; border: none; background: #0284c7; color: #ffffff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                  <span>🗺️ Google Ruas</span>
                </button>
                <button type="button" id="btn-camada-google-sat" onclick="alternarCamadaMapa('satelite', this);" class="btn-camada-mapa" style="font-size: 11px; padding: 4px 10px; border-radius: 6px; border: none; background: transparent; color: #475569; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                  <span>🛰️ Google Satélite</span>
                </button>
                <button type="button" id="btn-camada-google-transito" onclick="alternarCamadaMapa('transito', this);" class="btn-camada-mapa" style="font-size: 11px; padding: 4px 10px; border-radius: 6px; border: none; background: transparent; color: #475569; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                  <span>🚗 Trânsito ao Vivo</span>
                </button>
              </div>

              <!-- AÇÕES RÁPIDAS DE FOCO E NAVEGAÇÃO -->
              <div style="display: flex; gap: 4px; align-items: center;">
                <button type="button" onclick="focarSedeDiretoriaMapa();" title="Centralizar na Sede da Diretoria de Ensino" style="font-size: 11px; padding: 4px 9px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                  <span>🏛️ Sede URE</span>
                </button>
                <button type="button" onclick="resetarVisualizacaoMapaRede();" title="Enquadrar todas as 60 escolas perfeitamente na tela" style="font-size: 11px; padding: 4px 9px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; color: #0284c7; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                  <span>🔄 Enquadrar Todas</span>
                </button>
                <a href="https://www.google.com/maps/search/?api=1&query=escolas+estaduais+itapevi+barueri+jandira+pirapora" target="_blank" rel="noopener noreferrer" style="font-size: 11px; padding: 4px 9px; border-radius: 6px; border: 1px solid #93c5fd; background: #eff6ff; color: #1d4ed8; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                  <span>↗️ Google Maps</span>
                </a>
              </div>

            </div>

            <!-- CONTAINER LEAFLET NATIVO -->
            <div id="mapa-container-leaflet" style="flex: 1; width: 100%; min-height: 480px; background: #f8fafc; z-index: 1;"></div>

            <!-- LEGENDA FLUTUANTE EM VIDRO (GLASSMORPHISM) -->
            <div style="padding: 0.4rem 0.85rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 11px; z-index: 10;">
              <div style="display: flex; gap: 12px; align-items: center;">
                <span style="display: flex; align-items: center; gap: 5px; color: #065f46; font-weight: 700;">
                  <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #10b981;"></span>
                  <b>Verde:</b> Visitada
                </span>
                <span style="display: flex; align-items: center; gap: 5px; color: #92400e; font-weight: 700;">
                  <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #f59e0b;"></span>
                  <b>Laranja:</b> Pendente
                </span>
                <span style="display: flex; align-items: center; gap: 5px; color: #0369a1; font-weight: 700;">
                  <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #0284c7;"></span>
                  <b>Azul:</b> Sede URE Itapevi
                </span>
              </div>
              <span style="color: #94a3b8; font-size: 10.5px;">Enquadramento Dinâmico • URE Itapevi • Google Maps</span>
            </div>

          </div>

        </div>

      </section>`;

html = html.slice(0, sectionStart) + novoSectionMapas + html.slice(sectionEnd);
console.log('1. Section pane-mapas atualizada com sucesso.');

// 2. ATUALIZAR O MÓDULO JS DO MAPA
const jsAnchorStart = html.indexOf('let mapaRedeInstancia = null;');
const jsAnchorEnd = html.indexOf('window.resetarVisualizacaoMapaRede = resetarVisualizacaoMapaRede;');
const jsReplaceEnd = html.indexOf('\n', jsAnchorEnd) + 1;

if (jsAnchorStart === -1 || jsAnchorEnd === -1) {
  console.error('Âncoras de JS não encontradas!');
  process.exit(1);
}

const novoModuloJS = `let mapaRedeInstancia = null;
    let marcadoresEscolasMapa = [];
    let camadaGoogleAtual = null;
    let camadaGoogleTrafegoOverlay = null;
    let tipoCamadaGoogleAtiva = 'ruas';
    let filtroMapaMunicipioAtivo = 'todas';
    let filtroMapaVisitaAtivo = 'todas';

    // Bounding Box com margem generosa da URE Itapevi (Itapevi, Barueri, Jandira, Pirapora do Bom Jesus)
    const LIMITES_URE_ITAPEVI = [
      [-23.6400, -47.1000],
      [-23.3200, -46.7400]
    ];

    // Centro regional exato entre os 4 municípios
    const CENTRO_REGIONAL_URE = [-23.5350, -46.9150];

    // Coordenadas geográficas oficiais das 60 escolas da Diretoria de Ensino de Itapevi
    const COORDENADAS_REDE_ESCOLAS = ` + coordsStringified + `;

    // Coordenada da Sede da Diretoria de Ensino Região de Itapevi
    const COORDENADA_SEDE_DIRETORIA = [-23.5488, -46.9341];

    function calcularDistanciaSedeKm(coords) {
      if (!coords || !coords[0] || !coords[1]) return '---';
      const R = 6371;
      const lat1 = COORDENADA_SEDE_DIRETORIA[0] * Math.PI / 180;
      const lat2 = coords[0] * Math.PI / 180;
      const dLat = (coords[0] - COORDENADA_SEDE_DIRETORIA[0]) * Math.PI / 180;
      const dLng = (coords[1] - COORDENADA_SEDE_DIRETORIA[1]) * Math.PI / 180;

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
        tileUrl = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        camadaGoogleAtual = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }).addTo(mapaRedeInstancia);
      } else if (tipo === 'transito') {
        tileUrl = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}';
        camadaGoogleAtual = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '&copy; Google Maps • Trânsito em Tempo Real'
        }).addTo(mapaRedeInstancia);
      } else {
        tileUrl = 'https:' + String.fromCharCode(47, 47) + 'mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        camadaGoogleAtual = L.tileLayer(tileUrl, {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }).addTo(mapaRedeInstancia);
      }
    }

    // ENQUADRA PERFEITAMENTE TODAS AS ESCOLAS SELECIONADAS NA TELA COM PADDING
    function enquadrarMapaParaEscolas(escolasArray) {
      if (!mapaRedeInstancia || typeof L === 'undefined') return;
      const pontos = [];
      const lista = (escolasArray && escolasArray.length > 0) ? escolasArray : listaEscolas;
      
      lista.forEach(e => {
        const pt = COORDENADAS_REDE_ESCOLAS[e.cie];
        if (pt) pontos.push(pt);
      });
      pontos.push(COORDENADA_SEDE_DIRETORIA);

      if (pontos.length === 0) return;
      const bounds = L.latLngBounds(pontos);

      mapaRedeInstancia.fitBounds(bounds, {
        paddingTopLeft: [50, 75],
        paddingBottomRight: [50, 50],
        maxZoom: 14,
        animate: true,
        duration: 0.6
      });
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
        const limitesMaximos = L.latLngBounds(LIMITES_URE_ITAPEVI);

        mapaRedeInstancia = L.map('mapa-container-leaflet', {
          center: CENTRO_REGIONAL_URE,
          zoom: 11,
          minZoom: 10,
          maxZoom: 19,
          maxBounds: limitesMaximos,
          maxBoundsViscosity: 0.75,
          zoomControl: true
        });

        alternarCamadaMapa('ruas', document.getElementById('btn-camada-google-ruas'));

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
              '</div></div>',
              {
                autoPan: true,
                autoPanPaddingTopLeft: L.point(25, 95),
                autoPanPaddingBottomRight: L.point(25, 30),
                keepInView: true
              }
            );
        }
      } else {
        mapaRedeInstancia.invalidateSize();
      }

      renderizarMarcadoresNoMapa();
      atualizarContadoresFiltrosMapa();

      setTimeout(() => {
        if (mapaRedeInstancia) {
          mapaRedeInstancia.invalidateSize();
          enquadrarMapaParaEscolas(listaEscolas);
        }
      }, 200);
    }

    function focarSedeDiretoriaMapa() {
      if (mapaRedeInstancia) {
        mapaRedeInstancia.flyTo(COORDENADA_SEDE_DIRETORIA, 15, { animate: true, duration: 0.7 });
      }
    }

    function focarEscolaNoMapaPorCie(cie) {
      if (!mapaRedeInstancia) return;
      const cieLimpo = String(cie || '').trim();
      const coords = COORDENADAS_REDE_ESCOLAS[cieLimpo];
      if (!coords) {
        console.warn('Coordenadas não encontradas para o CIE:', cieLimpo);
        return;
      }

      document.querySelectorAll('.card-escola-mapa').forEach(c => c.classList.remove('ativo'));
      const activeCard = document.getElementById('card-mapa-' + cieLimpo);
      if (activeCard) {
        activeCard.classList.add('ativo');
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Headroom de latitude para centralizar popup perfeitamente sem corte superior
      const latCentrado = coords[0] + 0.0035;
      const lngCentrado = coords[1];

      mapaRedeInstancia.flyTo([latCentrado, lngCentrado], 15, { animate: true, duration: 0.6 });

      const markerObj = marcadoresEscolasMapa.find(m => String(m.cieEscola) === cieLimpo);
      if (markerObj) {
        setTimeout(() => {
          markerObj.openPopup();
        }, 400);
      }
    }

    function renderizarMarcadoresNoMapa(termoBusca) {
      if (!mapaRedeInstancia || typeof L === 'undefined') return;

      marcadoresEscolasMapa.forEach(m => mapaRedeInstancia.removeLayer(m));
      marcadoresEscolasMapa = [];

      const termo = (termoBusca || '').trim().toLowerCase();
      let escolasFiltradas = listaEscolas.filter(e => {
        if (filtroMapaMunicipioAtivo !== 'todas') {
          if (filtroMapaMunicipioAtivo === 'Pirapora') {
            if (!e.cidade.includes('Pirapora')) return false;
          } else if (e.cidade !== filtroMapaMunicipioAtivo) {
            return false;
          }
        }

        const isVis = visitasRegistro[e.id] && visitasRegistro[e.id].visitada;
        if (filtroMapaVisitaAtivo === 'visitadas' && !isVis) return false;
        if (filtroMapaVisitaAtivo === 'pendentes' && isVis) return false;

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
            const cieStr = String(e.cie || '');
            
            return '<div class="card-escola-mapa" id="card-mapa-' + cieStr + '" data-cie="' + cieStr + '" onclick="focarEscolaNoMapaPorCie(this.dataset.cie)" style="border-left: ' + borderLeft + ';">' +
              '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;">' +
                '<strong style="font-size: 0.8rem; color: #0b2351; line-height: 1.2;">' + e.nome + '</strong>' +
                '<span style="font-size: 9.5px; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: ' + (isVis ? '#dcfce7' : '#fef3c7') + '; color: ' + (isVis ? '#047857' : '#b45309') + '; white-space: nowrap;">' + (isVis ? 'Visitada' : 'Pendente') + '</span>' +
              '</div>' +
              '<div style="font-size: 0.71rem; color: #64748b; margin-top: 2px;">CIE ' + cieStr + ' • ' + e.cidade + '</div>' +
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

        const gmapsStreetViewUrl = 'https:' + String.fromCharCode(47, 47) + 'www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + coords[0] + ',' + coords[1];

        const popupContent =
          '<div style="font-family: inherit; min-width: 260px; max-width: 320px; padding: 2px;">' +
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
                '<a href="' + gmapsStreetViewUrl + '" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; text-decoration: none; background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; padding: 5px 4px; border-radius: 6px; font-weight: 700; font-size: 0.71rem;">' +
                  '📷 Street View' +
                '</a>' +
                '<button type="button" onclick="abrirCarroOficial();" style="flex: 1; background: #f09b0c; color: #ffffff; border: none; padding: 5px 4px; border-radius: 6px; font-weight: 700; font-size: 0.71rem; cursor: pointer;">' +
                  '🚗 Agendar Carro' +
                '</button>' +
                '<button type="button" onclick="abrirEscolaPorCie(\\'' + e.cie + '\\');" style="flex: 1; background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 5px 4px; border-radius: 6px; font-weight: 700; font-size: 0.71rem; cursor: pointer;">' +
                  '🏫 Ficha' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>';

        const marker = L.marker(coords, { icon: iconUsado })
          .addTo(mapaRedeInstancia)
          .bindPopup(popupContent, {
            autoPan: true,
            autoPanPaddingTopLeft: L.point(25, 95),
            autoPanPaddingBottomRight: L.point(25, 30),
            keepInView: true,
            closeButton: true
          });

        marker.cieEscola = String(e.cie);
        marker.on('click', function() {
          const latCentrado = coords[0] + 0.0035;
          mapaRedeInstancia.panTo([latCentrado, coords[1]], { animate: true, duration: 0.4 });
          focarEscolaNoMapaPorCie(e.cie);
        });
        marcadoresEscolasMapa.push(marker);
      });

      const statusEl = document.getElementById('mapa-status-exibicao');
      if (statusEl) {
        statusEl.innerText = escolasFiltradas.length + ' de ' + listaEscolas.length + ' escolas';
      }
    }

    function filtrarMapaPorMunicipio(municipio, btnEl) {
      filtroMapaMunicipioAtivo = municipio;
      document.querySelectorAll('#pane-mapas .btn-filter-pill').forEach(b => {
        b.classList.remove('active');
        b.style.background = '#f8fafc';
        b.style.color = '#475569';
      });
      if (btnEl) {
        btnEl.classList.add('active');
        btnEl.style.background = '#0284c7';
        btnEl.style.color = '#ffffff';
      }
      renderizarMarcadoresNoMapa(document.getElementById('mapa-search-input')?.value);

      const filtradas = listaEscolas.filter(e => {
        if (municipio === 'todas') return true;
        if (municipio === 'Pirapora') return e.cidade.includes('Pirapora');
        return e.cidade === municipio;
      });
      enquadrarMapaParaEscolas(filtradas);
    }

    function filtrarMapaPorVisita(status, btnEl) {
      filtroMapaVisitaAtivo = status;
      document.querySelectorAll('#pane-mapas button[id^="map-vis-"]').forEach(b => {
        b.style.background = '#f1f5f9';
      });
      if (btnEl) btnEl.style.background = '#e2e8f0';
      renderizarMarcadoresNoMapa(document.getElementById('mapa-search-input')?.value);
    }

    function buscarNoMapaRede(termo) {
      renderizarMarcadoresNoMapa(termo);
    }

    function resetarVisualizacaoMapaRede() {
      filtroMapaMunicipioAtivo = 'todas';
      filtroMapaVisitaAtivo = 'todas';
      const searchInput = document.getElementById('mapa-search-input');
      if (searchInput) searchInput.value = '';

      const pillTodas = document.getElementById('map-pill-todas');
      if (pillTodas) {
        document.querySelectorAll('#pane-mapas .btn-filter-pill').forEach(b => {
          b.classList.remove('active');
          b.style.background = '#f8fafc';
          b.style.color = '#475569';
        });
        pillTodas.classList.add('active');
        pillTodas.style.background = '#0284c7';
        pillTodas.style.color = '#ffffff';
      }

      renderizarMarcadoresNoMapa();
      enquadrarMapaParaEscolas(listaEscolas);
    }

    function atualizarContadoresFiltrosMapa() {
      let totItapevi = 0, totBarueri = 0, totJandira = 0, totPirapora = 0;
      listaEscolas.forEach(e => {
        if (e.cidade === 'Itapevi') totItapevi++;
        else if (e.cidade === 'Barueri') totBarueri++;
        else if (e.cidade === 'Jandira') totJandira++;
        else if (e.cidade && e.cidade.includes('Pirapora')) totPirapora++;
      });

      const pItapevi = document.getElementById('map-pill-itapevi');
      if (pItapevi) pItapevi.innerText = 'Itapevi ' + totItapevi;
      const pBarueri = document.getElementById('map-pill-barueri');
      if (pBarueri) pBarueri.innerText = 'Barueri ' + totBarueri;
      const pJandira = document.getElementById('map-pill-jandira');
      if (pJandira) pJandira.innerText = 'Jandira ' + totJandira;
      const pPirapora = document.getElementById('map-pill-pirapora');
      if (pPirapora) pPirapora.innerText = 'Pirapora ' + totPirapora;
    }

    // Expor no escopo global
    window.abrirMapaRede = abrirMapaRede;
    window.inicializarOuAtualizarMapaRede = inicializarOuAtualizarMapaRede;
    window.alternarCamadaMapa = alternarCamadaMapa;
    window.focarSedeDiretoriaMapa = focarSedeDiretoriaMapa;
    window.focarEscolaNoMapaPorCie = focarEscolaNoMapaPorCie;
    window.filtrarMapaPorMunicipio = filtrarMapaPorMunicipio;
    window.filtrarMapaPorVisita = filtrarMapaPorVisita;
    window.buscarNoMapaRede = buscarNoMapaRede;
    window.resetarVisualizacaoMapaRede = resetarVisualizacaoMapaRede;
    window.enquadrarMapaParaEscolas = enquadrarMapaParaEscolas;`;

html = html.slice(0, jsAnchorStart) + novoModuloJS + html.slice(jsReplaceEnd);
console.log('2. Módulo JS do mapa atualizado com sucesso.');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html salvo com sucesso com 60 coordenadas reais!');
