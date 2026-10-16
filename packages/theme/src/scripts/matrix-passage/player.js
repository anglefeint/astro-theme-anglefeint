import { createMatrixCorridor } from '../matrix-corridor.js';
import {
  PASSAGE_DURATION_MS,
  SCREEN_EXPAND_MS,
  passageProgress,
  travelProgress,
} from './timeline.js';

// Shared overlay and animation clock; callers own navigation or exploration controls.
export function playPassage({
  trigger,
  event,
  palette = 'matrix',
  explore = false,
  reduced = false,
  onComplete,
  container,
  mode = 'full',
}) {
  const inline = Boolean(container);
  const overlay = document.createElement('div');
  overlay.className = inline ? 'passage-inline' : `home-passage${explore ? ' oracle-passage' : ''}`;
  overlay.dataset.palette = palette;
  if (explore && !inline) {
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute(
      'aria-label',
      'Oracle. Drag or use arrow keys to look around after arrival. Face the corridor and click to return. Escape exits.'
    );
    overlay.tabIndex = -1;
  } else if (!inline || mode !== 'corridor') overlay.setAttribute('aria-hidden', 'true');
  if (!inline) {
    const bounds = trigger.getBoundingClientRect();
    const x = event.detail === 0 ? bounds.left + bounds.width / 2 : event.clientX;
    const y = event.detail === 0 ? bounds.top + bounds.height / 2 : event.clientY;
    const width = Math.min(96, innerWidth),
      height = Math.min(60, innerHeight);
    const left = Math.max(0, Math.min(innerWidth - width, x - width / 2));
    const top = Math.max(0, Math.min(innerHeight - height, y - height / 2));
    for (const [name, value] of Object.entries({
      top,
      right: innerWidth - left - width,
      bottom: innerHeight - top - height,
      left,
    }))
      overlay.style.setProperty(`--passage-inset-${name}`, `${value}px`);
    overlay.style.setProperty('--passage-expand-duration', `${SCREEN_EXPAND_MS}ms`);
  }
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  overlay.append(canvas);
  (container ?? document.body).append(overlay);
  const listeners = new AbortController();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let draw,
    frame = 0,
    userPaused = false,
    closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    listeners.abort();
    cancelAnimationFrame(frame);
    draw?.dispose?.();
    if (inline && draw)
      canvas.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext();
    draw = undefined;
    overlay.remove();
  };
  try {
    const staticMotion = () => reduced || (inline && motion.matches);
    const initialProgress = () => passageProgress(mode, staticMotion() ? 1 : 0);
    const viewport = inline ? container.getBoundingClientRect() : undefined;
    draw = createMatrixCorridor(canvas, palette, viewport, mode);
    draw(initialProgress(), 0);
    if (reduced) overlay.classList.add('is-static');
    else overlay.classList.add('is-revealing');
    if (explore && !inline) overlay.focus({ preventScroll: true });
    const start = performance.now();
    let last = -Infinity,
      completed = false,
      pausedAt = document.hidden ? start : 0,
      pausedDuration = 0;
    const delay = inline ? 0 : SCREEN_EXPAND_MS;
    const persistent = explore || mode !== 'full';
    let travel, door;
    const look = { yaw: 0, pitch: 0 };
    const drawFrame = (progress, elapsed) => draw(progress, elapsed, look);
    const clockNow = () => (pausedAt || performance.now()) - start - pausedDuration;
    const origin = mode === 'corridor' ? passageProgress(mode, 0) : 0;
    const progressAt = (clock) =>
      travel
        ? travelProgress(travel.from, travel.to, clock - travel.start)
        : passageProgress(
            mode,
            staticMotion() ? 1 : Math.min(1, Math.max(0, clock - delay) / PASSAGE_DURATION_MS)
          );
    const beginTravel = (to) => {
      look.yaw = 0;
      look.pitch = 0;
      delete overlay.dataset.looking;
      (container ?? overlay).style.cursor = '';
      const clock = clockNow(),
        from = progressAt(clock);
      travel = {
        from,
        to,
        start: clock - (staticMotion() ? Math.abs(to - from) * PASSAGE_DURATION_MS : 0),
      };
      overlay.dataset.playback = to > from ? 'forward' : 'reverse';
      if (staticMotion()) {
        drawFrame(to, clock / 1000);
        finishTravel(to);
      }
    };
    const finishTravel = (progress) => {
      if (
        !travel ||
        Math.abs(progress - travel.to) > 0.000001 ||
        overlay.dataset.playback === 'idle'
      )
        return;
      overlay.dataset.playback = 'idle';
      overlay.dataset.view = travel.to === 1 ? 'oracle' : 'corridor';
      if (travel.to === 1) (container ?? overlay).style.cursor = 'grab';
      if (door && travel.to === origin) {
        door.disabled = false;
        door.style.pointerEvents = '';
        door.style.opacity = '';
      }
    };
    overlay.dataset.view =
      mode === 'oracle' || (staticMotion() && mode === 'full') ? 'oracle' : 'corridor';
    overlay.dataset.playback = mode === 'full' && !staticMotion() ? 'forward' : 'idle';
    const tick = (now) => {
      if (closed) return;
      if (userPaused || document.hidden || staticMotion()) return;
      const clock = now - start - pausedDuration;
      const progress = progressAt(clock);
      if (now - last >= 1000 / 30 || (mode === 'full' && progress === 1 && !completed)) {
        drawFrame(progress, clock / 1000);
        last = now;
        finishTravel(progress);
      }
      if (mode === 'full' && progress === 1 && !completed) {
        completed = true;
        overlay.dataset.playback = 'idle';
        overlay.dataset.view = 'oracle';
        onComplete?.();
      }
      if (!closed && (persistent || !completed)) frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (closed) return;
      cancelAnimationFrame(frame);
      const now = performance.now();
      if (userPaused || document.hidden || staticMotion()) {
        if (!pausedAt) pausedAt = now;
        if (!userPaused && staticMotion()) {
          const progress = travel ? travel.to : passageProgress(mode, 1);
          if (travel)
            travel.start = clockNow() - Math.abs(travel.to - travel.from) * PASSAGE_DURATION_MS;
          drawFrame(progress, 0);
          finishTravel(progress);
        }
      } else {
        if (pausedAt) pausedDuration += now - pausedAt;
        pausedAt = 0;
        if (persistent || !completed) frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', sync, { signal: listeners.signal });
    motion.addEventListener('change', sync, { signal: listeners.signal });
    window.addEventListener('pagehide', close, { signal: listeners.signal });
    close.pause = () => {
      userPaused = true;
      sync();
    };
    close.resume = () => {
      userPaused = false;
      sync();
    };
    close.reverse = () => {
      if (
        closed ||
        userPaused ||
        !(explore || (inline && mode === 'corridor')) ||
        progressAt(clockNow()) < 1
      )
        return false;
      beginTravel(origin);
      sync();
      return true;
    };
    if (explore || (inline && mode === 'corridor')) {
      const surface = container ?? overlay;
      const canLook = () =>
        !closed &&
        !userPaused &&
        progressAt(clockNow()) >= 1 &&
        overlay.dataset.playback === 'idle';
      const hitReturn = (x, y) => {
        const bounds = canvas.getBoundingClientRect();
        return draw.returnHit(
          1,
          look,
          (x - bounds.left) / bounds.width,
          (y - bounds.top) / bounds.height
        );
      };
      let drag,
        suppressClick = false;
      const updateLook = () => {
        overlay.dataset.looking = `${look.yaw.toFixed(3)},${look.pitch.toFixed(3)}`;
        if (staticMotion()) drawFrame(progressAt(clockNow()), clockNow() / 1000);
      };
      surface.addEventListener(
        'pointerdown',
        (event) => {
          if (event.button !== 0 || !canLook()) return;
          if (event.target instanceof Element && event.target.closest('button')) return;
          event.preventDefault();
          suppressClick = false;
          drag = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            yaw: look.yaw,
            pitch: look.pitch,
            moved: false,
          };
          surface.setPointerCapture(event.pointerId);
        },
        { signal: listeners.signal }
      );
      surface.addEventListener(
        'pointermove',
        (event) => {
          if (!canLook()) {
            surface.style.cursor = '';
            return;
          }
          if (drag?.id === event.pointerId) {
            const dx = event.clientX - drag.x,
              dy = event.clientY - drag.y;
            drag.moved ||= Math.hypot(dx, dy) > 4;
            if (drag.moved) {
              const sensitivity = (Math.PI * 2) / Math.max(180, surface.clientWidth);
              look.yaw = drag.yaw - dx * sensitivity;
              look.pitch = Math.max(-0.7, Math.min(0.7, drag.pitch - dy * sensitivity));
              surface.style.cursor = 'grabbing';
              updateLook();
            }
          } else
            surface.style.cursor = hitReturn(event.clientX, event.clientY) ? 'pointer' : 'grab';
        },
        { signal: listeners.signal }
      );
      const endDrag = (event) => {
        if (drag?.id !== event.pointerId) return;
        suppressClick = drag.moved;
        drag = undefined;
        if (surface.hasPointerCapture(event.pointerId))
          surface.releasePointerCapture(event.pointerId);
        surface.style.cursor = canLook() ? 'grab' : '';
      };
      surface.addEventListener('pointerup', endDrag, { signal: listeners.signal });
      surface.addEventListener('pointercancel', endDrag, { signal: listeners.signal });
      surface.addEventListener(
        'click',
        (event) => {
          if (suppressClick) {
            suppressClick = false;
            event.preventDefault();
            return;
          }
          if (canLook() && hitReturn(event.clientX, event.clientY)) {
            event.preventDefault();
            close.reverse();
          }
        },
        { signal: listeners.signal }
      );
      const keyboardSurface = inline
        ? (container.closest('.home-signal-monitor') ?? surface)
        : surface;
      keyboardSurface.addEventListener(
        'keydown',
        (event) => {
          if (!canLook()) return;
          if (event.key === 'ArrowLeft') look.yaw -= Math.PI / 12;
          else if (event.key === 'ArrowRight') look.yaw += Math.PI / 12;
          else if (event.key === 'ArrowUp') look.pitch = Math.max(-0.7, look.pitch - 0.1);
          else if (event.key === 'ArrowDown') look.pitch = Math.min(0.7, look.pitch + 0.1);
          else if (event.key === 'Home') {
            look.yaw = 0;
            look.pitch = 0;
          } else if (event.key === 'Enter' && draw.returnHit(1, look, 0.5, 0.5)) {
            close.reverse();
          } else return;
          event.preventDefault();
          updateLook();
        },
        { signal: listeners.signal }
      );
      surface.addEventListener(
        'contextmenu',
        (event) => {
          if (travel?.to === origin && progressAt(clockNow()) > origin) {
            event.preventDefault();
            return;
          }
          if (canLook()) {
            event.preventDefault();
            close.reverse();
          }
        },
        { signal: listeners.signal }
      );
    }
    if (inline && mode === 'corridor') {
      const points = draw.doorRegion(passageProgress(mode, 0));
      const left = Math.min(...points.map(([x]) => x)),
        right = Math.max(...points.map(([x]) => x));
      const top = Math.min(...points.map(([, y]) => y)),
        bottom = Math.max(...points.map(([, y]) => y));
      door = document.createElement('button');
      door.type = 'button';
      door.className = 'passage-door-hit';
      door.setAttribute('aria-label', container.dataset.doorLabel || 'Open door');
      door.style.cssText = `left:${left * 100}%;top:${top * 100}%;width:${(right - left) * 100}%;height:${(bottom - top) * 100}%;`;
      door.style.clipPath = `polygon(${points.map(([x, y]) => `${((x - left) / (right - left)) * 100}% ${((y - top) / (bottom - top)) * 100}%`).join(',')})`;
      door.addEventListener(
        'pointerdown',
        (event) => {
          if (event.button === 0) event.preventDefault();
        },
        { signal: listeners.signal }
      );
      door.addEventListener(
        'click',
        () => {
          if (closed || userPaused || door.disabled) return;
          try {
            draw.reveal();
            container.dispatchEvent(new Event('passage-door-opened', { bubbles: true }));
            door.disabled = true;
            door.style.pointerEvents = 'none';
            door.style.opacity = '0';
            beginTravel(1);
          } catch {
            // The closed corridor remains available if preparation fails.
          }
        },
        { signal: listeners.signal }
      );
      overlay.append(door);
    }
    sync();
  } catch (error) {
    close();
    throw error;
  }
  return close;
}
