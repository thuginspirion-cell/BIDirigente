    /* GS RESILIENCE GUARD */
    /* ========================================================
       ROUTER RESILIENTE & EARLY GLOBAL STUBS PARA TODOS OS MENUS
       Garante que nenhum clique de menu falhe no GS mesmo antes
       do carregamento de scripts subsequentes ou bases massivas.
       ======================================================== */
    /* ========================================================
       POLÍTICA NUVEM EXCLUSIVA (ZERO localStorage / ZERO COOKIES)
       Limpa imediatamente qualquer resíduo local pré-existente e
       comunica exclusivamente com a nuvem (GAS / SharePoint / GitHub).
       ======================================================== */
    function limparTodoArmazenamentoLocal() {
      var prefixos = ['BI_DIRIGENTE_', 'SEINTEC_', 'dados_', 'ure_itapevi_', 'AGENDA', 'CARRO', 'sidebar'];
      try {
        if (typeof localStorage !== 'undefined') {
          var chavesLocais = [];
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && prefixos.some(function(p) { return k.indexOf(p) === 0; })) {
              chavesLocais.push(k);
            }
          }
          chavesLocais.forEach(function(k) { localStorage.removeItem(k); });
        }
      } catch(e1) {}
      try {
        if (typeof sessionStorage !== 'undefined') {
          var chavesSessao = [];
          for (var j = 0; j < sessionStorage.length; j++) {
            var ks = sessionStorage.key(j);
            if (ks && prefixos.some(function(p) { return ks.indexOf(p) === 0; })) {
              chavesSessao.push(ks);
            }
          }
          chavesSessao.forEach(function(k) { sessionStorage.removeItem(k); });
        }
      } catch(e2) {}
    }
    window.limparTodoArmazenamentoLocal = limparTodoArmazenamentoLocal;
    limparTodoArmazenamentoLocal();

    window.__gasCloudUrl = function() {
      return 'https:' + String.fromCharCode(47, 47) + 'script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec';
    };

    /* Fila de concorrência controlada para RPCs google.script.run (evita abort status:0 no GS/GAS) */
    (function() {
      var filaGas = [];
      var ativosGas = 0;
      var MAX_CONCORRENTE_GAS = 3;

      function processarFilaGas() {
        while (ativosGas < MAX_CONCORRENTE_GAS && filaGas.length > 0) {
          var item = filaGas.shift();
          executarItemGas(item);
        }
      }

      function executarItemGas(item) {
        if (typeof google === 'undefined' || !google.script || !google.script.run || typeof google.script.run[item.fnName] !== 'function') {
          item.reject(new Error('google.script.run indisponivel: ' + item.fnName));
          return;
        }
        ativosGas++;
        var encerrado = false;
        var timer = setTimeout(function() {
          if (encerrado) return;
          encerrado = true;
          ativosGas = Math.max(0, ativosGas - 1);
          processarFilaGas();
          item.reject(new Error('Timeout RPC GAS: ' + item.fnName));
        }, item.timeoutMs || 15000);

        try {
          var runner = google.script.run
            .withSuccessHandler(function(res) {
              if (encerrado) return;
              encerrado = true;
              clearTimeout(timer);
              ativosGas = Math.max(0, ativosGas - 1);
              processarFilaGas();
              item.resolve(res);
            })
            .withFailureHandler(function(err) {
              if (encerrado) return;
              encerrado = true;
              clearTimeout(timer);
              ativosGas = Math.max(0, ativosGas - 1);
              processarFilaGas();
              item.reject(err || new Error('Falha RPC GAS: ' + item.fnName));
            });
          runner[item.fnName].apply(runner, item.args || []);
        } catch (errTry) {
          if (!encerrado) {
            encerrado = true;
            clearTimeout(timer);
            ativosGas = Math.max(0, ativosGas - 1);
            processarFilaGas();
            item.reject(errTry);
          }
        }
      }

      window.__runGasQueued = function(fnName, args, timeoutMs) {
        return new Promise(function(resolve, reject) {
          filaGas.push({
            fnName: fnName,
            args: Array.isArray(args) ? args : [],
            timeoutMs: timeoutMs || 15000,
            resolve: resolve,
            reject: reject
          });
          processarFilaGas();
        });
      };
    })();

    window.__gasBootstrapPromise = null;
    window.__iniciarBootstrapGas = function(forcarNovo) {
      if (typeof google === 'undefined' || !google.script || !google.script.run || typeof google.script.run.obterBootstrapCompletoGas !== 'function') {
        return Promise.resolve(null);
      }
      if (!forcarNovo && window.__gasBootstrapPromise) {
        return window.__gasBootstrapPromise;
      }
      window.__gasBootstrapPromise = new Promise(function(resolve) {
        var finalizado = false;
        var timerBoot = setTimeout(function() {
          if (finalizado) return;
          finalizado = true;
          resolve(null);
        }, 10000);

        try {
          google.script.run
            .withSuccessHandler(function(res) {
              if (finalizado) return;
              finalizado = true;
              clearTimeout(timerBoot);
              if (res && res.sucesso) {
                window.__gasBootstrapData = res;
                resolve(res);
              } else {
                resolve(null);
              }
            })
            .withFailureHandler(function() {
              if (finalizado) return;
              finalizado = true;
              clearTimeout(timerBoot);
              resolve(null);
            })
            .obterBootstrapCompletoGas();
        } catch (eBoot) {
          if (!finalizado) {
            finalizado = true;
            clearTimeout(timerBoot);
            resolve(null);
          }
        }
      });
      return window.__gasBootstrapPromise;
    };

    window.lerEstadoNuvem = function(chave, onResult) {
      var chaveLimpa = String(chave || '').replace(/[^A-Za-z0-9_]/g, '').toUpperCase();
      if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.obterEstadoNuvem === 'function') {
        window.__iniciarBootstrapGas().then(function(boot) {
          if (boot && boot.estados && typeof boot.estados === 'object') {
            if (typeof onResult === 'function') onResult(boot.estados[chaveLimpa] !== undefined ? boot.estados[chaveLimpa] : null);
            return;
          }
          window.__runGasQueued('obterEstadoNuvem', [chave], 12000)
            .then(function(res) { if (typeof onResult === 'function') onResult(res && res.sucesso ? res.dados : null); })
            .catch(function() { if (typeof onResult === 'function') onResult(null); });
        });
        return;
      }
      var cbName = '__cb_cloud_get_' + chave + '_' + Math.floor(Math.random() * 10000000);
      var timer = setTimeout(function() {
        if (window[cbName]) {
          delete window[cbName];
          var el = document.getElementById(cbName);
          if (el && el.parentNode) el.parentNode.removeChild(el);
          if (typeof onResult === 'function') onResult(null);
        }
      }, 15000);
      window[cbName] = function(res) {
        clearTimeout(timer);
        delete window[cbName];
        var el = document.getElementById(cbName);
        if (el && el.parentNode) el.parentNode.removeChild(el);
        if (typeof onResult === 'function') onResult(res && res.sucesso ? res.dados : null);
      };
      var sc = document.createElement('script');
      sc.id = cbName;
      sc.src = window.__gasCloudUrl() + '?action=obterEstadoNuvem&chave=' + encodeURIComponent(chave) + '&callback=' + cbName + '&_t=' + Date.now();
      sc.onerror = function() {
        clearTimeout(timer);
        delete window[cbName];
        if (sc.parentNode) sc.parentNode.removeChild(sc);
        if (typeof onResult === 'function') onResult(null);
      };
      (document.head || document.documentElement).appendChild(sc);
    };

    window.gravarEstadoNuvem = function(chave, dados) {
      var jsonStr = (typeof dados === 'string') ? dados : JSON.stringify(dados);
      if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.salvarEstadoNuvem === 'function') {
        google.script.run
          .withFailureHandler(function(err) { console.warn('Aviso ao gravar estado em nuvem (' + chave + '):', err); })
          .salvarEstadoNuvem(chave, jsonStr);
        return;
      }
      try {
        fetch(window.__gasCloudUrl(), {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ action: 'salvarEstadoNuvem', chave: chave, dados: jsonStr })
        }).catch(function(e) { console.warn('Aviso POST nuvem (' + chave + '):', e); });
      } catch(e) {}
    };

    window.__navQueue = [];

    function executarOuEnfileirar(fnName, args) {
      if (typeof window[fnName] === "function" && window[fnName].__isReal) {
        return window[fnName].apply(null, args);
      }
      console.log("Enfileirando navegação para:", fnName, args);
      window.__navQueue.push({ fnName: fnName, args: args });
    }

        if (!window.abrirMinhaGestao) {
      window.abrirMinhaGestao = function() { executarOuEnfileirar("abrirMinhaGestao", arguments); };
    }
    if (!window.abrirAgenda) {
      window.abrirAgenda = function() { executarOuEnfileirar("abrirAgenda", arguments); };
    }
    if (!window.abrirCarroOficial) {
      window.abrirCarroOficial = function() { executarOuEnfileirar("abrirCarroOficial", arguments); };
    }
if (!window.mostrarHome) {
      window.mostrarHome = function() { executarOuEnfileirar("mostrarHome", arguments); };
    }
    if (!window.abrirVisitas) {
      window.abrirVisitas = function() { executarOuEnfileirar("abrirVisitas", arguments); };
    }
    if (!window.abrirEscolas) {
      window.abrirEscolas = function() { executarOuEnfileirar("abrirEscolas", arguments); };
    }
    if (!window.abrirCentro) {
      window.abrirCentro = function() { executarOuEnfileirar("abrirCentro", arguments); };
    }
    if (!window.abrirSeintec) {
      window.abrirSeintec = function() { executarOuEnfileirar("abrirSeintec", arguments); };
    }
    if (!window.abrirAssessoriaTecnica) {
      window.abrirAssessoriaTecnica = function() { executarOuEnfileirar("abrirAssessoriaTecnica", arguments); };
    }
    if (!window.abrirModalMapaVisitas) {
      window.abrirModalMapaVisitas = function() { executarOuEnfileirar("abrirModalMapaVisitas", arguments); };
    }

    window.addEventListener("error", function(e) {
      console.warn("Intercepção preventiva no ambiente GS/GAS:", e.message || e);
    });
    window.addEventListener("unhandledrejection", function(e) {
      console.warn("Promise rejeitada tratada preventivamente:", e.reason);
    });

    /* EARLY HOISTED MOTOR UNIVERSAL DE ORDENACAO (GHP & GS RESILIENTE) */
    window.extrairValorCelulaDom = function(td) {
      if (!td) return '';
      if (td.hasAttribute('data-sort')) return td.getAttribute('data-sort').trim();
      return (td.textContent || td.innerText || '').trim();
    };

    window.parseValorParaOrdenacao = function(val) {
      if (!val) return { tipo: 'str', val: '' };
      var str = String(val).trim();
      if (/^\d{11,13}$/.test(str)) return { tipo: 'date', val: parseInt(str, 10) };
      var brMatch = str.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
      if (brMatch) {
        var hora = 0, min = 0;
        var hm = str.match(/(\d{1,2}):(\d{2})/);
        if (hm) { hora = parseInt(hm[1], 10); min = parseInt(hm[2], 10); }
        var dBr = new Date(parseInt(brMatch[3], 10), parseInt(brMatch[2], 10) - 1, parseInt(brMatch[1], 10), hora, min);
        if (!isNaN(dBr.getTime())) return { tipo: 'date', val: dBr.getTime() };
      }
      var isoMatch = str.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
      if (isoMatch) {
        var horaIso = 0, minIso = 0;
        var hmIso = str.match(/(\d{1,2}):(\d{2})/);
        if (hmIso) { horaIso = parseInt(hmIso[1], 10); minIso = parseInt(hmIso[2], 10); }
        var dIso = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10), horaIso, minIso);
        if (!isNaN(dIso.getTime())) return { tipo: 'date', val: dIso.getTime() };
      }
      var limpo = str.replace(/[R$\s%kmKM]/g, '').replace(/\./g, '').replace(',', '.');
      if (limpo !== '' && !isNaN(Number(limpo)) && !isNaN(parseFloat(limpo)) && /^-?\d+(\.\d+)?$/.test(limpo)) {
        return { tipo: 'num', val: Number(limpo) };
      }
      return { tipo: 'str', val: str.toLowerCase() };
    };

    window.ordenarTabelaDom = function(tableId, colIndex, forceOrder) {
      var table = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
      if (!table) return;
      var thead = table.querySelector('thead');
      var tbody = table.querySelector('tbody');
      if (!tbody) return;
      var rows = Array.from(tbody.querySelectorAll('tr'));
      if (rows.length <= 1) return;

      var ths = thead ? thead.querySelectorAll('th') : [];
      var targetTh = ths[colIndex];
      var isDateCol = false;
      var thText = targetTh ? (targetTh.innerText || targetTh.textContent || '').toLowerCase().trim() : '';
      if (thText.includes('data') || thText.includes('abertura') || thText.includes('horario') || thText.includes('horário') || thText.includes('registro') || thText.includes('periodo') || thText.includes('período') || thText.includes('visita') || thText.includes('deslocamento') || thText.includes('prazo')) {
        isDateCol = true;
      } else {
        var sampleCell = rows[0] && rows[0].children ? rows[0].children[colIndex] : null;
        if (sampleCell) {
          var sampleParsed = window.parseValorParaOrdenacao(window.extrairValorCelulaDom(sampleCell));
          if (sampleParsed.tipo === 'date') isDateCol = true;
        }
      }

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

      ths.forEach(function(th) {
        th.classList.remove('sort-active-asc', 'sort-active-desc');
        var arrow = th.querySelector('.sort-arrow') || th.querySelector('.sort-icon-indicator') || th.querySelector('.sort-icon');
        if (arrow) arrow.textContent = '↕';
      });
      if (targetTh) {
        targetTh.classList.add(currentOrder === 'asc' ? 'sort-active-asc' : 'sort-active-desc');
        var arrowTarget = targetTh.querySelector('.sort-arrow') || targetTh.querySelector('.sort-icon-indicator') || targetTh.querySelector('.sort-icon');
        if (arrowTarget) arrowTarget.textContent = currentOrder === 'asc' ? '▲' : '▼';
      }

      rows.sort(function(rowA, rowB) {
        var cellA = rowA.children ? rowA.children[colIndex] : null;
        var cellB = rowB.children ? rowB.children[colIndex] : null;
        var valA = window.parseValorParaOrdenacao(window.extrairValorCelulaDom(cellA));
        var valB = window.parseValorParaOrdenacao(window.extrairValorCelulaDom(cellB));
        var res = 0;
        if (valA.tipo === 'date' && valB.tipo === 'date') {
          res = valA.val - valB.val;
          if (res === 0) {
            var mA = (rowA.textContent || '').match(/(?:CALL-|CT-|PROTOCOLO-|#)?(\d{3,7})/i);
            var mB = (rowB.textContent || '').match(/(?:CALL-|CT-|PROTOCOLO-|#)?(\d{3,7})/i);
            if (mA && mB) res = parseInt(mA[1], 10) - parseInt(mB[1], 10);
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

      var fragment = document.createDocumentFragment();
      for (var r = 0; r < rows.length; r++) { fragment.appendChild(rows[r]); }
      tbody.appendChild(fragment);
    };

    /* ============================================================== */
    /* 16. SISTEMA INTEGRADO: MINHA GESTÃO & AGENDA DA DIRIGENTE */
    /* ============================================================== */

    const HORARIOS_EXPEDIENTE = [
      { inicio: "07:00", fim: "08:00" },
      { inicio: "08:00", fim: "09:00" },
      { inicio: "09:00", fim: "10:00" },
      { inicio: "10:00", fim: "11:00" },
      { inicio: "11:00", fim: "12:00" },
      { inicio: "12:00", fim: "13:00" },
      { inicio: "13:00", fim: "14:00" },
      { inicio: "14:00", fim: "15:00" },
      { inicio: "15:00", fim: "16:00" },
      { inicio: "16:00", fim: "17:00" }
    ];

    function obterDataHojeIso() {
      const agora = new Date();
      const ano = agora.getFullYear();
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const dia = String(agora.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    }

    let dataAtivaGestaoHoje = obterDataHojeIso();
    let dataAtivaAgenda = obterDataHojeIso();
    let filtroPeriodoAgenda = 'todos';
    let mesAtivoCalendario = new Date();
    let subTabAtivaAgenda = 'calendario';
    let filtroCategoriaCalAgenda = 'TODOS';

    /* Base de Dados Centralizada dos Compromissos (Persistida em localStorage + Sincronização) */
    
    /* === DICIONÁRIO OFICIAL DE ESCOLAS EXTRAÍDO DOS NOMES DOS ARQUIVOS DE INVENTÁRIO (InventarioRC - V2) === */
    const DICIONARIO_OFICIAL_INVENTARIO = {
  "010703": {
    "cie": "010703",
    "cieOriginal": "010703",
    "nomeOficialBruto": "URE",
    "nomeOficial": "URE",
    "nomeFormatado": "URE",
    "arquivo": "URE"
  },
  "10703": {
    "cie": "010703",
    "cieOriginal": "010703",
    "nomeOficialBruto": "URE",
    "nomeOficial": "URE",
    "nomeFormatado": "URE",
    "arquivo": "URE"
  },
  "11778": {
    "cie": "011778",
    "cieOriginal": "11778",
    "nomeOficialBruto": "SENOR ABRAVANEL",
    "nomeOficial": "Senor Abravanel",
    "arquivo": "11778 - SENOR ABRAVANEL - INVENTÁRIO.xlsx"
  },
  "011778": {
    "cie": "011778",
    "cieOriginal": "11778",
    "nomeOficialBruto": "SENOR ABRAVANEL",
    "nomeOficial": "Senor Abravanel",
    "nomeFormatado": "Senor Abravanel",
    "arquivo": "11778 - SENOR ABRAVANEL - INVENTÁRIO.xlsx"
  },
  "011779": {
    "cie": "011779",
    "cieOriginal": "11779",
    "nomeOficialBruto": "EDINER FERREIRA DE MORAES PROFESSORA",
    "nomeOficial": "Ediner Ferreira de Moraes, Professora",
    "nomeFormatado": "Ediner Ferreira de Moraes Professora",
    "arquivo": "11779 - EDINER FERREIRA DE MORAES PROFESSORA - INVENTÁRIO.xlsx"
  },
  "011780": {
    "cie": "011780",
    "cieOriginal": "11780",
    "nomeOficialBruto": "MICHELA TREVIZAN PROFESSORA",
    "nomeOficial": "Michela Trevizan, Professora",
    "nomeFormatado": "Michela Trevizan Professora",
    "arquivo": "11780 - EE MICHELA TREVISAN PROFESSORA - INVENTÁRIO.xlsx"
  },
  "11779": {
    "cie": "011779",
    "cieOriginal": "11779",
    "nomeOficialBruto": "EDINER FERREIRA DE MORAES PROFESSORA",
    "nomeOficial": "Ediner Ferreira de Moraes, Professora",
    "arquivo": "11779 - EDINER FERREIRA DE MORAES PROFESSORA - INVENTÁRIO.xlsx"
  },
  "011779": {
    "cie": "011779",
    "cieOriginal": "11779",
    "nomeOficialBruto": "EDINER FERREIRA DE MORAES PROFESSORA",
    "nomeOficial": "Ediner Ferreira de Moraes, Professora",
    "arquivo": "11779 - EDINER FERREIRA DE MORAES PROFESSORA - INVENTÁRIO.xlsx"
  },
  "11780": {
    "cie": "011780",
    "cieOriginal": "11780",
    "nomeOficialBruto": "MICHELA TREVIZAN PROFESSORA",
    "nomeOficial": "Michela Trevizan, Professora",
    "arquivo": "11780 - EE MICHELA TREVISAN PROFESSORA - INVENTÁRIO.xlsx"
  },
  "011780": {
    "cie": "011780",
    "cieOriginal": "11780",
    "nomeOficialBruto": "MICHELA TREVIZAN PROFESSORA",
    "nomeOficial": "Michela Trevizan, Professora",
    "arquivo": "11780 - EE MICHELA TREVISAN PROFESSORA - INVENTÁRIO.xlsx"
  },
  "9787": {
    "cie": "009787",
    "cieOriginal": "9787",
    "nomeOficialBruto": "IVANI MARIA PAES PROFESSORA",
    "nomeOficial": "Ivani Maria Paes, Professora",
    "arquivo": "9787 - IVANI MARIA PAES PROFESSORA - INVENTÁRIO.xlsx"
  },
  "9799": {
    "cie": "009799",
    "cieOriginal": "9799",
    "nomeOficialBruto": "CAIO PRADO JUNIOR DEPUTADO",
    "nomeOficial": "Caio Prado Junior, Deputado",
    "arquivo": "9799 - CAIO PRADO JUNIOR DEPUTADO - INVENTÁRIO.xlsx"
  },
  "9830": {
    "cie": "009830",
    "cieOriginal": "9830",
    "nomeOficialBruto": "REPUBLICA DO EQUADOR",
    "nomeOficial": "Republica do Equador",
    "arquivo": "9830 - REPUBLICA DO EQUADOR - INVENTÁRIO.xlsx"
  },
  "9878": {
    "cie": "009878",
    "cieOriginal": "9878",
    "nomeOficialBruto": "ALAYDE DOMINGUES COUTO MACEDO PROFESSORA",
    "nomeOficial": "Alayde Domingues Couto Macedo, Professora",
    "arquivo": "9878 - ALAYDE DOMINGUES COUTO MACEDO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "9891": {
    "cie": "009891",
    "cieOriginal": "9891",
    "nomeOficialBruto": "JOSE WILSON PADINHA PROFESSOR",
    "nomeOficial": "Jose Wilson Padinha, Professor",
    "arquivo": "9891 - JOSE WILSON PADINHA PROFESSOR - INVENTÁRIO.xlsx"
  },
  "9912": {
    "cie": "009912",
    "cieOriginal": "9912",
    "nomeOficialBruto": "ALDEIA DE BARUERI",
    "nomeOficial": "Aldeia de Barueri",
    "arquivo": "9912 - ALDEIA DE BARUERI - INVENTÁRIO.xlsx"
  },
  "9921": {
    "cie": "009921",
    "cieOriginal": "9921",
    "nomeOficialBruto": "JOSE DOMINGOS DA SILVEIRA PROFESSOR",
    "nomeOficial": "Jose Domingos da Silveira, Professor",
    "arquivo": "9921 - JOSE DOMINGOS DA SILVEIRA PROFESSOR - INVENTÁRIO.xlsx"
  },
  "10364": {
    "cie": "010364",
    "cieOriginal": "10364",
    "nomeOficialBruto": "DORVALINO ABILIO TEIXEIRA",
    "nomeOficial": "Dorvalino Abilio Teixeira",
    "arquivo": "10364 - DORVALINO ABILIO TEIXEIRA - INVENTÁRIO.xlsx"
  },
  "10376": {
    "cie": "010376",
    "cieOriginal": "10376",
    "nomeOficialBruto": "MARIA CRISTINA LOPES",
    "nomeOficial": "Maria Cristina Lopes",
    "arquivo": "10376 - MARIA CRISTINA LOPES - INVENTÁRIO.xlsx"
  },
  "10388": {
    "cie": "010388",
    "cieOriginal": "10388",
    "nomeOficialBruto": "JOSE CHALUPPE",
    "nomeOficial": "Jose Chaluppe",
    "arquivo": "10388 - JOSE CHALUPPE - INVENTÁRIO.xlsx"
  },
  "10397": {
    "cie": "010397",
    "cieOriginal": "10397",
    "nomeOficialBruto": "VICENTE THEMUDO LESSA PROFESSOR",
    "nomeOficial": "Vicente Themudo Lessa, Professor",
    "arquivo": "10397 - VICENTE THEMUDO LESSA PROFESSOR - INVENTÁRIO.xlsx"
  },
  "10424": {
    "cie": "010424",
    "cieOriginal": "10424",
    "nomeOficialBruto": "CELINA DE BARROS BAIRAO PROFESSORA",
    "nomeOficial": "Celina de Barros Bairao, Professora",
    "arquivo": "10424 - CELINA DE BARROS BAIRAO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "10431": {
    "cie": "010431",
    "cieOriginal": "10431",
    "nomeOficialBruto": "AMERICO VALENTIN CHRISTIANINI",
    "nomeOficial": "Americo Valentin Christianini",
    "arquivo": "10431 - AMERICO VALENTIN CHRISTIANINI - INVENTÁRIO.xlsx"
  },
  "10443": {
    "cie": "010443",
    "cieOriginal": "10443",
    "nomeOficialBruto": "NACIF AMIN CHALUPE",
    "nomeOficial": "Nacif Amin Chalupe",
    "arquivo": "10443 - NACIF AMIN CHALUPE - INVENTÁRIO.xlsx"
  },
  "10467": {
    "cie": "010467",
    "cieOriginal": "10467",
    "nomeOficialBruto": "RAUL BRIQUET DOUTOR",
    "nomeOficial": "Raul Briquet, Doutor",
    "arquivo": "10467 - RAUL BRIQUET DOUTOR - INVENTÁRIO.xlsx"
  },
  "10479": {
    "cie": "010479",
    "cieOriginal": "10479",
    "nomeOficialBruto": "CLARO CAMARGO RIBEIRO",
    "nomeOficial": "Claro Camargo Ribeiro",
    "arquivo": "10479 - CLARO CAMARGO RIBEIRO - INVENTÁRIO.xlsx"
  },
  "10480": {
    "cie": "010480",
    "cieOriginal": "10480",
    "nomeOficialBruto": "DIMARAES ANTONIO SANDEI PROFESSOR",
    "nomeOficial": "Dimaraes Antonio Sandei, Professor",
    "arquivo": "10480 - DIMARAES ANTONIO SANDEI PROFESSOR - INVENTÁRIO.xlsx"
  },
  "10613": {
    "cie": "010613",
    "cieOriginal": "10613",
    "nomeOficialBruto": "CANDIDO RONDON MARECHAL",
    "nomeOficial": "Candido Rondon, Marechal",
    "arquivo": "10613 - CANDIDO RONDON MARECHAL - INVENTÁRIO.xlsx"
  },
  "10649": {
    "cie": "010649",
    "cieOriginal": "10649",
    "nomeOficialBruto": "HENRIQUE SAMMARTINO ALFERES",
    "nomeOficial": "Henrique Sammartino, Alferes",
    "arquivo": "10649 - HENRIQUE SAMMARTINO ALFERES - INVENTÁRIO.xlsx"
  },
  "10650": {
    "cie": "010650",
    "cieOriginal": "10650",
    "nomeOficialBruto": "JOSE NEYDE CESAR LESSA DOUTOR",
    "nomeOficial": "Jose Neyde Cesar Lessa, Doutor",
    "arquivo": "10650 - JOSE NEYDE CESAR LESSA DOUTOR - INVENTÁRIO.xlsx"
  },
  "10662": {
    "cie": "010662",
    "cieOriginal": "10662",
    "nomeOficialBruto": "OSWALDO SAMMARTINO",
    "nomeOficial": "Oswaldo Sammartino",
    "arquivo": "10662 - OSWALDO SAMMARTINO - INVENTÁRIO.xlsx"
  },
  "35440": {
    "cie": "035440",
    "cieOriginal": "35440",
    "nomeOficialBruto": "REPUBLICA DE CUBA",
    "nomeOficial": "Republica de Cuba",
    "arquivo": "35440 - REPUBLICA DE CUBA - INVENTÁRIO.xlsx"
  },
  "40548": {
    "cie": "040548",
    "cieOriginal": "40548",
    "nomeOficialBruto": "NESTOR DE CAMARGO PREFEITO",
    "nomeOficial": "Nestor de Camargo, Prefeito",
    "arquivo": "40548 - NESTOR DE CAMARGO PREFEITO - INVENTÁRIO.xlsx"
  },
  "40551": {
    "cie": "040551",
    "cieOriginal": "40551",
    "nomeOficialBruto": "LENIO VIEIRA DE MORAES PROFESSOR",
    "nomeOficial": "Lenio Vieira de Moraes, Professor",
    "arquivo": "40551 - LENIO VIEIRA DE MORAES PROFESSOR - INVENTÁRIO.xlsx"
  },
  "41373": {
    "cie": "041373",
    "cieOriginal": "41373",
    "nomeOficialBruto": "JOAO BATISTA SOLDE",
    "nomeOficial": "Joao Batista Solde",
    "arquivo": "41373 - JOAO BATISTA SOLDE - INVENTÁRIO.xlsx"
  },
  "41385": {
    "cie": "041385",
    "cieOriginal": "41385",
    "nomeOficialBruto": "MOACIR THOMAZ DA SILVA",
    "nomeOficial": "Moacir Thomaz da Silva",
    "arquivo": "41385 - MOACIR THOMAZ DA SILVA - INVENTÁRIO.xlsx"
  },
  "43333": {
    "cie": "043333",
    "cieOriginal": "43333",
    "nomeOficialBruto": "NERCY AMELIA MARTELINI DAHER PROFESSORA",
    "nomeOficial": "Nercy Amelia Martelini Daher, Professora",
    "arquivo": "43333 - NERCY AMELIA MARTELINI DAHER PROFESSORA - INVENTÁRIO.xlsx"
  },
  "43886": {
    "cie": "043886",
    "cieOriginal": "43886",
    "nomeOficialBruto": "JOSE THEOTONIO DOS SANTOS PROFESSOR",
    "nomeOficial": "Jose Theotonio dos Santos, Professor",
    "arquivo": "43886 - JOSE THEOTONIO DOS SANTOS PROFESSOR - INVENTÁRIO.xlsx"
  },
  "44817": {
    "cie": "044817",
    "cieOriginal": "44817",
    "nomeOficialBruto": "LUIS DA CAMARA CASCUDO",
    "nomeOficial": "Luis da Camara Cascudo",
    "arquivo": "44817 - LUIS DA CAMARA CASCUDO - INVENTÁRIO.xlsx"
  },
  "44921": {
    "cie": "044921",
    "cieOriginal": "44921",
    "nomeOficialBruto": "MYRTHES THEREZINHA ASSAD VILLELA PROFA",
    "nomeOficial": "Myrthes Therezinha Assad Villela, Professora",
    "arquivo": "44921 - MYRTHES THEREZINHA ASSAD VILLELA PROFA - INVENTÁRIO.xlsx"
  },
  "44933": {
    "cie": "044933",
    "cieOriginal": "44933",
    "nomeOficialBruto": "MARIO JOAQUIM ESCOBAR DE ANDRADE",
    "nomeOficial": "Mario Joaquim Escobar de Andrade",
    "arquivo": "44933 - MARIO JOAQUIM ESCOBAR DE ANDRADE - INVENTÁRIO.xlsx"
  },
  "46607": {
    "cie": "046607",
    "cieOriginal": "46607",
    "nomeOficialBruto": "JOAO NASCIF CHALUPP",
    "nomeOficial": "Joao Nascif Chalupp",
    "arquivo": "46607 - JOAO NASCIF CHALUPP - INVENTÁRIO.xlsx"
  },
  "48161": {
    "cie": "048161",
    "cieOriginal": "48161",
    "nomeOficialBruto": "IRACEMA RAUEN MACIEL PROFESSORA",
    "nomeOficial": "Iracema Rauen Maciel, Professora",
    "arquivo": "48161 - IRACEMA RAUEN MACIEL PROFESSORA - INVENTÁRIO.xlsx"
  },
  "48173": {
    "cie": "048173",
    "cieOriginal": "48173",
    "nomeOficialBruto": "ELIZA DE OLIVEIRA RIBEIRO",
    "nomeOficial": "Eliza de Oliveira Ribeiro",
    "arquivo": "48173 - ELIZA DE OLIVEIRA RIBEIRO - INVENTÁRIO.xlsx"
  },
  "48975": {
    "cie": "048975",
    "cieOriginal": "48975",
    "nomeOficialBruto": "MARY MALLET CYRINO PROFESSORA",
    "nomeOficial": "Mary Mallet Cyrino, Professora",
    "arquivo": "48975 - MARY MALLET CYRINO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "48999": {
    "cie": "048999",
    "cieOriginal": "48999",
    "nomeOficialBruto": "ROMEO MECCA PADRE",
    "nomeOficial": "Romeo Mecca, Padre",
    "arquivo": "48999 - ROMEO MECCA PADRE - INVENTÁRIO.xlsx"
  },
  "49013": {
    "cie": "049013",
    "cieOriginal": "49013",
    "nomeOficialBruto": "MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR",
    "nomeOficial": "Manoel Augusto Vieira Neto, Desembargador",
    "arquivo": "49013 - MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR - INVENTÁRIO.xlsx"
  },
  "49025": {
    "cie": "049025",
    "cieOriginal": "49025",
    "nomeOficialBruto": "JARDIM MARIA HELENA I",
    "nomeOficial": "Jardim Maria Helena I",
    "arquivo": "49025 - JARDIM MARIA HELENA I - INVENTÁRIO.xlsx"
  },
  "149317": {
    "cie": "149317",
    "cieOriginal": "149317",
    "nomeOficialBruto": "JOSE SERGIO PEREIRA PROFESSOR",
    "nomeOficial": "Jose Sergio Pereira, Professor",
    "arquivo": "149317 - JOSE SERGIO PEREIRA PROFESSOR - INVENTÁRIO.xlsx"
  },
  "290075": {
    "cie": "290075",
    "cieOriginal": "290075",
    "nomeOficialBruto": "HENRIQUE FERNANDO GOMES ESTUDANTE",
    "nomeOficial": "Henrique Fernando Gomes, Estudante",
    "arquivo": "290075 - HENRIQUE FERNANDO GOMES ESTUDANTE - INVENTÁRIO.xlsx"
  },
  "352561": {
    "cie": "352561",
    "cieOriginal": "352561",
    "nomeOficialBruto": "AIR FERREIRA DO NASCIMENTO PROFESSOR",
    "nomeOficial": "Air Ferreira do Nascimento, Professor",
    "arquivo": "352561 - AIR FERREIRA DO NASCIMENTO PROFESSOR - INVENTÁRIO.xlsx"
  },
  "496790": {
    "cie": "496790",
    "cieOriginal": "496790",
    "nomeOficialBruto": "TEREZINHA PALONE DA SILVA DOMINGUES PROFA",
    "nomeOficial": "Terezinha Palone da Silva Domingues, Professora",
    "arquivo": "496790 - TEREZINHA PALONE DA SILVA DOMINGUES PROFA - INVENTÁRIO.xlsx"
  },
  "902044": {
    "cie": "902044",
    "cieOriginal": "902044",
    "nomeOficialBruto": "IGNES AMELIA OLIVEIRA MACHADO PROFESSORA",
    "nomeOficial": "Ignes Amelia Oliveira Machado, Professora",
    "arquivo": "902044 - IGNES AMELIA OLIVEIRA MACHADO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "908548": {
    "cie": "908548",
    "cieOriginal": "908548",
    "nomeOficialBruto": "PAULO DE ABREU",
    "nomeOficial": "Paulo de Abreu",
    "arquivo": "908548 - PAULO DE ABREU - INVENTÁRIO.xlsx"
  },
  "908563": {
    "cie": "908563",
    "cieOriginal": "908563",
    "nomeOficialBruto": "DOLORES GARCIA PASCHOALIN",
    "nomeOficial": "Dolores Garcia Paschoalin",
    "arquivo": "908563 - DOLORES GARCIA PASCHOALIN - INVENTÁRIO.xlsx"
  },
  "908617": {
    "cie": "908617",
    "cieOriginal": "908617",
    "nomeOficialBruto": "JARDIM PAULISTA",
    "nomeOficial": "Jardim Paulista",
    "arquivo": "908617 - JARDIM PAULISTA - INVENTÁRIO.xlsx"
  },
  "908836": {
    "cie": "908836",
    "cieOriginal": "908836",
    "nomeOficialBruto": "ITAJAHY FEITOSA MARTINS PROFESSOR",
    "nomeOficial": "Itajahy Feitosa Martins, Professor",
    "arquivo": "908836 - ITAJAHY FEITOSA MARTINS PROFESSOR - INVENTÁRIO.xlsx"
  },
  "910454": {
    "cie": "910454",
    "cieOriginal": "910454",
    "nomeOficialBruto": "MARIA SOARES SANTOS PROFESSORA",
    "nomeOficial": "Maria Soares Santos, Professora",
    "arquivo": "910454 - MARIA SOARES SANTOS PROFESSORA - INVENTÁRIO.xlsx"
  },
  "910485": {
    "cie": "910485",
    "cieOriginal": "910485",
    "nomeOficialBruto": "AMADOR AGUIAR",
    "nomeOficial": "Amador Aguiar",
    "arquivo": "910485 - AMADOR AGUIAR - INVENTÁRIO.xlsx"
  },
  "918787": {
    "cie": "918787",
    "cieOriginal": "918787",
    "nomeOficialBruto": "WILMAR SOARES DA SILVA",
    "nomeOficial": "Wilmar Soares da Silva",
    "arquivo": "918787 - WILMAR SOARES DA SILVA - INVENTÁRIO.xlsx"
  },
  "918805": {
    "cie": "918805",
    "cieOriginal": "918805",
    "nomeOficialBruto": "LEONOR MENDES DE BARROS",
    "nomeOficial": "Leonor Mendes de Barros",
    "arquivo": "918805 - LEONOR MENDES DE BARROS - INVENTÁRIO.xlsx"
  },
  "920241": {
    "cie": "920241",
    "cieOriginal": "920241",
    "nomeOficialBruto": "PARQUE IMPERIAL",
    "nomeOficial": "Parque Imperial",
    "arquivo": "920241 - PARQUE IMPERIAL - INVENTÁRIO.xlsx"
  },
  "921439": {
    "cie": "921439",
    "cieOriginal": "921439",
    "nomeOficialBruto": "PAULO DA COSTA PAN CHACON PROFESSOR",
    "nomeOficial": "Paulo da Costa Pan Chacon, Professor",
    "arquivo": "921439 - PAULO DA COSTA PAN CHACON PROFESSOR - INVENTÁRIO.xlsx"
  },
  "921440": {
    "cie": "921440",
    "cieOriginal": "921440",
    "nomeOficialBruto": "GIUSEPPE ANGELO BERTOLLI PADRE",
    "nomeOficial": "Giuseppe Angelo Bertolli, Padre",
    "arquivo": "921440 - GIUSEPPE ANGELO BERTOLLI PADRE - INVENTÁRIO.xlsx"
  },
  "923333": {
    "cie": "923333",
    "cieOriginal": "923333",
    "nomeOficialBruto": "JOSEPHA PINTO CHIAVELLI PROFESSORA",
    "nomeOficial": "Josepha Pinto Chiavelli, Professora",
    "arquivo": "923333 - JOSEPHA PINTO CHIAVELLI PROFESSORA - INVENTÁRIO.xlsx"
  },
  "923874": {
    "cie": "923874",
    "cieOriginal": "923874",
    "nomeOficialBruto": "ELIANA ANDRES DE ALMEIDA SOUZA PROFESSORA",
    "nomeOficial": "Eliana Andres de Almeida Souza, Professora",
    "arquivo": "923874 - ELIANA ANDRES DE ALMEIDA SOUZA PROFESSORA - INVENTÁRIO.xlsx"
  },
  "925834": {
    "cie": "925834",
    "cieOriginal": "925834",
    "nomeOficialBruto": "PARQUE PAYOL",
    "nomeOficial": "Parque Payol",
    "arquivo": "925834 - PARQUE PAYOL - INVENTÁRIO.xlsx"
  },
  "010364": {
    "cie": "010364",
    "cieOriginal": "10364",
    "nomeOficialBruto": "DORVALINO ABILIO TEIXEIRA",
    "nomeOficial": "Dorvalino Abilio Teixeira",
    "arquivo": "10364 - DORVALINO ABILIO TEIXEIRA - INVENTÁRIO.xlsx"
  },
  "010376": {
    "cie": "010376",
    "cieOriginal": "10376",
    "nomeOficialBruto": "MARIA CRISTINA LOPES",
    "nomeOficial": "Maria Cristina Lopes",
    "arquivo": "10376 - MARIA CRISTINA LOPES - INVENTÁRIO.xlsx"
  },
  "010388": {
    "cie": "010388",
    "cieOriginal": "10388",
    "nomeOficialBruto": "JOSE CHALUPPE",
    "nomeOficial": "Jose Chaluppe",
    "arquivo": "10388 - JOSE CHALUPPE - INVENTÁRIO.xlsx"
  },
  "010397": {
    "cie": "010397",
    "cieOriginal": "10397",
    "nomeOficialBruto": "VICENTE THEMUDO LESSA PROFESSOR",
    "nomeOficial": "Vicente Themudo Lessa, Professor",
    "arquivo": "10397 - VICENTE THEMUDO LESSA PROFESSOR - INVENTÁRIO.xlsx"
  },
  "010424": {
    "cie": "010424",
    "cieOriginal": "10424",
    "nomeOficialBruto": "CELINA DE BARROS BAIRAO PROFESSORA",
    "nomeOficial": "Celina de Barros Bairao, Professora",
    "arquivo": "10424 - CELINA DE BARROS BAIRAO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "010431": {
    "cie": "010431",
    "cieOriginal": "10431",
    "nomeOficialBruto": "AMERICO VALENTIN CHRISTIANINI",
    "nomeOficial": "Americo Valentin Christianini",
    "arquivo": "10431 - AMERICO VALENTIN CHRISTIANINI - INVENTÁRIO.xlsx"
  },
  "010443": {
    "cie": "010443",
    "cieOriginal": "10443",
    "nomeOficialBruto": "NACIF AMIN CHALUPE",
    "nomeOficial": "Nacif Amin Chalupe",
    "arquivo": "10443 - NACIF AMIN CHALUPE - INVENTÁRIO.xlsx"
  },
  "010467": {
    "cie": "010467",
    "cieOriginal": "10467",
    "nomeOficialBruto": "RAUL BRIQUET DOUTOR",
    "nomeOficial": "Raul Briquet, Doutor",
    "arquivo": "10467 - RAUL BRIQUET DOUTOR - INVENTÁRIO.xlsx"
  },
  "010479": {
    "cie": "010479",
    "cieOriginal": "10479",
    "nomeOficialBruto": "CLARO CAMARGO RIBEIRO",
    "nomeOficial": "Claro Camargo Ribeiro",
    "arquivo": "10479 - CLARO CAMARGO RIBEIRO - INVENTÁRIO.xlsx"
  },
  "010480": {
    "cie": "010480",
    "cieOriginal": "10480",
    "nomeOficialBruto": "DIMARAES ANTONIO SANDEI PROFESSOR",
    "nomeOficial": "Dimaraes Antonio Sandei, Professor",
    "arquivo": "10480 - DIMARAES ANTONIO SANDEI PROFESSOR - INVENTÁRIO.xlsx"
  },
  "010613": {
    "cie": "010613",
    "cieOriginal": "10613",
    "nomeOficialBruto": "CANDIDO RONDON MARECHAL",
    "nomeOficial": "Candido Rondon, Marechal",
    "arquivo": "10613 - CANDIDO RONDON MARECHAL - INVENTÁRIO.xlsx"
  },
  "010649": {
    "cie": "010649",
    "cieOriginal": "10649",
    "nomeOficialBruto": "HENRIQUE SAMMARTINO ALFERES",
    "nomeOficial": "Henrique Sammartino, Alferes",
    "arquivo": "10649 - HENRIQUE SAMMARTINO ALFERES - INVENTÁRIO.xlsx"
  },
  "010650": {
    "cie": "010650",
    "cieOriginal": "10650",
    "nomeOficialBruto": "JOSE NEYDE CESAR LESSA DOUTOR",
    "nomeOficial": "Jose Neyde Cesar Lessa, Doutor",
    "arquivo": "10650 - JOSE NEYDE CESAR LESSA DOUTOR - INVENTÁRIO.xlsx"
  },
  "010662": {
    "cie": "010662",
    "cieOriginal": "10662",
    "nomeOficialBruto": "OSWALDO SAMMARTINO",
    "nomeOficial": "Oswaldo Sammartino",
    "arquivo": "10662 - OSWALDO SAMMARTINO - INVENTÁRIO.xlsx"
  },
  "035440": {
    "cie": "035440",
    "cieOriginal": "35440",
    "nomeOficialBruto": "REPUBLICA DE CUBA",
    "nomeOficial": "Republica de Cuba",
    "arquivo": "35440 - REPUBLICA DE CUBA - INVENTÁRIO.xlsx"
  },
  "040548": {
    "cie": "040548",
    "cieOriginal": "40548",
    "nomeOficialBruto": "NESTOR DE CAMARGO PREFEITO",
    "nomeOficial": "Nestor de Camargo, Prefeito",
    "arquivo": "40548 - NESTOR DE CAMARGO PREFEITO - INVENTÁRIO.xlsx"
  },
  "040551": {
    "cie": "040551",
    "cieOriginal": "40551",
    "nomeOficialBruto": "LENIO VIEIRA DE MORAES PROFESSOR",
    "nomeOficial": "Lenio Vieira de Moraes, Professor",
    "arquivo": "40551 - LENIO VIEIRA DE MORAES PROFESSOR - INVENTÁRIO.xlsx"
  },
  "041373": {
    "cie": "041373",
    "cieOriginal": "41373",
    "nomeOficialBruto": "JOAO BATISTA SOLDE",
    "nomeOficial": "Joao Batista Solde",
    "arquivo": "41373 - JOAO BATISTA SOLDE - INVENTÁRIO.xlsx"
  },
  "041385": {
    "cie": "041385",
    "cieOriginal": "41385",
    "nomeOficialBruto": "MOACIR THOMAZ DA SILVA",
    "nomeOficial": "Moacir Thomaz da Silva",
    "arquivo": "41385 - MOACIR THOMAZ DA SILVA - INVENTÁRIO.xlsx"
  },
  "043333": {
    "cie": "043333",
    "cieOriginal": "43333",
    "nomeOficialBruto": "NERCY AMELIA MARTELINI DAHER PROFESSORA",
    "nomeOficial": "Nercy Amelia Martelini Daher, Professora",
    "arquivo": "43333 - NERCY AMELIA MARTELINI DAHER PROFESSORA - INVENTÁRIO.xlsx"
  },
  "043886": {
    "cie": "043886",
    "cieOriginal": "43886",
    "nomeOficialBruto": "JOSE THEOTONIO DOS SANTOS PROFESSOR",
    "nomeOficial": "Jose Theotonio dos Santos, Professor",
    "arquivo": "43886 - JOSE THEOTONIO DOS SANTOS PROFESSOR - INVENTÁRIO.xlsx"
  },
  "044817": {
    "cie": "044817",
    "cieOriginal": "44817",
    "nomeOficialBruto": "LUIS DA CAMARA CASCUDO",
    "nomeOficial": "Luis da Camara Cascudo",
    "arquivo": "44817 - LUIS DA CAMARA CASCUDO - INVENTÁRIO.xlsx"
  },
  "044921": {
    "cie": "044921",
    "cieOriginal": "44921",
    "nomeOficialBruto": "MYRTHES THEREZINHA ASSAD VILLELA PROFA",
    "nomeOficial": "Myrthes Therezinha Assad Villela, Professora",
    "arquivo": "44921 - MYRTHES THEREZINHA ASSAD VILLELA PROFA - INVENTÁRIO.xlsx"
  },
  "044933": {
    "cie": "044933",
    "cieOriginal": "44933",
    "nomeOficialBruto": "MARIO JOAQUIM ESCOBAR DE ANDRADE",
    "nomeOficial": "Mario Joaquim Escobar de Andrade",
    "arquivo": "44933 - MARIO JOAQUIM ESCOBAR DE ANDRADE - INVENTÁRIO.xlsx"
  },
  "046607": {
    "cie": "046607",
    "cieOriginal": "46607",
    "nomeOficialBruto": "JOAO NASCIF CHALUPP",
    "nomeOficial": "Joao Nascif Chalupp",
    "arquivo": "46607 - JOAO NASCIF CHALUPP - INVENTÁRIO.xlsx"
  },
  "048161": {
    "cie": "048161",
    "cieOriginal": "48161",
    "nomeOficialBruto": "IRACEMA RAUEN MACIEL PROFESSORA",
    "nomeOficial": "Iracema Rauen Maciel, Professora",
    "arquivo": "48161 - IRACEMA RAUEN MACIEL PROFESSORA - INVENTÁRIO.xlsx"
  },
  "048173": {
    "cie": "048173",
    "cieOriginal": "48173",
    "nomeOficialBruto": "ELIZA DE OLIVEIRA RIBEIRO",
    "nomeOficial": "Eliza de Oliveira Ribeiro",
    "arquivo": "48173 - ELIZA DE OLIVEIRA RIBEIRO - INVENTÁRIO.xlsx"
  },
  "048975": {
    "cie": "048975",
    "cieOriginal": "48975",
    "nomeOficialBruto": "MARY MALLET CYRINO PROFESSORA",
    "nomeOficial": "Mary Mallet Cyrino, Professora",
    "arquivo": "48975 - MARY MALLET CYRINO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "048999": {
    "cie": "048999",
    "cieOriginal": "48999",
    "nomeOficialBruto": "ROMEO MECCA PADRE",
    "nomeOficial": "Romeo Mecca, Padre",
    "arquivo": "48999 - ROMEO MECCA PADRE - INVENTÁRIO.xlsx"
  },
  "049013": {
    "cie": "049013",
    "cieOriginal": "49013",
    "nomeOficialBruto": "MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR",
    "nomeOficial": "Manoel Augusto Vieira Neto, Desembargador",
    "arquivo": "49013 - MANOEL AUGUSTO VIEIRA NETO DESEMBARGADOR - INVENTÁRIO.xlsx"
  },
  "049025": {
    "cie": "049025",
    "cieOriginal": "49025",
    "nomeOficialBruto": "JARDIM MARIA HELENA I",
    "nomeOficial": "Jardim Maria Helena I",
    "arquivo": "49025 - JARDIM MARIA HELENA I - INVENTÁRIO.xlsx"
  },
  "009787": {
    "cie": "009787",
    "cieOriginal": "9787",
    "nomeOficialBruto": "IVANI MARIA PAES PROFESSORA",
    "nomeOficial": "Ivani Maria Paes, Professora",
    "arquivo": "9787 - IVANI MARIA PAES PROFESSORA - INVENTÁRIO.xlsx"
  },
  "009799": {
    "cie": "009799",
    "cieOriginal": "9799",
    "nomeOficialBruto": "CAIO PRADO JUNIOR DEPUTADO",
    "nomeOficial": "Caio Prado Junior, Deputado",
    "arquivo": "9799 - CAIO PRADO JUNIOR DEPUTADO - INVENTÁRIO.xlsx"
  },
  "009830": {
    "cie": "009830",
    "cieOriginal": "9830",
    "nomeOficialBruto": "REPUBLICA DO EQUADOR",
    "nomeOficial": "Republica do Equador",
    "arquivo": "9830 - REPUBLICA DO EQUADOR - INVENTÁRIO.xlsx"
  },
  "009878": {
    "cie": "009878",
    "cieOriginal": "9878",
    "nomeOficialBruto": "ALAYDE DOMINGUES COUTO MACEDO PROFESSORA",
    "nomeOficial": "Alayde Domingues Couto Macedo, Professora",
    "arquivo": "9878 - ALAYDE DOMINGUES COUTO MACEDO PROFESSORA - INVENTÁRIO.xlsx"
  },
  "009891": {
    "cie": "009891",
    "cieOriginal": "9891",
    "nomeOficialBruto": "JOSE WILSON PADINHA PROFESSOR",
    "nomeOficial": "Jose Wilson Padinha, Professor",
    "arquivo": "9891 - JOSE WILSON PADINHA PROFESSOR - INVENTÁRIO.xlsx"
  },
  "009912": {
    "cie": "009912",
    "cieOriginal": "9912",
    "nomeOficialBruto": "ALDEIA DE BARUERI",
    "nomeOficial": "Aldeia de Barueri",
    "arquivo": "9912 - ALDEIA DE BARUERI - INVENTÁRIO.xlsx"
  },
  "009921": {
    "cie": "009921",
    "cieOriginal": "9921",
    "nomeOficialBruto": "JOSE DOMINGOS DA SILVEIRA PROFESSOR",
    "nomeOficial": "Jose Domingos da Silveira, Professor",
    "arquivo": "9921 - JOSE DOMINGOS DA SILVEIRA PROFESSOR - INVENTÁRIO.xlsx"
  }
};
    window.DICIONARIO_OFICIAL_INVENTARIO = DICIONARIO_OFICIAL_INVENTARIO;

    /* === DADOS OFICIAIS COMPLETOS DO INVENTÁRIO (EXTRAÍDOS DAS 57 ESCOLAS DE InventarioRC - V2) === */
    /* Estrutura das tuplas: [cie, ambiente, categoria, equipamento, numero_serie, status] */
    var INVENTARIO_COMPLETO_TUPLES = {"hardware":[],"educatrons":[],"rede":[],"recarga":[]};
    window.INVENTARIO_COMPLETO_TUPLES = INVENTARIO_COMPLETO_TUPLES;

    /* === COMPROMISSOS & AGENDA (100% NUVEM - GOOGLE CALENDAR + APPS SCRIPT) === */
    function inicializarCompromissosPadrao() {
      const hoje = obterDataHojeIso();
      const dObj = new Date(hoje + 'T12:00:00');
      const dAmanha = new Date(dObj.getTime() + 86400000);
      const amanha = dAmanha.getFullYear() + '-' + String(dAmanha.getMonth() + 1).padStart(2, '0') + '-' + String(dAmanha.getDate()).padStart(2, '0');
      const dMais2 = new Date(dObj.getTime() + 2 * 86400000);
      const mais2 = dMais2.getFullYear() + '-' + String(dMais2.getMonth() + 1).padStart(2, '0') + '-' + String(dMais2.getDate()).padStart(2, '0');
      const dMais4 = new Date(dObj.getTime() + 4 * 86400000);
      const mais4 = dMais4.getFullYear() + '-' + String(dMais4.getMonth() + 1).padStart(2, '0') + '-' + String(dMais4.getDate()).padStart(2, '0');
      return [
        {
          id: 'evt-padrao-1',
          titulo: 'Alinhamento Executivo do Gabinete e Chefias URE Itapevi',
          data: hoje,
          horaInicio: '08:00',
          horaFim: '09:00',
          tipo: 'Reunião',
          local: 'Gabinete da Dirigente - URE Itapevi',
          link: '',
          setor: 'Gabinete / URE',
          prioridade: 'Alta',
          status: 'Agendado',
          descricao: 'Pauta prioritária da semana: indicadores pedagógicos, demandas de infraestrutura escolar (SEOM), vida funcional (SEPES) e suporte tecnológico (SEINTEC).'
        },
        {
          id: 'evt-padrao-2',
          titulo: 'Despacho Técnico de Processos SEI e Expedientes Prioritários',
          data: hoje,
          horaInicio: '10:00',
          horaFim: '11:00',
          tipo: 'Despacho Gabinete',
          local: 'Gabinete da Dirigente',
          link: '',
          setor: 'ASURE / SEAFIN',
          prioridade: 'Normal',
          status: 'Agendado',
          descricao: 'Análise e assinatura de despachos oficiais, homologações e encaminhamentos às unidades escolares.'
        },
        {
          id: 'evt-padrao-3',
          titulo: 'Reunião de Monitoramento Pedagógico e Avaliações (EEC / Supervisão)',
          data: hoje,
          horaInicio: '14:00',
          horaFim: '15:00',
          tipo: 'Videoconferência Teams',
          local: 'Microsoft Teams',
          link: '',
          setor: 'EEC / Supervisão',
          prioridade: 'Alta',
          status: 'Agendado',
          descricao: 'Acompanhamento das metas de aprendizagem, frequência escolar e apoio às equipes gestoras das 63 escolas estaduais.'
        },
        {
          id: 'evt-padrao-4',
          titulo: 'Visita Técnica de Acompanhamento Escolar na Rede URE Itapevi',
          data: amanha,
          horaInicio: '09:00',
          horaFim: '12:00',
          tipo: 'Visita Técnica',
          local: 'Unidades Escolares - URE Itapevi',
          link: '',
          setor: 'Gabinete / Supervisão',
          prioridade: 'Alta',
          status: 'Agendado',
          descricao: 'Vistoria in loco das condições prediais, parque tecnológico e diálogo com a equipe gestora escolar.'
        },
        {
          id: 'evt-padrao-5',
          titulo: 'Videoconferência Institucional SEDUC-SP com Dirigentes Regionais',
          data: mais2,
          horaInicio: '10:00',
          horaFim: '11:30',
          tipo: 'Videoconferência Teams',
          local: 'Microsoft Teams - Canal SEDUC-SP',
          link: '',
          setor: 'SEDUC-SP / Gabinete',
          prioridade: 'Alta',
          status: 'Agendado',
          descricao: 'Pauta estadual com a Subsecretaria de Articulação Regional e orientações estratégicas para as regionais de ensino.'
        },
        {
          id: 'evt-padrao-6',
          titulo: 'Encontro Formativo com Diretores de Escola da URE Itapevi',
          data: mais4,
          horaInicio: '09:00',
          horaFim: '12:00',
          tipo: 'Evento Oficial',
          local: 'Auditório URE Itapevi',
          link: '',
          setor: 'Gabinete / EEC / SEGRE',
          prioridade: 'Alta',
          status: 'Agendado',
          descricao: 'Socialização de boas práticas de gestão, fluxo de matrículas (SEGRE) e execução do Plano de Ação 2026.'
        }
      ];
    }

    let AGENDA_COMPROMISSOS = inicializarCompromissosPadrao();

    function carregarAgendaCloud(callback) {
      if (typeof window.lerEstadoNuvem === 'function') {
        window.lerEstadoNuvem('AGENDA_DATA', function(dados) {
          if (Array.isArray(dados) && dados.length > 0) {
            AGENDA_COMPROMISSOS = dados;
            if (typeof renderizarAgenda === 'function') renderizarAgenda();
            if (typeof renderizarMinhaGestao === 'function') renderizarMinhaGestao();
          }
          if (typeof callback === 'function') callback();
        });
      } else if (typeof callback === 'function') {
        callback();
      }
    }

    function salvarAgendaStorage() {
      if (typeof window.gravarEstadoNuvem === 'function') {
        window.gravarEstadoNuvem('AGENDA_DATA', AGENDA_COMPROMISSOS);
      }
    }

    /**
     * Sincronização Dinâmica com o Google Calendar da Conta Institucional
     * Conecta diretamente com CalendarApp do Google Apps Script sem gastar cota no Google Drive
     */
    function carregarGoogleCalendar(dataIsoOpcional, callback) {
      function aplicarEventosCalendar(eventos) {
        if (eventos && Array.isArray(eventos) && eventos.length > 0) {
          /* Se filtrou por data específica, atualiza os do dia mantendo os demais */
          if (dataIsoOpcional) {
            const outrosDias = AGENDA_COMPROMISSOS.filter(c => c.data !== dataIsoOpcional);
            AGENDA_COMPROMISSOS = [...eventos, ...outrosDias];
          } else {
            AGENDA_COMPROMISSOS = eventos;
          }
          salvarAgendaStorage();
          renderizarMinhaGestao();
          if (typeof sincronizarCardsBasesSeintec === 'function') sincronizarCardsBasesSeintec();
          renderizarAgenda();
        }
        if (typeof callback === 'function') callback(eventos);
      }

      if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.getGoogleCalendarEvents === 'function') {
        if (!dataIsoOpcional && window.__syncSilenciosoAtivo && window.__iniciarBootstrapGas) {
          window.__iniciarBootstrapGas().then(function(boot) {
            var cachedCal = boot && boot.caches && boot.caches.agenda_calendar;
            if (cachedCal && Array.isArray(cachedCal.eventos) && cachedCal.eventos.length > 0) {
              aplicarEventosCalendar(cachedCal.eventos);
              return;
            }
            window.__runGasQueued('getGoogleCalendarEvents', [dataIsoOpcional], 12000)
              .then(aplicarEventosCalendar)
              .catch(function(err) {
                console.warn("Google Calendar indisponível, utilizando dados locais:", err);
                if (typeof callback === 'function') callback(null);
              });
          });
          return;
        }
        window.__runGasQueued('getGoogleCalendarEvents', [dataIsoOpcional], 12000)
          .then(aplicarEventosCalendar)
          .catch(function(err) {
            console.warn("Google Calendar indisponível, utilizando dados locais:", err);
            if (typeof callback === 'function') callback(null);
          });
      } else {
        if (typeof callback === 'function') callback(AGENDA_COMPROMISSOS);
      }
    }

    /* Formatação de data por extenso em Português (Ex: "sábado 17 de outubro de 2026") */
    function formatarDataExtensoPtBr(dataIso) {
      if (!dataIso) return '';
      const partes = dataIso.split('-');
      const ano = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;
      const dia = parseInt(partes[2], 10);
      const dataObj = new Date(ano, mes, dia, 12, 0, 0);

      const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

      const diaSemana = diasSemana[dataObj.getDay()];
      const mesNome = meses[dataObj.getMonth()];

      return `${diaSemana} ${dia} de ${mesNome} de ${ano}`;
    }

    /* ============================================================== */
    /* MOTOR DE ALERTAS PREMIUM DE SINCRONIZAÇÃO EM TEMPO REAL       */
    /* ============================================================== */
    let _syncAlertTimeout = null;
    let _syncAlertProgressAnim = null;

    function mostrarAlertaSincronizacao(config) {
      if (!config) return;
      const tipo = config.tipo || 'info';
      if (typeof registrarAlertaNoSininho === 'function' && tipo !== 'loading') {
        registrarAlertaNoSininho(tipo, config.titulo, config.mensagem, config.hora);
      } /* 'loading', 'success', 'error', 'info' */
      if (window.__syncSilenciosoAtivo && tipo !== 'error') {
        return;
      }
      const tag = config.tag || (tipo === 'loading' ? 'SINCRONIZAÇÃO EM ANDAMENTO' : (tipo === 'success' ? 'SUCESSO • ATUALIZADO' : (tipo === 'error' ? 'FALHA NO SINCRONISMO' : 'INFORMAÇÃO')));
      const titulo = config.titulo || (tipo === 'loading' ? 'Sincronizando...' : (tipo === 'success' ? 'Sincronização Concluída!' : (tipo === 'error' ? 'Erro na Sincronização' : 'Aviso')));
      const mensagem = config.mensagem || '';
      const detalhes = config.detalhes || (tipo === 'loading' ? 'SharePoint Cloud • Conectando...' : 'SharePoint Cloud • Conectado');
      const hora = config.hora || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      /* Erros e avisos de falha permanecem na tela INDEFINIDAMENTE até o usuário fechar manualmente (duracao = 0) */
      let duracao = (typeof config.duracao === 'number') ? config.duracao : (tipo === 'loading' ? 0 : (tipo === 'error' ? 0 : 5000));
      if (tipo === 'error') {
        duracao = 0; /* Fechamento exclusivamente manual */
      }

      const container = document.getElementById('sync-alert-toast-container');
      if (!container) return;

      let card = document.getElementById('sync-alert-card');
      const isNovo = !card;

      if (isNovo) {
        card = document.createElement('div');
        card.id = 'sync-alert-card';
        card.className = 'sync-alert-card type-' + tipo;
        container.appendChild(card);
      } else {
        card.className = 'sync-alert-card type-' + tipo + ' show';
      }

      /* Escolhe ícone */
      let iconeHtml = '';
      if (tipo === 'loading') {
        iconeHtml = '<span class="sync-alert-spinner"></span><span style="font-size: 1rem;">🔄</span>';
      } else if (tipo === 'success') {
        iconeHtml = '<span>✅</span>';
      } else if (tipo === 'error') {
        iconeHtml = '<span>❌</span>';
      } else {
        iconeHtml = '<span>ℹ️</span>';
      }

      card.innerHTML = `
        <div class="sync-alert-accent-bar"></div>
        <div class="sync-alert-inner">
          <div class="sync-alert-header">
            <div class="sync-alert-icon-box">
              ${iconeHtml}
            </div>
            <div class="sync-alert-title-area">
              <div class="sync-alert-tag">${tag}</div>
              <h4 class="sync-alert-title" title="${titulo}">${titulo}</h4>
            </div>
            <button type="button" class="sync-alert-close" onclick="fecharAlertaSincronizacao()" title="Fechar alerta (fechamento manual)" style="cursor: pointer; font-size: 1rem; font-weight: 800;">✕</button>
          </div>
          <p class="sync-alert-message">${mensagem}</p>
          <div class="sync-alert-footer">
            <div class="sync-alert-meta-item">
              <span class="sync-alert-pulse-dot"></span>
              <span>${detalhes}</span>
            </div>
            <div class="sync-alert-meta-item">
              ${tipo === 'error' ? '<span style="font-size: 0.68rem; color: #fca5a5; font-weight: 700; background: rgba(239, 68, 68, 0.25); border: 1px solid rgba(248, 113, 113, 0.4); border-radius: 4px; padding: 2px 6px; margin-right: 4px;">FECHAR MANUALMENTE (✕)</span>' : ''}
              <span>${hora}</span>
            </div>
          </div>
        </div>
        <div class="sync-alert-progress">
          <div class="sync-alert-progress-bar" id="sync-alert-bar"></div>
        </div>
      `;

      /* Anima entrada se novo */
      if (isNovo) {
        requestAnimationFrame(() => {
          card.classList.add('show');
        });
      }

      /* Limpa timeouts anteriores */
      if (_syncAlertTimeout) {
        clearTimeout(_syncAlertTimeout);
        _syncAlertTimeout = null;
      }
      if (_syncAlertProgressAnim) {
        cancelAnimationFrame(_syncAlertProgressAnim);
        _syncAlertProgressAnim = null;
      }

      /* Barra de progresso para contagem regressiva em success/error */
      const barEl = document.getElementById('sync-alert-bar');
      if (duracao > 0 && barEl && tipo !== 'loading') {
        barEl.style.width = '100%';
        barEl.style.transition = 'width ' + duracao + 'ms linear';
        requestAnimationFrame(() => {
          barEl.style.width = '0%';
        });

        _syncAlertTimeout = setTimeout(() => {
          fecharAlertaSincronizacao();
        }, duracao);

        /* Suporte a hover: pausa temporizador */
        card.onmouseenter = function() {
          if (_syncAlertTimeout) {
            clearTimeout(_syncAlertTimeout);
            _syncAlertTimeout = null;
          }
          if (barEl) barEl.style.transition = 'none';
        };
        card.onmouseleave = function() {
          if (!_syncAlertTimeout) {
            _syncAlertTimeout = setTimeout(() => {
              fecharAlertaSincronizacao();
            }, 2500);
          }
        };
      }
    }

    function fecharAlertaSincronizacao() {
      if (_syncAlertTimeout) {
        clearTimeout(_syncAlertTimeout);
        _syncAlertTimeout = null;
      }
      const card = document.getElementById('sync-alert-card');
      if (card) {
        card.classList.remove('show');
        card.classList.add('hide');
        setTimeout(() => {
          if (card.parentNode) card.parentNode.removeChild(card);
        }, 380);
      }
    }

    function mostrarToastGlobal(msg, icone) {
      const isErr = (icone === '❌' || (typeof msg === 'string' && (msg.toLowerCase().includes('erro') || msg.toLowerCase().includes('falha'))));
      const isWait = (icone === '⏳' || icone === '🔄' || (typeof msg === 'string' && (msg.toLowerCase().includes('iniciada') || msg.toLowerCase().includes('consultando'))));
      mostrarAlertaSincronizacao({
        tipo: isWait ? 'loading' : (isErr ? 'error' : 'success'),
        tag: isWait ? 'SINCRONIZANDO' : (isErr ? 'ATENÇÃO' : 'OPERACIONAL'),
        titulo: isWait ? 'Sincronizando Sistema...' : (isErr ? 'Falha na Operação' : 'Operação Concluída com Sucesso'),
        mensagem: msg,
        duracao: isWait ? 0 : (isErr ? 6500 : 4500)
      });
    }

    function mostrarToastAgenda(msg, icone) {
      const toast = document.getElementById('agenda-toast');
      const msgEl = document.getElementById('agenda-toast-msg');
      const iconEl = document.getElementById('agenda-toast-icon');
      if (toast && msgEl) {
        msgEl.innerText = msg;
        if (iconEl) iconEl.innerText = icone || '✅';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }
    }

    window.mostrarAlertaSincronizacao = mostrarAlertaSincronizacao;

    var BI_SVG_PATHS = {
      clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      refresh: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
      file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>',
      download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
      upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
      graduation: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
      folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
      building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
      school: '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
      briefcase: '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
      calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
      monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
      check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      barChart: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
      trendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
      car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
      mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
      compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
      book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
      clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
      printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
      eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
      edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
      trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
      globe: '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
      ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
      zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
      mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
      lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
      link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
      xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
      scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
      rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
      award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
      save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
    };

    function biIcon(nome, size, boxed) {
      var sz = size || 16;
      var inner = BI_SVG_PATHS[nome] || BI_SVG_PATHS.file;
      var svg = '<svg class="bi-inline-svg" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
      if (boxed) return '<span class="bi-header-icon-box">' + svg + '</span>';
      return svg;
    }
    window.biIcon = biIcon;

    var BI_EMOJI_MAP = {
      '🕒': 'clock', '⏰': 'clock',
      '🔄': 'refresh', '♻': 'refresh', '♻️': 'refresh',
      '📄': 'file', '📑': 'file', '📜': 'file', '📝': 'file', '📕': 'file', '📰': 'file', '🗞': 'file', '🗞️': 'file',
      '📥': 'download', '📤': 'upload', '💾': 'save',
      '🎓': 'graduation', '🎒': 'graduation',
      '📁': 'folder', '📂': 'folder', '🗂': 'folder', '🗂️': 'folder', '🗄': 'folder',
      '🏛': 'building', '🏛️': 'building', '🏢': 'building', '🏦': 'building',
      '🏫': 'school', '🏠': 'school',
      '💼': 'briefcase', '💰': 'briefcase', '💳': 'briefcase',
      '🏗': 'wrench', '🏗️': 'wrench', '🛠': 'wrench', '🛠️': 'wrench', '🔧': 'wrench',
      '👥': 'users', '🤝': 'users', '👤': 'user', '👨': 'user', '🧓': 'user',
      '🛡': 'shield', '🛡️': 'shield',
      '📦': 'box',
      '📅': 'calendar',
      '💻': 'monitor', '🖥': 'monitor', '🖥️': 'monitor', '📺': 'monitor', '📱': 'monitor',
      '✅': 'check', '✔': 'check', '✓': 'check',
      '🔍': 'search',
      '📊': 'barChart', '📈': 'trendingUp',
      '🚗': 'car', '🚙': 'car', '⛽': 'car', '🚦': 'car',
      '📍': 'mapPin', '📌': 'mapPin', '🗺': 'map', '🗺️': 'map', '🧭': 'compass',
      '📚': 'book', '📖': 'book',
      '📋': 'clipboard',
      '🖨': 'printer', '🖨️': 'printer',
      '👁': 'eye', '👁️': 'eye',
      '✏': 'edit', '✏️': 'edit', '✍': 'edit',
      '🗑': 'trash', '🗑️': 'trash',
      '🌐': 'globe', '📡': 'globe', '🛰': 'globe', '🛰️': 'globe', '🔗': 'link',
      '⚠': 'alert', '⚠️': 'alert', '🚨': 'alert',
      '🚫': 'ban', '❌': 'xCircle', '✖': 'xCircle', '✕': 'xCircle',
      '⚡': 'zap', '🔌': 'zap', '🔋': 'zap',
      '🎯': 'target', '💡': 'bulb',
      '📧': 'mail', '📬': 'mail', '📞': 'phone', '📣': 'bell', '📢': 'bell', '🗣': 'bell', '🔔': 'bell',
      '🔒': 'lock', '⚙': 'settings', '⚙️': 'settings', '☁': 'cloud', '☁️': 'cloud',
      '⚖': 'scale', '⚖️': 'scale', '🚀': 'rocket', '✈': 'rocket', '✈️': 'rocket',
      '🎖': 'award', '🎖️': 'award', '💎': 'award',
      '☀': 'sun', '☀️': 'sun', '🌅': 'sun', '🏖': 'sun', '🌱': 'sun',
      '🟢': 'dot-green', '🟡': 'dot-yellow', '🟠': 'dot-orange', '🔴': 'dot-red', '🔵': 'dot-blue'
    };

    var BI_EMOJI_REGEX = /(🕒|⏰|🔄|♻️?|📄|📑|📜|📝|📕|📰|🗞️?|📥|📤|💾|🎓|🎒|📁|📂|🗂️?|🗄|🏛️?|🏢|🏦|🏫|🏠|💼|💰|💳|🏗️?|🛠️?|🔧|👥|🤝|👤|👨|🧓|🛡️?|📦|📅|💻|🖥️?|📺|📱|✅|✔|✓|🔍|📊|📈|🚗|🚙|⛽|🚦|📍|📌|🗺️?|🧭|📚|📖|📋|🖨️?|👁️?|✏️?|✍|🗑️?|🌐|📡|🛰️?|🔗|⚠️?|🚨|🚫|❌|✖|✕|⚡|🔌|🔋|🎯|💡|📧|📬|📞|📣|📢|🗣|🔔|🔒|⚙️?|☁️?|⚖️?|🚀|✈️?|🎖️?|💎|☀️?|🌅|🏖|🌱|🟢|🟡|🟠|🔴|🔵)/g;

    function biSanitizeEmojiIcons(root) {
      if (!root || !document.createTreeWalker) return;
      var skipTags = { SCRIPT: 1, STYLE: 1, OPTION: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, TITLE: 1, SVG: 1 };
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          var p = node.parentNode;
          while (p && p !== root) {
            if (skipTags[p.nodeName] || (p.getAttribute && p.getAttribute('data-no-svg') === 'true')) {
              return NodeFilter.FILTER_REJECT;
            }
            p = p.parentNode;
          }
          return (node.nodeValue && BI_EMOJI_REGEX.test(node.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      });
      var nodes = [];
      var cur;
      while ((cur = walker.nextNode())) nodes.push(cur);
      nodes.forEach(function(textNode) {
        var text = textNode.nodeValue;
        BI_EMOJI_REGEX.lastIndex = 0;
        var frag = document.createDocumentFragment();
        var lastIdx = 0;
        var m;
        while ((m = BI_EMOJI_REGEX.exec(text)) !== null) {
          if (m.index > lastIdx) {
            frag.appendChild(document.createTextNode(text.slice(lastIdx, m.index)));
          }
          var key = BI_EMOJI_MAP[m[0]] || BI_EMOJI_MAP[m[0].replace('\uFE0F', '')];
          if (key && key.indexOf('dot-') === 0) {
            var dot = document.createElement('span');
            dot.className = 'bi-status-dot bi-' + key;
            dot.setAttribute('aria-hidden', 'true');
            frag.appendChild(dot);
          } else if (key && BI_SVG_PATHS[key]) {
            var wrap = document.createElement('span');
            wrap.style.display = 'inline-flex';
            wrap.style.alignItems = 'center';
            wrap.style.verticalAlign = 'middle';
            wrap.innerHTML = biIcon(key, 15, false);
            frag.appendChild(wrap.firstChild);
          } else {
            frag.appendChild(document.createTextNode(m[0]));
          }
          lastIdx = m.index + m[0].length;
        }
        if (lastIdx < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIdx)));
        }
        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(frag, textNode);
        }
      });
    }
    window.biSanitizeEmojiIcons = biSanitizeEmojiIcons;

    function iniciarObserverZeroEmoji() {
      if (!document.body) return;
      biSanitizeEmojiIcons(document.body);
      if (typeof MutationObserver === 'function') {
        var pending = [];
        var scheduled = false;
        var flush = function() {
          scheduled = false;
          var list = pending.splice(0, pending.length);
          list.forEach(function(el) {
            if (el && el.nodeType === 1 && el.isConnected) biSanitizeEmojiIcons(el);
          });
        };
        var obs = new MutationObserver(function(mutations) {
          mutations.forEach(function(mut) {
            for (var i = 0; i < mut.addedNodes.length; i++) {
              var n = mut.addedNodes[i];
              if (n.nodeType === 1 && n.nodeName !== 'SVG') {
                pending.push(n);
              } else if (n.nodeType === 3 && mut.target && mut.target.nodeType === 1) {
                pending.push(mut.target);
              }
            }
          });
          if (pending.length > 0 && !scheduled) {
            scheduled = true;
            requestAnimationFrame(flush);
          }
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', iniciarObserverZeroEmoji);
    } else {
      iniciarObserverZeroEmoji();
    }
