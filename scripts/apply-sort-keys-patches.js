const fs = require('fs');
const path = require('path');
const patchesPath = path.join(process.cwd(), 'sort-keys-patches.json');
if (!fs.existsSync(patchesPath)) { console.error('Missing', patchesPath); process.exit(1); }
const patches = JSON.parse(fs.readFileSync(patchesPath,'utf8'));
for (const p of patches) {
  const target = path.join(process.cwd(), p.file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, p.content, 'utf8');
  console.log('wrote', p.file);
}
console.log('Applied', patches.length, 'patches');
