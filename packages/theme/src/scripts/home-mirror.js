// A small refracting surface samples the existing rain; it never renders a second rain scene.
const instances = new WeakMap();
export function createHomeMirror(background, { onDispose } = {}) {
  const canvas = document.querySelector('.home-mirror');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (instances.has(canvas)) return instances.get(canvas);
  if (canvas.dataset.state === 'repaired') return;
  const surface = canvas.closest('.home-mirror-surface');
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  });
  if (!gl) {
    surface.hidden = true;
    return;
  }
  const vertex = `attribute vec2 position; varying vec2 uv;
    void main(){ uv=position*.5+.5; gl_Position=vec4(position,0.,1.); }`;
  const fragment = `precision mediump float;
    varying vec2 uv;
    uniform sampler2D rain;
    uniform float liquid, time, repair;
    uniform vec2 pointer, size;
    uniform vec4 seamColor;
    float segment(vec2 p, vec2 a, vec2 b){
      vec2 d=b-a; return length(p-a-d*clamp(dot(p-a,d)/dot(d,d),0.,1.));
    }
    void main(){
      vec2 p=vec2(uv.x,1.-uv.y);
      float crack=1.;
      // One crooked seam and two staggered branches form four broad pieces.
      crack=min(crack,segment(p,vec2(.57,0.),vec2(.52,.28)));
      crack=min(crack,segment(p,vec2(.52,.28),vec2(.67,.59)));
      crack=min(crack,segment(p,vec2(.67,.59),vec2(.61,1.)));
      crack=min(crack,segment(p,vec2(.52,.28),vec2(1.,.23)));
      crack=min(crack,segment(p,vec2(.67,.59),vec2(0.,.64)));
      float split=p.y<.28 ? mix(.57,.52,p.y/.28) :
        p.y<.59 ? mix(.52,.67,(p.y-.28)/.31) : mix(.67,.61,(p.y-.59)/.41);
      float shard=p.x<split ? step(.64-p.x*.05/.67,p.y) :
        2.+step(.28-(p.x-.52)*.05/.48,p.y);
      float tilt=(shard-1.5)*.055;
      vec2 local=p-.5;
      vec2 tilted=vec2(local.x*cos(tilt)-local.y*sin(tilt),
        local.x*sin(tilt)+local.y*cos(tilt));
      vec2 broken=tilted-local;
      broken+=vec2(sin(shard*5.7+1.),cos(shard*3.1+2.))*.065;
      broken+=tilted*(.022+shard*.012);
      vec2 delta=p-pointer;
      delta.x*=size.x/size.y;
      float radius=length(delta);
      float wave=sin(radius*29.-time*2.7)*exp(-radius*3.2);
      vec2 bend=delta/(radius+.06)*wave*.055;
      bend+=vec2(sin(p.y*8.+time*.55+wave),cos(p.x*7.-time*.4))*.026;
      vec2 sampleUV=clamp(p+mix(broken,bend,liquid)*(1.-repair),.015,.985);
      vec3 code=texture2D(rain,sampleUV).rgb;
      float sheen=.5+.5*sin(p.x*8.+p.y*5.+shard*.9);
      float pixel=1./max(size.x,size.y);
      float rim=1.-smoothstep(pixel*.25,pixel*.85,crack);
      float shadow=1.-smoothstep(.002,.009,crack);
      vec3 glass=code*mix(.66,.62,liquid)+vec3(.065,.09,.08)*(sheen*.65+.18);
      glass*=1.-shadow*.48*(1.-liquid);
      glass+=seamColor.rgb*seamColor.a*rim*(1.-liquid)*(1.-repair);
      float silver=pow(max(0.,wave),7.)*exp(-radius*1.9);
      glass+=vec3(.45,.57,.51)*silver*liquid;
      float fold=pow(.5+.5*sin(p.x*15.+p.y*3.+wave*2.5+time*.55),12.);
      glass+=vec3(.26,.33,.3)*fold*liquid*exp(-radius*1.8);
      gl_FragColor=vec4(glass,1.);
    }`;
  const shaders = [];
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      shaders.forEach((item) => gl.deleteShader(item));
      gl.deleteProgram(program);
      surface.hidden = true;
      return;
    }
    shaders.push(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    shaders.forEach((item) => gl.deleteShader(item));
    gl.deleteProgram(program);
    surface.hidden = true;
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const locations = Object.fromEntries(
    ['liquid', 'time', 'pointer', 'size', 'seamColor', 'repair'].map((name) => [
      name,
      gl.getUniformLocation(program, name),
    ])
  );
  const sample = document.createElement('canvas');
  const ctx = sample.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let rect,
    last = 0,
    blend = 0,
    hovered = false,
    disposed = false;
  let pointer = [0.69, 0.27];
  let repairStart;
  let paused = false;
  let pausedAt;
  let textureWidth = 0,
    textureHeight = 0;
  function measure() {
    rect = canvas.getBoundingClientRect();
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    canvas.width = sample.width = Math.round(rect.width * dpr);
    canvas.height = sample.height = Math.round(rect.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const color = getComputedStyle(canvas.closest('main'))
      .borderTopColor.match(/[\d.]+/g)
      ?.map(Number);
    if (color)
      gl.uniform4f(
        locations.seamColor,
        color[0] / 255,
        color[1] / 255,
        color[2] / 255,
        color[3] ?? 1
      );
  }
  const move = (event) => {
    if (
      repairStart !== undefined ||
      paused ||
      !fine.matches ||
      reduced.matches ||
      event.pointerType === 'touch'
    )
      return;
    pointer = [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
    hovered = pointer[0] >= 0 && pointer[0] <= 1 && pointer[1] >= 0 && pointer[1] <= 1;
    canvas.dataset.state = hovered ? 'liquid' : 'cracked';
  };
  const leave = () => {
    if (repairStart !== undefined) return;
    hovered = false;
    canvas.dataset.state = 'cracked';
  };
  function draw(now) {
    if (disposed || paused || document.hidden || now - last < 1000 / 30) return;
    const dt = Math.min(100, now - last) / 1000;
    last = now;
    const progress = repairStart === undefined ? 0 : Math.min(1, (now - repairStart) / 850);
    if (progress >= 1) {
      finishRepair();
      return;
    }
    const repair = progress * progress * (3 - 2 * progress);
    canvas.style.opacity = String(1 - repair);
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    blend += (Number(hovered && !reduced.matches) - blend) * (1 - Math.exp(-dt * 4.5));
    ctx.clearRect(0, 0, sample.width, sample.height);
    const sx = background.width / innerWidth,
      sy = background.height / innerHeight;
    if (background.width && background.height)
      ctx.drawImage(
        background,
        rect.left * sx,
        rect.top * sy,
        rect.width * sx,
        rect.height * sy,
        0,
        0,
        sample.width,
        sample.height
      );
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (textureWidth !== sample.width || textureHeight !== sample.height) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sample);
      textureWidth = sample.width;
      textureHeight = sample.height;
    } else gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sample);
    gl.uniform1f(locations.liquid, blend);
    gl.uniform1f(locations.time, now / 1000);
    gl.uniform1f(locations.repair, repair);
    gl.uniform2fv(locations.pointer, pointer);
    gl.uniform2f(locations.size, rect.width, rect.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  const scroll = () => {
    rect = canvas.getBoundingClientRect();
    leave();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', leave);
    document.removeEventListener('click', clickRegion);
    surface.removeEventListener('click', mend);
    window.removeEventListener('resize', measure);
    window.removeEventListener('scroll', scroll);
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
    sample.width = sample.height = canvas.width = canvas.height = 0;
    instances.delete(canvas);
    onDispose?.();
  };
  function finishRepair() {
    canvas.dataset.state = 'repaired';
    surface.hidden = true;
    dispose();
  }
  function mend() {
    if (repairStart !== undefined || disposed || paused) return;
    repairStart = performance.now();
    hovered = false;
    surface.disabled = true;
    canvas.dataset.state = 'repairing';
    if (reduced.matches) finishRepair();
  }
  function clickRegion(event) {
    if (event.detail === 0 || disposed || paused || repairStart !== undefined) return;
    const interactive = event.target.closest(
      'a, button, input, textarea, select, [contenteditable]'
    );
    if (interactive && interactive !== surface) return;
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    )
      mend();
  }
  measure();
  canvas.dataset.state = 'cracked';
  draw(performance.now());
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', leave);
  document.addEventListener('click', clickRegion);
  surface.addEventListener('click', mend);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', scroll, { passive: true });
  const pause = () => {
    if (paused || disposed) return;
    pausedAt = performance.now();
    paused = true;
    hovered = false;
    leave();
  };
  const resume = () => {
    if (disposed) return;
    if (paused && repairStart !== undefined) repairStart += performance.now() - pausedAt;
    paused = false;
    last = 0;
    if (reduced.matches) blend = 0;
    draw(performance.now());
  };
  const controller = { draw, start: resume, resume, pause, dispose };
  instances.set(canvas, controller);
  return controller;
}
