/**
 * patch_codigogs.js — Atualiza doGet no Código.gs com tratamento robusto de permissão
 */
const fs = require('fs');
const path = require('path');
const BASE = __dirname;
const GS_PATH = path.join(BASE, 'Código.gs');

let content = fs.readFileSync(GS_PATH, 'utf8');

// Localiza o bloco da função doGet inteiro e substitui
// usando indexOf/slice para evitar problemas de line endings
const START_MARKER = 'function doGet(e) {';
const END_MARKER_AFTER = '.setTitle(\'BI Dirigente\');\r\n}';
const END_MARKER_AFTER_LF = '.setTitle(\'BI Dirigente\');\n}';

let startIdx = content.indexOf(START_MARKER);
if (startIdx === -1) {
  console.error('ERRO: Não encontrou function doGet(e)');
  process.exit(1);
}

// Find the closing } of doGet - look for the pattern after setTitle
let endIdx = content.indexOf(END_MARKER_AFTER, startIdx);
let endLen = END_MARKER_AFTER.length;
if (endIdx === -1) {
  endIdx = content.indexOf(END_MARKER_AFTER_LF, startIdx);
  endLen = END_MARKER_AFTER_LF.length;
}

if (endIdx === -1) {
  console.error('ERRO: Não encontrou o final da função doGet');
  // Try simpler approach: find the next function after doGet
  const nextFunctionIdx = content.indexOf('\r\nfunction ', startIdx + 10);
  if (nextFunctionIdx === -1) {
    console.error('ERRO: Não encontrou o próximo function após doGet');
    process.exit(1);
  }
  endIdx = nextFunctionIdx;
  endLen = 0;
  console.log(`Usando fallback: cortando em index ${endIdx}`);
}

const before = content.substring(0, startIdx);
const after = content.substring(endIdx + endLen);

const newDoGet = `/**
 * BI Dirigente — Web App Entry Point
 * Deploy: executeAs=USER_DEPLOYING, access=ANYONE_ANONYMOUS
 * Scopes: script.external_request, calendar, drive, spreadsheets
 *
 * IMPORTANTE: Este script DEVE ser deployado como USER_DEPLOYING para que
 * o UrlFetchApp funcione sem erros de permissão.
 * Em caso de erro "Você não tem permissão para chamar UrlFetchApp.fetch":
 *   1. Confirme que appsscript.json tem executeAs="USER_DEPLOYING"
 *   2. Crie um NOVO deploy: npx clasp push -f && npx clasp deploy -i <ID> -d "..."
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    var action = e.parameter.action;
    var output = { sucesso: false, erro: 'Ação não reconhecida' };

    try {
      // Verificação preventiva: UrlFetchApp só está disponível se executeAs=USER_DEPLOYING
      if (typeof UrlFetchApp === 'undefined') {
        throw new Error(
          'UrlFetchApp indisponível. Certifique-se de que o deploy usa executeAs=USER_DEPLOYING ' +
          'e que o scope https://www.googleapis.com/auth/script.external_request está declarado no manifesto.'
        );
      }

      if (action === 'sincronizarSharepoint' || action === 'sincronizarCalls') {
        output = sincronizarPlanilhaSharepoint();
      } else if (action === 'sincronizarInventario') {
        output = sincronizarInventarioSharepoint();
      } else if (action === 'sincronizarSefin') {
        output = sincronizarPlanilhaSefin();
      } else if (action === 'diagnostico') {
        output = executarDiagnosticoConexoes();
      } else if (action === 'ping') {
        // Diagnóstico rápido: verifica se o GAS está online e com permissões corretas
        output = {
          sucesso: true,
          mensagem: 'BI Dirigente GAS Online',
          urlFetchDisponivel: (typeof UrlFetchApp !== 'undefined'),
          timestamp: Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss'),
          executeAs: 'USER_DEPLOYING'
        };
      }
    } catch (err) {
      var errMsg = err.toString();
      output = {
        sucesso: false,
        erro: errMsg,
        dica: errMsg.indexOf('UrlFetchApp') >= 0
          ? 'Erro de permissão: recrie o deploy com executeAs=USER_DEPLOYING. ' +
            'Execute: npx clasp push -f && npx clasp deploy -i <ID> -d "fix permissao"'
          : 'Erro interno no servidor GAS.'
      };
    }

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('BI Dirigente');
}`;

const newContent = before + newDoGet + after;
fs.writeFileSync(GS_PATH, newContent, 'utf8');
console.log('✅ Código.gs atualizado com sucesso!');
console.log(`   Trecho substituído: ${startIdx} → ${endIdx + endLen} chars`);
console.log(`   Novo tamanho: ${newContent.length} chars (era ${content.length})`);
