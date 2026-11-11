import { mountCyberDust } from '../effects/cyber-dust/cyber-dust.js';
import { mountCyberRain } from '../effects/cyber-rain/cyber-rain.js';

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

  mountCyberRain(rainRoot, { random: rand });
  mountCyberDust(dustRoot, { random: rand });
}
