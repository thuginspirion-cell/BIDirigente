const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const pSeintec = html.indexOf('id="pane-seintec"');
const pSeintecEnd = html.indexOf('</section>', pSeintec);
const seintecContent = html.substring(pSeintec, pSeintecEnd);

console.log(seintecContent.substring(seintecContent.length - 200));

// Remover o </div> a mais no final de pane-seintec
const oldSnippet = '            </div>\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </section>';
const newSnippet = '            </div>\r\n          </div>\r\n\r\n      </section>';

if (html.includes(oldSnippet)) {
  html = html.replace(oldSnippet, newSnippet);
  console.log("Substituição realizada!");
  fs.writeFileSync('index.html', html, 'utf8');
} else {
  console.log("oldSnippet não encontrado, verificando variantes...");
}
