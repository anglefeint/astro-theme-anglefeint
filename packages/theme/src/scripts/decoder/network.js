// Compatibility adapter for earlier page integrations.
import { mountNetworkBackground } from '../effects/network-background.js';
export function mountDecoderNetwork(root) {
  return mountNetworkBackground(root.querySelector('[data-network-background]'));
}
