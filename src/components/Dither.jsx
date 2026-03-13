import { useRef, useEffect } from 'react';

// ── Shaders ──────────────────────────────────────────────────────────────────
const VERT = `#version 300 es
in vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0.,1.);}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_color;
uniform float u_amplitude;
uniform float u_frequency;
uniform float u_speed;
uniform float u_pixelSize;
uniform float u_colorNum;

out vec4 o;

// 4×4 Bayer ordered-dither threshold matrix
const float B[16] = float[16](
   0., 8., 2.,10.,
  12., 4.,14., 6.,
   3.,11., 1., 9.,
  15., 7.,13., 5.
);

void main(){
  // Snap to pixel grid so every u_pixelSize × u_pixelSize block is uniform
  vec2 px  = floor(gl_FragCoord.xy / u_pixelSize);
  vec2 uv  = px * u_pixelSize / u_res;          // 0-1 UV in pixel-snapped space
  float t  = u_time * u_speed;

  // Two offset sine waves that interlock
  float w1 = sin(uv.x * u_frequency * 6.28318 + t * 6.28318) * .5 + .5;
  float w2 = sin(uv.y * u_frequency * 4.71239 - t * 4.0 + w1 * 2.09440) * .5 + .5;
  float val = mix(w1, w2, .5);

  // Amplitude scales contrast around 0.5
  // amplitude=0 → solid mid tone; amplitude=1 → full white↔black swing
  val = .5 + (val - .5) * clamp(u_amplitude * 3.5, 0., 1.5);
  val = clamp(val, 0., 1.);

  // Ordered dithering
  int bx = int(mod(px.x, 4.));
  int by = int(mod(px.y, 4.));
  float thresh = B[by * 4 + bx] / 16.;
  float steps  = u_colorNum - 1.;
  float q = clamp(floor(val * steps + thresh) / steps, 0., 1.);

  o = vec4(u_color * q, q);
}`;

// ── WebGL helpers ─────────────────────────────────────────────────────────────
function buildProgram(gl) {
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  return prog;
}

function setupGeometry(gl, prog) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // Two triangles covering clip-space (-1,-1)→(1,1)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
}

function getUniforms(gl, prog) {
  return {
    u_res:       gl.getUniformLocation(prog, 'u_res'),
    u_time:      gl.getUniformLocation(prog, 'u_time'),
    u_color:     gl.getUniformLocation(prog, 'u_color'),
    u_amplitude: gl.getUniformLocation(prog, 'u_amplitude'),
    u_frequency: gl.getUniformLocation(prog, 'u_frequency'),
    u_speed:     gl.getUniformLocation(prog, 'u_speed'),
    u_pixelSize: gl.getUniformLocation(prog, 'u_pixelSize'),
    u_colorNum:  gl.getUniformLocation(prog, 'u_colorNum'),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dither({
  waveColor          = [0.32, 0.15, 1.0],
  disableAnimation   = false,
  colorNum           = 4,
  pixelSize          = 2,
  waveAmplitude      = 0.3,
  waveFrequency      = 3,
  waveSpeed          = 0.05,
  // enableMouseInteraction & mouseRadius accepted for API compat but not used
}) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const timeRef   = useRef(0);

  // Keep latest props accessible inside the rAF loop without re-running the effect
  const props = useRef({});
  props.current = { waveColor, disableAnimation, colorNum, pixelSize, waveAmplitude, waveFrequency, waveSpeed };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const prog = buildProgram(gl);
    gl.useProgram(prog);
    setupGeometry(gl, prog);
    const U = getUniforms(gl, prog);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── Resize helper ──────────────────────────────────────────────────────
    let lastW = 0, lastH = 0;
    const syncSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(canvas.clientWidth  * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w !== lastW || h !== lastH) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        lastW = w; lastH = h;
      }
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    // ── Render loop ────────────────────────────────────────────────────────
    const render = (ts) => {
      rafRef.current = requestAnimationFrame(render);
      const p = props.current;

      if (!p.disableAnimation) timeRef.current = ts / 1000;

      syncSize();
      const dpr = window.devicePixelRatio || 1;

      gl.uniform2f(U.u_res,       canvas.width, canvas.height);
      gl.uniform1f(U.u_time,      timeRef.current);
      gl.uniform3fv(U.u_color,    p.waveColor);
      gl.uniform1f(U.u_amplitude, p.waveAmplitude);
      gl.uniform1f(U.u_frequency, p.waveFrequency);
      gl.uniform1f(U.u_speed,     p.waveSpeed);
      gl.uniform1f(U.u_pixelSize, p.pixelSize * dpr);
      gl.uniform1f(U.u_colorNum,  p.colorNum);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // empty — all config is read via props ref inside the loop

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
