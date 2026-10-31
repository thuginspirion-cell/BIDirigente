// scratch/fix_all_pane_depths.js
const fs = require('fs');

console.log('Verificando o fechamento balanceado de DIVs em CADA seção do projeto...');
let html = fs.readFileSync('index.html', 'utf8');

const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Corrigir a </div> duplicada no final de pane-seintec
const targetOldSeintecEnd = `    </table>
            </div>
          </div>


        </div>
        </div>

      </section>`;

const targetNewSeintecEnd = `    </table>
            </div>
          </div>

        </div>

      </section>`;

if (html.includes(targetOldSeintecEnd)) {
  html = html.replace(targetOldSeintecEnd, targetNewSeintecEnd);
  console.log('✓ Removida </div> excedente no final de pane-seintec!');
} else {
  console.log('! targetOldSeintecEnd não encontrado textualmente, tentando regex...');
  html = html.replace(
    /(<tbody id="panel-seintec-tbody">[\s\S]*?<\/table>\s*<\/div>\s*<\/div>\s*<\/div>)\s*<\/div>\s*(<\/section>)/,
    '$1\n      $2'
  );
}

// 2. Agora verificar o depth de TODAS as seções
const sections = [
  'pane-home',
  'pane-centro',
  'pane-gabinete',
  'pane-seintec',
  'pane-gestao-hoje',
  'pane-agenda',
  'pane-carro',
  'pane-escolas',
  'pane-visitas'
];

sections.forEach(s => {
  const pStart = html.indexOf(`id="${s}"`);
  const pEnd = html.indexOf('</section>', pStart);
  const snippet = html.substring(pStart, pEnd);

  let depth = 0;
  const tagRegex = /<\/?div\b[^>]*>/g;
  let m;
  while ((m = tagRegex.exec(snippet)) !== null) {
    if (m[0].startsWith('</')) depth--;
    else depth++;
  }
  console.log(`Seção [${s}] -> saldo de divs: ${depth}`);
});

// 3. Verificar o depth do view-container como um todo
const vcStart = html.indexOf('<div class="view-container">');
const pVisitas = html.indexOf('id="pane-visitas"');
const pVisitasEnd = html.indexOf('</section>', pVisitas);
const pVcEnd = html.indexOf('</div>\n  </main>', pVisitasEnd);

const insideVc = html.substring(vcStart + '<div class="view-container">'.length, pVcEnd);

let totalDepth = 1;
const tagRegex = /<\/?div\b[^>]*>/g;
let m;
let hadZeroBeforeEnd = false;
while ((m = tagRegex.exec(insideVc)) !== null) {
  if (m[0].startsWith('</')) totalDepth--;
  else totalDepth++;

  if (totalDepth <= 0) {
    hadZeroBeforeEnd = true;
    console.log(`ALERTA: totalDepth caiu para ${totalDepth} na posição ${m.index}!`);
    console.log(insideVc.substring(m.index - 50, m.index + 50));
    break;
  }
}

if (!hadZeroBeforeEnd) {
  console.log('PERFEITO! view-container agora envolve TODAS as abas sem fechar prematuramente! totalDepth ao final:', totalDepth);
}

// Restaurar CRLF
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html salvo com sucesso!');
