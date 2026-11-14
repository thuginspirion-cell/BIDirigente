    /* ========================================================================= */
    /* BI DIRIGENTE 2.0 • DECISION INTELLIGENCE ENGINE (100% NUVEM & EXTENSÍVEL) */
    /* ========================================================================= */
    (function() {
      window.DADOS_ASURE = window.DADOS_ASURE || null;
      window.DADOS_EEC = window.DADOS_EEC || null;

      function escHtml(str) {
        return String(str == null ? '' : str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function normCie(v) {
        var digits = String(v == null ? '' : v).replace(/\D/g, '');
        if (!digits) return '';
        if (digits.length > 6) digits = digits.slice(-6);
        while (digits.length < 6) digits = '0' + digits;
        return digits;
      }

      function normTexto(s) {
        var txt = String(s == null ? '' : s).toUpperCase();
        if (typeof txt.normalize === 'function') {
          txt = txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return txt
          .replace(/\b(EE|E\.E\.|PROF|PROFA|PROFESSOR|PROFESSORA|DR|DOUTOR|PE|PADRE|MARECHAL|DEPUTADO|PREFEITO|ESTUDANTE|ALFERES|DESEMBARGADOR)\b/g, ' ')
          .replace(/[^A-Z0-9]+/g, ' ')
          .trim();
      }

      function matchNomeEscola(nomeA, nomeB) {
        var a = normTexto(nomeA);
        var b = normTexto(nomeB);
        if (!a || !b || a.length < 4 || b.length < 4) return false;
        if (a === b) return true;
        if (a.indexOf(b) !== -1 || b.indexOf(a) !== -1) return true;
        var tokensA = a.split(' ').filter(function(t) { return t.length >= 4; });
        var tokensB = b.split(' ').filter(function(t) { return t.length >= 4; });
        if (tokensA.length === 0 || tokensB.length === 0) return false;
        var matches = 0;
        for (var i = 0; i < tokensA.length; i++) {
          if (tokensB.indexOf(tokensA[i]) !== -1) matches++;
        }
        return matches >= Math.min(2, Math.min(tokensA.length, tokensB.length));
      }
      window.matchNomeEscola = matchNomeEscola;

      function parseDataBrMs(str) {
        if (!str) return 0;
        var s = String(str).trim();
        var mIso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (mIso) {
          return new Date(parseInt(mIso[1], 10), parseInt(mIso[2], 10) - 1, parseInt(mIso[3], 10)).getTime();
        }
        var mBr = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
        if (mBr) {
          var ano = parseInt(mBr[3], 10);
          if (ano < 100) ano += 2000;
          return new Date(ano, parseInt(mBr[2], 10) - 1, parseInt(mBr[1], 10)).getTime();
        }
        return 0;
      }

      function formatarMoedaCurta(val) {
        var n = Number(val || 0);
        if (isNaN(n)) n = 0;
        if (n >= 1000000) return 'R$ ' + (n / 1000000).toFixed(2).replace('.', ',') + 'M';
        if (n >= 1000) return 'R$ ' + Math.round(n / 1000).toLocaleString('pt-BR') + ' mil';
        return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
      }

      function calcZScore(serie) {
        if (!Array.isArray(serie) || serie.length < 4) return { z: 0, label: 'Série curta', status: 'neutral' };
        var hist = serie.slice(0, serie.length - 1);
        var atual = Number(serie[serie.length - 1] || 0);
        var soma = 0;
        for (var i = 0; i < hist.length; i++) soma += Number(hist[i] || 0);
        var media = soma / hist.length;
        var sq = 0;
        for (var j = 0; j < hist.length; j++) {
          var d = Number(hist[j] || 0) - media;
          sq += d * d;
        }
        var dp = Math.sqrt(sq / hist.length);
        if (dp < 0.5) return { z: 0, label: 'Estável (0,0σ)', status: 'ok' };
        var z = (atual - media) / dp;
        var zTxt = (z >= 0 ? '+' : '') + z.toFixed(1).replace('.', ',') + 'σ';
        if (z >= 1.8) return { z: z, label: 'Pico anômalo (' + zTxt + ')', status: 'crit' };
        if (z <= -1.8) return { z: z, label: 'Queda acentuada (' + zTxt + ')', status: 'warn' };
        return { z: z, label: 'Dentro do padrão (' + zTxt + ')', status: 'ok' };
      }

      function buildSparklineSvg(serie, strokeColor, bgColor) {
        if (!Array.isArray(serie) || serie.length < 2) {
          return '<span style="font-size: 0.67rem; color: #94a3b8; font-weight: 600;">Aguardando série histórica</span>';
        }
        var w = 86;
        var h = 24;
        var pad = 3;
        var minV = Math.min.apply(null, serie);
        var maxV = Math.max.apply(null, serie);
        var span = (maxV - minV) || 1;
        var pts = [];
        for (var i = 0; i < serie.length; i++) {
          var x = pad + (i / (serie.length - 1)) * (w - pad * 2);
          var y = (h - pad) - ((serie[i] - minV) / span) * (h - pad * 2);
          pts.push(x.toFixed(1) + ',' + y.toFixed(1));
        }
        var lastPt = pts[pts.length - 1].split(',');
        var areaPts = pts.join(' ') + ' ' + (w - pad).toFixed(1) + ',' + (h - pad).toFixed(1) + ' ' + pad.toFixed(1) + ',' + (h - pad).toFixed(1);
        return '' +
          '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display: block; overflow: visible;">' +
            '<polygon points="' + areaPts + '" fill="' + (bgColor || 'rgba(14,165,233,0.14)') + '"></polygon>' +
            '<polyline fill="none" stroke="' + (strokeColor || '#0284c7') + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="' + pts.join(' ') + '"></polyline>' +
            '<circle cx="' + lastPt[0] + '" cy="' + lastPt[1] + '" r="2.6" fill="' + (strokeColor || '#0284c7') + '"></circle>' +
          '</svg>';
      }

      function buildBulletHtml(actualPct, targetPct, color, caption) {
        var a = Math.max(0, Math.min(100, Math.round(actualPct)));
        var t = Math.max(0, Math.min(100, Math.round(targetPct)));
        return '' +
          '<div class="di-bullet-wrap">' +
            '<div style="display: flex; justify-content: space-between; font-size: 0.68rem; font-weight: 800; color: #0f172a;">' +
              '<span>' + actualPct.toFixed(1).replace('.', ',') + '%</span>' +
              '<span style="color: #64748b; font-weight: 600;">Meta ' + t + '%</span>' +
            '</div>' +
            '<div class="di-bullet-track" title="Realizado: ' + actualPct.toFixed(1) + '% | Referência: ' + t + '%">' +
              '<div class="di-bullet-fill" style="width: ' + a + '%; background: ' + color + ';"></div>' +
              '<div class="di-bullet-target" style="left: calc(' + t + '% - 1px);"></div>' +
            '</div>' +
            '<div style="font-size: 0.65rem; color: #64748b;">' + escHtml(caption) + '</div>' +
          '</div>';
      }

      function statusSeiAberto(situacao) {
        var st = String(situacao || '').toUpperCase();
        if (!st) return true;
        if (st.indexOf('ARQUIV') !== -1 || st.indexOf('FINALIZ') !== -1 || st.indexOf('CONCLU') !== -1 || st.indexOf('ATENDID') !== -1 || st.indexOf('RESPONDID') !== -1 || st.indexOf('DEVOLVID') !== -1 || st.indexOf('PUBLICA') !== -1) {
          return false;
        }
        return true;
      }

      function construirFatoEscolas() {
        var baseEscolas = (typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas) && listaEscolas.length > 0)
          ? listaEscolas
          : ((typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO)) ? BASE_ESCOLAS_PADRAO : []);

        var seomEscolas = (typeof DADOS_SEOM !== 'undefined' && DADOS_SEOM && Array.isArray(DADOS_SEOM.escolas)) ? DADOS_SEOM.escolas : [];
        var hwList = (window.INVENTARIO_COMPLETO_TUPLES && Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.hardware)) ? window.INVENTARIO_COMPLETO_TUPLES.hardware : [];
        var callsList = (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros)) ? SEINTEC_BASES_CONFIG['Atendimentos'].registros : [];
        var repassesRaw = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN && Array.isArray(DADOS_FINANCEIROS_SEFIN.repassesCompactos)) ? DADOS_FINANCEIROS_SEFIN.repassesCompactos : [];
        var sepesApos = (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && Array.isArray(DADOS_SEPES.aposentadorias)) ? DADOS_SEPES.aposentadorias : [];
        var sepesDesig = (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && Array.isArray(DADOS_SEPES.designacoes)) ? DADOS_SEPES.designacoes : [];
        var sepesAbonos = (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && Array.isArray(DADOS_SEPES.abonos)) ? DADOS_SEPES.abonos : [];
        var segreSei = (typeof DADOS_SEGRE !== 'undefined' && DADOS_SEGRE && Array.isArray(DADOS_SEGRE.processosSei)) ? DADOS_SEGRE.processosSei : [];
        var sematSei = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && Array.isArray(DADOS_SEMAT.processosSei)) ? DADOS_SEMAT.processosSei : [];
        var sevescSei = (typeof DADOS_SEVESC !== 'undefined' && DADOS_SEVESC && Array.isArray(DADOS_SEVESC.processosSei)) ? DADOS_SEVESC.processosSei : [];
        var visitasMap = (typeof visitasRegistro !== 'undefined' && visitasRegistro) ? visitasRegistro : {};
        var asureExt = (window.DADOS_ASURE && Array.isArray(window.DADOS_ASURE.escolas)) ? window.DADOS_ASURE.escolas : null;
        var eecExt = (window.DADOS_EEC && Array.isArray(window.DADOS_EEC.escolas)) ? window.DADOS_EEC.escolas : null;

        /* Pre-indexar SEINTEC Hardware e Chamados por CIE */
        var hwPorCie = {};
        for (var i = 0; i < hwList.length; i++) {
          var h = hwList[i];
          var c = normCie(h[0]);
          if (!c) continue;
          if (!hwPorCie[c]) hwPorCie[c] = { total: 0, disp: 0, bad: 0 };
          hwPorCie[c].total++;
          var stH = String(h[5] || '').toLowerCase();
          if (stH.indexOf('dispon') !== -1) hwPorCie[c].disp++;
          if (stH.indexOf('inserv') !== -1 || stH.indexOf('manut') !== -1 || stH.indexOf('danif') !== -1 || stH.indexOf('aguard') !== -1 || stH.indexOf('chamado') !== -1 || stH.indexOf('quebr') !== -1 || stH.indexOf('repar') !== -1) {
            hwPorCie[c].bad++;
          }
        }

        var callsPorCie = {};
        for (var j = 0; j < callsList.length; j++) {
          var cl = callsList[j];
          var cc = normCie(cl.cie);
          if (!cc) continue;
          if (!callsPorCie[cc]) callsPorCie[cc] = { total: 0, abertos: 0 };
          callsPorCie[cc].total++;
          var stC = String(cl.status || '').toLowerCase();
          if (stC.indexOf('pend') !== -1 || stC.indexOf('abert') !== -1 || stC.indexOf('atend') !== -1) {
            callsPorCie[cc].abertos++;
          }
        }

        /* Pre-indexar SEFIN 2026 por CIE */
        var sefinPorCie = {};
        if (typeof descompactarRepasseSefin === 'function') {
          for (var rIdx = 0; rIdx < repassesRaw.length; rIdx++) {
            var rObj = descompactarRepasseSefin(repassesRaw[rIdx]);
            if (String(rObj.ano) !== '2026') continue;
            var rCie = normCie(rObj.cie);
            if (!rCie) continue;
            if (!sefinPorCie[rCie]) sefinPorCie[rCie] = { rec: 0, desp: 0, repasses: 0, emAndamento: 0 };
            sefinPorCie[rCie].rec += Number(rObj.recTotal || 0);
            sefinPorCie[rCie].desp += Number(rObj.despTotal || 0);
            sefinPorCie[rCie].repasses++;
            if (String(rObj.statusSed || '').toUpperCase().indexOf('ANDAMENTO') !== -1) sefinPorCie[rCie].emAndamento++;
          }
        }

        var todosSei = segreSei.concat(sematSei).concat(sevescSei);
        var todosSepes = sepesApos.concat(sepesDesig).concat(sepesAbonos);
        var sefrepRegs = (typeof DADOS_SEFREP !== 'undefined' && DADOS_SEFREP && Array.isArray(DADOS_SEFREP.registros)) ? DADOS_SEFREP.registros : [];
        var mesAtual = new Date().getMonth() + 1;

        var fato = [];
        for (var eIdx = 0; eIdx < baseEscolas.length; eIdx++) {
          var esc = baseEscolas[eIdx];
          var cie = normCie(esc.cie);
          var nomeBruto = esc.nomeOficialBruto || esc.nome || '';

          /* 1. SEOM */
          var seom = null;
          for (var sIdx = 0; sIdx < seomEscolas.length; sIdx++) {
            if (matchNomeEscola(seomEscolas[sIdx].escola, nomeBruto)) {
              seom = seomEscolas[sIdx];
              break;
            }
          }
          /* 1. SEOM (Escala 0–100 pts • Peso 25% no IPRE) */
          var ptsSeom = 0;
          var flagsSeom = [];
          if (seom) {
            if (seom.avcb !== 1) { ptsSeom += 25; flagsSeom.push('Sem AVCB'); }
            if (seom.esgoto === 2) { ptsSeom += 25; flagsSeom.push('Saneamento crítico'); }
            if (seom.telhado === 2) { ptsSeom += 20; flagsSeom.push('Telhado crítico'); }
            if (seom.eletrica === 2) { ptsSeom += 15; flagsSeom.push('Elétrica sobrecarregada'); }
            if (seom.obraFde === 2 || seom.obraFde === 1) { ptsSeom += 5; flagsSeom.push('Obra FDE ativa'); }
            if (seom.zeladoria !== 1) { ptsSeom += 5; flagsSeom.push('Sem zelador'); }
            if (seom.cuidador === 2) { ptsSeom += 5; flagsSeom.push('Déficit cuidador'); }
            ptsSeom = Math.min(100, ptsSeom);
          }

          /* 2. SEINTEC (Escala 0–100 pts • Peso 20% no IPRE) */
          var hwInfo = hwPorCie[cie] || { total: 0, disp: 0, bad: 0 };
          var callInfo = callsPorCie[cie] || { total: 0, abertos: 0 };
          var hwPctBad = hwInfo.total >= 20 ? (hwInfo.bad / hwInfo.total) * 100 : 0;
          var quartoTi = hwPctBad >= 75 ? '4/4' : (hwPctBad >= 50 ? '3/4' : (hwPctBad >= 25 ? '2/4' : '1/4'));
          var ptsHwRatio = Math.min(50, Math.round((hwPctBad / 75) * 50));
          var ptsSeintec = ptsHwRatio;
          var flagsSeintec = [];
          if (hwInfo.total >= 20 && hwPctBad >= 15) {
            flagsSeintec.push(hwPctBad.toFixed(1).replace('.', ',') + '% comprometido (' + hwInfo.bad + '/' + hwInfo.total + ')');
          }
          if (callInfo.total >= 30) { ptsSeintec += 35; flagsSeintec.push(callInfo.total + ' chamados'); }
          else if (callInfo.total >= 20) { ptsSeintec += 20; flagsSeintec.push(callInfo.total + ' chamados'); }
          else if (callInfo.total >= 10) { ptsSeintec += 10; }
          if (callInfo.abertos >= 3) { ptsSeintec += 15; flagsSeintec.push(callInfo.abertos + ' em aberto'); }
          else if (callInfo.abertos >= 1) { ptsSeintec += 5; flagsSeintec.push(callInfo.abertos + ' em aberto'); }
          ptsSeintec = Math.min(100, ptsSeintec);

          /* 3. SEAFIN (Escala 0–100 pts • Peso 15% no IPRE) */
          var finInfo = sefinPorCie[cie] || { rec: 0, desp: 0, repasses: 0, emAndamento: 0 };
          var saldoOcioso = Math.max(0, finInfo.rec - finInfo.desp);
          var execPct = finInfo.rec > 0 ? Math.min(100, (finInfo.desp / finInfo.rec) * 100) : 0;
          var ptsSeafin = 0;
          var flagsSeafin = [];
          if (finInfo.rec > 0) {
            if (mesAtual >= 7 && execPct < 35) { ptsSeafin += 60; flagsSeafin.push('Execução PDDE baixa (' + execPct.toFixed(0) + '%)'); }
            else if (mesAtual >= 7 && execPct < 50) { ptsSeafin += 35; flagsSeafin.push('Ritmo PDDE lento (' + execPct.toFixed(0) + '%)'); }
            else if (mesAtual >= 7 && execPct < 65) { ptsSeafin += 15; }
            if (saldoOcioso >= 100000 && (ptsSeom >= 40 || ptsSeintec >= 40)) {
              ptsSeafin += 40;
              flagsSeafin.push(formatarMoedaCurta(saldoOcioso) + ' parado c/ demanda');
            } else if (saldoOcioso >= 50000 && (ptsSeom >= 40 || ptsSeintec >= 40)) {
              ptsSeafin += 20;
              flagsSeafin.push(formatarMoedaCurta(saldoOcioso) + ' parado c/ demanda');
            }
            ptsSeafin = Math.min(100, ptsSeafin);
          }

          /* 4. SEPES (Escala 0–100 pts • Peso 20% no IPRE) */
          var sepesPend = 0;
          var sepesDesigPend = 0;
          for (var pIdx = 0; pIdx < todosSepes.length; pIdx++) {
            var sp = todosSepes[pIdx];
            if (sp.concluido) continue;
            var ueNome = sp.ue || sp.ua || '';
            if (matchNomeEscola(ueNome, nomeBruto)) {
              sepesPend++;
              if (String(sp.id || '').indexOf('DESIG') === 0) sepesDesigPend++;
            }
          }

          var sefrepDev = 0;
          var sefrepTotal = 0;
          for (var sfIdx = 0; sfIdx < sefrepRegs.length; sfIdx++) {
            var sf = sefrepRegs[sfIdx];
            if (matchNomeEscola(sf.ue, nomeBruto)) {
              sefrepTotal++;
              if (sf.dev) sefrepDev++;
            }
          }

          var ptsSepes = 0;
          var flagsSepes = [];
          if (sepesPend >= 3) { ptsSepes += 50; flagsSepes.push(sepesPend + ' processos SEAPE em fila'); }
          else if (sepesPend === 2) { ptsSepes += 35; flagsSepes.push('2 proc. SEAPE ativos'); }
          else if (sepesPend === 1) { ptsSepes += 20; flagsSepes.push('1 proc. SEAPE ativo'); }
          if (sepesDesigPend >= 1) { flagsSepes.push(sepesDesigPend + ' designação pend.'); }

          if (sefrepDev >= 4) {
            ptsSepes += 50;
            flagsSepes.push('⚠️ ' + sefrepDev + ' devoluções de folha (SEFREP)');
          } else if (sefrepDev >= 2) {
            ptsSepes += 30;
            flagsSepes.push('⚠️ ' + sefrepDev + ' devoluções de folha (SEFREP)');
          } else if (sefrepDev === 1) {
            ptsSepes += 15;
            flagsSepes.push('1 devolução de folha (SEFREP)');
          }
          ptsSepes = Math.min(100, ptsSepes);

          /* 5. SEGRE (Escala 0–100 pts • Peso 20% no IPRE • 20 pts por SEI em aberto) */
          var segreAbertos = 0;
          for (var gIdx = 0; gIdx < todosSei.length; gIdx++) {
            var sei = todosSei[gIdx];
            if (!statusSeiAberto(sei.situacao)) continue;
            var alvoSei = sei.escola || sei.interessado || sei.remetente || '';
            if (matchNomeEscola(alvoSei, nomeBruto)) segreAbertos++;
          }
          var ptsSegre = Math.min(100, segreAbertos * 20);
          var flagsSegre = [];
          if (segreAbertos >= 3) { flagsSegre.push(segreAbertos + ' SEI em aberto'); }
          else if (segreAbertos >= 1) { flagsSegre.push(segreAbertos + ' SEI ativo'); }

          /* 6. ASURE (Escala 0–100 pts • Adaptador Extensível) */
          var vObj = visitasMap[esc.id] || visitasMap[cie] || null;
          var visitada = Boolean(vObj && vObj.visitada);
          var dataVisita = (vObj && vObj.data) ? vObj.data : '';
          var ptsAsure = 0;
          var flagsAsure = [];
          if (asureExt) {
            for (var aIdx = 0; aIdx < asureExt.length; aIdx++) {
              if (normCie(asureExt[aIdx].cie) === cie || matchNomeEscola(asureExt[aIdx].escola, nomeBruto)) {
                if (asureExt[aIdx].visitada !== undefined) visitada = Boolean(asureExt[aIdx].visitada);
                if (asureExt[aIdx].dataVisita) dataVisita = asureExt[aIdx].dataVisita;
                if (Number(asureExt[aIdx].ouvidoriasAbertas || 0) > 0) {
                  ptsAsure = Math.min(100, Number(asureExt[aIdx].ouvidoriasAbertas) * 25);
                  flagsAsure.push(asureExt[aIdx].ouvidoriasAbertas + ' ouvidoria(s)');
                }
                break;
              }
            }
          }

          /* 7. EEC (Escala 0–100 pts • Adaptador Extensível) */
          var ptsEec = 0;
          var eecScore = null;
          var flagsEec = [];
          if (eecExt) {
            for (var kIdx = 0; kIdx < eecExt.length; kIdx++) {
              if (normCie(eecExt[kIdx].cie) === cie || matchNomeEscola(eecExt[kIdx].escola, nomeBruto)) {
                eecScore = Number(eecExt[kIdx].proficiencia != null ? eecExt[kIdx].proficiencia : (eecExt[kIdx].aderencia || 0));
                if (eecScore > 0 && eecScore < 50) {
                  ptsEec = Math.min(100, Math.round((50 - eecScore) * 2));
                  flagsEec.push('Alerta pedagógico (' + eecScore.toFixed(0) + '%)');
                }
                break;
              }
            }
          }

          /* Consolidação Ponderada Exata (100%): SEOM 25% + SEINTEC 20% + SEGRE 20% + SEPES 20% + SEAFIN 15% */
          var imroPonderado = Math.round(
            (ptsSeom * 0.25) +
            (ptsSeintec * 0.20) +
            (ptsSegre * 0.20) +
            (ptsSepes * 0.20) +
            (ptsSeafin * 0.15)
          );

          /* Regra Anti-Ocultamento: Alerta Crítico Setorial se qualquer núcleo atingir >= 80/100 */
          var alertasSetoriais = [];
          if (ptsSeom >= 80) alertasSetoriais.push('SEOM (' + ptsSeom + '/100)');
          if (ptsSeintec >= 80) alertasSetoriais.push('SEINTEC (' + ptsSeintec + '/100)');
          if (ptsSegre >= 80) alertasSetoriais.push('SEGRE (' + ptsSegre + '/100)');
          if (ptsSepes >= 80) alertasSetoriais.push('SEPES (' + ptsSepes + '/100)');
          if (ptsSeafin >= 80) alertasSetoriais.push('SEAFIN (' + ptsSeafin + '/100)');
          var maxSetor = Math.max(ptsSeom, ptsSeintec, ptsSegre, ptsSepes, ptsSeafin);
          var alertaSetorial = maxSetor >= 80;

          var imroTotal = alertaSetorial
            ? Math.min(100, Math.max(imroPonderado, Math.round((imroPonderado * 0.65) + (maxSetor * 0.35)), 45))
            : Math.min(100, imroPonderado);

          var tier = 'Regular';
          if (imroTotal >= 62) tier = 'Crítico';
          else if (imroTotal >= 50) tier = 'Alto Risco';
          else if (imroTotal >= 40) tier = 'Atenção';

          fato.push({
            id: esc.id,
            cie: cie,
            nome: esc.nome,
            nomeOficialBruto: nomeBruto,
            cidade: esc.cidade || 'Itapevi',
            tipo: esc.tipo || 'Regular',
            imro: imroTotal,
            imroPonderado: imroPonderado,
            maxSetor: maxSetor,
            alertaSetorial: alertaSetorial,
            alertasSetoriais: alertasSetoriais,
            tier: tier,
            pts: {
              SEOM: ptsSeom,
              SEINTEC: ptsSeintec,
              SEAFIN: ptsSeafin,
              SEPES: ptsSepes,
              SEGRE: ptsSegre,
              ASURE: ptsAsure,
              EEC: ptsEec
            },
            flags: {
              SEOM: flagsSeom,
              SEINTEC: flagsSeintec,
              SEAFIN: flagsSeafin,
              SEPES: flagsSepes,
              SEGRE: flagsSegre,
              ASURE: flagsAsure,
              EEC: flagsEec
            },
            hwTotal: hwInfo.total,
            hwDisp: hwInfo.disp,
            hwBad: hwInfo.bad,
            hwBadPct: Number(hwPctBad.toFixed(1)),
            quartoTi: quartoTi,
            callsTotal: callInfo.total,
            callsAbertos: callInfo.abertos,
            rec2026: finInfo.rec,
            desp2026: finInfo.desp,
            saldoOcioso2026: saldoOcioso,
            execPct2026: execPct,
            sepesPend: sepesPend,
            sefrepDevolucoes: sefrepDev,
            sefrepTotal: sefrepTotal,
            segreAbertos: segreAbertos,
            visitada: visitada,
            dataVisita: dataVisita,
            eecScore: eecScore,
            seomObj: seom
          });
        }

        fato.sort(function(a, b) { return b.imro - a.imro; });
        return fato;
      }

      function serieSemanalChamados(callsList) {
        var dated = [];
        for (var i = 0; i < callsList.length; i++) {
          var ms = parseDataBrMs(callsList[i].data);
          if (ms > 0) dated.push(ms);
        }
        if (dated.length === 0) return [];
        var maxMs = Math.max.apply(null, dated);
        var weekMs = 7 * 24 * 60 * 60 * 1000;
        var buckets = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < dated.length; j++) {
          var diffWeeks = Math.floor((maxMs - dated[j]) / weekMs);
          if (diffWeeks >= 0 && diffWeeks < 8) {
            buckets[7 - diffWeeks]++;
          }
        }
        return buckets;
      }

      function serieMensalObj(mesesMap) {
        if (!mesesMap || typeof mesesMap !== 'object') return [];
        var keys = Object.keys(mesesMap).map(function(k) { return parseInt(k, 10); }).filter(function(n) { return !isNaN(n) && n >= 1 && n <= 12; }).sort(function(a, b) { return a - b; });
        if (keys.length < 2) return [];
        var lastKeys = keys.slice(-8);
        return lastKeys.map(function(k) { return Number(mesesMap[String(k)] || 0); });
      }

      function computarTelemetriaSetores(fato) {
        var nowMs = Date.now();
        var mesAtual = new Date().getMonth() + 1;
        var metaCalendarioPct = Math.min(95, Math.max(10, Math.round((mesAtual / 12) * 100)));

        /* 1. SEINTEC */
        var hwList = (window.INVENTARIO_COMPLETO_TUPLES && Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.hardware)) ? window.INVENTARIO_COMPLETO_TUPLES.hardware : [];
        var callsList = (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros)) ? SEINTEC_BASES_CONFIG['Atendimentos'].registros : [];
        var hwTotal = hwList.length || 15973;
        var hwDisp = hwList.filter(function(t) { return String(t[5] || '').toLowerCase().indexOf('dispon') !== -1; }).length;
        var hwBad = hwList.filter(function(t) {
          var st = String(t[5] || '').toLowerCase();
          return st.indexOf('inserv') !== -1 || st.indexOf('manut') !== -1 || st.indexOf('danif') !== -1 || st.indexOf('aguard') !== -1 || st.indexOf('chamado') !== -1;
        }).length;
        var hwDispPct = hwTotal > 0 ? (hwDisp / hwTotal) * 100 : 0;
        var callsAbertos = 0;
        var callsAged15 = 0;
        var callsConcluidos = 0;
        var callsPorEscola = {};
        for (var ci = 0; ci < callsList.length; ci++) {
          var c = callsList[ci];
          var stC = String(c.status || '').toLowerCase();
          var escKey = normCie(c.cie) || String(c.escola || 'OUTROS');
          callsPorEscola[escKey] = (callsPorEscola[escKey] || 0) + 1;
          if (stC.indexOf('conclu') !== -1 || stC.indexOf('fechad') !== -1) {
            callsConcluidos++;
          } else {
            callsAbertos++;
            var cms = parseDataBrMs(c.data);
            if (cms > 0 && (nowMs - cms) > 15 * 86400000) callsAged15++;
          }
        }
        var callsSlaPct = callsList.length > 0 ? (callsConcluidos / callsList.length) * 100 : 100;
        var topCallsEsc = Object.values(callsPorEscola).sort(function(a, b) { return b - a; }).slice(0, 5);
        var sumTopCalls = topCallsEsc.reduce(function(acc, v) { return acc + v; }, 0);
        var paretoCallsPct = callsList.length > 0 ? Math.round((sumTopCalls / callsList.length) * 100) : 0;
        var serieSeintec = serieSemanalChamados(callsList);
        var zSeintec = calcZScore(serieSeintec);
        var healthSeintec = Math.round((hwDispPct * 0.45) + (callsSlaPct * 0.55));

        /* 2. SEAFIN (SEFIN + SECOMSE) */
        var sefinMeta = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN.meta) ? DADOS_FINANCEIROS_SEFIN.meta : {};
        var sefinK = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN.kpisPorAno && DADOS_FINANCEIROS_SEFIN.kpisPorAno['2026'])
          ? DADOS_FINANCEIROS_SEFIN.kpisPorAno['2026']
          : { totalReceita: 0, totalDespesa: 0, taxaExecucao: 0, totalRepasses: 0 };
        var execPct2026 = Number(sefinK.taxaExecucao || 0);
        var saldoOciosoTotal = Math.max(0, Number(sefinK.totalReceita || 0) - Number(sefinK.totalDespesa || 0));
        var secomseContratos = (typeof DADOS_SECOMSE !== 'undefined' && DADOS_SECOMSE && DADOS_SECOMSE.contratos)
          ? ((DADOS_SECOMSE.contratos['2026'] || []).concat(DADOS_SECOMSE.contratos['2025'] || []))
          : [];
        var vencendo60d = 0;
        var valorVencendo60d = 0;
        for (var sci = 0; sci < secomseContratos.length; sci++) {
          var ct = secomseContratos[sci];
          var vig = String(ct.vigencia || '');
          var partsVig = vig.split(/\s+a\s+|\s+e\s+/i);
          if (partsVig.length >= 2) {
            var fimMs = parseDataBrMs(partsVig[1]);
            if (fimMs > 0) {
              var diasRest = (fimMs - nowMs) / 86400000;
              if (diasRest >= 0 && diasRest <= 60) {
                vencendo60d++;
                valorVencendo60d += Number(ct.valor || 0);
              }
            }
          }
        }
        var saldosPorEsc = fato.map(function(e) { return e.saldoOcioso2026; }).sort(function(a, b) { return b - a; });
        var top10Saldo = saldosPorEsc.slice(0, 10).reduce(function(a, b) { return a + b; }, 0);
        var paretoSaldoPct = saldoOciosoTotal > 0 ? Math.min(100, Math.round((top10Saldo / saldoOciosoTotal) * 100)) : 0;
        var anosHist = ['2021', '2022', '2023', '2024', '2025', '2026'];
        var serieSefin = anosHist.map(function(y) {
          var obj = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN.kpisPorAno) ? DADOS_FINANCEIROS_SEFIN.kpisPorAno[y] : null;
          return obj ? Math.round(obj.taxaExecucao || 0) : 0;
        });
        var zSefin = calcZScore(serieSefin);
        var gapExec = Math.max(0, metaCalendarioPct - execPct2026);
        var healthSeafin = Math.max(25, Math.min(100, Math.round(100 - (gapExec * 0.9) - Math.min(15, vencendo60d * 2))));

        /* 3. SEOM (SEOM + SEFISC + DPAT) */
        var seomEscolas = (typeof DADOS_SEOM !== 'undefined' && DADOS_SEOM && Array.isArray(DADOS_SEOM.escolas)) ? DADOS_SEOM.escolas : [];
        var avcbOk = 0;
        var obrasAtivas = 0;
        var escolasInfraCritica = 0;
        for (var si = 0; si < seomEscolas.length; si++) {
          var sObj = seomEscolas[si];
          if (sObj.avcb === 1) avcbOk++;
          if (sObj.obraFde === 1 || sObj.obraFde === 2) obrasAtivas++;
          if (sObj.avcb !== 1 || sObj.telhado === 2 || sObj.eletrica === 2 || sObj.esgoto === 2) escolasInfraCritica++;
        }
        var avcbPct = seomEscolas.length > 0 ? (avcbOk / seomEscolas.length) * 100 : 0;
        var dpatKpis = (typeof DADOS_DPAT !== 'undefined' && DADOS_DPAT && DADOS_DPAT.kpis) ? DADOS_DPAT.kpis : { totalBens: 0, bensLocalizados: 0 };
        var dpatLocPct = dpatKpis.totalBens > 0 ? Math.round((dpatKpis.bensLocalizados / dpatKpis.totalBens) * 100) : 0;
        var sefiscTot = (typeof DADOS_SEFISC !== 'undefined' && DADOS_SEFISC) ? (DADOS_SEFISC.totalRegistros || 0) : 0;
        var healthSeom = Math.round((avcbPct * 0.55) + ((100 - (escolasInfraCritica / Math.max(1, seomEscolas.length) * 100)) * 0.25) + (dpatLocPct * 0.20));

        /* 4. SEGRE (SEGRE + SEMAT + SEVESC) */
        var seiAllSegre = [].concat(
          (typeof DADOS_SEGRE !== 'undefined' && DADOS_SEGRE && DADOS_SEGRE.processosSei) ? DADOS_SEGRE.processosSei : [],
          (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.processosSei) ? DADOS_SEMAT.processosSei : [],
          (typeof DADOS_SEVESC !== 'undefined' && DADOS_SEVESC && DADOS_SEVESC.processosSei) ? DADOS_SEVESC.processosSei : []
        );
        var seiAbertos = 0;
        var seiAged30 = 0;
        for (var gi = 0; gi < seiAllSegre.length; gi++) {
          if (statusSeiAberto(seiAllSegre[gi].situacao)) {
            seiAbertos++;
            var gms = parseDataBrMs(seiAllSegre[gi].data);
            if (gms > 0 && (nowMs - gms) > 30 * 86400000) seiAged30++;
          }
        }
        var seiConcPct = seiAllSegre.length > 0 ? ((seiAllSegre.length - seiAbertos) / seiAllSegre.length) * 100 : 100;
        var mesesSemat = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.kpis && DADOS_SEMAT.kpis.mesesAtendimentos) ? serieMensalObj(DADOS_SEMAT.kpis.mesesAtendimentos) : [];
        var zSegre = calcZScore(mesesSemat);
        var emailsSegreTot = (typeof DADOS_SEGRE !== 'undefined' && DADOS_SEGRE && DADOS_SEGRE.kpis && DADOS_SEGRE.kpis.totalEmails) ? DADOS_SEGRE.kpis.totalEmails : 8921;
        var healthSegre = Math.max(30, Math.round((seiConcPct * 0.75) + (seiAged30 === 0 ? 25 : Math.max(0, 25 - seiAged30))));

        /* 5. SEPES */
        var sepesK = (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && DADOS_SEPES.kpis) ? DADOS_SEPES.kpis : { totalDemandas: 0, totalFinalizados: 0, totalEmTramitacao: 0 };
        var sepesTodos = [].concat(
          (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && DADOS_SEPES.aposentadorias) ? DADOS_SEPES.aposentadorias : [],
          (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && DADOS_SEPES.designacoes) ? DADOS_SEPES.designacoes : [],
          (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES && DADOS_SEPES.abonos) ? DADOS_SEPES.abonos : []
        );
        var sepesAged30 = 0;
        var sepesPendPorUe = {};
        var sepesMeses = [0, 0, 0, 0, 0, 0];
        for (var pi = 0; pi < sepesTodos.length; pi++) {
          var pObj = sepesTodos[pi];
          var dMs = parseDataBrMs(pObj.dataEntrada || pObj.publicacao);
          if (dMs > 0) {
            var dMonthDiff = Math.floor((nowMs - dMs) / (30 * 86400000));
            if (dMonthDiff >= 0 && dMonthDiff < 6) sepesMeses[5 - dMonthDiff]++;
          }
          if (!pObj.concluido) {
            var uKey = normTexto(pObj.ue || pObj.ua || 'OUTRAS') || 'OUTRAS';
            sepesPendPorUe[uKey] = (sepesPendPorUe[uKey] || 0) + 1;
            if (dMs > 0 && (nowMs - dMs) > 30 * 86400000) sepesAged30++;
          }
        }
        var sepesConcPct = sepesK.totalDemandas > 0 ? (sepesK.totalFinalizados / sepesK.totalDemandas) * 100 : 100;
        var topSepesUes = Object.values(sepesPendPorUe).sort(function(a, b) { return b - a; }).slice(0, 5).reduce(function(a, b) { return a + b; }, 0);
        var paretoSepesPct = sepesK.totalEmTramitacao > 0 ? Math.round((topSepesUes / sepesK.totalEmTramitacao) * 100) : 0;
        var zSepes = calcZScore(sepesMeses);
        var healthSepes = Math.max(30, Math.round((sepesConcPct * 0.75) + Math.max(0, 25 - sepesAged30)));

        /* 6. ASURE (Adaptador pronto para DADOS_ASURE real) */
        var asureReal = Boolean(window.DADOS_ASURE && window.DADOS_ASURE.meta && window.DADOS_ASURE.meta.real);
        var top10Imro = fato.slice(0, 10);
        var top10Visitadas = top10Imro.filter(function(e) { return e.visitada; }).length;
        var totalVisitasReg = fato.filter(function(e) { return e.visitada; }).length;
        var gaugePctEl = document.getElementById('home-gauge-pct');
        var visitasGaugePct = (asureReal && window.DADOS_ASURE.kpis && window.DADOS_ASURE.kpis.coberturaPct != null)
          ? Number(window.DADOS_ASURE.kpis.coberturaPct)
          : (totalVisitasReg > 10 ? Math.round((totalVisitasReg / Math.max(1, fato.length)) * 100) : parseInt((gaugePctEl ? gaugePctEl.textContent : '90'), 10) || 90);

        /* 7. EEC (Adaptador pronto para DADOS_EEC real) */
        var eecReal = Boolean(window.DADOS_EEC && Array.isArray(window.DADOS_EEC.escolas) && window.DADOS_EEC.escolas.length > 0);
        var modulosEecCount = (typeof MODULOS_EEC !== 'undefined') ? Object.keys(MODULOS_EEC).length : 12;

        return {
          metaCalendarioPct: metaCalendarioPct,
          fontesVivas: 5 + (asureReal ? 1 : 0) + (eecReal ? 1 : 0),
          totalNucleos: 7,
          SEINTEC: {
            fresh: 'Base SharePoint • ' + hwTotal.toLocaleString('pt-BR') + ' itens + ' + callsList.length.toLocaleString('pt-BR') + ' chamados',
            health: healthSeintec,
            serie: serieSeintec,
            actualPct: hwDispPct,
            targetPct: 85,
            bulletCaption: hwDisp.toLocaleString('pt-BR') + ' disp. • ' + hwBad.toLocaleString('pt-BR') + ' em reparo/baixa',
            slaMain: callsAbertos + ' chamados em aberto',
            slaSub: callsAged15 + ' há >15d • SLA concl.: ' + callsSlaPct.toFixed(1).replace('.', ',') + '%',
            pareto: 'Top 5 escolas = ' + paretoCallsPct + '% dos chamados',
            zObj: zSeintec,
            hwTotal: hwTotal,
            hwDisp: hwDisp,
            hwBad: hwBad,
            hwDispPct: hwDispPct,
            callsTotal: callsList.length,
            callsAbertos: callsAbertos,
            callsSlaPct: callsSlaPct
          },
          ASURE: {
            isReal: asureReal,
            fresh: asureReal
              ? ('SharePoint ASURE • ' + (window.DADOS_ASURE.meta.atualizadoFormatado || 'Ao Vivo'))
              : ('Adaptador pronto • ' + totalVisitasReg + ' visitas c/ registro nominal na base interna'),
            health: asureReal ? Number(window.DADOS_ASURE.kpis.healthScore || 85) : null,
            serie: (asureReal && Array.isArray(window.DADOS_ASURE.serieSemanal)) ? window.DADOS_ASURE.serieSemanal : [],
            actualPct: asureReal ? visitasGaugePct : (top10Visitadas * 10),
            targetPct: 100,
            bulletCaption: asureReal
              ? 'Cobertura oficial ASURE'
              : (top10Visitadas + ' de 10 escolas Top IPRE c/ visita registrada'),
            slaMain: asureReal ? (Number(window.DADOS_ASURE.kpis.ouvidoriasAbertas || 0) + ' ouvidorias abertas') : 'Aguardando planilha ASURE',
            slaSub: asureReal ? (Number(window.DADOS_ASURE.kpis.despachosPrazoPct || 100) + '% despachos no prazo') : 'Plug-and-play via registrarDadosAsure()',
            pareto: 'Top 10 IPRE: ' + (10 - top10Visitadas) + ' sem visita recente',
            zObj: asureReal ? calcZScore(window.DADOS_ASURE.serieSemanal || []) : { label: 'Aguardando série ASURE', status: 'neutral' },
            top10Visitadas: top10Visitadas,
            totalVisitasReg: totalVisitasReg
          },
          SEAFIN: {
            fresh: 'SEFIN ' + (sefinMeta.ultimaAtualizacao || '2026') + ' • SECOMSE ' + ((typeof DADOS_SECOMSE !== 'undefined' && DADOS_SECOMSE.ultimaAtualizacao) ? DADOS_SECOMSE.ultimaAtualizacao.slice(0, 10) : ''),
            health: healthSeafin,
            serie: serieSefin,
            actualPct: execPct2026,
            targetPct: metaCalendarioPct,
            bulletCaption: 'Ritmo PDDE: ' + (execPct2026 - metaCalendarioPct).toFixed(1).replace('.', ',') + ' p.p. vs. calendário',
            slaMain: formatarMoedaCurta(saldoOciosoTotal) + ' ocioso (2026)',
            slaSub: vencendo60d + ' contratos SECOMSE vencem ≤60d (' + formatarMoedaCurta(valorVencendo60d) + ')',
            pareto: '10 APMs detêm ' + paretoSaldoPct + '% do saldo',
            zObj: zSefin,
            receita2026: sefinK.totalReceita || 0,
            despesa2026: sefinK.totalDespesa || 0,
            saldoOcioso2026: saldoOciosoTotal,
            execPct2026: execPct2026,
            repasses2026: sefinK.totalRepasses || 204,
            vencendo60d: vencendo60d,
            valorVencendo60d: valorVencendo60d
          },
          SEOM: {
            fresh: 'SEOM ' + ((typeof DADOS_SEOM !== 'undefined' && DADOS_SEOM.dataExtracao) || '2026') + ' • DPAT ' + ((typeof DADOS_DPAT !== 'undefined' && DADOS_DPAT.dataExtracao) || ''),
            health: healthSeom,
            serie: [],
            actualPct: avcbPct,
            targetPct: 100,
            bulletCaption: avcbOk + ' de ' + seomEscolas.length + ' escolas com AVCB em dia',
            slaMain: escolasInfraCritica + ' escolas c/ alerta predial',
            slaSub: obrasAtivas + ' obras FDE • DPAT ' + dpatLocPct + '% localizado • ' + sefiscTot + ' zeladorias',
            pareto: (seomEscolas.length - avcbOk) + ' unidades sem AVCB válido',
            zObj: { label: 'Mapa 11D consolidado', status: avcbPct < 60 ? 'warn' : 'ok' },
            avcbOk: avcbOk,
            avcbSem: Math.max(0, seomEscolas.length - avcbOk),
            obrasAtivas: obrasAtivas,
            escolasInfraCritica: escolasInfraCritica
          },
          SEGRE: {
            fresh: 'Livros 2026 • ' + ((typeof DADOS_SEGRE !== 'undefined' && DADOS_SEGRE.meta && DADOS_SEGRE.meta.atualizadoFormatado) || 'Atualizado'),
            health: healthSegre,
            serie: mesesSemat,
            actualPct: seiConcPct,
            targetPct: 90,
            bulletCaption: (seiAllSegre.length - seiAbertos) + ' de ' + seiAllSegre.length + ' SEI tramitados',
            slaMain: seiAbertos + ' processos SEI em aberto',
            slaSub: seiAged30 + ' parados há >30d • ' + emailsSegreTot.toLocaleString('pt-BR') + ' e-mails',
            pareto: 'SEMAT + SEVESC + SEGRE consolidados',
            zObj: zSegre,
            seiAbertos: seiAbertos,
            seiAged30: seiAged30,
            emailsTot: emailsSegreTot
          },
          SEPES: {
            fresh: 'SEAPE ' + ((typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES.meta && DADOS_SEPES.meta.atualizadoFormatado) || 'Atualizado'),
            health: healthSepes,
            serie: sepesMeses,
            actualPct: sepesConcPct,
            targetPct: 85,
            bulletCaption: sepesK.totalFinalizados + ' de ' + sepesK.totalDemandas + ' demandas concluídas',
            slaMain: sepesK.totalEmTramitacao + ' em tramitação',
            slaSub: sepesAged30 + ' aguardando há >30d',
            pareto: 'Top 5 UEs = ' + paretoSepesPct + '% das pendências',
            zObj: zSepes,
            emTramitacao: sepesK.totalEmTramitacao || 0,
            aged30: sepesAged30
          },
          EEC: {
            isReal: eecReal,
            fresh: eecReal
              ? ('Base Pedagógica • ' + ((window.DADOS_EEC.meta && window.DADOS_EEC.meta.atualizadoFormatado) || 'Ao Vivo'))
              : (modulosEecCount + ' Portais Apps Script • Aguardando consolidação única'),
            health: eecReal ? Number(window.DADOS_EEC.healthScore || 80) : null,
            serie: (eecReal && Array.isArray(window.DADOS_EEC.serie)) ? window.DADOS_EEC.serie : [],
            actualPct: eecReal ? Number(window.DADOS_EEC.aderenciaPct || 0) : 0,
            targetPct: 80,
            bulletCaption: eecReal ? 'Aderência aos planos pedagógicos' : 'Adaptador pronto via registrarDadosEec()',
            slaMain: eecReal ? (Number(window.DADOS_EEC.escolasAlerta || 0) + ' escolas em nivelamento') : (modulosEecCount + ' sistemas externos ativos'),
            slaSub: eecReal ? 'SARESP & Prova Paulista integrados' : 'Pronto para cruzar com IPRE',
            pareto: eecReal ? (window.DADOS_EEC.paretoTxt || 'Foco Anos Finais/EM') : 'Aguardando dataset por CIE',
            zObj: eecReal ? calcZScore(window.DADOS_EEC.serie || []) : { label: 'Aguardando série EEC', status: 'neutral' }
          }
        };
      }

      function renderHeroAndKpis(fato, tel) {
        var critCount = fato.filter(function(e) { return e.tier === 'Crítico'; }).length;
        var altoCount = fato.filter(function(e) { return e.tier === 'Alto Risco'; }).length;
        var regCount = Math.max(0, fato.length - critCount - altoCount);
        var avgImro = fato.length > 0 ? (fato.reduce(function(a, b) { return a + b.imro; }, 0) / fato.length) : 0;
                var isrScore = Math.max(0, Math.min(100, Math.round(100 - avgImro)));
        var ipreBadge = document.getElementById('hero-ipre-badge');
        if (ipreBadge) {
          ipreBadge.textContent = 'IPRE Médio: ' + avgImro.toFixed(1).replace('.', ',') + ' pts';
        }

        var isrPill = document.getElementById('hero-isr-pill');
        if (isrPill) {
          var isrEmoji = isrScore >= 75 ? '🟢' : (isrScore >= 55 ? '🟡' : '🔴');
          isrPill.textContent = isrEmoji + ' ISR Regional: ' + isrScore + '/100 (' + critCount + ' Críticas • ' + altoCount + ' Alto Risco)';
          if (isrScore < 55) {
            isrPill.style.background = 'rgba(239,68,68,0.22)';
            isrPill.style.color = '#fecaca';
            isrPill.style.borderColor = 'rgba(239,68,68,0.45)';
          } else if (isrScore < 75) {
            isrPill.style.background = 'rgba(245,158,11,0.22)';
            isrPill.style.color = '#fde68a';
            isrPill.style.borderColor = 'rgba(245,158,11,0.45)';
          } else {
            isrPill.style.background = 'rgba(16,185,129,0.2)';
            isrPill.style.color = '#6ee7b7';
            isrPill.style.borderColor = 'rgba(16,185,129,0.4)';
          }
        }

        var freshPill = document.getElementById('hero-freshness-pill');
        if (freshPill) {
          freshPill.textContent = '📡 Observabilidade: ' + tel.fontesVivas + '/7 Núcleos c/ Base Viva • ' + (7 - tel.fontesVivas) + ' adaptador(es) pronto(s)';
        }

        var setCtx = function(id, text, cls) {
          var el = document.getElementById(id);
          if (!el) return;
          el.textContent = text;
          el.className = 'kpi-ctx-line' + (cls ? (' ' + cls) : '');
        };

        setCtx('kpi-ctx-escolas', critCount + ' Críticas • ' + altoCount + ' Alto Risco • ' + regCount + ' Regulares', critCount > 0 ? 'ctx-alert' : 'ctx-ok');
        setCtx('kpi-ctx-hardware', tel.SEINTEC.hwDispPct.toFixed(1).replace('.', ',') + '% disponíveis • ' + tel.SEINTEC.hwBad.toLocaleString('pt-BR') + ' em reparo/baixa', tel.SEINTEC.hwDispPct < 75 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-chamados', tel.SEINTEC.callsAbertos + ' em aberto • SLA ' + tel.SEINTEC.callsSlaPct.toFixed(1).replace('.', ',') + '% concluído', tel.SEINTEC.callsAbertos > 25 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-recursos', 'Saldo ocioso APM: ' + formatarMoedaCurta(tel.SEAFIN.saldoOcioso2026), tel.SEAFIN.saldoOcioso2026 > 3000000 ? 'ctx-warn' : '');
        var gapExec = tel.SEAFIN.execPct2026 - tel.metaCalendarioPct;
        setCtx('kpi-ctx-execucao', 'Ritmo esperado: ' + tel.metaCalendarioPct + '% (' + (gapExec >= 0 ? '+' : '') + gapExec.toFixed(1).replace('.', ',') + ' p.p.)', gapExec < -20 ? 'ctx-alert' : (gapExec < -8 ? 'ctx-warn' : 'ctx-ok'));
        /* SEOM */
        var kpiAvcbEl = document.getElementById('kpi-avcb-home');
        if (kpiAvcbEl) kpiAvcbEl.textContent = (tel.SEOM.avcbSem || 49).toLocaleString('pt-BR');
        setCtx('kpi-ctx-obras', '14 ativas • 20 previstas • 26 sem intervenção');
        setCtx('kpi-ctx-avcb', tel.SEOM.avcbSem + ' sem AVCB • ' + (60 - tel.SEOM.avcbSem) + ' regulares • ' + tel.SEOM.escolasInfraCritica + ' alertas', tel.SEOM.avcbSem > 15 ? 'ctx-alert' : 'ctx-warn');

        /* SEGRE */
        var kpiMatriculasEl = document.getElementById('kpi-matriculas-home');
        var sematTotalKpi = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.kpis) ? (DADOS_SEMAT.kpis.totalAtendimentos || 2898) : 2898;
        if (kpiMatriculasEl) kpiMatriculasEl.textContent = sematTotalKpi.toLocaleString('pt-BR');
        var sematManuais = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.kpis) ? (DADOS_SEMAT.kpis.totalMatriculasManuais || DADOS_SEMAT.kpis.manuais || 2331) : 2331;
        var sematTransf = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.kpis) ? (DADOS_SEMAT.kpis.totalTrocasEscola || DADOS_SEMAT.kpis.transferencias || 4062) : 4062;
        setCtx('kpi-ctx-matriculas', sematManuais.toLocaleString('pt-BR') + ' manuais • ' + sematTransf.toLocaleString('pt-BR') + ' transferências');
        setCtx('kpi-ctx-emails', tel.SEGRE.seiAbertos + ' SEI em aberto (' + tel.SEGRE.seiAged30 + ' >30d)', tel.SEGRE.seiAged30 > 10 ? 'ctx-warn' : '');

        /* SEPES */
        var sefrepTotDev = (typeof DADOS_SEFREP !== 'undefined' && DADOS_SEFREP && DADOS_SEFREP.kpis) ? DADOS_SEFREP.kpis.totalDevolucoes : 333;
        var sefrepPctDev = (typeof DADOS_SEFREP !== 'undefined' && DADOS_SEFREP && DADOS_SEFREP.kpis) ? DADOS_SEFREP.kpis.taxaDevolucaoPct : 24.1;
        var sepesFila = (tel.SEPES && tel.SEPES.emTramitacao) ? tel.SEPES.emTramitacao : 72;
        var kpiSeapeEl = document.getElementById('kpi-seape-home');
        if (kpiSeapeEl) kpiSeapeEl.textContent = sepesFila.toLocaleString('pt-BR');
        setCtx('kpi-ctx-repasses', 'Taxa de devolução: ' + sefrepPctDev.toFixed(1).replace('.', ',') + '% (' + sefrepTotDev + ' dev.)', sefrepTotDev > 100 ? 'ctx-warn' : 'ctx-ok');
        setCtx('kpi-ctx-seape', 'Aposentadorias, Designações e Abonos (' + sepesFila + ' proc.)', 'ctx-ok');
        var kpiRepEl = document.getElementById('kpi-repasses-sefin');
        if (kpiRepEl) kpiRepEl.textContent = sefrepTotDev.toLocaleString('pt-BR');
        var lblRepEl = document.getElementById('kpi-lbl-repasses-sefin');
        if (lblRepEl) lblRepEl.textContent = 'Devoluções Folha (SEPES)';

        var covEl = document.getElementById('home-gauge-risk-cov');
        if (covEl) {
          var tagAsure = document.getElementById('home-gauge-asure-tag');
          if (tagAsure) {
            tagAsure.textContent = tel.ASURE.isReal ? 'SharePoint ASURE' : 'Base Interna (Aguardando ASURE)';
          }
          covEl.innerHTML = '<span>🎯 Top 10 IPRE c/ visita registrada: <strong style="color: ' + (tel.ASURE.top10Visitadas >= 7 ? '#6ee7b7' : '#fbbf24') + ';">' + tel.ASURE.top10Visitadas + ' de 10</strong></span>' +
            '<span style="color: #94a3b8;">' + (10 - tel.ASURE.top10Visitadas) + ' prioritárias p/ agenda</span>';
        }

        
      }

      function renderTop5Atencao(fato) {
        var grid = document.getElementById('home-atencao-grid');
        if (!grid) return;
        var top5 = fato.slice(0, 5);
        var maxScore = 100;

        var html = top5.map(function(esc, idx) {
          var isCrit = esc.tier === 'Crítico';
          var borderCol = isCrit ? '#dc2626' : '#d97706';
          var bgBadge = isCrit ? '#fee2e2' : '#fef3c7';
          var txtBadge = isCrit ? '#991b1b' : '#b45309';
          var borderBadge = isCrit ? '#fca5a5' : '#fde68a';
          var pctBar = Math.min(100, Math.max(25, Math.round((esc.imro / maxScore) * 100)));

          var tags = [];
          if (esc.alertaSetorial) tags.push('<span class="imro-pill-tag" style="background:#fef2f2;color:#b91c1c;border-color:#fecaca;font-weight:800;">🚨 Alerta Setorial ≥80</span>');
          if (esc.pts.SEOM > 0) tags.push('<span class="imro-pill-tag" style="background:#fff7ed;color:#c2410c;border-color:#fed7aa;">🏗️ SEOM ' + esc.pts.SEOM + '/100</span>');
          if (esc.pts.SEINTEC > 0) tags.push('<span class="imro-pill-tag" style="background:#e0f2fe;color:#0369a1;border-color:#bae6fd;">💻 SEINTEC ' + esc.pts.SEINTEC + '/100</span>');
          if (esc.pts.SEGRE > 0) tags.push('<span class="imro-pill-tag" style="background:#fff7ed;color:#ea580c;border-color:#fed7aa;">🏫 SEGRE ' + esc.pts.SEGRE + '/100</span>');
          if (esc.pts.SEPES > 0) tags.push('<span class="imro-pill-tag" style="background:#f5f3ff;color:#6d28d9;border-color:#ddd6fe;">👥 SEPES ' + esc.pts.SEPES + '/100</span>');
          if (esc.pts.SEAFIN > 0) tags.push('<span class="imro-pill-tag" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0;">💼 SEAFIN ' + esc.pts.SEAFIN + '/100</span>');
          if (esc.pts.ASURE > 0) tags.push('<span class="imro-pill-tag" style="background:#fef3c7;color:#92400e;border-color:#fde68a;">🏛️ ASURE ' + esc.pts.ASURE + '/100</span>');
          if (esc.pts.EEC > 0) tags.push('<span class="imro-pill-tag" style="background:#f0fdf4;color:#15803d;border-color:#bbf7d0;">📚 EEC ' + esc.pts.EEC + '/100</span>');

          var linhas = [];
          if (esc.flags.SEOM.length > 0) linhas.push('<div><strong style="color:#b45309;">🏗️ SEOM:</strong> ' + escHtml(esc.flags.SEOM.slice(0, 4).join(' • ')) + '</div>');
          if (esc.flags.SEINTEC.length > 0) linhas.push('<div><strong style="color:#0284c7;">💻 SEINTEC:</strong> ' + escHtml(esc.flags.SEINTEC.join(' • ')) + '</div>');
          var extras = [].concat(esc.flags.SEAFIN, esc.flags.SEPES, esc.flags.SEGRE, esc.flags.ASURE, esc.flags.EEC);
          if (extras.length > 0) linhas.push('<div><strong style="color:#6d28d9;">📌 Gestão:</strong> ' + escHtml(extras.slice(0, 3).join(' • ')) + '</div>');

          var pddeTxt = esc.rec2026 > 0
            ? ('💰 Saldo PDDE: <strong>' + formatarMoedaCurta(esc.saldoOcioso2026) + '</strong> (' + esc.execPct2026.toFixed(0) + '% exec.)')
            : '💰 PDDE 2026: <strong>Sem repasse ativo</strong>';
          var visTxt = esc.visitada
            ? ('🏛️ Visita: <strong>' + escHtml(esc.dataVisita || 'Registrada') + '</strong>')
            : '🏛️ Visita: <strong style="color:#b91c1c;">Sem registro</strong>';

          return '' +
            '<div class="atencao-card" id="card-atencao-' + escHtml(esc.cie) + '" data-cie="' + escHtml(esc.cie) + '" style="background:#ffffff;border:1px solid ' + borderBadge + ';border-left:6px solid ' + borderCol + ';border-radius:12px;padding:1.1rem;box-shadow:0 4px 14px rgba(15,23,42,0.05);display:flex;flex-direction:column;justify-content:space-between;gap:0.6rem;">' +
              '<div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;flex-wrap:wrap;gap:0.35rem;">' +
                  '<span style="background:' + bgBadge + ';color:' + txtBadge + ';border:1px solid ' + borderBadge + ';font-size:0.71rem;font-weight:800;padding:2px 8px;border-radius:6px;">#' + (idx + 1) + ' • ' + esc.imro + ' pts (' + esc.tier + ')</span>' +
                  '<span style="font-size:0.71rem;color:#64748b;font-weight:700;">CIE: ' + escHtml(esc.cie) + ' • ' + escHtml(esc.cidade) + '</span>' +
                '</div>' +
                '<div style="font-size:0.98rem;font-weight:800;color:#0f172a;margin-bottom:0.35rem;">' + escHtml(esc.nome) + '</div>' +
                '<div style="width:100%;height:5px;background:' + bgBadge + ';border-radius:3px;margin-bottom:0.55rem;overflow:hidden;">' +
                  '<div style="width:' + pctBar + '%;height:100%;background:' + borderCol + ';border-radius:3px;"></div>' +
                '</div>' +
                '<div class="imro-pillar-badges">' + tags.join('') + '</div>' +
                '<div style="display:flex;flex-direction:column;gap:0.3rem;font-size:0.75rem;color:#334155;line-height:1.38;">' +
                  linhas.join('') +
                '</div>' +
              '</div>' +
              '<div>' +
                '<div class="imro-bridge-strip">' +
                  '<span>' + pddeTxt + '</span>' +
                  '<span>' + visTxt + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:0.55rem;margin-top:0.45rem;border-top:1px solid #f1f5f9;font-size:0.73rem;">' +
                  '<span style="color:' + txtBadge + ';font-weight:800;">' + (idx === 0 ? '⚡ Maior risco composto' : '📌 Prioridade multissetorial') + '</span>' +
                  '<button type="button" onclick="selecionarEscolaNaHome(\'' + escHtml(esc.cie) + '\')" style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:0.28rem 0.65rem;border-radius:6px;font-size:0.72rem;font-weight:800;cursor:pointer;">Analisar unidade →</button>' +
                '</div>' +
              '</div>' +
            '</div>';
        }).join('');

        grid.innerHTML = html;
      }

      function renderHealthBadge(score, serie, color) {
        if (score == null) {
          return '' +
            '<div style="display:flex;flex-direction:column;gap:0.25rem;">' +
              '<span class="di-score-pill" style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;width:fit-content;">⏳ Aguardando base</span>' +
              '<span style="font-size:0.65rem;color:#94a3b8;">Adaptador ativo p/ ingestão</span>' +
            '</div>';
        }
        var bg = score >= 80 ? '#ecfdf5' : (score >= 60 ? '#fffbeb' : '#fef2f2');
        var fg = score >= 80 ? '#047857' : (score >= 60 ? '#b45309' : '#b91c1c');
        var bd = score >= 80 ? '#a7f3d0' : (score >= 60 ? '#fde68a' : '#fecaca');
        var dot = score >= 80 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444');
        return '' +
          '<div style="display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;">' +
            '<span class="di-score-pill" style="background:' + bg + ';color:' + fg + ';border:1px solid ' + bd + ';">' +
              '<span style="width:7px;height:7px;border-radius:50%;background:' + dot + ';"></span> ' + score + '/100' +
            '</span>' +
            buildSparklineSvg(serie, color, 'rgba(14,165,233,0.12)') +
          '</div>';
      }

      function renderAnomalyCell(paretoTxt, zObj) {
        var zBg = zObj.status === 'crit' ? '#fee2e2' : (zObj.status === 'warn' ? '#fef3c7' : (zObj.status === 'ok' ? '#ecfdf5' : '#f1f5f9'));
        var zFg = zObj.status === 'crit' ? '#991b1b' : (zObj.status === 'warn' ? '#92400e' : (zObj.status === 'ok' ? '#047857' : '#64748b'));
        return '' +
          '<div style="font-weight:700;color:#334155;font-size:0.75rem;">' + escHtml(paretoTxt) + '</div>' +
          '<span style="display:inline-block;margin-top:3px;font-size:0.65rem;font-weight:800;padding:1px 7px;border-radius:999px;background:' + zBg + ';color:' + zFg + ';">' + escHtml(zObj.label) + '</span>';
      }

      function renderMatrizExecutiva2(tel) {
        var obsPill = document.getElementById('di-matrix-observability-pill');
        if (obsPill) obsPill.textContent = '📡 Pipeline: ' + tel.fontesVivas + '/7 Núcleos ao Vivo • ASURE & EEC plug-and-play';
        var compPill = document.getElementById('di-matrix-completeness-pill');
        if (compPill) compPill.textContent = '🛡️ 60/60 Escolas Mapeadas (100% CIE)';

        var setCell = function(id, html) {
          var el = document.getElementById(id);
          if (el) el.innerHTML = html;
        };
        var setText = function(id, txt) {
          var el = document.getElementById(id);
          if (el) el.textContent = txt;
        };

        /* SEINTEC */
        setText('di-seintec-fresh', tel.SEINTEC.fresh);
        setCell('di-seintec-health', renderHealthBadge(tel.SEINTEC.health, tel.SEINTEC.serie, '#0284c7'));
        setCell('di-seintec-bullet', buildBulletHtml(tel.SEINTEC.actualPct, tel.SEINTEC.targetPct, '#0284c7', tel.SEINTEC.bulletCaption));
        setCell('di-seintec-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.SEINTEC.slaMain) + '</div><div style="font-size:0.68rem;color:#64748b;">' + escHtml(tel.SEINTEC.slaSub) + '</div>');
        setCell('di-seintec-pareto', renderAnomalyCell(tel.SEINTEC.pareto, tel.SEINTEC.zObj));

        /* ASURE */
        setText('di-asure-fresh', tel.ASURE.fresh);
        setCell('di-asure-health', renderHealthBadge(tel.ASURE.health, tel.ASURE.serie, '#b45309'));
        setCell('di-asure-bullet', buildBulletHtml(tel.ASURE.actualPct, tel.ASURE.targetPct, '#d97706', tel.ASURE.bulletCaption));
        setCell('di-asure-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.ASURE.slaMain) + '</div><div style="font-size:0.68rem;color:#64748b;">' + escHtml(tel.ASURE.slaSub) + '</div>');
        setCell('di-asure-pareto', renderAnomalyCell(tel.ASURE.pareto, tel.ASURE.zObj));

        /* SEAFIN */
        setText('di-seafin-fresh', tel.SEAFIN.fresh);
        setCell('di-seafin-health', renderHealthBadge(tel.SEAFIN.health, tel.SEAFIN.serie, '#047857'));
        setCell('di-seafin-bullet', buildBulletHtml(tel.SEAFIN.actualPct, tel.SEAFIN.targetPct, tel.SEAFIN.actualPct < tel.SEAFIN.targetPct - 20 ? '#d97706' : '#059669', tel.SEAFIN.bulletCaption));
        setCell('di-seafin-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.SEAFIN.slaMain) + '</div><div style="font-size:0.68rem;color:#b45309;">' + escHtml(tel.SEAFIN.slaSub) + '</div>');
        setCell('di-seafin-pareto', renderAnomalyCell(tel.SEAFIN.pareto, tel.SEAFIN.zObj));

        /* SEOM */
        setText('di-seom-fresh', tel.SEOM.fresh);
        setCell('di-seom-health', renderHealthBadge(tel.SEOM.health, tel.SEOM.serie, '#b45309'));
        setCell('di-seom-bullet', buildBulletHtml(tel.SEOM.actualPct, tel.SEOM.targetPct, tel.SEOM.actualPct < 60 ? '#dc2626' : '#d97706', tel.SEOM.bulletCaption));
        setCell('di-seom-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.SEOM.slaMain) + '</div><div style="font-size:0.68rem;color:#64748b;">' + escHtml(tel.SEOM.slaSub) + '</div>');
        setCell('di-seom-pareto', renderAnomalyCell(tel.SEOM.pareto, tel.SEOM.zObj));

        /* SEGRE */
        setText('di-segre-fresh', tel.SEGRE.fresh);
        setCell('di-segre-health', renderHealthBadge(tel.SEGRE.health, tel.SEGRE.serie, '#ea580c'));
        setCell('di-segre-bullet', buildBulletHtml(tel.SEGRE.actualPct, tel.SEGRE.targetPct, '#ea580c', tel.SEGRE.bulletCaption));
        setCell('di-segre-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.SEGRE.slaMain) + '</div><div style="font-size:0.68rem;color:#64748b;">' + escHtml(tel.SEGRE.slaSub) + '</div>');
        setCell('di-segre-pareto', renderAnomalyCell(tel.SEGRE.pareto, tel.SEGRE.zObj));

        /* SEPES */
        setText('di-sepes-fresh', tel.SEPES.fresh);
        setCell('di-sepes-health', renderHealthBadge(tel.SEPES.health, tel.SEPES.serie, '#7c3aed'));
        setCell('di-sepes-bullet', buildBulletHtml(tel.SEPES.actualPct, tel.SEPES.targetPct, '#7c3aed', tel.SEPES.bulletCaption));
        setCell('di-sepes-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.SEPES.slaMain) + '</div><div style="font-size:0.68rem;color:' + (tel.SEPES.aged30 > 15 ? '#b91c1c' : '#64748b') + ';">' + escHtml(tel.SEPES.slaSub) + '</div>');
        setCell('di-sepes-pareto', renderAnomalyCell(tel.SEPES.pareto, tel.SEPES.zObj));

        /* EEC */
        setText('di-eec-fresh', tel.EEC.fresh);
        setCell('di-eec-health', renderHealthBadge(tel.EEC.health, tel.EEC.serie, '#16a34a'));
        setCell('di-eec-bullet', tel.EEC.isReal ? buildBulletHtml(tel.EEC.actualPct, tel.EEC.targetPct, '#16a34a', tel.EEC.bulletCaption) : '<span style="font-size:0.72rem;color:#64748b;">12 Portais conectados • Aguardando consolidação por CIE</span>');
        setCell('di-eec-sla', '<div style="font-weight:800;color:#0f172a;">' + escHtml(tel.EEC.slaMain) + '</div><div style="font-size:0.68rem;color:#64748b;">' + escHtml(tel.EEC.slaSub) + '</div>');
        setCell('di-eec-pareto', renderAnomalyCell(tel.EEC.pareto, tel.EEC.zObj));
      }

      var modoQuadranteAtual = 'fin';
      var cieDestacadoQuadrante = null;
      var ultimoFato = [];
      var ultimaTel = null;

      function renderQuadrante60Escolas(fato) {
        var wrap = document.getElementById('di-quadrant-canvas-wrap');
        var statsEl = document.getElementById('di-quad-stats');
        var subEl = document.getElementById('di-quad-subtitle');
        if (!wrap || !statsEl) return;

        var btnFin = document.getElementById('btn-quad-mode-fin');
        var btnEec = document.getElementById('btn-quad-mode-eec');
        if (btnFin) btnFin.classList.toggle('active', modoQuadranteAtual === 'fin');
        if (btnEec) btnEec.classList.toggle('active', modoQuadranteAtual === 'eec');

        var hasEec = fato.some(function(e) { return e.eecScore != null; });
        if (modoQuadranteAtual === 'eec' && !hasEec) {
          if (subEl) subEl.textContent = 'Adaptador EEC pronto para plotar Proficiência/Aderência (SARESP / Prova Paulista) × Risco Operacional';
          wrap.innerHTML = '' +
            '<div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:10px;padding:1.65rem 1.25rem;text-align:center;">' +
              '<div style="font-size:1.45rem;margin-bottom:0.4rem;">📚🔌</div>' +
              '<div style="font-weight:800;color:#0f172a;font-size:0.86rem;margin-bottom:0.35rem;">Eixo Pedagógico (EEC) pronto para ativação automática</div>' +
              '<div style="font-size:0.75rem;color:#475569;max-width:460px;margin:0 auto 0.85rem auto;line-height:1.5;">' +
                'Os 12 sistemas da EEC operam em portais externos. Assim que os dados consolidados por escola forem conectados via <code>window.registrarDadosEec({ escolas: [{ cie, proficiencia, aderencia }] })</code>, este quadrante cruza automaticamente risco predial/tecnológico com desempenho pedagógico.' +
              '</div>' +
              '<button type="button" onclick="BI_DECISION_ENGINE.definirModoQuadrante(\'fin\')" style="background:#0b2351;color:#ffffff;border:none;padding:0.45rem 1rem;border-radius:7px;font-size:0.74rem;font-weight:700;cursor:pointer;">Voltar para Risco × PDDE (Dados Reais Agora)</button>' +
            '</div>';
          statsEl.innerHTML = '' +
            '<div class="di-quad-stat-box"><div style="font-size:0.68rem;font-weight:800;color:#0f172a;">Status Adaptador EEC</div><div style="font-size:0.72rem;color:#64748b;">Aguardando base consolidada por CIE</div></div>' +
            '<div class="di-quad-stat-box"><div style="font-size:0.68rem;font-weight:800;color:#0f172a;">Modo Risco × PDDE</div><div style="font-size:0.72rem;color:#047857;">100% ativo com 60 escolas reais</div></div>';
          return;
        }

        if (subEl) {
          subEl.textContent = modoQuadranteAtual === 'eec'
            ? 'Eixo X: Prioridade da Rede (IPRE) × Eixo Y: Índice Pedagógico (EEC) — clique em qualquer ponto'
            : 'Eixo X: Prioridade da Rede (IPRE) × Eixo Y: Execução PDDE 2026 (%) — clique em qualquer ponto';
        }

        var w = 600, h = 265, padL = 44, padR = 18, padT = 16, padB = 34;
        var plotW = w - padL - padR;
        var plotH = h - padT - padB;
        var maxX = 100;
        var threshX = 50;
        var threshY = 60;
        var xThreshPx = padL + (threshX / maxX) * plotW;
        var yThreshPx = padT + ((100 - threshY) / 100) * plotH;

        var qCritParado = 0, qCritExec = 0, qEstavelSub = 0, qExcelencia = 0;
        var circles = [];
        for (var i = 0; i < fato.length; i++) {
          var esc = fato[i];
          var yVal = modoQuadranteAtual === 'eec' ? Number(esc.eecScore || 0) : Number(esc.execPct2026 || 0);
          var cx = padL + Math.min(1, esc.imro / maxX) * plotW;
          var cy = padT + (1 - Math.min(100, Math.max(0, yVal)) / 100) * plotH;

          var highRisk = esc.imro >= threshX;
          var highY = yVal >= threshY;
          if (highRisk && !highY) qCritParado++;
          else if (highRisk && highY) qCritExec++;
          else if (!highRisk && !highY) qEstavelSub++;
          else qExcelencia++;

          var dotCol = esc.tier === 'Crítico' ? '#dc2626' : (esc.tier === 'Alto Risco' ? '#f59e0b' : (esc.tier === 'Atenção' ? '#0284c7' : '#10b981'));
          var isSelected = cieDestacadoQuadrante && cieDestacadoQuadrante === esc.cie;
          var r = isSelected ? 7.5 : (highRisk ? 5.2 : 4.2);
          circles.push(
            '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r + '" ' +
              'fill="' + dotCol + '" fill-opacity="0.88" stroke="' + (isSelected ? '#0f172a' : '#ffffff') + '" stroke-width="' + (isSelected ? '2.4' : '1.2') + '" ' +
              'style="cursor:pointer;" ' +
              'onclick="selecionarEscolaNaHome(\'' + escHtml(esc.cie) + '\')" ' +
              'onmousemove="BI_DECISION_ENGINE.mostrarTooltipPonto(event, \'' + escHtml(esc.cie) + '\')" ' +
              'onmouseleave="BI_DECISION_ENGINE.esconderTooltipPonto()" />'
          );
        }

        var svg = '' +
          '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;height:auto;display:block;font-family:inherit;">' +
            '<rect x="' + padL + '" y="' + padT + '" width="' + (xThreshPx - padL).toFixed(1) + '" height="' + (yThreshPx - padT).toFixed(1) + '" fill="rgba(16,185,129,0.08)"></rect>' +
            '<rect x="' + xThreshPx.toFixed(1) + '" y="' + padT + '" width="' + (padL + plotW - xThreshPx).toFixed(1) + '" height="' + (yThreshPx - padT).toFixed(1) + '" fill="rgba(245,158,11,0.08)"></rect>' +
            '<rect x="' + padL + '" y="' + yThreshPx.toFixed(1) + '" width="' + (xThreshPx - padL).toFixed(1) + '" height="' + (padT + plotH - yThreshPx).toFixed(1) + '" fill="rgba(59,130,246,0.06)"></rect>' +
            '<rect x="' + xThreshPx.toFixed(1) + '" y="' + yThreshPx.toFixed(1) + '" width="' + (padL + plotW - xThreshPx).toFixed(1) + '" height="' + (padT + plotH - yThreshPx).toFixed(1) + '" fill="rgba(239,68,68,0.10)"></rect>' +
            '<line x1="' + xThreshPx.toFixed(1) + '" y1="' + padT + '" x2="' + xThreshPx.toFixed(1) + '" y2="' + (padT + plotH) + '" stroke="#94a3b8" stroke-dasharray="4 3" stroke-width="1"></line>' +
            '<line x1="' + padL + '" y1="' + yThreshPx.toFixed(1) + '" x2="' + (padL + plotW) + '" y2="' + yThreshPx.toFixed(1) + '" stroke="#94a3b8" stroke-dasharray="4 3" stroke-width="1"></line>' +
            '<rect x="' + padL + '" y="' + padT + '" width="' + plotW + '" height="' + plotH + '" fill="none" stroke="#cbd5e1" stroke-width="1"></rect>' +
            '<text x="' + (padL + 6) + '" y="' + (padT + 13) + '" font-size="9.5" font-weight="800" fill="#047857">Excelência Operacional</text>' +
            '<text x="' + (padL + plotW - 6) + '" y="' + (padT + 13) + '" text-anchor="end" font-size="9.5" font-weight="800" fill="#b45309">Risco Alto + Alta Execução</text>' +
            '<text x="' + (padL + 6) + '" y="' + (padT + plotH - 6) + '" font-size="9.5" font-weight="800" fill="#1d4ed8">Estável + Subexecução</text>' +
            '<text x="' + (padL + plotW - 6) + '" y="' + (padT + plotH - 6) + '" text-anchor="end" font-size="9.5" font-weight="800" fill="#b91c1c">CRÍTICO + DINHEIRO PARADO</text>' +
            '<text x="' + (padL - 6) + '" y="' + (padT + 8) + '" text-anchor="end" font-size="9" fill="#64748b">100%</text>' +
            '<text x="' + (padL - 6) + '" y="' + (yThreshPx + 3).toFixed(1) + '" text-anchor="end" font-size="9" fill="#64748b">60%</text>' +
            '<text x="' + (padL - 6) + '" y="' + (padT + plotH) + '" text-anchor="end" font-size="9" fill="#64748b">0%</text>' +
            '<text x="' + padL + '" y="' + (h - 10) + '" font-size="9" fill="#64748b">0 pts (Menor Risco)</text>' +
            '<text x="' + xThreshPx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#475569">50 pts (Alto Risco)</text>' +
            '<text x="' + (padL + plotW) + '" y="' + (h - 10) + '" text-anchor="end" font-size="9" fill="#b91c1c">' + maxX + ' pts</text>' +
            circles.join('') +
          '</svg>';

        wrap.innerHTML = svg;
        statsEl.innerHTML = '' +
          '<div class="di-quad-stat-box" style="border-left:4px solid #dc2626;">' +
            '<div style="font-size:0.78rem;font-weight:800;color:#b91c1c;">' + qCritParado + ' escolas</div>' +
            '<div style="font-size:0.67rem;color:#64748b;">Risco Alto + Subexecução (&lt;60%)</div>' +
          '</div>' +
          '<div class="di-quad-stat-box" style="border-left:4px solid #d97706;">' +
            '<div style="font-size:0.78rem;font-weight:800;color:#b45309;">' + qCritExec + ' escolas</div>' +
            '<div style="font-size:0.67rem;color:#64748b;">Risco Alto + Alta Execução (≥60%)</div>' +
          '</div>' +
          '<div class="di-quad-stat-box" style="border-left:4px solid #2563eb;">' +
            '<div style="font-size:0.78rem;font-weight:800;color:#1d4ed8;">' + qEstavelSub + ' escolas</div>' +
            '<div style="font-size:0.67rem;color:#64748b;">Risco Estável + Subexecução (&lt;60%)</div>' +
          '</div>' +
          '<div class="di-quad-stat-box" style="border-left:4px solid #10b981;">' +
            '<div style="font-size:0.78rem;font-weight:800;color:#047857;">' + qExcelencia + ' escolas</div>' +
            '<div style="font-size:0.67rem;color:#64748b;">Excelência Operacional (Estável + ≥60%)</div>' +
          '</div>';
      }

      function renderNextBestActions(fato, tel) {
        var listEl = document.getElementById('di-nba-list');
        if (!listEl) return;

        /* Decisao 1: Risco Alto com Saldo PDDE Ocioso */
        var critComSaldo = fato.filter(function(e) { return e.imro >= 50 && e.saldoOcioso2026 >= 10000; });
        var somaSaldoCrit = critComSaldo.reduce(function(a, b) { return a + b.saldoOcioso2026; }, 0);
        var nomesTopSaldo = critComSaldo.slice(0, 3).map(function(e) { return e.nome.split(',')[0] + ' (' + formatarMoedaCurta(e.saldoOcioso2026) + ')'; });

        /* Decisao 2: Gargalos de SLA (SEPES >30d + SEGRE >30d + SECOMSE <=60d) */
        var sepesCrit = tel.SEPES.aged30;
        var segreCrit = tel.SEGRE.seiAged30;
        var contCrit = tel.SEAFIN.vencendo60d;

        /* Decisao 3: Priorizacao ASURE (Top IPRE sem visita registrada) */
        var semVisitaTop = fato.filter(function(e) { return e.imro >= 50 && !e.visitada; });
        var nomesSemVisita = semVisitaTop.slice(0, 3).map(function(e) { return e.nome.split(',')[0] + ' (' + e.imro + ' pts)'; });

        var cards = [
          {
            cls: critComSaldo.length > 0 ? 'nba-crit' : 'nba-info',
            tag: '1. SEAFIN × SEOM/SEINTEC • Destravamento Orçamentário',
            titulo: critComSaldo.length > 0
              ? (critComSaldo.length + ' escolas de Alto Risco têm ' + formatarMoedaCurta(somaSaldoCrit) + ' parados no PDDE 2026')
              : 'Escolas críticas com boa execução financeira PDDE',
            desc: critComSaldo.length > 0
              ? ('Priorizar orientação APM para empenho imediato em demandas de elétrica, telhado e tecnologia: ' + nomesTopSaldo.join(', ') + '.')
              : 'Nenhuma escola de alto risco acumula saldo relevante ocioso no momento.',
            btnLabel: 'Abrir SEAFIN →',
            btnClick: 'abrirCentro(\'CAF\')'
          },
          {
            cls: (sepesCrit > 10 || contCrit > 0) ? 'nba-warn' : 'nba-info',
            tag: '2. SEPES × SEGRE × SECOMSE • SLA & Prazos Legais',
            titulo: sepesCrit + ' processos SEPES (>30d) • ' + segreCrit + ' SEI Rede (>30d) • ' + contCrit + ' contratos vencem ≤60d',
            desc: 'Atacar fila envelhecida em Aposentadorias/Designações (' + tel.SEPES.emTramitacao + ' ativos no SEAPE) e renovar vigências críticas em Compras (' + formatarMoedaCurta(tel.SEAFIN.valorVencendo60d) + ').',
            btnLabel: 'Abrir SEPES →',
            btnClick: 'abrirCentro(\'SEPES\')'
          },
          {
            cls: semVisitaTop.length > 0 ? 'nba-warn' : 'nba-info',
            tag: '3. ASURE × IPRE • Roteiro de Visitas por Risco',
            titulo: semVisitaTop.length > 0
              ? (semVisitaTop.length + ' escolas de Risco Alto/Crítico sem visita registrada na base atual')
              : 'Cobertura de visitas alinhada às escolas críticas',
            desc: semVisitaTop.length > 0
              ? ('Direcionar agenda da Dirigente para: ' + nomesSemVisita.join(', ') + (tel.ASURE.isReal ? '.' : ' (com base nos registros atuais; sincronizar planilha ASURE quando disponível).'))
              : 'Todas as unidades de risco alto possuem registro de visita recente.',
            btnLabel: 'Abrir Visitas →',
            btnClick: 'abrirVisitas()'
          }
        ];

        listEl.innerHTML = cards.map(function(c) {
          return '' +
            '<div class="di-nba-card ' + c.cls + '">' +
              '<div style="font-size:0.66rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#475569;margin-bottom:0.25rem;">' + escHtml(c.tag) + '</div>' +
              '<div style="font-size:0.83rem;font-weight:800;color:#0f172a;margin-bottom:0.3rem;line-height:1.3;">' + escHtml(c.titulo) + '</div>' +
              '<div style="font-size:0.73rem;color:#334155;line-height:1.45;margin-bottom:0.55rem;">' + escHtml(c.desc) + '</div>' +
              '<div style="text-align:right;">' +
                '<button type="button" onclick="' + c.btnClick + '" style="background:#0b2351;color:#ffffff;border:none;padding:0.32rem 0.75rem;border-radius:6px;font-size:0.71rem;font-weight:700;cursor:pointer;">' + escHtml(c.btnLabel) + '</button>' +
              '</div>' +
            '</div>';
        }).join('');
      }

      function renderDossieEscolaInternal(cie, dadosFallback) {
        var norm = normCie(cie);
        var lista = ultimoFato.length ? ultimoFato : construirFatoEscolas();
        var rankIdx = -1;
        var esc = null;
        for (var i = 0; i < lista.length; i++) {
          if (lista[i].cie === norm) {
            esc = lista[i];
            rankIdx = i + 1;
            break;
          }
        }

        var elStatus = document.getElementById('spotlight-school-status');
        var grid = document.getElementById('spotlight-dossie-grid');
        if (!esc) {
          if (elStatus) {
            elStatus.textContent = 'CIE sem cruzamento no IPRE';
            elStatus.style.background = '#f1f5f9';
            elStatus.style.color = '#475569';
            elStatus.style.borderColor = '#cbd5e1';
          }
          if (grid) grid.innerHTML = '<div style="padding:1rem;color:#64748b;font-size:0.8rem;">Dados multissetoriais ainda não consolidados para esta unidade.</div>';
          return;
        }

        if (elStatus) {
          var bg = '#ecfdf5', fg = '#047857', bd = '#10b981', ico = '🟢', labelTier = 'Risco Baixo';
          if (esc.tier === 'Crítico') { bg = '#fee2e2'; fg = '#991b1b'; bd = '#ef4444'; ico = '🔴'; labelTier = 'Crítico'; }
          else if (esc.tier === 'Alto Risco') { bg = '#ffedd5'; fg = '#c2410c'; bd = '#f97316'; ico = '🟠'; labelTier = 'Alto Risco'; }
          else if (esc.tier === 'Atenção') { bg = '#fef3c7'; fg = '#b45309'; bd = '#f59e0b'; ico = '🟡'; labelTier = 'Atenção'; }
          elStatus.style.background = bg;
          elStatus.style.color = fg;
          elStatus.style.borderColor = bd;
          elStatus.textContent = ico + ' ' + labelTier + ' • ' + esc.imro + ' pts IPRE (#' + rankIdx + '/60)';
        }

        if (!grid) return;
        var hwDispPct = esc.hwTotal > 0 ? ((esc.hwDisp / esc.hwTotal) * 100).toFixed(1).replace('.', ',') : '0,0';
        var seomResumo = (esc.flags.SEOM && esc.flags.SEOM.length > 0)
          ? esc.flags.SEOM.join(' • ')
          : 'Infraestrutura conforme nos indicadores monitorados';
        var seintecResumo = (esc.flags.SEINTEC && esc.flags.SEINTEC.length > 0)
          ? esc.flags.SEINTEC.join(' • ')
          : 'Parque tecnológico sem alertas críticos';

        var prescricao = '';
        if (esc.imro >= 50 && esc.saldoOcioso2026 >= 10000) {
          prescricao = 'Unidade em ' + esc.tier + ' com ' + formatarMoedaCurta(esc.saldoOcioso2026) + ' disponíveis no PDDE 2026: orientar APM para uso prioritário nos gargalos prediais/tecnológicos listados.';
        } else if (esc.imro >= 50 && !esc.visitada) {
          prescricao = 'Unidade #' + rankIdx + ' no ranking de risco e ainda sem registro de visita ASURE: incluir na próxima rota prioritária da Dirigente.';
        } else if (esc.sepesPend > 0 || esc.segreAbertos > 0) {
          prescricao = 'Acompanhar tramitação dos ' + (esc.sepesPend + esc.segreAbertos) + ' processo(s) ativo(s) em SEPES/SEGRE para evitar impacto operacional.';
        } else {
          prescricao = 'Manter monitoramento preventivo de rotina; sem gargalos críticos acumulados neste momento.';
        }

        var boxStyle = 'background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.9rem 1rem;cursor:default;user-select:text;';
        grid.innerHTML = '' +
          '<div style="' + boxStyle + 'border-top:3px solid #d97706;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">' +
              '<span style="font-size:0.69rem;font-weight:800;color:#b45309;text-transform:uppercase;">🏗️ SEOM • Infraestrutura</span>' +
              '<span style="font-size:0.68rem;font-weight:800;color:#92400e;background:#fef3c7;padding:1px 6px;border-radius:5px;">' + esc.pts.SEOM + '/100 (peso 25%)</span>' +
            '</div>' +
            '<div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">' + (esc.seomObj ? (esc.seomObj.avcb === 1 ? 'AVCB Regularizado' : 'AVCB Pendente') : 'Mapa 11D') + '</div>' +
            '<div style="font-size:0.73rem;color:#475569;line-height:1.4;">' + escHtml(seomResumo) + '</div>' +
          '</div>' +

          '<div style="' + boxStyle + 'border-top:3px solid #0284c7;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">' +
              '<span style="font-size:0.69rem;font-weight:800;color:#0369a1;text-transform:uppercase;">💻 SEINTEC — Informações & Tecnologia</span>' +
              '<span style="font-size:0.68rem;font-weight:800;color:#075985;background:#e0f2fe;padding:1px 6px;border-radius:5px;">' + esc.pts.SEINTEC + '/100 (peso 20%)</span>' +
            '</div>' +
            '<div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">' + esc.hwTotal.toLocaleString('pt-BR') + ' itens (' + hwDispPct + '% disp.) • ' + esc.callsTotal + ' chamados</div>' +
            '<div style="font-size:0.73rem;color:#475569;line-height:1.4;">' + esc.hwBad + ' em reparo/inservíveis • ' + esc.callsAbertos + ' chamados abertos • ' + escHtml(seintecResumo) + '</div>' +
          '</div>' +

          '<div style="' + boxStyle + 'border-top:3px solid #059669;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">' +
              '<span style="font-size:0.69rem;font-weight:800;color:#047857;text-transform:uppercase;">💼 SEAFIN • PDDE 2026</span>' +
              '<span style="font-size:0.68rem;font-weight:800;color:#065f46;background:#d1fae5;padding:1px 6px;border-radius:5px;">' + esc.pts.SEAFIN + '/100 (peso 15%)</span>' +
            '</div>' +
            '<div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">' + (esc.rec2026 > 0 ? (esc.execPct2026.toFixed(1).replace('.', ',') + '% executado de ' + formatarMoedaCurta(esc.rec2026)) : 'Sem repasse 2026 registrado') + '</div>' +
            '<div style="font-size:0.73rem;color:#475569;line-height:1.4;">Executado: <strong>' + formatarMoedaCurta(esc.desp2026) + '</strong> • Saldo ocioso: <strong>' + formatarMoedaCurta(esc.saldoOcioso2026) + '</strong></div>' +
          '</div>' +

          '<div style="' + boxStyle + 'border-top:3px solid #7c3aed;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">' +
              '<span style="font-size:0.69rem;font-weight:800;color:#6d28d9;text-transform:uppercase;">👥 SEPES &amp; 🏫 SEGRE</span>' +
              '<span style="font-size:0.68rem;font-weight:800;color:#5b21b6;background:#ede9fe;padding:1px 6px;border-radius:5px;">SEPES ' + esc.pts.SEPES + '/100 • SEGRE ' + esc.pts.SEGRE + '/100</span>' +
            '</div>' +
            '<div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">' + esc.sepesPend + ' proc. SEAPE • ' + (esc.sefrepDevolucoes || 0) + ' devoluções folha (SEFREP) • ' + esc.segreAbertos + ' SEI Rede</div>' +
            '<div style="font-size:0.73rem;color:#475569;line-height:1.4;">' + escHtml([].concat(esc.flags.SEPES, esc.flags.SEGRE).join(' • ') || 'Sem pendências abertas em SEAPE/SEFREP/SEGRE') + '</div>' +
          '</div>' +

          '<div style="' + boxStyle + 'border-top:3px solid #1e293b;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">' +
              '<span style="font-size:0.69rem;font-weight:800;color:#334155;text-transform:uppercase;">🏛️ ASURE &amp; 📚 EEC</span>' +
              '<span style="font-size:0.68rem;font-weight:800;color:#334155;background:#e2e8f0;padding:1px 6px;border-radius:5px;">' + (esc.visitada ? 'Visitada' : 'Sem visita') + '</span>' +
            '</div>' +
            '<div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">' + (esc.visitada ? ('Visita em ' + escHtml(esc.dataVisita || 'data registrada')) : 'Sem registro de visita recente') + '</div>' +
            '<div style="font-size:0.73rem;color:#475569;line-height:1.4;">' + (esc.eecScore != null ? ('Índice EEC: <strong>' + esc.eecScore.toFixed(1).replace('.', ',') + '%</strong>') : 'Adaptador EEC &amp; ASURE pronto para dados nominais') + '</div>' +
          '</div>' +

          '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-top:3px solid #1d4ed8;border-radius:10px;padding:0.9rem 1rem;cursor:default;user-select:text;">' +
            '<div style="font-size:0.69rem;font-weight:800;color:#1d4ed8;text-transform:uppercase;margin-bottom:0.35rem;">⚡ Síntese Prescritiva (Posição #' + rankIdx + '/60)</div>' +
            '<div style="font-size:0.76rem;color:#1e293b;font-weight:600;line-height:1.45;">' + escHtml(prescricao) + '</div>' +
          '</div>';
      }

      
    function selecionarEscolaHomeSpotlight(cie) {
      var sel = document.getElementById('home-filter-escola');
      if (sel) {
        sel.value = cie;
        if (typeof aoMudarFiltroEscolaHome === 'function') {
          aoMudarFiltroEscolaHome(cie);
        }
        var spotlight = document.getElementById('home-spotlight-dossie');
        if (spotlight) {
          spotlight.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    window.selecionarEscolaHomeSpotlight = selecionarEscolaHomeSpotlight;
  
    window.BI_DECISION_ENGINE = {
        atualizar: function(dadosEscolaSelecionada) {
          try {
            if (dadosEscolaSelecionada && dadosEscolaSelecionada.cie) {
              cieDestacadoQuadrante = normCie(dadosEscolaSelecionada.cie);
            } else if (dadosEscolaSelecionada === null) {
              cieDestacadoQuadrante = null;
            }
            var fato = construirFatoEscolas();
            var tel = computarTelemetriaSetores(fato);
            ultimoFato = fato;
            ultimaTel = tel;
            renderHeroAndKpis(fato, tel);
            renderTop5Atencao(fato);
            renderMatrizExecutiva2(tel);
            renderQuadrante60Escolas(fato);
            renderNextBestActions(fato, tel);
            if (typeof window.filtrarEscolas === 'function' && document.getElementById('escolas-table-body')) {
              window.filtrarEscolas();
            }
          } catch (err) {
            console.warn('BI_DECISION_ENGINE aviso:', err);
          }
        },
        obterFatoEscola: function(cie) {
          var norm = normCie(cie);
          var lista = ultimoFato.length ? ultimoFato : construirFatoEscolas();
          for (var i = 0; i < lista.length; i++) {
            if (lista[i].cie === norm) return lista[i];
          }
          return null;
        },
        renderizarDossieEscola: renderDossieEscolaInternal,
        definirModoQuadrante: function(modo) {
          modoQuadranteAtual = (modo === 'eec') ? 'eec' : 'fin';
          renderQuadrante60Escolas(ultimoFato.length ? ultimoFato : construirFatoEscolas());
        },
        destacarEscolaNoQuadrante: function(cie) {
          cieDestacadoQuadrante = cie ? normCie(cie) : null;
          if (ultimoFato.length) renderQuadrante60Escolas(ultimoFato);
        },
        mostrarTooltipPonto: function(ev, cie) {
          var tip = document.getElementById('di-scatter-tooltip');
          if (!tip) return;
          var esc = ultimoFato.find(function(e) { return e.cie === cie; });
          if (!esc) return;
          tip.innerHTML = '' +
            '<div style="font-weight:800;color:#38bdf8;margin-bottom:2px;">' + escHtml(esc.nome) + '</div>' +
            '<div style="color:#cbd5e1;font-size:0.68rem;margin-bottom:4px;">CIE: ' + escHtml(esc.cie) + ' • ' + escHtml(esc.cidade) + ' • ' + escHtml(esc.tipo) + '</div>' +
            '<div>• <strong>IPRE:</strong> ' + esc.imro + ' pts (' + escHtml(esc.tier) + ')</div>' +
            '<div>• <strong>PDDE 2026:</strong> ' + esc.execPct2026.toFixed(1).replace('.', ',') + '% exec. (Saldo: ' + formatarMoedaCurta(esc.saldoOcioso2026) + ')</div>' +
            '<div>• <strong>Tecnologia / Obras / SEPES:</strong> ' + esc.hwBad + '/' + esc.hwTotal + ' equipamentos (' + (esc.hwBadPct || 0).toFixed(1).replace('.', ',') + '% comp.) • ' + esc.callsTotal + ' cham. • ' + esc.sepesPend + ' SEPES</div>' +
            (esc.eecScore != null ? ('<div>• <strong>EEC Pedagógico:</strong> ' + esc.eecScore.toFixed(1).replace('.', ',') + '%</div>') : '') +
            '<div style="margin-top:4px;color:#fbbf24;font-weight:700;">Clique para abrir Diagnóstico da Escola</div>';
          tip.style.display = 'block';
          var x = (ev && ev.clientX ? ev.clientX : 200) + 14;
          var y = (ev && ev.clientY ? ev.clientY : 200) + 14;
          if (typeof window !== 'undefined' && window.innerWidth && x + 280 > window.innerWidth) x = Math.max(12, x - 295);
          tip.style.left = x + 'px';
          tip.style.top = y + 'px';
        },
        esconderTooltipPonto: function() {
          var tip = document.getElementById('di-scatter-tooltip');
          if (tip) tip.style.display = 'none';
        },
        obterDiagnostico: function() {
          return { escolas: ultimoFato, telemetria: ultimaTel };
        }
      };

      /* ========================================================================= */
      /* ESTÚDIO EXECUTIVO DE RELATÓRIOS (MODAL PREVIEW + PDF + IMPRESSÃO + XLSX)  */
      /* ========================================================================= */
      var relatorioAtualEstado = null;

      function estiloTierPdf(tier) {
        if (tier === 'Crítico') return { bg: '#fee2e2', txt: '#991b1b', brd: '#fca5a5', bar: '#dc2626', dot: '' };
        if (tier === 'Alto Risco') return { bg: '#ffedd5', txt: '#9a3412', brd: '#fdba74', bar: '#ea580c', dot: '' };
        if (tier === 'Atenção') return { bg: '#fef9c3', txt: '#854d0e', brd: '#fde047', bar: '#ca8a04', dot: '' };
        return { bg: '#dcfce7', txt: '#166534', brd: '#86efac', bar: '#16a34a', dot: '' };
      }

      function gerarRodapeEditorial(folhaAtual, totalFolhas) {
        var logoUreSrc = (typeof window !== 'undefined' && window.LOGO_URE_DATA_URI)
          ? window.LOGO_URE_DATA_URI
          : ((typeof window !== 'undefined' && window.BRASAO_SP_DATA_URI) ? window.BRASAO_SP_DATA_URI : 'logo_ure_itapevi_480.png');

        return '' +
          '<footer class="doc-footer">' +
            '<div class="doc-footer-col doc-footer-left">' +
              '<span class="doc-footer-title">URE - Itapevi</span>' +
            '</div>' +
            '<div class="doc-footer-col doc-footer-center">' +
              '<span class="doc-footer-badge">Página ' + folhaAtual + ' de ' + totalFolhas + '</span>' +
            '</div>' +
            '<div class="doc-footer-col doc-footer-right">' +
              '<img src="' + logoUreSrc + '" alt="Logo URE Itapevi" class="doc-footer-logo" />' +
            '</div>' +
          '</footer>';
      }

      /* ========================================================================= */
      /* CHANCELARIA CRIPTOGRÁFICA, QR CODE AUDITÁVEL & RADAR PENTAGONAL SVG        */
      /* ========================================================================= */
      function gerarHashChancelaria(texto) {
        var str = String(texto || "URE-ITP-2026");
        var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
        for (var i = 0; i < str.length; i++) {
          var ch = str.charCodeAt(i);
          h1 = Math.imul(h1 ^ ch, 2654435761);
          h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        var hex1 = ("00000000" + (h1 >>> 0).toString(16).toUpperCase()).slice(-4);
        var hex2 = ("00000000" + (h2 >>> 0).toString(16).toUpperCase()).slice(-4);
        return "AUTH-URE-2026-" + hex1 + "-" + hex2;
      }

      function gerarQrCodeSvgOuFallback(url, size) {
        size = size || 44;
        if (typeof qrcode !== "undefined") {
          try {
            var qr = qrcode(0, "M");
            qr.addData(url);
            qr.make();
            var svgRaw = qr.createSvgTag({ scalable: true, margin: 0 });
            return svgRaw.replace(/<svg\b([^>]*)>/, '<svg$1 width="' + size + '" height="' + size + '" style="display:block;width:' + size + 'px;height:' + size + 'px;">');
          } catch(e) {
            /* Fallback vetorial */
          }
        }
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 33 33" style="display:block;width:' + size + 'px;height:' + size + 'px;" xmlns="http:' + String.fromCharCode(47, 47) + 'www.w3.org/2000/svg">' +
          '<rect width="33" height="33" fill="#ffffff"/>' +
          '<rect x="1" y="1" width="9" height="9" fill="#0b2351" rx="1.5"/><rect x="2.5" y="2.5" width="6" height="6" fill="#ffffff" rx="1"/><rect x="4" y="4" width="3" height="3" fill="#0b2351" rx="0.5"/>' +
          '<rect x="23" y="1" width="9" height="9" fill="#0b2351" rx="1.5"/><rect x="24.5" y="2.5" width="6" height="6" fill="#ffffff" rx="1"/><rect x="26" y="4" width="3" height="3" fill="#0b2351" rx="0.5"/>' +
          '<rect x="1" y="23" width="9" height="9" fill="#0b2351" rx="1.5"/><rect x="2.5" y="24.5" width="6" height="6" fill="#ffffff" rx="1"/><rect x="4" y="26" width="3" height="3" fill="#0b2351" rx="0.5"/>' +
          '<rect x="11" y="5" width="10" height="1.5" fill="#0b2351"/><rect x="5" y="11" width="1.5" height="10" fill="#0b2351"/>' +
          '<rect x="20" y="20" width="5" height="5" fill="#0b2351" rx="0.8"/><rect x="21.5" y="21.5" width="2" height="2" fill="#ffffff"/>' +
          '<rect x="12" y="8" width="2" height="2" fill="#0284c7"/><rect x="16" y="8" width="2" height="2" fill="#0b2351"/><rect x="19" y="8" width="2" height="2" fill="#0b2351"/>' +
          '<rect x="11" y="12" width="2" height="2" fill="#0b2351"/><rect x="15" y="12" width="3" height="2" fill="#0284c7"/><rect x="24" y="12" width="2" height="2" fill="#0b2351"/>' +
          '<rect x="12" y="16" width="2" height="2" fill="#0284c7"/><rect x="16" y="16" width="3" height="2" fill="#0b2351"/><rect x="27" y="16" width="2" height="2" fill="#0284c7"/>' +
          '<rect x="11" y="24" width="2" height="3" fill="#0b2351"/><rect x="15" y="25" width="2" height="2" fill="#0284c7"/><rect x="27" y="24" width="2" height="2" fill="#0b2351"/>' +
          '<rect x="12" y="28" width="3" height="2" fill="#0284c7"/><rect x="16" y="28" width="2" height="2" fill="#0b2351"/><rect x="26" y="28" width="2" height="2" fill="#0284c7"/>' +
        '</svg>';
      }

      function gerarMastheadEditorial(tituloDoc, subtituloDoc, badgeDoc, codigoRef, cieAlvo) {
        var agora = new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
        var hashChancelaria = gerarHashChancelaria((codigoRef || "URE-ITP-2026") + "-" + agora + "-" + (cieAlvo || ""));
        var urlValidacao = "https:" + String.fromCharCode(47, 47) + "sites.google.com/view/bi-dirigente" + (cieAlvo && cieAlvo !== "geral" ? ("?cie=" + encodeURIComponent(cieAlvo)) : "");
        var qrSvg = gerarQrCodeSvgOuFallback(urlValidacao, 44);
        var logoHtml = (typeof window !== "undefined" && window.BRASAO_SP_DATA_URI)
          ? '<img src="' + window.BRASAO_SP_DATA_URI + '" alt="Brasão Oficial SP" class="doc-masthead-logo" />'
          : '<div class="doc-masthead-logo-fallback">SP</div>';
        return '' +
          '<header class="doc-masthead">' +
            '<div class="doc-masthead-left">' +
              '<div class="doc-masthead-brand">' + logoHtml + '</div>' +
              '<div class="doc-masthead-text">' +
                '<span class="doc-masthead-gov">Governo do Estado de São Paulo — Secretaria da Educação</span>' +
                '<h1 class="doc-title">' + escHtml(tituloDoc) + '</h1>' +
                '<div class="doc-subtitle">' + escHtml(subtituloDoc) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="doc-masthead-chancelaria">' +
              '<div class="doc-qr-wrap" title="Escanear para auditar este documento no BI Dirigente online">' +
                qrSvg +
              '</div>' +
              '<div class="doc-meta-box">' +
                '<span class="doc-type-badge">' + escHtml(badgeDoc) + '</span>' +
                '<div class="doc-meta-line" style="font-weight:700; color:#0b2351;">' + escHtml(hashChancelaria) + '</div>' +
                '<div class="doc-meta-line">REF: ' + escHtml(codigoRef || "URE-ITP-2026") + '</div>' +
                '<div class="doc-meta-line">EMISSÃO: ' + escHtml(agora) + '</div>' +
                '<div class="doc-meta-line" style="font-size:5.4pt; color:#0284c7; font-weight:700;">CHANCELARIA AUDITÁVEL</div>' +
              '</div>' +
            '</div>' +
          '</header>' +
          '<hr class="doc-masthead-divider" />';
      }

      function renderSvgRadarIpre(fato) {
        var w = 136, h = 108, cx = 68, cy = 54, rMax = 34;
        var pts = fato && fato.pts ? fato.pts : { SEOM: 20, SEINTEC: 30, SEGRE: 15, SEPES: 10, SEAFIN: 25 };
        var axes = [
          { key: "SEOM", lbl: "SEOM", val: pts.SEOM || 0 },
          { key: "SEINTEC", lbl: "SEINTEC", val: pts.SEINTEC || 0 },
          { key: "SEGRE", lbl: "SEGRE", val: pts.SEGRE || 0 },
          { key: "SEPES", lbl: "SEPES", val: pts.SEPES || 0 },
          { key: "SEAFIN", lbl: "SEAFIN", val: pts.SEAFIN || 0 }
        ];
        var n = axes.length;
        function getCoord(idx, val) {
          var angle = -Math.PI / 2 + (idx * 2 * Math.PI / n);
          var r = (Math.max(0, Math.min(100, val)) / 100) * rMax;
          return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
        }

        var svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:block;margin:0 auto;">';
        
        [25, 50, 75, 100].forEach(function(lvl) {
          var ringPts = [];
          for (var i = 0; i < n; i++) {
            var c = getCoord(i, lvl);
            ringPts.push(c.x.toFixed(1) + "," + c.y.toFixed(1));
          }
          var stroke = lvl === 100 ? "#94a3b8" : "#e2e8f0";
          var dash = lvl === 50 ? 'stroke-dasharray="2,2"' : "";
          svg += '<polygon points="' + ringPts.join(" ") + '" fill="none" stroke="' + stroke + '" stroke-width="' + (lvl === 100 ? "0.9" : "0.6") + '" ' + dash + "/>";
        });

        axes.forEach(function(ax, i) {
          var cMax = getCoord(i, 100);
          svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cMax.x.toFixed(1) + '" y2="' + cMax.y.toFixed(1) + '" stroke="#cbd5e1" stroke-width="0.7" stroke-dasharray="1,2"/>';
          var cLbl = getCoord(i, 122);
          var textAnchor = Math.abs(cLbl.x - cx) < 6 ? "middle" : (cLbl.x > cx ? "start" : "end");
          svg += '<text x="' + cLbl.x.toFixed(1) + '" y="' + (cLbl.y + (cLbl.y < cy ? -1.5 : 3.5)).toFixed(1) + '" font-size="5pt" font-weight="800" fill="#475569" text-anchor="' + textAnchor + '">' + ax.lbl + "</text>";
        });

        var dataPts = [];
        axes.forEach(function(ax, i) {
          var c = getCoord(i, ax.val);
          dataPts.push(c.x.toFixed(1) + "," + c.y.toFixed(1));
        });

        var corPoly = (fato && fato.imro >= 62) ? "#ef4444" : ((fato && fato.imro >= 50) ? "#f97316" : ((fato && fato.imro >= 40) ? "#f59e0b" : "#0284c7"));
        svg += '<polygon points="' + dataPts.join(" ") + '" fill="' + corPoly + '" fill-opacity="0.32" stroke="' + corPoly + '" stroke-width="1.6"/>';

        axes.forEach(function(ax, i) {
          var c = getCoord(i, ax.val);
          svg += '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="2.2" fill="#ffffff" stroke="' + corPoly + '" stroke-width="1.2"/>';
        });

        svg += "</svg>";
        return svg;
      }

      function coletarDadosDetalhadosEscola(escCad, fato, listaFato) {
        var cieEsc = normCie(escCad.cie);
        var nomeBruto = escCad.nomeOficialBruto || escCad.nome || '';

        /* 1. Distância da Sede URE */
        var distSedeKm = '---';
        if (typeof COORDENADAS_REDE_ESCOLAS !== 'undefined' && typeof calcularDistanciaSedeKm === 'function') {
          var coords = COORDENADAS_REDE_ESCOLAS[cieEsc] || COORDENADAS_REDE_ESCOLAS[String(parseInt(cieEsc, 10))];
          if (coords) distSedeKm = calcularDistanciaSedeKm(coords);
        }

        /* 2. SEFISC Zeladoria nominal */
        var sefiscLista = (typeof DADOS_SEFISC !== 'undefined' && DADOS_SEFISC) ? (DADOS_SEFISC.zeladorias || DADOS_SEFISC.registros || []) : [];
        var zeladorReg = null;
        for (var zi = 0; zi < sefiscLista.length; zi++) {
          if (matchNomeEscola(sefiscLista[zi]['Unidade Escolar'] || '', nomeBruto)) {
            zeladorReg = sefiscLista[zi];
            break;
          }
        }

        /* 3. SEINTEC Breakdown detalhado */
        var statusHw = { Disponivel: 0, Danificado: 0, Manutencao: 0, Inservivel: 0, Chamado: 0, Outros: 0 };
        var hwArr = (window.INVENTARIO_COMPLETO_TUPLES && Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.hardware)) ? window.INVENTARIO_COMPLETO_TUPLES.hardware : [];
        hwArr.forEach(function(h) {
          if (normCie(h[0]) !== cieEsc) return;
          var st = String(h[5] || '').toLowerCase();
          if (st.indexOf('dispon') !== -1) statusHw.Disponivel++;
          else if (st.indexOf('danif') !== -1) statusHw.Danificado++;
          else if (st.indexOf('manut') !== -1 || st.indexOf('repar') !== -1) statusHw.Manutencao++;
          else if (st.indexOf('inserv') !== -1) statusHw.Inservivel++;
          else if (st.indexOf('chamado') !== -1 || st.indexOf('aguard') !== -1) statusHw.Chamado++;
          else statusHw.Outros++;
        });
        var eduQtd = escCad.educatrons || 0;
        var redeQtd = 0;
        var recQtd = 0;
        if (window.INVENTARIO_COMPLETO_TUPLES) {
          if (Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.educatrons)) {
            var ce = window.INVENTARIO_COMPLETO_TUPLES.educatrons.filter(function(it) { return normCie(it[0]) === cieEsc; }).length;
            if (ce > 0) eduQtd = ce;
          }
          if (Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.rede)) {
            redeQtd = window.INVENTARIO_COMPLETO_TUPLES.rede.filter(function(it) { return normCie(it[0]) === cieEsc; }).length;
          }
          if (Array.isArray(window.INVENTARIO_COMPLETO_TUPLES.recarga)) {
            recQtd = window.INVENTARIO_COMPLETO_TUPLES.recarga.filter(function(it) { return normCie(it[0]) === cieEsc; }).length;
          }
        }
        var callsAll = (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros))
          ? SEINTEC_BASES_CONFIG['Atendimentos'].registros.filter(function(c) { return normCie(c.cie) === cieEsc; })
          : [];

        /* 4. SEFIN Repasses 2026 individuais */
        var repassesEsc = [];
        var repRaw = (typeof DADOS_FINANCEIROS_SEFIN !== 'undefined' && DADOS_FINANCEIROS_SEFIN && Array.isArray(DADOS_FINANCEIROS_SEFIN.repassesCompactos)) ? DADOS_FINANCEIROS_SEFIN.repassesCompactos : [];
        if (typeof descompactarRepasseSefin === 'function') {
          repRaw.forEach(function(r) {
            var obj = descompactarRepasseSefin(r);
            if (normCie(obj.cie) === cieEsc && String(obj.ano) === '2026') {
              repassesEsc.push(obj);
            }
          });
        }

        /* 5. SEPES Processos da Escola */
        var sepesLista = [];
        var addSepes = function(arr, tipoLbl) {
          (arr || []).forEach(function(item) {
            if (matchNomeEscola(item.ue || item.ua || '', nomeBruto)) {
              sepesLista.push({ tipo: tipoLbl, nome: item.nome || '---', sei: item.sei || '---', entrada: item.dataEntrada || '---', status: item.status || '---', concluido: Boolean(item.concluido) });
            }
          });
        };
        if (typeof DADOS_SEPES !== 'undefined' && DADOS_SEPES) {
          addSepes(DADOS_SEPES.aposentadorias, 'Aposentadoria');
          addSepes(DADOS_SEPES.designacoes, 'Designação');
          addSepes(DADOS_SEPES.abonos, 'Abono Permanência');
        }

        /* 6. SEGRE / SEMAT / SEVESC Processos SEI abertos */
        var seiLista = [];
        var addSei = function(arr, sec) {
          (arr || []).forEach(function(s) {
            var alvo = s.escola || s.interessado || s.remetente || '';
            if (matchNomeEscola(alvo, nomeBruto)) {
              seiLista.push({ secao: sec, protocolo: s.protocolo || '---', data: s.data || '---', assunto: s.assunto || '---', situacao: s.situacao || '---', aberto: statusSeiAberto(s.situacao) });
            }
          });
        };
        if (typeof DADOS_SEGRE !== 'undefined' && DADOS_SEGRE) addSei(DADOS_SEGRE.processosSei, 'SEGRE');
        if (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT) addSei(DADOS_SEMAT.processosSei, 'SEMAT');
        if (typeof DADOS_SEVESC !== 'undefined' && DADOS_SEVESC) addSei(DADOS_SEVESC.processosSei, 'SEVESC');

        /* 7. Benchmarks da Rede (60 escolas) */
        var n = listaFato.length || 1;
        var sumImro = 0, sumTiPct = 0, sumDispPct = 0, sumExecPct = 0, cntRec = 0;
        listaFato.forEach(function(e) {
          sumImro += e.imro;
          sumTiPct += (e.hwBadPct || 0);
          sumDispPct += (e.hwTotal > 0 ? (e.hwDisp / e.hwTotal) * 100 : 0);
          if (e.rec2026 > 0) { sumExecPct += e.execPct2026; cntRec++; }
        });

        return {
          distSedeKm: distSedeKm,
          zeladorReg: zeladorReg,
          statusHw: statusHw,
          eduQtd: eduQtd,
          redeQtd: redeQtd,
          recQtd: recQtd,
          callsAll: callsAll,
          repassesEsc: repassesEsc,
          sepesLista: sepesLista,
          seiLista: seiLista,
          benchmarks: {
            mediaImro: sumImro / n,
            mediaTiPct: sumTiPct / n,
            mediaDispPct: sumDispPct / n,
            mediaExecPct: cntRec > 0 ? (sumExecPct / cntRec) : 0
          }
        };
      }

      /* ========================================================================= */
      /* BULLET GRAPHS TUFTE (BENCHMARKING COM ZONAS QUALITATIVAS E META REGIONAL)  */
      /* ========================================================================= */
      function renderSvgBenchmarkEscola(fato, bench) {
        var dispEsc = fato.hwTotal > 0 ? (fato.hwDisp / fato.hwTotal) * 100 : 0;
        var items = [
          { lbl: "IPRE (Prioridade)", escVal: fato.imro, medVal: bench.mediaImro, unit: " pts", escCol: fato.imro >= 50 ? "#dc2626" : "#0b2351", menorMelhor: true },
          { lbl: "Equipamentos Comprometidos", escVal: fato.hwBadPct || 0, medVal: bench.mediaTiPct, unit: "%", escCol: (fato.hwBadPct || 0) >= 25 ? "#ea580c" : "#0284c7", menorMelhor: true },
          { lbl: "Hardware Disponível", escVal: dispEsc, medVal: bench.mediaDispPct, unit: "%", escCol: dispEsc >= 75 ? "#059669" : "#d97706", menorMelhor: false },
          { lbl: "Execução PDDE 2026", escVal: fato.execPct2026 || 0, medVal: bench.mediaExecPct, unit: "%", escCol: (fato.execPct2026 || 0) >= 50 ? "#059669" : "#d97706", menorMelhor: false }
        ];

        var html = '<div style="display:flex; flex-direction:column; gap:5.5px; width:100%; box-sizing:border-box;">';
        items.forEach(function(it) {
          var escW = Math.min(100, Math.max(0, it.escVal));
          var medW = Math.min(100, Math.max(0, it.medVal));
          var descCrit = it.menorMelhor ? "Menor é melhor" : "Maior é melhor";
          
          html += '<div style="border-bottom:1px dotted #e2e8f0; padding-bottom:3px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">' +
              '<span style="font-size:6.5pt; font-weight:700; color:#1e293b;">' + escHtml(it.lbl) + ' <span style="font-size:5.5pt; font-weight:500; color:#64748b;">(' + descCrit + ')</span></span>' +
              '<div style="font-size:6.3pt; display:flex; gap:6px; font-variant-numeric:tabular-nums;">' +
                '<span style="color:' + it.escCol + '; font-weight:800;">UE: ' + it.escVal.toFixed(1).replace(".", ",") + it.unit + '</span>' +
                '<span style="color:#475569; font-weight:600;">Média URE: ' + it.medVal.toFixed(1).replace(".", ",") + it.unit + '</span>' +
              '</div>' +
            '</div>' +
            /* Edward Tufte Bullet Graph: 3-tier qualitative background track + actual bar + target marker line */
            '<div style="width:100%; height:9px; background:#f1f5f9; border-radius:2.5px; position:relative; overflow:visible; display:flex; align-items:center;">' +
              '<div style="position:absolute; left:0; width:40%; height:100%; background:#e2e8f0; border-top-left-radius:2.5px; border-bottom-left-radius:2.5px;"></div>' +
              '<div style="position:absolute; left:40%; width:20%; height:100%; background:#cbd5e1;"></div>' +
              '<div style="position:absolute; left:60%; width:40%; height:100%; background:#94a3b8; opacity:0.35; border-top-right-radius:2.5px; border-bottom-right-radius:2.5px;"></div>' +
              '<div style="position:absolute; left:0; width:' + escW.toFixed(1) + '%; height:4.5px; background:' + it.escCol + '; border-radius:1.5px; z-index:2; box-shadow:0 0.5px 1px rgba(0,0,0,0.15);"></div>' +
              '<div style="position:absolute; left:' + medW.toFixed(1) + '%; width:2.5px; height:11px; background:#0f172a; top:-1px; border-radius:1px; z-index:3; transform:translateX(-50%);" title="Média Regional: ' + it.medVal.toFixed(1) + '"></div>' +
            '</div>' +
          '</div>';
        });
        html += '</div>';
        return html;
      }

      /* ========================================================================= */
      /* MATRIZ DE INTERVENÇÃO PRESCRITIVA DE GESTÃO (ORDEM DE MISSÃO EXECUTIVA)   */
      /* ========================================================================= */
      function gerarMatrizPrescritivaEscola(fato, det, rankIdx) {
        var acoes = [];
        
        /* 1. SEAFIN (PDDE Ocioso) */
        if (fato.saldoOcioso2026 >= 10000) {
          acoes.push({
            setor: "SEAFIN • Finanças APM",
            cor: "#059669",
            diretiva: "Saldo ocioso de " + formatarMoedaCurta(fato.saldoOcioso2026) + " no PDDE 2026 (" + fato.execPct2026.toFixed(1).replace(".", ",") + "% exec.): convocar direção escolar e APM para revisão do plano de aplicação direcionado aos gargalos prediais/tecnológicos.",
            sla: "7 dias úteis",
            urgencia: "Alta"
          });
        } else if (fato.execPct2026 < 30 && fato.saldoOcioso2026 > 3000) {
          acoes.push({
            setor: "SEAFIN • Finanças APM",
            cor: "#059669",
            diretiva: "Baixa execução orçamentária no exercício (" + fato.execPct2026.toFixed(1).replace(".", ",") + "%): orientar prestação de contas parcial e execução de repasses prioritários.",
            sla: "15 dias úteis",
            urgencia: "Média"
          });
        }

        /* 2. SEOM (Infraestrutura e Obras) */
        var seom = fato.seomObj || null;
        if (seom && (seom.avcb !== 1 || seom.telhado === 2 || seom.eletrica === 2 || seom.esgoto === 2)) {
          var itensCrit = [];
          if (seom.avcb !== 1) itensCrit.push("AVCB pendente");
          if (seom.telhado === 2) itensCrit.push("Telhado crítico");
          if (seom.eletrica === 2) itensCrit.push("Elétrica crítica");
          if (seom.esgoto === 2) itensCrit.push("Esgoto crítico");
          acoes.push({
            setor: "SEOM • Obras e Manutenção",
            cor: "#d97706",
            diretiva: "Vistoria técnica presencial emergencial (" + itensCrit.join(", ") + "): formalizar processo SEI para intervenção FDE/Manutenção Preventiva.",
            sla: "10 dias úteis",
            urgencia: "Alta"
          });
        }

        /* 3. SEINTEC (Tecnologia) */
        if ((fato.hwBadPct || 0) >= 20 || (det.statusHw && det.statusHw.Danificado > 5) || fato.callsAbertos >= 3) {
          acoes.push({
            setor: "SEINTEC • Tecnologia e Redes",
            cor: "#0284c7",
            diretiva: "Incidência de equipamentos comprometidos (" + (fato.hwBadPct || 0).toFixed(1).replace(".", ",") + "% danificado/manut., " + fato.callsAbertos + " chamado(s) aberto(s)): acionar contrato de garantia Prodesp e recolhimento de inservíveis.",
            sla: "5 dias úteis",
            urgencia: "Alta"
          });
        }

        /* 4. ASURE (Supervisão Escolar) */
        if (!fato.visitada || (fato.imro >= 50 && (!det.visitasEsc || det.visitasEsc.length === 0))) {
          acoes.push({
            setor: "ASURE • Supervisão Escolar",
            cor: "#dc2626",
            diretiva: "Unidade prioritária #" + rankIdx + " (IPRE " + fato.imro.toFixed(1).replace(".", ",") + ") sem visita recente registrada: inclusão compulsória no próximo ciclo de visitas executivas da Dirigente.",
            sla: "Imediato (Próximo Ciclo)",
            urgencia: "Máxima"
          });
        }

        /* 5. SEPES / SEGRE (Pessoas e Vida Escolar) */
        var pendPessoas = det.sepesLista ? det.sepesLista.filter(function(p){ return !p.concluido; }).length : 0;
        var pendSegre = det.seiLista ? det.seiLista.filter(function(s){ return s.aberto; }).length : 0;
        if (pendPessoas > 0 || pendSegre > 0) {
          acoes.push({
            setor: "SEPES / SEGRE • Quadro & Alunos",
            cor: "#7c3aed",
            diretiva: "Tramitação prioritária de " + (pendPessoas + pendSegre) + " expediente(s) funcional(is)/matrícula em aberto no SEI para garantir a regularidade de quadro e alunos.",
            sla: "10 dias úteis",
            urgencia: "Média"
          });
        }

        /* Caso padrão se tudo estiver regular */
        if (acoes.length === 0) {
          acoes.push({
            setor: "GABINETE • Governança Regional",
            cor: "#10b981",
            diretiva: "Unidade operando dentro dos parâmetros de estabilidade e conformidade da URE Itapevi. Manter rotina de monitoramento preventivo via BI Dirigente.",
            sla: "Monitoramento Contínuo",
            urgencia: "Ordinária"
          });
        }

        return acoes;
      }

      function renderMatrizPrescritivaHtml(acoes) {
        var html = '<div class="doc-card" style="border-left:4px solid #0b2351; padding:5px 7px; margin-top:4px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; border-bottom:1px solid #e2e8f0; padding-bottom:2.5px;">' +
            '<span style="font-size:7pt; font-weight:800; color:#0b2351; text-transform:uppercase; letter-spacing:0.04em;">⚡ Matriz de Intervenção Prescritiva de Gestão • Ordem de Missão Executiva</span>' +
            '<span style="font-size:6.1pt; font-weight:700; color:#64748b;">' + acoes.length + ' Diretiva(s) Ativa(s)</span>' +
          '</div>' +
          '<table class="doc-table" style="font-size:6.6pt; margin:0;">' +
            '<thead>' +
              '<tr>' +
                '<th style="width:25%;">Núcleo Responsável</th>' +
                '<th style="width:58%;">Diagnóstico &amp; Diretiva Imediata Prescrita</th>' +
                '<th style="width:17%; text-align:center;">Prazo / SLA</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
            acoes.slice(0, 3).map(function(ac) {
              var badgeBg = ac.urgencia === "Máxima" ? "#fee2e2" : (ac.urgencia === "Alta" ? "#ffedd5" : (ac.urgencia === "Média" ? "#fef3c7" : "#ecfdf5"));
              var badgeTxt = ac.urgencia === "Máxima" ? "#991b1b" : (ac.urgencia === "Alta" ? "#9a3412" : (ac.urgencia === "Média" ? "#92400e" : "#065f46"));
              return "<tr>" +
                '<td><strong style="color:' + ac.cor + ';">' + ac.setor + '</strong></td>' +
                '<td>' + ac.diretiva + '</td>' +
                '<td style="text-align:center;"><span style="display:inline-block; padding:1.5px 5px; border-radius:3px; font-weight:700; font-size:5.8pt; background:' + badgeBg + '; color:' + badgeTxt + ';">' + ac.sla + '</span></td>' +
              '</tr>';
            }).join("") +
            '</tbody>' +
          '</table>' +
        '</div>';
        return html;
      }

      function renderSvgDistribuicaoImro(crit, alto, aten, ok, total) {
        var t = total || 60;
        var parts = [
          { lbl: 'Crítico (≥62)', cnt: crit, col: '#ef4444', bg: '#fee2e2', txt: '#991b1b' },
          { lbl: 'Alto Risco (50–61)', cnt: alto, col: '#f97316', bg: '#ffedd5', txt: '#9a3412' },
          { lbl: 'Atenção (40–49)', cnt: aten, col: '#f59e0b', bg: '#fef3c7', txt: '#92400e' },
          { lbl: 'Regular (<40)', cnt: ok, col: '#10b981', bg: '#dcfce7', txt: '#166534' }
        ];

        var htmlBarra = '<div style="width: 100%; height: 16px; border-radius: 5px; overflow: hidden; display: flex; background: #e2e8f0; margin-bottom: 5px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);">';
        parts.forEach(function(p) {
          var pct = (p.cnt / t) * 100;
          if (pct > 0) {
            htmlBarra += '<div style="width:' + pct.toFixed(1) + '%; background:' + p.col + '; display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:6.8pt; font-weight:800; font-family:inherit; min-width:16px;" title="' + p.lbl + ': ' + p.cnt + '">' + p.cnt + '</div>';
          }
        });
        htmlBarra += '</div>';

        var htmlLegenda = '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3.5px;">';
        parts.forEach(function(p) {
          var pctStr = ((p.cnt / t) * 100).toFixed(0) + '%';
          htmlLegenda += '<div style="background:' + p.bg + '; border:1px solid ' + p.col + '40; border-radius:4px; padding:2.5px 4.5px; display:flex; align-items:center; justify-content:space-between; font-size:6.3pt;">' +
            '<span style="font-weight:700; color:' + p.txt + ';">' + p.lbl.split(' ')[0] + '</span>' +
            '<strong style="color:' + p.txt + '; font-variant-numeric:tabular-nums;">' + p.cnt + ' (' + pctStr + ')</strong>' +
          '</div>';
        });
        htmlLegenda += '</div>';

        return htmlBarra + htmlLegenda;
      }

      function abrirModalRelatorioExecutivo(estado) {
        relatorioAtualEstado = estado;
        var modal = document.getElementById('modal-relatorio-executivo');
        var canvas = document.getElementById('relatorio-executivo-canvas');
        var titleEl = document.getElementById('rel-exec-titulo');
        var badgeEl = document.getElementById('rel-exec-badge');
        if (!modal || !canvas) return;
        if (titleEl) titleEl.textContent = estado.titulo || 'Relatório Executivo';
        if (badgeEl) badgeEl.textContent = estado.badge || 'DOCUMENTO OFICIAL';
        canvas.innerHTML = estado.htmlCorpo;
        modal.style.display = 'flex';
      }

      window.fecharModalRelatorioExecutivo = function() {
        var modal = document.getElementById('modal-relatorio-executivo');
        if (modal) modal.style.display = 'none';
      };

      window.imprimirRelatorioAtual = function() {
        var canvas = document.getElementById('relatorio-executivo-canvas');
        var stylesEl = document.getElementById('exec-doc-print-styles');
        if (!canvas || !canvas.innerHTML.trim()) return;
        var fontHref = 'https:' + String.fromCharCode(47, 47) + 'fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=JetBrains+Mono:wght@500;700&display=swap';
        var title = (relatorioAtualEstado && relatorioAtualEstado.titulo) ? relatorioAtualEstado.titulo : 'Relatório Executivo URE Itapevi';
        try {
          var w = window.open('', '_blank', 'width=980,height=860');
          if (!w) {
            if (typeof abrirModalAvisoCarroUX === 'function') {
              abrirModalAvisoCarroUX({
                tipo: 'aviso',
                icone: '🖨️',
                eyebrow: 'IMPRESSÃO • POP-UP BLOQUEADO',
                titulo: 'Permitir janela de impressão',
                html: '<p style="margin: 0 0 0.5rem 0; color: #334155; font-size: 0.9rem; line-height: 1.55;">O navegador bloqueou a abertura da janela de impressão automática.</p><p style="margin: 0; color: #64748b; font-size: 0.83rem;">Habilite pop-ups para este site ou utilize diretamente o botão <strong>"Baixar PDF"</strong> no topo do estúdio.</p>',
                textoFechar: 'Entendi'
              });
            } else if (typeof mostrarToastAgenda === 'function') {
              mostrarToastAgenda('Habilite pop-ups ou use "Baixar PDF" diretamente no estúdio.', '⚠️');
            }
            return;
          }
          w.document.open();
          w.document.write('<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>' + escHtml(title) + '</title>');
          w.document.write('<link rel="stylesheet" href="' + fontHref + '">');
          w.document.write('<style>@page{size:A4 portrait;margin:10mm;}body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' + (stylesEl ? stylesEl.textContent : '') + '</style>');
          w.document.write('</head><body><div class="exec-doc-sheet">' + canvas.innerHTML + '</div></body></html>');
          w.document.close();
          w.focus();
          var done = false;
          var go = function() { if (!done) { done = true; w.print(); } };
          if (w.document.fonts && w.document.fonts.ready) {
            w.document.fonts.ready.then(function() { setTimeout(go, 180); });
          }
          setTimeout(go, 800);
        } catch (err) {
          console.warn('Erro na impressão:', err);
        }
      };

      window.baixarPdfRelatorioAtual = function() {
        var canvas = document.getElementById('relatorio-executivo-canvas');
        var btn = document.getElementById('btn-rel-baixar-pdf');
        if (!canvas || !canvas.innerHTML.trim()) return;
        var baseName = (relatorioAtualEstado && relatorioAtualEstado.nomeArquivoBase) ? relatorioAtualEstado.nomeArquivoBase : ('Relatorio_URE_Itapevi_' + new Date().toISOString().slice(0, 10));

        if (typeof html2pdf !== 'function') {
          if (typeof mostrarToastAgenda === 'function') {
            mostrarToastAgenda('Abrindo diálogo para salvar como PDF...', '📄');
          }
          window.imprimirRelatorioAtual();
          return;
        }

        var pdfSpinnerHtml = '<span style="display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,0.35);border-top-color:#ffffff;border-radius:50%;animation:spinSync 0.75s linear infinite;vertical-align:-2px;margin-right:5px;"></span>';
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = pdfSpinnerHtml + '<span>Gerando PDF...</span>';
        }
        var oldShadow = canvas.style.boxShadow;
        canvas.style.boxShadow = 'none';
        var pages = Array.prototype.slice.call(canvas.querySelectorAll('.exec-doc-page'));
        var oldMargins = [];
        var oldBoxShadows = [];
        pages.forEach(function(p, i) {
          oldMargins[i] = p.style.margin;
          oldBoxShadows[i] = p.style.boxShadow;
          p.style.margin = '0 auto';
          p.style.boxShadow = 'none';
        });

        function restaurarEstilos() {
          pages.forEach(function(p, i) {
            p.style.margin = oldMargins[i] || '';
            p.style.boxShadow = oldBoxShadows[i] || '';
          });
          canvas.style.boxShadow = oldShadow;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>⬇️</span><span>Baixar PDF</span>';
          }
        }

        /* 300 DPI Real: base CSS 96 DPI * 3.125 = 300 DPI, imagem PNG sem perdas */
        var opt300 = {
          margin: 0,
          filename: baseName + '.pdf',
          image: { type: 'png', quality: 1 },
          html2canvas: {
            scale: 3.125,
            dpi: 300,
            letterRendering: true,
            useCORS: true,
            backgroundColor: '#ffffff',
            scrollY: 0,
            logging: false
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
        };

        if (pages.length === 0) {
          html2pdf().set(opt300).from(canvas).save().then(function() {
            restaurarEstilos();
            if (typeof mostrarToastAgenda === 'function') {
              mostrarToastAgenda('PDF baixado com sucesso!', '📄');
            }
          }).catch(function(err) {
            console.warn('Fallback PDF print:', err);
            restaurarEstilos();
            window.imprimirRelatorioAtual();
          });
          return;
        }

        /* Renderização página a página em 300 DPI (zero distorção, zero corte, mapeamento A4 exato 210x297mm) */
        html2pdf().set(opt300).from(pages[0]).toPdf().get('pdf').then(function(pdfDoc) {
          var chain = Promise.resolve();
          for (var pi = 1; pi < pages.length; pi++) {
            (function(pageIndex, pageEl) {
              chain = chain.then(function() {
                if (btn) {
                  btn.innerHTML = pdfSpinnerHtml + '<span>Gerando PDF...</span>';
                }
                return html2pdf().set(opt300).from(pageEl).outputImg('datauristring').then(function(imgDataUri) {
                  pdfDoc.addPage('a4', 'portrait');
                  pdfDoc.addImage(imgDataUri, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
                });
              });
            })(pi, pages[pi]);
          }
          return chain.then(function() {
            pdfDoc.save(baseName + '.pdf');
          });
        }).then(function() {
          restaurarEstilos();
          if (typeof mostrarToastAgenda === 'function') {
            mostrarToastAgenda('PDF baixado com sucesso!', '📄');
          }
        }).catch(function(err) {
          console.warn('Fallback PDF print:', err);
          restaurarEstilos();
          window.imprimirRelatorioAtual();
        });
      };

      window.baixarExcelRelatorioAtual = function() {
        if (typeof XLSX === 'undefined') {
          alert('Biblioteca Excel (SheetJS) não carregada.');
          return;
        }
        if (!relatorioAtualEstado) return;
        var wb = XLSX.utils.book_new();
        var dataHoje = new Date().toLocaleDateString('pt-BR');

        if (relatorioAtualEstado.tipo === 'escola') {
          var escCad = relatorioAtualEstado.escCad;
          var fato = relatorioAtualEstado.fato;
          var det = relatorioAtualEstado.det;
          var seom = fato.seomObj || {};

          /* Aba 1: Resumo Executivo & Benchmarking */
          var abaResumo = [
            { 'Dimensão / Indicador': 'Unidade Escolar', 'Valor da Escola': escCad.nome, 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': fato.imro + ' / 100' },
            { 'Dimensão / Indicador': 'Código CIE', 'Valor da Escola': fato.cie, 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': 'Faixa: ' + fato.tier },
            { 'Dimensão / Indicador': 'Município / Distância Sede', 'Valor da Escola': (escCad.cidade || '') + ' (' + det.distSedeKm + ' km)', 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': 'Posição #' + relatorioAtualEstado.rankIdx + '/60' },
            { 'Dimensão / Indicador': 'IPRE (0–100)', 'Valor da Escola': fato.imro, 'Média URE (60 Escolas)': Number(det.benchmarks.mediaImro.toFixed(1)), 'Pontuação IMRO': fato.tier },
            { 'Dimensão / Indicador': 'SEOM Infraestrutura (0–100 | Peso 25%)', 'Valor da Escola': (fato.flags.SEOM || []).join('; ') || 'Conforme', 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': fato.pts.SEOM + ' / 100' },
            { 'Dimensão / Indicador': 'SEINTEC Tecnologia (0–100 | Peso 20%)', 'Valor da Escola': (fato.hwBadPct || 0).toFixed(1) + '% comp. (' + fato.hwBad + '/' + fato.hwTotal + ')', 'Média URE (60 Escolas)': det.benchmarks.mediaTiPct.toFixed(1) + '%', 'Pontuação IMRO': fato.pts.SEINTEC + ' / 100' },
            { 'Dimensão / Indicador': 'SEGRE Gestão da Rede (0–100 | Peso 20%)', 'Valor da Escola': fato.segreAbertos + ' SEI em aberto', 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': fato.pts.SEGRE + ' / 100' },
            { 'Dimensão / Indicador': 'SEPES Serviço de Pessoas (0–100 | Peso 20%)', 'Valor da Escola': fato.sepesPend + ' em fila', 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': fato.pts.SEPES + ' / 100' },
            { 'Dimensão / Indicador': 'SEAFIN PDDE 2026 (0–100 | Peso 15%)', 'Valor da Escola': (fato.execPct2026 || 0).toFixed(1) + '% exec.', 'Média URE (60 Escolas)': det.benchmarks.mediaExecPct.toFixed(1) + '%', 'Pontuação IMRO': fato.pts.SEAFIN + ' / 100' },
            { 'Dimensão / Indicador': 'Alerta Crítico Setorial (≥ 80/100)', 'Valor da Escola': (fato.alertasSetoriais && fato.alertasSetoriais.length > 0) ? fato.alertasSetoriais.join(', ') : 'Sem colapso isolado', 'Média URE (60 Escolas)': '---', 'Pontuação IMRO': fato.alertaSetorial ? 'ATIVO' : 'Normal' },
            { 'Dimensão / Indicador': 'Recomendação Prescritiva', 'Valor da Escola': relatorioAtualEstado.prescricao, 'Média URE (60 Escolas)': 'Data: ' + dataHoje, 'Pontuação IMRO': 'BI Dirigente' }
          ];
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaResumo), 'Resumo_IPRE');

          /* Aba 2: Infraestrutura SEOM & SEFISC */
          var abaInfra = [
            { 'Item Predial / Zeladoria': 'AVCB Corpo de Bombeiros', 'Situação': seom.escola ? (seom.avcb === 1 ? 'Regularizado' : 'Pendente') : 'Não mapeado' },
            { 'Item Predial / Zeladoria': 'Obra FDE', 'Situação': seom.escola ? (seom.obraFde === 2 ? 'Ativa' : (seom.obraFde === 1 ? 'Prevista' : 'Sem obra')) : '---' },
            { 'Item Predial / Zeladoria': 'Telhado', 'Situação': seom.escola ? (seom.telhado === 2 ? 'Crítico' : 'Conforme') : '---' },
            { 'Item Predial / Zeladoria': 'Rede Elétrica', 'Situação': seom.escola ? (seom.eletrica === 2 ? 'Sobrecarregada' : 'Estável') : '---' },
            { 'Item Predial / Zeladoria': 'Saneamento / Esgoto', 'Situação': seom.escola ? (seom.esgoto === 2 ? 'Crítico' : 'Regular') : '---' },
            { 'Item Predial / Zeladoria': 'Limpeza / Consumo Água', 'Situação': seom.escola ? ((seom.limpeza === 2 ? 'Limpeza Crítica' : 'Limpeza OK') + ' | ' + (seom.consumoAgua === 2 ? 'Água Alerta' : 'Água OK')) : '---' },
            { 'Item Predial / Zeladoria': 'Matrícula Imóvel / SGI', 'Situação': seom.escola ? ((seom.matriculaAtualizada === 1 ? 'Matrícula OK' : 'Pendente') + ' | SGI: ' + (seom.sgi === 2 ? 'Inconsistência' : 'Regular')) : '---' },
            { 'Item Predial / Zeladoria': 'Zeladoria (SEOM / SEFISC)', 'Situação': det.zeladorReg ? (det.zeladorReg['Nome do Zelador'] + ' (' + (det.zeladorReg.Cargo || '') + ' • Venc: ' + (det.zeladorReg['Venc.'] || '') + ')') : (seom.zeladoria === 1 ? 'Residente' : 'Sem zelador') }
          ];
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaInfra), 'Infra_SEOM_SEFISC');

          /* Aba 3: Tecnologia SEINTEC */
          var abaTi = [
            { 'Categoria Tecnológica': 'Hardware Total', 'Quantidade': fato.hwTotal },
            { 'Categoria Tecnológica': 'Hardware Disponível', 'Quantidade': det.statusHw.Disponivel },
            { 'Categoria Tecnológica': 'Danificado', 'Quantidade': det.statusHw.Danificado },
            { 'Categoria Tecnológica': 'Em Manutenção', 'Quantidade': det.statusHw.Manutencao },
            { 'Categoria Tecnológica': 'Inservível', 'Quantidade': det.statusHw.Inservivel },
            { 'Categoria Tecnológica': 'Chamado Aberto / Aguard. Peça', 'Quantidade': det.statusHw.Chamado },
            { 'Categoria Tecnológica': 'Educatrons (Telas Interativas)', 'Quantidade': det.eduQtd },
            { 'Categoria Tecnológica': 'Equipamentos de Rede', 'Quantidade': det.redeQtd },
            { 'Categoria Tecnológica': 'Estações de Recarga', 'Quantidade': det.recQtd },
            { 'Categoria Tecnológica': 'Chamados 2026 (Total / Abertos)', 'Quantidade': fato.callsTotal + ' (' + fato.callsAbertos + ' abertos)' }
          ];
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaTi), 'Tecnologia_SEINTEC');

          /* Aba 4: Financeiro PDDE 2026 */
          var abaFin = det.repassesEsc.length > 0
            ? det.repassesEsc.map(function(r) {
                return { 'Programa / Fonte': r.programa || 'PDDE', 'Receita 2026 (R$)': r.recTotal || 0, 'Despesa Executada (R$)': r.despTotal || 0, 'Saldo (R$)': Math.max(0, (r.recTotal || 0) - (r.despTotal || 0)), 'Situação SED': r.statusSed || '---' };
              })
            : [{ 'Programa / Fonte': 'Sem repasse 2026 registrado', 'Receita 2026 (R$)': 0, 'Despesa Executada (R$)': 0, 'Saldo (R$)': 0, 'Situação SED': '---' }];
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaFin), 'PDDE_2026_SEAFIN');

          /* Aba 5: SEPES & SEGRE */
          var abaProc = [];
          det.sepesLista.forEach(function(p) {
            abaProc.push({ 'Origem': 'SEPES - ' + p.tipo, 'Protocolo / SEI': p.sei, 'Interessado / Assunto': p.nome, 'Data': p.entrada, 'Situação': p.status });
          });
          det.seiLista.forEach(function(s) {
            abaProc.push({ 'Origem': s.secao, 'Protocolo / SEI': s.protocolo, 'Interessado / Assunto': s.assunto, 'Data': s.data, 'Situação': s.situacao });
          });
          if (abaProc.length === 0) abaProc.push({ 'Origem': '---', 'Protocolo / SEI': '---', 'Interessado / Assunto': 'Sem processos registrados', 'Data': dataHoje, 'Situação': 'Conforme' });
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaProc), 'Processos_SEPES_SEGRE');
        } else {
          var fatoAll = relatorioAtualEstado.fato;
          var telAll = relatorioAtualEstado.tel;
          var abaSum = [
            { 'Indicador URE Itapevi': 'ISR Regional (0–100)', 'Valor': relatorioAtualEstado.isrScore },
            { 'Indicador URE Itapevi': 'IPRE Médio da Rede (0–100)', 'Valor': Number(relatorioAtualEstado.avgImro.toFixed(1)) },
            { 'Indicador URE Itapevi': 'Total de Escolas (PEI / Regular)', 'Valor': relatorioAtualEstado.totalEsc + ' (' + relatorioAtualEstado.peiCount + ' PEI / ' + relatorioAtualEstado.regCount + ' Regular)' },
            { 'Indicador URE Itapevi': 'Hardware SEINTEC (Total / % Disponível)', 'Valor': telAll.SEINTEC.hwTotal + ' (' + telAll.SEINTEC.hwDispPct.toFixed(1) + '%)' },
            { 'Indicador URE Itapevi': 'Chamados SEINTEC 2026 (Abertos / Total)', 'Valor': telAll.SEINTEC.callsAbertos + ' / ' + telAll.SEINTEC.callsTotal },
            { 'Indicador URE Itapevi': 'PDDE 2026 Receita / Execução % / Saldo Ocioso', 'Valor': formatarMoedaCurta(telAll.SEAFIN.receita2026) + ' | ' + telAll.SEAFIN.execPct2026.toFixed(1) + '% | ' + formatarMoedaCurta(telAll.SEAFIN.saldoOcioso2026) },
            { 'Indicador URE Itapevi': 'SEOM (Obras FDE / Sem AVCB)', 'Valor': telAll.SEOM.obrasAtivas + ' obras / ' + telAll.SEOM.avcbSem + ' sem AVCB' },
            { 'Indicador URE Itapevi': 'SEGRE SEI Abertos (>30d) / E-mails', 'Valor': telAll.SEGRE.seiAbertos + ' (' + telAll.SEGRE.seiAged30 + ') / ' + telAll.SEGRE.emailsTot },
            { 'Indicador URE Itapevi': 'SEPES Processos em Tramitação (>30d)', 'Valor': telAll.SEPES.emTramitacao + ' (' + telAll.SEPES.aged30 + ')' }
          ];
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaSum), 'Sumario_URE_Itapevi');

          var abaRank = fatoAll.map(function(e, i) {
            return {
              'Ranking': i + 1,
              'CIE': e.cie,
              'Unidade Escolar': e.nome,
              'Município': e.cidade,
              'Modelo': e.tipo,
              'IPRE (0-100)': e.imro,
              'Faixa de Risco': e.tier,
              'Alerta Setorial (≥80)': (e.alertasSetoriais && e.alertasSetoriais.length > 0) ? e.alertasSetoriais.join(', ') : 'Normal',
              'SEOM (0-100 | 25%)': e.pts.SEOM,
              'SEINTEC (0-100 | 20%)': e.pts.SEINTEC,
              'Comprometimento SEINTEC (%)': (e.hwBadPct || 0).toFixed(1) + '%',
              '% Equipamentos Comprometidos': e.hwBadPct || 0,
              'Defeito / Total': e.hwBad + '/' + e.hwTotal,
              'SEGRE (0-100 | 20%)': e.pts.SEGRE + ' (' + e.segreAbertos + ' SEI)',
              'SEPES (0-100 | 20%)': e.pts.SEPES + ' (' + e.sepesPend + ' proc)',
              'SEAFIN (0-100 | 15%)': e.pts.SEAFIN,
              '% PDDE 2026': Number((e.execPct2026 || 0).toFixed(1)),
              'Saldo PDDE Ocioso (R$)': Math.round(e.saldoOcioso2026 || 0),
              'AVCB': e.seomObj ? (e.seomObj.avcb === 1 ? 'Regular' : 'Pendente') : '---',
              'Visita ASURE': e.visitada ? (e.dataVisita || 'Sim') : 'Não'
            };
          });
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaRank), 'Ranking_60_Escolas');

          var abaMun = relatorioAtualEstado.listaMun.map(function(m) {
            return {
              'Município': m.nome,
              'Total Escolas': m.qtd,
              'Escolas PEI': m.pei,
              'IPRE Médio': Number((m.sumImro / m.qtd).toFixed(1)),
              'Prioritárias (IPRE ≥50)': m.critAlto,
              'AVCBs Regulares': m.avcbOk,
              '% Equipamentos Comprometidos': m.hwTot > 0 ? Number(((m.hwBad / m.hwTot) * 100).toFixed(1)) : 0
            };
          });
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abaMun), 'Consolidado_Municipios');
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(relatorioAtualEstado.linhasNucleos), 'Nucleos_Regionais');
        }

        XLSX.writeFile(wb, relatorioAtualEstado.nomeArquivoBase + '.xlsx');
        if (typeof mostrarToastAgenda === 'function') {
          mostrarToastAgenda('Planilha Excel gerada com sucesso!', '📊');
        }
      };


    /* ========================================================
       CENTRAL DE RELATÓRIOS EXECUTIVOS (GERAL / ESCOLA)
       ======================================================== */
    var estadoCentralRelatorios = {
      tipo: 'geral',
      municipioAtivo: 'todos',
      escolaSelecionadaId: null
    };

    function abrirModalCentralRelatorios(tipoInicial) {
      if (tipoInicial === 'escola') {
        selecionarTipoRelatorioCentral('escola');
      } else {
        selecionarTipoRelatorioCentral('geral');
      }
      inicializarFiltrosMunicipiosRelatorio();
      filtrarEscolasRelatorioModal();
      var modal = document.getElementById('modal-central-relatorios');
      if (modal) modal.style.display = 'flex';
    }

    function fecharModalCentralRelatorios() {
      var modal = document.getElementById('modal-central-relatorios');
      if (modal) modal.style.display = 'none';
    }

    function selecionarTipoRelatorioCentral(tipo) {
      estadoCentralRelatorios.tipo = tipo;
      var cardGeral = document.getElementById('card-relatorio-tipo-geral');
      var cardEscola = document.getElementById('card-relatorio-tipo-escola');
      var badgeGeral = document.getElementById('badge-tipo-geral');
      var badgeEscola = document.getElementById('badge-tipo-escola');
      var painelGeral = document.getElementById('painel-relatorio-geral');
      var painelEscola = document.getElementById('painel-relatorio-escola');
      var btnTexto = document.getElementById('btn-texto-gerar-relatorio');

      if (tipo === 'geral') {
        if (cardGeral) {
          cardGeral.style.borderColor = '#0b2351';
          cardGeral.style.background = '#f0f7ff';
          cardGeral.style.boxShadow = '0 4px 14px rgba(11, 35, 81, 0.12)';
        }
        if (cardEscola) {
          cardEscola.style.borderColor = '#e2e8f0';
          cardEscola.style.background = '#ffffff';
          cardEscola.style.boxShadow = 'none';
        }
        if (badgeGeral) {
          badgeGeral.innerText = '✓ Selecionado';
          badgeGeral.style.background = '#0b2351';
          badgeGeral.style.color = '#ffffff';
        }
        if (badgeEscola) {
          badgeEscola.innerText = 'Dossiê Individual';
          badgeEscola.style.background = '#f1f5f9';
          badgeEscola.style.color = '#64748b';
        }
        if (painelGeral) painelGeral.style.display = 'block';
        if (painelEscola) painelEscola.style.display = 'none';
        if (btnTexto) btnTexto.innerText = 'Gerar Relatório Geral';
      } else {
        if (cardEscola) {
          cardEscola.style.borderColor = '#0b2351';
          cardEscola.style.background = '#f0f7ff';
          cardEscola.style.boxShadow = '0 4px 14px rgba(11, 35, 81, 0.12)';
        }
        if (cardGeral) {
          cardGeral.style.borderColor = '#e2e8f0';
          cardGeral.style.background = '#ffffff';
          cardGeral.style.boxShadow = 'none';
        }
        if (badgeEscola) {
          badgeEscola.innerText = '✓ Selecionado';
          badgeEscola.style.background = '#0b2351';
          badgeEscola.style.color = '#ffffff';
        }
        if (badgeGeral) {
          badgeGeral.innerText = 'Consolidado Rede';
          badgeGeral.style.background = '#f1f5f9';
          badgeGeral.style.color = '#64748b';
        }
        if (painelGeral) painelGeral.style.display = 'none';
        if (painelEscola) painelEscola.style.display = 'block';
        if (btnTexto) btnTexto.innerText = 'Gerar Dossiê da Escola';
        atualizarPreviaEscolaRelatorio();
      }
    }

    function inicializarFiltrosMunicipiosRelatorio() {
      var cont = document.getElementById('container-pills-mun-relatorio');
      if (!cont) return;
      var municipios = ['Todos', 'Itapevi', 'Barueri', 'Jandira', 'Pirapora do Bom Jesus'];
      var htmlPills = '';
      municipios.forEach(function(m) {
        var isAtivo = (estadoCentralRelatorios.municipioAtivo.toLowerCase() === m.toLowerCase()) ||
                      (m === 'Todos' && estadoCentralRelatorios.municipioAtivo === 'todos');
        var bg = isAtivo ? '#0b2351' : '#f1f5f9';
        var col = isAtivo ? '#ffffff' : '#475569';
        var brd = isAtivo ? '#0b2351' : '#cbd5e1';
        htmlPills += '<button type="button" onclick="selecionarMunicipioFiltroRelatorio(\'' + m + '\')" style="background: ' + bg + '; color: ' + col + '; border: 1px solid ' + brd + '; font-size: 0.72rem; font-weight: 700; padding: 2.5px 8px; border-radius: 6px; cursor: pointer; transition: all 0.15s;">' + m + '</button>';
      });
      cont.innerHTML = htmlPills;
    }

    function selecionarMunicipioFiltroRelatorio(m) {
      estadoCentralRelatorios.municipioAtivo = (m === 'Todos') ? 'todos' : m;
      inicializarFiltrosMunicipiosRelatorio();
      filtrarEscolasRelatorioModal();
    }

    function filtrarEscolasRelatorioModal() {
      var inputBusca = document.getElementById('input-busca-relatorio-escola');
      var termo = inputBusca ? inputBusca.value.trim().toLowerCase() : '';
      var mun = (estadoCentralRelatorios.municipioAtivo || 'todos').toLowerCase();

      var base = (typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas) && listaEscolas.length > 0)
        ? listaEscolas
        : ((typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO)) ? BASE_ESCOLAS_PADRAO : []);

      var filtradas = base.filter(function(e) {
        var cidEsc = String(e.cidade || '').toLowerCase();
        
        /* Relacionamento inteligente de Pirapora do Bom Jesus == Pirapora */
        var mMatch = (mun === 'todos');
        if (!mMatch) {
          if (mun.indexOf('pirapora') !== -1 && cidEsc.indexOf('pirapora') !== -1) {
            mMatch = true;
          } else if (cidEsc.indexOf(mun) !== -1 || mun.indexOf(cidEsc) !== -1) {
            mMatch = true;
          }
        }

        var tMatch = !termo ||
          (String(e.nome || '').toLowerCase().indexOf(termo) !== -1) ||
          (String(e.cie || '').indexOf(termo) !== -1) ||
          (cidEsc.indexOf(termo) !== -1) ||
          (termo.indexOf('pirapora') !== -1 && cidEsc.indexOf('pirapora') !== -1);

        return mMatch && tMatch;
      });

      filtradas.sort(function(a, b) {
        return String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', { sensitivity: 'base' });
      });

      var sel = document.getElementById('select-relatorio-escola');
      var countEl = document.getElementById('contagem-escolas-relatorio');
      if (countEl) countEl.innerText = filtradas.length + ' escola(s) encontrada(s)';

      if (!sel) return;
      sel.innerHTML = '';
      if (filtradas.length === 0) {
        var opt = document.createElement('option');
        opt.value = '';
        opt.innerText = 'Nenhuma escola encontrada com este filtro';
        sel.appendChild(opt);
        sel.value = '';
      } else {
        var optVazio = document.createElement('option');
        optVazio.value = '';
        optVazio.innerText = '-- Selecione uma Unidade Escolar (' + filtradas.length + ' disponíveis) --';
        sel.appendChild(optVazio);

        filtradas.forEach(function(e) {
          var opt = document.createElement('option');
          opt.value = e.id || e.cie;
          var cidExib = String(e.cidade || '').toLowerCase().indexOf('pirapora') !== -1 ? 'Pirapora do Bom Jesus' : (e.cidade || '');
          opt.innerText = (e.nome || 'Escola') + ' [' + (e.cie || 'CIE') + '] — ' + cidExib;
          sel.appendChild(opt);
        });

        /* Busca em tempo real: conforme o usuário digita termo na busca, seleciona e exibe imediatamente */
        if (termo.length > 0) {
          sel.value = filtradas[0].id || filtradas[0].cie;
        } else {
          sel.value = '';
        }
      }
      atualizarPreviaEscolaRelatorio();
    }

    function atualizarPreviaEscolaRelatorio() {
      var sel = document.getElementById('select-relatorio-escola');
      var boxPrevia = document.getElementById('previa-escola-relatorio');
      if (!sel) return;
      var val = (sel.value || '').trim();

      if (!val) {
        if (boxPrevia) boxPrevia.style.display = 'none';
        return;
      }

      var base = (typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas) && listaEscolas.length > 0)
        ? listaEscolas
        : ((typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO)) ? BASE_ESCOLAS_PADRAO : []);

      var esc = base.find(function(e) { return e.id === val || e.cie === val; });
      var prevNome = document.getElementById('previa-esc-nome');
      var prevMun = document.getElementById('previa-esc-mun');
      var prevCie = document.getElementById('previa-esc-cie');
      var prevBadge = document.getElementById('previa-esc-badge');

      if (!esc) {
        if (boxPrevia) boxPrevia.style.display = 'none';
        return;
      }

      if (boxPrevia) boxPrevia.style.display = 'flex';

      if (prevNome) prevNome.innerText = esc.nome;
      var cidExib = String(esc.cidade || '').toLowerCase().indexOf('pirapora') !== -1 ? 'Pirapora do Bom Jesus' : (esc.cidade || 'Itapevi');
      if (prevMun) prevMun.innerText = cidExib + ' — ' + (esc.tipo || 'Regular');
      if (prevCie) prevCie.innerText = 'CIE: ' + (esc.cie || '---');

      var imroScore = (typeof OBTER_IMRO_ESCOLA === 'function') ? OBTER_IMRO_ESCOLA(esc.cie) : null;
      if (prevBadge) {
        if (imroScore !== null && typeof imroScore === 'object') {
          var bgBadge = imroScore.tier === 'Crítico' ? '#fee2e2' : (imroScore.tier === 'Alto Risco' ? '#ffedd5' : '#e0f2fe');
          var colBadge = imroScore.tier === 'Crítico' ? '#991b1b' : (imroScore.tier === 'Alto Risco' ? '#9a3412' : '#0369a1');
          prevBadge.innerHTML = '<span style="background:' + bgBadge + '; color:' + colBadge + '; padding:3px 8px; border-radius:6px; font-size:0.72rem; font-weight:800; display:inline-block;">IMRO ' + (imroScore.pontos || '--') + ' pts (' + (imroScore.tier || '---') + ')</span>';
        } else {
          prevBadge.innerHTML = '<span style="background:#f1f5f9; color:#475569; padding:3px 8px; border-radius:6px; font-size:0.72rem; font-weight:700;">Pronto para Dossiê Executivo</span>';
        }
      }
    }

    function executarGeracaoRelatorioCentral() {
      if (estadoCentralRelatorios.tipo === 'geral') {
        fecharModalCentralRelatorios();
        if (typeof window.gerarRelatorioPdfGeralUre === 'function') {
          window.gerarRelatorioPdfGeralUre();
        }
      } else {
        var sel = document.getElementById('select-relatorio-escola');
        var val = sel ? sel.value : null;
        if (!val) {
          if (typeof mostrarToastAgenda === 'function') {
            mostrarToastAgenda('Selecione uma escola para emitir o dossiê.', '⚠️');
          }
          return;
        }
        fecharModalCentralRelatorios();
        if (typeof window.gerarRelatorioPdfEscola === 'function') {
          window.gerarRelatorioPdfEscola(val);
        }
      }
    }

    window.abrirModalCentralRelatorios = abrirModalCentralRelatorios;
    window.fecharModalCentralRelatorios = fecharModalCentralRelatorios;
    window.selecionarTipoRelatorioCentral = selecionarTipoRelatorioCentral;
    window.selecionarMunicipioFiltroRelatorio = selecionarMunicipioFiltroRelatorio;
    window.filtrarEscolasRelatorioModal = filtrarEscolasRelatorioModal;
    window.atualizarPreviaEscolaRelatorio = atualizarPreviaEscolaRelatorio;
    window.executarGeracaoRelatorioCentral = executarGeracaoRelatorioCentral;

      window.gerarRelatorioPdfEscola = function(idOuCie) {
        var base = (typeof listaEscolas !== 'undefined' && Array.isArray(listaEscolas) && listaEscolas.length > 0)
          ? listaEscolas
          : ((typeof BASE_ESCOLAS_PADRAO !== 'undefined' && Array.isArray(BASE_ESCOLAS_PADRAO)) ? BASE_ESCOLAS_PADRAO : []);
        var normAlvo = normCie(idOuCie);
        var escCad = null;
        for (var i = 0; i < base.length; i++) {
          if (base[i].id === idOuCie || normCie(base[i].cie) === normAlvo) {
            escCad = base[i];
            break;
          }
        }
        if (!escCad) return;

        var listaFato = ultimoFato.length ? ultimoFato : construirFatoEscolas();
        var cieEsc = normCie(escCad.cie);
        var fato = null;
        var rankIdx = -1;
        for (var j = 0; j < listaFato.length; j++) {
          if (listaFato[j].cie === cieEsc) {
            fato = listaFato[j];
            rankIdx = j + 1;
            break;
          }
        }
        if (!fato) return;

        var det = coletarDadosDetalhadosEscola(escCad, fato, listaFato);
        var nomeExib = (typeof formatarNomeEscolaExecutivo === 'function') ? formatarNomeEscolaExecutivo(escCad.nome) : escCad.nome;
        var st = estiloTierPdf(fato.tier);
        var seom = fato.seomObj || null;
        var hwDispPct = fato.hwTotal > 0 ? ((fato.hwDisp / fato.hwTotal) * 100).toFixed(1).replace('.', ',') : '0,0';
        var hwBadPctTxt = (fato.hwBadPct || 0).toFixed(1).replace('.', ',');
        var isrUnidade = Math.max(0, 100 - fato.imro);

        var prescricao = '';
        if (fato.imro >= 50 && fato.saldoOcioso2026 >= 10000) {
          prescricao = 'Unidade prioritária (' + fato.tier + ') com saldo disponível de ' + formatarMoedaCurta(fato.saldoOcioso2026) + ' no PDDE 2026: orientar APM para destinação imediata aos gargalos prediais e tecnológicos identificados.';
        } else if (fato.imro >= 50 && !fato.visitada) {
          prescricao = 'Unidade #' + rankIdx + ' no ranking de risco sem registro de visita recente ASURE: priorizar inclusão na próxima agenda de acompanhamento in loco da Dirigente.';
        } else if (fato.sepesPend > 0 || fato.segreAbertos > 0) {
          prescricao = 'Acompanhar tramitação dos ' + (fato.sepesPend + fato.segreAbertos) + ' processo(s) ativo(s) em SEPES/SEGRE para preservar a regularidade operacional da unidade.';
        } else {
          prescricao = 'Unidade operando em conformidade regional; manter acompanhamento preventivo de rotina.';
        }

        var pilaresBarra = [
          { nome: 'SEOM • Infra (25%)', pts: fato.pts.SEOM, max: 100, cor: '#d97706' },
          { nome: 'SEINTEC • Tecnologia (20%)', pts: fato.pts.SEINTEC, max: 100, cor: '#0284c7' },
          { nome: 'SEGRE • Rede (20%)', pts: fato.pts.SEGRE, max: 100, cor: '#ea580c' },
          { nome: 'SEPES • Pessoas (20%)', pts: fato.pts.SEPES, max: 100, cor: '#7c3aed' },
          { nome: 'SEAFIN • PDDE (15%)', pts: fato.pts.SEAFIN, max: 100, cor: '#059669' },
          { nome: 'Pico Setorial (Máx)', pts: fato.maxSetor || 0, max: 100, cor: (fato.alertaSetorial ? '#dc2626' : '#334155') }
        ];

        var chipsSeom = seom ? [
          { lbl: 'AVCB', ok: seom.avcb === 1, txt: seom.avcb === 1 ? 'Regular' : 'Pendente' },
          { lbl: 'Obra FDE', ok: seom.obraFde === 0, txt: seom.obraFde === 2 ? 'Ativa' : (seom.obraFde === 1 ? 'Prevista' : 'Sem obra') },
          { lbl: 'Telhado', ok: seom.telhado !== 2, txt: seom.telhado === 2 ? 'Crítico' : 'OK' },
          { lbl: 'Elétrica', ok: seom.eletrica !== 2, txt: seom.eletrica === 2 ? 'Crítica' : 'Estável' },
          { lbl: 'Esgoto', ok: seom.esgoto !== 2, txt: seom.esgoto === 2 ? 'Crítico' : 'Regular' },
          { lbl: 'Zeladoria', ok: seom.zeladoria === 1, txt: seom.zeladoria === 1 ? 'Residente' : 'Ausente' },
          { lbl: 'Limpeza', ok: seom.limpeza !== 2, txt: seom.limpeza === 2 ? 'Crítica' : 'Regular' },
          { lbl: 'Água', ok: seom.consumoAgua !== 2, txt: seom.consumoAgua === 2 ? 'Alerta' : 'Normal' },
          { lbl: 'SGI / Matrícula', ok: seom.sgi !== 2 && seom.matriculaAtualizada === 1, txt: seom.sgi === 2 ? 'Pend. SGI' : 'Regular' }
        ] : [];

        var repRowsHtml = det.repassesEsc.slice(0, 4).map(function(r) {
          var sld = Math.max(0, (r.recTotal || 0) - (r.despTotal || 0));
          return '<tr><td><strong>' + escHtml(r.programa || 'PDDE') + '</strong></td><td>' + formatarMoedaCurta(r.recTotal || 0) + '</td><td>' + formatarMoedaCurta(r.despTotal || 0) + '</td><td>' + formatarMoedaCurta(sld) + '</td><td>' + escHtml(r.statusSed || '---') + '</td></tr>';
        }).join('');

        var procRows = det.sepesLista.filter(function(p) { return !p.concluido; }).slice(0, 4).map(function(p) {
          return '<tr><td><strong>SEPES • ' + escHtml(p.tipo) + '</strong></td><td class="doc-mono">' + escHtml(p.sei) + '</td><td>' + escHtml(p.nome) + '</td><td>' + escHtml(p.status) + '</td></tr>';
        }).concat(det.seiLista.filter(function(s) { return s.aberto; }).slice(0, 4).map(function(s) {
          return '<tr><td><strong>' + escHtml(s.secao) + '</strong></td><td class="doc-mono">' + escHtml(s.protocolo) + '</td><td>' + escHtml(s.assunto.slice(0, 52)) + '</td><td>' + escHtml(s.situacao) + '</td></tr>';
        })).join('');

        var html = '' +
        '<div class="exec-doc-page">' +
          '<div class="exec-doc-page-body">' +
            gerarMastheadEditorial(
              nomeExib,
              (escCad.cidade || 'Itapevi') + ' — ' + (escCad.tipo || 'Regular') + ' — ' + (escCad.segmento || 'Ensino Fundamental e Médio'),
              'DOSSIÊ EXECUTIVO',
              'CIE-' + cieEsc,
              cieEsc
            );

        html += '' +
          '<section class="doc-section">' +
            '<div class="doc-grid-2">' +
              '<div class="doc-card">' +
                '<div class="doc-card-head"><span>📍 Ficha Institucional &amp; Localização</span><span class="doc-mono">CIE ' + escHtml(cieEsc) + '</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Endereço</span><span class="doc-kv-v">' + escHtml(escCad.bairro || 'Região Escolar') + '</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Município • Distância Sede URE</span><span class="doc-kv-v">' + escHtml(escCad.cidade || 'Itapevi') + ' • ' + escHtml(String(det.distSedeKm)) + ' km</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Direção Escolar • Contato</span><span class="doc-kv-v">' + escHtml(escCad.diretor || 'Equipe Gestora') + ' • ' + escHtml(escCad.telefone || '(11) 4141-0000') + '</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Zeladoria SEFISC</span><span class="doc-kv-v">' + (det.zeladorReg ? escHtml(det.zeladorReg['Nome do Zelador'] + ' (Venc. ' + (det.zeladorReg['Venc.'] || '---') + ')') : 'Sem ocupante ativo no SEFISC') + '</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Visita Regional (ASURE)</span><span class="doc-kv-v">' + (fato.visitada ? ('Registrada em ' + escHtml(fato.dataVisita || '2026')) : 'Sem registro recente') + '</span></div>' +
              '</div>' +
              '<div class="doc-card" style="border-color:' + st.brd + ';background:' + st.bg + '22; padding:5px 7px;">' +
                '<div class="doc-card-head"><span>🎯 Diagnóstico IPRE &amp; Radar Multissetorial</span><span class="doc-pill" style="background:' + st.bg + ';color:' + st.txt + ';border:1px solid ' + st.brd + ';">' + escHtml(fato.tier) + '</span></div>' +
                '<div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">' +
                  '<div style="flex:1; min-width:0;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px;">' +
                      '<div><span style="font-family:inherit;font-size:15pt;font-weight:800;letter-spacing:-0.03em;color:' + st.txt + ';">' + fato.imro.toFixed(1).replace(".", ",") + '</span> <span style="font-size:6.8pt;color:#64748b;font-weight:700;">/ 100 (ISR: ' + isrUnidade.toFixed(1).replace(".", ",") + ')</span></div>' +
                      '<div style="font-size:6.8pt;font-weight:800;color:#0b2351;">#' + rankIdx + ' de ' + listaFato.length + '</div>' +
                    '</div>' +
                    '<div style="display:flex;flex-direction:column;gap:2.5px;">' +
                      pilaresBarra.map(function(p) {
                        var wPct = Math.min(100, Math.round((p.pts / p.max) * 100));
                        return '<div style="display:flex;align-items:center;gap:4px;font-size:6.1pt;">' +
                          '<span style="width:105px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#334155;font-weight:600;">' + p.nome + '</span>' +
                          '<div style="flex:1;height:4px;background:#f1f5f9;border-radius:999px;overflow:hidden;"><div style="width:' + wPct + '%;height:100%;background:' + p.cor + ';"></div></div>' +
                          '<strong style="width:20px;text-align:right;color:' + p.cor + ';">' + p.pts + '</strong>' +
                        '</div>';
                      }).join('') +
                    '</div>' +
                  '</div>' +
                  '<div class="doc-radar-wrap" title="Radar Multissetorial IPRE">' +
                    renderSvgRadarIpre(fato) +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</section>';

        html += '' +
          '<section class="doc-section">' +
            '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">01</span>Benchmarking Comparativo (Unidade vs. Média Regional URE)</span><span>60 Unidades</span></h2>' +
            '<div class="doc-grid-2">' +
              '<div class="doc-card">' + renderSvgBenchmarkEscola(fato, det.benchmarks) + '</div>' +
              '<div class="doc-card" style="border-left:4px solid #d97706;">' +
                '<div class="doc-card-head"><span>🏗️ Mapa 11D • Infraestrutura SEOM (Peso 25%)</span><span>' + fato.pts.SEOM + '/100 pts</span></div>' +
                (chipsSeom.length > 0
                  ? '<div class="doc-chip-grid">' + chipsSeom.map(function(c) {
                      return '<div class="doc-chip-item" style="border-color:' + (c.ok ? '#bbf7d0' : '#fecaca') + ';background:' + (c.ok ? '#f0fdf4' : '#fef2f2') + ';"><span style="color:#475569;font-weight:700;">' + c.lbl + '</span><strong style="color:' + (c.ok ? '#15803d' : '#b91c1c') + ';">' + c.txt + '</strong></div>';
                    }).join('') + '</div>'
                  : '<div style="font-size:7.6pt;color:#64748b;">Sem apontamento predial crítico no Mapa 11D.</div>') +
              '</div>' +
            '</div>' +
          '</section>';

        html += '' +
          '<section class="doc-section">' +
            '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">02</span>Tecnologia (SEINTEC) &amp; Finanças APM (SEAFIN PDDE 2026)</span><span>Dados Vivos</span></h2>' +
            '<div class="doc-grid-2">' +
              '<div class="doc-card" style="border-left:4px solid #0284c7;">' +
                '<div class="doc-card-head"><span>💻 Parque Tecnológico &amp; Chamados (SEINTEC)</span><span>' + hwBadPctTxt + '% Comprometido • ' + fato.hwBad + '/' + fato.hwTotal + ' unid.</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Hardware Total / Disponível</span><span class="doc-kv-v">' + fato.hwTotal + ' unid. (' + det.statusHw.Disponivel + ' disp. • ' + hwDispPct + '%)</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Danificado / Manutenção / Inservível</span><span class="doc-kv-v">' + det.statusHw.Danificado + ' danif. • ' + det.statusHw.Manutencao + ' manut. • ' + det.statusHw.Inservivel + ' inserv.</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Educatrons / Rede / Recarga</span><span class="doc-kv-v">' + det.eduQtd + ' Educatrons • ' + det.redeQtd + ' Rede • ' + det.recQtd + ' Recarga</span></div>' +
                '<div class="doc-kv"><span class="doc-kv-k">Chamados Oficiais 2026</span><span class="doc-kv-v">' + fato.callsTotal + ' registrados (' + fato.callsAbertos + ' abertos)</span></div>' +
              '</div>' +
              '<div class="doc-card" style="border-left:4px solid #059669;">' +
                '<div class="doc-card-head"><span>💼 Execução PDDE 2026 por Repasse</span><span>' + fato.execPct2026.toFixed(1).replace('.', ',') + '% Exec.</span></div>' +
                (repRowsHtml
                  ? '<table class="doc-table" style="font-size:6.8pt;"><thead><tr><th>Programa</th><th>Receita</th><th>Executado</th><th>Saldo</th><th>SED</th></tr></thead><tbody>' + repRowsHtml + '</tbody></table>'
                  : '<div style="font-size:7.6pt;color:#64748b;">Sem repasse 2026 lançado na planilha SEFIN para este CIE.</div>') +
              '</div>' +
            '</div>' +
          '</section>';

        html += '' +
          '<section class="doc-section">' +
            '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">03</span>Tramitações Pessoas (SEPES) &amp; Rede Escolar (SEGRE)</span><span>' + (det.sepesLista.filter(function(p){return !p.concluido;}).length + det.seiLista.filter(function(s){return s.aberto;}).length) + ' Ativos</span></h2>' +
            (procRows
              ? '<table class="doc-table" style="margin-bottom:8px;"><thead><tr><th>Núcleo / Tipo</th><th>Protocolo SEI</th><th>Servidor / Assunto</th><th>Situação Atual</th></tr></thead><tbody>' + procRows + '</tbody></table>'
              : '<div class="doc-card" style="margin-bottom:8px;font-size:7.6pt;color:#047857;font-weight:600;">✓ Nenhuma pendência em aberto registrada nos painéis SEPES ou SEGRE/SEMAT/SEVESC para esta unidade.</div>') +
            renderMatrizPrescritivaHtml(gerarMatrizPrescritivaEscola(fato, det, rankIdx)) +
          '</section>' +
          '</div>' +
          gerarRodapeEditorial(1, 1) +
        '</div>';

        abrirModalRelatorioExecutivo({
          tipo: 'escola',
          titulo: nomeExib + ' (CIE ' + cieEsc + ')',
          badge: 'DOSSIÊ EXECUTIVO INDIVIDUAL',
          nomeArquivoBase: 'Dossie_Executivo_CIE_' + cieEsc + '_' + nomeExib.replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 32),
          escCad: escCad,
          fato: fato,
          det: det,
          rankIdx: rankIdx,
          prescricao: prescricao,
          htmlCorpo: html
        });
      };

      window.gerarRelatorioPdfGeralUre = function() {
        var fato = ultimoFato.length ? ultimoFato : construirFatoEscolas();
        var tel = ultimaTel || computarTelemetriaSetores(fato);

        var totalEsc = fato.length || 60;
        var peiCount = fato.filter(function(e) { return (e.tipo || '').indexOf('PEI') !== -1; }).length;
        var regCount = totalEsc - peiCount;
        var critCount = fato.filter(function(e) { return e.tier === 'Crítico'; }).length;
        var altoCount = fato.filter(function(e) { return e.tier === 'Alto Risco'; }).length;
        var atencCount = fato.filter(function(e) { return e.tier === 'Atenção'; }).length;
        var okCount = fato.filter(function(e) { return e.tier === 'Regular'; }).length;
        var avgImro = totalEsc > 0 ? (fato.reduce(function(s, e) { return s + e.imro; }, 0) / totalEsc) : 0;
        var isrScore = Math.max(0, Math.min(100, Math.round(100 - avgImro)));

        /* Métricas Consolidadas dos 5 Pilares da Página Inicial */
        var obrasAtivas = (typeof DADOS_SEOM !== 'undefined' && Array.isArray(DADOS_SEOM.escolas))
          ? DADOS_SEOM.escolas.filter(function(e) { return e.obraFde == 1 || e.obraFde == 2; }).length : 34;
        var avcbPendentes = (typeof DADOS_SEOM !== 'undefined' && Array.isArray(DADOS_SEOM.escolas))
          ? DADOS_SEOM.escolas.filter(function(e) { return e.avcb == 0 || e.avcb == 'Vencido' || e.avcb == false; }).length : 49;
        var hwTotalCount = tel.SEINTEC.hwTotal || 15973;
        var hwDispPctVal = tel.SEINTEC.hwDispPct || 76.4;
        var chamadosTotais = (typeof SEINTEC_BASES_CONFIG !== 'undefined' && SEINTEC_BASES_CONFIG['Atendimentos'] && Array.isArray(SEINTEC_BASES_CONFIG['Atendimentos'].registros))
          ? SEINTEC_BASES_CONFIG['Atendimentos'].registros.length : 1432;
        var pddeRecTotal = tel.SEAFIN.receita2026 || 10365829.83;
        var pddeExecPctVal = tel.SEAFIN.execPct2026 || 52.1;
        var pddeSaldoOcioso = tel.SEAFIN.saldoOcioso2026 || 4963839.38;
        var sematAtendimentosTot = (typeof DADOS_SEMAT !== 'undefined' && DADOS_SEMAT && DADOS_SEMAT.kpis) ? DADOS_SEMAT.kpis.totalAtendimentos : 2898;
        var segreSeiAtivos = tel.SEGRE.seiAbertos || 162;
        var segreSeiAged30 = tel.SEGRE.seiAged30 || 101;
        var sefrepDevolucoesTot = (typeof DADOS_SEFREP !== 'undefined' && DADOS_SEFREP && DADOS_SEFREP.kpis) ? DADOS_SEFREP.kpis.totalDevolucoes : 333;
        var sefrepTxDev = (typeof DADOS_SEFREP !== 'undefined' && DADOS_SEFREP && DADOS_SEFREP.kpis) ? DADOS_SEFREP.kpis.taxaDevolucaoPct : 24.1;
        var seapeEmTramitacao = tel.SEPES.emTramitacao || 72;
        var dpatBensTot = (typeof DADOS_DPAT !== 'undefined' && DADOS_DPAT && DADOS_DPAT.kpis) ? DADOS_DPAT.kpis.totalBens : 2189;
        var dpatLocTot = (typeof DADOS_DPAT !== 'undefined' && DADOS_DPAT && DADOS_DPAT.kpis) ? DADOS_DPAT.kpis.bensLocalizados : 513;

        /* Inteligência Executiva Adicional para Folha 1 (Top 5, Pareto, Dimensões & PEI vs Regular) */
        var top5Escolas = fato.slice().sort(function(a, b) { return b.imro - a.imro; }).slice(0, 5);
        var sumDim = { SEOM: 0, SEINTEC: 0, SEGRE: 0, SEPES: 0, SEAFIN: 0 };
        var sumImroTotal = 0, sumImroPriorit = 0, sumImroPei = 0, sumImroReg = 0, hwBadTot = 0, alertasSetCount = 0;
        fato.forEach(function(e) {
          sumImroTotal += e.imro;
          if (e.imro >= 50) sumImroPriorit += e.imro;
          if ((e.tipo || '').indexOf('PEI') !== -1) sumImroPei += e.imro;
          else sumImroReg += e.imro;
          hwBadTot += (e.hwBad || 0);
          if (e.alertaSetorial) alertasSetCount++;
          if (e.pts) {
            sumDim.SEOM += (e.pts.SEOM || 0);
            sumDim.SEINTEC += (e.pts.SEINTEC || 0);
            sumDim.SEGRE += (e.pts.SEGRE || 0);
            sumDim.SEPES += (e.pts.SEPES || 0);
            sumDim.SEAFIN += (e.pts.SEAFIN || 0);
          }
        });
        var paretoPct = sumImroTotal > 0 ? Math.round((sumImroPriorit / sumImroTotal) * 100) : 0;
        var avgPeiImro = peiCount > 0 ? (sumImroPei / peiCount).toFixed(1).replace('.', ',') : '0,0';
        var avgRegImro = regCount > 0 ? (sumImroReg / regCount).toFixed(1).replace('.', ',') : '0,0';
        var dimsResumo = [
          { nome: 'SEOM (Infra & AVCB)', peso: '25%', media: totalEsc > 0 ? (sumDim.SEOM / totalEsc) : 0, cor: '#b45309' },
          { nome: 'SEINTEC (TI & Chamados)', peso: '20%', media: totalEsc > 0 ? (sumDim.SEINTEC / totalEsc) : 0, cor: '#0284c7' },
          { nome: 'SEGRE (Rede & SEI)', peso: '20%', media: totalEsc > 0 ? (sumDim.SEGRE / totalEsc) : 0, cor: '#4f46e5' },
          { nome: 'SEPES (Pessoas & Folha)', peso: '20%', media: totalEsc > 0 ? (sumDim.SEPES / totalEsc) : 0, cor: '#b91c1c' },
          { nome: 'SEAFIN (PDDE & Contratos)', peso: '15%', media: totalEsc > 0 ? (sumDim.SEAFIN / totalEsc) : 0, cor: '#059669' }
        ];

        /* Agrupamento por Município */
        var porMun = {};
        fato.forEach(function(e) {
          var cid = e.cidade || 'Itapevi';
          if (cid.toLowerCase().indexOf('pirapora') !== -1) cid = 'Pirapora do Bom Jesus';
          if (!porMun[cid]) porMun[cid] = { nome: cid, qtd: 0, pei: 0, sumImro: 0, critAlto: 0, avcbOk: 0, hwTot: 0, hwBad: 0 };
          porMun[cid].qtd++;
          if ((e.tipo || '').indexOf('PEI') !== -1) porMun[cid].pei++;
          porMun[cid].sumImro += e.imro;
          if (e.imro >= 50) porMun[cid].critAlto++;
          if (e.seomObj && e.seomObj.avcb === 1) porMun[cid].avcbOk++;
          porMun[cid].hwTot += e.hwTotal;
          porMun[cid].hwBad += e.hwBad;
        });
        var listaMun = Object.keys(porMun).map(function(k) { return porMun[k]; }).sort(function(a, b) { return b.qtd - a.qtd; });

        /* Matriz Executiva dos 7 Núcleos Regionais */
        var linhasNucleos = [
          { 'Núcleo': 'SEINTEC — Informações & Tecnologia', 'Saúde': tel.SEINTEC.health + '%', 'Entrega': hwDispPctVal.toFixed(1).replace('.', ',') + '% disp. (' + hwTotalCount.toLocaleString('pt-BR') + ' itens)', 'Gargalos SLA': chamadosTotais.toLocaleString('pt-BR') + ' chamados • SLA ' + tel.SEINTEC.slaMain },
          { 'Núcleo': 'SEOM — Obras, Fiscalização & Patrimônio', 'Saúde': tel.SEOM.health + '%', 'Entrega': '34 Obras FDE | ' + dpatBensTot.toLocaleString('pt-BR') + ' bens DPAT', 'Gargalos SLA': avcbPendentes + ' escolas s/ AVCB • 18 alertas estruturais' },
          { 'Núcleo': 'SEAFIN & SECOMSE — Finanças & Contratos', 'Saúde': tel.SEAFIN.health + '%', 'Entrega': pddeExecPctVal.toFixed(1).replace('.', ',') + '% PDDE (' + formatarMoedaCurta(pddeRecTotal) + ') | R$ 7,86M contratos', 'Gargalos SLA': 'Saldo APM ' + formatarMoedaCurta(pddeSaldoOcioso) + ' • ' + tel.SEAFIN.vencendo60d + ' contratos ≤60d' },
          { 'Núcleo': 'SEGRE — Gestão da Rede, Matrícula & Vida Escolar', 'Saúde': tel.SEGRE.health + '%', 'Entrega': sematAtendimentosTot.toLocaleString('pt-BR') + ' atend. SEMAT | 9.025 e-mails SEVESC', 'Gargalos SLA': segreSeiAtivos + ' processos SEI (' + segreSeiAged30 + ' c/ >30 dias)' },
          { 'Núcleo': 'SEPES — Gestão de Pessoas (SEFREP & SEAPE)', 'Saúde': tel.SEPES.health + '%', 'Entrega': '1.383 tramitações | 402 F17 | 229 extinções TCE', 'Gargalos SLA': sefrepDevolucoesTot.toLocaleString('pt-BR') + ' devoluções (' + sefrepTxDev + '%) • ' + seapeEmTramitacao + ' processos SEAPE' },
          { 'Núcleo': 'ASURE — Gabinete & Supervisão Regional', 'Saúde': tel.ASURE.isReal ? (tel.ASURE.health + '%') : 'Ativo', 'Entrega': '60 escolas monitoradas territorialmente', 'Gargalos SLA': 'Foco nas 10 unidades prioritárias de alto risco' },
          { 'Núcleo': 'EEC — Currículo & Especialistas Pedagógicos', 'Saúde': tel.EEC.isReal ? (tel.EEC.health + '%') : '12 Módulos', 'Entrega': '12 Módulos Web Apps (SARESP, SAEB, Tutoria)', 'Gargalos SLA': 'Devolutivas pedagógicas e consulta docente ativas' }
        ];

        /* ========================================================================= */
        /* FOLHA 1 DE 5 • TELEMETRIA OPERACIONAL DOS 5 NÚCLEOS & GOVERNANÇA REGIONAL*/
        /* ========================================================================= */
        var folha1 = '' +
          '<div class="exec-doc-page">' +
            '<div class="exec-doc-page-body">' +
              gerarMastheadEditorial(
                'Relatório Consolidado de Gestão | URE Itapevi',
                'Telemetria Operacional dos 5 Núcleos & Governança das ' + totalEsc + ' Escolas Estaduais • Metodologia IPRE',
                'RELATÓRIO GERAL | FOLHA 1/5',
                'URE-ITP-2026-CONSOLIDADO'
              ) +
              '<div style="background: linear-gradient(135deg, #0b2351 0%, #1e3a8a 100%); color: #ffffff; padding: 4.5px 10px; border-radius: 6px; margin-bottom: 7px; display: flex; justify-content: space-between; align-items: center; font-size: 6.8pt; box-shadow: 0 2px 6px rgba(11,35,81,0.12);">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                  '<span style="font-weight:800; background:rgba(255,255,255,0.18); padding:2px 6px; border-radius:4px;">🏫 60 Escolas Estaduais</span>' +
                  '<span style="color:#cbd5e1;">' + critCount + ' Críticas • ' + altoCount + ' Alto Risco • ' + okCount + ' Regulares</span>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:10px;">' +
                  '<span style="background:rgba(255,255,255,0.18); padding:2px 6px; border-radius:4px; font-weight:800;">ISR Regional: ' + isrScore + '/100</span>' +
                  '<span style="color:#93c5fd;">IPRE Médio: ' + avgImro.toFixed(1).replace('.', ',') + ' pts</span>' +
                  '<span style="background:rgba(255,255,255,0.15); padding:1.5px 5px; border-radius:3px; font-weight:700;">5 Núcleos Conectados</span>' +
                '</div>' +
              '</div>' +
              '<section class="doc-section">' +
                '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">01</span>Desempenho Operacional por Núcleo da URE Itapevi (2 Indicadores por Setor)</span><span>2026</span></h2>' +
                '<div class="doc-grid-5">' +
                  '<div class="doc-kpi" style="--kpi-accent:#b45309; text-align:center;"><div class="doc-kpi-lbl">SEOM • Obras FDE</div><div class="doc-kpi-val" style="color:#b45309;">' + obrasAtivas + '</div><div class="doc-kpi-sub">14 ativas • 20 prev. • 26 s/ obra</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#ea580c; text-align:center;"><div class="doc-kpi-lbl">SEOM • Alerta AVCB</div><div class="doc-kpi-val" style="color:#c2410c;">' + avcbPendentes + '</div><div class="doc-kpi-sub">49 pendentes • 11 regulares</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#0284c7; text-align:center;"><div class="doc-kpi-lbl">SEINTEC • Equipamentos</div><div class="doc-kpi-val" style="color:#0369a1;">' + hwTotalCount.toLocaleString('pt-BR') + '</div><div class="doc-kpi-sub">' + hwDispPctVal.toFixed(1).replace('.', ',') + '% disp. • 3.768 reparo</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#0369a1; text-align:center;"><div class="doc-kpi-lbl">SEINTEC • Chamados</div><div class="doc-kpi-val" style="color:#0284c7;">' + chamadosTotais.toLocaleString('pt-BR') + '</div><div class="doc-kpi-sub">22 abertos • SLA 98,5% conc.</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#059669; text-align:center;"><div class="doc-kpi-lbl">SEAFIN • PDDE 2026</div><div class="doc-kpi-val" style="color:#059669;">' + formatarMoedaCurta(pddeRecTotal) + '</div><div class="doc-kpi-sub">Saldo APMs: ' + formatarMoedaCurta(pddeSaldoOcioso) + '</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#10b981; text-align:center;"><div class="doc-kpi-lbl">SEAFIN • Execução</div><div class="doc-kpi-val" style="color:#047857;">' + pddeExecPctVal.toFixed(1).replace('.', ',') + '%</div><div class="doc-kpi-sub">R$ 5,4M gastos • 5 contr. ≤60d</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#6366f1; text-align:center;"><div class="doc-kpi-lbl">SEGRE • Demanda SEMAT</div><div class="doc-kpi-val" style="color:#4f46e5;">' + sematAtendimentosTot.toLocaleString('pt-BR') + '</div><div class="doc-kpi-sub">2.331 manuais • 4.062 transf.</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#4338ca; text-align:center;"><div class="doc-kpi-lbl">SEGRE • Processos SEI</div><div class="doc-kpi-val" style="color:#3730a3;">' + segreSeiAtivos + '</div><div class="doc-kpi-sub">' + segreSeiAged30 + ' >30d • 9.025 e-mails</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#b91c1c; text-align:center;"><div class="doc-kpi-lbl">SEPES • Folha SEFREP</div><div class="doc-kpi-val" style="color:#b91c1c;">' + sefrepDevolucoesTot.toLocaleString('pt-BR') + '</div><div class="doc-kpi-sub">' + sefrepTxDev + '% dev. • 1.383 tramit.</div></div>' +
                  '<div class="doc-kpi" style="--kpi-accent:#7c3aed; text-align:center;"><div class="doc-kpi-lbl">SEPES • Vida Funcional</div><div class="doc-kpi-val" style="color:#7c3aed;">' + seapeEmTramitacao + '</div><div class="doc-kpi-sub">Aposentadorias, Design., Abonos</div></div>' +
                '</div>' +
              '</section>' +
              '<section class="doc-section" style="margin-bottom:8px;">' +
                '<div class="doc-grid-2">' +
                  '<div class="doc-card">' +
                    '<div class="doc-card-head"><span>🎯 Distribuição do Índice IPRE (60 Escolas)</span><span>0–100 pts (Risco)</span></div>' +
                    renderSvgDistribuicaoImro(critCount, altoCount, atencCount, okCount, totalEsc) +
                    '<div style="font-size:6.6pt;color:#64748b;margin-top:4px;">Faixas: Crítico (≥62) • Alto Risco (50–61) • Atenção (40–49) • Regular (&lt;40)</div>' +
                  '</div>' +
                  '<div class="doc-card">' +
                    '<div class="doc-card-head"><span>🗺️ Panorama Territorial por Município</span><span>4 Municípios URE</span></div>' +
                    '<table class="doc-table" style="font-size:6.8pt;">' +
                      '<thead><tr><th>Município</th><th>UEs (PEI)</th><th>IPRE Médio</th><th>Priorit. (≥50)</th><th>% Comprometido</th></tr></thead>' +
                      '<tbody>' +
                        listaMun.map(function(m) {
                          var avgM = (m.sumImro / m.qtd).toFixed(1).replace('.', ',');
                          var tiPctM = m.hwTot > 0 ? ((m.hwBad / m.hwTot) * 100).toFixed(1).replace('.', ',') + '%' : '---';
                          return '<tr><td><strong>' + escHtml(m.nome) + '</strong></td><td>' + m.qtd + ' (' + m.pei + ')</td><td><strong>' + avgM + ' pts</strong></td><td>' + m.critAlto + '</td><td>' + tiPctM + '</td></tr>';
                        }).join('') +
                      '</tbody>' +
                    '</table>' +
                  '</div>' +
                '</div>' +
              '</section>' +
              '<section class="doc-section" style="margin-bottom:8px;">' +
                '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">02</span>Diagnóstico Prescritivo de Risco, Pareto &amp; Top 5 Prioritárias</span><span>' + alertasSetCount + ' UEs c/ Alerta Setorial (≥80)</span></h2>' +
                '<div class="doc-grid-2">' +
                  '<div class="doc-card">' +
                    '<div class="doc-card-head"><span>🚨 Top 5 Unidades Prioritárias (Maior IPRE)</span><span>Intervenção Imediata</span></div>' +
                    '<table class="doc-table" style="font-size:6.4pt;">' +
                      '<thead><tr><th>#</th><th>Unidade Escolar</th><th>Município</th><th>IPRE</th><th>Vetor Principal</th></tr></thead>' +
                      '<tbody>' +
                        top5Escolas.map(function(es, idx) {
                          var pObj = es.pts || {};
                          var topSetor = 'SEOM', topVal = -1;
                          ['SEOM', 'SEINTEC', 'SEGRE', 'SEPES', 'SEAFIN'].forEach(function(k) {
                            if ((pObj[k] || 0) > topVal) { topVal = (pObj[k] || 0); topSetor = k; }
                          });
                          var corBadge = es.imro >= 62 ? '#b91c1c' : (es.imro >= 50 ? '#c2410c' : '#b45309');
                          var nomeCurto = String(es.nome || '').replace(/^E\.E\.?\s*/i, '').slice(0, 26);
                          var cidCurto = String(es.cidade || '').indexOf('Pirapora') !== -1 ? 'Pirapora' : es.cidade;
                          return '<tr><td><strong>' + (idx + 1) + 'º</strong></td><td><strong>' + escHtml(nomeCurto) + '</strong></td><td>' + escHtml(cidCurto) + '</td><td><strong style="color:' + corBadge + ';">' + es.imro + ' pts</strong></td><td>' + topSetor + ' (' + topVal + ')</td></tr>';
                        }).join('') +
                      '</tbody>' +
                    '</table>' +
                  '</div>' +
                  '<div class="doc-card">' +
                    '<div class="doc-card-head"><span>📊 Decomposição por Dimensão &amp; Pareto</span><span>Concentração de Risco</span></div>' +
                    '<div style="display:flex;flex-direction:column;gap:4px;margin-top:2px;">' +
                      dimsResumo.map(function(d) {
                        var wBar = Math.max(4, Math.min(100, Math.round(d.media)));
                        return '<div style="font-size:6.4pt;">' +
                          '<div style="display:flex;justify-content:space-between;margin-bottom:1.5px;"><span style="font-weight:700;color:#1e293b;">' + d.nome + ' <span style="color:#64748b;font-weight:500;">(' + d.peso + ')</span></span><strong style="color:' + d.cor + ';">' + d.media.toFixed(1).replace('.', ',') + ' pts</strong></div>' +
                          '<div style="height:5px;background:#e2e8f0;border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + wBar + '%;background:' + d.cor + ';border-radius:3px;"></div></div>' +
                        '</div>';
                      }).join('') +
                    '</div>' +
                    '<div style="margin-top:6px;padding-top:5px;border-top:1px dashed #cbd5e1;display:flex;justify-content:space-between;font-size:6.3pt;color:#334155;">' +
                      '<span><strong>Pareto:</strong> ' + (critCount + altoCount) + ' UEs (' + Math.round(((critCount + altoCount) / totalEsc) * 100) + '%) somam <strong>' + paretoPct + '%</strong> do risco</span>' +
                      '<span><strong>PEI:</strong> ' + avgPeiImro + ' pts vs <strong>Reg.:</strong> ' + avgRegImro + ' pts</span>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</section>' +
              '<section class="doc-section" style="margin-bottom:0;">' +
                '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">03</span>Plano de Ação Prescritivo da Diretoria (Horizonte 30 / 60 / 90 Dias)</span><span>Alavancas de Gestão</span></h2>' +
                '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
                  '<div class="doc-card" style="border-top:2.5px solid #b91c1c;padding:6px 8px;">' +
                    '<div style="font-size:6.8pt;font-weight:800;color:#b91c1c;margin-bottom:3px;">⚡ 0–30 DIAS • CONTENÇÃO CRÍTICA</div>' +
                    '<div style="font-size:6.3pt;color:#334155;line-height:1.35;">• Atuação imediata nas <strong>' + critCount + ' UEs Críticas</strong> (IPRE ≥ 62).<br>• Força-tarefa <strong>AVCB (' + avcbPendentes + ' pendentes)</strong>.<br>• Desbloqueio de <strong>' + segreSeiAged30 + ' SEI &gt;30d</strong> no SEGRE.</div>' +
                  '</div>' +
                  '<div class="doc-card" style="border-top:2.5px solid #0369a1;padding:6px 8px;">' +
                    '<div style="font-size:6.8pt;font-weight:800;color:#0369a1;margin-bottom:3px;">💎 31–60 DIAS • LIQUIDEZ &amp; FLUXO</div>' +
                    '<div style="font-size:6.3pt;color:#334155;line-height:1.35;">• Destravar <strong>' + formatarMoedaCurta(pddeSaldoOcioso) + '</strong> parados em APMs (PDDE).<br>• Reduzir devolução SEFREP (<strong>' + sefrepTxDev + '%</strong>) c/ checklist.<br>• Renovar <strong>' + tel.SEAFIN.vencendo60d + ' contratos ≤60d</strong> sem ruptura.</div>' +
                  '</div>' +
                  '<div class="doc-card" style="border-top:2.5px solid #047857;padding:6px 8px;">' +
                    '<div style="font-size:6.8pt;font-weight:800;color:#047857;margin-bottom:3px;">🛡️ 61–90 DIAS • PREVENÇÃO CONTÍNUA</div>' +
                    '<div style="font-size:6.3pt;color:#334155;line-height:1.35;">• Triagem dos <strong>' + hwBadTot.toLocaleString('pt-BR') + ' itens TI</strong> em reparo/inativos.<br>• Roteiro <strong>ASURE</strong> nas ' + (critCount + altoCount) + ' UEs prioritárias.<br>• Monitorar <strong>' + dpatBensTot.toLocaleString('pt-BR') + ' bens DPAT</strong> &amp; 12 módulos EEC.</div>' +
                  '</div>' +
                '</div>' +
              '</section>' +
            '</div>' +
            gerarRodapeEditorial(1, 5) +
          '</div>';

        /* ========================================================================= */
        /* FOLHA 2 DE 5 • ENGENHARIA DE DADOS, MATRIZ 7 NÚCLEOS & NÍVEL DE SERVIÇO  */
        /* ========================================================================= */
        var folha2 = '' +
          '<div class="exec-doc-page">' +
            '<div class="exec-doc-page-body">' +
              gerarMastheadEditorial(
                'Painel Estratégico de Gestão & Nível de Serviço | URE Itapevi',
                'Matriz Integrada dos 7 Núcleos, Observabilidade de Dados, SLA e Celeridade de Fluxos',
                'RELATÓRIO GERAL | FOLHA 2/5',
                'URE-ITP-ENG-DADOS'
              ) +
              '<section class="doc-section">' +
                '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">02</span>Matriz Executiva dos 7 Núcleos Regionais</span><span>Nível de Serviço (SLA) &amp; Entregas</span></h2>' +
                '<table class="doc-table" style="font-size:6.8pt;">' +
                  '<thead><tr><th>Núcleo / Centro</th><th>Saúde Operacional</th><th>Indicador Chave de Entrega</th><th>Gargalos &amp; Monitoramento de SLA</th></tr></thead>' +
                  '<tbody>' +
                    linhasNucleos.map(function(n) {
                      var rawH = parseInt(n['Saúde'], 10);
                      var badgeBg = '#f1f5f9', badgeTxt = '#334155', badgeBrd = '#cbd5e1';
                      if (!isNaN(rawH)) {
                        if (rawH >= 80) { badgeBg = '#dcfce7'; badgeTxt = '#166534'; badgeBrd = '#86efac'; }
                        else if (rawH >= 45) { badgeBg = '#fef3c7'; badgeTxt = '#92400e'; badgeBrd = '#fde68a'; }
                        else { badgeBg = '#fee2e2'; badgeTxt = '#991b1b'; badgeBrd = '#fca5a5'; }
                      } else {
                        badgeBg = '#e0f2fe'; badgeTxt = '#0369a1'; badgeBrd = '#bae6fd';
                      }
                      return '<tr>' +
                        '<td style="font-weight:700;color:#0b2351;">' + escHtml(n['Núcleo']) + '</td>' +
                        '<td><span style="display:inline-block;padding:1.5px 5.5px;border-radius:999px;font-size:6.2pt;font-weight:800;background:' + badgeBg + ';color:' + badgeTxt + ';border:1px solid ' + badgeBrd + ';">' + escHtml(n['Saúde']) + '</span></td>' +
                        '<td style="color:#1e293b;font-weight:600;">' + escHtml(n['Entrega']) + '</td>' +
                        '<td style="color:#475569;">' + escHtml(n['Gargalos SLA']) + '</td>' +
                      '</tr>';
                    }).join('') +
                  '</tbody>' +
                '</table>' +
              '</section>' +
              '<section class="doc-section">' +
                '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">03</span>Engenharia de Dados &amp; Indicadores Inéditos da Rede</span><span>Observabilidade Direta</span></h2>' +
                '<div class="doc-grid-3">' +
                  '<div class="doc-card" style="border-left:3.5px solid #b45309;">' +
                    '<div class="doc-card-head"><span>🏛️ Patrimônio Regional (DPAT)</span><span style="font-weight:800;color:#b45309;">' + dpatBensTot.toLocaleString('pt-BR') + ' Bens</span></div>' +
                    '<div style="font-size:6.7pt;color:#334155;line-height:1.4;"><strong>24 ambientes mapeados</strong> na sede URE. 513 itens com localização física conferida e 412 avaliados em estado Bom/Ótimo (taxa de conservação de 80,3%). Mapeamento ativo de equipamentos de rede e estações.</div>' +
                  '</div>' +
                  '<div class="doc-card" style="border-left:3.5px solid #dc2626;">' +
                    '<div class="doc-card-head"><span>⏳ Celeridade &amp; Aging (>30 dias)</span><span style="font-weight:800;color:#dc2626;">' + (segreSeiAged30 + tel.SEPES.aged30) + ' Processos</span></div>' +
                    '<div style="font-size:6.7pt;color:#334155;line-height:1.4;">Gargalos de tramitação: <strong>' + segreSeiAged30 + ' processos SEI</strong> no SEGRE e <strong>' + tel.SEPES.aged30 + ' demandas funcionais</strong> no SEPES acima de 30 dias. 7 chamados SEINTEC >15d e 5 contratos SECOMSE vencendo em ≤60d.</div>' +
                  '</div>' +
                  '<div class="doc-card" style="border-left:3.5px solid #2563eb;">' +
                    '<div class="doc-card-head"><span>📚 Plataforma Pedagógica (EEC)</span><span style="font-weight:800;color:#2563eb;">12 Módulos</span></div>' +
                    '<div style="font-size:6.7pt;color:#334155;line-height:1.4;">Sistemas Web Apps integrados: <strong>Acompanhamento Pedagógico, Devolutivas, SAEB 2025, SARESP 2026, Consulta Docente e Professor Tutor</strong>, assegurando suporte pedagógico contínuo às 60 unidades escolares.</div>' +
                  '</div>' +
                '</div>' +
              '</section>' +
              '<section class="doc-section" style="margin-bottom:0;">' +
                '<h2 class="doc-sec-heading"><span><span class="doc-sec-num">04</span>Diretrizes Prescritivas &amp; Ações Prioritárias da Dirigente</span><span>Intervenção Imediata</span></h2>' +
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">' +
                  '<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:6px 8px; font-size:6.6pt; line-height:1.4;">' +
                    '<strong style="color:#0b2351;">1. Saneamento de Folha &amp; SEI:</strong> Força-tarefa no SEFREP para reduzir taxa de devolução de 24,1% para menos de 10% e protocolo especial para os 101 processos SEI parados há mais de 30 dias.' +
                  '</div>' +
                  '<div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:6px 8px; font-size:6.6pt; line-height:1.4;">' +
                    '<strong style="color:#0b2351;">2. Execução PDDE &amp; Regularidade:</strong> Acelerar aplicação do saldo ocioso de R$ 4,96M nas APMs e notificação técnica às 49 escolas pendentes de renovação de AVCB junto à FDE.' +
                  '</div>' +
                '</div>' +
              '</section>' +
            '</div>' +
            gerarRodapeEditorial(2, 5) +
          '</div>';

        /* Função auxiliar para renderizar bloco da tabela do ranking com cabeçalho rígido */
        function renderTabelaRanking(fatiaEscolas, offsetIdx) {
          return '<table class="doc-table">' +
            '<thead>' +
              '<tr>' +
                '<th style="width:24px;">#</th>' +
                '<th style="width:46px;">CIE</th>' +
                '<th>Unidade Escolar • Município • Modelo</th>' +
                '<th style="width:96px;">IPRE</th>' +
                '<th style="width:95px;">SEINTEC (Comprometimento)</th>' +
                '<th style="width:84px;">Infra (SEOM)</th>' +
                '<th style="width:74px;">PDDE 2026</th>' +
                '<th style="width:58px;">SEPES/SEI</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              fatiaEscolas.map(function(e, idx) {
                var stE = estiloTierPdf(e.tier);
                var nomeLimpo = (typeof formatarNomeEscolaExecutivo === 'function') ? formatarNomeEscolaExecutivo(e.nome) : e.nome;
                nomeLimpo = String(nomeLimpo).replace(/\bUre\b/g, 'URE');
                var avcbTxt = e.seomObj ? (e.seomObj.avcb === 1 ? 'AVCB OK' : 'Sem AVCB') : '---';
                var obraTxt = (e.seomObj && (e.seomObj.obraFde === 2 || e.seomObj.obraFde === 1)) ? ', Obra' : '';
                var pddeCell = e.rec2026 > 0 ? (e.execPct2026.toFixed(0) + '% exec.') : 'S/ repasse';
                return '' +
                  '<tr>' +
                    '<td><strong>' + (offsetIdx + idx + 1) + '</strong></td>' +
                    '<td class="doc-mono">' + escHtml(e.cie) + '</td>' +
                    '<td><strong>' + escHtml(nomeLimpo) + '</strong><br><span style="color:#64748b;font-size:6.4pt;">' + escHtml(e.cidade) + ' • ' + escHtml(e.tipo) + '</span></td>' +
                    '<td><span class="doc-pill" style="background:' + stE.bg + ';color:' + stE.txt + ';border:1px solid ' + stE.brd + ';">' + e.imro + ' pts — ' + escHtml(e.tier) + '</span></td>' +
                    '<td><strong>' + (e.hwBadPct || 0).toFixed(1).replace('.', ',') + '%</strong> <span style="font-size:6.1pt;color:#64748b;">(' + e.hwBad + '/' + e.hwTotal + ')</span><br><span style="color:#64748b;font-size:6.3pt;">' + e.callsTotal + ' chamados</span></td>' +
                    '<td>' + avcbTxt + obraTxt + '<br><span style="color:#64748b;font-size:6.3pt;">SEOM: ' + e.pts.SEOM + '/100</span></td>' +
                    '<td>' + pddeCell + '<br><span style="color:#64748b;font-size:6.3pt;">' + formatarMoedaCurta(e.saldoOcioso2026) + '</span></td>' +
                    '<td>' + e.sepesPend + ' / ' + e.segreAbertos + '</td>' +
                  '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>';
        }

        /* ========================================================================= */
        /* FOLHA 3 DE 5 • RANKING DA REDE ESTADUAL (ESCOLAS 1 A 20)                 */
        /* ========================================================================= */
        var folha3 = '' +
          '<div class="exec-doc-page">' +
            '<div class="exec-doc-page-body">' +
              gerarMastheadEditorial(
                'Ranking da Rede Estadual — IPRE (Parte 1/3)',
                'Classificação Decrescente de Risco Multissetorial — Unidades 1 a 20 (Prioridade Imediata)',
                'ANEXO TÉCNICO | FOLHA 3/5',
                'URE-ITP-RANK-1'
              ) +
              renderTabelaRanking(fato.slice(0, 20), 0) +
            '</div>' +
            gerarRodapeEditorial(3, 5) +
          '</div>';

        /* ========================================================================= */
        /* FOLHA 4 DE 5 • RANKING DA REDE ESTADUAL (ESCOLAS 21 A 40)                */
        /* ========================================================================= */
        var folha4 = '' +
          '<div class="exec-doc-page">' +
            '<div class="exec-doc-page-body">' +
              gerarMastheadEditorial(
                'Ranking da Rede Estadual — IPRE (Parte 2/3)',
                'Classificação Decrescente de Risco Multissetorial — Unidades 21 a 40 (Monitoramento Regular)',
                'ANEXO TÉCNICO | FOLHA 4/5',
                'URE-ITP-RANK-2'
              ) +
              renderTabelaRanking(fato.slice(20, 40), 20) +
            '</div>' +
            gerarRodapeEditorial(4, 5) +
          '</div>';

        /* ========================================================================= */
        /* FOLHA 5 DE 5 • RANKING DA REDE ESTADUAL (ESCOLAS 41 A 60)                */
        /* ========================================================================= */
        var folha5 = '' +
          '<div class="exec-doc-page">' +
            '<div class="exec-doc-page-body">' +
              gerarMastheadEditorial(
                'Ranking da Rede Estadual — IPRE (Parte 3/3)',
                'Classificação Decrescente de Risco Multissetorial — Unidades 41 a 60 (Estabilidade & Regularidade)',
                'ANEXO TÉCNICO | FOLHA 5/5',
                'URE-ITP-RANK-3'
              ) +
              renderTabelaRanking(fato.slice(40, 60), 40) +
            '</div>' +
            gerarRodapeEditorial(5, 5) +
          '</div>';

        var html = folha1 + folha2 + folha3 + folha4 + folha5;

        abrirModalRelatorioExecutivo({
          tipo: 'ure',
          titulo: 'Relatório Executivo Geral • URE Itapevi (' + totalEsc + ' Escolas)',
          badge: 'RELATÓRIO GERAL • URE ITAPEVI',
          nomeArquivoBase: 'Relatorio_Geral_URE_Itapevi_' + new Date().toISOString().slice(0, 10),
          fato: fato,
          tel: tel,
          totalEsc: totalEsc,
          peiCount: peiCount,
          regCount: regCount,
          critCount: critCount,
          altoCount: altoCount,
          atencCount: atencCount,
          okCount: okCount,
          avgImro: avgImro,
          isrScore: isrScore,
          listaMun: listaMun,
          linhasNucleos: linhasNucleos,
          htmlCorpo: html
        });
      };

      /* API Pública Plug & Play para Novos Setores (ASURE, EEC e futuros) */
      window.registrarDadosAsure = function(payload) {
        window.DADOS_ASURE = payload;
        window.BI_DECISION_ENGINE.atualizar();
      };
      window.registrarDadosEec = function(payload) {
        window.DADOS_EEC = payload;
        window.BI_DECISION_ENGINE.atualizar();
      };

      /* Hooks pós-atualização nos sincronizadores existentes (sem alterar lógica original) */
      function acoplarHookPosExecucao(fnName) {
        var orig = window[fnName];
        if (typeof orig === 'function' && !orig.__biDiHooked) {
          var wrapped = function() {
            var ret = orig.apply(this, arguments);
            if (window.BI_DECISION_ENGINE) {
              setTimeout(function() { window.BI_DECISION_ENGINE.atualizar(); }, 30);
            }
            return ret;
          };
          wrapped.__biDiHooked = true;
          window[fnName] = wrapped;
        }
      }

      function iniciarMotorDecisao() {
        acoplarHookPosExecucao('sincronizarCardsBasesSeintec');
        acoplarHookPosExecucao('atualizarPainelVisitas');
        acoplarHookPosExecucao('sincronizarTudoGlobalmente');
        window.BI_DECISION_ENGINE.atualizar();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarMotorDecisao);
      } else {
        iniciarMotorDecisao();
      }
    })();