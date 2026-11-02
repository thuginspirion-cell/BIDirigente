const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Subtítulo de Escolas
const oldSub = 'Gestão cadastral, indicadores de atendimento, unidades PEI, salas de tecnologia (Educatrons) e escolas em acompanhamento prioritário.';
const newSub = 'Gestão cadastral, indicadores de atendimento, unidades PEI, distribuição por município e escolas em acompanhamento prioritário.';
if (content.includes(oldSub)) {
  content = content.replace(oldSub, newSub);
  console.log('1. Subtítulo de escolas atualizado.');
} else {
  console.warn('1. Aviso: Subtítulo não encontrado exatamente.');
}

// 2. Remover <th> de Educatrons na tabela de escolas
const thEducatronsRegex = /\s*<th class="th-sortable" onclick="alternarOrdenacaoThEscolas\('educatrons'\)"[\s\S]*?<\/th>/;
if (thEducatronsRegex.test(content)) {
  content = content.replace(thEducatronsRegex, '');
  console.log('2. <th> de Educatrons removido com sucesso.');
} else {
  console.error('ERRO: <th> de Educatrons não encontrado!');
  process.exit(1);
}

// 3. Colspan de 8 para 7 no estado vazio
content = content.replace(
  '<td colspan="8" style="text-align: center; padding: 2.5rem 1rem;',
  '<td colspan="7" style="text-align: center; padding: 2.5rem 1rem;'
);
console.log('3. Colspan atualizado para 7.');

// 4. Remover <td> de Educatrons no renderizarTabelaEscolas
const tdEducatronsRegex = /\s*<td style="text-align: center;">\s*<span style="font-weight: 800; color: var\(--brand-navy\); background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 8px; border-radius: 6px;">\s*\$\{e\.educatrons \|\| 0\}\s*<\/span>\s*<\/td>/;
if (tdEducatronsRegex.test(content)) {
  content = content.replace(tdEducatronsRegex, '');
  console.log('4. <td> de Educatrons removido com sucesso.');
} else {
  console.error('ERRO: <td> de Educatrons não encontrado!');
  process.exit(1);
}

// 5. Remover educatrons de campos de ordenação e visual
content = content.replace(
  "var campos = ['cie', 'nome', 'cidade', 'segmento', 'diretor', 'educatrons', 'status'];",
  "var campos = ['cie', 'nome', 'cidade', 'segmento', 'diretor', 'status'];"
);

const sortEduBlockRegex = /\s*\} else if \(ordenacaoEscolasAtual\.campo === 'educatrons'\) \{\s*var btnEdu = document\.getElementById\('btn-sort-esc-educatrons'\);\s*if \(btnEdu\) btnEdu\.classList\.add\('active'\);/;
if (sortEduBlockRegex.test(content)) {
  content = content.replace(sortEduBlockRegex, '');
  console.log('5. Bloco de ordenação visual de educatrons removido.');
}

const sortEduSortRegex = /\s*if \(ordenacaoEscolasAtual\.campo === 'educatrons'\) \{\s*var numA = Number\(valA\) \|\| 0;\s*var numB = Number\(valB\) \|\| 0;\s*return ordenacaoEscolasAtual\.ordem === 'asc' \? numA - numB : numB - numA;\s*\}/;
if (sortEduSortRegex.test(content)) {
  content = content.replace(sortEduSortRegex, '');
  console.log('6. Lógica de sort de educatrons removida.');
}

// 7. Remover campo Educatrons do Modal de Cadastro/Edição de Escola
const formGroupEduRegex = /\s*<div class="agenda-form-group">\s*<label class="agenda-form-label">Educatrons Instalados<\/label>\s*<input type="number" id="form-escola-educatrons"[^>]*>\s*<\/div>/;
if (formGroupEduRegex.test(content)) {
  content = content.replace(formGroupEduRegex, '');
  console.log('7. Campo de formulário de Educatrons removido do modal.');
}

// 8. Ajustar carregar/salvar no form para não quebrar se o input não existir
content = content.replace(
  "document.getElementById('form-escola-educatrons').value = esc.educatrons || 16;",
  "const elEduInput = document.getElementById('form-escola-educatrons'); if (elEduInput) elEduInput.value = esc.educatrons || 12;"
);
content = content.replace(
  "const educatrons = parseInt(document.getElementById('form-escola-educatrons').value, 10) || 0;",
  "const elEduInp = document.getElementById('form-escola-educatrons'); const educatrons = elEduInp ? (parseInt(elEduInp.value, 10) || 0) : 0;"
);

// Normalizar quebras de linha para LF com BOM UTF-8
content = content.replace(/\r\n/g, '\n');
fs.writeFileSync(filePath, '\ufeff' + content.replace(/^\ufeff/, ''), 'utf8');
console.log('Todas as alterações de remoção da coluna Educatrons aplicadas com sucesso!');
