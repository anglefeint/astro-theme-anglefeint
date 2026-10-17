import { normalizePath } from './filesystem.js';
import { parseCommand, COMMAND_HELP } from './commands.js';

export function createTerminalSession({ filesystem, cwd = '/', readFile, labels }) {
  let current = filesystem.get(cwd)?.type === 'directory' ? normalizePath(cwd) : '/';
  const home = current;
  const message = (key, value = '') => (labels[key] || key).replace('{value}', value);
  return {
    get prompt() {
      return `${current} $ `;
    },
    async execute(input) {
      let tokens;
      try {
        tokens = parseCommand(input);
      } catch {
        return { lines: [message('syntax')] };
      }
      const [command, ...args] = tokens;
      if (!command) return { lines: [] };
      if (command === 'help') return { lines: [labels.help, COMMAND_HELP] };
      if (command === 'clear') return { clear: true, lines: [] };
      if (command === 'pwd') return { lines: [current] };
      if (!['ls', 'cd', 'cat', 'vi', 'vim', 'view'].includes(command))
        return { lines: [message('unknown', command)] };
      const paths =
        command === 'ls' ? args.filter((arg) => !['-l', '-a', '-la', '-al'].includes(arg)) : args;
      if (
        paths.length > 1 ||
        (['cat', 'vi', 'vim', 'view'].includes(command) && paths.length !== 1)
      )
        return {
          lines: [
            message(
              'usage',
              `${command} ${command === 'cd' || command === 'ls' ? '[path]' : '<file>'}`
            ),
          ],
        };
      const value = paths[0] ?? (command === 'cd' ? home : '.');
      let node;
      try {
        node = filesystem.get(value, current);
      } catch {
        /* Invalid virtual path. */
      }
      if (!node) return { lines: [message('notFound', value)] };
      if (command === 'cd') {
        if (node.type !== 'directory') return { lines: [message('notDirectory', value)] };
        current = node.path;
        return { lines: [] };
      }
      if (command === 'ls') {
        const nodes = node.type === 'directory' ? filesystem.list(node.path) : [node];
        return {
          lines: nodes.length
            ? nodes.map(
                (item) =>
                  `${args.includes('-l') || args.includes('-la') || args.includes('-al') ? (item.type === 'directory' ? 'd ' : '- ') : ''}${item.path.split('/').at(-1)}${item.type === 'directory' ? '/' : ''}`
              )
            : [labels.empty],
        };
      }
      if (node.type !== 'file') return { lines: [message('isDirectory', value)] };
      try {
        const content = await readFile(node);
        if (command === 'cat') return { lines: content.split(/\r?\n/u) };
        return { lines: [], reader: { ...node, content } };
      } catch (error) {
        return { lines: [message(error.message === 'tooLarge' ? 'tooLarge' : 'failed', value)] };
      }
    },
    complete(input) {
      const match = /^(ls|cd|cat|vi|vim|view)\s+([^"']*)$/u.exec(input);
      if (!match) return input;
      const prefix = match[2];
      const slash = prefix.lastIndexOf('/');
      const directory = slash < 0 ? '.' : prefix.slice(0, slash + 1);
      let nodes;
      try {
        nodes = filesystem.list(directory, current);
      } catch {
        return input;
      }
      const matches = nodes.filter(
        (node) =>
          node.path
            .split('/')
            .at(-1)
            .startsWith(prefix.slice(slash + 1)) &&
          (match[1] !== 'cd' || node.type === 'directory')
      );
      if (matches.length !== 1) return input;
      const name =
        prefix.slice(0, slash + 1) +
        matches[0].path.split('/').at(-1) +
        (matches[0].type === 'directory' ? '/' : '');
      return `${match[1]} ${/\s/u.test(name) ? JSON.stringify(name) : name}`;
    },
  };
}
