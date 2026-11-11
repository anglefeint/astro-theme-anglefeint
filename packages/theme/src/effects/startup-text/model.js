const startup = [
  { text: 'Initialize...', delay: 250, cursorDelay: 0, duration: 1500, cursorFor: 4250, blinks: 7 },
  { text: ' done.', delay: 5250, duration: 850, cursorFor: 2350, blinks: 4, initial: 1 },
];
const message = [
  { text: 'Wake Up...', delay: 0, duration: 800, cursorFor: 2650, blinks: 4 },
  { text: ' Follow The White Rabbit...', delay: 4650, duration: 1350, cursorFor: 3550, blinks: 6 },
];
const milliseconds = (value, fallback) => (Number.isFinite(value) ? Math.max(0, value) : fallback);

function metrics(text) {
  const glyphs =
    typeof Intl.Segmenter === 'function'
      ? Array.from(
          new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
          (part) => part.segment
        )
      : Array.from(text);
  const wide =
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Extended_Pictographic}\uFF01-\uFF60\uFFE0-\uFFE6]/u;
  const units = glyphs.reduce((sum, glyph) => sum + (wide.test(glyph) ? 2 : 1), 0);
  return { characters: glyphs.length, units };
}

// Pure model shared by Astro rendering and DOM binding; no layout reads or timers.
export function buildStartupModel(options = {}) {
  const first = options.startup ?? startup;
  const second = options.message ?? message;
  const messageAt = milliseconds(options.messageAt, first.length ? 8600 : 0);
  const style = `--startup-fade-delay:${milliseconds(options.fadeAt, 7600)}ms;--startup-fade-duration:${milliseconds(options.fadeDuration, 1000)}ms;--startup-message-delay:${messageAt}ms;`;
  const group = (kind, segments, offset) => ({
    kind,
    segments: segments.map((segment) => {
      const text = String(segment.text ?? '');
      const { characters, units } = metrics(text);
      const initial = Math.min(characters, Math.floor(milliseconds(segment.initial, 0)));
      const delay = offset + milliseconds(segment.delay, 0);
      return {
        text,
        initial,
        style: [
          `--terminal-chars:${characters}`,
          `--terminal-units:${units}`,
          `--terminal-initial:${initial}`,
          `--terminal-steps:${Math.max(1, characters - initial)}`,
          `--terminal-duration:${Math.max(1, milliseconds(segment.duration, 1000))}ms`,
          `--terminal-delay:${delay}ms`,
          `--cursor-delay:${offset + milliseconds(segment.cursorDelay, milliseconds(segment.delay, 0))}ms`,
          `--cursor-duration:${milliseconds(segment.cursorFor, 2000)}ms`,
          `--cursor-blinks:${Math.max(1, Math.floor(milliseconds(segment.blinks, 4)))}`,
        ].join(';'),
      };
    }),
  });
  return {
    style,
    hasMessage: second.length > 0,
    groups: [group('startup', first, 0), group('message', second, messageAt)].filter(
      (item) => item.segments.length
    ),
  };
}
