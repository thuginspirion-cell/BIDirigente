// scratch/inspect_user_history_margins.js
const fs = require('fs');
const transcript = fs.readFileSync('C:/Users/regiv/.gemini/antigravity/brain/545b4eee-837b-4178-8c23-348d2e2c474a/.system_generated/logs/transcript.jsonl', 'utf8');

const lines = transcript.split('\n');
lines.forEach(line => {
  if (!line.trim()) return;
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT' && data.content) {
      if (data.content.includes('margem') || data.content.includes('tabela') || data.content.includes('esquerda') || data.content.includes('centralize')) {
        console.log('USER:', data.content);
      }
    }
  } catch(e) {}
});
