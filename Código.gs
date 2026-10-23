function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('BI da Dirigente - Gestão da Rede Escolar');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getConsolidatedData() {
  return {
    indicadoresRede: {
      escolas: 87,
      nucleos: 6,
      visitas: 145,
      demandasAtivas: 0,
      eficiencia: "85%"
    },
    visitasDirigente: {
      concluidas: 145,
      meta: 160,
      percentual: 90
    },
    escolasAtencao: [
      { nome: "EE Prof. José Barreto", cidade: "Itapevi", motivo: "Demanda de infraestrutura elétrica", prioridade: "Alta prioridade" },
      { nome: "EE Raul Briquet", cidade: "Itapevi", motivo: "Reposição de quadro docente e tecnologia", prioridade: "Alta prioridade" },
      { nome: "EE Celso Pacheco Bentley", cidade: "Itapevi", motivo: "Reforma quadra poliesportiva e cobertura", prioridade: "Alta prioridade" }
    ],
    agendaHoje: [
      { hora: "08:00", titulo: "Reunião de Alinhamento com Supervisores e Dirigente", status: "ocupado" },
      { hora: "09:30", titulo: "Despachos do Gabinete e Assinatura de Termos", status: "livre" },
      { hora: "14:00", titulo: "Visita Técnica Regional: Polo Itapevi e Núcleos", status: "ocupado" },
      { hora: "16:30", titulo: "Alinhamento com SEAFIN e NOM sobre Execução Orçamentária", status: "livre" }
    ]
  };
}

// === LÓGICA DE UPLOAD ORGANIZADA POR CENTRO E SETOR ===

function processFileUpload(arquivoObj, setor, centro) {
  try {
    // 1. Pasta principal
    var nomePastaPrincipal = "Uploads BIDirigente";
    var pastas = DriveApp.getFoldersByName(nomePastaPrincipal);
    var pastaPrincipal = pastas.hasNext() ? pastas.next() : DriveApp.createFolder(nomePastaPrincipal);
    
    // 2. Pasta do Centro (ex: SEINTEC, AssessoriaTecnica, CAF, CGE)
    var pastaDestino = pastaPrincipal;
    if (centro) {
      var pastasCentro = pastaPrincipal.getFoldersByName(centro);
      pastaDestino = pastasCentro.hasNext() ? pastasCentro.next() : pastaPrincipal.createFolder(centro);
    }
    
    // 3. Subpasta do Setor (ex: SEINTEC, NOM, SEAFIN, SEGRE)
    if (setor) {
      var pastasSetor = pastaDestino.getFoldersByName(setor);
      pastaDestino = pastasSetor.hasNext() ? pastasSetor.next() : pastaDestino.createFolder(setor);
    }
    
    // 4. Salva o arquivo decodificado em base64
    var blob = Utilities.newBlob(Utilities.base64Decode(arquivoObj.data), arquivoObj.mimeType, arquivoObj.fileName);
    var novoArquivo = pastaDestino.createFile(blob);
    try {
      novoArquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(e) {}
    
    return novoArquivo.getUrl();
  } catch (erro) {
    throw new Error("Falha ao salvar o arquivo: " + erro.toString());
  }
}

function processMultipleFilesUpload(arquivosArray, setor, centro) {
  try {
    var nomePastaPrincipal = "Uploads BIDirigente";
    var pastas = DriveApp.getFoldersByName(nomePastaPrincipal);
    var pastaPrincipal = pastas.hasNext() ? pastas.next() : DriveApp.createFolder(nomePastaPrincipal);
    
    var pastaDestino = pastaPrincipal;
    if (centro) {
      var pastasCentro = pastaPrincipal.getFoldersByName(centro);
      pastaDestino = pastasCentro.hasNext() ? pastasCentro.next() : pastaPrincipal.createFolder(centro);
    }
    
    if (setor) {
      var pastasSetor = pastaDestino.getFoldersByName(setor);
      pastaDestino = pastasSetor.hasNext() ? pastasSetor.next() : pastaDestino.createFolder(setor);
    }
    
    var resultados = [];
    for (var i = 0; i < arquivosArray.length; i++) {
      var arq = arquivosArray[i];
      var blob = Utilities.newBlob(Utilities.base64Decode(arq.data), arq.mimeType, arq.fileName);
      var novoArquivo = pastaDestino.createFile(blob);
      try {
        novoArquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch(e) {}
      
      resultados.push({
        fileName: arq.fileName,
        url: novoArquivo.getUrl(),
        id: novoArquivo.getId(),
        size: novoArquivo.getSize(),
        tipo: arq.fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'excel'
      });
    }
    return resultados;
  } catch (erro) {
    throw new Error("Falha ao salvar múltiplos arquivos: " + erro.toString());
  }
}

function compartilharScriptPublico() {
  try {
    var id = ScriptApp.getScriptId();
    var file = DriveApp.getFileById(id);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return "Sucesso: " + file.getName() + " compartilhado com qualquer pessoa com o link!";
  } catch (e) {
    return "Erro: " + e.toString();
  }
}


