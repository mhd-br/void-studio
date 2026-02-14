import { Upload } from 'lucide-react';
import { useRef } from 'react';
import useCanvasStore from '../store/useCanvasStore';

export default function ImageUpload() {
  const fileInputRef = useRef();
  const { addLayer } = useCanvasStore();
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      
      // Create image layer
      addLayer({
        type: 'image',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [2, 2, 1],
        color: '#ffffff',
        opacity: 1,
        imageUrl: imageUrl,
        imageName: file.name
      });
    };
    
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        className="toolbar-button"
        onClick={handleClick}
        title="Upload Image"
      >
        <Upload size={20} />
      </button>
    </>
  );
}