---
name: persistence-priority
description: Garante prioridade absoluta às fontes de dados em nuvem, sincronização por demanda na força bruta sem login Microsoft, controle proativo do teto de 50 MB do Google Apps Script, transparência real de timestamps nos balões de sincronização e não-regressão universal.
---

# Regra de Ouro: Prioridade de Dados na Nuvem, Sincronização Bruta Sem Login, Teto GAS e Transparência Real

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

---

## 2. Regra do Teto do Google Apps Script (50 MB `UrlFetchApp` / Base64) & Motor Seletivo Cirúrgico (`HTTP 206 Range`)
Ao integrar **qualquer setor novo** ou manter setores existentes cujas planilhas no SharePoint possuem abas não exibidas no BI ou crescem com o tempo:

1. **Padrão Universal Obrigatório (`abasNecessarias` + Extração Seletiva `HTTP 206 Range`):**
   - Toda função de sincronização no [`Código.gs`](../../Código.gs) DEVE passar `opcoes.abasNecessarias: [...]` listando **exclusivamente** as abas realmente lidas pelo BI para [`obterArquivoPublicoSharepoint`](../../Código.gs).
   - Para arquivos acima de `1,5 MB`, o motor executa automaticamente [`obterAbasSeletivasSharepointZip_`](../../Código.gs):
     1. Sonda o tamanho via `Range: bytes=0-1` (`HTTP 206 Partial Content`).
     2. Baixa os últimos `64 KB` do `.xlsx` (ZIP Central Directory).
     3. Lê `xl/workbook.xml` e `xl/_rels/workbook.xml.rels` em paralelo.
     4. Baixa via `UrlFetchApp.fetchAll` (`HTTP 206 Range`) **somente** os metadados essenciais + as abas em `abasNecessarias`, ignorando abas inchadas não usadas (ex.: no SEGRE `65,64 MB -> ~1,15 MB`; no SEMAT `26,55 MB -> ~1,33 MB`), e remonta um Mini-XLSX válido em memória RAM.
   - Isso garante sincronização **100% ao vivo direto do SharePoint no segundo do clique** tanto no **GS/GAS** quanto no **GHP**, sem depender de agendamentos nem de limpeza manual no Excel do setor.

2. **Fallback Resiliente (`data/*.json`):**
   - Só acionar espelho `data/*.json` caso o SharePoint esteja temporariamente indisponível ou bloqueie `HTTP 206` em algum servidor futuro; nesse caso usar [`scripts/sync_all_mirrors.js`](../../scripts/sync_all_mirrors.js) e sempre preservar o timestamp real da coleta.

3. **Controle do Teto do `PropertiesService` (500 KB) para Módulos Editáveis:**
   - Dados gravados via `gravarEstadoNuvem` (`CARRO_DATA`, `AGENDA_DATA`, `ESCOLAS_DATA`, `VISITAS_DATA`) compartilham a cota total de **500 KB** do `PropertiesService.getScriptProperties()`. Monitorar periodicamente o consumo e migrar para aba em Google Sheets antes de atingir 80% da cota quando o volume diário crescer.

---

## 3. Regra Anti-Mentira de Sincronização (Transparência Real de Timestamps e Balões)
- **TERMINANTEMENTE PROIBIDO falsificar a hora da atualização:**
  - Quando os dados vierem de um **JSON espelho/cache (`data/*.json`)** ou de fallback local após falha de rede, é **PROIBIDO** sobrescrever `meta.atualizadoFormatado` com `new Date()`.
  - Deve-se preservar exatamente a data/hora real da última extração da planilha (`novos.meta.atualizadoFormatado`) e exibir no cabeçalho e no balão qual foi a fonte real:
    - **SharePoint Ao Vivo (`dadosBase64` processado agora):** pode gravar hora atual e mostrar `"Atualizado em Tempo Real do SharePoint"`.
    - **Espelho Automático Nuvem (JSON do GitHub):** preservar `meta.atualizadoFormatado` real do JSON e informar claramente *"Espelho Nuvem (coleta SharePoint de DD/MM/AAAA às HH:mm)"*.
    - **Erro/Sem conexão:** nunca exibir *"Sincronizado com Sucesso!"*; informar com clareza que a conexão falhou e qual base anterior permanece exibida.

---

## 4. Mecanismo Público Anônimo SharePoint (Zero Login) & Política Nuvem Exclusiva
- Todas as fontes de dados dos setores são links públicos (*"Qualquer pessoa com o link pode visualizar"*). Nunca exigir login Microsoft ou MFA.
- [`obterArquivoPublicoSharepoint`](../../Código.gs) realiza handshake em 2 etapas com repasse de cookies (`FedAuth`, `rtFa`) e validação de assinatura binária XLSX (`PK\x03\x04` / `UEsDB`).
- **Zero armazenamento local no navegador:** Proibido `localStorage`, `sessionStorage` e `document.cookie` para dados operacionais. `limparTodoArmazenamentoLocal()` purga resíduos na inicialização e `hidratarTodosModulosNuvem()` + `sincronizarTudoGlobalmente(true)` buscam tudo da nuvem.
- **Substituição integral (zero merge aditivo):** toda carga completa substitui integralmente o array em memória, garantindo fidelidade a deleções.

---

## 5. Checklist Obrigatório em Cada Atualização / Deploy
1. Se integrou/alterou setor do SharePoint:
   - Conferir tamanho real do `.xlsx` no SharePoint e testar o endpoint no GAS.
   - Arquivos leves (`<= 18 MB`): garantir SharePoint Live em primeiro lugar (`Código.gs`).
   - Arquivos pesados (`> 20 MB`): garantir inclusão em `scripts/sync_all_mirrors.js` e `.github/workflows/sync-sharepoint-mirrors.yml`.
   - Verificar que nenhum callback de espelho/fallback sobrescreve `meta.atualizadoFormatado` com `new Date()`.
2. Validar zero `localStorage`/`sessionStorage`/cookies operacionais, zero `//` literal em `<script>`, todos os 13+ botões de menu e `scripts/validate_integrity.js`.
3. Commit e `git push origin main` + sincronizar `gh-pages` (`git push origin gh-pages`).
4. Executar `cmd /c clasp push -f` e `cmd /c clasp deploy -i AKfycby5KrABd0fS11O_2Fuoc9yDsR-r124nzfsDOO0NWVRwNdpWp6YZ99NkyZtbOaVYO5PV`.
5. Auditar `clasp deployments` e entregar links oficiais validados (GS, GHP, GAS).
