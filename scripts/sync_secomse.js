const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const MESES_NOMES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

async function syncSecomseData() {
  console.log('🔄 [SECOMSE] Iniciando download e sincronização oficial do SharePoint...');
  const rawUrl = 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?download=1';

  let buf;
  try {
    const res1 = await fetch(rawUrl, { redirect: 'manual' });
    const loc = res1.headers.get('location');
    const cookies = res1.headers.get('set-cookie');
    if (!loc) throw new Error('Redirect não retornado pelo SharePoint para SECOMSE');

    const targetUrl = loc.startsWith('http') ? loc : ('https://seesp-my.sharepoint.com' + loc);
    const res2 = await fetch(targetUrl, {
      headers: {
        'Cookie': cookies || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res2.ok) throw new Error('Erro ao baixar arquivo SECOMSE do SharePoint: ' + res2.status);
    const arrayBuf = await res2.arrayBuffer();
    buf = Buffer.from(arrayBuf);
    console.log(`📦 [SECOMSE] Arquivo baixado com sucesso: ${(buf.byteLength / 1024).toFixed(2)} KB`);
  } catch (errNet) {
    console.warn(`⚠️ [SECOMSE] Falha no download direto (${errNet.message}). Verificando fallback local...`);
    const localFallback = path.join(__dirname, '..', 'scratch', 'secomse.xlsx');
    if (fs.existsSync(localFallback)) {
      buf = fs.readFileSync(localFallback);
      console.log(`📦 [SECOMSE] Utilizando fallback de arquivo em disco: ${(buf.byteLength / 1024).toFixed(2)} KB`);
    } else {
      throw errNet;
    }
  }

  const wb = XLSX.read(buf, { type: 'buffer' });

  function parseDateXlsx(val) {
    if (typeof val === 'number' && val >= 40000 && val <= 50000) {
      if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
        const p = XLSX.SSF.parse_date_code(val);
        if (p) {
          const dStr = String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
          return { str: dStr, mesNum: p.m, mesNome: MESES_NOMES[p.m] || '', ano: p.y, timestamp: new Date(p.y, p.m - 1, p.d).getTime() };
        }
      }
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      const y = d.getUTCFullYear();
      const m = d.getUTCMonth() + 1;
      const dStr = String(d.getUTCDate()).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + y;
      return { str: dStr, mesNum: m, mesNome: MESES_NOMES[m] || '', ano: y, timestamp: new Date(y, m - 1, d.getUTCDate()).getTime() };
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
        return { str: dStr, mesNum: mes, mesNome: MESES_NOMES[mes] || '', ano: y, timestamp: new Date(y, mes - 1, dia).getTime() };
      }
    }
    return { str: '-', mesNum: 0, mesNome: '-', ano: 0, timestamp: 0 };
  }

  function formatPublicationField(val) {
    if (val === null || val === undefined || val === '') return 'Não se Aplica';
    const num = Number(val);
    if (!isNaN(num) && num >= 40000 && num <= 55000) {
      if (XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
        const p = XLSX.SSF.parse_date_code(num);
        if (p) {
          return String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
        }
      }
      const d = new Date(Math.round((num - 25569) * 86400 * 1000));
      return String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + d.getUTCFullYear();
    }
    const str = String(val).trim();
    if (str.toLowerCase() === 'não se aplica' || str.toLowerCase() === 'nao se aplica' || str === '-') {
      return 'Não se Aplica';
    }
    return str;
  }

  function parseNumericValor(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/[R$\s.]/g, '').replace(',', '.');
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }

  function processSheet(sheetName) {
    const ws = wb.Sheets[sheetName];
    if (!ws) return [];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    
    return rows.map((r, idx) => {
      const contrato = String(r['Contrato'] || r['CONTRATO'] || '').trim();
      const processoSei = String(r['Processo SEI'] || r['PROCESSO SEI'] || '').trim();
      const licitacaoComprasGov = String(r['Nº da licitação Compras.Gov'] || r['LICITACAO'] || '').trim();
      const empresa = String(r['Empresa'] || r['EMPRESA'] || '').trim();
      const rawAssinatura = r['Data da assinatura'] !== undefined ? r['Data da assinatura'] : r['DATA ASSINATURA'];
      const dtAssinatura = parseDateXlsx(rawAssinatura);
      const vigencia = String(r['Data de vigência'] || r['VIGENCIA'] || '').trim();
      const valor = parseNumericValor(r['Valor do contrato'] || r['VALOR']);
      const pubDoe = formatPublicationField(r['Publicação no D.O.E.'] !== undefined ? r['Publicação no D.O.E.'] : r['DOE']);
      const pubPncp = formatPublicationField(r['Publicação PNCP'] !== undefined ? r['Publicação PNCP'] : r['PNCP']);
      const pubJornal = formatPublicationField(r['Publicação Jornal de Grande Circulação'] !== undefined ? r['Publicação Jornal de Grande Circulação'] : r['JORNAL']);
      const pubAudesp = formatPublicationField(r['Publicação AUDESP (superior a R$ 9.255,00)'] !== undefined ? r['Publicação AUDESP (superior a R$ 9.255,00)'] : r['AUDESP']);
      const licitacaoAudesp = String(r['Nº da licitação AUDESP'] || '').trim();
      const objeto = String(r['Objeto'] || r['OBJETO'] || '').trim();

      // Identificar categoria pelo objeto
      let categoria = 'Outros Serviços';
      const objLower = objeto.toLowerCase();
      if (objLower.includes('transporte') || objLower.includes('veículo') || objLower.includes('ônibus')) {
        categoria = 'Transporte Escolar';
      } else if (objLower.includes('elevador') || objLower.includes('manutenção') || objLower.includes('reforma') || objLower.includes('obra')) {
        categoria = 'Manutenção e Conservação';
      } else if (objLower.includes('merenda') || objLower.includes('gênero') || objLower.includes('alimentação') || objLower.includes('água') || objLower.includes('gás')) {
        categoria = 'Alimentação e Insumos';
      } else if (objLower.includes('limpeza') || objLower.includes('vigilância') || objLower.includes('portaria')) {
        categoria = 'Vigilância e Limpeza';
      } else if (objLower.includes('locação') || objLower.includes('imóvel') || objLower.includes('aluguel')) {
        categoria = 'Locação de Imóveis';
      } else if (objLower.includes('software') || objLower.includes('computador') || objLower.includes('ti') || objLower.includes('internet')) {
        categoria = 'Tecnologia';
      }

      // Identificar status de vigência
      let statusVigencia = 'Vigente';
      if (objLower.includes('rescindido') || vigencia.toLowerCase().includes('rescind')) {
        statusVigencia = 'Rescindido';
      } else if (objLower.includes('encerrado') || vigencia.toLowerCase().includes('encerr')) {
        statusVigencia = 'Encerrado';
      }

      return {
        id: `SECOMSE-${sheetName}-${idx + 1}`,
        exercicio: sheetName,
        contrato: contrato || `Contrato ${idx + 1}`,
        processoSei: processoSei || '-',
        licitacaoComprasGov: licitacaoComprasGov || 'Não se Aplica',
        empresa: empresa || 'Não informada',
        dataAssinatura: dtAssinatura.str,
        mesAssinatura: dtAssinatura.mesNome,
        timestampAssinatura: dtAssinatura.timestamp,
        vigencia: vigencia || '-',
        valor: valor,
        valorFormatado: valor > 0 ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
        publicacaoDoe: pubDoe || 'Não Informado',
        publicacaoPncp: pubPncp || 'Não se Aplica',
        publicacaoJornal: pubJornal || 'Não se Aplica',
        publicacaoAudesp: pubAudesp || 'Não se Aplica',
        licitacaoAudesp: licitacaoAudesp || '-',
        objeto: objeto || 'Objeto não especificado',
        categoria: categoria,
        statusVigencia: statusVigencia
      };
    });
  }

  const contratos2026 = processSheet('2026');
  const contratos2025 = processSheet('2025');

  const valorTotal2026 = contratos2026.reduce((acc, c) => acc + c.valor, 0);
  const valorTotal2025 = contratos2025.reduce((acc, c) => acc + c.valor, 0);

  const payload = {
    sucesso: true,
    setor: 'SECOMSE',
    centro: 'SEAFIN',
    nomeSetor: 'Seção de Compras e Serviços',
    descricao: 'Controle Oficial de Contratos - SECOMSE',
    origem: 'SharePoint Oficial - itp_secomse_educacao_sp_gov_br',
    urlOficial: 'https://seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?rtime=1RW0RI0630g',
    arquivo: 'Controle de contratos.xlsx',
    ultimaAtualizacao: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
    kpis: {
      totalContratos2026: contratos2026.length,
      valorTotal2026: valorTotal2026,
      valorTotal2026Formatado: valorTotal2026.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      totalContratos2025: contratos2025.length,
      valorTotal2025: valorTotal2025,
      valorTotal2025Formatado: valorTotal2025.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    exerciciosDisponiveis: ['2026', '2025'],
    contratos: {
      '2026': contratos2026,
      '2025': contratos2025
    }
  };

  const outDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, 'secomse_contratos_2026.json');
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`✅ [SECOMSE] Feed consolidado gerado com sucesso em ${outFile}`);
  console.log(`📊 Total 2026: ${contratos2026.length} contratos | Valor: ${payload.kpis.valorTotal2026Formatado}`);
  console.log(`📊 Total 2025: ${contratos2025.length} contratos | Valor: ${payload.kpis.valorTotal2025Formatado}`);
}

if (require.main === module) {
  syncSecomseData().catch(err => {
    console.error('❌ Erro na sincronização SECOMSE:', err);
    process.exit(1);
  });
}

module.exports = { syncSecomseData };
