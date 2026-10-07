import React, { useEffect, useRef } from 'react';
import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

function hexToRgb(hex) {
  let c = (hex || '#000000').replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
}

export default function Aurora(props) {
  const { 
    colorStops = ["#7cff67", "#B497CF", "#5227FF"], 
    amplitude = 1.0, 
    blend = 0.5, 
    speed = 1.0,
    lightMode = false 
  } = props;

  const ctnDom = useRef(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Context WebGL 2
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Compile Shader Helper
    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Full-screen Triangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uAmplitudeLoc = gl.getUniformLocation(program, 'uAmplitude');
    const uColorStopsLoc = gl.getUniformLocation(program, 'uColorStops');
    const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const uBlendLoc = gl.getUniformLocation(program, 'uBlend');
    const uLightModeLoc = gl.getUniformLocation(program, 'uLightMode');

    function resize() {
      if (!container || !gl) return;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uResolutionLoc, width, height);
    }

    window.addEventListener('resize', resize);
    resize();

    let animId = 0;
    let startTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);

      const elapsed = (now - startTime) * 0.001;
      const currentProps = propsRef.current;
      const currentSpeed = currentProps.speed ?? speed;
      
      gl.uniform1f(uTimeLoc, elapsed * currentSpeed * 0.1);
      gl.uniform1f(uAmplitudeLoc, currentProps.amplitude ?? amplitude);
      gl.uniform1f(uBlendLoc, currentProps.blend ?? blend);
      gl.uniform1f(uLightModeLoc, (currentProps.lightMode ?? lightMode) ? 1.0 : 0.0);

      const stops = currentProps.colorStops ?? colorStops;
      const flatColors = [];
      stops.forEach(hex => {
        const rgb = hexToRgb(hex);
        flatColors.push(rgb[0], rgb[1], rgb[2]);
      });
      gl.uniform3fv(uColorStopsLoc, new Float32Array(flatColors));

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [amplitude, blend, lightMode, speed]);

  return (
    <div className="aurora-bg-wrapper">
      <div ref={ctnDom} className="aurora-container" />
    </div>
  );
}
