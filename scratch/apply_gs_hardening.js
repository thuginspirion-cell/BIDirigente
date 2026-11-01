const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

// 1. Blindar salvarGoogleCalendarEvent na linha 1775 e 1792
// 2. Blindar excluirGoogleCalendarEvent na linha 1814
// 3. Blindar salvarCarroCalendarConfig e getCarroCalendarConfig na linha 2335 e 2350
// 4. Blindar getLogoDataUri e getSeintecLogoDataUri na linha 11393
// 5. Blindar window.onerror global para que nenhuma exceção silenciosa interrompa a execução dos menus no GS

// Adicionar um guardião global de erros no topo do script se não houver
if (!html.includes('/* GS RESILIENCE GUARD */')) {
  const guardScript = [
    '    /* GS RESILIENCE GUARD */',
    '    window.addEventListener("error", function(e) {',
    '      console.warn("Intercepção preventiva no ambiente GS/GAS:", e.message || e);',
    '    });',
    '    window.addEventListener("unhandledrejection", function(e) {',
    '      console.warn("Promise rejeitada tratada preventivamente:", e.reason);',
    '    });'
  ].join(nl);

  const scriptTagIdx = html.indexOf('<script>');
  if (scriptTagIdx !== -1) {
    html = html.substring(0, scriptTagIdx + 8) + nl + guardScript + nl + html.substring(scriptTagIdx + 8);
    console.log("Guardião global de erros injetado com sucesso!");
  }
}

// Blindar chamadas de Calendar na edição/conclusão de compromisso
html = html.replace(
  `      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.salvarGoogleCalendarEvent(evento);
      }`,
  `      if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.salvarGoogleCalendarEvent === 'function') {
        try {
          google.script.run.withFailureHandler(function(err){ console.warn('Aviso Calendar:', err); }).salvarGoogleCalendarEvent(evento);
        } catch(e) { console.warn('Erro ao chamar salvarGoogleCalendarEvent:', e); }
      }`
);

html = html.replace(
  `        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.salvarGoogleCalendarEvent(evento);
        }`,
  `        if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.salvarGoogleCalendarEvent === 'function') {
          try {
            google.script.run.withFailureHandler(function(err){ console.warn('Aviso Calendar:', err); }).salvarGoogleCalendarEvent(evento);
          } catch(e) { console.warn('Erro ao chamar salvarGoogleCalendarEvent:', e); }
        }`
);

html = html.replace(
  `        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.excluirGoogleCalendarEvent(idParaExcluir);
        }`,
  `        if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.excluirGoogleCalendarEvent === 'function') {
          try {
            google.script.run.withFailureHandler(function(err){ console.warn('Aviso Calendar:', err); }).excluirGoogleCalendarEvent(idParaExcluir);
          } catch(e) { console.warn('Erro ao chamar excluirGoogleCalendarEvent:', e); }
        }`
);

// Blindar salvarCarroCalendarConfig
html = html.replace(
  `  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler(function() {
        console.log("Config do calendário salva no Apps Script com sucesso.");
      })
      .salvarCarroCalendarConfig(url);
  }`,
  `  if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.salvarCarroCalendarConfig === 'function') {
    try {
      google.script.run
        .withSuccessHandler(function() {
          console.log("Config do calendário salva no Apps Script com sucesso.");
        })
        .withFailureHandler(function(err) {
          console.warn("Aviso ao salvar config do calendário:", err);
        })
        .salvarCarroCalendarConfig(url);
    } catch(e) { console.warn("Erro ao invocar salvarCarroCalendarConfig:", e); }
  }`
);

// Blindar getCarroCalendarConfig
html = html.replace(
  `function inicializarConfiguracaoCalendarioCarro() {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler(function(urlSalva) {
        if (urlSalva && !carroCalendarUrl) {
          carroCalendarUrl = urlSalva;
          try { localStorage.setItem(STORAGE_KEY_CARRO_CALENDAR, urlSalva); } catch(e) {}
          renderizarCarroOficial();
        }
      })
      .getCarroCalendarConfig();
  }
}`,
  `function inicializarConfiguracaoCalendarioCarro() {
  if (typeof google !== 'undefined' && google.script && google.script.run && typeof google.script.run.getCarroCalendarConfig === 'function') {
    try {
      google.script.run
        .withSuccessHandler(function(urlSalva) {
          if (urlSalva && !carroCalendarUrl) {
            carroCalendarUrl = urlSalva;
            try { localStorage.setItem(STORAGE_KEY_CARRO_CALENDAR, urlSalva); } catch(e) {}
            renderizarCarroOficial();
          }
        })
        .withFailureHandler(function(err) {
          console.warn("Aviso ao obter config do calendário:", err);
        })
        .getCarroCalendarConfig();
    } catch(e) { console.warn("Erro ao invocar getCarroCalendarConfig:", e); }
  }
}`
);

// Adicionar rel="noopener noreferrer" nas tags <a> externas que faltam
html = html.replace(/<a\s+href="([^"]+)"\s+target="_blank"(?!\s+rel)/gi, '<a href="$1" target="_blank" rel="noopener noreferrer"');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Blindagem de resiliência aplicada com sucesso em index.html!");
