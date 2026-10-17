// Canvas output only. Text layout is cached between cursor blinks.
export function createTerminalRenderer(
  canvas,
  { fontSize, lineHeight, fontFamily, padding, colors }
) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  let width = 0,
    height = 0,
    dpr = 1,
    inset = { ...padding },
    cached,
    rows = [],
    pageSize = 1;
  const glyphWidths = new Map();
  function wrap(text) {
    const result = [];
    const available = Math.max(fontSize, width - inset.x * 2);
    let line = '',
      length = 0;
    for (const char of text) {
      if (glyphWidths.size >= 4096) glyphWidths.clear();
      if (!glyphWidths.has(char)) glyphWidths.set(char, ctx.measureText(char).width);
      const size = glyphWidths.get(char);
      if (length + size > available && line) {
        result.push(line);
        line = '';
        length = 0;
      }
      line += char;
      length += size;
    }
    result.push(line);
    return result;
  }
  return {
    get pageSize() {
      return pageSize;
    },
    resize(nextPadding) {
      if (nextPadding) inset = { ...inset, ...nextPadding };
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      cached = undefined;
    },
    draw({ lines, prompt, input, cursor, scroll = 0, reader }) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ${fontFamily}`;
      if (reader) {
        if (!cached || cached.reader !== reader) {
          rows = reader.lines.flatMap((text) => wrap(text));
          cached = { reader };
        }
        const bodyY = inset.y + lineHeight * 2;
        pageSize = Math.max(1, Math.floor((height - bodyY - lineHeight * 3 - 12) / lineHeight));
        const maximum = Math.max(0, rows.length - pageSize);
        const start = Math.min(reader.top, maximum);
        reader.top = start;
        ctx.fillStyle = colors.command;
        ctx.fillText(wrap(reader.title)[0], inset.x, inset.y);
        ctx.fillStyle = colors.listing || colors.text;
        ctx.fillText(wrap(reader.path)[0], inset.x, inset.y + lineHeight);
        ctx.fillStyle = colors.reader || '#dedee4';
        rows
          .slice(start, start + pageSize)
          .forEach((text, i) => ctx.fillText(text, inset.x, bodyY + i * lineHeight));
        const footerY = height - lineHeight * 2 - 12;
        ctx.fillStyle = colors.command;
        ctx.fillText(
          `${Math.min(start + 1, rows.length)}–${Math.min(start + pageSize, rows.length)} / ${rows.length}`,
          inset.x,
          footerY
        );
        ctx.fillStyle = colors.text;
        ctx.fillText(wrap(reader.status || reader.hint)[0], inset.x, footerY + lineHeight);
        ctx.fillStyle = colors.command;
        ctx.fillText(input, inset.x, height - 12);
        if (cursor)
          ctx.fillRect(
            inset.x + ctx.measureText(input).width,
            height - 12 - fontSize + 4,
            8,
            fontSize - 2
          );
        return maximum;
      }
      if (
        !cached ||
        cached.reader ||
        cached.lines !== lines ||
        cached.prompt !== prompt ||
        cached.input !== input
      ) {
        rows = lines.flatMap((text) =>
          wrap(text).map((part) => ({
            text: part,
            color: /^(~|\/).*\$ /u.test(text)
              ? colors.command
              : text.startsWith('>>')
                ? colors.message
                : /^(total|drwx|-rw)/u.test(text)
                  ? colors.listing || colors.text
                  : colors.text,
          }))
        );
        rows.push(...wrap(prompt + input).map((text) => ({ text, color: colors.command })));
        cached = { lines, prompt, input };
      }
      const capacity = Math.max(1, Math.floor((height - inset.y - 12) / lineHeight));
      pageSize = capacity;
      const maxScroll = Math.max(0, rows.length - capacity);
      const offset = Math.min(scroll, maxScroll);
      const start = Math.max(0, rows.length - capacity - offset);
      rows.slice(start, start + capacity).forEach((row, i) => {
        ctx.fillStyle = row.color;
        ctx.fillText(row.text, inset.x, inset.y + i * lineHeight);
      });
      if (cursor && !offset) {
        const last = rows.at(-1);
        ctx.fillStyle = colors.cursor;
        ctx.fillRect(
          inset.x + ctx.measureText(last.text).width,
          inset.y + (rows.length - start - 1) * lineHeight - fontSize + 4,
          8,
          fontSize - 2
        );
      }
      return maxScroll;
    },
    dispose() {
      rows = [];
      cached = undefined;
      glyphWidths.clear();
      canvas.width = canvas.height = 0;
    },
  };
}
