// scratch/find_max_widths_gestao.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Listar todas as classes CSS usadas em pane-agenda, pane-carro, pane-escolas, pane-visitas
const gestaoPanes = ['pane-gestao-hoje', 'pane-agenda', 'pane-carro', 'pane-escolas', 'pane-visitas'];

gestaoPanes.forEach(pane => {
  const p = html.indexOf('id="' + pane + '"');
  const nextSection = html.indexOf('<section', p + 10);
  const snippet = html.substring(p, nextSection !== -1 ? nextSection : p + 5000);
  
  const classMatches = snippet.matchAll(/class="([^"]+)"/g);
  for (const cm of classMatches) {
    const classList = cm[1].split(' ');
    classList.forEach(cls => {
      if (!cls) return;
      const r = new RegExp('\\.' + cls + '\\s*\\{([^}]+)\\}', 'g');
      let m = r.exec(html);
      if (m && m[1].includes('max-width')) {
        console.log(`[${pane}] .${cls} has max-width:`, m[1].match(/max-width:[^;]+/)[0]);
      }
      if (m && m[1].includes('width:')) {
        const wMatch = m[1].match(/width:[^;]+/);
        if (wMatch && !wMatch[0].includes('100%')) {
          console.log(`[${pane}] .${cls} has width:`, wMatch[0]);
        }
      }
    });
  }
});
