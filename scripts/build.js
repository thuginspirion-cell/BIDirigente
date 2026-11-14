const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const manifestPath = 'src/manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Manifesto não encontrado:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const eol = manifest.eol === 'crlf' ? '\r\n' : '\n';

console.log('🔨 Compilando', manifest.output, 'a partir de', manifest.parts.length, 'partes modulares...');

const chunks = [];
let jsErrors = 0;

for (const part of manifest.parts) {
  if (part.type === 'literal') {
    chunks.push(part.text);
    continue;
  }
  const content = fs.readFileSync(part.file, 'utf8');
  if (part.type === 'js-inline') {
    try {
      new vm.Script(content, { filename: part.file });
    } catch (err) {
      jsErrors++;
      console.error('❌ Erro de sintaxe no módulo', part.file + ':', err.message);
    }
  }
  chunks.push(content);
}

if (jsErrors > 0) {
  console.error('💥 Build abortado devido a', jsErrors, 'erro(s) de sintaxe JavaScript.');
  process.exit(1);
}

const outputHtml = chunks.join(eol);
fs.writeFileSync(manifest.output, outputHtml, 'utf8');
const bytes = Buffer.byteLength(outputHtml, 'utf8');
console.log('✅ Build gerado:', manifest.output, '(' + (bytes / 1024 / 1024).toFixed(2), 'MB /', bytes.toLocaleString('pt-BR'), 'bytes)');

if (!process.argv.includes('--no-validate')) {
  execSync('node scripts/validate_integrity.js', { stdio: 'inherit' });
}
