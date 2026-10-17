import { Buffer } from 'node:buffer';
export const terminalDocumentId = (id: string): string =>
  Buffer.from(id, 'utf8').toString('base64url');
