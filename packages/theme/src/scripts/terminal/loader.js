export function createTerminalLoader({ signal, maxLength = 262144 } = {}) {
  const cache = new Map();
  let size = 0,
    disposed = false;
  return {
    async read(file) {
      if (disposed || signal?.aborted) throw new Error('disposed');
      if (typeof file.content === 'string') {
        if (file.content.length > maxLength) throw new Error('tooLarge');
        return file.content;
      }
      if (cache.has(file.path)) return cache.get(file.path);
      const url = new URL(file.url, location.href);
      if (url.origin !== location.origin || !/^https?:$/u.test(url.protocol))
        throw new Error('source');
      const response = await fetch(url, { signal, credentials: 'same-origin' });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json'))
        throw new Error('source');
      // Consume a bounded stream, not an unbounded response.json() allocation.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = '',
        bytes = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
          if (bytes > maxLength * 6 + 1024) throw new Error('tooLarge');
          text += decoder.decode(value, { stream: true });
        }
        text += decoder.decode();
      } finally {
        await reader.cancel().catch(() => {});
      }
      const data = JSON.parse(text);
      if (typeof data.content !== 'string') throw new Error('source');
      if (data.content.length > maxLength) throw new Error('tooLarge');
      if (disposed || signal?.aborted) throw new Error('disposed');
      while (cache.size && (cache.size >= 4 || size + data.content.length > maxLength * 4)) {
        const key = cache.keys().next().value;
        size -= cache.get(key).length;
        cache.delete(key);
      }
      cache.set(file.path, data.content);
      size += data.content.length;
      return data.content;
    },
    dispose() {
      disposed = true;
      cache.clear();
      size = 0;
    },
  };
}
