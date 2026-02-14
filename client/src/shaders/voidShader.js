// Vertex Shader
export const voidVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
export const voidFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uIntensity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  varying vec2 vUv;
  
  // Simple noise function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 st = vUv;
    
    // Create flowing noise
    float n = noise(st * 3.0 + uTime * 0.1);
    n += noise(st * 6.0 - uTime * 0.15) * 0.5;
    n += noise(st * 12.0 + uTime * 0.2) * 0.25;
    n /= 1.75;
    
    // Mix colors based on noise
    vec3 color = mix(uColor1, uColor2, n);
    
    // Add grain
    float grain = random(st + uTime) * 0.05 * uIntensity;
    color += grain;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Shader presets
export const shaderPresets = {
  // Original presets
  cosmic: {
    color1: [0.05, 0.05, 0.15],
    color2: [0.15, 0.1, 0.3],
    intensity: 1.0,
    name: 'Cosmic Void'
  },
  sunset: {
    color1: [0.2, 0.05, 0.1],
    color2: [0.4, 0.15, 0.2],
    intensity: 0.8,
    name: 'Sunset Gradient'
  },
  monochrome: {
    color1: [0.1, 0.1, 0.1],
    color2: [0.2, 0.2, 0.2],
    intensity: 0.6,
    name: 'Monochrome'
  },
  ocean: {
    color1: [0.05, 0.1, 0.2],
    color2: [0.1, 0.2, 0.3],
    intensity: 0.9,
    name: 'Deep Ocean'
  },
  
  // New vibrant presets
  fire: {
    color1: [0.3, 0.05, 0.0],
    color2: [0.6, 0.2, 0.0],
    intensity: 1.2,
    name: 'Fire'
  },
  aurora: {
    color1: [0.0, 0.2, 0.3],
    color2: [0.1, 0.3, 0.5],
    intensity: 1.1,
    name: 'Aurora Borealis'
  },
  forest: {
    color1: [0.05, 0.15, 0.08],
    color2: [0.1, 0.25, 0.12],
    intensity: 0.9,
    name: 'Deep Forest'
  },
  lavender: {
    color1: [0.2, 0.1, 0.25],
    color2: [0.3, 0.2, 0.4],
    intensity: 0.8,
    name: 'Lavender Dreams'
  },
  
  // Dramatic presets
  bloodMoon: {
    color1: [0.2, 0.0, 0.05],
    color2: [0.4, 0.05, 0.1],
    intensity: 1.3,
    name: 'Blood Moon'
  },
  midnight: {
    color1: [0.02, 0.02, 0.08],
    color2: [0.05, 0.05, 0.15],
    intensity: 0.7,
    name: 'Midnight'
  },
  ember: {
    color1: [0.25, 0.1, 0.05],
    color2: [0.5, 0.25, 0.1],
    intensity: 1.0,
    name: 'Dying Ember'
  },
  
  // Cool/tech presets
  neon: {
    color1: [0.1, 0.0, 0.2],
    color2: [0.3, 0.0, 0.5],
    intensity: 1.4,
    name: 'Neon Nights'
  },
  matrix: {
    color1: [0.0, 0.1, 0.05],
    color2: [0.0, 0.25, 0.1],
    intensity: 1.1,
    name: 'Matrix Code'
  },
  cyberpunk: {
    color1: [0.15, 0.0, 0.25],
    color2: [0.3, 0.15, 0.4],
    intensity: 1.2,
    name: 'Cyberpunk'
  },
  
  // Light/minimal presets
  paper: {
    color1: [0.85, 0.85, 0.82],
    color2: [0.92, 0.92, 0.9],
    intensity: 0.3,
    name: 'Paper'
  },
  cream: {
    color1: [0.9, 0.88, 0.82],
    color2: [0.95, 0.93, 0.88],
    intensity: 0.4,
    name: 'Cream'
  },
  fog: {
    color1: [0.6, 0.62, 0.65],
    color2: [0.75, 0.77, 0.8],
    intensity: 0.5,
    name: 'Morning Fog'
  },
  
  // Warm presets
  desert: {
    color1: [0.3, 0.2, 0.1],
    color2: [0.5, 0.35, 0.2],
    intensity: 0.9,
    name: 'Desert Sand'
  },
  copper: {
    color1: [0.35, 0.2, 0.15],
    color2: [0.55, 0.35, 0.25],
    intensity: 1.0,
    name: 'Copper Patina'
  },
  
  // Pastel presets
  sakura: {
    color1: [0.4, 0.25, 0.3],
    color2: [0.6, 0.4, 0.45],
    intensity: 0.6,
    name: 'Sakura Petals'
  },
  mint: {
    color1: [0.25, 0.35, 0.3],
    color2: [0.4, 0.5, 0.45],
    intensity: 0.7,
    name: 'Mint Breeze'
  },
  peach: {
    color1: [0.45, 0.3, 0.25],
    color2: [0.65, 0.45, 0.4],
    intensity: 0.7,
    name: 'Peach Fuzz'
  }
};