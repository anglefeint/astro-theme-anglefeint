export function createTitleReveal(target, prefersReducedMotion) {
  let titleTimer = 0,
    resolvedTitle = '';
  function stopTitleReveal() {
    window.clearTimeout(titleTimer);
    titleTimer = 0;
    target.textContent = resolvedTitle;
  }

  function revealTitle(title) {
    stopTitleReveal();
    resolvedTitle = String(title ?? '');
    target.textContent = resolvedTitle;
    if (
      prefersReducedMotion ||
      document.hidden ||
      !resolvedTitle ||
      typeof Intl.Segmenter !== 'function'
    )
      return;
    const glyphs = Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(resolvedTitle),
      (part) => part.segment
    );
    // Long customized labels stay immediate; keep the accessible name stable.
    if (glyphs.length > 64) return;
    const label = document.createElement('span');
    label.className = 'hacker-title-source';
    label.textContent = resolvedTitle;
    const visual = document.createElement('span');
    visual.className = 'hacker-title-decode';
    visual.setAttribute('aria-hidden', 'true');
    target.replaceChildren(label, visual);
    const noise = '01/<>_#';
    let frame = 0;
    function tick() {
      if (document.hidden || frame >= 10) {
        stopTitleReveal();
        return;
      }
      const count = Math.floor((glyphs.length * frame) / 10);
      visual.textContent = glyphs
        .map((glyph, index) =>
          index < count || /^\s+$/u.test(glyph) ? glyph : noise[(index + frame) % noise.length]
        )
        .join('');
      frame += 1;
      titleTimer = window.setTimeout(tick, 36);
    }
    tick();
  }

  return { reveal: revealTitle, stop: stopTitleReveal };
}
