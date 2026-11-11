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
- **EEC (Equipe de Especialistas em Currículo)**:
  - Sistema Oficial: Portal Pedagógico Integrado (12 Módulos Web Apps Apps Script & Google Sites)
  - 1. Início EEC: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/in%C3%ADcio?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbxg3Z3AD5t1kfKE4ZxnmGRmulC4lhPGjvCgnqIvctsTkonKbdD57CV91ILj-mJQR3lQ/exec`)
  - 2. Plano de Ação 2.0 2026: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/plano-de-a%C3%A7%C3%A3o-2-0-2026?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbxg3Z3AD5t1kfKE4ZxnmGRmulC4lhPGjvCgnqIvctsTkonKbdD57CV91ILj-mJQR3lQ/exec`)
  - 3. Devolutiva Pedagógica: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/devolutiva-pedag%C3%B3gica?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbzGOzNhdgu3AxXCRm63xsdy_AnZ-YIWQymfcpBVlX4D0SOrI9RWc2EOs0maUK7WqfEq0A/exec`)
  - 4. Consulta SAEB 2025: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/consulta-saeb-2025?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbwc79rKkieVXFptQTxBarcJ1yew2ptmiyw9Z_a3kvylsqSxUzyeXAEMmCVkETy6WxPB/exec`)
  - 5. Acompanhamento das Avaliações: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/acompanhamento-das-avalia%C3%A7%C3%B5es?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbxqqZD_Fb3sn0-pWveQGU0C52vft9pZarO_Fn9tQ1W3tUMSsiweoyp9gi_4qMug7D5wAA/exec`)
  - 6. Consulta de Docentes: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/consulta-de-docentes?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbyFcmn8Etf-TpZkMIJCZ-Yrkj_axHVQbwbphhSPgiyy-mPbMj9ALxPeYgwVDfuLTxZ7/exec`)
  - 7. Simulados SARESP 2026: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/simulados?authuser=0` (Portal: `https://sites.google.com/prof.educacao.sp.gov.br/matemticaemmovimento/simulados-saresp-2026`)
  - 8. Novo Acompanhamento Pedagógico: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/novo-acompanhamento-pedag%C3%B3gico?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbzAFWbSLmLKCNLesPEdx8GMnX-YHimnjHbj4c7rrdBRzu4udzmJOkEPcJ6OhzSYVeXRKw/exec`)
  - 9. Checklist SARESP 2026: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/checklist-de-acompanhamento-saresp-2026?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbyXjaKczfuk987SMHKw4TL59bKVJoHM7vQ37WLE0cv4VOuYeUfXElxq3qPzMpuGy3kRFw/exec`)
  - 10. Desenvolvimento Profissional Docente: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/ficha-individual-de-desenvolvimento-profissional-docente?authuser=0` (Web App: `https://script.google.com/macros/s/AKfycbxNxHU2nt3sTKphPX3QZMAMRFuaL38qf7rYljzSi2QmZA90t4Nc8spr80fAmap0yaBqlA/exec`)
  - 11. Central de Dados URE Itapevi: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/central-de-dados-ure-itapevi?authuser=0` (Web App: `https://script.google.com/a/macros/prof.educacao.sp.gov.br/s/AKfycbzskxnosNe9K7Ldsk_fJ3z-og7RFC6dpau_x6PPmEXTKp-_KslFOzDymQGWsTtQKz1SHw/exec`)
  - 12. Professor Tutor: `https://sites.google.com/prof.educacao.sp.gov.br/appscript2026/professor-tutor?authuser=0` (Web App: `https://script.google.com/macros/s/AKfycbx4rTtB0g11U7Uv516xgfrE_WhaUaFB_5YNawvpqDdVa-tIEouUEeumg_z1gm1DPgxy/exec`)

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

## 7. Regra Absoluta de Prioridade dos Dados na Nuvem, Sincronização Sem Login e Não-Regressão (Multi-Dispositivos)
- **Acesso Ubíquo no Mundo Inteiro (PC Casa, Escritório, Viagem)**: O usuário opera em múltiplos computadores e locais. O projeto, suas regras, memórias, código e dados devem viver e sincronizar 100% na nuvem (GitHub, Google Apps Script, Google Sites e SharePoint). NUNCA depender de configurações ou dados presos exclusivamente a uma máquina local. Em qualquer computador, logado na mesma conta ou acessando pelo navegador, o usuário SEMPRE tem acesso à versão mais recente ativa.
- **Sincronização por Demanda na Força Bruta (Links Públicos SharePoint / OneDrive)**:
  - Todas as fontes de dados dos setores (SEINTEC, SEAFIN, SEOM, SEGRE, SEPES, etc.) são pastas e planilhas públicas (*"Qualquer pessoa com o link pode visualizar"*).
  - NUNCA exigir login Microsoft, usuário/senha institucional ou MFA.
  - A sincronização por demanda ("Sincronizar Tudo" ou por setor) utiliza o motor anônimo `obterArquivoPublicoSharepoint` no Apps Script e `sincronizarBasePublicaSharepoint` no cliente, fazendo handshake em 2 etapas com extração de cookies anônimos (`FedAuth`, `rtFa`) e validação de magic bytes `UEsDB` (XLSX).
  - A busca na força bruta traz as informações reais mais recentes diretamente das planilhas oficiais e renderiza imediatamente na tela.
- **Política Nuvem Exclusiva (Zero `localStorage`, Zero `sessionStorage`, Zero Cookies)**: É **TERMINANTEMENTE PROIBIDO** armazenar ou ler dados operacionais em `localStorage`, `sessionStorage` ou cookies no navegador/máquina. Todo dado apresentado DEVE vir exclusivamente da nuvem (SharePoint, Google Calendar, GAS `PropertiesService` via `lerEstadoNuvem`/`gravarEstadoNuvem` e espelho oficial GitHub). Na inicialização (`limparTodoArmazenamentoLocal`), qualquer resíduo de armazenamento local é purgado e o sistema sincroniza direto da nuvem (`sincronizarTudoGlobalmente(true)` + `hidratarTodosModulosNuvem()`).
- **Espelhamento Fiel a Deleções (Padrão Obrigatório para Todos os Setores Atuais e Futuros)**: Quando uma sincronização recebe a carga completa oficial de uma planilha no SharePoint, essa carga DEVE **substituir integralmente** os dados em memória — **proibido merge aditivo** — garantindo que linhas excluídas/deletadas na planilha oficial desapareçam imediatamente em todos os setores (`SEINTEC`, `SEAFIN`, `SEOM`, `SEGRE`, `SEPES`, `EEC`, `ASURE` e futuros).
- **Sincronização Nuvem Obrigatória**: Toda e qualquer atualização de código, regra ou skill DEVE ser imediatamente commitada e enviada (`git push`) para as branches `main` e `gh-pages` no repositório remoto do GitHub (`https://github.com/thuginspirion-cell/BIDirigente`), e feito deploy no Google Apps Script (`clasp deploy`), garantindo acesso idêntico e universal de qualquer lugar.

## 8. Diretriz Universal: Cards Executivos NUNCA Funcionam como Filtros
- **Natureza dos Cards**: Todo e qualquer card de indicador sintético (KPI cards, estatísticas gerais, contagens por tipo/ambiente, etc.) de qualquer setor presente ou futuro (SEINTEC, SEAFIN, SEOM, SEGRE, SEPES, EEC, ASURE, etc.) destina-se **EXCLUSIVAMENTE à visualização executiva de métricas e sínteses de dados**.
- **Proibição de Comportamento de Filtro**: Nenhum card deve possuir onclick, evento de seleção, alteração de borda de ativação (.selected) ou atuar como disparador de filtro de tabelas/listas.
- **Cursores e Acessibilidade**: Devem manter cursor: default (sem indicar clicabilidade) e permitir seleção normal de texto.
- **Controles de Filtragem Dedicados**: A filtragem de registros, chamados e planilhas é de responsabilidade única e exclusiva das **barras de filtros dedicadas** (botões pill, inputs de busca textual e selects) localizadas abaixo dos cards.
