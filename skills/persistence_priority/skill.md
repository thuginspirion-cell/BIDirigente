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

## 3. Proibição Absoluta de Regressão e Espelhamento Fiel a Deleções (Padrão Universal de Setores)
- **Não-Regressão em Recarregamentos (F5 / Offline)**:
  - **JAMAIS** reverter dados para estados defasados, valores mockados iniciais ou contagens antigas após F5 (refresh), reinicialização do navegador ou troca de computador.
  - Em carregamento local, o armazenamento persistente (`BI_DIRIGENTE_CACHE_*`) prevalece sobre bases estáticas antigas embutidas no HTML.
- **Espelhamento Exato e Fidelidade a Deleções na Sincronização Completa (Todos os Setores Atuais e Futuros)**:
  - Aplica-se obrigatoriamente a **todos os setores existentes e futuros** (`SEINTEC`, `SEFIN`, `SECOMSE`, `DPAT`, `SEOM`, `SEFISC`, `SEGRE`, `SEMAT`, `SEVESC`, `SEPES`, `EEC`, `ASURE` e novos módulos).
  - Quando uma sincronização obtém a carga completa da planilha oficial do SharePoint/OneDrive, essa planilha é a **fonte única da verdade atual** e DEVE **SUBSTITUIR INTEGRALMENTE** o snapshot anterior em memória e no `localStorage` (`BI_DIRIGENTE_CACHE_*`).
  - É **TERMINANTEMENTE PROIBIDO** realizar *merge aditivo* (`cache_antigo + novos`) em sincronizações completas de planilhas, pois linhas **deletadas** na planilha oficial ficam presas no `localStorage` e voltam a aparecer na interface.
  - Toda sincronização bem-sucedida deve gravar exclusivamente o snapshot atual limpo (refletindo inclusões, edições e **exclusões**) e eliminar quaisquer chaves de cache legadas/duplicadas.

---

## 4. Checklist Obrigatório em Cada Atualização / Deploy
Antes de concluir qualquer entrega:
1. Validar que `restaurarTodosCachesPersistentes()` e a carga das fontes estão íntegras no `index.html`.
2. Validar que não há barras duplas literais `//` em scripts e que todos os botões de menu estão operacionais.
3. Commit e `git push origin main` para a nuvem do GitHub.
4. Sincronizar e `git push origin gh-pages` para a nuvem do GitHub Pages.
5. Executar `clasp push -f` e `clasp deploy -i AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV` para o Google Apps Script.
6. Auditar as versões na nuvem (`clasp deployments` e `git log`) e entregar os links oficiais validados.
