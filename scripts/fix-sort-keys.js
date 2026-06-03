const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'sort-keys-utf8.json');
if (!fs.existsSync(dataPath)) {
  console.error('Missing', dataPath);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const coll = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
function naturalSort(a, b) { return coll.compare(a, b); }
function findObjectRange(lines, line) {
  let i = line - 1; // zero-based
  // find opening brace
  let openLine = -1, openCol = -1;
  for (let l = i; l >= 0; l--) {
    const idx = lines[l].lastIndexOf('{');
    if (idx !== -1) { openLine = l; openCol = idx; break; }
  }
  if (openLine === -1) return null;
  // find matching closing
  let depth = 0;
  for (let l = openLine; l < lines.length; l++) {
    for (let c = 0; c < lines[l].length; c++) {
      const ch = lines[l][c];
      if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return { startLine: openLine, startCol: openCol, endLine: l, endCol: c }; }
    }
  }
  return null;
}
function parseKey(raw) {
  raw = raw.trim();
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) return raw.slice(1, -1);
  return raw;
}
const patches = [];
for (const f of data) {
  if (!f.messages || !f.messages.length) continue;
  const file = f.filePath;
  const src = f.source || fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  const processedRanges = [];
  for (const m of f.messages) {
    const r = findObjectRange(lines, m.line);
    if (!r) continue;
    const rangeKey = `${r.startLine}:${r.endLine}`;
    if (processedRanges.includes(rangeKey)) continue;
    processedRanges.push(rangeKey);
    const blockLines = lines.slice(r.startLine, r.endLine + 1);
    const block = blockLines.join('\n');
    const inner = block.replace(/^[^{]*{/, '').replace(/}[^}]*$/,'');
    // split into property entries by commas at depth 0
    const items = [];
    let cur = '';
    let depth = 0;
    const innerLines = inner.split(/\n/);
    for (const L of innerLines) {
      let s = L;
      for (const ch of s) {
        if (ch === '{' || ch === '[') depth++;
        else if (ch === '}' || ch === ']') depth--;
      }
      if (cur.length) cur += '\n' + L; else cur = L;
      if (depth === 0 && /,\s*$/.test(L)) { items.push(cur); cur = ''; }
    }
    if (cur.trim()) items.push(cur);
    const entries = items.map(it => {
      const mm = it.match(/^\s*(["']?[^:"']+["']?)\s*:/);
      const keyRaw = mm ? mm[1].trim() : it.trim().split(':')[0].trim();
      const key = parseKey(keyRaw);
      return { key, keyRaw, body: it.replace(/,\s*$/,'').trim() };
    });
    if (entries.length <= 1) continue; // nothing to sort
    entries.sort((a, b) => naturalSort(a.key.toLowerCase(), b.key.toLowerCase()));
    const newInner = entries.map(e => '  ' + e.body).join(',\n');
    const newBlock = block.replace(/\{[\s\S]*\}/, '{\n' + newInner + '\n}');
    const newBlockLines = newBlock.split(/\n/);
    lines.splice(r.startLine, r.endLine - r.startLine + 1, ...newBlockLines);
  }
  const newSrc = lines.join('\n');
  if (newSrc !== src) {
    patches.push({ file: path.relative(process.cwd(), file).replace(/\\/g, '/'), content: newSrc });
  }
}
fs.writeFileSync('sort-keys-patches.json', JSON.stringify(patches, null, 2), 'utf8');
console.log('wrote sort-keys-patches.json with', patches.length, 'patches');
