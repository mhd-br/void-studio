import { Trash2, Eye, EyeOff } from 'lucide-react';
import useCanvasStore from '../../store/useCanvasStore';
import '../../styles/LayerPanel.css';

export default function LayerPanel() {
  const { layers, selectedLayerId, selectLayer, deleteLayer, updateLayer } = useCanvasStore();
  
  const toggleVisibility = (layer) => {
    updateLayer(layer.id, { visible: !layer.visible });
  };
  
  const getLayerIcon = (type) => {
    switch(type) {
      case 'rectangle': return '▢';
      case 'circle': return '●';
      case 'triangle': return '▲';
      case 'line': return '—';
      case 'polygon': return '⬡';
      case 'star': return '★';
      case 'text': return 'T';
      case 'image': return '🖼';
      default: return '▢';
    }
  };
  
  const getLayerName = (layer, index) => {
    if (layer.type === 'text') {
      const preview = layer.text || 'Text';
      return preview.length > 15 ? preview.substring(0, 15) + '...' : preview;
    }
    if (layer.type === 'image') {
      const name = layer.imageName || 'Image';
      return name.length > 15 ? name.substring(0, 15) + '...' : name;
    }
    return `${layer.type} ${layers.length - index}`;
  };
  
  return (
    <div className="layer-panel">
      <div className="panel-header">
        <h3>Layers</h3>
        <span className="layer-count">{layers.length}</span>
      </div>
      
      <div className="layer-list">
        {layers.length === 0 ? (
          <div className="empty-state">
            No layers yet. Create a shape to get started!
          </div>
        ) : (
          layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`layer-item ${selectedLayerId === layer.id ? 'selected' : ''}`}
              onClick={() => selectLayer(layer.id)}
            >
              <div className="layer-info">
                <div className="layer-type">
                  {getLayerIcon(layer.type)}
                </div>
                <div className="layer-name">
                  {getLayerName(layer, index)}
                </div>
              </div>
              
              <div className="layer-actions">
                <button
                  className="layer-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(layer);
                  }}
                  title={layer.visible === false ? 'Show' : 'Hide'}
                >
                  {layer.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  className="layer-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLayer(layer.id);
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}