import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useEffect, useState } from 'react';
import VoidBackground from './VoidBackground';
import Shape from '../shapes/Shape';
import TextShape from './TextShape';
import TransformControls from './TransformControls';
import RemoteCursor from '../RemoteCursor';
import UsernameModal from '../UsernameModal';
import useCanvasStore from '../../store/useCanvasStore';
import { useCollaboration } from '../../hooks/useCollaboration';
import { exportToPNG, getTimestampFilename } from '../../utils/exportCanvas';

function ExportHandler() {
  const { gl } = useThree();
  const { closeExportMenu } = useCanvasStore();
  
  useEffect(() => {
    const handleExport = (event) => {
      const scale = event.detail?.scale || 2;
      const filename = getTimestampFilename();
      exportToPNG(gl, filename, scale);
      closeExportMenu();
    };
    
    window.addEventListener('exportCanvas', handleExport);
    return () => window.removeEventListener('exportCanvas', handleExport);
  }, [gl, closeExportMenu]);
  
  return null;
}

function CollaborationHandler({ roomId, userName }) {
  const { mouse } = useThree();
  const { cursors, sendCursorPosition } = useCollaboration(roomId, userName);
  
  // Send cursor position on mouse move
  useEffect(() => {
    const interval = setInterval(() => {
      if (mouse.x !== 0 || mouse.y !== 0) {
        const x = mouse.x * 10;
        const y = mouse.y * 10;
        sendCursorPosition({ x, y });
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [mouse, sendCursorPosition]);
  
  return (
    <>
      {Array.from(cursors.values()).map(user => (
        <RemoteCursor key={user.id} user={user} />
      ))}
    </>
  );
}

export default function Canvas3D() {
  const { 
    layers, 
    showExportMenu, 
    closeExportMenu, 
    selectedLayerId, 
    updateLayer, 
    getSelectedLayer,
    projectId 
  } = useCanvasStore();
  
  const selectedLayer = getSelectedLayer();
  
  // Username management
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('void-studio-username') || '';
  });
  const [showUsernameModal, setShowUsernameModal] = useState(!userName);
  
  const handleUsernameSubmit = (name) => {
    setUserName(name);
    localStorage.setItem('void-studio-username', name);
    setShowUsernameModal(false);
  };
  
  // Close export menu when clicking canvas
  const handleCanvasClick = () => {
    if (showExportMenu) {
      closeExportMenu();
    }
  };
  
  return (
    <>
      {showUsernameModal && projectId && (
        <UsernameModal 
          onSubmit={handleUsernameSubmit}
          currentName={userName}
        />
      )}
      
      <div style={{ width: '100%', height: '100vh' }} onClick={handleCanvasClick}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        >
          <ExportHandler />
          
          {/* Collaboration - only if project is loaded and user has name */}
          {projectId && userName && (
            <CollaborationHandler roomId={projectId} userName={userName} />
          )}
          
          {/* Void background - the core feature */}
          <VoidBackground />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* Grid for reference */}
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6e6e6e"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />
          
          {/* Render all design layers */}
          {layers.map(layer => (
            layer.type === 'text' ? (
              <TextShape key={layer.id} layer={layer} />
            ) : (
              <Shape key={layer.id} layer={layer} />
            )
          ))}
          
          {/* Transform controls for selected layer */}
          {selectedLayer && (
            <TransformControls 
              layer={selectedLayer} 
              onUpdate={(updates) => updateLayer(selectedLayer.id, updates)}
            />
          )}
          
          {/* Camera controls */}
          <OrbitControls
            enableRotate={false}
            enablePan={true}
            enableZoom={true}
            maxDistance={50}
            minDistance={2}
          />
        </Canvas>
      </div>
    </>
  );
}