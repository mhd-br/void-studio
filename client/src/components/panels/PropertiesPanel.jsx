import { Code } from 'lucide-react';
import { useState } from 'react';
import { shaderPresets } from '../../shaders/voidShader';
import useCanvasStore from '../../store/useCanvasStore';
import ShaderEditor from '../shader-editor/ShaderEditor';
import '../../styles/PropertiesPanel.css';

export default function PropertiesPanel() {
  const { voidConfig, updateVoidConfig, selectedLayerId, getSelectedLayer, updateLayer } = useCanvasStore();
  const selectedLayer = getSelectedLayer();
  const [showShaderEditor, setShowShaderEditor] = useState(false);
  
  const handlePresetChange = (presetKey) => {
    const preset = shaderPresets[presetKey];
    updateVoidConfig({
      preset: presetKey,
      color1: preset.color1,
      color2: preset.color2,
      intensity: preset.intensity,
      customShader: null // Clear custom shader when selecting preset
    });
  };
  
  // Organize presets by category
  const presetCategories = {
    'Original': ['cosmic', 'sunset', 'monochrome', 'ocean'],
    'Vibrant': ['fire', 'aurora', 'forest', 'lavender'],
    'Dramatic': ['bloodMoon', 'midnight', 'ember'],
    'Tech': ['neon', 'matrix', 'cyberpunk'],
    'Light': ['paper', 'cream', 'fog'],
    'Warm': ['desert', 'copper'],
    'Pastel': ['sakura', 'mint', 'peach']
  };
  
  return (
    <>
      <div className="properties-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        
        <div className="properties-content">
          {/* Void Space Configuration */}
          <div className="property-section">
            <h4>Void Space</h4>
            
            <div className="property-group">
              <label>Preset</label>
              <select
                value={voidConfig.customShader ? 'custom' : voidConfig.preset}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setShowShaderEditor(true);
                  } else {
                    handlePresetChange(e.target.value);
                  }
                }}
                className="property-select"
              >
                {voidConfig.customShader && (
                  <option value="custom">Custom Shader</option>
                )}
                {Object.entries(presetCategories).map(([category, presetKeys]) => (
                  <optgroup key={category} label={category}>
                    {presetKeys.map(key => (
                      <option key={key} value={key}>
                        {shaderPresets[key].name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            <div className="property-group">
              <label>Intensity</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={voidConfig.intensity}
                onChange={(e) => updateVoidConfig({ intensity: parseFloat(e.target.value) })}
                className="property-slider"
              />
              <span className="property-value">{voidConfig.intensity.toFixed(1)}</span>
            </div>
            
            {/* Color preview */}
            <div className="void-preview">
              <div className="void-preview-label">Colors</div>
              <div className="void-preview-colors">
                <div 
                  className="void-color-swatch"
                  style={{ 
                    backgroundColor: `rgb(${voidConfig.color1.map(c => c * 255).join(',')})` 
                  }}
                  title="Color 1"
                />
                <div 
                  className="void-color-swatch"
                  style={{ 
                    backgroundColor: `rgb(${voidConfig.color2.map(c => c * 255).join(',')})` 
                  }}
                  title="Color 2"
                />
              </div>
            </div>
            
            {/* Shader Editor Button */}
            <button 
              className="shader-editor-btn"
              onClick={() => setShowShaderEditor(true)}
            >
              <Code size={16} />
              Custom Shader Editor
            </button>
          </div>
          
          {/* Selected Layer Properties */}
          {selectedLayer && (
            <div className="property-section">
              <h4>Selected Layer</h4>
              
              <div className="property-group">
                <label>Type</label>
                <span className="property-value" style={{ flex: 1, textAlign: 'left', textTransform: 'capitalize' }}>
                  {selectedLayer.type}
                </span>
              </div>
              
              {/* Text content input */}
              {selectedLayer.type === 'text' && (
                <>
                  <div className="property-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <label>Text Content</label>
                    <input
                      type="text"
                      value={selectedLayer.text || 'Text'}
                      onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                      className="property-text-input"
                      placeholder="Enter text..."
                    />
                  </div>
                  
                  <div className="property-group">
                    <label>Font Size</label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.05"
                      value={selectedLayer.fontSize || 0.5}
                      onChange={(e) => updateLayer(selectedLayer.id, { fontSize: parseFloat(e.target.value) })}
                      className="property-slider"
                    />
                    <span className="property-value">{(selectedLayer.fontSize || 0.5).toFixed(2)}</span>
                  </div>
                </>
              )}
              
              {/* Polygon sides control */}
              {selectedLayer.type === 'polygon' && (
                <div className="property-group">
                  <label>Sides</label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="1"
                    value={selectedLayer.sides || 6}
                    onChange={(e) => updateLayer(selectedLayer.id, { sides: parseInt(e.target.value) })}
                    className="property-slider"
                  />
                  <span className="property-value">{selectedLayer.sides || 6}</span>
                </div>
              )}
              
              {/* Transform Controls */}
              <div className="property-group">
                <label>Position X</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedLayer.position[0].toFixed(2)}
                  onChange={(e) => {
                    const x = parseFloat(e.target.value) || 0;
                    updateLayer(selectedLayer.id, { 
                      position: [x, selectedLayer.position[1], selectedLayer.position[2]] 
                    });
                  }}
                  className="property-number-input"
                />
              </div>
              
              <div className="property-group">
                <label>Position Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedLayer.position[1].toFixed(2)}
                  onChange={(e) => {
                    const y = parseFloat(e.target.value) || 0;
                    updateLayer(selectedLayer.id, { 
                      position: [selectedLayer.position[0], y, selectedLayer.position[2]] 
                    });
                  }}
                  className="property-number-input"
                />
              </div>
              
              <div className="property-group">
                <label>Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={(selectedLayer.rotation[2] * 180 / Math.PI) % 360}
                  onChange={(e) => {
                    const degrees = parseFloat(e.target.value);
                    const radians = degrees * Math.PI / 180;
                    updateLayer(selectedLayer.id, { 
                      rotation: [selectedLayer.rotation[0], selectedLayer.rotation[1], radians] 
                    });
                  }}
                  className="property-slider"
                />
                <span className="property-value">{Math.round((selectedLayer.rotation[2] * 180 / Math.PI) % 360)}°</span>
              </div>
              
              <div className="property-group">
                <label>Color</label>
                <input
                  type="color"
                  value={selectedLayer.color}
                  onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                  className="property-color"
                />
              </div>
              
              <div className="property-group">
                <label>Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedLayer.opacity}
                  onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                  className="property-slider"
                />
                <span className="property-value">{(selectedLayer.opacity * 100).toFixed(0)}%</span>
              </div>
              
              <div className="property-group">
                <label>Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={selectedLayer.scale[0]}
                  onChange={(e) => {
                    const scale = parseFloat(e.target.value);
                    updateLayer(selectedLayer.id, { scale: [scale, scale, scale] });
                  }}
                  className="property-slider"
                />
                <span className="property-value">{selectedLayer.scale[0].toFixed(1)}x</span>
              </div>
            </div>
          )}
          
          {!selectedLayer && (
            <div className="empty-state">
              Select a layer to edit its properties
            </div>
          )}
        </div>
      </div>
      
      {showShaderEditor && <ShaderEditor onClose={() => setShowShaderEditor(false)} />}
    </>
  );
}