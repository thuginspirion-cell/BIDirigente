const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Update focarEscolaNoMapaPorCie to use moveend
const oldFocar = `mapaRedeInstancia.flyTo([latCentrado, lngCentrado], 15, { animate: true, duration: 0.6 });

      const markerObj = marcadoresEscolasMapa.find(m => String(m.cieEscola) === cieLimpo);
      if (markerObj) {
        setTimeout(() => {
          markerObj.openPopup();
        }, 400);
      }`;

const newFocar = `mapaRedeInstancia.flyTo([latCentrado, lngCentrado], 15, { animate: true, duration: 0.5 });

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

if (!html.includes(oldFocar)) {
  console.error('oldFocar not found in index.html');
  process.exit(1);
}

html = html.replace(oldFocar, newFocar);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated focarEscolaNoMapaPorCie with moveend!');
