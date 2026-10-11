// Selective low-resolution bloom. Depth-tested scene masks preserve occlusion.
export function createSignalGlow(gl, width, height, mobile) {
  const textures = [],
    framebuffers = [],
    renderbuffers = [],
    shaders = [],
    programs = [];
  let quad;
  const dispose = () => {
    textures.forEach((v) => gl.deleteTexture(v));
    framebuffers.forEach((v) => gl.deleteFramebuffer(v));
    renderbuffers.forEach((v) => gl.deleteRenderbuffer(v));
    shaders.forEach((v) => gl.deleteShader(v));
    programs.forEach((v) => gl.deleteProgram(v));
    if (quad) gl.deleteBuffer(quad);
  };
  try {
    const target = (w, h, depth = false) => {
      const texture = gl.createTexture();
      textures.push(texture);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const framebuffer = gl.createFramebuffer();
      framebuffers.push(framebuffer);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (depth) {
        const buffer = gl.createRenderbuffer();
        renderbuffers.push(buffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, buffer);
      }
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw new Error('Signal glow framebuffer unavailable');
      return { texture, framebuffer, width: w, height: h };
    };
    const smallWidth = Math.max(1, Math.round(width / (mobile ? 6 : 4)));
    const smallHeight = Math.max(1, Math.round(height / (mobile ? 6 : 4)));
    const scene = target(width, height, true),
      mask = target(smallWidth, smallHeight, true);
    const blur = target(smallWidth, smallHeight),
      glow = target(smallWidth, smallHeight);
    const program = gl.createProgram();
    programs.push(program);
    for (const [type, source] of [
      [
        gl.VERTEX_SHADER,
        `attribute vec2 position; varying vec2 uv; void main() { uv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }`,
      ],
      [
        gl.FRAGMENT_SHADER,
        `precision mediump float; varying vec2 uv;
        uniform sampler2D image; uniform sampler2D bloom; uniform vec2 stepSize; uniform float composite;
        void main() {
          if (composite > 0.5) {
            gl_FragColor = vec4(texture2D(image, uv).rgb + texture2D(bloom, uv).rgb * 0.8, 1.0);
          } else {
            vec3 color = texture2D(image, uv).rgb * 0.227027;
            color += (texture2D(image, uv + stepSize * 1.384615).rgb + texture2D(image, uv - stepSize * 1.384615).rgb) * 0.316216;
            color += (texture2D(image, uv + stepSize * 3.230769).rgb + texture2D(image, uv - stepSize * 3.230769).rgb) * 0.070270;
            gl_FragColor = vec4(color, 1.0);
          }
        }`,
      ],
    ]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error('Signal glow shader unavailable');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error('Signal glow program unavailable');
    quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const location = gl.getAttribLocation(program, 'position');
    const uniforms = Object.fromEntries(
      ['image', 'bloom', 'stepSize', 'composite'].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ])
    );
    const pass = (input, output, step, composite = false) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, output?.framebuffer ?? null);
      gl.viewport(0, 0, output?.width ?? width, output?.height ?? height);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, input.texture);
      gl.uniform1i(uniforms.image, 0);
      gl.uniform1i(uniforms.bloom, 0);
      gl.uniform2fv(uniforms.stepSize, step);
      gl.uniform1f(uniforms.composite, composite ? 1 : 0);
      if (composite) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glow.texture);
        gl.uniform1i(uniforms.bloom, 1);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    return {
      draw(renderScene) {
        renderScene(scene, false);
        renderScene(mask, true);
        gl.disable(gl.DEPTH_TEST);
        pass(mask, blur, [2 / smallWidth, 0]);
        pass(blur, glow, [0, 2 / smallHeight]);
        pass(scene, null, [0, 0], true);
        gl.activeTexture(gl.TEXTURE0);
        gl.enable(gl.DEPTH_TEST);
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  } finally {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0);
  }
}
