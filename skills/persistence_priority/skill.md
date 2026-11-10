---
name: persistence-priority
description: Garante prioridade absoluta às fontes de dados em nuvem, persistência e proibição total de regressão a dados antigos em qualquer dispositivo (casa, escritório, viagem).
---

# Regra de Ouro: Prioridade de Dados na Nuvem e Não-Regressão Universal

Esta regra e habilidade é de observância obrigatória e primordial para o projeto **BI Dirigente**.

## 1. Acesso e Operação Ubíqua na Nuvem (Multi-Dispositivos)
- O usuário opera em diferentes locais e máquinas: **PC de casa**, **escritório** e **notebook em trânsito/viagem**.
- Todas as regras, códigos, memórias e arquivos deste projeto devem residir e ser sincronizados **100% na Nuvem**:
  - Repositório Remoto GitHub: `https://github.com/thuginspirion-cell/BIDirigente` (branches `main` e `gh-pages`)
  - Google Apps Script (GAS): ID `1Rmp1KzkMkRYv3LdW17U4ELQigb7xtD9IH9TfqEmaRo1xySYeVRuhc5fH`
  - Google Sites (GS): `https://sites.google.com/view/bi-dirigente`
  - GitHub Pages (GHP): `https://thuginspirion-cell.github.io/BIDirigente/`
- NENHUMA dependência, arquivo essencial ou memória pode ficar isolada apenas no disco rígido local sem commit/push imediato.

## 2. Prioridade Absoluta das Fontes de Dados
- Toda inicialização e rotina de sincronização DEVE **priorizar as fontes de dados oficiais na nuvem** (SharePoint / Planilhas públicas dos setores: SEINTEC, SEAFIN, SEOM, SEGRE, SEPES, etc.).
- Vasculhar todas as fontes, processar as bases e renderizar imediatamente na tela os dados mais recentes.

## 3. Proibição Terminante de Regressão a Dados Antigos
- **JAMAIS** reverter dados para estados defasados, valores mockados iniciais ou contagens antigas após F5 (refresh), reinicialização do navegador ou troca de computador.
- Uma vez obtidos os dados mais recentes, eles permanecem ativos e fixados como o novo padrão até que uma nova sincronização traga dados ainda mais recentes.

## 4. Checklist Obrigatório em Cada Atualização / Deploy
Antes de concluir qualquer entrega:
1. Validar que `restaurarTodosCachesPersistentes()` e a carga das fontes estão íntegras no `index.html`.
2. Validar que não há `//` em scripts e que os botões de menu estão operacionais.
3. Commit e `git push origin main` para a nuvem do GitHub.
4. Sincronizar e `git push origin gh-pages` para a nuvem do GitHub Pages.
5. Executar `clasp push -f` e `clasp deploy` para o Google Apps Script.
