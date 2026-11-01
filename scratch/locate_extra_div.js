const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const target = `            </div>
          </div>

        </div>

      </section>`;

const targetIdx = html.indexOf(target);
console.log('Target encontrado?', targetIdx !== -1);
if (targetIdx !== -1) {
  console.log(html.substring(targetIdx - 200, targetIdx + target.length + 100));
}
