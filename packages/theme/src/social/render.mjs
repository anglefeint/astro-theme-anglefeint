import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { WIDTH, HEIGHT } from './model.mjs';

const require = createRequire(import.meta.url);
let font;
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

export function socialTemplate({ title, author, site }) {
  const displayTitle = shorten(title, 120);
  const length = Array.from(displayTitle).length;
  return div(
    [
      div('', {
        position: 'absolute',
        right: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        backgroundImage: 'linear-gradient(135deg, #080f1c 25%, #172544 100%)',
      }),
      ...Array.from({ length: 15 }, (_, i) =>
        div('', {
          position: 'absolute',
          left: i * 90,
          top: 0,
          width: 1,
          height: HEIGHT,
          backgroundColor: '#91b9e00c',
        })
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        div('', {
          position: 'absolute',
          left: 0,
          top: i * 90,
          width: WIDTH,
          height: 1,
          backgroundColor: '#91b9e00c',
        })
      ),
      div(
        [
          div('', { width: 10, height: 10, backgroundColor: '#80deea', marginRight: 16 }),
          div(shorten(site, 38), { fontSize: 24, color: '#a3c5dc' }),
        ],
        { alignItems: 'center' }
      ),
      div(displayTitle, {
        fontSize: length > 65 ? 44 : length > 35 ? 56 : 70,
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
          div('', {
            width: 150,
            height: 3,
            backgroundImage: 'linear-gradient(90deg, #78dce8, #9981e8)',
          }),
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
      backgroundColor: '#080f1c',
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
  const svg = await satori(socialTemplate(data), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'Noto', data: await font, weight: 400, style: 'normal' }],
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
