import { X } from 'lucide-react';
import '../styles/KeyboardShortcuts.css';

export default function KeyboardShortcuts({ onClose }) {
  const shortcuts = [
    { category: 'Tools', items: [
      { keys: ['V'], action: 'Select Tool' },
      { keys: ['R'], action: 'Rectangle Tool' },
      { keys: ['C'], action: 'Circle Tool' },
    ]},
    { category: 'Actions', items: [
      { keys: ['Delete'], action: 'Delete Selected' },
      { keys: ['⌘/Ctrl', 'D'], action: 'Duplicate Selected' },
      { keys: ['⌘/Ctrl', 'E'], action: 'Export (2x)' },
      { keys: ['Esc'], action: 'Deselect' },
    ]},
    { category: 'Canvas', items: [
      { keys: ['Scroll'], action: 'Zoom In/Out' },
      { keys: ['Drag'], action: 'Pan Canvas' },
      { keys: ['Click'], action: 'Select Shape' },
    ]},
  ];
  
  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="shortcuts-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="shortcuts-content">
          {shortcuts.map((section) => (
            <div key={section.category} className="shortcuts-section">
              <h3>{section.category}</h3>
              <div className="shortcuts-list">
                {section.items.map((item, idx) => (
                  <div key={idx} className="shortcut-item">
                    <div className="shortcut-keys">
                      {item.keys.map((key, i) => (
                        <span key={i}>
                          <kbd>{key}</kbd>
                          {i < item.keys.length - 1 && <span className="plus">+</span>}
                        </span>
                      ))}
                    </div>
                    <div className="shortcut-action">{item.action}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          Press <kbd>?</kbd> to toggle this menu
        </div>
      </div>
    </div>
  );
}