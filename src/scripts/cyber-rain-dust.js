/* global document, HTMLElement, performance, location */

export function initCyberRainAndDust() {
  const rainRoot = document.querySelector('[data-cyber-rain]');
  const dustRoot = document.querySelector('[data-cyber-dust]');
  if (!(rainRoot instanceof HTMLElement) || !(dustRoot instanceof HTMLElement)) return;

  const hash = (value) => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  let seed = (Date.now() ^ Math.floor(performance.now() * 1000) ^ hash(location.pathname)) >>> 0;
  if (seed === 0) seed = 0x9e3779b9;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };

  const rainTypes = ['normal', 'thin', 'fog', 'skew'];
  const rainCount = 48;
  const dustCount = 22;

  for (let i = 0; i < rainCount; i += 1) {
    const type = rainTypes[i % rainTypes.length];
    const drop = document.createElement('div');
    drop.className = `cyber-rain-drop cyber-rain-drop--${type}`;
    const durationBase = type === 'thin' ? 1.1 : type === 'fog' || type === 'skew' ? 1.7 : 1.4;
    drop.style.left = `${(rand() * 100).toFixed(3)}%`;
    drop.style.animationDelay = `${(-5 + rand() * 6).toFixed(3)}s`;
    drop.style.animationDuration = `${(3.3 + rand() * durationBase).toFixed(3)}s`;
    drop.style.opacity = String(type === 'fog' ? 0.12 + rand() * 0.1 : 0.2 + rand() * 0.25);
    rainRoot.append(drop);
  }

  for (let i = 0; i < dustCount; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'cyber-dust-particle';
    const size = 4 + rand() * 4;
    particle.style.left = `${(rand() * 100).toFixed(3)}%`;
    particle.style.top = `${(rand() * 100).toFixed(3)}%`;
    particle.style.width = `${size.toFixed(3)}px`;
    particle.style.height = `${size.toFixed(3)}px`;
    particle.style.animationDelay = `${(rand() * 10).toFixed(3)}s`;
    particle.style.animationDuration = `${(8 + rand() * 12).toFixed(3)}s`;
    dustRoot.append(particle);
  }
}
