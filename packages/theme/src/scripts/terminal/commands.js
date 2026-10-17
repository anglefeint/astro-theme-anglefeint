export function parseCommand(input) {
  const tokens = [];
  let token = '',
    quote = '',
    escape = false,
    started = false;
  for (const char of input.trim()) {
    if (escape) {
      token += char;
      escape = false;
      started = true;
    } else if (char === '\\') escape = true;
    else if (quote) {
      if (char === quote) quote = '';
      else token += char;
    } else if (char === '"' || char === "'") {
      quote = char;
      started = true;
    } else if (/\s/u.test(char)) {
      if (started) tokens.push(token);
      token = '';
      started = false;
    } else {
      token += char;
      started = true;
    }
  }
  if (quote || escape) throw new Error('syntax');
  if (started) tokens.push(token);
  if (tokens[0] === 'cd..') tokens.splice(0, 1, 'cd', '..');
  return tokens;
}

export const COMMAND_HELP =
  'ls [-l|-a|-la] [path] · cd [path] · pwd · cat <file> · vi <file> · help · clear';
