const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

async function syncSharepointData() {
  console.log('🔄 Iniciando sincronização da planilha SEINTEC do SharePoint...');

  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const dictMatch = html.match(/DICIONARIO_OFICIAL_INVENTARIO\s*=\s*(\{[\s\S]*?\n\s*\});/);
  const dict = dictMatch ? eval('(' + dictMatch[1] + ')') : {};

  const sharepointUrl = 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_seintec_educacao_sp_gov_br/cQq57JtcgOx0TYN_WRWdCyPLEgUCWtCBVpIXsMYmQoivNUmH6w?download=1';
  
  const res1 = await fetch(sharepointUrl, { redirect: 'manual' });
  const loc = res1.headers.get('location');
  const cookies = res1.headers.get('set-cookie');
  if (!loc) {
    throw new Error('Falha no handshake inicial do SharePoint: redirect Location não retornado');
  }

  const targetUrl = 'https://seesp-my.sharepoint.com' + loc;
  const res2 = await fetch(targetUrl, {
    headers: {
      'Cookie': cookies || '',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res2.ok) {
    throw new Error('Erro HTTP ao baixar arquivo do SharePoint: ' + res2.status);
  }

  const buf = await res2.arrayBuffer();
  const wb = XLSX.read(Buffer.from(buf), { type: 'buffer' });
  const ws = wb.Sheets['Calls'];
  if (!ws) {
    throw new Error('Aba Calls não encontrada na planilha do SharePoint');
  }

  const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`📊 Total de linhas brutas na planilha Calls: ${rawRows.length}`);

  function parsearDataXlsx(valCandidate) {
    if (!valCandidate) return null;
    if (typeof valCandidate === 'number' && valCandidate >= 40000 && valCandidate <= 50000) {
      if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
        const p = XLSX.SSF.parse_date_code(valCandidate);
        if (p && p.y >= 2026) {
          return {
            ano: p.y,
            mes: p.m,
            dia: p.d,
            dtStr: String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y
          };
        }
      }
      var d = new Date(Math.round((valCandidate - 25569) * 86400 * 1000));
      // Corrige offset de timezone UTC vs Brasil
      var utcYear = d.getUTCFullYear();
      var utcMonth = d.getUTCMonth() + 1;
      var utcDay = d.getUTCDate();
      if (utcYear >= 2026) {
        return {
          ano: utcYear,
          mes: utcMonth,
          dia: utcDay,
          dtStr: String(utcDay).padStart(2, '0') + '/' + String(utcMonth).padStart(2, '0') + '/' + utcYear
        };
      }
    } else {
      var strCandidate = String(valCandidate).trim();
      var m = strCandidate.match(/(\d{1,2})[/-](\d{1,2})[/-]?(\d{2,4})?/);
      if (m && m[1] && m[2]) {
        var y = m[3] ? parseInt(m[3], 10) : 2026;
        if (y < 100) y += 2000;
        if (y < 2026) y = 2026;
        var dia = parseInt(m[1], 10);
        var mes = parseInt(m[2], 10);
        return {
          ano: y,
          mes: mes,
          dia: dia,
          dtStr: String(dia).padStart(2, '0') + '/' + String(mes).padStart(2, '0') + '/' + y
        };
      }
    }
    return null;
  }

  function formatarNomeEscola(nome) {
    if (!nome) return '';
    return String(nome).trim()
      .replace(/^E\.?E\.?\s*/i, '')
      .replace(/^PEI\s*/i, '')
      .trim();
  }

  const chamados2026 = [];

  rawRows.forEach((r, idx) => {
    var candidatesAbertura = [
      r['Data de Abertura'],
      r['Data Abertura'],
      r['Data do Chamado'],
      r['Data de Solicitação'],
      r['Carimbo de data/hora'],
      r['Hora de início'],
      r['10.Data de Inicio do Problema ']
    ];
    var candidatesVisita = [
      r['Data de Atendimento'],
      r['Data Atendimento'],
      r['Data Visita'],
      r['Hora de conclusão']
    ];

    var bestDateAbertura = null;
    for (var c = 0; c < candidatesAbertura.length; c++) {
      bestDateAbertura = parsearDataXlsx(candidatesAbertura[c]);
      if (bestDateAbertura) break;
    }

    var bestDateVisita = null;
    for (var v = 0; v < candidatesVisita.length; v++) {
      bestDateVisita = parsearDataXlsx(candidatesVisita[v]);
      if (bestDateVisita) break;
    }

    var dataFinalObj = bestDateAbertura || bestDateVisita;
    if (!dataFinalObj || dataFinalObj.ano < 2026) return;

    var dtStr = dataFinalObj.dtStr;

    var dtVisitaStr = '';
    if (bestDateVisita) {
      dtVisitaStr = bestDateVisita.dtStr;
    } else if (r['Data Visita'] || r['Data Atendimento']) {
      dtVisitaStr = String(r['Data Visita'] || r['Data Atendimento']).trim();
    }

    const relato = String(r['11.Relato do problema ou solicitação:'] || r['Relato'] || r['Demanda'] || '').trim();
    const rawCie = String(r['3.CODIGO CIE'] || '').trim().replace(/[^0-9]/g, '');
    const ciePad = rawCie ? rawCie.padStart(6, '0') : '';

    let nomeFinal = '';
    if (ciePad && dict[ciePad]) {
      nomeFinal = dict[ciePad].nomeOficial || dict[ciePad].nomeFormatado;
    } else if (rawCie && dict[rawCie]) {
      nomeFinal = dict[rawCie].nomeOficial || dict[rawCie].nomeFormatado;
    } else {
      nomeFinal = formatarNomeEscola(String(r['2. Escola'] || ''));
    }

    let status = 'Pendente';
    const stRaw = String(r['Status do chamado'] || r['Status'] || '').toLowerCase();
    const sol = String(r['Solução'] || '').toLowerCase();
    const fech = String(r['Fechamento'] || r['Fechamaento'] || '').toLowerCase();

    if (stRaw.includes('concl') || stRaw.includes('fech') || stRaw.includes('resolv') || fech.includes('concl') || fech.includes('resolv') || (sol && !stRaw.includes('aberto'))) {
      status = 'Concluído';
    } else if (stRaw.includes('atend') || stRaw.includes('fde') || stRaw.includes('andamento') || stRaw.includes('aberto')) {
      status = 'Em Atendimento (FDE)';
    }

    let tipo = 'Equipamentos e Tablets';
    const tipoRaw = String(r['1. Tipo de Ocorrência '] || r['Tipo'] || '').toLowerCase();

    if (tipoRaw.includes('net') || tipoRaw.includes('inter') || /wifi|wi-fi|fibra|link/i.test(relato)) {
      tipo = 'Internet / Conectividade';
    } else if (tipoRaw.includes('telef') || tipoRaw.includes('fone') || /linha|ramal|ligação|telefone/i.test(relato)) {
      tipo = 'Telefonia';
    }

    chamados2026.push({
      id: 'CALL-' + (idx + 1),
      data: dtStr,
      dataAtendimento: dtVisitaStr || dtStr,
      escola: nomeFinal,
      cie: ciePad,
      tipo: tipo,
      relato: relato || 'Atendimento técnico registrado pela unidade escolar.',
      status: status,
      solicitante: String(r['5.Nome do Solicitante'] || r['Técnico'] || r['Nome'] || 'Gestão da Unidade Escolar').trim(),
      telefone: String(r['6.1º Telefone Fixo da UE'] || r['8.Celular do Solicitante'] || '(11) 2658-8000').trim(),
      municipio: String(r['Município'] || r['Cidade'] || '').trim()
    });
  });

  chamados2026.sort((a, b) => {
    var idA = parseInt(String(a.id || '').replace('CALL-', ''), 10) || 0;
    var idB = parseInt(String(b.id || '').replace('CALL-', ''), 10) || 0;
    return idB - idA;
  });

  console.log(`✅ Atendimentos de 2026 processados: ${chamados2026.length}`);

  const outputPayload = {
    sucesso: true,
    total: chamados2026.length,
    atualizadoEm: new Date().toISOString(),
    atualizadoFormatado: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    registros: chamados2026
  };

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outPath = path.join(dataDir, 'seintec_calls_2026.json');
  fs.writeFileSync(outPath, JSON.stringify(outputPayload, null, 2), 'utf8');
  console.log(`💾 Arquivo salvo com sucesso em: ${outPath}`);

  return outputPayload;
}

if (require.main === module) {
  syncSharepointData().catch(err => {
    console.error('❌ Erro na sincronização:', err);
    process.exit(1);
  });
}

module.exports = { syncSharepointData };
