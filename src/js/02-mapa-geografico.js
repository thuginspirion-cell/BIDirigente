    /* ========================================================
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

    /* Bounding Box com margem generosa da URE Itapevi (Itapevi, Barueri, Jandira, Pirapora do Bom Jesus) */
    const LIMITES_URE_ITAPEVI = [
      [-23.6400, -47.1000],
      [-23.3200, -46.7400]
    ];

    /* Centro regional exato entre os 4 municípios */
    const CENTRO_REGIONAL_URE = [-23.5350, -46.9150];

    /* Coordenadas geográficas oficiais das 60 escolas da Unidade Regional de Ensino de Itapevi */
    const COORDENADAS_REDE_ESCOLAS = {
    "149317": [
        -23.5562,
        -46.9465
    ],
    "290075": [
        -23.5284,
        -46.8631
    ],
    "352561": [
        -23.5715,
        -46.9525
    ],
    "496790": [
        -23.5185,
        -46.9152
    ],
    "902044": [
        -23.5625,
        -46.9365
    ],
    "908548": [
        -23.5478,
        -46.9515
    ],
    "908563": [
        -23.5325,
        -46.9185
    ],
    "908617": [
        -23.5398,
        -46.8762
    ],
    "908836": [
        -23.5338,
        -46.8682
    ],
    "910454": [
        -23.5515,
        -46.9395
    ],
    "910485": [
        -23.4891,
        -46.8215
    ],
    "918787": [
        -23.5452,
        -46.9078
    ],
    "918805": [
        -23.4925,
        -46.8528
    ],
    "920241": [
        -23.4875,
        -46.8235
    ],
    "921439": [
        -23.5565,
        -46.9315
    ],
    "921440": [
        -23.5195,
        -46.9135
    ],
    "923333": [
        -23.5262,
        -46.8995
    ],
    "923874": [
        -23.5535,
        -46.926
    ],
    "925834": [
        -23.4125,
        -46.9812
    ],
    "009787": [
        -23.5042,
        -46.8821
    ],
    "009799": [
        -23.5015,
        -46.8654
    ],
    "009830": [
        -23.4938,
        -46.8892
    ],
    "009878": [
        -23.5065,
        -46.8573
    ],
    "009891": [
        -23.5188,
        -46.8875
    ],
    "009912": [
        -23.5072,
        -46.8489
    ],
    "009921": [
        -23.5165,
        -46.8672
    ],
    "035440": [
        -23.5142,
        -46.8924
    ],
    "040548": [
        -23.4981,
        -46.8294
    ],
    "040551": [
        -23.5221,
        -46.8615
    ],
    "044921": [
        -23.5108,
        -46.8758
    ],
    "044933": [
        -23.5312,
        -46.8724
    ],
    "049025": [
        -23.5355,
        -46.8698
    ],
    "010364": [
        -23.5342,
        -46.9085
    ],
    "010376": [
        -23.5215,
        -46.8972
    ],
    "010397": [
        -23.5276,
        -46.9028
    ],
    "010649": [
        -23.5298,
        -46.9112
    ],
    "010662": [
        -23.5245,
        -46.9056
    ],
    "041373": [
        -23.5385,
        -46.9145
    ],
    "041385": [
        -23.5412,
        -46.8965
    ],
    "044817": [
        -23.5368,
        -46.9015
    ],
    "049013": [
        -23.5238,
        -46.9092
    ],
    "010388": [
        -23.5432,
        -46.9285
    ],
    "010424": [
        -23.5365,
        -46.9198
    ],
    "010431": [
        -23.5582,
        -46.9412
    ],
    "010443": [
        -23.5645,
        -46.9785
    ],
    "010467": [
        -23.5485,
        -46.9322
    ],
    "010479": [
        -23.5512,
        -46.9945
    ],
    "010480": [
        -23.5525,
        -46.9245
    ],
    "010613": [
        -23.5445,
        -46.9365
    ],
    "010650": [
        -23.5415,
        -46.9385
    ],
    "043886": [
        -23.5468,
        -46.9825
    ],
    "046607": [
        -23.5528,
        -46.992
    ],
    "048161": [
        -23.5595,
        -46.9398
    ],
    "048173": [
        -23.5615,
        -46.9275
    ],
    "048975": [
        -23.5395,
        -46.9455
    ],
    "048999": [
        -23.5542,
        -46.9485
    ],
    "011778": [
        -23.5492,
        -46.934
    ],
    "011779": [
        -23.5458,
        -46.931
    ],
    "011780": [
        -23.547,
        -46.9355
    ],
    "043333": [
        -23.3955,
        -46.9985
    ]
};

    /* Coordenada da Sede da Unidade Regional de Ensino de Itapevi */
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

    /* ENQUADRA PERFEITAMENTE TODAS AS ESCOLAS SELECIONADAS NA TELA COM PADDING */
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

        const iconeUre = (typeof L !== 'undefined') ? L.divIcon({
          className: 'custom-map-pin ure-main-pin',
          html: '<div style="position: relative; width: 34px; height: 34px;">' +
            '<div style="position: absolute; bottom: 38px; left: 50%; transform: translateX(-50%); background: #0284c7; color: #ffffff; border: 1.5px solid #ffffff; border-radius: 999px; padding: 2px 8px; font-size: 10.5px; font-weight: 800; white-space: nowrap; box-shadow: 0 3px 10px rgba(2,132,199,0.45); letter-spacing: 0.02em;">URE Itapevi</div>' +
            '<div style="background: #0284c7; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(2,132,199,0.55); border: 2.5px solid #ffffff;"><span style="transform: rotate(45deg); font-size: 15px; line-height: 1;">🏛️</span></div>' +
          '</div>',
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -36]
        }) : null;
        if (iconeUre) {
          window._marcadorUreMapa = L.marker(COORDENADA_SEDE_DIRETORIA, { icon: iconeUre, zIndexOffset: 2000, riseOnHover: true })
            .addTo(mapaRedeInstancia)
            .bindPopup(
              '<div style="font-family: inherit; padding: 4px; min-width: 220px;">' +
              '<span style="font-size: 0.68rem; font-weight: 800; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">URE ITAPEVI</span>' +
              '<h4 style="margin: 4px 0 2px 0; font-size: 0.95rem; font-weight: 800; color: #0b2351;">Unidade Regional de Ensino • URE Itapevi</h4>' +
              '<p style="margin: 0; font-size: 0.74rem; color: #64748b;">Av. Presidente Vargas, 900 - Vila Nova Itapevi, Itapevi - SP</p>' +
              '<div style="margin-top: 8px;">' +
              '<a href="https:' + String.fromCharCode(47, 47) + 'www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Unidade Regional de Ensino de Itapevi') + '" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #0b2351; color: #ffffff; text-decoration: none; padding: 5px 8px; border-radius: 6px; font-weight: 700; font-size: 0.72rem;">' +
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
        if (window._marcadorUreMapa) {
          setTimeout(function() { window._marcadorUreMapa.openPopup(); }, 350);
        }
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

      /* Headroom de latitude para centralizar popup perfeitamente sem corte superior */
      const latCentrado = coords[0] + 0.0035;
      const lngCentrado = coords[1];

      mapaRedeInstancia.flyTo([latCentrado, lngCentrado], 15, { animate: true, duration: 0.35 });

      const markerObj = marcadoresEscolasMapa.find(m => String(m.cieEscola) === cieLimpo);
      if (markerObj) {
        setTimeout(() => {
          markerObj.openPopup();
        }, 280);
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

      /* Renderizar Cards na Lista Lateral da Esquerda */
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
                '<span>📍 ' + distKm + ' km da URE</span>' +
                '<span style="color: #0284c7; font-weight: 700;">Ver no Mapa ➔</span>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      }

      /* Renderizar Marcadores e Popups no Mapa */
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
              '📏 Aprox. ' + distKm + ' km da URE Itapevi' +
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
                '<button type="button" onclick="abrirEscolaPorCie(\'' + e.cie + '\');" style="flex: 1; background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 5px 4px; border-radius: 6px; font-weight: 700; font-size: 0.71rem; cursor: pointer;">' +
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

    /* Expor no escopo global */
    window.abrirMapaRede = abrirMapaRede;
    window.inicializarOuAtualizarMapaRede = inicializarOuAtualizarMapaRede;
    window.alternarCamadaMapa = alternarCamadaMapa;
    window.focarSedeDiretoriaMapa = focarSedeDiretoriaMapa;
    window.focarEscolaNoMapaPorCie = focarEscolaNoMapaPorCie;
    window.filtrarMapaPorMunicipio = filtrarMapaPorMunicipio;
    window.filtrarMapaPorVisita = filtrarMapaPorVisita;
    window.buscarNoMapaRede = buscarNoMapaRede;
    window.resetarVisualizacaoMapaRede = resetarVisualizacaoMapaRede;
    window.enquadrarMapaParaEscolas = enquadrarMapaParaEscolas;    window.enquadrarMapaParaEscolas = enquadrarMapaParaEscolas;    window.enquadrarMapaParaEscolas = enquadrarMapaParaEscolas;    window.enquadrarMapaParaEscolas = enquadrarMapaParaEscolas;
    window.fecharAlertaSincronizacao = fecharAlertaSincronizacao;
    window.mostrarToastGlobal = mostrarToastGlobal;

    /* --- FUNÇÕES DE NAVEGAÇÃO DE VIEWS ATUALIZADAS & RESILIENTES (100% BLINDADAS) --- */
        function rolarAoTopoSuave() {
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
    }
    function esconderTodasAsPanes() {
      document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));
    }
    window.esconderTodasAsPanes = esconderTodasAsPanes;

    function atualizarBreadcrumbTopo(texto) {
      const el = document.getElementById('topbar-view-indicator');
      if (el) {
        el.style.display = 'none';
        el.innerText = '';
      }
    }

    function abrirMinhaGestao(dataOpcional) {
      abrirMinhaGestao.__isReal = true; window.abrirMinhaGestao = abrirMinhaGestao;
      esconderTodasAsPanes();
      const pane = document.getElementById('pane-gestao-hoje');
      if (pane) pane.classList.add('active');

      const sideBtn = document.getElementById('side-btn-gestao');
      if (sideBtn) sideBtn.classList.add('active');

      atualizarBreadcrumbTopo('02 - Minha Gestão');

      if (dataOpcional) {
        dataAtivaGestaoHoje = dataOpcional;
      }
      renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
      carregarGoogleCalendar(dataAtivaGestaoHoje);
      rolarAoTopoSuave();
    }

    /* Alias para compatibilidade com chamadas pré-existentes */
    function abrirMinhaGestaoHoje(dataOpcional) {
      abrirMinhaGestao(dataOpcional);
    }

    function abrirAgenda(dataOpcional) {
      abrirAgenda.__isReal = true; window.abrirAgenda = abrirAgenda;
      esconderTodasAsPanes();
      const pane = document.getElementById('pane-agenda');
      if (pane) pane.classList.add('active');

      const sideBtn = document.getElementById('side-btn-agenda');
      if (sideBtn) sideBtn.classList.add('active');

      atualizarBreadcrumbTopo('03 - Agenda da Dirigente');

      if (dataOpcional) {
        dataAtivaAgenda = dataOpcional;
        const inputData = document.getElementById('agenda-input-data');
        if (inputData) inputData.value = dataOpcional;
      }
      renderizarAgenda();
      carregarGoogleCalendar();
      rolarAoTopoSuave();
    }

    /* Atualiza mostrarHome para controlar a pane e o breadcrumb */
    const _antigoMostrarHome = typeof mostrarHome === 'function' ? mostrarHome : null;
    mostrarHome = function() {
      esconderTodasAsPanes();
      const pane = document.getElementById('pane-home');
      if (pane) pane.classList.add('active');

      const sideBtn = document.getElementById('side-btn-home');
      if (sideBtn) sideBtn.classList.add('active');

      atualizarBreadcrumbTopo('');
      rolarAoTopoSuave();
    };

    /* --- RENDERIZAÇÃO: MINHA GESTÃO (ROTINA & COMPROMISSOS) --- */
    function renderizarMinhaGestao() {
      /* 1. Atualiza a data do cabeçalho */
      const textoData = formatarDataExtensoPtBr(dataAtivaGestaoHoje);
      const dataEl = document.getElementById('gestao-hoje-data-texto');
      if (dataEl) dataEl.innerText = textoData;

      /* 2. Atualiza o timestamp */
      const agora = new Date();
      const horaStr = String(agora.getHours()).padStart(2, '0');
      const minStr = String(agora.getMinutes()).padStart(2, '0');
      const timestampEl = document.getElementById('gestao-timeline-timestamp');
      if (timestampEl) timestampEl.innerText = `Atualizada às ${horaStr}:${minStr}`;

      /* 3. Filtra os compromissos para a data ativa da gestão */
      const eventosDoDia = AGENDA_COMPROMISSOS.filter(c => c.data === dataAtivaGestaoHoje);
      const eventosValidos = eventosDoDia.filter(c => c.status !== 'Cancelado');
      const eventosCancelados = eventosDoDia.filter(c => c.status === 'Cancelado');
      const eventosConcluidos = eventosDoDia.filter(c => c.status === 'Concluído');

      /* 4. Renderiza os Slots da Linha do Tempo */
      const containerSlots = document.getElementById('timeline-slots-container');
      if (!containerSlots) return;
      containerSlots.innerHTML = "";

      let slotsOcupadosCount = 0;

      HORARIOS_EXPEDIENTE.forEach(slot => {
        /* Encontra se algum compromisso válido abrange este horário */
        const evento = eventosValidos.find(ev => {
          return ev.horaInicio <= slot.inicio && ev.horaFim > slot.inicio;
        });

        const row = document.createElement('div');
        row.className = 'timeline-slot-row';

        if (!evento) {
          /* SLOT LIVRE (Verde menta suave) */
          row.innerHTML = `
            <div class="slot-time-col">
              <span class="slot-hour-bold">${slot.inicio}</span>
              <span class="slot-hour-sub">até ${slot.fim}</span>
            </div>
            <div class="slot-dot-col">
              <span class="slot-dot livre"></span>
            </div>
            <div class="slot-card-col">
              <div class="slot-card-livre" onclick="abrirModalNovoCompromissoComHorario('${slot.inicio}', '${slot.fim}')" title="Clique para agendar neste horário livre">
                <span class="slot-livre-text">
                  <span class="slot-livre-dot">●</span> Livre
                </span>
                <span class="slot-livre-add-hint">+ Agendar</span>
                <span class="slot-livre-time">${slot.inicio}-${slot.fim}</span>
              </div>
            </div>
          `;
        } else {
          /* SLOT OCUPADO / AGENDADO (Estilo do print: Live Reunião) */
          slotsOcupadosCount++;
          const isConcluido = evento.status === 'Concluído';
          const dotClass = isConcluido ? 'concluido' : 'ocupado';
          const cardExtraClass = isConcluido ? 'concluido' : '';
          const pillClass = isConcluido ? 'concluido' : 'agendado';

          row.innerHTML = `
            <div class="slot-time-col">
              <span class="slot-hour-bold">${slot.inicio}</span>
              <span class="slot-hour-sub">até ${slot.fim}</span>
            </div>
            <div class="slot-dot-col">
              <span class="slot-dot ${dotClass}"></span>
            </div>
            <div class="slot-card-col">
              <div class="slot-card-ocupado ${cardExtraClass}">
                <div class="slot-ocupado-info">
                  <div class="slot-ocupado-title">
                    <span>${evento.titulo}</span>
                  </div>
                  <div class="slot-ocupado-meta">
                    ${evento.horaInicio} - ${evento.horaFim} · ${evento.tipo} · ${evento.local || 'Local a definir'}
                  </div>
                </div>
                <div class="slot-ocupado-right">
                  <div class="slot-action-btn-group">
                    <button class="btn-slot-action done" onclick="alternarStatusConcluido('${evento.id}')" title="${isConcluido ? 'Reabrir compromisso' : 'Marcar como concluído'}">
                      ${isConcluido ? '↩' : '✔'}
                    </button>
                    <button class="btn-slot-action" onclick="abrirModalEditarCompromisso('${evento.id}')" title="Editar compromisso">
                      ✏
                    </button>
                    <button class="btn-slot-action" onclick="cancelarCompromisso('${evento.id}')" title="Cancelar compromisso">
                      ✕
                    </button>
                  </div>
                  <span class="slot-status-pill ${pillClass}">${evento.status}</span>
                  <span class="slot-ocupado-time">${evento.horaInicio}-${evento.horaFim}</span>
                </div>
              </div>
            </div>
          `;
        }

        containerSlots.appendChild(row);
      });

      /* 5. Calcula e Atualiza os 3 Cards de KPI */
      const kpiCompromissos = document.getElementById('kpi-gestao-compromissos');
      const kpiCompromissosSub = document.getElementById('kpi-gestao-compromissos-sub');
      if (kpiCompromissos) {
        kpiCompromissos.innerText = eventosValidos.length;
      }
      if (kpiCompromissosSub) {
        kpiCompromissosSub.innerText = `${eventosValidos.length} agendado(s) · ${eventosCancelados.length} cancelados`;
      }

      const totalHorasExpediente = 10;
      const horasLivres = Math.max(0, totalHorasExpediente - slotsOcupadosCount);
      const kpiTempoLivre = document.getElementById('kpi-gestao-tempo-livre');
      const kpiTempoLivreSub = document.getElementById('kpi-gestao-tempo-livre-sub');
      if (kpiTempoLivre) {
        kpiTempoLivre.innerText = `${horasLivres}h`;
      }
      if (kpiTempoLivreSub) {
        kpiTempoLivreSub.innerText = horasLivres === totalHorasExpediente
          ? "Sem compromissos registrados neste período"
          : `${horasLivres}h disponíveis de ${totalHorasExpediente}h do expediente`;
      }

      const kpiConcluidos = document.getElementById('kpi-gestao-concluidos');
      const kpiConcluidosSub = document.getElementById('kpi-gestao-concluidos-sub');
      if (kpiConcluidos) {
        kpiConcluidos.innerText = eventosConcluidos.length;
      }
      if (kpiConcluidosSub) {
        kpiConcluidosSub.innerText = "Compromissos realizados";
      }
    }

    function renderizarMinhaGestaoHoje() {
      renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
    }

    function atualizarDiaGestao() {
      dataAtivaGestaoHoje = obterDataHojeIso();
      renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
      carregarGoogleCalendar(dataAtivaGestaoHoje, function() {
        mostrarToastAgenda('Linha do tempo e Google Calendar sincronizados!', '🔄');
      });
    }

    function atualizarDiaGestaoHoje() {
      atualizarDiaGestao();
    }

    function abrirSeletorDataGestao() {
      const picker = document.getElementById('gestao-date-hidden-picker');
      if (picker) {
        picker.value = dataAtivaGestaoHoje;
        picker.showPicker ? picker.showPicker() : picker.click();
      }
    }

    function aoMudarDataGestao(novaData) {
      if (novaData) {
        dataAtivaGestaoHoje = novaData;
        renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
        carregarGoogleCalendar(novaData);
        mostrarToastAgenda(`Data alterada para ${formatarDataExtensoPtBr(novaData)}`, '📅');
      }
    }

    /* --- RENDERIZAÇÃO: AGENDA DA DIRIGENTE (LISTA & CALENDÁRIO) --- */
    function renderizarAgenda() {
      const containerLista = document.getElementById('agenda-cards-lista');
      if (!containerLista) return;
      containerLista.innerHTML = "";

      const filtroCat = document.getElementById('agenda-filtro-categoria') ? document.getElementById('agenda-filtro-categoria').value : "";
      const filtroStatus = document.getElementById('agenda-filtro-status') ? document.getElementById('agenda-filtro-status').value : "";
      const filtroBusca = document.getElementById('agenda-filtro-busca') ? document.getElementById('agenda-filtro-busca').value.toLowerCase().trim() : "";
      const filtroData = document.getElementById('agenda-input-data') ? document.getElementById('agenda-input-data').value : "";

      const hoje = obterDataHojeIso();

      /* Filtra por período / data */
      let filtrados = AGENDA_COMPROMISSOS.filter(c => {
        if (filtroPeriodoAgenda === 'hoje' && c.data !== hoje) return false;
        if (filtroPeriodoAgenda === 'amanha') {
          const amanhaObj = new Date();
          amanhaObj.setDate(amanhaObj.getDate() + 1);
          const amanhaStr = `${amanhaObj.getFullYear()}-${String(amanhaObj.getMonth()+1).padStart(2,'0')}-${String(amanhaObj.getDate()).padStart(2,'0')}`;
          if (c.data !== amanhaStr) return false;
        }
        if (filtroPeriodoAgenda === 'data_especifica' && filtroData && c.data !== filtroData) {
          return false;
        }
        if (filtroCat && c.tipo !== filtroCat) return false;
        if (filtroStatus && c.status !== filtroStatus) return false;
        if (filtroBusca) {
          const texto = `${c.titulo} ${c.local} ${c.tipo} ${c.setor} ${c.descricao}`.toLowerCase();
          if (!texto.includes(filtroBusca)) return false;
        }
        return true;
      });

      /* Ordena por data e horário de início */
      filtrados.sort((a, b) => {
        if (a.data !== b.data) return a.data.localeCompare(b.data);
        return a.horaInicio.localeCompare(b.horaInicio);
      });

      if (filtrados.length === 0) {
        containerLista.innerHTML = `
          <div style="background: white; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 3rem 1.5rem; text-align: center; color: #64748b;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📅</div>
            <h4 style="color: #0f172a; margin-bottom: 0.25rem;">Nenhum compromisso encontrado para este filtro</h4>
            <p style="font-size: 0.85rem; margin-bottom: 1rem;">Você pode agendar um novo compromisso oficial ou ajustar os filtros selecionados.</p>
            <button class="btn-gestao-open-agenda" style="margin: 0 auto;" onclick="abrirModalNovoCompromisso()">
              <span>+ Novo Compromisso</span>
            </button>
          </div>
        `;
        return;
      }

      filtrados.forEach(c => {
        const card = document.createElement('div');
        const isConcluido = c.status === 'Concluído';
        const isCancelado = c.status === 'Cancelado';
        const cardClass = isConcluido ? 'status-concluido' : (c.prioridade === 'Alta' ? 'prioridade-alta' : '');

        card.className = `agenda-event-card ${cardClass}`;

        card.innerHTML = `
          <div class="agenda-event-main">
            <div class="agenda-event-top">
              <span class="agenda-time-chip">⏰ ${c.horaInicio} às ${c.horaFim}</span>
              <span class="agenda-time-chip" style="background: #e2e8f0;">📅 ${c.data}</span>
              <span class="agenda-category-chip">${c.tipo}</span>
              <span class="agenda-setor-chip">${c.setor || 'Gabinete'}</span>
              <span class="slot-status-pill ${c.status.toLowerCase()}">${c.status}</span>
            </div>
            <div class="agenda-event-title">${c.titulo}</div>
            <div class="agenda-event-desc">${c.descricao || 'Sem pauta informada.'}</div>
            <div class="agenda-event-meta-row">
              <span>📍 Local: <strong>${c.local || 'Gabinete'}</strong></span>
              ${(c.link && (c.link.startsWith('http:' + String.fromCharCode(47, 47)) || c.link.startsWith('https:' + String.fromCharCode(47, 47)) || c.link.startsWith('www.'))) ? ('<a href=\"' + (c.link.startsWith('www.') ? ('https:' + String.fromCharCode(47, 47) + c.link) : c.link) + '\" target=\"_blank\" style=\"color: #2563eb; text-decoration: underline; font-weight: 600;\">🔗 Acessar Reunião</a>') : (c.link && !['nao','não','n/a','nenhum','sem link','-'].includes(c.link.trim().toLowerCase()) ? ('<span>🌐 ' + c.link + '</span>') : '')}
              <span>${c.prioridade === 'Alta' ? '⚡ ' : (c.prioridade === 'Baixa' ? '🌱 ' : '🔹 ')}Prioridade: <strong>${c.prioridade || 'Normal'}</strong></span>
            </div>
          </div>
          <div class="agenda-event-actions">
            <button class="btn-agenda-action btn-concluir" onclick="alternarStatusConcluido('${c.id}')" title="${isConcluido ? 'Reabrir' : 'Concluir'}">
              <span>${isConcluido ? '↩ Reabrir' : '✔ Concluir'}</span>
            </button>
            <button class="btn-agenda-action" onclick="abrirModalEditarCompromisso('${c.id}')" title="Editar">
              <span>✏ Editar</span>
            </button>
            <button class="btn-agenda-action btn-excluir" onclick="excluirCompromisso('${c.id}')" title="Excluir">
              <span>🗑 Excluir</span>
            </button>
          </div>
        `;

        containerLista.appendChild(card);
      });

      /* Renderiza também o calendário mensal se a aba estiver aberta */
      renderizarCalendarioMensal();
    }

    function alternarTabAgenda(tab) {
      const btnLista = document.getElementById('tab-btn-lista');
      const btnCal = document.getElementById('tab-btn-calendario');
      const contentLista = document.getElementById('agenda-tab-content-lista');
      const contentCal = document.getElementById('agenda-tab-content-calendario');

      if (tab === 'lista') {
        btnLista.classList.add('active');
        btnCal.classList.remove('active');
        contentLista.style.display = 'block';
        contentCal.style.display = 'none';
      } else {
        btnLista.classList.remove('active');
        btnCal.classList.add('active');
        contentLista.style.display = 'none';
        contentCal.style.display = 'block';
        renderizarCalendarioMensal();
      }
    }

    function renderizarCalendarioMensal() {
      const container = document.getElementById('agenda-calendario-container');
      if (!container) return;

      const ano = mesAtivoCalendario.getFullYear();
      const mes = mesAtivoCalendario.getMonth();

      const primeiroDia = new Date(ano, mes, 1);
      const ultimoDia = new Date(ano, mes + 1, 0);

      const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

      let htmlCal = `
        <div class="agenda-cal-wrapper">
          <div class="agenda-cal-nav">
            <button class="btn-mudar-data" onclick="mudarMesCalendario(-1)">◀ Mês Anterior</button>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0b2351;">${nomesMeses[mes]} de ${ano}</h3>
            <button class="btn-mudar-data" onclick="mudarMesCalendario(1)">Próximo Mês ▶</button>
          </div>
          <div class="agenda-cal-grid">
      `;

      diasSemana.forEach(d => {
        htmlCal += `<div class="agenda-cal-day-header">${d}</div>`;
      });

      /* Espaços vazios antes do dia 1 */
      for (let i = 0; i < primeiroDia.getDay(); i++) {
        htmlCal += `<div class="agenda-cal-cell" style="background: transparent; border-color: transparent;"></div>`;
      }

      const hoje = obterDataHojeIso();

      for (let d = 1; d <= ultimoDia.getDate(); d++) {
        const dataIso = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const eventosDoDia = AGENDA_COMPROMISSOS.filter(c => c.data === dataIso && c.status !== 'Cancelado');
        const isHoje = dataIso === hoje;
        const isActiveDay = dataIso === dataAtivaAgenda;

        let cellClasses = 'agenda-cal-cell';
        if (isHoje) cellClasses += ' today';
        if (isActiveDay) cellClasses += ' active-day';

        htmlCal += `
          <div class="${cellClasses}" onclick="selecionarDiaCalendario('${dataIso}')">
            <span class="agenda-cal-day-num">${d}</span>
        `;

        eventosDoDia.slice(0, 3).forEach(ev => {
          const isReuniao = ev.tipo === 'Reunião';
          htmlCal += `
            <div class="agenda-cal-event-dot ${isReuniao ? 'coral' : ''}" title="${ev.horaInicio} - ${ev.titulo}">
              ${ev.horaInicio} ${ev.titulo}
            </div>
          `;
        });

        if (eventosDoDia.length > 3) {
          htmlCal += `<div style="font-size: 0.65rem; color: #64748b; font-weight: 700;">+${eventosDoDia.length - 3} mais</div>`;
        }

        htmlCal += `</div>`;
      }

      htmlCal += `
          </div>
        </div>
      `;

      container.innerHTML = htmlCal;
    }

    function mudarMesCalendario(delta) {
      mesAtivoCalendario.setMonth(mesAtivoCalendario.getMonth() + delta);
      renderizarCalendarioMensal();
    }

    function selecionarDiaCalendario(dataIso) {
      dataAtivaAgenda = dataIso;
      dataAtivaGestaoHoje = dataIso;

      const inputData = document.getElementById('agenda-input-data');
      if (inputData) inputData.value = dataIso;

      filtrarAgendaPeriodo('data_especifica');
      alternarTabAgenda('lista');

      mostrarToastAgenda(`Exibindo compromissos de ${formatarDataExtensoPtBr(dataIso)}`, '📅');
    }

    function filtrarAgendaPeriodo(periodo) {
      filtroPeriodoAgenda = periodo;
      document.querySelectorAll('.agenda-quick-pill').forEach(p => p.classList.remove('active'));

      if (periodo === 'hoje') {
        const btn = document.getElementById('agenda-pill-hoje');
        if (btn) btn.classList.add('active');
        const inputData = document.getElementById('agenda-input-data');
        if (inputData) inputData.value = "";
      } else if (periodo === 'amanha') {
        const btn = document.getElementById('agenda-pill-amanha');
        if (btn) btn.classList.add('active');
        const inputData = document.getElementById('agenda-input-data');
        if (inputData) inputData.value = "";
      } else if (periodo === 'semana') {
        const btn = document.getElementById('agenda-pill-semana');
        if (btn) btn.classList.add('active');
        const inputData = document.getElementById('agenda-input-data');
        if (inputData) inputData.value = "";
      } else if (periodo === 'todos') {
        const btn = document.getElementById('agenda-pill-todos');
        if (btn) btn.classList.add('active');
        const inputData = document.getElementById('agenda-input-data');
        if (inputData) inputData.value = "";
      }

      renderizarAgenda();
    }

    function aoMudarDataAgenda(dataVal) {
      if (dataVal) {
        filtroPeriodoAgenda = 'data_especifica';
        document.querySelectorAll('.agenda-quick-pill').forEach(p => p.classList.remove('active'));
      } else {
        filtroPeriodoAgenda = 'todos';
        filtrarAgendaPeriodo('todos');
      }
      renderizarAgenda();
    }

    function aoFiltrarAgenda() {
      renderizarAgenda();
    }

    /* --- GERENCIAMENTO DO MODAL DE COMPROMISSO --- */
    function abrirModalNovoCompromisso() {
      document.getElementById('form-agenda-id').value = "";
      document.getElementById('modal-agenda-titulo-modo').innerText = "Novo Compromisso Executivo";
      document.getElementById('form-agenda-titulo').value = "";
      document.getElementById('form-agenda-data').value = dataAtivaAgenda || obterDataHojeIso();
      document.getElementById('form-agenda-inicio').value = "08:00";
      document.getElementById('form-agenda-fim').value = "09:00";
      document.getElementById('form-agenda-tipo').value = "Reunião";
      document.getElementById('form-agenda-local').value = "Teams";
      document.getElementById('form-agenda-link').value = "";
      document.getElementById('form-agenda-setor').value = "Gabinete / URE";
      document.getElementById('form-agenda-status').value = "Agendado";
      document.getElementById('form-agenda-prioridade').value = "Normal";
      document.getElementById('form-agenda-desc').value = "";

      const modal = document.getElementById('modal-agenda-compromisso');
      if (modal) modal.classList.add('active');
    }

    function abrirModalNovoCompromissoComHorario(horaInicio, horaFim) {
      abrirModalNovoCompromisso();
      document.getElementById('form-agenda-data').value = dataAtivaGestaoHoje;
      if (horaInicio) document.getElementById('form-agenda-inicio').value = horaInicio;
      if (horaFim) document.getElementById('form-agenda-fim').value = horaFim;
    }

    function abrirModalEditarCompromisso(id) {
      const evento = AGENDA_COMPROMISSOS.find(c => c.id === id);
      if (!evento) return;

      document.getElementById('form-agenda-id').value = evento.id;
      document.getElementById('modal-agenda-titulo-modo').innerText = "Editar Compromisso";
      document.getElementById('form-agenda-titulo').value = evento.titulo || "";
      document.getElementById('form-agenda-data').value = evento.data || obterDataHojeIso();
      document.getElementById('form-agenda-inicio').value = evento.horaInicio || "08:00";
      document.getElementById('form-agenda-fim').value = evento.horaFim || "09:00";
      document.getElementById('form-agenda-tipo').value = evento.tipo || "Reunião";
      document.getElementById('form-agenda-local').value = evento.local || "";
      document.getElementById('form-agenda-link').value = evento.link || "";
      document.getElementById('form-agenda-setor').value = evento.setor || "Gabinete / URE";
      document.getElementById('form-agenda-status').value = evento.status || "Agendado";
      document.getElementById('form-agenda-prioridade').value = evento.prioridade || "Normal";
      document.getElementById('form-agenda-desc').value = evento.descricao || "";

      const modal = document.getElementById('modal-agenda-compromisso');
      if (modal) modal.classList.add('active');
    }

    function fecharModalAgenda(event) {
      if (event && event.target && event.target !== event.currentTarget && !event.target.classList.contains('btn-close-panel') && event.target.tagName !== 'BUTTON') {
        return;
      }
      const modal = document.getElementById('modal-agenda-compromisso');
      if (modal) modal.classList.remove('active');
    }

    function salvarCompromissoForm(event) {
      event.preventDefault();

      const id = document.getElementById('form-agenda-id').value;
      const titulo = document.getElementById('form-agenda-titulo').value.trim();
      const data = document.getElementById('form-agenda-data').value;
      const horaInicio = document.getElementById('form-agenda-inicio').value;
      const horaFim = document.getElementById('form-agenda-fim').value;
      const tipo = document.getElementById('form-agenda-tipo').value;
      const local = document.getElementById('form-agenda-local').value.trim();
      const link = document.getElementById('form-agenda-link').value.trim();
      const setor = document.getElementById('form-agenda-setor').value;
      const status = document.getElementById('form-agenda-status').value;
      const prioridade = (document.getElementById('form-agenda-prioridade') ? document.getElementById('form-agenda-prioridade').value : '') || 'Normal';
      const descricao = document.getElementById('form-agenda-desc').value.trim();

      if (!titulo || !data || !horaInicio || !horaFim) {
        alert('Por favor, preencha todos os campos obrigatórios (*)');
        return;
      }

      if (horaFim <= horaInicio) {
        alert('O horário de término deve ser posterior ao horário de início!');
        return;
      }

      let eventoParaSincronizar = null;
      if (id) {
        /* Atualiza compromisso existente */
        const index = AGENDA_COMPROMISSOS.findIndex(c => c.id === id);
        if (index !== -1) {
          AGENDA_COMPROMISSOS[index] = {
            ...AGENDA_COMPROMISSOS[index],
            titulo,
            data,
            horaInicio,
            horaFim,
            tipo,
            local,
            link,
            setor,
            prioridade,
            status,
            descricao
          };
          eventoParaSincronizar = AGENDA_COMPROMISSOS[index];
          mostrarToastAgenda('Compromisso atualizado com sucesso!', '✏');
        }
      } else {
        /* Cria novo compromisso */
        const novoEvento = {
          id: 'evt-' + Date.now(),
          titulo,
          data,
          horaInicio,
          horaFim,
          tipo,
          local,
          link,
          setor,
          prioridade,
          status,
          descricao
        };
        AGENDA_COMPROMISSOS.push(novoEvento);
        eventoParaSincronizar = novoEvento;
        mostrarToastAgenda('Novo compromisso agendado com sucesso!', '✅');
      }

      salvarAgendaStorage();

      /* Sincroniza e reflete imediatamente nos dois menus! */
      renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
      renderizarAgenda();
      fecharModalAgenda();

      /* Sincronização em segundo plano com o Google Calendar */
      if (eventoParaSincronizar && typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.id && eventoParaSincronizar) {
              eventoParaSincronizar.id = res.id;
              salvarAgendaStorage();
            }
          })
          .withFailureHandler(function(err) {
            console.warn("Aviso: Falha ao sincronizar com Google Calendar:", err);
          })
          .salvarGoogleCalendarEvent(eventoParaSincronizar);
      }
    }

    function alternarStatusConcluido(id) {
      const evento = AGENDA_COMPROMISSOS.find(c => c.id === id);
      if (!evento) return;

      if (evento.status === 'Concluído') {
        evento.status = 'Agendado';
        mostrarToastAgenda(`Compromisso "${evento.titulo}" reaberto!`, '↩');
      } else {
        evento.status = 'Concluído';
        mostrarToastAgenda(`Compromisso "${evento.titulo}" marcado como concluído!`, '✔');
      }

      salvarAgendaStorage();
      renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
      renderizarAgenda();

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.salvarGoogleCalendarEvent(evento);
      }
    }

    function cancelarCompromisso(id) {
      const evento = AGENDA_COMPROMISSOS.find(c => c.id === id);
      if (!evento) return;

      if (confirm(`Deseja realmente cancelar o compromisso "${evento.titulo}"?`)) {
        evento.status = 'Cancelado';
        salvarAgendaStorage();
        renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
        renderizarAgenda();
        mostrarToastAgenda('Compromisso cancelado (horário liberado na timeline)!', '⚠️');

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.salvarGoogleCalendarEvent(evento);
        }
      }
    }

    function excluirCompromisso(id) {
      const index = AGENDA_COMPROMISSOS.findIndex(c => c.id === id);
      if (index === -1) return;

      const eventoAlvo = AGENDA_COMPROMISSOS[index];
      const titulo = eventoAlvo.titulo;
      const idParaExcluir = eventoAlvo.id;

      if (confirm(`Tem certeza que deseja excluir o compromisso "${titulo}" permanentemente?`)) {
        AGENDA_COMPROMISSOS.splice(index, 1);
        salvarAgendaStorage();
        renderizarMinhaGestao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
        renderizarAgenda();
        mostrarToastAgenda('Compromisso excluído com sucesso!', '🗑');

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.excluirGoogleCalendarEvent(idParaExcluir);
        }
      }
    }
