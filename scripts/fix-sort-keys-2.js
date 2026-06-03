const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'sort-keys-utf8.json');
if (!fs.existsSync(dataPath)) { console.error('Missing', dataPath); process.exit(1); }
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const coll = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
function naturalSort(a,b){return coll.compare(a,b);} 
function findObjectRange(lines, line){
  let i=line-1;
  // find opening brace that starts an object which encloses the line
  for(let l=i;l>=0;l--){
    const str = lines.slice(l, i+1).join('\n');
    // if there's more '{' than '}' in this slice, assume start at last '{'
    const opens = (str.match(/\{/g)||[]).length;
    const closes = (str.match(/\}/g)||[]).length;
    if(opens>closes){
      const lastIdx = lines[l].lastIndexOf('{');
      if(lastIdx!==-1) return {startLine:l,startCol:lastIdx};
    }
  }
  return null;
}
function extractBlockRange(lines, startLine, startCol){
  let depth=0; let inStr=null; let escaped=false; let startIdx = -1;
  for(let l=startLine;l<lines.length;l++){
    const line = lines[l];
    for(let c=(l===startLine?startCol:0); c<line.length;c++){
      const ch=line[c];
      if(inStr){
        if(!escaped && ch===inStr){ inStr=null; }
        escaped = !escaped && ch==='\\';
        continue;
      }
      if(ch==='"' || ch==="'" || ch==='`'){ inStr=ch; escaped=false; continue; }
      if(ch==='{'){ if(depth===0) startIdx = (l<<16)|c; depth++; }
      else if(ch==='}'){ depth--; if(depth===0){ const endLine=l; const endCol=c; return {startLine,startCol,endLine,endCol}; }}
    }
  }
  return null;
}
function parseProperties(block){
  // block includes braces
  const inner = block.slice(block.indexOf('{')+1, block.lastIndexOf('}'));
  const props = [];
  let i=0; const N=inner.length; let inStr=null, escaped=false, depth=0; let keyStart=-1; let keyEnd=-1; 
  while(i<N){
    const ch=inner[i];
    if(inStr){ if(!escaped && ch===inStr){ inStr=null; } escaped = !escaped && ch==='\\'; i++; continue; }
    if(ch==='"' || ch==="'" || ch==='`'){ inStr=ch; escaped=false; i++; continue; }
    if(ch==='{'||ch==='['||ch==='('){ depth++; i++; continue; }
    if(ch==='}'||ch===']'||ch===')'){ depth--; i++; continue; }
    if(depth===0){
      // look for key: pattern
      // skip whitespace
      while(i<N && /\s/.test(inner[i])) i++;
      if(i>=N) break;
      // parse key token
      let kStart=i; let kEnd=i;
      if(inner[i]==='"' || inner[i]==="'"){
        const q = inner[i]; i++; while(i<N){ if(inner[i]===q && inner[i-1] !== '\\') { i++; break; } i++; } kEnd=i; }
      else if(inner[i]==='['){ // computed
        i++; while(i<N){ if(inner[i]===']') { i++; break; } i++; } kEnd=i; }
      else { // identifier
        while(i<N && /[^:\s]/.test(inner[i]) && inner[i]!==':') i++; kEnd=i; }
      // skip spaces
      while(i<N && /\s/.test(inner[i])) i++;
      if(inner[i]!==':'){ // not a property
        // skip to next comma/top-level separator
        while(i<N && !(inner[i]===',' && depth===0)) i++; if(inner[i]===',') i++; continue;
      }
      // key token = inner.slice(kStart,kEnd)
      const keyRaw = inner.slice(kStart,kEnd).trim();
      // skip colon
      i++; // skip ':'
      // skip whitespace
      while(i<N && /\s/.test(inner[i])) i++;
      // capture value until top-level comma
      let valStart=i; let valEnd=i; let valDepth=0; let inStr2=null; let esc2=false;
      while(i<N){ const ch2=inner[i]; if(inStr2){ if(!esc2 && ch2===inStr2){ inStr2=null; } esc2 = !esc2 && ch2==='\\'; i++; continue; } if(ch2==='"' || ch2==="'" || ch2==='`'){ inStr2=ch2; esc2=false; i++; continue; } if(ch2==='{'||ch2==='['||ch2==='('){ valDepth++; i++; continue; } if(ch2==='}'||ch2===']'||ch2===')'){ valDepth--; i++; continue; } if(valDepth===0 && ch2===','){ valEnd=i; i++; break; } i++; }
      if(valEnd===valStart) valEnd=i;
      const prop = inner.slice(kStart, valEnd).trim();
      props.push({ keyRaw, prop });
    } else {
      i++;
    }
  }
  return props;
}

const patches = [];
for(const f of data){ if(!f.messages||!f.messages.length) continue; const file = f.filePath; const src = f.source || fs.readFileSync(file,'utf8'); const lines = src.split(/\r?\n/);
  const doneRanges = new Set();
  for(const m of f.messages){ const maybe = findObjectRange(lines,m.line); if(!maybe) continue; const blockRange = extractBlockRange(lines, maybe.startLine, maybe.startCol); if(!blockRange) continue; const key=`${blockRange.startLine}:${blockRange.endLine}`; if(doneRanges.has(key)) continue; doneRanges.add(key);
    const blockLines = lines.slice(blockRange.startLine, blockRange.endLine+1); const block = blockLines.join('\n'); const props = parseProperties(block);
    if(props.length<=1) continue; // nothing to do
    // build entries preserving original prop bodies
    const entries = props.map(p=>{
      // derive key string
      let k = p.keyRaw.trim(); if((k.startsWith("'")&&k.endsWith("'"))||(k.startsWith('"')&&k.endsWith('"'))) k=k.slice(1,-1);
      return { key:k, raw:p.prop };
    });
    entries.sort((a,b)=>naturalSort(a.key.toLowerCase(), b.key.toLowerCase()));
    const newInner = entries.map(e=> '  ' + e.raw.replace(/\s*$/, '')).join(',\n');
    const newBlock = block.replace(/\{[\s\S]*\}/, '{\n'+newInner+'\n}');
    const newBlockLines = newBlock.split(/\n/);
    lines.splice(blockRange.startLine, blockRange.endLine - blockRange.startLine +1, ...newBlockLines);
  }
  const newSrc = lines.join('\n'); if(newSrc!==src){ patches.push({ file: path.relative(process.cwd(), file).replace(/\\/g,'/'), content:newSrc }); }
}
fs.writeFileSync('sort-keys-patches-2.json', JSON.stringify(patches,null,2),'utf8');
console.log('wrote sort-keys-patches-2.json with', patches.length, 'patches');
