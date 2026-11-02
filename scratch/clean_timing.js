const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldCode = `mapaRedeInstancia.flyTo([latCentrado, lngCentrado], 15, { animate: true, duration: 0.5 });

      const markerObj = marcadoresEscolasMapa.find(m => String(m.cieEscola) === cieLimpo);
      if (markerObj) {
        let opened = false;
        mapaRedeInstancia.once('moveend', () => {
          if (!opened) {
            opened = true;
            markerObj.openPopup();
          }
        });
        setTimeout(() => {
          if (!opened) {
            opened = true;
            markerObj.openPopup();
          }
        }, 600);
      }`;

const newCode = `mapaRedeInstancia.flyTo([latCentrado, lngCentrado], 15, { animate: true, duration: 0.35 });

      const markerObj = marcadoresEscolasMapa.find(m => String(m.cieEscola) === cieLimpo);
      if (markerObj) {
        setTimeout(() => {
          markerObj.openPopup();
        }, 280);
      }`;

html = html.replace(oldCode, newCode);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Cleaned focarEscolaNoMapaPorCie timing');
