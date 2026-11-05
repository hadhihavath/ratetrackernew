'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { BufferGeometry, Material } from 'three';

// Simple floating 3D product shapes using primitive geometries
function FloatingProducts() {
  const products = [
    { position: [-3, 1.5, -2], rotation: [0, 0.5, 0], color: '#1e62fe', name: 'iPhone' },
    { position: [2.5, -0.5, -1.5], rotation: [0.3, -0.2, 0], color: '#10b981', name: 'MacBook' },
    { position: [-1.5, -1.8, -2], rotation: [-0.2, 0.8, 0.1], color: '#f59e0b', name: 'Headphones' },
    { position: [3.5, 1, -2.5], rotation: [0.1, -0.6, 0], color: '#ef4444', name: 'Watch' },
    { position: [-3.5, -1, -3], rotation: [0, 0.3, 0.2], color: '#8b5cf6', name: 'Tablet' },
    { position: [1.5, 2, -2], rotation: [-0.3, 0, 0], color: '#ec4899', name: 'Buds' },
  ];

  return (
    <group>
      {products.map((product, index) => (
        <Float
          key={index}
          speed={1.5 + index * 0.3}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <ProductShape
            position={product.position as [number, number, number]}
            rotation={product.rotation as [number, number, number]}
            color={product.color}
            index={index}
          />
        </Float>
      ))}
    </group>
  );
}

function ProductShape({ position, rotation, color, index }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  // Different shapes for different product types
  const geometries = useMemo(() => {
    const shapes = [
      // Phone shape - rounded box
      { geometry: 'box', args: [1, 1.8, 0.12], radius: 0.15 },
      // Laptop shape
      { geometry: 'box', args: [1.6, 1.1, 0.08], radius: 0.05 },
      // Headphones - two circles connected
      { geometry: 'torus', args: [0.6, 0.15, 16, 32] as [number, number, number, number], radius: 0 },
      // Watch - rounded square
      { geometry: 'box', args: [0.8, 0.8, 0.1], radius: 0.2 },
      // Tablet
      { geometry: 'box', args: [1.2, 1.6, 0.08], radius: 0.1 },
      // Earbuds case
      { geometry: 'box', args: [0.7, 0.5, 0.3], radius: 0.15 },
    ];
    return shapes[index % shapes.length];
  }, [index]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {geometries.geometry === 'box' ? (
        <boxGeometry args={geometries.args as [number, number, number]} />
      ) : (
        <torusGeometry args={geometries.args as [number, number, number, number]} />
      )}
      <meshPhysicalMaterial
        color={color}
        metalness={hovered ? 0.3 : 0.1}
        roughness={hovered ? 0.2 : 0.4}
        transmission={0.1}
        thickness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        ior={1.5}
      />
    </mesh>
  );
}

// Particle system for ambient atmosphere
function ParticleSystem() {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 20;
      arr[i + 1] = (Math.random() - 0.5) * 15;
      arr[i + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const palette = ['#1e62fe', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < count * 3; i += 3) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      const hex = parseInt(color.replace('#', ''), 16);
      arr[i] = ((hex >> 16) & 255) / 255;
      arr[i + 1] = ((hex >> 8) & 255) / 255;
      arr[i + 2] = (hex & 255) / 255;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes.position" args={[positions, 3]} />
        <bufferAttribute attach="attributes.color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Lighting setup
function HeroLights() {
  return (
    <>
      <ambientLight color="#ffffff" intensity={0.4} />
      <directionalLight
        position={[5, 10, 7]}
        color="#ffffff"
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 5, -5]} color="#1e62fe" intensity={0.3} />
      <pointLight position={[0, 5, 5]} color="#10b981" intensity={0.5} decay={2} />
      <hemisphereLight color="#87ceeb" groundColor="#1e293b" intensity={0.3} />
    </>
  );
}

// Ground plane with subtle reflection
function GroundPlane() {
  return (
    <mesh
      position={[0, -3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        color="#0f172a"
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Main Hero 3D Scene
function Hero3DScene() {
  return (
    <>
      <HeroLights />
      <GroundPlane />
      <ParticleSystem />
      <FloatingProducts />
    </>
  );
}

// Canvas wrapper with responsive sizing
export function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          <Hero3DScene />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

// Lightweight version for mobile/performance
export function Hero3DLite() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-primary/20 via-transparent to-success/10">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(30, 98, 254, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)
        `
      }} />
    </div>
  );
}

// Type augmentation for Three.js
declare global {
  namespace THREE {
    interface Mesh {
      geometry: BufferGeometry;
      material: Material;
    }
    interface MeshPhysicalMaterialParameters {
      transmission?: number;
      thickness?: number;
      clearcoat?: number;
      clearcoatRoughness?: number;
      ior?: number;
    }
  }
}