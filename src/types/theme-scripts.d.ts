declare module '@anglefeint/astro-theme/scripts/about-effects.js' {
  export function initAboutEffects(): () => void;
}

declare module '@anglefeint/astro-theme/scripts/blogpost-effects.js' {
  export function initBlogpostEffects(): void;
}

declare module '@anglefeint/astro-theme/scripts/home-matrix.js' {
  export function initHomeMatrix():
    | {
        start(): void;
        pause(): void;
        resume(): void;
        dispose(): void;
        subscribeFrame(callback: (time: number) => void): () => void;
      }
    | undefined;
}

declare module '@anglefeint/astro-theme/scripts/home-effects.js' {
  export function initHomeEffects():
    { start(): void; pause(): void; resume(): void; dispose(): void } | undefined;
}
