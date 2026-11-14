    /* ========================================================================= */
    /* MOTOR EXCLUSIVO DE NUVEM (ZERO localStorage / ZERO COOKIES)              */
    /* Garante limpeza de resíduo local e hidratação direta das fontes em nuvem */
    /* ========================================================================= */
    function hidratarTodosModulosNuvem() {
      if (typeof limparTodoArmazenamentoLocal === 'function') limparTodoArmazenamentoLocal();
      try { if (typeof carregarAgendaCloud === 'function') carregarAgendaCloud(); } catch(e) {}
      try { if (typeof carregarCarroCloud === 'function') carregarCarroCloud(); } catch(e) {}
      try { if (typeof carregarEscolasLocalStorage === 'function') carregarEscolasLocalStorage(); } catch(e) {}
      try { if (typeof carregarVisitasLocalStorage === 'function') carregarVisitasLocalStorage(); } catch(e) {}
      try { if (typeof carregarConfigEmailAlerta === 'function') carregarConfigEmailAlerta(); } catch(e) {}

      /* Hidratação Universal em Nuvem para Todos os Setores (Anti-F5 / Multi-Dispositivos) */
      if (typeof window.lerEstadoNuvem === 'function') {
        /* 1. SEPES */
        window.lerEstadoNuvem('SEPES_DATA', function(dados) {
          if (dados && (dados.kpis || dados.aposentadorias)) {
            DADOS_SEPES = dados;
            if (typeof renderizarDashboardSepes === 'function') renderizarDashboardSepes();
            if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
          }
        });

        /* 2. SEFREP */
        window.lerEstadoNuvem('SEFREP_DATA', function(dados) {
          if (dados && dados.sucesso) {
            DADOS_SEFREP = dados;
            if (typeof renderizarDashboardSefrep === 'function') renderizarDashboardSefrep();
          }
        });

        /* 3. SEGRE */
        window.lerEstadoNuvem('SEGRE_DATA', function(dados) {
          if (dados && (dados.kpis || dados.processosSei)) {
            DADOS_SEGRE = dados;
            if (typeof renderizarDashboardSegre === 'function') renderizarDashboardSegre();
          }
        });

        /* 4. SEMAT */
        window.lerEstadoNuvem('SEMAT_DATA', function(dados) {
          if (dados && dados.kpis) {
            DADOS_SEMAT = dados;
            if (typeof renderizarDashboardSemat === 'function') renderizarDashboardSemat();
          }
        });

        /* 5. SEVESC */
        window.lerEstadoNuvem('SEVESC_DATA', function(dados) {
          if (dados && dados.kpis) {
            DADOS_SEVESC = dados;
            if (typeof renderizarDashboardSevesc === 'function') renderizarDashboardSevesc();
          }
        });

        /* 6. SEFIN */
        window.lerEstadoNuvem('SEFIN_DATA', function(dados) {
          if (dados && dados.repassesCompactos) {
            DADOS_FINANCEIROS_SEFIN = dados;
            if (typeof renderizarDashboardFinanceiroSefin === 'function') renderizarDashboardFinanceiroSefin();
            if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
          }
        });

        /* 7. SECOMSE */
        window.lerEstadoNuvem('SECOMSE_DATA', function(dados) {
          if (dados && dados.kpis) {
            DADOS_SECOMSE = dados;
            if (typeof renderizarDashboardSecomse === 'function') renderizarDashboardSecomse();
          }
        });

        /* 8. SEOM */
        window.lerEstadoNuvem('SEOM_DATA', function(dados) {
          if (dados && dados.escolas) {
            DADOS_SEOM = dados;
            if (typeof renderizarDashboardSeom === 'function') renderizarDashboardSeom();
          }
        });
      }

      /* Carrega configuração do calendário do Carro Oficial direto do GAS */
      try {
        if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.getCarroCalendarConfig === 'function') {
          if (typeof window.__iniciarBootstrapGas === 'function') {
            window.__iniciarBootstrapGas().then(function(boot) {
              if (boot && boot.carroCalendarUrl) {
                carroCalendarUrl = boot.carroCalendarUrl;
                return;
              }
              if (typeof window.__runGasQueued === 'function') {
                window.__runGasQueued('getCarroCalendarConfig', [], 10000).then(function(url) {
                  if (url) carroCalendarUrl = url;
                }).catch(function() {});
              }
            });
          } else {
            google.script.run
              .withSuccessHandler(function(url) {
                if (url) carroCalendarUrl = url;
              })
              .getCarroCalendarConfig();
          }
        } else if (typeof window.__gasCloudUrl === 'function') {
          var cbCal = '__cb_carro_cal_' + Math.floor(Math.random() * 10000000);
          window[cbCal] = function(res) {
            delete window[cbCal];
            var el = document.getElementById(cbCal);
            if (el && el.parentNode) el.parentNode.removeChild(el);
            if (res && res.sucesso && res.url) carroCalendarUrl = res.url;
          };
          var scCal = document.createElement('script');
          scCal.id = cbCal;
          scCal.src = window.__gasCloudUrl() + '?action=getCarroCalendarConfig&callback=' + cbCal + '&_t=' + Date.now();
          (document.head || document.documentElement).appendChild(scCal);
        }
      } catch(e) {}
    }

    function restaurarTodosCachesPersistentes() {
      if (typeof limparTodoArmazenamentoLocal === 'function') limparTodoArmazenamentoLocal();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
      window.SEINTEC_BASES_CONFIG = (typeof SEINTEC_BASES_CONFIG !== 'undefined') ? SEINTEC_BASES_CONFIG : null;
      window.DADOS_FINANCEIROS_SEFIN = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined') ? DADOS_FINANCEIROS_SEFIN : null;
      window.DADOS_SECOMSE = (typeof DADOS_SECOMSE !== 'undefined') ? DADOS_SECOMSE : null;
      window.DADOS_DPAT = (typeof DADOS_DPAT !== 'undefined') ? DADOS_DPAT : null;
      window.DADOS_SEOM = (typeof DADOS_SEOM !== 'undefined') ? DADOS_SEOM : null;
      window.DADOS_SEFISC = (typeof DADOS_SEFISC !== 'undefined') ? DADOS_SEFISC : null;
      window.DADOS_SEMAT = (typeof DADOS_SEMAT !== 'undefined') ? DADOS_SEMAT : null;
      window.DADOS_SEVESC = (typeof DADOS_SEVESC !== 'undefined') ? DADOS_SEVESC : null;
      window.DADOS_SEGRE = (typeof DADOS_SEGRE !== 'undefined') ? DADOS_SEGRE : null;
      window.DADOS_SEPES = (typeof DADOS_SEPES !== 'undefined') ? DADOS_SEPES : null;
    }
    window.restaurarTodosCachesPersistentes = restaurarTodosCachesPersistentes;
    restaurarTodosCachesPersistentes();


    /**
     * =========================================================================
     * BLINDAGEM ANTI-INCHAÇO EM STREAMING (DecompressionStream NATIVE WEB API)
     * Detecta em <1ms se alguma aba do .xlsx possui >3 MB de XML descomprimido
     * (típico de planilhas formatadas até a linha 1.048.576) e purifica a aba
     * em streaming chunk-a-chunk, descartando linhas vazias antes do SheetJS.
     * =========================================================================
     */
    (function registrarPurificadorXlsxStreaming() {
      var crcTableCache = null;
      function getCrcTable() {
        if (crcTableCache) return crcTableCache;
        crcTableCache = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
          var c = n;
          for (var k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
          crcTableCache[n] = c >>> 0;
        }
        return crcTableCache;
      }
      function crc32U8(u8) {
        var tbl = getCrcTable(), c = 0xffffffff;
        for (var i = 0; i < u8.length; i++) c = tbl[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
        return (c ^ 0xffffffff) >>> 0;
      }
      function readU16(b, i) { return (b[i] | (b[i + 1] << 8)) >>> 0; }
      function readU32(b, i) { return (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0; }
      function b64ToU8(b64) {
        var bin = atob(b64), u8 = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return u8;
      }
      function u8ToB64(u8) {
        var chunks = [];
        for (var i = 0; i < u8.length; i += 32768) {
          chunks.push(String.fromCharCode.apply(null, u8.subarray(i, i + 32768)));
        }
        return btoa(chunks.join(''));
      }

      async function purificarSheetDeflateStream(compU8) {
        var rs = new ReadableStream({
          start: function(ctrl) {
            for (var i = 0; i < compU8.length; i += 262144) ctrl.enqueue(compU8.subarray(i, i + 262144));
            ctrl.close();
          }
        });
        var reader = rs.pipeThrough(new DecompressionStream('deflate-raw')).getReader();
        var dec = new TextDecoder('utf-8');
        var slashCh = String.fromCharCode(47);
        var dimRe = new RegExp('<dimension\\b[^>]*' + slashCh + '>', 'i');
        var buf = '', inSD = false, doneSD = false, dimStripped = false;
        var outParts = [];

        while (true) {
          var step = await reader.read();
          if (step.value) buf += dec.decode(step.value, { stream: true });
          if (step.done) buf += dec.decode();

          if (!inSD && !doneSD) {
            var sdOpen = buf.indexOf('<sheetData');
            if (sdOpen !== -1) {
              var sdGt = buf.indexOf('>', sdOpen);
              if (sdGt !== -1) {
                var pre = buf.slice(0, sdGt + 1);
                if (!dimStripped) { pre = pre.replace(dimRe, ''); dimStripped = true; }
                outParts.push(pre);
                var isSelfClose = buf[sdGt - 1] === slashCh;
                buf = buf.slice(sdGt + 1);
                if (isSelfClose) doneSD = true;
                else inSD = true;
              }
            } else if (buf.length > 64) {
              var headPart = buf.slice(0, buf.length - 64);
              if (!dimStripped) headPart = headPart.replace(dimRe, '');
              outParts.push(headPart);
              buf = buf.slice(buf.length - 64);
              if (step.done) { outParts.push(buf); buf = ''; break; }
              continue;
            }
          }

          if (inSD) {
            var sdCloseTag = '<' + slashCh + 'sheetData>';
            var rowCloseTag = '<' + slashCh + 'row>';
            var sPos = 0;
            while (true) {
              var sdEnd = buf.indexOf(sdCloseTag, sPos);
              var rStart = buf.indexOf('<row', sPos);
              if (sdEnd !== -1 && (rStart === -1 || sdEnd < rStart)) {
                outParts.push(sdCloseTag);
                buf = buf.slice(sdEnd + sdCloseTag.length);
                inSD = false;
                doneSD = true;
                break;
              }
              if (rStart === -1) {
                buf = buf.slice(Math.max(sPos, buf.length - 16));
                break;
              }
              var nextCh = buf[rStart + 4];
              if (nextCh && nextCh !== ' ' && nextCh !== '>') { sPos = rStart + 4; continue; }
              var tagClose = buf.indexOf('>', rStart);
              if (tagClose === -1) { buf = buf.slice(rStart); break; }
              if (buf[tagClose - 1] === slashCh) {
                sPos = tagClose + 1;
                continue;
              }
              var rEnd = buf.indexOf(rowCloseTag, tagClose);
              if (rEnd === -1) { buf = buf.slice(rStart); break; }
              var rowXml = buf.slice(rStart, rEnd + rowCloseTag.length);
              if (
                rowXml.indexOf('<v>') !== -1 || rowXml.indexOf('<v ') !== -1 ||
                rowXml.indexOf('<is>') !== -1 || rowXml.indexOf('<is ') !== -1 ||
                rowXml.indexOf('<f>') !== -1 || rowXml.indexOf('<f ') !== -1
              ) {
                outParts.push(rowXml);
              }
              sPos = rEnd + rowCloseTag.length;
            }
            if (!inSD && doneSD) { outParts.push(buf); buf = ''; }
          } else if (doneSD) {
            outParts.push(buf); buf = '';
          }
          if (step.done) break;
        }
        if (buf) outParts.push(buf);

        var uncompU8 = new TextEncoder().encode(outParts.join(''));
        var cs = new Blob([uncompU8]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        var compCleanU8 = new Uint8Array(await new Response(cs).arrayBuffer());
        return {
          compMethod: 8,
          crc32: crc32U8(uncompU8),
          uncompSize: uncompU8.length,
          payload: compCleanU8
        };
      }

      window.purificarXlsxStreamingSeNecessario = async function(base64Data) {
        try {
          if (!base64Data || typeof DecompressionStream !== 'function' || typeof CompressionStream !== 'function') {
            return base64Data;
          }
          var zipU8 = b64ToU8(base64Data);
          var eocd = -1;
          for (var i = zipU8.length - 22; i >= Math.max(0, zipU8.length - 65557); i--) {
            if (readU32(zipU8, i) === 0x06054b50) { eocd = i; break; }
          }
          if (eocd === -1) return base64Data;
          var cdOff = readU32(zipU8, eocd + 16), cdCnt = readU16(zipU8, eocd + 10);
          var entries = [], pos = cdOff, dec = new TextDecoder('utf-8');
          var slashCh = String.fromCharCode(47);
          var wsPrefix = 'xl' + slashCh + 'worksheets' + slashCh;
          var hasBloated = false;
          for (var k = 0; k < cdCnt; k++) {
            if (readU32(zipU8, pos) !== 0x02014b50) break;
            var compMethod = readU16(zipU8, pos + 10), modTime = readU16(zipU8, pos + 12), modDate = readU16(zipU8, pos + 14);
            var crc32 = readU32(zipU8, pos + 16), compSize = readU32(zipU8, pos + 20), uncompSize = readU32(zipU8, pos + 24);
            var nLen = readU16(zipU8, pos + 28), eLen = readU16(zipU8, pos + 30), cLen = readU16(zipU8, pos + 32), lfhOff = readU32(zipU8, pos + 42);
            var nameBytes = zipU8.subarray(pos + 46, pos + 46 + nLen);
            var name = dec.decode(nameBytes);
            if (name.indexOf(wsPrefix) === 0 && compMethod === 8 && uncompSize > 3 * 1024 * 1024) {
              hasBloated = true;
            }
            entries.push({ name: name, nameBytes: nameBytes, compMethod: compMethod, modTime: modTime, modDate: modDate, crc32: crc32, compSize: compSize, uncompSize: uncompSize, lfhOff: lfhOff });
            pos += 46 + nLen + eLen + cLen;
          }
          if (!hasBloated) return base64Data;

          var items = [];
          for (var m = 0; m < entries.length; m++) {
            var e = entries[m];
            var lfn = readU16(zipU8, e.lfhOff + 26), lex = readU16(zipU8, e.lfhOff + 28);
            var ds = e.lfhOff + 30 + lfn + lex;
            var payload = zipU8.subarray(ds, ds + e.compSize);
            if (e.name.indexOf(wsPrefix) === 0 && e.compMethod === 8 && e.uncompSize > 3 * 1024 * 1024) {
              var cleaned = await purificarSheetDeflateStream(payload);
              items.push({ nameBytes: e.nameBytes, modTime: e.modTime, modDate: e.modDate, compMethod: cleaned.compMethod, crc32: cleaned.crc32, uncompSize: cleaned.uncompSize, payload: cleaned.payload });
            } else {
              items.push({ nameBytes: e.nameBytes, modTime: e.modTime, modDate: e.modDate, compMethod: e.compMethod, crc32: e.crc32, uncompSize: e.uncompSize, payload: payload });
            }
          }

          var totalLfh = 0, totalCd = 0;
          for (var a = 0; a < items.length; a++) {
            totalLfh += 30 + items[a].nameBytes.length + items[a].payload.length;
            totalCd += 46 + items[a].nameBytes.length;
          }
          var out = new Uint8Array(totalLfh + totalCd + 22);
          var dv = new DataView(out.buffer);
          var off = 0, cdPos = totalLfh;
          for (var z = 0; z < items.length; z++) {
            var it = items[z], nb = it.nameBytes, pl = it.payload;
            dv.setUint32(off, 0x04034b50, true); dv.setUint16(off + 4, 20, true); dv.setUint16(off + 6, 0x0800, true);
            dv.setUint16(off + 8, it.compMethod, true); dv.setUint16(off + 10, it.modTime, true); dv.setUint16(off + 12, it.modDate, true);
            dv.setUint32(off + 14, it.crc32, true); dv.setUint32(off + 18, pl.length, true); dv.setUint32(off + 22, it.uncompSize, true);
            dv.setUint16(off + 26, nb.length, true); dv.setUint16(off + 28, 0, true);
            out.set(nb, off + 30); out.set(pl, off + 30 + nb.length);

            dv.setUint32(cdPos, 0x02014b50, true); dv.setUint16(cdPos + 4, 20, true); dv.setUint16(cdPos + 6, 20, true); dv.setUint16(cdPos + 8, 0x0800, true);
            dv.setUint16(cdPos + 10, it.compMethod, true); dv.setUint16(cdPos + 12, it.modTime, true); dv.setUint16(cdPos + 14, it.modDate, true);
            dv.setUint32(cdPos + 16, it.crc32, true); dv.setUint32(cdPos + 20, pl.length, true); dv.setUint32(cdPos + 24, it.uncompSize, true);
            dv.setUint16(cdPos + 28, nb.length, true); dv.setUint32(cdPos + 42, off, true);
            out.set(nb, cdPos + 46);

            off += 30 + nb.length + pl.length;
            cdPos += 46 + nb.length;
          }
          dv.setUint32(cdPos, 0x06054b50, true); dv.setUint16(cdPos + 8, items.length, true); dv.setUint16(cdPos + 10, items.length, true);
          dv.setUint32(cdPos + 12, totalCd, true); dv.setUint32(cdPos + 16, totalLfh, true);
          return u8ToB64(out);
        } catch (errPur) {
          console.warn('Purificador streaming fallback:', errPur);
          return base64Data;
        }
      };
    })();

    /**
     * =========================================================================
     * MOTOR UNIVERSAL CLIENTE DE RESOLUÇÃO PÚBLICA DO SHAREPOINT (ANTI-LOGIN)
     * REGRA FUNDAMENTAL: Todos os setores (SEINTEC, SEAFIN, SEOM, SEGRE, SEPES, EEC, ASURE, etc.)
     * devem utilizar esta função para sincronizar suas planilhas e pastas públicas
     * do SharePoint com blindagem contra telas de login corporativo.
     * =========================================================================
     */
    function sincronizarBasePublicaSharepoint(config) {
      if (!config) return;
      var setor = config.nomeSetor || 'Setor';
      var desc = config.descricao || 'Base de Dados Oficial';
      var url = config.sharepointUrl;
      var isManual = !!config.isManual;
      var onProcessar = config.onProcessar;
      var onConcluir = config.onConcluir;

      if (isManual && typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: setor.toUpperCase() + ' • SHAREPOINT',
          titulo: 'Sincronizando ' + setor + '...',
          mensagem: 'Consultando a base oficial pública (' + desc + ') no SharePoint...',
          detalhes: 'Conexão Anônima Pública • 100% Resiliente',
          duracao: 0
        });
      }

      var finalizarComSucesso = function(timestamp, isRemoto) {
        var agora = timestamp || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (typeof onConcluir === 'function') {
          onConcluir({ sucesso: true, timestamp: agora, isRemoto: !!isRemoto });
        }
        if (isManual && typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: isRemoto ? 'success' : 'info',
            tag: isRemoto ? (setor.toUpperCase() + ' ATUALIZADO AO VIVO') : (setor.toUpperCase() + ' • BASE MANTIDA'),
            titulo: isRemoto ? ('Base do ' + setor + ' Atualizada da Fonte!') : ('Base do ' + setor + ' Mantida (Contingência)'),
            mensagem: isRemoto
              ? ('Dados públicos do <strong>' + setor + '</strong> (' + desc + ') baixados e aplicados diretamente do SharePoint.')
              : ('SharePoint indisponível agora para <strong>' + setor + '</strong>; mantendo os dados já carregados.'),
            detalhes: (isRemoto ? 'SharePoint Ao Vivo às ' : 'Verificado às ') + agora + ' • Sem Exigência de Login',
            duracao: 5000
          });
        }
      };

      consultarSharepointGasLive({
        action: 'sincronizarGenerico',
        fnGas: 'sincronizarArquivoGenericoSharepoint',
        argsGas: [url, setor, desc],
        urlExtraParams: '&url=' + encodeURIComponent(url || '') + '&setor=' + encodeURIComponent(setor) + '&descricao=' + encodeURIComponent(desc),
        timeoutMs: 30000
      }).then(function(res) {
        if (res && res.sucesso && res.dadosBase64) {
          var purGen = (typeof window.purificarXlsxStreamingSeNecessario === 'function')
            ? window.purificarXlsxStreamingSeNecessario(res.dadosBase64)
            : Promise.resolve(res.dadosBase64);
          purGen.then(function(cleanB64) {
            try {
              if (typeof onProcessar === 'function') onProcessar(cleanB64, res.timestamp);
              finalizarComSucesso(res.timestamp, true);
            } catch (e) {
              console.warn('Fallback para base consolidada no setor ' + setor + ':', e);
              finalizarComSucesso(res ? res.timestamp : null, false);
            }
          });
        } else {
          finalizarComSucesso(res ? res.timestamp : null, false);
        }
      }).catch(function() {
        finalizarComSucesso(null, false);
      });
    }
    /* =========================================================================
       GERENCIADOR DO SININHO DE ALERTAS & NOTIFICAÇÕES (HEADER)
       ========================================================================= */
    var _historicoAlertasSininho = [];
    var _qtdErrosNaoLidosSininho = 0;

    function alternarPainelAlertasHeader(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var dropdown = document.getElementById('header-bell-dropdown');
      if (!dropdown) return;
      var aberto = dropdown.style.display === 'flex';
      if (aberto) {
        dropdown.style.display = 'none';
      } else {
        dropdown.style.display = 'flex';
        _qtdErrosNaoLidosSininho = 0;
        atualizarBadgeSininho();
        carregarConfigEmailAlerta();
      }
    }

    document.addEventListener('click', function(e) {
      var dropdown = document.getElementById('header-bell-dropdown');
      var wrapper = document.getElementById('header-bell-wrapper');
      if (dropdown && dropdown.style.display === 'flex') {
        if (wrapper && !wrapper.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      }
    });

    function registrarAlertaNoSininho(tipo, titulo, mensagem, hora) {
      var agora = hora || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      _historicoAlertasSininho.unshift({
        tipo: tipo,
        titulo: titulo || 'Notificação',
        mensagem: mensagem || '',
        hora: agora
      });
      if (_historicoAlertasSininho.length > 20) {
        _historicoAlertasSininho.pop();
      }
      if (tipo === 'error') {
        _qtdErrosNaoLidosSininho++;
      }
      atualizarBadgeSininho();
      renderizarCorpoSininho();
    }

    function atualizarBadgeSininho() {
      var badge = document.getElementById('header-bell-badge');
      var statusTag = document.getElementById('bell-dropdown-status-tag');
      if (!badge) return;

      if (_qtdErrosNaoLidosSininho > 0) {
        badge.innerText = _qtdErrosNaoLidosSininho;
        badge.style.display = 'inline-flex';
        badge.classList.add('active-pulse');
        if (statusTag) {
          statusTag.innerText = _qtdErrosNaoLidosSininho + ' Alerta(s)';
          statusTag.style.background = 'rgba(239, 68, 68, 0.2)';
          statusTag.style.color = '#f87171';
          statusTag.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }
      } else {
        badge.style.display = 'none';
        badge.classList.remove('active-pulse');
        if (statusTag) {
          statusTag.innerHTML = '<span class="pulse-green-dot" style="width: 6px; height: 6px; margin-right: 5px;"></span>Conectado';
          statusTag.style.background = 'rgba(16, 185, 129, 0.2)';
          statusTag.style.color = '#34d399';
          statusTag.style.borderColor = 'rgba(52, 211, 153, 0.3)';
        }
      }
    }

    function renderizarCorpoSininho() {
      var body = document.getElementById('bell-dropdown-body');
      if (!body) return;

      if (!_historicoAlertasSininho || _historicoAlertasSininho.length === 0) {
        body.innerHTML = 
          '<div class="bell-dropdown-empty" style="text-align: center; padding: 1.2rem 0.5rem; color: #64748b;">' +
          '  <div style="font-size: 1.6rem; margin-bottom: 0.35rem;">✅</div>' +
          '  <strong style="color: #059669; font-size: 0.82rem; display: block;">Todas as 12 bases sincronizadas</strong>' +
          '  <span style="font-size: 0.72rem; color: #64748b;">Nenhuma falha de conexão detectada.</span>' +
          '</div>';
        return;
      }

      var htmlItens = '';
      for (var i = 0; i < _historicoAlertasSininho.length; i++) {
        var item = _historicoAlertasSininho[i];
        var classeTipo = item.tipo === 'error' ? 'is-error' : (item.tipo === 'success' ? 'is-success' : 'is-info');
        var icone = item.tipo === 'error' ? '❌' : (item.tipo === 'success' ? '✅' : 'ℹ️');
        htmlItens += 
          '<div class="bell-alert-item ' + classeTipo + '">' +
          '  <div style="display: flex; justify-content: space-between; align-items: center;">' +
          '    <strong style="color: #0f172a;">' + icone + ' ' + (item.titulo || '') + '</strong>' +
          '    <span style="font-size: 0.68rem; color: #64748b;">' + (item.hora || '') + '</span>' +
          '  </div>' +
          '  <div style="color: #475569; line-height: 1.35;">' + (item.mensagem || '') + '</div>' +
          '</div>';
      }
      body.innerHTML = htmlItens;
    }

    function obterGasExecUrl() {
      return 'https:' + String.fromCharCode(47, 47) + 'script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec';
    }

    function carregarConfigEmailAlerta() {
      var input = document.getElementById('input-email-alerta');
      fetch(obterGasExecUrl() + '?action=obterEmailAlerta')
        .then(function(r) { return r.json(); })
        .then(function(res) {
          if (res && res.sucesso && res.email && input && !input.value) {
            input.value = res.email;
          }
        })
        .catch(function() {});
    }

    function salvarConfigEmailAlerta() {
      var input = document.getElementById('input-email-alerta');
      var feedback = document.getElementById('msg-feedback-email');
      if (!input || !input.value || input.value.indexOf('@') === -1) {
        if (feedback) {
          feedback.style.color = '#ef4444';
          feedback.innerText = 'Digite um e-mail válido (ex: seu.nome@educacao.sp.gov.br).';
        }
        return;
      }
      var email = input.value.trim();
      if (feedback) {
        feedback.style.color = '#0284c7';
        feedback.innerText = 'Salvando no servidor Google Apps Script...';
      }

      fetch(obterGasExecUrl() + '?action=configurarEmailAlerta&email=' + encodeURIComponent(email))
        .then(function(r) { return r.json(); })
        .then(function(res) {
          if (res && res.sucesso) {
            if (feedback) {
              feedback.style.color = '#059669';
              feedback.innerText = '✓ E-mail salvo na nuvem e monitoramento 24/7 ativado!';
            }
          } else {
            if (feedback) {
              feedback.style.color = '#ef4444';
              feedback.innerText = 'Erro ao salvar: ' + (res.erro || 'Falha de comunicação');
            }
          }
        })
        .catch(function(e) {
          if (feedback) {
            feedback.style.color = '#ef4444';
            feedback.innerText = 'Falha ao conectar com a nuvem para salvar o e-mail.';
          }
        });
    }

    function testarDisparoEmailAlerta() {
      var input = document.getElementById('input-email-alerta');
      var feedback = document.getElementById('msg-feedback-email');
      var email = (input && input.value) ? input.value.trim() : '';
      if (!email || email.indexOf('@') === -1) {
        if (feedback) {
          feedback.style.color = '#ef4444';
          feedback.innerText = 'Informe um e-mail antes de testar.';
        }
        return;
      }
      if (feedback) {
        feedback.style.color = '#0284c7';
        feedback.innerText = 'Enviando e-mail de teste agora...';
      }

      fetch(obterGasExecUrl() + '?action=testarEnvioEmail&email=' + encodeURIComponent(email))
        .then(function(r) { return r.json(); })
        .then(function(res) {
          if (res && res.sucesso) {
            if (feedback) {
              feedback.style.color = '#059669';
              feedback.innerText = '✓ E-mail de teste enviado! Verifique sua caixa de entrada.';
            }
          } else {
            if (feedback) {
              feedback.style.color = '#ef4444';
              feedback.innerText = 'Falha no teste: ' + (res.erro || 'Erro ao disparar e-mail');
            }
          }
        })
        .catch(function(e) {
          if (feedback) {
            feedback.style.color = '#ef4444';
            feedback.innerText = 'Falha de rede ao disparar teste: ' + e;
          }
        });
    }

    window.alternarPainelAlertasHeader = alternarPainelAlertasHeader;
    window.registrarAlertaNoSininho = registrarAlertaNoSininho;
    window.salvarConfigEmailAlerta = salvarConfigEmailAlerta;
    window.testarDisparoEmailAlerta = testarDisparoEmailAlerta;

    if (typeof sincronizarBasePublicaSharepoint === 'function') window.sincronizarBasePublicaSharepoint = sincronizarBasePublicaSharepoint;
    if (typeof mostrarHome === 'function') window.mostrarHome = mostrarHome;
    if (typeof abrirMinhaGestao === 'function') window.abrirMinhaGestao = abrirMinhaGestao;
    if (typeof abrirAgenda === 'function') window.abrirAgenda = abrirAgenda;
    if (typeof abrirCarroOficial === 'function') window.abrirCarroOficial = abrirCarroOficial;
    if (typeof abrirVisitas === 'function') window.abrirVisitas = abrirVisitas;
    if (typeof abrirEscolas === 'function') window.abrirEscolas = abrirEscolas;
    if (typeof abrirCentro === 'function') window.abrirCentro = abrirCentro;
    if (typeof abrirSetor === 'function') window.abrirSetor = abrirSetor;
    if (typeof abrirSeintec === 'function') window.abrirSeintec = abrirSeintec;
    if (typeof selecionarBaseSeintec === 'function') window.selecionarBaseSeintec = selecionarBaseSeintec;
    if (typeof abrirAssessoriaTecnica === 'function') window.abrirAssessoriaTecnica = abrirAssessoriaTecnica;
    if (typeof selecionarSetor === 'function') window.selecionarSetor = selecionarSetor;
    if (typeof renderizarModuloEec === 'function') window.renderizarModuloEec = renderizarModuloEec;
    if (typeof renderizarModuloEecSaeb === 'function') window.renderizarModuloEecSaeb = renderizarModuloEecSaeb;
    if (typeof recarregarIframeEecSaeb === 'function') window.recarregarIframeEecSaeb = recarregarIframeEecSaeb;
    if (typeof toggleFullscreenEecSaeb === 'function') window.toggleFullscreenEecSaeb = toggleFullscreenEecSaeb;

    /* Inicialização do suporte de arrastar e soltar (drag & drop) e hidratação de cards */
    function inicializarTudoPersistente() {
      if (typeof restaurarTodosCachesPersistentes === 'function') restaurarTodosCachesPersistentes();
      if (typeof carregarEscolasLocalStorage === 'function') carregarEscolasLocalStorage();
      if (typeof atualizarKpisEscolas === 'function') atualizarKpisEscolas();
      if (typeof atualizarKpisSuperioresHomeParaEscola === 'function') atualizarKpisSuperioresHomeParaEscola(null);
      iniciarTimerSincronizacao();
      if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
    }
    if (document.readyState === 'loading') {
      document.addEventListener("DOMContentLoaded", inicializarTudoPersistente);
    } else {
      inicializarTudoPersistente();
    }
    document.addEventListener("DOMContentLoaded", function() {
      const dropzone = document.getElementById('dropzone-seintec');
      if (dropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
          dropzone.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.style.borderColor = 'var(--brand-gold)';
            dropzone.style.background = '#fffbeb';
          }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          dropzone.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.style.borderColor = '';
            dropzone.style.background = '';
          }, false);
        });

        dropzone.addEventListener('drop', function(e) {
          const dt = e.dataTransfer;
          if (dt && dt.files && dt.files.length > 0) {
            aoSelecionarArquivosSeintec({ target: { files: dt.files } });
          }
        }, false);
      }
    });

    /* ========================================================================= */
    /* MOTOR UNIVERSAL DE ORDENAÇÃO DE TABELAS (DOM & DADOS) */
    /* Suporte: Data (Recente/Antiga), Ordem Alfabética (A-Z/Z-A), Números e Status */
    /* ========================================================================= */

    function extrairValorCelulaDom(td) {
      if (!td) return '';
      if (td.hasAttribute('data-sort')) return td.getAttribute('data-sort').trim();
      return (td.textContent || td.innerText || '').trim();
    }

    /* Parser universal de valores para ordenação (Datas ISO/BR, Números/Moeda e Texto) */
    function parseValorParaOrdenacao(val) {
      if (!val) return { tipo: 'str', val: '' };
      var str = String(val).trim();

      /* 0. Timestamp numérico puro em milissegundos (> 1000000000) */
      if (/^\d{10,13}$/.test(str)) {
        return { tipo: 'date', val: parseInt(str, 10) };
      }

      /* 1. Data formato brasileiro (DD/MM/AAAA ou DD/MM/AAAA HH:mm) */
      var brMatch = str.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
      if (brMatch) {
        var dia = parseInt(brMatch[1], 10);
        var mes = parseInt(brMatch[2], 10) - 1;
        var ano = parseInt(brMatch[3], 10);
        var hora = 0, min = 0;
        var horaMatch = str.match(/(\d{1,2}):(\d{2})/);
        if (horaMatch) {
          hora = parseInt(horaMatch[1], 10);
          min = parseInt(horaMatch[2], 10);
        }
        var dBr = new Date(ano, mes, dia, hora, min);
        if (!isNaN(dBr.getTime())) {
          return { tipo: 'date', val: dBr.getTime() };
        }
      }

      /* 2. Data formato ISO (AAAA-MM-DD ou AAAA/MM/DD) */
      var isoMatch = str.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
      if (isoMatch) {
        var anoIso = parseInt(isoMatch[1], 10);
        var mesIso = parseInt(isoMatch[2], 10) - 1;
        var diaIso = parseInt(isoMatch[3], 10);
        var horaIso = 0, minIso = 0;
        var horaIsoMatch = str.match(/(\d{1,2}):(\d{2})/);
        if (horaIsoMatch) {
          horaIso = parseInt(horaIsoMatch[1], 10);
          minIso = parseInt(horaIsoMatch[2], 10);
        }
        var dIso = new Date(anoIso, mesIso, diaIso, horaIso, minIso);
        if (!isNaN(dIso.getTime())) {
          return { tipo: 'date', val: dIso.getTime() };
        }
      }

      /* 3. Número / Moeda / Percentual / Km */
      var limpo = str.replace(/[R$\s%kmKM]/g, '').replace(/\./g, '').replace(',', '.');
      if (limpo !== '' && !isNaN(Number(limpo)) && !isNaN(parseFloat(limpo))) {
        return { tipo: 'num', val: Number(limpo) };
      }

      /* 4. String padrão para ordenação alfabética */
      return { tipo: 'str', val: str.toLowerCase() };
    }

    /* Motor Universal de Ordenacao de Tabelas DOM */
    function ordenarTabelaDom(tableId, colIndex, forceOrder) {
      var table = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
      if (!table) return;

      var thead = table.querySelector('thead');
      var tbody = table.querySelector('tbody');
      if (!tbody) return;

      var rows = Array.from(tbody.querySelectorAll('tr'));
      if (rows.length <= 1) return;

      var ths = thead ? thead.querySelectorAll('th') : [];
      var targetTh = ths[colIndex];

      /* Detecta se a coluna e de data */
      var isDateCol = false;
      var thText = targetTh ? (targetTh.innerText || targetTh.textContent || '').toLowerCase().trim() : '';
      if (thText.includes('data') || thText.includes('abertura') || thText.includes('horario') || thText.includes('horário') || thText.includes('registro') || thText.includes('periodo') || thText.includes('período') || thText.includes('visita') || thText.includes('deslocamento') || thText.includes('prazo')) {
        isDateCol = true;
      } else {
        var sampleCell = rows[0] && rows[0].children ? rows[0].children[colIndex] : null;
        if (sampleCell) {
          var sampleParsed = parseValorParaOrdenacao(extrairValorCelulaDom(sampleCell));
          if (sampleParsed.tipo === 'date') isDateCol = true;
        }
      }

      /* REGRA DE CLASSIFICACAO MANDATORIA:
         - Para coluna de data: Por padrao, a classificacao e SEMPRE da MAIS RECENTE para a MAIS ANTIGA (desc)
         - Segundo clique consecutivo na mesma coluna: inverte para mais antiga (asc)
         - Terceiro clique: volta para mais recente (desc)
         - Para colunas de texto/gerais: primeiro clique e asc (A-Z), segundo e desc (Z-A) */
      var currentOrder = 'desc';

      if (forceOrder) {
        currentOrder = forceOrder;
      } else {
        var lastCol = table._lastSortedCol;
        var lastDir = table._lastSortedDir;

        if (typeof lastCol === 'number' && lastCol === colIndex) {
          currentOrder = (lastDir === 'desc') ? 'asc' : 'desc';
        } else {
          currentOrder = isDateCol ? 'desc' : 'asc';
        }
      }

      table._lastSortedCol = colIndex;
      table._lastSortedDir = currentOrder;

      /* Atualiza classes e setinhas nos cabecalhos */
      ths.forEach(function(th) {
        th.classList.remove('sort-active-asc', 'sort-active-desc');
        var arrow = th.querySelector('.sort-arrow') || th.querySelector('.sort-icon-indicator') || th.querySelector('.sort-icon');
        if (arrow) {
          arrow.textContent = '↕';
        }
      });

      if (targetTh) {
        targetTh.classList.add(currentOrder === 'asc' ? 'sort-active-asc' : 'sort-active-desc');
        var arrowTarget = targetTh.querySelector('.sort-arrow') || targetTh.querySelector('.sort-icon-indicator') || targetTh.querySelector('.sort-icon');
        if (arrowTarget) {
          arrowTarget.textContent = currentOrder === 'asc' ? '▲' : '▼';
        }
      }

      /* Ordenacao de alta precisao */
      rows.sort(function(rowA, rowB) {
        var cellA = rowA.children ? rowA.children[colIndex] : null;
        var cellB = rowB.children ? rowB.children[colIndex] : null;
        var valA = parseValorParaOrdenacao(extrairValorCelulaDom(cellA));
        var valB = parseValorParaOrdenacao(extrairValorCelulaDom(cellB));

        var res = 0;
        if (valA.tipo === 'date' && valB.tipo === 'date') {
          res = valA.val - valB.val;
          /* Desempate inteligente no mesmo dia: maior ID/Protocolo fica no topo em desc */
          if (res === 0) {
            var matchA = (rowA.textContent || '').match(/(?:CALL-|CT-|PROTOCOLO-|#)?(\d{3,7})/i);
            var matchB = (rowB.textContent || '').match(/(?:CALL-|CT-|PROTOCOLO-|#)?(\d{3,7})/i);
            if (matchA && matchB) {
              res = parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
            }
          }
        } else if (valA.tipo === 'date' || valB.tipo === 'date') {
          res = (valA.tipo === 'date') ? 1 : -1;
        } else if (valA.tipo === 'num' && valB.tipo === 'num') {
          res = valA.val - valB.val;
        } else if (valA.tipo === 'num' || valB.tipo === 'num') {
          res = (valA.tipo === 'num') ? 1 : -1;
        } else {
          var strA = String(valA.val || '');
          var strB = String(valB.val || '');
          res = strA.localeCompare(strB, 'pt-BR', { sensitivity: 'base', numeric: true });
        }

        return currentOrder === 'asc' ? res : -res;
      });

      /* Reanexa as linhas ordenadas com DocumentFragment */
      var fragment = document.createDocumentFragment();
      for (var r = 0; r < rows.length; r++) {
        fragment.appendChild(rows[r]);
      }
      tbody.appendChild(fragment);
    }

    if (typeof window !== 'undefined') {
      window.extrairValorCelulaDom = extrairValorCelulaDom;
      window.parseValorParaOrdenacao = parseValorParaOrdenacao;
      window.ordenarTabelaDom = ordenarTabelaDom;
    }

    /* ========================================================================= */
    /* INICIALIZADOR UNIVERSAL DE ORDENAÇÃO DE TABELAS (EXISTENTES E FUTURAS) */
    /* - Exibe APENAS a setinha indicativa (↕, ▲, ▼) ao lado do título da coluna */
    /* - Sem rótulos ou textos como 'maior/menor' ou 'A-Z' */
    /* - Aplica a TODAS as tabelas do projeto (presentes e dinâmicas futuras) */
    /* ========================================================================= */

    function prepararCabecalhosOrdenacaoTabelas() {
      var tabelas = document.querySelectorAll('table');
      tabelas.forEach(function(tabela) {
      if (tabela.hasAttribute('data-no-sort') || tabela.classList.contains('no-sort-table')) return;
      if (tabela.classList.contains('calendar-table') || tabela.classList.contains('m30-table') || tabela.classList.contains('doc-table') || (tabela.closest && tabela.closest('.exec-doc-sheet'))) return;

        var thead = tabela.querySelector('thead');
        if (!thead) return;

        var ths = thead.querySelectorAll('th');
        ths.forEach(function(th, colIdx) {
          if (th.hasAttribute('data-no-sort') || th.classList.contains('no-sort')) return;
          var text = th.innerText.trim();
          if (text.toLowerCase() === 'ações' || text.toLowerCase() === 'acao' || text.toLowerCase() === 'acoes') return;
          if (th.querySelector('button, input, select')) return;

          th.classList.add('th-sortable');
          if (!th.title) {
            th.title = 'Clique para classificar por ' + text;
          }

          /* Assegurar a existência da setinha indicativa ↕ */
          var arrow = th.querySelector('.sort-arrow') || th.querySelector('.sort-icon-indicator') || th.querySelector('.sort-icon');
          if (!arrow) {
            var arrowSpan = document.createElement('span');
            arrowSpan.className = 'sort-arrow';
            arrowSpan.textContent = '↕';
            var wrapper = th.querySelector('.th-sort-wrapper');
            if (wrapper) {
              wrapper.appendChild(arrowSpan);
            } else {
              th.appendChild(arrowSpan);
            }
          }

          /* Se for escolas-main-table, a ordenação tem fluxo próprio integrado */
          if (tabela.id === 'escolas-main-table') return;

          /* Evento de clique para ordenar qualquer tabela automaticamente */
          if (!th.hasAttribute('onclick') && !th._hasUniversalSortListener) {
            th._hasUniversalSortListener = true;
            th.addEventListener('click', function(e) {
              if (e.target.closest('button, input, select, a')) return;
              ordenarTabelaDom(tabela, colIdx);
            });
          }
        });
      });
    }

    /* Monitoramento reativo com MutationObserver para qualquer tabela adicionada no futuro */
    if (typeof MutationObserver !== 'undefined') {
      var sortObserver = new MutationObserver(function(mutations) {
        var hasNewTables = false;
        for (var m = 0; m < mutations.length; m++) {
          var added = mutations[m].addedNodes;
          if (!added) continue;
          for (var i = 0; i < added.length; i++) {
            var node = added[i];
            if (node.nodeType === 1) {
              if (node.tagName === 'TABLE' || node.tagName === 'THEAD' || node.tagName === 'TR' || node.tagName === 'TH' ||
                  (node.querySelector && (node.querySelector('table') || node.querySelector('thead')))) {
                hasNewTables = true;
                break;
              }
            }
          }
          if (hasNewTables) break;
        }
        if (hasNewTables) {
          prepararCabecalhosOrdenacaoTabelas();
        }
      });
      sortObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    /* Inicializar quando o documento estiver pronto */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', prepararCabecalhosOrdenacaoTabelas);
    } else {
      prepararCabecalhosOrdenacaoTabelas();
    }

    /* === ATALHOS DA BARRA DE ORDENAÇÃO: SEINTEC === */
    function aplicarOrdenacaoSeintec(tipo, ordem) {
      document.querySelectorAll('#toolbar-sort-seintec .btn-sort-pill').forEach(function(b) {
        b.classList.remove('active');
      });
      var btnId = 'btn-sort-seintec-' + (tipo === 'data' ? ('data-' + ordem) : ('alfa-' + ordem));
      var btnEl = document.getElementById(btnId);
      if (btnEl) btnEl.classList.add('active');

      if (tipo === 'data') {
        var colData = (baseAtivaSeintec === 'Atendimentos') ? 0 : 3;
        ordenarTabelaDom('panel-seintec-table', colData, ordem);
      } else if (tipo === 'alfabetica') {
        var colAlfa = 1;
        ordenarTabelaDom('panel-seintec-table', colAlfa, ordem);
      }
    }

    /* === ATALHOS DA BARRA DE ORDENAÇÃO: GABINETE / CENTROS / ASURE === */
    function aplicarOrdenacaoGabinete(tipo, ordem) {
      document.querySelectorAll('#toolbar-sort-gabinete .btn-sort-pill').forEach(function(b) {
        b.classList.remove('active');
      });
      var btnId = 'btn-sort-gab-' + (tipo === 'data' ? ('data-' + ordem) : ('alfa-' + ordem));
      var btnEl = document.getElementById(btnId);
      if (btnEl) btnEl.classList.add('active');

      if (tipo === 'data') {
        ordenarTabelaDom('panel-records-table', 3, ordem);
      } else if (tipo === 'alfabetica') {
        ordenarTabelaDom('panel-records-table', 1, ordem);
      }
    }
  
    /* MARCAÇÃO DE FUNÇÕES REAIS E DRENAGEM DA FILA DE NAVEGAÇÃO */
    if (typeof mostrarHome === "function") { mostrarHome.__isReal = true; window.mostrarHome = mostrarHome; }
    if (typeof abrirVisitas === "function") { abrirVisitas.__isReal = true; window.abrirVisitas = abrirVisitas; }
    if (typeof abrirEscolas === "function") { abrirEscolas.__isReal = true; window.abrirEscolas = abrirEscolas; }
    if (typeof abrirCentro === "function") { abrirCentro.__isReal = true; window.abrirCentro = abrirCentro; }
    if (typeof abrirSeintec === "function") { abrirSeintec.__isReal = true; window.abrirSeintec = abrirSeintec; }
    if (typeof abrirAssessoriaTecnica === "function") { abrirAssessoriaTecnica.__isReal = true; window.abrirAssessoriaTecnica = abrirAssessoriaTecnica; }
    if (typeof abrirModalMapaVisitas === "function") { abrirModalMapaVisitas.__isReal = true; window.abrirModalMapaVisitas = abrirModalMapaVisitas; }
    if (typeof abrirMinhaGestao === "function") { abrirMinhaGestao.__isReal = true; window.abrirMinhaGestao = abrirMinhaGestao; }
    if (typeof abrirAgenda === "function") { abrirAgenda.__isReal = true; window.abrirAgenda = abrirAgenda; }
    if (typeof abrirCarroOficial === "function") { abrirCarroOficial.__isReal = true; window.abrirCarroOficial = abrirCarroOficial; }

    if (window.__navQueue && window.__navQueue.length > 0) {
      console.log("Processando fila pendente de navegação:", window.__navQueue.length);
      const lastNav = window.__navQueue.pop();
      window.__navQueue = [];
      if (lastNav && typeof window[lastNav.fnName] === "function") {
        window[lastNav.fnName].apply(null, lastNav.args);
      }
    }
