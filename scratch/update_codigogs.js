const fs = require('fs');

let codeGs = fs.readFileSync('Código.gs', 'utf8');
const isCrlf = codeGs.includes('\r\n');
const newline = isCrlf ? '\r\n' : '\n';

// Localizar a função sincronizarPlanilhaSharepoint
const startIdx = codeGs.indexOf('function sincronizarPlanilhaSharepoint() {');
const nextFuncIdx = codeGs.indexOf('function sincronizarInventarioSharepoint() {', startIdx);

if (startIdx === -1 || nextFuncIdx === -1) {
  console.error("Função não encontrada!");
  process.exit(1);
}

// O bloco anterior vai de startIdx até o fechamento da função antes de sincronizarInventarioSharepoint
const endIdx = codeGs.lastIndexOf('}', nextFuncIdx) + 1;

console.log("Substituindo bloco de:", startIdx, "até:", endIdx);

const newSincCalls = [
  'function sincronizarPlanilhaSharepoint() {',
  '  var url = "https://seesp-my.sharepoint.com/:x:/g/personal/itp_seintec_educacao_sp_gov_br/cQq57JtcgOx0TYN_WRWdCyPLEgUCWtCBVpIXsMYmQoivNUmH6w?download=1";',
  '  try {',
  '    if (typeof UrlFetchApp === "undefined") {',
  '      return {',
  '        sucesso: true,',
  '        usarBaseLocal: true,',
  '        aviso: "Base de contingência local ativa",',
  '        timestamp: Utilities.formatDate(new Date(), "America/Sao_Paulo", "HH:mm"),',
  '        data: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy")',
  '      };',
  '    }',
  '',
  '    // 1. Primeira chamada sem seguir redirect para capturar os cookies de sessão anônima do SharePoint',
  '    var resp1 = UrlFetchApp.fetch(url, {',
  '      muteHttpExceptions: true,',
  '      followRedirects: false,',
  '      headers: {',
  '        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"',
  '      }',
  '    });',
  '',
  '    var headers1 = resp1.getAllHeaders();',
  '    var setCookie = headers1["Set-Cookie"] || headers1["set-cookie"];',
  '    var cookieHeader = "";',
  '',
  '    if (setCookie) {',
  '      if (Array.isArray(setCookie)) {',
  '        cookieHeader = setCookie.map(function(c) { return c.split(";")[0]; }).join("; ");',
  '      } else {',
  '        cookieHeader = String(setCookie).split(";")[0];',
  '      }',
  '    }',
  '',
  '    var location1 = headers1["Location"] || headers1["location"];',
  '    var downloadUrl = url;',
  '',
  '    if (location1) {',
  '      downloadUrl = (location1.indexOf("http") === 0) ? location1 : ("https://seesp-my.sharepoint.com" + location1);',
  '    }',
  '',
  '    // 2. Segunda chamada com o Cookie repassado (retorna 200 e os 943 KB do XLSX real)',
  '    var response = UrlFetchApp.fetch(downloadUrl, {',
  '      muteHttpExceptions: true,',
  '      followRedirects: true,',
  '      headers: {',
  '        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",',
  '        "Cookie": cookieHeader',
  '      }',
  '    });',
  '',
  '    if (response.getResponseCode() === 200) {',
  '      var blob = response.getBlob();',
  '      var bytes = blob.getBytes();',
  '      var base64 = Utilities.base64Encode(bytes);',
  '      return {',
  '        sucesso: true,',
  '        dadosBase64: base64,',
  '        tamanhoBytes: bytes.length,',
  '        timestamp: Utilities.formatDate(new Date(), "America/Sao_Paulo", "HH:mm"),',
  '        data: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy")',
  '      };',
  '    } else {',
  '      return {',
  '        sucesso: true,',
  '        usarBaseLocal: true,',
  '        aviso: "Status HTTP " + response.getResponseCode() + " no SharePoint. Contingência local ativa.",',
  '        timestamp: Utilities.formatDate(new Date(), "America/Sao_Paulo", "HH:mm"),',
  '        data: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy")',
  '      };',
  '    }',
  '  } catch (err) {',
  '    return {',
  '      sucesso: true,',
  '      usarBaseLocal: true,',
  '      aviso: "Contingência local ativa: " + err.toString(),',
  '      timestamp: Utilities.formatDate(new Date(), "America/Sao_Paulo", "HH:mm"),',
  '      data: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy")',
  '    };',
  '  }',
  '}'
].join(newline);

codeGs = codeGs.substring(0, startIdx) + newSincCalls + codeGs.substring(endIdx);
fs.writeFileSync('Código.gs', codeGs, 'utf8');
console.log("Código.gs atualizado com sucesso!");
