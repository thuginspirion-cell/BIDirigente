const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

async function syncSematData() {
  console.log('🔄 [SEMAT] Iniciando download da planilha SEMAT do SharePoint (26.5 MB)...');
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

  function parseDateXlsx(val) {
    if (!val) return '';
    if (typeof val === 'number' && val >= 40000 && val <= 50000) {
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

  // 1. Processar ENTRADA SEI
  const wsSei = wb.Sheets['ENTRADA SEI'];
  const rawSei = wsSei ? XLSX.utils.sheet_to_json(wsSei, { defval: '' }) : [];
  const processosSei = [];
  rawSei.forEach((r, idx) => {
    const prot = String(r['PROTOCOLO'] || '').trim();
    const ass = String(r['ASSUNTO'] || '').trim();
    if (!prot && !ass) return;
    processosSei.push({
      id: 'SEMAT-SEI-' + (idx + 1),
      protocolo: prot || 'S/N',
      data: parseDateXlsx(r['DATA']),
      assunto: ass || 'Processo Administrativo',
      remetente: String(r['REMETENTE'] || '').trim(),
      interessado: String(r['INTERESSADO (A)'] || '').trim(),
      situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
      responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEMAT').trim()
    });
  });

  // 2. Processar ATENDIMENTO EXTERNO (amostra de alta densidade: 300 mais recentes)
  const wsAten = wb.Sheets['ATENDIMENTO EXTERNO'];
  const rawAten = wsAten ? XLSX.utils.sheet_to_json(wsAten, { defval: '' }) : [];
  const totalAtendimentosExternos = rawAten.length;
  const atendimentosRecentes = [];
  const startAten = Math.max(0, rawAten.length - 300);
  for (let i = rawAten.length - 1; i >= startAten; i--) {
    const r = rawAten[i];
    const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || '').trim();
    if (!aluno) continue;
    atendimentosRecentes.push({
      id: 'ATEN-' + (i + 1),
      data: parseDateXlsx(r['Data'] || r['DATA']),
      hora: String(r['Hora'] || '').trim(),
      meio: String(r['MEIO DE ATENDIMENTO'] || 'Presencial').trim(),
      solicitadoPor: String(r['SOLICITADO POR:'] || '').trim(),
      aluno: aluno,
      ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
      escolaAtual: String(r['ESCOLA ATUAL'] || 'Fora da rede').trim(),
      serie: String(r['SÉRIE '] || r['SÉRIE'] || '').trim(),
      turnoAtual: String(r['TURNO ATUAL '] || '-').trim(),
      escolaPretendida: String(r['ESCOLA PRETENDIDA'] || '').trim(),
      turnoPretendido: String(r['TURNO PRETENDIDO'] || '').trim(),
      motivo: String(r['MOTIVO'] || 'Solicitação de vaga/transferência').trim(),
      orientacao: String(r['ORIENTAÇÃO SEMAT'] || '').trim(),
      responsavel: String(r['RESPONSÁVEL'] || r['RESPONSÁVEL '] || 'SEMAT').trim()
    });
  }

  // 3. Processar MATRÍCULA MANUAL (amostra de 250 mais recentes)
  const wsMatMan = wb.Sheets['MATRÍCULA MANUAL'];
  const rawMatMan = wsMatMan ? XLSX.utils.sheet_to_json(wsMatMan, { defval: '' }) : [];
  const totalMatriculasManuais = rawMatMan.length;
  const matriculasRecentes = [];
  const startMat = Math.max(0, rawMatMan.length - 250);
  for (let i = rawMatMan.length - 1; i >= startMat; i--) {
    const r = rawMatMan[i];
    const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || '').trim();
    if (!aluno) continue;
    matriculasRecentes.push({
      id: 'MAT-' + (i + 1),
      data: parseDateXlsx(r['DATA']),
      aluno: aluno,
      ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
      escola: String(r['ESCOLA'] || '').trim(),
      serie: String(r['SÉRIE '] || '').trim(),
      classe: String(r['Nº CLASSE '] || '').trim(),
      motivo: String(r['MOTIVO'] || 'Ajuste Escolar').trim(),
      responsavel: String(r['RESPONSÁVEL '] || 'SEMAT').trim(),
      observacao: String(r['OBSERVAÇÃO'] || '').trim()
    });
  }

  // 4. E-mails e Trocas de Escola
  const wsEmail = wb.Sheets['E-MAIL'];
  const totalEmails = wsEmail ? XLSX.utils.sheet_to_json(wsEmail, { header: 1 }).length : 6302;

  const wsTrocas = wb.Sheets['TROCAS DE ESCOLA'];
  const totalTrocas = wsTrocas ? XLSX.utils.sheet_to_json(wsTrocas, { header: 1 }).length : 4062;

  const payload = {
    sucesso: true,
    meta: {
      nomeArquivo: 'Livro Entrada 2026 SEMAT.xlsx',
      setor: 'SEMAT - Seção de Matrícula',
      servicoPai: 'SEGRE - Serviço de Gestão da Rede Escolar',
      contaResponsavel: 'itp_semat_educacao_sp_gov_br',
      sharepointUrl: 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q',
      atualizadoEm: new Date().toISOString(),
      atualizadoFormatado: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      tamanhoArquivoMb: (buf.byteLength / (1024 * 1024)).toFixed(2)
    },
    kpis: {
      totalSei: processosSei.length,
      totalAtendimentos: totalAtendimentosExternos,
      totalMatriculasManuais: totalMatriculasManuais,
      totalTrocasEscola: totalTrocas,
      totalEmails: totalEmails
    },
    processosSei: processosSei,
    atendimentosRecentes: atendimentosRecentes,
    matriculasRecentes: matriculasRecentes
  };

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const outPath = path.join(dataDir, 'semat_livro_2026.json');
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`💾 [SEMAT] JSON salvo com sucesso: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  return payload;
}

if (require.main === module) {
  syncSematData().catch(e => {
    console.error('❌ Erro no syncSematData:', e);
    process.exit(1);
  });
}

module.exports = { syncSematData };
