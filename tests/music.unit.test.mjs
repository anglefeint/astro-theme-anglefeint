/* global EventTarget, Event */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayer } from '../packages/theme/src/scripts/music/core.js';
import { readMusicState, writeMusicState } from '../packages/theme/src/scripts/music/storage.js';
import { normalizeMusic } from '../packages/theme/src/utils/music.ts';

class AudioStub extends EventTarget {
  currentTime = 0;
  duration = 100;
  paused = true;
  loadCount = 0;
  play() {
    this.paused = false;
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }
  load() {
    this.loadCount++;
  }
  removeAttribute() {}
}
const tracks = [
  { title: 'One', src: '/one.mp3' },
  { title: 'Two', src: '/two.mp3' },
];
test('late play rejection cannot corrupt a new track, and ended advances once', async () => {
  let rejectOld;
  const first = new AudioStub();
  first.play = () =>
    new Promise((_, reject) => {
      rejectOld = reject;
    });
  const second = new AudioStub();
  let count = 0;
  const player = createPlayer(tracks, () => (count++ === 0 ? first : second));
  let state;
  player.subscribe((s) => {
    state = s;
  });
  const pending = player.play();
  player.selectTrack(1);
  await player.play();
  rejectOld(new Error('stale'));
  await pending;
  assert.equal(state.status, 'playing');
  assert.equal(state.trackIndex, 1);
  second.dispatchEvent(new Event('ended'));
  assert.equal(state.trackIndex, 0);
  player.destroy();
});
test('music loads only on play, resumes without reloading, isolates stale events and destroys', async () => {
  const audios = [];
  const player = createPlayer(tracks, () => {
    const a = new AudioStub();
    audios.push(a);
    return a;
  });
  let state;
  player.subscribe((s) => {
    state = s;
  });
  assert.equal(audios.length, 0);
  await player.play();
  audios[0].dispatchEvent(new Event('loadedmetadata'));
  player.seek(24);
  player.pause();
  await player.play();
  assert.equal(audios.length, 1);
  assert.equal(audios[0].loadCount, 0);
  assert.equal(state.currentTime, 24);
  player.selectTrack(1);
  await player.play();
  audios[0].dispatchEvent(new Event('error'));
  assert.equal(state.status, 'playing');
  assert.equal(state.trackIndex, 1);
  player.destroy();
  assert.equal(audios[1].paused, true);
  await player.play();
  assert.equal(audios.length, 2);
});
test('music restores seek lazily and errors do not skip the playlist', async () => {
  const a = new AudioStub();
  const player = createPlayer(tracks, () => a);
  let state;
  player.subscribe((s) => {
    state = s;
  });
  player.selectTrack(1, 42);
  await player.play();
  assert.equal(a.currentTime, 42, 'resume position is set before playback starts');
  a.dispatchEvent(new Event('loadedmetadata'));
  assert.equal(a.currentTime, 42);
  a.dispatchEvent(new Event('error'));
  assert.equal(state.status, 'error');
  assert.equal(state.trackIndex, 1);
});
test('rapid pause and resume ignores the interrupted play promise', async () => {
  const a = new AudioStub();
  let reject;
  a.play = () =>
    new Promise((_, fail) => {
      reject = fail;
    });
  const player = createPlayer(tracks, () => a);
  let state;
  player.subscribe((s) => {
    state = s;
  });
  const pending = player.play();
  player.pause();
  a.play = AudioStub.prototype.play;
  await player.play();
  reject(new Error('interrupted'));
  await pending;
  assert.equal(state.status, 'playing');
  player.destroy();
});
test('music configuration and storage handle disabled, malformed and denied input', () => {
  assert.equal(normalizeMusic().enabled, false);
  assert.equal(normalizeMusic({ enabled: true, tracks: [] }).enabled, false);
  assert.throws(
    () => normalizeMusic({ enabled: true, tracks: [{ title: '', src: '/a.mp3' }] }),
    /tracks.0/
  );
  assert.throws(
    () => normalizeMusic({ enabled: true, tracks: [{ title: 'A', src: 'javascript:alert(1)' }] }),
    /src/
  );
  const denied = () => {
    throw new Error('denied');
  };
  assert.equal(readMusicState(denied), null);
  assert.doesNotThrow(() => writeMusicState(denied, {}));
  assert.equal(
    readMusicState(() => ({ getItem: () => '{' })),
    null
  );
});

test('blocked playback retains progress and can be retried without replacing audio', async () => {
  const audio = new AudioStub();
  audio.play = () =>
    Promise.reject(Object.assign(new Error('blocked'), { name: 'NotAllowedError' }));
  let created = 0;
  const player = createPlayer(tracks, () => {
    created++;
    return audio;
  });
  let state;
  player.subscribe((value) => {
    state = value;
  });
  player.selectTrack(0, 32);
  await player.play();
  assert.equal(state.status, 'blocked');
  assert.equal(state.currentTime, 32);
  audio.play = AudioStub.prototype.play;
  await player.play();
  assert.equal(state.status, 'playing');
  assert.equal(created, 1);
  player.destroy();
});

test('session resume defaults off and only accepts boolean true', () => {
  for (const [input, expected] of [
    [undefined, false],
    ['true', false],
    [true, true],
    [false, false],
  ]) {
    const value = readMusicState(() => ({
      getItem: () => JSON.stringify({ src: '/one.mp3', time: 12, shouldResume: input }),
    }));
    assert.equal(value.shouldResume, expected);
    assert.equal(value.time, 12);
  }
});
