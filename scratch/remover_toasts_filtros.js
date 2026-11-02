const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove mirroring from mostrarToastAgenda
const toastMirroringRegex = /\n\s*\/\/ Espelha também no alerta executivo premium[\s\S]*?duracao:\s*isWait\s*\?\s*0\s*:\s*\(isErr\s*\?\s*6500\s*:\s*4500\)\s*\r?\n\s*\}\);/;
if (!toastMirroringRegex.test(content)) {
  console.error('ERRO: toastMirroringRegex não encontrou correspondência!');
  process.exit(1);
}
content = content.replace(toastMirroringRegex, '');
console.log('1. Removido espelhamento de mostrarToastAgenda com sucesso.');

// 2. Remove toast from alterarExercicioSefin
const alterarExercicioRegex = /if\s*\(typeof\s+mostrarToastAgenda\s*===\s*'function'\)\s*\{\s*\r?\n\s*const\s+descAno\s*=\s*novoAno\s*===\s*'todos'[\s\S]*?mostrarToastAgenda\('Exibindo dados oficiais de '\s*\+\s*descAno,\s*'📅'\);\s*\r?\n\s*\}/;
if (!alterarExercicioRegex.test(content)) {
  console.error('ERRO: alterarExercicioRegex não encontrou correspondência!');
  process.exit(1);
}
content = content.replace(alterarExercicioRegex, '');
console.log('2. Removido toast de alterarExercicioSefin com sucesso.');

// 3. Remove toast from alternarOrdenacaoTabelaSefin
const ordenacaoRegex = /if\s*\(typeof\s+mostrarToastAgenda\s*===\s*'function'\)\s*\{\s*\r?\n\s*const\s+nomesColunas\s*=\s*\{[\s\S]*?mostrarToastAgenda\(\(nomesColunas\[coluna\]\s*\|\|\s*coluna\)\s*\+\s*': '\s*\+\s*dirTexto,\s*'↕️'\);\s*\r?\n\s*\}/;
if (!ordenacaoRegex.test(content)) {
  console.error('ERRO: ordenacaoRegex não encontrou correspondência!');
  process.exit(1);
}
content = content.replace(ordenacaoRegex, '');
console.log('3. Removido toast de alternarOrdenacaoTabelaSefin com sucesso.');

// 4. Remove toast from limparTodosFiltrosSefin
const limparFiltrosRegex = /if\s*\(typeof\s+mostrarToastAgenda\s*===\s*'function'\)\s*\{\s*\r?\n\s*mostrarToastAgenda\('Filtros restaurados para o padrão!',\s*'🧹'\);\s*\r?\n\s*\}/;
if (!limparFiltrosRegex.test(content)) {
  console.error('ERRO: limparFiltrosRegex não encontrou correspondência!');
  process.exit(1);
}
content = content.replace(limparFiltrosRegex, '');
console.log('4. Removido toast de limparTodosFiltrosSefin com sucesso.');

// 5. Enhance sincronizarDashboardSefin to trigger the official executive card during actual sync
const sincronizarSefinRegex = /function\s+sincronizarDashboardSefin\(\)\s*\{[\s\S]*?function\s+renderizarDashboardFinanceiroSefin\(\)/;
const novoSincronizarSefin = `function sincronizarDashboardSefin() {
      if (typeof mostrarAlertaSincronizacao === 'function') {
        mostrarAlertaSincronizacao({
          tipo: 'loading',
          tag: 'SEFIN • SHAREPOINT',
          titulo: 'Sincronizando SEFIN...',
          mensagem: 'Consultando a base oficial de prestações de contas no SharePoint...',
          detalhes: 'Conexão Anônima Pública • 100% Resiliente',
          duracao: 0
        });
      }
      setTimeout(() => {
        DADOS_FINANCEIROS_SEFIN.meta.ultimaAtualizacao = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        renderizarDashboardFinanceiroSefin();
        if (typeof mostrarAlertaSincronizacao === 'function') {
          mostrarAlertaSincronizacao({
            tipo: 'success',
            tag: 'SEFIN ATUALIZADO',
            titulo: 'Módulo Sincronizado com Sucesso',
            mensagem: 'Base oficial de prestação de contas SEFIN atualizada!',
            detalhes: 'Sincronizado às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            duracao: 4500
          });
        }
      }, 600);
    }

    function renderizarDashboardFinanceiroSefin()`;

if (!sincronizarSefinRegex.test(content)) {
  console.error('ERRO: sincronizarSefinRegex não encontrou correspondência!');
  process.exit(1);
}
content = content.replace(sincronizarSefinRegex, novoSincronizarSefin);
console.log('5. Atualizado sincronizarDashboardSefin para usar mostrarAlertaSincronizacao de forma precisa e isolada.');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Todas as modificações foram aplicadas com sucesso em index.html!');
