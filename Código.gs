function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getConsolidatedData() {
  return {
    indicadoresRede: "85% de Eficiência",
    nucleosAtencao: "12 Núcleos Ativos",
    visitasRealizadas: "145 neste mês",
    agendaHoje: [
      { hora: "08:00", titulo: "Reunião de Planejamento Semanal", status: "ocupado" },
      { hora: "09:30", titulo: "Horário Livre para Despachos", status: "livre" }
    ]
  };
}

// === LÓGICA DE UPLOAD ATUALIZADA (SEPARADA POR SETOR) ===

function processFileUpload(arquivoObj, setor) {
  try {
    // 1. Encontra ou cria a pasta principal
    var nomePastaPrincipal = "Uploads BIDirigente";
    var pastas = DriveApp.getFoldersByName(nomePastaPrincipal);
    var pastaPrincipal = pastas.hasNext() ? pastas.next() : DriveApp.createFolder(nomePastaPrincipal);
    
    // 2. Encontra ou cria a subpasta do SETOR específico
    var pastasSetor = pastaPrincipal.getFoldersByName(setor);
    var pastaSetor = pastasSetor.hasNext() ? pastasSetor.next() : pastaPrincipal.createFolder(setor);
    
    // 3. Salva o arquivo dentro da subpasta do setor
    var blob = Utilities.newBlob(Utilities.base64Decode(arquivoObj.data), arquivoObj.mimeType, arquivoObj.fileName);
    var novoArquivo = pastaSetor.createFile(blob);
    
    return novoArquivo.getUrl();
  } catch (erro) {
    throw new Error("Falha ao salvar o arquivo no setor " + setor + ": " + erro.toString());
  }
}