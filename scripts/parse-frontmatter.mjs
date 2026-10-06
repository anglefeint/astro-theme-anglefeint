import { load } from 'js-yaml';

/** Repository docs and article fixtures use YAML frontmatter only. */
export default function parseFrontmatter(text) {
  const source = text.replace(/^\uFEFF/, '');
  const opening = /^(---)[ \t]*\r?\n/.exec(source);
  if (!opening) return { matter: '', data: {}, content: source };
  const rest = source.slice(opening[0].length);
  const closing = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(rest);
  if (!closing) throw new Error('Unclosed YAML frontmatter');
  const matter = rest.slice(0, closing.index);
  return {
    matter,
    data: load(matter) ?? {},
    content: rest.slice(closing.index + closing[0].length),
  };
}
