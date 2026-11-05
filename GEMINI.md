# Diretrizes e Definições de Memória do Projeto BI Dirigente

## 1. Siglas e Links Principais (Prioridade Máxima)
- **GS**: Refere-se **SEMPRE e EXCLUSIVAMENTE** à página oficial do **Google Sites**:
  - **Link do GS**: https://sites.google.com/view/bi-dirigente
  - **Nome**: BI Dirigente
  - **ATENÇÃO**: Nunca forneça link do Google Apps Script ou do Google Sheets quando o usuário pedir o link do "GS".

- **GAS**: Refere-se ao **Google Apps Script** (Web App / Editor):
  - Editor: `https://script.google.com/d/1Rmp1KzkMkRYv3LdW17U4ELQigb7xtD9IH9TfqEmaRo1xySYeVRuhc5fH/edit`
  - Deploy exec: `https://script.google.com/macros/s/AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV/exec`

- **GHP**: Refere-se **SEMPRE** ao **GitHub Pages** do projeto:
  - **Link do GHP**: https://thuginspirion-cell.github.io/BIDirigente/
  - **Repositório GitHub**: https://github.com/thuginspirion-cell/BIDirigente

## 2. Regra de Deploy Paralelo Obrigatório
Toda e qualquer alteração no código DEVE ser publicada em paralelo em ambos os canais de produção:
1. **GAS / GS**:
   - `clasp push -f`
   - `clasp deploy -i AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV -d "..."`
2. **GHP (GitHub Pages)**:
   - Commit e push na branch `main`: `git push origin main`
   - Sincronização e push na branch `gh-pages`: `git checkout gh-pages` -> `git checkout main -- index.html ...` -> `git push origin gh-pages` -> `git checkout main`

## 3. Validação Obrigatória de Integridade dos Menus
Antes de finalizar qualquer tarefa, SEMPRE validar programaticamente se todos os menus e abas laterais estão operacionais e sem erros de execução de JS/DOM (verificar `side-btn-home`, `side-btn-gestao`, `side-btn-agenda`, `side-btn-carro`, `side-btn-visitas`, `side-btn-escolas`, `side-btn-ASURE`, `side-btn-SEINTEC`, `side-btn-CAF`, `side-btn-SEOM`, `side-btn-SEGRE`, `side-btn-SEPES`, `side-btn-EEC`).

## 4. Links Oficiais SharePoint Integrados
- **SEFIN (Finanças & Orçamento)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/itp_sefin_educacao_sp_gov_br/IQBr3bmOIqpcRYIpOol6pEnAAe_BVRv5jGg9PVCkSBZU6rU?e=KukMi4`
  - Conta corporativa: `itp_sefin_educacao_sp_gov_br`
- **SEINTEC (Tecnologia & Informações)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/itp_sefin_educacao_sp_gov_br/IQC57JtcgOx0TYN_WRWdCyPLAZuHOVe0QbYAh6bcdD8gjKs?e=LTsOTP`
  - Conta corporativa: `itp_seintec_educacao_sp_gov_br`
- **SEGRE (Serviço de Gestão da Rede Escolar)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/itp_segre_educacao_sp_gov_br/cQouoXOHq3vgRIXANB5q2uJjEgUCzXuNPLJKVLwuVFU2EtFcnw`
  - Conta corporativa: `itp_segre_educacao_sp_gov_br`
  - Arquivo: `Livro Entrada 2026 SEGRE.xlsx`
- **SEMAT (Seção de Matrícula - SEGRE)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/itp_semat_educacao_sp_gov_br/cQrYEXIt2H-VQ7J7y23DGOFPEgUCfXXr5h6IlHmqWJZMJFuU5Q`
  - Conta corporativa: `itp_semat_educacao_sp_gov_br`
  - Arquivo: `Livro Entrada 2026 SEMAT.xlsx`
- **SEVESC (Seção de Vida Escolar - SEGRE)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/itp_sevesc_educacao_sp_gov_br/cQroeBSCMXZCQbbGQSCaAqMaEgUCxrdIuNVbs_RPejCEfptcng`
  - Conta corporativa: `itp_sevesc_educacao_sp_gov_br`
  - Arquivo: `Livro Entrada 2026 SEVESC.xlsx`
- **SECOMSE (Compras e Serviços - SEAFIN)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/itp_secomse_educacao_sp_gov_br/cQpyFwAJCJ87RbMXj7B2-JhJEgUC4V47cGXVivFNqBI5cG_m-A?rtime=1RW0RI0630g`
  - Conta corporativa: `itp_secomse_educacao_sp_gov_br`
  - Arquivo: `Controle de contratos.xlsx`
- **SEPES (Serviço de Pessoas / Recursos Humanos)**:
  - Link: `https://seesp-my.sharepoint.com/:x:/g/personal/rosineide_gazolla_educacao_sp_gov_br/cQoeOJnO6_6aTpffoLZQ-VZaEgUCZ4107PIc0qdIlEuWeWTsug`
  - Conta corporativa: `rosineide_gazolla_educacao_sp_gov_br`
  - Arquivo: `DEMANDAS SEAPE.xlsx`
  - Abas monitoradas: `APOSENTADORIA`, `DESIGNAÇÕES`, `ABONO DE PERMANÊNCIA`

## 5. Regra Fundamental de Resiliência dos Links Públicos do SharePoint (Anti-Login Universal)
- **Natureza Pública**: Todos os links de arquivos, pastas e planilhas compartilhados pelos setores da Diretoria de Ensino (SEINTEC, SEAFIN, SEOM, SEGRE, SEPES, EEC, ASURE, etc.) são públicos ("Qualquer pessoa com o link pode visualizar").
- **Herança Obrigatória para Novas Implementações**: Qualquer nova pasta, arquivo ou setor que venha a ser implementado DEVE OBRIGATORIAMENTE herdar o motor universal de resolução pública (`obterArquivoPublicoSharepoint` no `Código.gs` e `sincronizarBasePublicaSharepoint` no cliente `index.html`).
- **Blindagem Anti-Redirecionamento e Sem Bloqueio de Login**:
  1. Handshake prévio em duas etapas com captura e repasse de todos os cookies de sessão anônima (`FedAuth`, `rtFa`, etc.) via `extrairCookiesSharepoint`.
  2. Verificação de assinatura binária (magic bytes `PK\x03\x04` / `UEsDB`) para impedir que páginas HTML de login corporativo disfarçadas de 200 quebrem o parser do SheetJS.
  3. Em caso de instabilidade, latência ou barreira de autenticação na nuvem Microsoft, NUNCA exibir erro, modal de falha ou interromper a sincronização; ativar imediata e transparentemente a base consolidada oficial com feedback de sucesso.
  4. Jamais utilizar barras duplas `//` literais dentro de tags `<script>` em `index.html` (usar `'https:' + String.fromCharCode(47, 47) + ...` para evitar o truncamento de linhas do sanitizador do Apps Script).

## 6. Procedimento Mandatório para Solicitação de Versão / Link Mais Recente
Sempre que o usuário solicitar a "versão mais recente" ou o "link mais recente":
1. **Verificação Técnica Prévia Obrigatória**: NUNCA responder de imediato sem antes auditar o ambiente de produção.
2. **Conferência Ativa no GAS**: Executar `clasp deployments` e `clasp versions` para verificar qual versão do projeto é a mais recente e qual está efetivamente apontada no deployment ativo de produção (`AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV`).
3. **Conferência no Repositório**: Validar via `git log -n 5` e `git status` o commit ativo na `main` e a correspondência com a branch `gh-pages`.
4. **Entrega Validada**: Somente após conferir todo o código e os deploys, entregar a resposta informando com precisão o número da versão conferida e os links oficiais correspondentes.
