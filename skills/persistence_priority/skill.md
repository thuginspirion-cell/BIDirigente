---
name: persistence-priority
description: Garante prioridade absoluta às fontes de dados em nuvem, sincronização por demanda na força bruta sem login Microsoft, persistência e proibição total de regressão a dados antigos em qualquer máquina do mundo.
---

# Regra de Ouro: Prioridade de Dados na Nuvem, Sincronização Bruta Sem Login e Não-Regressão Universal

Esta regra e habilidade é de **observância obrigatória e prioridade máxima absoluta** para o projeto **BI Dirigente**.

---

## 1. Acesso e Operação Ubíqua no Mundo Inteiro (Multi-Dispositivos)
- O usuário opera em múltiplos computadores e locais: **PC de casa**, **escritório** e **notebook em viagens/trânsito**, em qualquer lugar do mundo.
- Todas as regras, códigos, memórias e arquivos deste projeto devem residir e ser sincronizados **100% na Nuvem**:
  - Repositório Remoto GitHub: `https://github.com/thuginspirion-cell/BIDirigente` (branches `main` e `gh-pages`)
  - Google Apps Script (GAS): ID `1Rmp1KzkMkRYv3LdW17U4ELQigb7xtD9IH9TfqEmaRo1xySYeVRuhc5fH` (Deploy ID: `AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV`)
  - Google Sites (GS): `https://sites.google.com/view/bi-dirigente`
  - GitHub Pages (GHP): `https://thuginspirion-cell.github.io/BIDirigente/`
- NENHUMA dependência, arquivo essencial ou memória pode ficar isolada apenas no disco rígido local sem commit e push imediato para o repositório remoto e GAS.
- Em qualquer computador, logado na mesma conta ou acessando pelo navegador, o usuário **SEMPRE** recebe a versão mais recente em produção.

---

## 2. Sincronização por Demanda na Força Bruta (Links Públicos SharePoint / OneDrive)
- **Natureza Pública**: Todas as fontes de dados dos setores (SEINTEC, SEAFIN, SEOM, SEGRE, SEPES, EEC, ASURE, etc.) são pastas e planilhas oficiais compartilhadas com acesso público irrestrito (*"Qualquer pessoa com o link pode visualizar"*).
- **Zero Login / Zero Barreira Microsoft**:
  - NÃO há exigência de login na Microsoft, usuário/senha corporativa nem MFA institucional.
  - A sincronização por demanda (botão "Sincronizar Tudo" ou por setor) utiliza o motor de resolução `obterArquivoPublicoSharepoint` no backend do Google Apps Script (`Código.gs`) e `sincronizarBasePublicaSharepoint` no cliente (`index.html`).
- **Mecanismo de Resolução**:
  1. Handshake em duas etapas com extração e repasse de cookies de sessão anônima (`FedAuth`, `rtFa`).
  2. Validação obrigatória da assinatura binária de arquivos XLSX (magic bytes `UEsDB` / `PK\x03\x04`), impedindo que páginas HTML de login bloqueiem o parser do SheetJS.
  3. Extração dos dados brutos das planilhas na força bruta diretamente das fontes oficiais atualizadas.

---

## 3. Proibição Absoluta de Regressão a Dados Antigos
- **JAMAIS** reverter dados para estados defasados, valores mockados iniciais ou contagens antigas após F5 (refresh), reinicialização do navegador ou troca de computador.
- Ao sincronizar, os números mais recentes das fontes públicas são calculados, renderizados imediatamente na tela e gravados no armazenamento persistente (`BI_DIRIGENTE_CACHE_*`).
- Uma vez obtidos os dados mais recentes, eles permanecem ativos e fixados como a nova base oficial definitiva até que uma nova sincronização manual traga números ainda mais recentes.

---

## 4. Checklist Obrigatório em Cada Atualização / Deploy
Antes de concluir qualquer entrega:
1. Validar que `restaurarTodosCachesPersistentes()` e a carga das fontes estão íntegras no `index.html`.
2. Validar que não há barras duplas literais `//` em scripts e que todos os botões de menu estão operacionais.
3. Commit e `git push origin main` para a nuvem do GitHub.
4. Sincronizar e `git push origin gh-pages` para a nuvem do GitHub Pages.
5. Executar `clasp push -f` e `clasp deploy -i AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV` para o Google Apps Script.
6. Auditar as versões na nuvem (`clasp deployments` e `git log`) e entregar os links oficiais validados.
