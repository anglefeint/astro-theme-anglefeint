// JSON-backed, read-only virtual paths. No browser, network or system filesystem dependencies.
export function normalizePath(path, cwd = '/') {
  if (typeof path !== 'string' || path.length > 1024 || /[\0\r\n]/u.test(path))
    throw new Error('path');
  const parts = (path.startsWith('/') ? path : `${cwd}/${path}`).split('/');
  const result = [];
  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') result.pop();
    else result.push(part);
  }
  return '/' + result.join('/');
}

export function createFilesystem(entries = []) {
  const nodes = new Map([['/', Object.freeze({ path: '/', type: 'directory' })]]);
  for (const entry of entries.slice(0, 1000)) {
    const path = normalizePath(entry.path);
    const parts = path.split('/').filter(Boolean);
    for (let i = 1; i < parts.length; i++) {
      const parent = '/' + parts.slice(0, i).join('/');
      if (nodes.get(parent)?.type === 'file') throw new Error('path');
      nodes.set(parent, Object.freeze({ path: parent, type: 'directory' }));
    }
    if (nodes.has(path) && nodes.get(path).type !== entry.type) throw new Error('path');
    if (!['file', 'directory'].includes(entry.type)) throw new Error('path');
    nodes.set(path, Object.freeze({ ...entry, path }));
  }
  return {
    get(path, cwd = '/') {
      return nodes.get(normalizePath(path, cwd));
    },
    list(path, cwd = '/') {
      const parent = normalizePath(path, cwd);
      const prefix = parent === '/' ? '/' : parent + '/';
      return [...nodes.values()]
        .filter(
          (node) =>
            node.path !== parent &&
            node.path.startsWith(prefix) &&
            !node.path.slice(prefix.length).includes('/')
        )
        .sort((a, b) =>
          a.type === b.type ? a.path.localeCompare(b.path) : a.type === 'directory' ? -1 : 1
        );
    },
  };
}
