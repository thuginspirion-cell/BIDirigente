const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const s1Start = html.indexOf('<script>');
const s1End = html.indexOf('</script>', s1Start);
const s1 = html.substring(s1Start + 8, s1End);

const s2Start = html.indexOf('<script>', s1End);
const s2End = html.indexOf('</script>', s2Start);
const s2 = html.substring(s2Start + 8, s2End);

try {
  new vm.Script(s1);
  console.log('s1 compilou sem erro.');
} catch(e) {
  console.error('s1 erro de compilacao:', e.message);
}

try {
  new vm.Script(s2);
  console.log('s2 compilou sem erro.');
} catch(e) {
  console.error('s2 erro de compilacao:', e.message);
}
