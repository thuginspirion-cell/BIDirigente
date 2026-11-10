const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Atualizar ESTRUTURA_ORGANIZACIONAL['SEOM']
const oldSeomEstrutura = `      'SEOM': {
        sigla: 'SEOM',
        nome: 'SEOM - Seção de Obras e Manutenção Escolar',
        descricao: 'Planejamento e acompanhamento de intervenções prediais, reformas, vistorias estruturais, laudos técnicos de engenharia e SEFISC (Frota e Fiscalização).',
        icone: '🏗️',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / SEOM',
        setores: [
          {
            sigla: 'SEOM',
            nome: 'SEOM - Obras e Manutenção Escolar',
            desc: 'Acompanhamento de reformas prediais, adequações de acessibilidade e climatização, vistorias de engenharia e laudos estruturais da rede escolar.'
          },
          {
            sigla: 'SEFISC',
            nome: 'SEFISC - Fiscalização e Frota Oficial',
            desc: 'Fiscalização in loco de contratos de prestação de serviços terceirizados, gestão e escala da frota oficial de veículos e vistorias de campo.'
          }
        ]
      },`;

const newSeomEstrutura = `      'SEOM': {
        sigla: 'SEOM',
        nome: 'SEOM - Seção de Obras e Manutenção Escolar',
        descricao: 'Planejamento e acompanhamento de intervenções prediais, reformas, vistorias estruturais, laudos técnicos de engenharia e SEFISC (Frota e Fiscalização).',
        icone: '🏗️',
        cor: '#0b2351',
        driveFolder: 'Uploads BIDirigente / SEOM',
        setores: [
          {
            sigla: 'SEOM',
            nome: 'SEOM - Obras e Manutenção Escolar',
            desc: 'Acompanhamento de reformas prediais, adequações de acessibilidade e climatização, vistorias de engenharia e laudos estruturais da rede escolar.',
            sharepointUrl: URLS_OFICIAIS_SEOM.sharepoint
          },
          {
            sigla: 'SEFISC',
            nome: 'SEFISC - Fiscalização e Frota Oficial',
            desc: 'Fiscalização in loco de contratos de prestação de serviços terceirizados, gestão e escala da frota oficial de veículos e vistorias de campo.',
            sharepointUrl: URLS_OFICIAIS_SEFISC.sharepoint
          }
        ]
      },`;

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

content = replaceAllExact(content, oldSeomEstrutura, newSeomEstrutura);

// 2. Atualizar abrirCentro para limpar containerDinamico antes de renderizar abas
const oldAbrirCentroTabs = `      // Renderiza as abas de setores do Centro
      const containerTabs = document.getElementById('container-setores-tabs');
      containerTabs.innerHTML = "";`;

const newAbrirCentroTabs = `      // Renderiza as abas de setores do Centro
      const containerTabs = document.getElementById('container-setores-tabs');
      containerTabs.innerHTML = "";

      // Limpa imediatamente o container dinâmico para eliminar qualquer resquício do centro anterior
      const containerDinamicoInicial = document.getElementById('setor-conteudo-dinamico');
      if (containerDinamicoInicial) containerDinamicoInicial.innerHTML = "";`;

content = replaceAllExact(content, oldAbrirCentroTabs, newAbrirCentroTabs);

// 3. Atualizar selecionarSetor para garantir limpeza imediata e roteamento infalível de todos os setores
const oldSelecionarSetor = `    function selecionarSetor(siglaCentro, siglaSetor, botaoClicado) {
      const centro = ESTRUTURA_ORGANIZACIONAL[siglaCentro];
      const setor = centro.setores.find(s => s.sigla === siglaSetor);
      if (!setor) return;

      // Atualiza Abas
      document.querySelectorAll('.setor-tab-btn').forEach(b => b.classList.remove('active'));
      if (botaoClicado) botaoClicado.classList.add('active');

      // Atualiza Painel do Setor
      const elSigla = document.getElementById('atual-setor-sigla');
      if (elSigla) elSigla.value = siglaSetor;
      const elTitulo = document.getElementById('setor-ativo-titulo');
      if (elTitulo) elTitulo.innerText = \`📂 \${setor.nome}\`;
      const elDesc = document.getElementById('setor-ativo-desc');
      if (elDesc) elDesc.innerText = setor.desc;
      let descNuvem = 'Uploads BIDirigente / ' + siglaCentro + ' / ' + siglaSetor;
      if (setor.sharepointUrl) {
                if (siglaSetor === 'SEFIN' || (setor && setor.sharepointUrl && siglaSetor === 'SEFIN')) {
          renderizarDashboardFinanceiroSefin();
        } else if (siglaSetor === 'SECOMSE') {
          renderizarDashboardSecomse();
        } else if (siglaSetor === 'SEPAT') {
          renderizarDashboardSepat();
        } else if (siglaSetor === 'SEOM') {
          renderizarDashboardSeom();
        } else if (siglaSetor === 'SEFISC') {
          renderizarDashboardSefisc();
        } else if (siglaSetor === 'SEMAT') {
          renderizarDashboardSemat();
        } else if (siglaSetor === 'SEVESC') {
          renderizarDashboardSevesc();
        } else if (siglaSetor === 'SEGRE' || siglaCentro === 'SEGRE') {
          renderizarDashboardSegre();
        } else {
          containerDinamico.innerHTML = \`
            <div style=\"background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 1.75rem 1.5rem; text-align: center; margin-top: 1rem;\">
              <div style=\"font-size: 2.2rem; margin-bottom: 0.5rem;\">☁️</div>
              <div style=\"font-weight: 800; font-size: 1.05rem; color: #0f172a;\">Conexão de Nuvem por Setor • Somente Leitura</div>
              <p style=\"font-size: 0.85rem; color: #475569; margin-top: 0.45rem; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.5;\">
                Este painel realiza a leitura externa dos arquivos diretamente da pasta compartilhada de cada setor, preservando a cota de 3GB e dispensando uploads manuais.
              </p>
            </div>
          \`;
        }
      }

      // Limpa seleções anteriores
      limparTodosArquivosCentro();
    }`;

const newSelecionarSetor = `    function selecionarSetor(siglaCentro, siglaSetor, botaoClicado) {
      const centro = ESTRUTURA_ORGANIZACIONAL[siglaCentro];
      if (!centro) return;
      const setor = centro.setores.find(s => s.sigla === siglaSetor);
      if (!setor) return;

      // Atualiza Abas
      document.querySelectorAll('.setor-tab-btn').forEach(b => b.classList.remove('active'));
      if (botaoClicado) botaoClicado.classList.add('active');

      // Atualiza Painel do Setor
      const elSigla = document.getElementById('atual-setor-sigla');
      if (elSigla) elSigla.value = siglaSetor;
      const elTitulo = document.getElementById('setor-ativo-titulo');
      if (elTitulo) elTitulo.innerText = \`📂 \${setor.nome}\`;
      const elDesc = document.getElementById('setor-ativo-desc');
      if (elDesc) elDesc.innerText = setor.desc;

      // Limpeza obrigatória do container dinâmico para isolamento total entre setores e centros
      const containerDinamico = document.getElementById('setor-conteudo-dinamico');
      if (containerDinamico) containerDinamico.innerHTML = '';

      if (siglaSetor === 'SEFIN') {
        renderizarDashboardFinanceiroSefin();
      } else if (siglaSetor === 'SECOMSE') {
        renderizarDashboardSecomse();
      } else if (siglaSetor === 'SEPAT') {
        renderizarDashboardSepat();
      } else if (siglaSetor === 'SEOM') {
        renderizarDashboardSeom();
      } else if (siglaSetor === 'SEFISC') {
        renderizarDashboardSefisc();
      } else if (siglaSetor === 'SEMAT') {
        renderizarDashboardSemat();
      } else if (siglaSetor === 'SEVESC') {
        renderizarDashboardSevesc();
      } else if (siglaSetor === 'SEGRE' || siglaCentro === 'SEGRE') {
        renderizarDashboardSegre();
      } else {
        if (containerDinamico) {
          containerDinamico.innerHTML = \`
            <div style=\"background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 2rem 1.5rem; text-align: center; margin-top: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03);\">
              <div style=\"width: 52px; height: 52px; border-radius: 12px; background: #eff6ff; color: #0b2351; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 0.75rem;\">📁</div>
              <h3 style=\"font-weight: 800; font-size: 1.15rem; color: #0f172a; margin: 0 0 0.5rem 0;\">\${setor.nome}</h3>
              <p style=\"font-size: 0.88rem; color: #475569; max-width: 580px; margin: 0 auto 1.25rem auto; line-height: 1.5;\">
                \${setor.desc}
              </p>
              <div style=\"display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 6px 16px; border-radius: 20px;\">
                ☁️ Nuvem do Setor: Uploads BIDirigente / \${siglaCentro} / \${siglaSetor}
              </div>
            </div>
          \`;
        }
      }

      // Limpa seleções anteriores
      limparTodosArquivosCentro();
    }`;

content = replaceAllExact(content, oldSelecionarSetor, newSelecionarSetor);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finalizado com sucesso!');
