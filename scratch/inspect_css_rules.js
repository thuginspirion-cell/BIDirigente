const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regexList = [
  /\.view-container\s*\{[^}]*\}/g,
  /#pane-home[^{]*\{[^}]*\}/g,
  /#pane-gestao-hoje[^{]*\{[^}]*\}/g,
  /\.gestao-header-card[^{]*\{[^}]*\}/g,
  /\.executive-hero[^{]*\{[^}]*\}/g,
  /@media[^{]*\{[\s\S]*?\.view-container[\s\S]*?\}/g
];

regexList.forEach(r => {
  const matches = html.match(r) || [];
  matches.forEach(m => console.log(m + '\n'));
});
