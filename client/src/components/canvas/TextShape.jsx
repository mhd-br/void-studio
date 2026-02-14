import { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import useCanvasStore from '../../store/useCanvasStore';

export default function TextShape({ layer }) {
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { selectedLayerId, selectLayer, updateLayer } = useCanvasStore();
  
  const isSelected = selectedLayerId === layer.id;
  
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
  
  return (
    <group
      position={layer.position}
      rotation={layer.rotation}
      scale={layer.scale}
    >
      <Text
        ref={textRef}
        text={layer.text || 'Text'}
        fontSize={layer.fontSize || 0.5}
        color={layer.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={isSelected ? 0.01 : 0}
        outlineColor="#4a9eff"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={layer.color}
          opacity={layer.opacity}
          transparent
          emissive={isSelected ? '#4a9eff' : hovered ? '#666666' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : hovered ? 0.1 : 0}
        />
      </Text>
    </group>
  );
}