// Pure read-only viewing state. No DOM, windows, filesystem or network dependencies.
export function createTerminalReader(file, labels = {}) {
  return {
    title: file.title || file.path,
    path: file.path,
    lines: file.content.split(/\r?\n/u),
    top: 0,
    hint: labels.readerHint || ':q',
    status: '',
    move(amount, maximum) {
      this.top = Math.max(0, Math.min(maximum, this.top + amount));
    },
    execute(command) {
      if ([':q', ':q!', 'q'].includes(command.trim())) return { exit: true };
      this.status = this.hint;
      return { exit: false };
    },
  };
}
