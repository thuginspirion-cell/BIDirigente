const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const checkIndices = [873, 1743, 1775, 1792, 1814, 2335, 2350, 11393, 13407, 15901, 16497, 18227];

checkIndices.forEach(idx => {
  console.log(`\n================ Linha ${idx} ================`);
  console.log(lines.slice(idx - 2, idx + 18).join('\n'));
});
