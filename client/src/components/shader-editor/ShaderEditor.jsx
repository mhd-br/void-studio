import { useState } from 'react';
import { X, Play, Copy, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import useCanvasStore from '../../store/useCanvasStore';
import { voidFragmentShader } from '../../shaders/voidShader';
import '../../styles/ShaderEditor.css';

export default function ShaderEditor({ onClose }) {
  const { voidConfig, updateVoidConfig } = useCanvasStore();
  
  // Start with current shader or default template
  const [shaderCode, setShaderCode] = useState(voidFragmentShader);
  const [error, setError] = useState(null);
  const [compiling, setCompiling] = useState(false);
  
  // Default template for new shaders
  const defaultTemplate = `uniform float uTime;
  uniform vec2 uResolution;
  uniform float uIntensity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;

  // Your custom shader code here
  void main() {
    vec2 st = vUv;
    
    // Example: Simple gradient
    vec3 color = mix(uColor1, uColor2, st.y);
    
    // Add animation using uTime
    color *= 1.0 + sin(uTime + st.x * 10.0) * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }`;
  
  const handleApply = () => {
    setCompiling(true);
    setError(null);
    
    // Basic validation
    if (!shaderCode.includes('void main()')) {
      setError('Shader must contain a main() function');
      setCompiling(false);
      return;
    }
    
    if (!shaderCode.includes('gl_FragColor')) {
      setError('Shader must set gl_FragColor');
      setCompiling(false);
      return;
    }
    
    // Try to apply the shader
    try {
      // Store custom shader in config
      updateVoidConfig({
        customShader: shaderCode,
        preset: 'custom'
      });
      
      setCompiling(false);
      setError(null);
      
      // Show success message
      setTimeout(() => {
        alert('Shader applied! If you see a black screen, check for errors.');
      }, 100);
      
    } catch (err) {
      setError(err.message);
      setCompiling(false);
    }
  };
  
  const handleReset = () => {
    if (confirm('Reset to default template? This will discard your changes.')) {
      setShaderCode(defaultTemplate);
      setError(null);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shaderCode);
    alert('Shader code copied to clipboard!');
  };
  
  // Example shaders
  const examples = [
    {
      name: 'Simple Gradient',
      code: defaultTemplate
    },
    {
      name: 'Animated Circles',
      code: `uniform float uTime;
uniform vec2 uResolution;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
  vec2 st = vUv - 0.5;
  
  float d = length(st);
  float wave = sin(d * 10.0 - uTime * 2.0) * 0.5 + 0.5;
  
  vec3 color = mix(uColor1, uColor2, wave);
  
  gl_FragColor = vec4(color, 1.0);
}`
    },
    {
      name: 'Plasma Effect',
      code: `uniform float uTime;
uniform vec2 uResolution;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  
  float v = 0.0;
  v += sin(st.x * 10.0 + uTime);
  v += sin(st.y * 10.0 + uTime);
  v += sin((st.x + st.y) * 10.0 + uTime);
  v += sin(sqrt(st.x * st.x + st.y * st.y) * 10.0 + uTime);
  v *= 0.25;
  
  vec3 color = mix(uColor1, uColor2, v);
  
  gl_FragColor = vec4(color, 1.0);
}`
    },
    {
      name: 'Grid Pattern',
      code: `uniform float uTime;
uniform vec2 uResolution;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
  vec2 st = vUv * 10.0;
  vec2 grid = fract(st);
  
  float line = step(0.95, grid.x) + step(0.95, grid.y);
  
  vec3 color = mix(uColor1, uColor2, line);
  
  gl_FragColor = vec4(color, 1.0);
}`
    }
  ];
  
  return (
    <div className="shader-editor-overlay" onClick={onClose}>
      <div className="shader-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shader-editor-header">
          <h2>Custom Shader Editor</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="shader-editor-body">
          {/* Examples sidebar */}
          <div className="shader-examples">
            <h3>Examples</h3>
            <div className="examples-list">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  className="example-item"
                  onClick={() => {
                    setShaderCode(example.code);
                    setError(null);
                  }}
                >
                  {example.name}
                </button>
              ))}
            </div>
            
            <div className="shader-info">
              <h4>Available Uniforms:</h4>
              <ul>
                <li><code>float uTime</code> - Time in seconds</li>
                <li><code>vec2 uResolution</code> - Canvas size</li>
                <li><code>float uIntensity</code> - Intensity slider</li>
                <li><code>vec3 uColor1</code> - First color</li>
                <li><code>vec3 uColor2</code> - Second color</li>
              </ul>
              
              <h4>Variables:</h4>
              <ul>
                <li><code>vec2 vUv</code> - UV coordinates (0-1)</li>
              </ul>
            </div>
          </div>
          
          {/* Editor */}
          <div className="shader-editor-content">
            <div className="editor-toolbar">
              <button className="editor-btn" onClick={handleApply} disabled={compiling}>
                <Play size={16} />
                {compiling ? 'Compiling...' : 'Apply Shader'}
              </button>
              <button className="editor-btn" onClick={handleCopy}>
                <Copy size={16} />
                Copy Code
              </button>
              <button className="editor-btn" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
            
            {error && (
              <div className="shader-error">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <div className="editor-container">
              <Editor
                height="100%"
                defaultLanguage="glsl"
                theme="vs-dark"
                value={shaderCode}
                onChange={(value) => setShaderCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="shader-editor-footer">
          <span className="footer-hint">
            💡 Tip: Use <code>uTime</code> for animations, <code>vUv</code> for position-based effects
          </span>
        </div>
      </div>
    </div>
  );
}