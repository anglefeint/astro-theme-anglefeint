import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { WIDTH, HEIGHT } from './model.mjs';

const require = createRequire(import.meta.url);
let font;
let background;
const div = (children, style) => ({
  type: 'div',
  props: { children, style: { display: 'flex', ...style } },
});

function shorten(text, limit) {
  const chars = Array.from(
    new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
    (s) => s.segment
  );
  return chars.length > limit ? chars.slice(0, limit - 1).join('') + '…' : text;
}

export function socialTemplate({ title, author, site, showCredits = true }) {
  const displayTitle = shorten(title, 120);
  const length = Array.from(displayTitle).length;
  const fontSize = length > 65 ? 44 : length > 35 ? 56 : 70;
  // Estimate visual width rather than character count: CJK glyphs take more
  // space than Latin letters. Keep the artwork vivid below the reading area.
  const units = Array.from(displayTitle).reduce(
    (sum, char) =>
      sum +
      (/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/u.test(char)
        ? 1
        : 0.6),
    0
  );
  const rows = Math.max(1, Math.ceil((units * fontSize) / 1020));
  const fadeStart = Math.min(77, Math.ceil(((129 + rows * fontSize * 1.32) / HEIGHT) * 100));
  return div(
    [
      div('', {
        position: 'absolute',
        right: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        // Long titles can extend over the artwork; protect their contrast without
        // shrinking the illustration or changing the title/author hierarchy.
        backgroundImage: `linear-gradient(180deg, #080f1c60 0%, #080f1cbf ${fadeStart}%, #080f1c00 ${fadeStart + 9}%)`,
      }),
      div(
        [
          div('', { width: 10, height: 10, backgroundColor: '#80deea', marginRight: 16 }),
          div(shorten(site, 38), { fontSize: 24, color: '#a3c5dc' }),
        ],
        { alignItems: 'center' }
      ),
      div(displayTitle, {
        fontSize,
        lineHeight: 1.32,
        color: '#edf6ff',
        width: 1020,
        maxHeight: 350,
        overflow: 'hidden',
        wordBreak: 'break-word',
        marginTop: 42,
      }),
      div(
        [
          div(shorten(author, 32), { fontSize: 23, color: '#a5b9d0' }),
          div(
            [
              ...(showCredits
                ? [div('Theme by Anglefeint', { fontSize: 18, color: '#a3b8cc', marginBottom: 8 })]
                : []),
              div('', {
                width: 150,
                height: 3,
                backgroundImage: 'linear-gradient(90deg, #78dce8, #9981e8)',
              }),
            ],
            { flexDirection: 'column', alignItems: 'flex-end' }
          ),
        ],
        {
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 55,
          paddingTop: 22,
          borderTop: '1px solid #728db83a',
          alignItems: 'center',
          justifyContent: 'space-between',
        }
      ),
    ],
    {
      width: WIDTH,
      height: HEIGHT,
      padding: '55px 72px',
      position: 'relative',
      flexDirection: 'column',
      fontFamily: 'Noto',
      overflow: 'hidden',
    }
  );
}

export async function renderSocialImage(data) {
  font ??= readFile(
    require.resolve('@anglefeint/astro-theme/assets/theme/social/NotoSansCJKsc-Regular.otf')
  );
  background ??= readFile(
    require.resolve('@anglefeint/astro-theme/assets/theme/social/network-core.webp')
  );
  const svg = await satori(socialTemplate(data), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'Noto', data: await font, weight: 400, style: 'normal' }],
  });
  return sharp(await background)
    .composite([{ input: Buffer.from(svg) }])
    .png()
    .toBuffer();
}
