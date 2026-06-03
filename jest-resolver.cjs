const fs = require('fs');
const path = require('path');

const localExtensions = ['.ts', '.tsx', '.js', '.cjs', '.mjs', '.json'];

function resolveLocalFile(request, basedir) {
  if (!request.startsWith('./') && !request.startsWith('../')) {
    return null;
  }

  const candidateBase = path.resolve(basedir, request);
  const candidates = [];
  const ext = path.extname(candidateBase);

  if (ext) {
    candidates.push(candidateBase);
    if (ext === '.js') {
      candidates.push(candidateBase.replace(/\.js$/, '.ts'));
      candidates.push(candidateBase.replace(/\.js$/, '.tsx'));
    }
  } else {
    for (const extension of localExtensions) {
      candidates.push(`${candidateBase}${extension}`);
    }
    candidates.push(path.join(candidateBase, 'index.ts'));
    candidates.push(path.join(candidateBase, 'index.tsx'));
    candidates.push(path.join(candidateBase, 'index.js'));
    candidates.push(path.join(candidateBase, 'index.cjs'));
    candidates.push(path.join(candidateBase, 'index.mjs'));
  }

  for (const resolvedPath of candidates) {
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      return resolvedPath;
    }
  }

  return null;
}

module.exports = function resolver(request, options) {
  const localResolved = resolveLocalFile(request, options.basedir);

  if (localResolved) {
    return localResolved;
  }

  try {
    return require.resolve(request, { paths: [options.basedir] });
  } catch (error) {
    throw new Error(`Unable to resolve module ${request} from ${options.basedir} - Error: ${error}`);
  }
};
