const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

async function syncSepesData() {
  console.log('🔄 Iniciando download da planilha SEPES (DEMANDAS SEAPE.xlsx) do SharePoint...');
  const rawUrl = 'https://seesp-my.sharepoint.com/:x:/g/personal/rosineide_gazolla_educacao_sp_gov_br/cQoeOJnO6_6aTpffoLZQ-VZaEgUCZ4107PIc0qdIlEuWeWTsug?download=1';

  const res1 = await fetch(rawUrl, { redirect: 'manual' });
  const loc = res1.headers.get('location');
  const cookies = res1.headers.get('set-cookie');
  if (!loc) throw new Error('Redirect não retornado pelo SharePoint');

  const targetUrl = loc.startsWith('http') ? loc : ('https://seesp-my.sharepoint.com' + loc);
  const res2 = await fetch(targetUrl, {
    headers: {
      'Cookie': cookies || '',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res2.ok) throw new Error('Erro ao baixar arquivo do SharePoint: ' + res2.status);

  const buf = await res2.arrayBuffer();
  console.log(`📦 Arquivo recebido: ${(buf.byteLength / 1024).toFixed(1)} KB`);

  const wb = XLSX.read(Buffer.from(buf), { type: 'buffer' });
  console.log('Abas encontradas:', wb.SheetNames);

  function parseDateXlsx(val) {
    if (!val) return '';
    if (typeof val === 'number' && val >= 30000 && val <= 65000) {
      if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
        const p = XLSX.SSF.parse_date_code(val);
        if (p) return String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
      }
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      return String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + d.getUTCFullYear();
    }
    const str = String(val).trim();
    const m = str.match(/(\d{1,2})[/-](\d{1,2})[/-]?(\d{2,4})?/);
    if (m && m[1] && m[2]) {
      let y = m[3] ? parseInt(m[3], 10) : 2026;
      if (y < 100) y += 2000;
      return String(m[1]).padStart(2, '0') + '/' + String(m[2]).padStart(2, '0') + '/' + y;
    }
    return str;
  }

  // 1. Processar APOSENTADORIA
  const wsApos = wb.Sheets['APOSENTADORIA'];
  const rawApos = wsApos ? XLSX.utils.sheet_to_json(wsApos, { header: 1, defval: '' }) : [];
  const aposentadorias = [];
  rawApos.slice(2).forEach((r, idx) => {
    const nome = String(r[3] || '').trim();
    const sei = String(r[5] || '').trim();
    if (!nome && !sei) return;

    let vigencia = r[2];
    if (typeof vigencia === 'number') {
      vigencia = parseDateXlsx(vigencia);
    } else {
      vigencia = String(vigencia || '').trim();
    }

    const st = String(r[7] || 'EM ANDAMENTO').trim();
    const isConcluido = st.toUpperCase().includes('APÓS') || st.toUpperCase().includes('COMPULSÓRIA') || st.toUpperCase().includes('PUBL');

    aposentadorias.push({
      id: 'APOS-' + (aposentadorias.length + 1),
      dataEntrada: parseDateXlsx(r[1]),
      vigencia: vigencia || '—',
      nome: nome,
      rgCpf: String(r[4] || '—').trim(),
      sei: sei || 'S/N',
      ua: String(r[6] || '—').trim(),
      status: st || 'EM ANDAMENTO',
      concluido: isConcluido
    });
  });

  // 2. Processar DESIGNAÇÕES
  const wsDesig = wb.Sheets['DESIGNAÇÕES'];
  const rawDesig = wsDesig ? XLSX.utils.sheet_to_json(wsDesig, { header: 1, defval: '' }) : [];
  const designacoes = [];
  rawDesig.slice(1).forEach((r, idx) => {
    const nome = String(r[1] || '').trim();
    const sei = String(r[4] || '').trim();
    if (!nome && !sei) return;

    const st = String(r[7] || 'EM ANDAMENTO').trim();
    const isConcluido = st.toUpperCase().includes('FINALIZADO') || st.toUpperCase().includes('CONCLU');

    designacoes.push({
      id: 'DESIG-' + (designacoes.length + 1),
      dataEntrada: parseDateXlsx(r[0]),
      nome: nome,
      rgCin: String(r[2] || '—').trim(),
      ue: String(r[3] || '—').trim(),
      sei: sei || 'S/N',
      funcao: String(r[5] || 'DOCENTE').trim(),
      publicacao: parseDateXlsx(r[6]),
      status: st || 'EM ANDAMENTO',
      concluido: isConcluido
    });
  });

  // 3. Processar ABONO DE PERMANÊNCIA
  const wsAbono = wb.Sheets['ABONO DE PERMANÊNCIA'];
  const rawAbono = wsAbono ? XLSX.utils.sheet_to_json(wsAbono, { header: 1, defval: '' }) : [];
  const abonos = [];
  rawAbono.slice(1).forEach((r, idx) => {
    const nome = String(r[1] || '').trim();
    const sei = String(r[4] || '').trim();
    if (!nome && !sei) return;

    const st = String(r[6] || 'EM ANDAMENTO').trim();
    const isConcluido = st.toUpperCase().includes('PUBLICADO') || st.toUpperCase().includes('ATENDIDO') || st.toUpperCase().includes('CONCLU');

    abonos.push({
      id: 'ABONO-' + (abonos.length + 1),
      dataEntrada: parseDateXlsx(r[0]),
      nome: nome,
      rgCin: String(r[2] || '—').trim(),
      ue: String(r[3] || '—').trim(),
      sei: sei || 'S/N',
      publicacao: parseDateXlsx(r[5]),
      status: st || 'EM ANDAMENTO',
      concluido: isConcluido
    });
  });

  const totalDemandas = aposentadorias.length + designacoes.length + abonos.length;
  const concluidosCount = aposentadorias.filter(x => x.concluido).length +
                          designacoes.filter(x => x.concluido).length +
                          abonos.filter(x => x.concluido).length;
  const emTramitacaoCount = totalDemandas - concluidosCount;

  console.log('📊 SEPES (SEAPE) Processado:');
  console.log(`  - Aposentadorias: ${aposentadorias.length}`);
  console.log(`  - Designações: ${designacoes.length}`);
  console.log(`  - Abonos de Permanência: ${abonos.length}`);
  console.log(`  - Total Geral Consolidado: ${totalDemandas}`);
  console.log(`  - Concluídos / Publicados: ${concluidosCount}`);
  console.log(`  - Em Análise / Tramitação: ${emTramitacaoCount}`);

  const outputPayload = {
    sucesso: true,
    meta: {
      nomeArquivo: 'DEMANDAS SEAPE.xlsx',
      setor: 'SEPES - Serviço de Pessoas (Gestão de Recursos Humanos)',
      contaResponsavel: 'rosineide_gazolla_educacao_sp_gov_br',
      sharepointUrl: 'https://seesp-my.sharepoint.com/:x:/g/personal/rosineide_gazolla_educacao_sp_gov_br/cQoeOJnO6_6aTpffoLZQ-VZaEgUCZ4107PIc0qdIlEuWeWTsug',
      atualizadoEm: new Date().toISOString(),
      atualizadoFormatado: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      tamanhoArquivoKb: (buf.byteLength / 1024).toFixed(1)
    },
    kpis: {
      totalDemandas: totalDemandas,
      totalAposentadorias: aposentadorias.length,
      totalDesignacoes: designacoes.length,
      totalAbonos: abonos.length,
      totalFinalizados: concluidosCount,
      totalEmTramitacao: emTramitacaoCount
    },
    aposentadorias: aposentadorias,
    designacoes: designacoes,
    abonos: abonos
  };

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const outPath = path.join(dataDir, 'sepes_demandas_2026.json');
  fs.writeFileSync(outPath, JSON.stringify(outputPayload, null, 2), 'utf8');
  console.log(`💾 JSON salvo com sucesso em: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

  return outputPayload;
}

if (require.main === module) {
  syncSepesData().catch(e => {
    console.error('❌ Erro no syncSepesData:', e);
    process.exit(1);
  });
}

module.exports = { syncSepesData };
