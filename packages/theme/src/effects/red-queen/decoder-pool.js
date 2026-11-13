/** Own native decoders separately from the frame currently drawn by the monitor. */
export function createDecoderPool(Decoder = globalThis.ImageDecoder) {
  const sessions = new Set();
  return {
    open(data, type) {
      const decoder = new Decoder({ data, type });
      let closed = false;
      const session = {
        ready: decoder.tracks.ready,
        get frameCount() {
          return decoder.tracks.selectedTrack.frameCount;
        },
        async decode(frameIndex) {
          if (closed) return;
          const { image } = await decoder.decode({ frameIndex });
          // A pending decode can settle after stop/replay/disposal.
          if (closed) {
            image.close();
            return;
          }
          return image;
        },
        close() {
          if (closed) return;
          closed = true;
          sessions.delete(session);
          decoder.close();
        },
      };
      sessions.add(session);
      return session;
    },
    clear() {
      for (const session of sessions) session.close();
    },
  };
}
