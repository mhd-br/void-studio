import { Square, Circle, MousePointer2, Download, FolderOpen, Save, Undo, Redo, Triangle, Minus, Hexagon, Star, Type, Upload, Code  } from 'lucide-react';
import { useState, useEffect } from 'react';
import useCanvasStore from '../../store/useCanvasStore';
import ProjectsModal from '../ProjectsModal';
import ImageUpload from '../ImageUpload';
import { autoSave } from '../../utils/storage';
import '../../styles/Toolbar.css';


export default function Toolbar() {
  const { 
    activeTool, 
    setActiveTool, 
    addLayer, 
    showExportMenu, 
    toggleExportMenu,
    getCurrentProjectState,
    projectId,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCanvasStore();
  
  const [showProjects, setShowProjects] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Auto save every 30 seconds
  useEffect(() => {
    if (!projectId) return;
    
    const interval = setInterval(() => {
      const state = getCurrentProjectState();
      if (autoSave(state)) {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [projectId, getCurrentProjectState]);
  
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'polygon', icon: Hexagon, label: 'Hexagon' },
    { id: 'star', icon: Star, label: 'Star' },
    { id: 'text', icon: Type, label: 'Text' },
  ];
  
  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    
    // Auto create shape when tool is selected
    if (toolId !== 'select') {
      const newLayer = {
        type: toolId,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#ffffff',
        opacity: 1
      };
      
      // Add extra properties for specific types
      if (toolId === 'polygon') {
        newLayer.sides = 6;
      }
      
      if (toolId === 'text') {
        newLayer.text = 'Text';
        newLayer.fontSize = 0.5;
      }
      
      addLayer(newLayer);
      setTimeout(() => setActiveTool('select'), 100);
    }
  };
  
  const handleExport = (scale) => {
    window.dispatchEvent(new CustomEvent('exportCanvas', { detail: { scale } }));
  };
  
  const handleManualSave = () => {
    const state = getCurrentProjectState();
    if (autoSave(state)) {
      setSaving(true);
      setTimeout(() => setSaving(false), 1000);
    }
  };
  
  return (
    <>
      <div className="toolbar">
        <div className="toolbar-section">
          <div className="toolbar-label">File</div>
          <button
            className="toolbar-button"
            onClick={() => setShowProjects(true)}
            title="Projects"
          >
            <FolderOpen size={20} />
          </button>
          {projectId && (
            <button
              className={`toolbar-button ${saving ? 'saving' : ''}`}
              onClick={handleManualSave}
              title="Save (Auto-saves every 30s)"
            >
              <Save size={20} />
            </button>
          )}
        </div>

        <div className="toolbar-section">
          <div className="toolbar-label">Export</div>
          <div className="export-container">
            <button
              className={`toolbar-button ${showExportMenu ? 'active' : ''}`}
              onClick={toggleExportMenu}
              title="a to PNG"
            >
              <Download size={20} />
            </button>
            
            {showExportMenu && (
              <div className="export-menu">
                <div className="export-menu-header">Export Resolution</div>
                <button 
                  className="export-menu-item"
                  onClick={() => handleExport(1)}
                >
                  <span className="export-resolution">1x</span>
                  <span className="export-label">Standard</span>
                </button>
                <button 
                  className="export-menu-item"
                  onClick={() => handleExport(2)}
                >
                  <span className="export-resolution">2x</span>
                  <span className="export-label">High Quality</span>
                </button>
                <button 
                  className="export-menu-item"
                  onClick={() => handleExport(4)}
                >
                  <span className="export-resolution">4x</span>
                  <span className="export-label">Ultra HD</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* <div className="toolbar-section">
          <div className="toolbar-label">Edit</div>
          <button
            className={`toolbar-button ${!canUndo() ? 'disabled' : ''}`}
            onClick={undo}
            disabled={!canUndo()}
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            className={`toolbar-button ${!canRedo() ? 'disabled' : ''}`}
            onClick={redo}
            disabled={!canRedo()}
            title="Redo"
          >
            <Redo size={20} />
          </button>
        </div> */}
        
        <div className="toolbar-section">
          <div className="toolbar-label">Tools</div>
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`toolbar-button ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolClick(tool.id)}
              title={tool.label}
            >
              <tool.icon size={20} />
            </button>
          ))}
          <ImageUpload />
        </div>
      
      </div>
      
      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
    </>
  );
}