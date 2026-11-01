const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const pSeintec = html.indexOf('id="pane-seintec"');
const pSeintecEnd = html.indexOf('</section>', pSeintec);

// O trecho com o </div> extra no final de pane-seintec:
const beforeSectionEnd = html.substring(pSeintecEnd - 100, pSeintecEnd);
console.log('Antes:', JSON.stringify(beforeSectionEnd));

// O trecho atual tem 3 </div>s fechando:
// </div> (fecha table-responsive)
// </div> (fecha detail-tab-content)
// </div> (ESTE É O EXTRA QUE FECHA A VIEW-CONTAINER PREMATURAMENTE!)
// Vamos remover o </div> extra

const oldSnippet = '            </div>\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </section>';
const newSnippet = '            </div>\r\n          </div>\r\n\r\n      </section>';

if (!html.includes(oldSnippet)) {
  console.error("oldSnippet não encontrado exato!");
  process.exit(1);
}

html = html.replace(oldSnippet, newSnippet);
fs.writeFileSync('index.html', html, 'utf8');
console.log("<div> extra de pane-seintec removido com sucesso!");
