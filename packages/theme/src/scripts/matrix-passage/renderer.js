import { CROW_MOTION_GLSL } from './crow-motion.js';
import { CODE_RAIN_GLSL } from './code-rain.js';
import { RAIN_PROFILES } from './rain-profiles.js';
import { WALL_SIGNAL_COUNT } from './wall-signals.js';
import { passageCamera } from './camera.js';
import { createSignalGlow } from './signal-glow.js';

// Owns GPU allocation, drawing and disposal; receives a completed scene.
export function createPassageRenderer(canvas, scene, materials, palette, viewport) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) throw new Error('Perspective renderer unavailable');
  const width = viewport?.width ?? innerWidth,
    height = viewport?.height ?? innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, width < 721 ? 1 : 1.5);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error('Corridor shader failed');
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(
    program,
    compile(
      gl.VERTEX_SHADER,
      `
    attribute vec3 position; attribute vec2 uv; attribute float shade;
    attribute vec4 birdOrigin; attribute vec4 birdState;
    uniform mediump float flowTime;
    uniform float camera; uniform float aspect; uniform float doorAngle; uniform float doorMode; uniform float hinge; uniform float doorway;
    uniform mat4 view; uniform mat4 projection;
    varying vec2 texcoord; varying float brightness; varying float distance; varying vec3 worldPoint; varying vec3 localPoint;
    ${CROW_MOTION_GLSL}
    void main() {
            localPoint = position;
            vec3 point = position;
      if (doorMode > 2.5) {
        point = animateCrow(point, birdOrigin, birdState, flowTime);
      }
      if (doorMode > 0.5 && doorMode < 1.5) {
        float x = point.x - hinge; float z = point.z - doorway;
        point.x = hinge + cos(doorAngle) * x - sin(doorAngle) * z;
        point.z = doorway + sin(doorAngle) * x + cos(doorAngle) * z;
      }
      vec4 cameraPoint = view * vec4(point, 1.0);
      gl_Position = projection * cameraPoint;
      texcoord = uv; brightness = shade; distance = -cameraPoint.z; worldPoint = point;
    }
  `
    )
  );
  gl.attachShader(
    program,
    compile(
      gl.FRAGMENT_SHADER,
      `
    precision mediump float;
    uniform sampler2D image; uniform float fade; uniform float flowTime; uniform float figureMode; uniform float surfaceFlow; uniform float wallRain; uniform float roadRain; uniform float lightBoost;
    uniform vec4 signalMotion[${WALL_SIGNAL_COUNT}];
    uniform vec4 signalShape[${WALL_SIGNAL_COUNT}];
    uniform float maskPass; uniform float localRain; uniform vec4 rainMotion; uniform vec4 rainLight; uniform vec4 doorSurface;
    uniform float crowMode;
    uniform float ceilingRain;
    uniform float recolor; uniform vec3 palettePrimary; uniform vec3 paletteAccent;
    varying vec2 texcoord; varying float brightness; varying float distance; varying vec3 worldPoint; varying vec3 localPoint;
    ${CODE_RAIN_GLSL}
    void main() {
      vec2 rainUV = localRain > 0.5 ? vec2((localPoint.x + doorSurface.x) / (2.0 * doorSurface.x), (localPoint.y - doorSurface.y) / doorSurface.z) : texcoord;
      vec2 sampleUV = rainUV;
      float rainHead = 0.0;
      float rainTrail = 0.0;
      float wallLight = 1.0;
      float roadLight = 1.0;
      vec3 emission = vec3(0.0);
      if (figureMode > 0.5) {
        sampleUV *= vec2(0.35, 0.3);
        float speed = 0.038 + 0.012 * sin(texcoord.x * 23.0);
        sampleUV.y -= flowTime * speed;
      } else if (wallRain > 0.5) {
        vec4 rain = sampleCodeRain(rainUV, localPoint.xz, localRain);
        sampleUV.y = rain.x; rainHead = rain.y; rainTrail = rain.z; wallLight = rain.w;
      } else if (ceilingRain > 0.5) {
        // Stable world-space lanes: adjoining ceiling panels share the same stream.
        float lane = floor(worldPoint.x * 10.0);
        float seed = rainRandom(lane + 137.0);
        float direction = seed < 0.48 ? -1.0 : 1.0;
        float speed = 0.07 + rainRandom(lane + 61.0) * 0.09;
        sampleUV.y -= flowTime * speed * direction;
        float trail = 1.0 - smoothstep(0.03, 0.30, fract(direction * rainUV.y - flowTime * speed - seed));
        roadLight = 0.62 + rainRandom(lane + 29.0) * 0.36 + trail * 0.28;
      } else if (roadRain > 0.5) {
        float lane = floor(worldPoint.x * 12.0);
        float seed = rainRandom(lane + 91.0);
        float direction = seed < 0.30 ? -1.0 : 1.0;
        float speed = 0.12 + rainRandom(lane + 7.0) * 0.10;
        sampleUV.y -= flowTime * speed * direction;
        float trail = 1.0 - smoothstep(0.02, 0.28, fract(direction * texcoord.y - flowTime * speed - seed));
        float featured = step(0.62, rainRandom(lane + 43.0));
        roadLight = mix(0.42, direction > 0.0 ? 1.55 : 0.80, featured) + trail * featured * 0.45;
      } else if (surfaceFlow > 0.5) {
        float speed = surfaceFlow > 1.5 ? 0.024 : 0.035;
        sampleUV.y -= flowTime * speed;
      }
      vec3 code = texture2D(image, sampleUV).rgb * brightness * lightBoost * roadLight;
      if (wallRain > 0.5) {
        code *= wallLight * (0.72 + rainTrail * 0.60 * rainLight.z);
        code *= vec3(0.78, 1.08, 0.82);
        // Highlight existing glyphs rather than painting solid light streaks.
        code += vec3(0.36, 0.48, 0.39) * rainHead * rainLight.z * min(1.0, code.g * 1.6);
        float side = localRain > 0.5 ? 0.0 : step(0.0, localPoint.x);
        // Signal coordinates have their own clock: neighboring columns cannot shear a cluster.
        for (int i = 0; i < ${WALL_SIGNAL_COUNT}; i++) {
          vec4 motion = signalMotion[i];
          vec4 shape = signalShape[i];
          if (motion.w > 0.0 && abs(shape.w - side) < 0.5) {
            vec2 center = vec2(motion.x, fract(motion.y + flowTime * motion.z));
            vec2 delta = rainUV - center;
            delta.y -= floor(delta.y + 0.5);
            vec2 local = delta / shape.xy;
            float radius = dot(local, local);
            if (radius < 9.0) {
              float core = exp(-radius * 1.6) * motion.w;
              float halo = exp(-radius * 0.48) * motion.w;
              vec2 glyphUV = vec2(rainUV.x + shape.z, rainUV.y - flowTime * motion.z);
              float glyph = smoothstep(0.08, 0.55, texture2D(image, glyphUV).g);
              // A pale multi-glyph center plus real glow even between the glyphs.
              emission += vec3(0.72, 1.0, 0.84) * core * (0.30 + glyph * 1.65);
              emission += vec3(0.12, 0.36, 0.23) * halo;
            }
          }
        }
      }
      if (localRain > 0.5) {
        float handleDistance = length((rainUV - vec2(doorSurface.w, 0.5)) * vec2(1.0, 1.4));
        float anchor = smoothstep(0.045, 0.16, handleDistance);
        code *= mix(0.60, 1.0, anchor);
        emission *= rainLight.w * anchor;
      }
      code += emission;
      if (crowMode > 0.5) {
        // A pale-green body floor keeps the silhouette readable over bright ground code.
        float glyph = smoothstep(0.08, 0.55, texture2D(image, sampleUV).g);
        code = code * 1.5 + vec3(0.12, 0.40, 0.22) + vec3(0.26, 0.38, 0.30) * glyph;
      }
      if (figureMode > 0.5) {
        float pulse = smoothstep(0.93, 0.99, fract(texcoord.y * 0.55 - flowTime * 0.12));
        code += vec3(0.12, 0.22, 0.15) * pulse * min(1.0, code.g * 2.0);
      }
      float mist = min(0.22, max(0.0, distance - 4.0) * 0.02);
      code = mix(code, vec3(0.012, 0.08, 0.022), mist);
      float darkness = 1.0 - smoothstep(20.0, 60.0, distance);
      // The square recedes into deep green while the first corridor retains its intensity.
      float square = smoothstep(6.0, 7.0, worldPoint.z);
      float depthLight = exp(-0.055 * max(0.0, distance - 6.0));
      float backdrop = smoothstep(23.0, 29.0, worldPoint.z);
      float behindOracle = exp(-pow((worldPoint.x + 0.55) / 5.0, 2.0)
                               -pow((worldPoint.y + 0.2) / 4.0, 2.0));
      darkness *= mix(1.0, depthLight, square) * (1.0 - 0.7 * backdrop * behindOracle);
      vec3 result = (maskPass > 0.5 ? emission : code) * darkness * (1.0 - fade);
      if (recolor > 0.5) {
        float intensity = max(result.r, max(result.g, result.b));
        float pale = min(result.r, result.b) / max(0.001, intensity);
        float accent = smoothstep(0.60, 0.95, sin(worldPoint.x * 0.7 + worldPoint.z * 0.32)) * 0.7;
        vec3 tint = mix(palettePrimary, paletteAccent, accent);
        result = mix(tint, vec3(1.0), pale * 0.65) * intensity;
      }
      gl_FragColor = vec4(result, 1.0);
    }
  `
    )
  );
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Corridor program failed');
  gl.useProgram(program);
  gl.uniform1f(gl.getUniformLocation(program, 'recolor'), palette?.recolor ? 1 : 0);
  gl.uniform3fv(
    gl.getUniformLocation(program, 'palettePrimary'),
    palette?.primary ?? [0.38, 1, 0.5]
  );
  gl.uniform3fv(
    gl.getUniformLocation(program, 'paletteAccent'),
    palette?.accent ?? [0.69, 1, 0.75]
  );
  const cameraUniform = gl.getUniformLocation(program, 'camera');
  const viewUniform = gl.getUniformLocation(program, 'view');
  const projectionUniform = gl.getUniformLocation(program, 'projection');
  const maskPass = gl.getUniformLocation(program, 'maskPass');
  const fadeUniform = gl.getUniformLocation(program, 'fade');
  gl.uniform1f(gl.getUniformLocation(program, 'aspect'), width / height);
  gl.uniform1i(gl.getUniformLocation(program, 'image'), 0);
  const signalMotion = gl.getUniformLocation(program, 'signalMotion[0]');
  const signalShape = gl.getUniformLocation(program, 'signalShape[0]');
  const localRain = gl.getUniformLocation(program, 'localRain');
  const rainMotion = gl.getUniformLocation(program, 'rainMotion');
  const rainLight = gl.getUniformLocation(program, 'rainLight');
  const { doorHalf, doorTop, floor } = scene.dimensions;
  gl.uniform4fv(gl.getUniformLocation(program, 'doorSurface'), [
    doorHalf,
    doorTop,
    floor - doorTop,
    1 - 0.22 / (2 * doorHalf),
  ]);

  const textures = materials.map((material) => {
    const handle = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, handle);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material.canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      material.mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR
    );
    if (material.mipmap) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);
      const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
      if (anisotropy)
        gl.texParameterf(
          gl.TEXTURE_2D,
          anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
        );
    }
    return handle;
  });
  const makeBuffers = (valuesList, stride = 24) =>
    valuesList.map((values) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
      return { buffer, count: values.length / (stride / 4) };
    });
  const uploadGroup = (group) => ({
    id: group.id,
    mode: group.mode,
    behindDoor: Boolean(group.behindDoor),
    profile: RAIN_PROFILES[group.rain],
    signals: group.rain === 'door' ? scene.doorSignals : scene.wallSignals,
    staticCode: Boolean(group.staticCode),
    roadRain: Boolean(group.roadRain),
    lightBoost: group.lightBoost ?? 1,
    stride: group.stride ?? 24,
    buffers: makeBuffers(group.batches, group.stride),
  });
  const groups = scene.groups.map(uploadGroup);
  const figureMode = gl.getUniformLocation(program, 'figureMode');
  const crowMode = gl.getUniformLocation(program, 'crowMode');
  const surfaceFlow = gl.getUniformLocation(program, 'surfaceFlow');
  const flowTime = gl.getUniformLocation(program, 'flowTime');
  const wallRain = gl.getUniformLocation(program, 'wallRain');
  const roadRain = gl.getUniformLocation(program, 'roadRain');
  const ceilingRain = gl.getUniformLocation(program, 'ceilingRain');
  const lightBoost = gl.getUniformLocation(program, 'lightBoost');
  const doorMode = gl.getUniformLocation(program, 'doorMode');
  const doorAngle = gl.getUniformLocation(program, 'doorAngle');
  gl.uniform1f(gl.getUniformLocation(program, 'hinge'), scene.doorway.hinge);
  gl.uniform1f(gl.getUniformLocation(program, 'doorway'), scene.doorway.depth);
  const attributes = [
    ['position', 3, 0],
    ['uv', 2, 12],
    ['shade', 1, 20],
  ].map(([name, size, offset]) => ({
    location: gl.getAttribLocation(program, name),
    size,
    offset,
  }));
  const birdAttributes = [
    ['birdOrigin', 24],
    ['birdState', 40],
  ].map(([name, offset]) => ({ location: gl.getAttribLocation(program, name), offset }));
  gl.enable(gl.DEPTH_TEST);
  const background = palette?.recolor ? [0, 0, 0] : [0.001, 0.012, 0.003];
  gl.clearColor(...background, 1);
  const glow = createSignalGlow(gl, canvas.width, canvas.height, width < 721);
  let courtyardVisible = false;
  const renderScene = (target, mask) => {
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer ?? null);
    gl.viewport(0, 0, target?.width ?? canvas.width, target?.height ?? canvas.height);
    gl.clearColor(...(mask ? [0, 0, 0] : background), 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(maskPass, mask ? 1 : 0);
    for (const {
      behindDoor,
      mode,
      profile,
      signals,
      staticCode,
      stride,
      roadRain: road,
      lightBoost: boost,
      buffers: group,
    } of groups) {
      // Keep uploaded resources for reuse, but skip both color and glow-mask work
      // while the existing door timeline says the opaque leaf is fully closed.
      if (behindDoor && !courtyardVisible) continue;
      gl.uniform1f(localRain, profile?.local ? 1 : 0);
      if (profile) {
        gl.uniform4fv(rainMotion, profile.motion);
        gl.uniform4fv(rainLight, profile.light);
        gl.uniform4fv(signalMotion, signals.motion);
        gl.uniform4fv(signalShape, signals.shapes);
      }
      gl.uniform1f(roadRain, road ? 1 : 0);
      gl.uniform1f(lightBoost, boost);
      gl.uniform1f(doorMode, mode);
      gl.uniform1f(figureMode, mode === 2 ? 1 : 0);
      gl.uniform1f(crowMode, mode === 3 ? 1 : 0);
      for (let i = 0; i < group.length; i++) {
        if (!group[i].count) continue;
        gl.uniform1f(ceilingRain, materials[i].name === 'ceiling' && !staticCode ? 1 : 0);
        gl.uniform1f(localRain, profile?.local && materials[i].flow ? 1 : 0);
        gl.uniform1f(wallRain, profile && materials[i].flow ? 1 : 0);
        gl.uniform1f(
          surfaceFlow,
          mode === 2 || staticCode || materials[i].name === 'ceiling' ? 0 : materials[i].flow
        );
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.bindBuffer(gl.ARRAY_BUFFER, group[i].buffer);
        for (const attr of attributes) {
          gl.enableVertexAttribArray(attr.location);
          gl.vertexAttribPointer(attr.location, attr.size, gl.FLOAT, false, stride, attr.offset);
        }
        for (const attr of birdAttributes) {
          if (mode === 3) {
            gl.enableVertexAttribArray(attr.location);
            gl.vertexAttribPointer(attr.location, 4, gl.FLOAT, false, stride, attr.offset);
          } else {
            gl.disableVertexAttribArray(attr.location);
            gl.vertexAttrib4f(attr.location, 0, 0, 0, 0);
          }
        }
        gl.drawArrays(gl.TRIANGLES, 0, group[i].count);
      }
    }
  };
  const draw = ({ distance, angle, elapsed, eyeY, pitch, yaw }) => {
    courtyardVisible = angle !== 0;
    gl.useProgram(program);
    const camera = passageCamera({ distance, eyeY, pitch, yaw }, width / height);
    gl.uniformMatrix4fv(viewUniform, false, camera.view);
    gl.uniformMatrix4fv(projectionUniform, false, camera.projection);
    gl.uniform1f(cameraUniform, distance);
    gl.uniform1f(doorAngle, angle);
    gl.uniform1f(fadeUniform, 0);
    gl.uniform1f(flowTime, elapsed);
    if (glow) glow.draw(renderScene);
    else renderScene(null, false);
  };
  let disposed = false;
  draw.addGroups = (additional) => {
    if (disposed) return;
    for (const group of additional) {
      if (!groups.some((existing) => existing.id === group.id)) groups.push(uploadGroup(group));
    }
  };
  draw.dispose = () => {
    if (disposed) return;
    disposed = true;
    glow?.dispose();
    for (const texture of textures) gl.deleteTexture(texture);
    for (const group of groups) for (const { buffer } of group.buffers) gl.deleteBuffer(buffer);
    for (const shader of gl.getAttachedShaders(program)) gl.deleteShader(shader);
    gl.deleteProgram(program);
  };
  return draw;
}
