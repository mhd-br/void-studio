/**
 * Keyboard shortcuts for Void Studio
 */

export const SHORTCUTS = {
  // Tools
  SELECT: 'v',
  RECTANGLE: 'r',
  CIRCLE: 'c',
  
  // Actions
  DELETE: ['Delete', 'Backspace'],
  DUPLICATE: ['d'],
  UNDO: 'z',
  REDO: ['y', 'Z'], // y or Shift+Z
  
  // Export
  EXPORT: 'e',
  
  // Deselect
  ESCAPE: 'Escape',
};

/**
 * Check if a key matches a shortcut
 */
export function matchesShortcut(event, shortcut) {
  const key = event.key;
  const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
  
  return shortcuts.some(s => {
    // Handle uppercase (Shift modifier)
    if (s === s.toUpperCase() && s !== s.toLowerCase()) {
      return event.shiftKey && key.toLowerCase() === s.toLowerCase();
    }
    return key === s;
  });
}

/**
 * Check if Cmd (Mac) or Ctrl (Windows/Linux) is pressed
 */
export function isModKey(event) {
  return event.metaKey || event.ctrlKey;
}