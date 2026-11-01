const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const pGab = html.indexOf('id="pane-gabinete"');
const pSeintec = html.indexOf('id="pane-seintec"');

// Localizar o final de pane-gabinete
const searchStr = '                <tbody id="panel-records-tbody">\r\n                  <!-- Inserido dinamicamente via JS -->\r\n                </tbody>\r\n              </table>\r\n            </div>\r\n          </div>\r\n\r\n      </section>';

const replaceStr = '                <tbody id="panel-records-tbody">\r\n                  <!-- Inserido dinamicamente via JS -->\r\n                </tbody>\r\n              </table>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n      </section>';

if (!html.includes(searchStr)) {
  console.error("searchStr não encontrado exato!");
  process.exit(1);
}

html = html.replace(searchStr, replaceStr);

// Agora, no final de pane-seintec, nós havíamos retirado um </div> que fechava o container interno de seintec.
// Vamos conferir o número de aberturas e fechamentos de seintec
const sIdx = html.indexOf('id="pane-seintec"');
const sEnd = html.indexOf('</section>', sIdx);
const sContent = html.substring(sIdx, sEnd);
const openS = (sContent.match(/<div\b/gi) || []).length;
const closeS = (sContent.match(/<\/div>/gi) || []).length;
console.log('Seintec divs antes de ajustar:', openS, closeS);

// Se openS === closeS + 1, precisamos do </div> de fechamento
if (openS === closeS + 1) {
  const sSearch = '            </div>\r\n          </div>\r\n\r\n      </section>';
  const sReplace = '            </div>\r\n          </div>\r\n        </div>\r\n\r\n      </section>';
  html = html.replace(sSearch, sReplace);
  console.log("Fechamento de pane-seintec equilibrado!");
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Equilíbrio de tags concluído!");
