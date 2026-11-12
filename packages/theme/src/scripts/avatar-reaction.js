import { createEffectScope } from './effects/lifecycle.js';

/**
 * One preloaded strip plays in both directions, preserving the current pose.
 * @param {HTMLElement} root
 * @param {HTMLElement} trigger
 * @param {HTMLImageElement} image
 */
export function initAvatarReaction(root, trigger, image) {
  const scope = createEffectScope('avatar reaction');
  const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)');
  const motion = window.matchMedia?.('(prefers-reduced-motion: no-preference)');
  let animation;
  let hovered = false;
  let focused = false;
  let wanted = false;

  const clear = () => {
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
      animation = undefined;
    }
    wanted = false;
    delete root.dataset.avatarActive;
  };
  const sync = () => {
    if (!fine?.matches || !motion?.matches) {
      clear();
      return;
    }
    const active = hovered || focused;
    if (root.dataset.avatarReady !== 'true' || active === wanted) return;
    wanted = active;
    if (!animation && active && typeof image.animate === 'function') {
      animation = image.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-960px)' }],
        { duration: 900, easing: 'steps(15, end)', fill: 'both' }
      );
      animation.pause();
      animation.currentTime = 0;
      animation.onfinish = () => {
        if (animation?.playbackRate < 0 && Number(animation.currentTime ?? 0) <= 0) {
          animation.pause();
          animation.currentTime = 0;
          delete root.dataset.avatarActive;
        }
      };
    }
    if (!animation) return;
    if (!active && Number(animation.currentTime ?? 0) <= 0) {
      animation.pause();
      delete root.dataset.avatarActive;
      return;
    }
    root.dataset.avatarActive = 'true';
    animation.playbackRate = active ? 1 : -1;
    animation.play();
  };

  const prepare = async () => {
    try {
      if (typeof image.decode === 'function') await image.decode();
      if (!scope.disposed && image.complete && image.naturalWidth > 0) {
        root.dataset.avatarReady = 'true';
        hovered = trigger.matches?.(':hover') ?? false;
        focused = trigger.matches?.(':focus-visible') ?? false;
        sync();
      }
    } catch {
      // Leave the original avatar visible if the reaction cannot decode.
    }
  };
  scope.listen(image, 'load', prepare);
  scope.listen(trigger, 'pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    sync();
  });
  scope.listen(trigger, 'pointerleave', () => {
    hovered = false;
    sync();
  });
  scope.listen(trigger, 'focusin', () => {
    focused = trigger.matches?.(':focus-visible') ?? false;
    sync();
  });
  scope.listen(trigger, 'focusout', () => {
    focused = false;
    sync();
  });
  if (fine) scope.listen(fine, 'change', sync);
  if (motion) scope.listen(motion, 'change', sync);
  scope.add(clear);
  scope.add(() => delete root.dataset.avatarReady);
  void prepare();
  return () => scope.dispose();
}
