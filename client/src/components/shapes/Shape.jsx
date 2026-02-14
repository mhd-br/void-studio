import { useRef, useState } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useCanvasStore from '../../store/useCanvasStore';

export default function Shape({ layer }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { selectedLayerId, selectLayer, updateLayer } = useCanvasStore();
  
  const isSelected = selectedLayerId === layer.id;
  
  // Load texture for image layers
  const texture = layer.type === 'image' && layer.imageUrl 
    ? useTexture(layer.imageUrl) 
    : null;
  
  // Handle drag
  const handlePointerDown = (e) => {
    e.stopPropagation();
    selectLayer(layer.id);
    setIsDragging(true);
  };
  
  const handlePointerMove = (e) => {
    if (isDragging && isSelected) {
      e.stopPropagation();
      const newPosition = [e.point.x, e.point.y, 0];
      updateLayer(layer.id, { position: newPosition });
    }
  };
  
  const handlePointerUp = () => {
    setIsDragging(false);
  };
  
  // Get geometry based on layer type
  const getGeometry = () => {
    switch (layer.type) {
      case 'rectangle':
        return <boxGeometry args={[1, 1, 0.1]} />;
      
      case 'circle':
        return <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />;
      
      case 'triangle':
        return <coneGeometry args={[0.5, 1, 3]} />;
      
      case 'line':
        return <boxGeometry args={[0.05, 1, 0.05]} />;
      
      case 'polygon':
        const sides = layer.sides || 6;
        return <cylinderGeometry args={[0.5, 0.5, 0.1, sides]} />;
      
      case 'star':
        return <StarGeometry />;
      
      case 'image':
        // Plane for images
        return <planeGeometry args={[1, 1]} />;
      
      default:
        return <boxGeometry args={[1, 1, 0.1]} />;
    }
  };
  
  // Get material based on layer type
  const getMaterial = () => {
    if (layer.type === 'image' && texture) {
      return (
        <meshBasicMaterial
          map={texture}
          opacity={layer.opacity}
          transparent
          side={THREE.DoubleSide}
        />
      );
    }
    
    return (
      <meshStandardMaterial
        color={layer.color}
        opacity={layer.opacity}
        transparent
        emissive={isSelected ? '#4a9eff' : hovered ? '#666666' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
      />
    );
  };
  
  // Get edges geometry for outline
  const getEdgesGeometry = () => {
    switch (layer.type) {
      case 'rectangle':
        return new THREE.BoxGeometry(1, 1, 0.1);
      case 'circle':
        return new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
      case 'triangle':
        return new THREE.ConeGeometry(0.5, 1, 3);
      case 'line':
        return new THREE.BoxGeometry(0.05, 1, 0.05);
      case 'polygon':
        const sides = layer.sides || 6;
        return new THREE.CylinderGeometry(0.5, 0.5, 0.1, sides);
      case 'star':
        return createStarGeometry();
      case 'image':
        return new THREE.PlaneGeometry(1, 1);
      default:
        return new THREE.BoxGeometry(1, 1, 0.1);
    }
  };
  
  return (
    <mesh
      ref={meshRef}
      position={layer.position}
      rotation={layer.rotation}
      scale={layer.scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {getGeometry()}
      {getMaterial()}
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[getEdgesGeometry()]} />
          <lineBasicMaterial color="#4a9eff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

// Star geometry component
function StarGeometry() {
  const geometry = createStarGeometry();
  return <primitive object={geometry} attach="geometry" />;
}

// Create star shape geometry
function createStarGeometry() {
  const shape = new THREE.Shape();
  const outerRadius = 0.5;
  const innerRadius = 0.2;
  const points = 5;
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  
  shape.closePath();
  
  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: false
  };
  
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}