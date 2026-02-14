import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function TransformControls({ layer, onUpdate }) {
  const { size, camera } = useThree();
  const [hoveredHandle, setHoveredHandle] = useState(null);
  
  // Calculate handle positions relative to the layer
  const scale = layer.scale[0];
  const handleSize = 0.15;
  
  // Get shape bounds for handle positioning
  const getBounds = () => {
    switch (layer.type) {
      case 'rectangle':
        return { width: 1 * scale, height: 1 * scale };
      case 'circle':
        return { width: 1 * scale, height: 1 * scale };
      case 'triangle':
        return { width: 1 * scale, height: 1 * scale };
      case 'line':
        return { width: 0.05 * scale, height: 1 * scale };
      case 'polygon':
        return { width: 1 * scale, height: 1 * scale };
      case 'star':
        return { width: 1 * scale, height: 1 * scale };
      case 'text':
        return { width: 1 * scale, height: 0.5 * scale };
      default:
        return { width: 1 * scale, height: 1 * scale };
    }
  };
  
  const bounds = getBounds();
  
  // Corner handles for scaling
  const cornerHandles = [
    { id: 'tl', pos: [-bounds.width/2, bounds.height/2, 0.5], cursor: 'nw-resize' },
    { id: 'tr', pos: [bounds.width/2, bounds.height/2, 0.5], cursor: 'ne-resize' },
    { id: 'bl', pos: [-bounds.width/2, -bounds.height/2, 0.5], cursor: 'sw-resize' },
    { id: 'br', pos: [bounds.width/2, -bounds.height/2, 0.5], cursor: 'se-resize' },
  ];
  
  // Rotation handle (top center)
  const rotationHandle = {
    id: 'rotate',
    pos: [0, bounds.height/2 + 0.5, 0.5],
    cursor: 'grab'
  };
  
  const handleScaleDrag = (e, handleId) => {
    e.stopPropagation();
    
    // This is simplified - in production you'd track mouse movement
    // and calculate new scale based on distance from opposite corner
  };
  
  const handleRotateDrag = (e) => {
    e.stopPropagation();
    
    // Calculate rotation based on mouse position relative to center
    const center = new THREE.Vector3(...layer.position);
    const mouse = new THREE.Vector3(e.point.x, e.point.y, 0);
    const angle = Math.atan2(mouse.y - center.y, mouse.x - center.x);
    
    onUpdate({ rotation: [0, 0, angle] });
  };
  
  return (
    <group position={layer.position} rotation={layer.rotation}>
      {/* Corner scale handles */}
      {cornerHandles.map(handle => (
        <mesh
          key={handle.id}
          position={handle.pos}
          onPointerDown={(e) => handleScaleDrag(e, handle.id)}
          onPointerEnter={() => setHoveredHandle(handle.id)}
          onPointerLeave={() => setHoveredHandle(null)}
        >
          <boxGeometry args={[handleSize, handleSize, handleSize]} />
          <meshBasicMaterial 
            color={hoveredHandle === handle.id ? '#4a9eff' : '#ffffff'}
            opacity={0.9}
            transparent
          />
        </mesh>
      ))}
      
      {/* Rotation handle */}
      <mesh
        position={rotationHandle.pos}
        onPointerDown={handleRotateDrag}
        onPointerEnter={() => setHoveredHandle('rotate')}
        onPointerLeave={() => setHoveredHandle(null)}
      >
        <sphereGeometry args={[handleSize, 16, 16]} />
        <meshBasicMaterial 
          color={hoveredHandle === 'rotate' ? '#4a9eff' : '#00ff00'}
          opacity={0.9}
          transparent
        />
      </mesh>
      
      {/* Line connecting rotation handle to shape */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              0, bounds.height/2, 0.5,
              0, bounds.height/2 + 0.5, 0.5
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4a9eff" opacity={0.5} transparent />
      </line>
    </group>
  );
}