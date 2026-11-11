const fs = require('fs');
const path = require('path');

function stripVolatileMeta(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const clone = JSON.parse(JSON.stringify(payload));
  if (clone.meta) {
    delete clone.meta.atualizadoEm;
    delete clone.meta.atualizadoFormatado;
  }
  return clone;
}

function runIfChanged(name, jsonPath, syncFn) {
  let previousRaw = null;
  let previousObj = null;
  if (fs.existsSync(jsonPath)) {
    previousRaw = fs.readFileSync(jsonPath, 'utf8');
    try {
      previousObj = JSON.parse(previousRaw);
    } catch (_) {}
  }

  return syncFn().then((nextPayload) => {
    if (!previousObj) {
      console.log(`[${name}] Primeiro snapshot gravado com sucesso.`);
      return { name, changed: true, ok: true };
    }
    const prevHash = JSON.stringify(stripVolatileMeta(previousObj));
    const nextHash = JSON.stringify(stripVolatileMeta(nextPayload));
    if (prevHash === nextHash) {
      // Restaura arquivo anterior para não gerar commits falsos quando não houve alteração real na planilha
      fs.writeFileSync(jsonPath, previousRaw, 'utf8');
      console.log(`[${name}] Sem alterações reais nos dados em relação à última coleta (${previousObj.meta && previousObj.meta.atualizadoFormatado}). Timestamp preservado.`);
      return { name, changed: false, ok: true };
    }
    console.log(`[${name}] Alterações detectadas no SharePoint! Novo snapshot salvo (${nextPayload.meta && nextPayload.meta.atualizadoFormatado}).`);
    return { name, changed: true, ok: true };
  }).catch((err) => {
    console.error(`[${name}] Erro na coleta SharePoint:`, err && err.message ? err.message : err);
    if (previousRaw && !fs.existsSync(jsonPath)) {
      fs.writeFileSync(jsonPath, previousRaw, 'utf8');
    }
    return { name, changed: false, ok: false, erro: err && err.message ? err.message : String(err) };
  });
}

async function main() {
  const { syncSegreData } = require('./sync_segre');
  const { syncSematData } = require('./sync_semat');
  const { syncSevescData } = require('./sync_sevesc');

  const dataDir = path.join(__dirname, '..', 'data');
  const results = [];

  results.push(await runIfChanged('SEGRE', path.join(dataDir, 'segre_livro_2026.json'), syncSegreData));
  results.push(await runIfChanged('SEMAT', path.join(dataDir, 'semat_livro_2026.json'), syncSematData));
  results.push(await runIfChanged('SEVESC', path.join(dataDir, 'sevesc_livro_2026.json'), syncSevescData));

  console.log('=== RESUMO DA SINCRONIZAÇÃO DE ESPELHOS ===');
  results.forEach(r => console.log(` - ${r.name}: ok=${r.ok}, changed=${r.changed}${r.erro ? ', erro=' + r.erro : ''}`));

  if (results.every(r => !r.ok)) {
    process.exit(1);
  }
}

main();
