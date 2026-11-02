const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetSection = `        </div>

      </section>

    </div>
  </main>`;

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
      </section>`;

const replacement = `        </div>

      </section>
${paneMapasHtml}
    </div>
  </main>`;

if (content.includes(targetSection)) {
  content = content.replace(targetSection, replacement);
  console.log('Seção pane-mapas inserida com sucesso!');
} else {
  console.error('ERRO: targetSection não encontrado!');
  process.exit(1);
}

content = content.replace(/\r\n/g, '\n');
fs.writeFileSync(filePath, '\ufeff' + content.replace(/^\ufeff/, ''), 'utf8');
console.log('index.html salvo com sucesso.');
