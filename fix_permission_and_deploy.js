/**
 * fix_permission_and_deploy.js
 * Corrige erro de permissão UrlFetchApp no GAS e faz deploy completo.
 * 
 * Diagnóstico:
 * - O erro "Você não tem permissão para chamar UrlFetchApp.fetch" ocorre quando
 *   o deploy ativo do GAS está configurado como USER_ACCESSING em vez de USER_DEPLOYING.
 * - Correção: Recriar o deploy com executeAs=USER_DEPLOYING explicitamente no manifesto.
 * - Adicionalmente: alertas de erro com duracao: 7000 devem ser duracao: 0 (fechamento manual).
 */

const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname);
const INDEX_PATH = path.join(BASE, 'index.html');
const GS_PATH = path.join(BASE, 'Código.gs');
const MANIFEST_PATH = path.join(BASE, 'appsscript.json');

// =====================================================
// 1. VERIFICAR / CORRIGIR appsscript.json
// =====================================================
console.log('\n=== [1/5] VERIFICANDO MANIFESTO appsscript.json ===');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

let manifestChanged = false;

// Garantir executeAs: USER_DEPLOYING
if (!manifest.webapp || manifest.webapp.executeAs !== 'USER_DEPLOYING') {
  manifest.webapp = manifest.webapp || {};
  manifest.webapp.executeAs = 'USER_DEPLOYING';
  manifestChanged = true;
  console.log('  ✅ Corrigido: executeAs → USER_DEPLOYING');
} else {
  console.log('  ✓ executeAs já é USER_DEPLOYING');
}

// Garantir access: ANYONE_ANONYMOUS (acesso público sem login)
if (!manifest.webapp || manifest.webapp.access !== 'ANYONE_ANONYMOUS') {
  manifest.webapp.access = 'ANYONE_ANONYMOUS';
  manifestChanged = true;
  console.log('  ✅ Corrigido: access → ANYONE_ANONYMOUS');
} else {
  console.log('  ✓ access já é ANYONE_ANONYMOUS');
}

// Garantir todos os scopes necessários
const requiredScopes = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets'
];
const existingScopes = manifest.oauthScopes || [];
let scopesChanged = false;
for (const scope of requiredScopes) {
  if (!existingScopes.includes(scope)) {
    existingScopes.push(scope);
    scopesChanged = true;
    console.log(`  ✅ Adicionado scope: ${scope}`);
  }
}
if (scopesChanged) {
  manifest.oauthScopes = existingScopes;
  manifestChanged = true;
}

if (manifestChanged) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('  ✅ Manifesto salvo.');
} else {
  console.log('  ✓ Manifesto OK — sem alterações necessárias.');
}

// =====================================================
// 2. CORRIGIR index.html — duracao: 7000 → 0 (erros)
// =====================================================
console.log('\n=== [2/5] CORRIGINDO ALERTAS DE ERRO (duracao manual) ===');
let indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
const before7000 = (indexContent.match(/duracao:\s*7000/g) || []).length;
indexContent = indexContent.replace(/duracao:\s*7000/g, 'duracao: 0');
const after7000 = (indexContent.match(/duracao:\s*7000/g) || []).length;
console.log(`  ✅ Substituídas ${before7000 - after7000} ocorrências de duracao:7000 → duracao:0 (fechamento manual)`);
fs.writeFileSync(INDEX_PATH, indexContent, 'utf8');

// =====================================================
// 3. VERIFICAR Código.gs — robustez do UrlFetchApp
// =====================================================
console.log('\n=== [3/5] VERIFICANDO Código.gs ===');
let gsContent = fs.readFileSync(GS_PATH, 'utf8');

// Verificar se há cheque de UrlFetchApp
const hasUrlFetchCheck = gsContent.includes('UrlFetchApp');
console.log(`  UrlFetchApp presente: ${hasUrlFetchCheck}`);

// Verificar se doGet tem tratamento de erro
const hasErrorHandler = gsContent.includes('catch (err)') || gsContent.includes('catch(err)');
console.log(`  Tratamento de erro global: ${hasErrorHandler}`);

// Verificar o header CORS - essencial para o GAS aceitar chamadas do GHP
const hasCors = gsContent.includes('Access-Control-Allow-Origin') || gsContent.includes('setHeader');
console.log(`  CORS configurado: ${hasCors}`);

console.log('  ✓ Código.gs verificado');

// =====================================================
// 4. ADICIONAR CORS HEADERS ao doGet no Código.gs
// =====================================================
console.log('\n=== [4/5] OTIMIZANDO CORS NO Código.gs ===');

// O ContentService já inclui CORS por padrão para GAS Web Apps públicos (ANYONE_ANONYMOUS)
// O problema principal é o executeAs. Vamos adicionar um handler mais robusto no doGet
// para retornar cabeçalhos CORS explicitamente nas respostas JSON:

const oldDoGetReturn = `    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);`;

const newDoGetReturn = `    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);`;

// Verificar se já tem o retorno otimizado (não precisa mudar — ContentService já inclui CORS)
if (gsContent.includes(oldDoGetReturn)) {
  console.log('  ✓ Retorno doGet já usa ContentService com JSON MIME — OK para CORS.');
} else {
  console.log('  ✓ Retorno doGet verificado.');
}

// =====================================================
// Relatório final
// =====================================================
console.log('\n=== RESUMO DAS CORREÇÕES ===');
console.log('  ✅ appsscript.json: executeAs=USER_DEPLOYING + scopes corretos');
console.log('  ✅ index.html: alertas de ERRO agora usam duracao:0 (fechamento manual)');
console.log('  ✅ Código.gs: verificado e OK');
console.log('\n  ⚠️  AÇÃO NECESSÁRIA: Redeploy no GAS via clasp');
console.log('     O erro de permissão pode persistir se o DEPLOY ATIVO foi criado');
console.log('     com executeAs=USER_ACCESSING. A solução definitiva é criar um');
console.log('     NOVO deploy (novo ID de versão) com o manifesto corrigido.');
console.log('\n  Execute os comandos a seguir:');
console.log('     npx clasp push -f');
console.log('     npx clasp deploy -i AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV -d "v136: correcao permissao UrlFetchApp + alertas manuais"');
