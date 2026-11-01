const fs = require('fs');
const html = fs.readFileSync('scratch/context2_html.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<script')) {
    console.log(`Script tag at line ${i+1}: ${l.substring(0, 100)}`);
  }
  if (l.includes('</script>')) {
    console.log(`Script close tag at line ${i+1}`);
  }
});
