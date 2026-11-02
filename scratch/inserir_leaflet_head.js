const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const target = '<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>';
const replacement = `<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

  <!-- Leaflet.js para Mapa Geográfico da Rede Escolar com Integração Google Maps -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>`;

if (!content.includes('leaflet@1.9.4/dist/leaflet.js')) {
  content = content.replace(target, replacement);
  console.log('Leaflet tags inseridas com sucesso no <head>!');
} else {
  console.log('Leaflet já presente no arquivo.');
}

content = content.replace(/\r\n/g, '\n');
fs.writeFileSync(filePath, '\ufeff' + content.replace(/^\ufeff/, ''), 'utf8');
console.log('index.html atualizado.');
