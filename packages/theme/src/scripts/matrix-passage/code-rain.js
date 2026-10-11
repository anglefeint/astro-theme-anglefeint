// Shared shader source; profiles provide motion/light parameters per surface.
export const CODE_RAIN_GLSL = `
    float rainRandom(float value) {
      vec3 p = fract(vec3(value) * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }

vec4 sampleCodeRain(vec2 uv, vec2 surface, float localSurface) {
        // Neighboring bands share direction; some rise while most fall.
        // World-space lighting stays attached to the wall as the camera advances.
        float column = floor(uv.x * rainMotion.w);
        float side = localSurface > 0.5 ? 0.0 : step(0.0, surface.x);
        float band = localSurface > 0.5 ? floor(uv.x * 10.0) : floor(surface.y * 2.4);
        float direction = rainRandom(band + side * 19.0) < rainMotion.z ? -1.0 : 1.0;
        float seed = rainRandom(column + band * 7.0 + side * 53.0);
        float speed = rainMotion.x + seed * rainMotion.y;
        float sampleY = uv.y - flowTime * speed * direction;
        float run = fract(direction * (uv.y - seed) - flowTime * speed);
        float rainHead = 1.0 - smoothstep(0.0, 0.018, run);
        float rainTrail = 1.0 - smoothstep(0.02, 0.32, run);
        float zone = localSurface > 0.5 ? uv.x * 6.0 : surface.y * 1.4 + side * 11.0;
        float blend = smoothstep(0.0, 1.0, fract(zone));
        float patch = mix(rainRandom(floor(zone) + 71.0), rainRandom(floor(zone) + 72.0), blend);
        float wallLight = mix(rainLight.x, rainLight.y, smoothstep(0.15, 0.85, patch));
        wallLight *= 0.75 + seed * 0.45;

return vec4(sampleY, rainHead, rainTrail, wallLight);
}
`;
