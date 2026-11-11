import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildStartupModel } from '../packages/theme/src/effects/startup-text/model.js';

test('startup defaults preserve the homepage schedule and leading completion space', () => {
  const model = buildStartupModel();
  assert.match(model.style, /--startup-fade-delay:7600ms/);
  assert.match(model.style, /--startup-message-delay:8600ms/);
  const [startup, message] = model.groups;
  assert.deepEqual(
    startup.segments.map((item) => item.text),
    ['Initialize...', ' done.']
  );
  assert.match(startup.segments[0].style, /--terminal-delay:250ms/);
  assert.match(startup.segments[0].style, /--cursor-delay:0ms/);
  assert.match(startup.segments[1].style, /--terminal-delay:5250ms/);
  assert.match(startup.segments[1].style, /--terminal-steps:5/);
  assert.equal(startup.segments[1].initial, 1);
  assert.match(message.segments[1].style, /--terminal-delay:13250ms/);
});

test('custom text, Unicode cells and disabled startup do not inherit homepage delays', () => {
  const options = { startup: [], message: [{ text: '你好👩🏽‍💻é', duration: 500 }], fadeDuration: 200 };
  const model = buildStartupModel(options);
  assert.match(model.style, /--startup-message-delay:0ms/);
  assert.equal(model.groups.length, 1);
  assert.match(model.groups[0].segments[0].style, /--terminal-chars:4/);
  assert.match(model.groups[0].segments[0].style, /--terminal-units:7/);
  assert.equal(model.groups[0].segments[0].text, options.message[0].text);
  assert.deepEqual(buildStartupModel({ startup: [], message: [] }).groups, []);
});
