// Public fixtures are synchronous and independent of the lazy crypto engine.
export const textExamples = {
  base64: 'Rm9sbG93IHRoZSB3aGl0ZSByYWJiaXQu',
  url: 'Follow%20the%20white%20rabbit.',
  hex: '46 6f 6c 6c 6f 77 20 74 68 65 20 77 68 69 74 65 20 72 61 62 62 69 74 2e',
  html: 'Follow &quot;the white rabbit&quot; &amp; explore.',
  unicode: '\\u4F60\\u597D \\u{1F407}',
  jwt: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ3aGl0ZS1yYWJiaXQiLCJuYW1lIjoiTmVvIn0.',
};

export function cryptoExample(task, chain, network = 'mainnet') {
  if (task === 'address') {
    if (chain === 'btc')
      return network === 'mainnet'
        ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        : 'mpXwg4jMtRhuSpVq4xS3HFHmCmWp9NyGKt';
    if (chain === 'tron') return 'T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn';
    return '0x0000000000000000000000000000000000000001';
  }
  return '0xa9059cbb' + '1'.padStart(64, '0') + 'f4240'.padStart(64, '0');
}
