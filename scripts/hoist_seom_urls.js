const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Move URLS_OFICIAIS_SEOM and URLS_OFICIAIS_SEFISC to line before ESTRUTURA_ORGANIZACIONAL
const oldBlockBeforeEstrutura = `    const URLS_OFICIAIS_SECOMSE = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?rtime=1RW0RI0630g'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/secomse_contratos_2026.json')
    };

    // Estrutura Hierárquica: CENTROS -> SETORES`;

const newBlockBeforeEstrutura = `    const URLS_OFICIAIS_SECOMSE = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?rtime=1RW0RI0630g'),
      mirrorData: ('https:' + String.fromCharCode(47, 47) + 'raw.githubusercontent.com/thuginspirion-cell/BIDirigente/main/data/secomse_contratos_2026.json')
    };

    const URLS_OFICIAIS_SEOM = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQpHptlGiLQ_S6fnHiKPD8jIEgUCoTHvKXxEEJYjc-0WstW10A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQpHptlGiLQ_S6fnHiKPD8jIEgUCoTHvKXxEEJYjc-0WstW10A'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      setor: 'SEOM - Seção de Obras e Manutenção Escolar'
    };

    const URLS_OFICIAIS_SEFISC = {
      sharepoint: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      setor: 'SEFISC - Seção de Fiscalização e Serviços Contratados'
    };

    // Estrutura Hierárquica: CENTROS -> SETORES`;

// 2. Remove duplicate at line 17575
const oldDuplicateBlock = `    // =========================================================================
    // URLS E BASES OFICIAIS SHAREPOINT: SEOM & SEFISC
    // =========================================================================
    const URLS_OFICIAIS_SEOM = {
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQpHptlGiLQ_S6fnHiKPD8jIEgUCoTHvKXxEEJYjc-0WstW10A'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      setor: 'SEOM - Seção de Obras e Manutenção Escolar'
    };

    const URLS_OFICIAIS_SEFISC = {
      sharepointOriginal: ('https:' + String.fromCharCode(47, 47) + 'seesp-my.sharepoint.com/:x:/g/personal/itp_seom_educacao_sp_gov_br/cQqlhZv__2RbRqWFsB6bi32kEgUCiksrkU07lAICVPKgti7U7A'),
      contaCorporativa: 'itp_seom_educacao_sp_gov_br',
      setor: 'SEFISC - Seção de Fiscalização e Serviços Contratados'
    };`;

const newDuplicateBlock = `    // =========================================================================
    // ROTINAS DE SINCRONIZAÇÃO SHAREPOINT: SEOM & SEFISC
    // =========================================================================`;

function replaceAllExact(str, find, rep) {
  const normFind = find.replace(/\r?\n/g, '\r\n');
  const normRep = rep.replace(/\r?\n/g, '\r\n');
  if (!str.includes(normFind)) {
    console.error('NOT FOUND: ' + find.substring(0, 40));
    return str;
  }
  console.log('REPLACED: ' + find.substring(0, 40));
  return str.replace(normFind, normRep);
}

content = replaceAllExact(content, oldBlockBeforeEstrutura, newBlockBeforeEstrutura);
content = replaceAllExact(content, oldDuplicateBlock, newDuplicateBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done hoisting URLS_OFICIAIS_SEOM and URLS_OFICIAIS_SEFISC!');
