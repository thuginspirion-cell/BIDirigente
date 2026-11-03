const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const MESES_NOMES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

async function syncSematData() {
  console.log('🔄 [SEMAT] Iniciando download e tratamento completo da planilha SEMAT (26.5 MB)...');
  const rawUrl = 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q?download=1';
  
  const res1 = await fetch(rawUrl, { redirect: 'manual' });
  const loc = res1.headers.get('location');
  const cookies = res1.headers.get('set-cookie');
  if (!loc) throw new Error('Redirect não retornado pelo SharePoint para SEMAT');
  
  const targetUrl = loc.startsWith('http') ? loc : ('https://seesp-my.sharepoint.com' + loc);
  const res2 = await fetch(targetUrl, {
    headers: {
      'Cookie': cookies || '',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res2.ok) throw new Error('Erro ao baixar arquivo SEMAT do SharePoint: ' + res2.status);
  
  const buf = await res2.arrayBuffer();
  console.log(`📦 [SEMAT] Arquivo baixado: ${(buf.byteLength / (1024 * 1024)).toFixed(2)} MB`);

  const wb = XLSX.read(Buffer.from(buf), { type: 'buffer' });

  function parseDateXlsx(val, fallbackDate) {
    if (typeof val === 'number' && val >= 40000 && val <= 50000) {
      if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
        const p = XLSX.SSF.parse_date_code(val);
        if (p) {
          const dStr = String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
          return { str: dStr, mesNum: p.m, mesNome: MESES_NOMES[p.m] || 'Janeiro', timestamp: new Date(p.y, p.m - 1, p.d).getTime() };
        }
      }
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      const m = d.getUTCMonth() + 1;
      const dStr = String(d.getUTCDate()).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + d.getUTCFullYear();
      return { str: dStr, mesNum: m, mesNome: MESES_NOMES[m] || 'Janeiro', timestamp: d.getTime() };
    }
    if (val) {
      const str = String(val).trim();
      const m = str.match(/(\d{1,2})[/-](\d{1,2})[/-]?(\d{2,4})?/);
      if (m && m[1] && m[2]) {
        let y = m[3] ? parseInt(m[3], 10) : 2026;
        if (y < 100) y += 2000;
        const dia = parseInt(m[1], 10);
        const mes = parseInt(m[2], 10);
        const dStr = String(dia).padStart(2, '0') + '/' + String(mes).padStart(2, '0') + '/' + y;
        return { str: dStr, mesNum: mes, mesNome: MESES_NOMES[mes] || 'Janeiro', timestamp: new Date(y, mes - 1, dia).getTime() };
      }
    }
    // Fallback inteligente
    const fb = fallbackDate || { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
    return fb;
  }

  // 1. Processar ENTRADA SEI (Todos os registros)
  const wsSei = wb.Sheets['ENTRADA SEI'];
  const rawSei = wsSei ? XLSX.utils.sheet_to_json(wsSei, { defval: '' }) : [];
  const processosSei = [];
  let prevDateSei = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };

  rawSei.forEach((r, idx) => {
    const prot = String(r['PROTOCOLO'] || '').trim();
    const ass = String(r['ASSUNTO'] || '').trim();
    if (!prot && !ass) return;
    const rawD = r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : r['Data'];
    const dtObj = parseDateXlsx(rawD, prevDateSei);
    if (rawD) prevDateSei = dtObj;

    processosSei.push({
      id: 'SEMAT-SEI-' + (idx + 1),
      protocolo: prot || 'S/N',
      data: dtObj.str,
      mesNum: dtObj.mesNum,
      mesNome: dtObj.mesNome,
      timestamp: dtObj.timestamp,
      assunto: ass || 'Processo Administrativo',
      remetente: String(r['REMETENTE'] || '').trim(),
      interessado: String(r['INTERESSADO (A)'] || '').trim(),
      situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
      responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEMAT').trim()
    });
  });

  // 2. Processar ATENDIMENTO EXTERNO (Base Completa de Janeiro a Novembro)
  const wsAten = wb.Sheets['ATENDIMENTO EXTERNO'];
  const rawAten = wsAten ? XLSX.utils.sheet_to_json(wsAten, { defval: '' }) : [];
  const atendimentos = [];
  let prevDateAten = { str: '05/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 5).getTime() };
  const contagemPorMesAten = {};

  rawAten.forEach((r, idx) => {
    const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || '').trim();
    if (!aluno) return;

    const rawD = r['Data'] !== undefined && r['Data'] !== '' ? r['Data'] : r['DATA'];
    const dtObj = parseDateXlsx(rawD, prevDateAten);
    if (rawD) prevDateAten = dtObj;

    contagemPorMesAten[dtObj.mesNum] = (contagemPorMesAten[dtObj.mesNum] || 0) + 1;

    atendimentos.push({
      id: 'ATEN-' + (idx + 1),
      data: dtObj.str,
      mesNum: dtObj.mesNum,
      mesNome: dtObj.mesNome,
      timestamp: dtObj.timestamp,
      hora: String(r['Hora'] || '').trim(),
      meio: String(r['MEIO DE ATENDIMENTO'] || 'Presencial').trim(),
      solicitadoPor: String(r['SOLICITADO POR:'] || 'Responsável').trim(),
      aluno: aluno,
      ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
      escolaAtual: String(r['ESCOLA ATUAL'] || 'Fora da rede').trim(),
      serie: String(r['SÉRIE '] || r['SÉRIE'] || '').trim(),
      turnoAtual: String(r['TURNO ATUAL '] || '-').trim(),
      escolaPretendida: String(r['ESCOLA PRETENDIDA'] || 'Não especificada').trim(),
      turnoPretendido: String(r['TURNO PRETENDIDO'] || '-').trim(),
      motivo: String(r['MOTIVO'] || 'Solicitação de vaga/transferência').trim(),
      orientacao: String(r['ORIENTAÇÃO SEMAT'] || '').trim(),
      responsavel: String(r['RESPONSÁVEL'] || r['RESPONSÁVEL '] || 'SEMAT').trim()
    });
  });

  // 3. Processar MATRÍCULA MANUAL (Base Completa de Janeiro a Novembro)
  const wsMatMan = wb.Sheets['MATRÍCULA MANUAL'];
  const rawMatMan = wsMatMan ? XLSX.utils.sheet_to_json(wsMatMan, { defval: '' }) : [];
  const matriculas = [];
  let prevDateMat = { str: '06/01/2026', mesNum: 1, mesNome: 'Janeiro', timestamp: new Date(2026, 0, 6).getTime() };
  const contagemPorMesMat = {};

  rawMatMan.forEach((r, idx) => {
    const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || '').trim();
    if (!aluno) return;

    const rawD = r['DATA'] !== undefined && r['DATA'] !== '' ? r['DATA'] : r['Data'];
    const dtObj = parseDateXlsx(rawD, prevDateMat);
    if (rawD) prevDateMat = dtObj;

    contagemPorMesMat[dtObj.mesNum] = (contagemPorMesMat[dtObj.mesNum] || 0) + 1;

    matriculas.push({
      id: 'MAT-' + (idx + 1),
      data: dtObj.str,
      mesNum: dtObj.mesNum,
      mesNome: dtObj.mesNome,
      timestamp: dtObj.timestamp,
      aluno: aluno,
      ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
      escola: String(r['ESCOLA'] || '').trim(),
      serie: String(r['SÉRIE '] || '').trim(),
      classe: String(r['Nº CLASSE '] || '').trim(),
      motivo: String(r['MOTIVO'] || 'Ajuste Escolar').trim(),
      responsavel: String(r['RESPONSÁVEL '] || 'SEMAT').trim(),
      observacao: String(r['OBSERVAÇÃO'] || '').trim()
    });
  });

  // 4. Totais e Metadados
  const wsEmail = wb.Sheets['E-MAIL'];
  const totalEmails = wsEmail ? XLSX.utils.sheet_to_json(wsEmail, { header: 1 }).length : 6302;
  const wsTrocas = wb.Sheets['TROCAS DE ESCOLA'];
  const totalTrocas = wsTrocas ? XLSX.utils.sheet_to_json(wsTrocas, { header: 1 }).length : 4062;

  const payload = {
    sucesso: true,
    meta: {
      nomeArquivo: 'Livro Entrada 2026 SEMAT.xlsx',
      setor: 'SEMAT - Seção de Matrícula',
      servicoPai: 'Serviço de Gestão da Rede Escolar (SEGRE)',
      contaResponsavel: 'itp_semat_educacao_sp_gov_br',
      sharepointUrl: 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q',
      atualizadoEm: new Date().toISOString(),
      atualizadoFormatado: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      tamanhoArquivoMb: (buf.byteLength / (1024 * 1024)).toFixed(2)
    },
    kpis: {
      totalSei: processosSei.length,
      totalAtendimentos: atendimentos.length,
      totalMatriculasManuais: matriculas.length,
      totalTrocasEscola: totalTrocas,
      totalEmails: totalEmails,
      mesesAtendimentos: contagemPorMesAten,
      mesesMatriculas: contagemPorMesMat
    },
    processosSei: processosSei,
    atendimentos: atendimentos,
    matriculas: matriculas
  };

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const outPath = path.join(dataDir, 'semat_livro_2026.json');
  fs.writeFileSync(outPath, JSON.stringify(payload), 'utf8');
  console.log(`💾 [SEMAT] JSON completo salvo: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  console.log('📊 Resumo Mensal Atendimentos SEMAT:', contagemPorMesAten);
  console.log('📊 Resumo Mensal Matrículas SEMAT:', contagemPorMesMat);
  return payload;
}

if (require.main === module) {
  syncSematData().catch(e => {
    console.error('❌ Erro no syncSematData:', e);
    process.exit(1);
  });
}

module.exports = { syncSematData };
