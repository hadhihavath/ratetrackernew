'use client';

import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Product type definitions for 3D shapes
export interface Product3DConfig {
  type: 'phone' | 'laptop' | 'headphones' | 'watch' | 'tablet' | 'earbuds' | 'shoes' | 'default';
  color: string;
  name: string;
}

// Generate 3D shape based on product category
function ProductModel({ config }: { config: Product3DConfig }) {
  const groupRef = useRef<THREE.Group>(null);

  // Define geometries for each product type
  const createGeometry = (type: Product3DConfig['type']) => {
    switch (type) {
      case 'phone':
        return (
          <>
            <mesh
              castShadow
              receiveShadow
              position={[0, 0, 0]}
              geometry={new THREE.BoxGeometry(1, 1.8, 0.12).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial
                color={config.color}
                metalness={0.1}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
            {/* Screen */}
            <mesh
              position={[0, 0, 0.065]}
              geometry={new THREE.PlaneGeometry(0.85, 1.55)}
            >
              <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
            {/* Dynamic Island / Camera */}
            <mesh
              position={[0, 0.75, 0.07]}
              geometry={new THREE.CapsuleGeometry(0.08, 0.15, 4, 8)}
            >
              <meshPhysicalMaterial color="#1a1a1a" metalness={0.5} roughness={0.2} />
            </mesh>
          </>
        );

      case 'laptop':
        return (
          <group>
            {/* Base */}
            <mesh
              castShadow
              receiveShadow
              position={[0, -0.04, 0]}
              geometry={new THREE.BoxGeometry(1.6, 0.08, 1.1).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.2} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.2} />
            </mesh>
            {/* Screen */}
            <mesh
              castShadow
              receiveShadow
              position={[0, 0.55, -0.3]}
              rotation={[-0.3, 0, 0]}
              geometry={new THREE.BoxGeometry(1.45, 0.95, 0.06).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.1} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>
            {/* Screen display */}
            <mesh
              position={[0, 0.55, -0.33]}
              rotation={[-0.3, 0, 0]}
              geometry={new THREE.PlaneGeometry(1.35, 0.85)}
            >
              <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
            </mesh>
            {/* Keyboard hint */}
            <mesh
              position={[0, -0.02, 0.2]}
              geometry={new THREE.PlaneGeometry(1.2, 0.6)}
            >
              <meshBasicMaterial color={config.color} side={THREE.DoubleSide} opacity={0.3} transparent />
            </mesh>
          </group>
        );

      case 'headphones':
        return (
          <group>
            {/* Headband */}
            <mesh
              castShadow
              position={[0, 0.3, 0]}
              geometry={new THREE.TorusGeometry(0.5, 0.06, 8, 32, Math.PI)}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.2} roughness={0.3} clearcoat={0.5} />
            </mesh>
            {/* Left ear cup */}
            <mesh
              castShadow
              position={[-0.5, 0, 0]}
              geometry={new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.1} roughness={0.4} clearcoat={0.8} />
            </mesh>
            {/* Right ear cup */}
            <mesh
              castShadow
              position={[0.5, 0, 0]}
              geometry={new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.1} roughness={0.4} clearcoat={0.8} />
            </mesh>
            {/* Ear cushions */}
            <mesh position={[-0.5, 0, 0.1]} geometry={new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32)}>
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
            <mesh position={[0.5, 0, 0.1]} geometry={new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32)}>
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
          </group>
        );

      case 'watch':
        return (
          <group>
            {/* Watch case */}
            <mesh
              castShadow
              position={[0, 0, 0]}
              geometry={new THREE.BoxGeometry(0.7, 0.85, 0.12).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.3} roughness={0.2} clearcoat={1} clearcoatRoughness={0.05} />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 0, 0.065]} geometry={new THREE.PlaneGeometry(0.5, 0.6)}>
              <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
            </mesh>
            {/* Digital crown */}
            <mesh
              position={[0.35, 0.15, 0.06]}
              geometry={new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.5} roughness={0.2} />
            </mesh>
            {/* Band - top */}
            <mesh
              position={[0, 0.45, 0]}
              geometry={new THREE.BoxGeometry(0.3, 0.3, 0.05)}
            >
              <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
            </mesh>
            {/* Band - bottom */}
            <mesh
              position={[0, -0.45, 0]}
              geometry={new THREE.BoxGeometry(0.3, 0.3, 0.05)}
            >
              <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
            </mesh>
          </group>
        );

      case 'tablet':
        return (
          <>
            <mesh
              castShadow
              receiveShadow
              position={[0, 0, 0]}
              geometry={new THREE.BoxGeometry(1.2, 1.6, 0.08).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.1} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 0, 0.045]} geometry={new THREE.PlaneGeometry(1.05, 1.4)}>
              <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
            </mesh>
            {/* Home indicator */}
            <mesh position={[0, -0.65, 0.05]} geometry={new THREE.CapsuleGeometry(0.08, 0.02, 4, 8)}>
              <meshStandardMaterial color="#333" />
            </mesh>
          </>
        );

      case 'earbuds':
        return (
          <group>
            {/* Case */}
            <mesh
              castShadow
              position={[0, 0, 0]}
              geometry={new THREE.BoxGeometry(0.7, 0.5, 0.3).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.1} roughness={0.4} clearcoat={0.8} clearcoatRoughness={0.1} />
            </mesh>
            {/* Lid */}
            <mesh
              castShadow
              position={[0, 0, 0.18]}
              rotation={[-0.1, 0, 0]}
              geometry={new THREE.BoxGeometry(0.68, 0.48, 0.06).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0.2} roughness={0.3} clearcoat={1} clearcoatRoughness={0.05} />
            </mesh>
            {/* Earbud 1 */}
            <mesh position={[-0.15, -0.05, 0.05]} geometry={new THREE.SphereGeometry(0.08, 16, 16)}>
              <meshPhysicalMaterial color="#1a1a1a" metalness={0.1} roughness={0.5} />
            </mesh>
            {/* Earbud 2 */}
            <mesh position={[0.15, -0.05, 0.05]} geometry={new THREE.SphereGeometry(0.08, 16, 16)}>
              <meshPhysicalMaterial color="#1a1a1a" metalness={0.1} roughness={0.5} />
            </mesh>
            {/* LED indicator */}
            <mesh position={[0, 0.18, 0.18]} geometry={new THREE.SphereGeometry(0.02, 8, 8)}>
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>
        );

      case 'shoes':
        return (
          <group>
            {/* Sole */}
            <mesh
              castShadow
              position={[0, -0.15, 0]}
              geometry={new THREE.BoxGeometry(0.5, 0.15, 0.9).translate(0, 0, 0)}
            >
              <meshStandardMaterial color="#ffffff" roughness={0.6} />
            </mesh>
            {/* Midsole */}
            <mesh
              position={[0, -0.05, 0]}
              geometry={new THREE.BoxGeometry(0.48, 0.1, 0.85).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0} roughness={0.7} />
            </mesh>
            {/* Upper */}
            <mesh
              castShadow
              position={[0, 0.1, 0]}
              geometry={new THREE.BoxGeometry(0.42, 0.35, 0.75).translate(0, 0, 0)}
            >
              <meshPhysicalMaterial color={config.color} metalness={0} roughness={0.8} clearcoat={0.3} />
            </mesh>
            {/* Laces area */}
            <mesh position={[0, 0.15, 0.1]} geometry={new THREE.PlaneGeometry(0.15, 0.25)}>
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} opacity={0.5} transparent />
            </mesh>
            {/* Swoosh/logo */}
            <mesh position={[0.2, 0.05, 0.38]} geometry={new THREE.PlaneGeometry(0.15, 0.08)}>
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh
            castShadow
            receiveShadow
            geometry={new THREE.BoxGeometry(1, 1, 1)}
          >
            <meshPhysicalMaterial color={config.color} metalness={0.1} roughness={0.4} clearcoat={0.5} />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {createGeometry(config.type)}
    </group>
  );
}

// Color selector dots
function ColorSelector({ colors, selectedIndex, onSelect }: {
  colors: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <Html
      transform
      position={[0, -1.8, 0]}
      style={{
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
    >
      <div className="flex gap-2" role="group" aria-label="Color options">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
              index === selectedIndex
                ? 'border-primary scale-125 shadow-lg shadow-primary/30'
                : 'border-transparent hover:border-white/50'
            }`}
            style={{
              backgroundColor: color,
              boxShadow: index === selectedIndex ? `0 0 0 3px ${color}40, 0 4px 12px ${color}40` : 'none',
            }}
            aria-label={`Select ${color} color`}
            aria-pressed={index === selectedIndex}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </Html>
  );
}

// Floating particles around product
function AmbientParticles({ color }: { color: string }) {
  const count = 50;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 1.5 + Math.random() * 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
      arr[i + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes.position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        sizeAttenuation
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Lighting for product viewer
function ProductLights() {
  return (
    <>
      <Environment preset="studio" background={false} />
      <ambientLight color="#ffffff" intensity={0.5} />
      <directionalLight
        position={[3, 5, 3]}
        color="#ffffff"
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-2, 3, -2]} color="#1e62fe" intensity={0.4} />
      <pointLight position={[0, 3, 3]} color="#ffffff" intensity={0.5} decay={2} />
      <hemisphereLight color="#e8f0fe" groundColor="#1e293b" intensity={0.3} />
    </>
  );
}

// Main Product Viewer Scene
interface ProductViewer3DSceneProps {
  config: Product3DConfig;
  colors: string[];
  selectedColorIndex: number;
  onColorChange: (index: number) => void;
}

function ProductViewer3DScene({ config, colors, selectedColorIndex, onColorChange }: ProductViewer3DSceneProps) {
  return (
    <>
      <ProductLights />
      <ContactShadows opacity={0.3} scale={3} blur={2} far={5} />
      <AmbientParticles color={config.color} />
      <ProductModel config={config} />
      <ColorSelector colors={colors} selectedIndex={selectedColorIndex} onSelect={onColorChange} />
    </>
  );
}

// Main export component
interface ProductViewer3DProps {
  productType: Product3DConfig['type'];
  color: string;
  colors: string[];
  selectedColorIndex: number;
  onColorChange: (index: number) => void;
  className?: string;
  fallback?: React.ReactNode;
}

export function ProductViewer3D({
  productType,
  color,
  colors,
  selectedColorIndex,
  onColorChange,
  className = '',
  fallback,
}: ProductViewer3DProps) {
  const config = useMemo(() => ({
    type: productType,
    color,
    name: '',
  }), [productType, color]);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: '300px' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: '1rem' }}
      >
        <Suspense fallback={fallback || <CanvasFallback />}>
          <ProductViewer3DScene
            config={config}
            colors={colors}
            selectedColorIndex={selectedColorIndex}
            onColorChange={onColorChange}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minZoom={0.8}
          maxZoom={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

// Fallback while loading
function CanvasFallback() {
  return (
    <Html
      transform
      position={[0, 0, 0]}
      style={{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </Html>
  );
}

// Type inference helper
export function getProduct3DType(category: string): Product3DConfig['type'] {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('mobile') || categoryLower.includes('phone') || categoryLower.includes('iphone') || categoryLower.includes('samsung') || categoryLower.includes('pixel')) {
    return 'phone';
  }
  if (categoryLower.includes('laptop') || categoryLower.includes('macbook') || categoryLower.includes('notebook')) {
    return 'laptop';
  }
  if (categoryLower.includes('headphone') || categoryLower.includes('earphone') || categoryLower.includes('headset')) {
    return 'headphones';
  }
  if (categoryLower.includes('watch') || categoryLower.includes('wearable')) {
    return 'watch';
  }
  if (categoryLower.includes('tablet') || categoryLower.includes('ipad')) {
    return 'tablet';
  }
  if (categoryLower.includes('earbud') || categoryLower.includes('airpod') || categoryLower.includes('tw')) {
    return 'earbuds';
  }
  if (categoryLower.includes('shoe') || categoryLower.includes('footwear') || categoryLower.includes('sneaker')) {
    return 'shoes';
  }
  return 'default';
}