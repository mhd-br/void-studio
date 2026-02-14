import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { voidVertexShader, voidFragmentShader } from '../../shaders/voidShader';
import useCanvasStore from '../../store/useCanvasStore';

export default function VoidBackground() {
  const meshRef = useRef();
  const { voidConfig } = useCanvasStore();
  
  // Use custom shader if available, otherwise use default
  const fragmentShader = voidConfig.customShader || voidFragmentShader;
  
  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uIntensity: { value: voidConfig.intensity },
    uColor1: { value: new THREE.Color(...voidConfig.color1) },
    uColor2: { value: new THREE.Color(...voidConfig.color2) }
  }), []);
  
  // Update uniforms when config changes
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.uIntensity.value = voidConfig.intensity;
      meshRef.current.material.uniforms.uColor1.value = new THREE.Color(...voidConfig.color1);
      meshRef.current.material.uniforms.uColor2.value = new THREE.Color(...voidConfig.color2);
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        vertexShader={voidVertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        key={fragmentShader} // Force recreation when shader changes
      />
    </mesh>
  );
}