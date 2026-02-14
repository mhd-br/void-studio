/**
 * Export the Three.js canvas to PNG
 * @param {WebGLRenderer} gl - The Three.js renderer
 * @param {string} filename - Name of the downloaded file
 * @param {number} scale - Resolution multiplier (1 = normal, 2 = 2x, 4 = 4x)
 */
export function exportToPNG(gl, filename = 'void-studio-export.png', scale = 1) {
  // Get the canvas element
  const canvas = gl.domElement;
  
  if (scale === 1) {
    // Direct export at current resolution
    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  } else {
    // High-resolution export
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    
    // Create a temporary canvas at higher resolution
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalWidth * scale;
    tempCanvas.height = originalHeight * scale;
    const ctx = tempCanvas.getContext('2d');
    
    // Draw the original canvas scaled up
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    
    // Export the high-res version
    tempCanvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  }
}

/**
 * Get current timestamp for unique filenames
 */
export function getTimestampFilename(prefix = 'void-studio') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.png`;
}