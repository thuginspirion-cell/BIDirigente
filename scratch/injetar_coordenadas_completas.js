const fs = require('fs');

// 1. Ler as 60 coordenadas reais de scratch/validar_todas_coordenadas.js
const valContent = fs.readFileSync('scratch/validar_todas_coordenadas.js', 'utf8');
const valStart = valContent.indexOf('const COORDENADAS_ESCOLAS = {');
const valEnd = valContent.indexOf('};\n\nconsole.log', valStart);
const coordsStr = valContent.substring(valStart + 'const COORDENADAS_ESCOLAS = '.length, valEnd + 1);

// 2. Atualizar scratch/atualizar_mapa_definitivo.js com as 60 coordenadas reais
let defContent = fs.readFileSync('scratch/atualizar_mapa_definitivo.js', 'utf8');

const anchorStart = defContent.indexOf('const COORDENADAS_REDE_ESCOLAS = {');
const anchorEnd = defContent.indexOf('};\n\n    // Coordenada da Sede', anchorStart);

if (anchorStart === -1 || anchorEnd === -1) {
  console.error('Não encontrou COORDENADAS_REDE_ESCOLAS em atualizar_mapa_definitivo.js');
  process.exit(1);
}

defContent = defContent.slice(0, anchorStart) + 'const COORDENADAS_REDE_ESCOLAS = ' + coordsStr + defContent.slice(anchorEnd);

// Adicionar evento marker.on('click') para auto-centralizar com headroom também ao clicar no pino
const markerAnchor = 'marker.cieEscola = String(e.cie);';
const markerReplacement = `marker.cieEscola = String(e.cie);
        marker.on('click', function() {
          const latCentrado = coords[0] + 0.0035;
          mapaRedeInstancia.panTo([latCentrado, coords[1]], { animate: true, duration: 0.4 });
          focarEscolaNoMapaPorCie(e.cie);
        });`;

defContent = defContent.replace(markerAnchor, markerReplacement);

fs.writeFileSync('scratch/atualizar_mapa_definitivo.js', defContent, 'utf8');
console.log('scratch/atualizar_mapa_definitivo.js atualizado com as 60 coordenadas reais!');
