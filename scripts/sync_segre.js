const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

async function syncSegreData() {
  console.log('🔄 Iniciando download da planilha SEGRE do SharePoint (68 MB)...');
  const rawUrl = 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw?download=1';
  
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
  console.log(`📦 Arquivo baixado: ${(buf.byteLength / (1024 * 1024)).toFixed(2)} MB`);

  const wb = XLSX.read(Buffer.from(buf), { type: 'buffer' });
  console.log('Abas encontradas:', wb.SheetNames);

  function parseHoraXlsx(val) {
    if (!val || val === '-') return '';
    if (typeof val === 'number') {
      const totalSec = Math.round(val * 86400);
      const h = Math.floor(totalSec / 3600);
      const min = Math.floor((totalSec % 3600) / 60);
      return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
    }
    return String(val).trim();
  }

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
      id: 'SEI-' + (idx + 1),
      protocolo: prot || 'S/N',
      data: parseDateXlsx(r['DATA']),
      assunto: ass || 'Processo Administrativo',
      remetente: String(r['REMETENTE'] || '').trim(),
      interessado: String(r['INTERESSADO (A)'] || '').trim(),
      situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
      responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEGRE').trim()
    });
  });

  // 2. Processar ATENDIMENTO VAGA
  const wsVaga = wb.Sheets['ATENDIMENTO VAGA'];
  const rawVaga = wsVaga ? XLSX.utils.sheet_to_json(wsVaga, { defval: '' }) : [];
  const atendimentosVaga = [];
  rawVaga.forEach((r, idx) => {
    const aluno = String(r['NOME COMPLETO DO ALUNO '] || r['NOME COMPLETO DO ALUNO'] || '').trim();
    const escolaAtual = String(r['ESCOLA ATUAL'] || '').trim();
    const escolaPret = String(r['ESCOLA PRETENDIDA'] || '').trim();
    if (!aluno && !escolaAtual && !escolaPret) return;
    atendimentosVaga.push({
      id: 'VAGA-' + (idx + 1),
      data: parseDateXlsx(r['Data'] || r['DATA']),
      aluno: aluno || 'Aluno',
      ra: String(r['RA'] || '').trim() + (r['DG'] !== undefined && r['DG'] !== '' ? ('-' + r['DG']) : ''),
      escolaAtual: escolaAtual || 'Rede / Fora',
      serie: String(r['SÉRIE '] || r['SÉRIE'] || '').trim(),
      escolaPretendida: escolaPret || 'Não especificada',
      motivo: String(r['MOTIVO'] || 'Solicitação de vaga/transferência').trim(),
      orientacao: String(r['ORIENTAÇÃO '] || r['ORIENTAÇÃO'] || '').trim(),
      meio: String(r['MEIO DE ATENDIMENTO'] || 'Presencial').trim(),
      responsavel: String(r['RESPONSÁVEL'] || r['RESPONSÁVEL '] || 'SEGRE').trim()
    });
  });

  // 3. Processar OUVIDORIA
  const wsOuv = wb.Sheets['OUVIDORIA'];
  const rawOuv = wsOuv ? XLSX.utils.sheet_to_json(wsOuv, { defval: '' }) : [];
  const ouvidorias = [];
  rawOuv.forEach((r, idx) => {
    const prot = String(r['PROTOCOLO'] || '').trim();
    const ass = String(r['ASSUNTO'] || '').trim();
    if (!prot && !ass) return;
    ouvidorias.push({
      id: 'OUV-' + (idx + 1),
      protocolo: prot,
      data: parseDateXlsx(r['ENTRADA'] || r['DATA']),
      assunto: ass,
      interessado: String(r['INTERESSADO (A)'] || '').trim(),
      situacao: String(r['SITUAÇÃO ATUAL'] || 'EM ANDAMENTO').trim().toUpperCase(),
      responsavel: String(r['RESPONSÁVEL '] || 'VAGA / SEGRE').trim()
    });
  });

  // 4. Processar CONCLUINTES (amostra dos 200 mais recentes para visualização imediata)
  const wsConc = wb.Sheets['CONCLUINTES'];
  const rawConc = wsConc ? XLSX.utils.sheet_to_json(wsConc, { defval: '' }) : [];
  const concluintesTotal = rawConc.length;
  const concluintesRecentes = [];
  const startIdx = Math.max(0, rawConc.length - 250);
  for (let i = rawConc.length - 1; i >= startIdx; i--) {
    const r = rawConc[i];
    const aluno = String(r['ALUNO '] || r['ALUNO'] || '').trim();
    const esc = String(r['ESCOLA '] || r['ESCOLA'] || '').trim();
    if (aluno || esc) {
      concluintesRecentes.push({
        id: 'CONC-' + (i + 1),
        data: parseDateXlsx(r['DATA '] || r['DATA']),
        escola: esc,
        aluno: aluno,
        anoConclusao: r['ANO '] || r['ANO'] || 2026,
        tipoEnsino: String(r['TIPO ENSINO'] || 'EM').trim(),
        responsavel: String(r['RESPONSÁVEL '] || 'SEGRE').trim()
      });
    }
  }

  // 5. Processar E-MAIL
  const wsEmail = wb.Sheets['E-MAIL'];
  const rawEmail = wsEmail ? XLSX.utils.sheet_to_json(wsEmail, { defval: '' }) : [];
  const emails = [];
  rawEmail.forEach((r, idx) => {
    const assunto = String(r['ASSUNTO'] || '').trim();
    const remetente = String(r['REMETENTE'] || '').trim();
    const interessado = String(r['INTERESSADO (A)'] || '').trim();
    if (!assunto && !remetente && !interessado) return;
    emails.push({
      id: 'EML-' + (idx + 1),
      data: parseDateXlsx(r['DATA']),
      hora: parseHoraXlsx(r['HORA']),
      assunto: assunto || 'E-mail / Demanda',
      remetente: remetente || 'Não informado',
      interessado: interessado || 'SEGRE',
      situacao: String(r['SITUAÇÃO ATUAL'] || 'REGISTRADO').trim().toUpperCase(),
      dataConclusao: parseDateXlsx(r['DATA_1']),
      horaConclusao: parseHoraXlsx(r['HORA_1']),
      responsavel: String(r['RESPONSÁVEL '] || r['RESPONSÁVEL'] || 'SEGRE').trim()
    });
  });
  const totalEmails = emails.length;

  console.log(`📊 SEGRE Processado:`);
  console.log(`  - Processos SEI: ${processosSei.length}`);
  console.log(`  - Atendimentos de Vagas: ${atendimentosVaga.length}`);
  console.log(`  - Ouvidoria: ${ouvidorias.length}`);
  console.log(`  - Total Concluintes: ${concluintesTotal}`);
  console.log(`  - Total E-mails Registrados: ${totalEmails}`);

  const outputPayload = {
    sucesso: true,
    meta: {
      nomeArquivo: 'Livro Entrada 2026 SEGRE.xlsx',
      setor: 'SEGRE - Gestão da Rede Escolar e Matrícula',
      contaResponsavel: 'itp_segre_educacao_sp_gov_br',
      sharepointUrl: 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw',
      atualizadoEm: new Date().toISOString(),
      atualizadoFormatado: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      tamanhoArquivoMb: (buf.byteLength / (1024 * 1024)).toFixed(2)
    },
    kpis: {
      totalSei: processosSei.length,
      totalVagas: atendimentosVaga.length,
      totalOuvidoria: ouvidorias.length,
      totalConcluintes: concluintesTotal,
      totalEmails: totalEmails
    },
    processosSei: processosSei,
    atendimentosVaga: atendimentosVaga,
    ouvidorias: ouvidorias,
    concluintesRecentes: concluintesRecentes,
    emails: emails
  };

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const outPath = path.join(dataDir, 'segre_livro_2026.json');
  fs.writeFileSync(outPath, JSON.stringify(outputPayload, null, 2), 'utf8');
  console.log(`💾 JSON salvo com sucesso em: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

  return outputPayload;
}

if (require.main === module) {
  syncSegreData().catch(e => {
    console.error('❌ Erro no syncSegre:', e);
    process.exit(1);
  });
}

module.exports = { syncSegreData };
