// A frame source runs only while a reveal subscribes; no permanent page loop.
export function createDecoderClock() {
  let frame = 0,
    callback;
  const tick = (now) => {
    frame = 0;
    callback?.(now);
    if (callback && !frame) frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    callback = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
  };
  return {
    enabled: true,
    subscribeFrame(next) {
      stop();
      callback = next;
      frame = requestAnimationFrame(tick);
      return () => {
        if (callback === next) stop();
      };
    },
    dispose: stop,
  };
}
