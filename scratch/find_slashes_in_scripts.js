const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
let inScript = false;
let scriptStart = 0;

lines.forEach((line, idx) => {
  if (line.includes('<script')) {
    inScript = true;
    scriptStart = idx + 1;
  }
  if (inScript && line.includes('://')) {
    // Exclude src= attribute in <script src="...">
    if (!line.includes('<script src=')) {
      console.log(`Line ${idx + 1} (in script starting at ${scriptStart}): ${line.trim()}`);
    }
  }
  if (line.includes('</script>')) {
    inScript = false;
  }
});
