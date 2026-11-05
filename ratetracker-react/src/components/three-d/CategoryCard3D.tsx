import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useState, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

export interface Category3DProps {
  name: string;
  icon: string;
  color: string;
  href: string;
  productCount?: number;
  className?: string;
  onClick?: () => void;
}

// 3D Icon shapes for each category
function CategoryIcon3D({ color, iconType }: { color: string; iconType: string }) {
  const [hovered, setHovered] = useState(false);

  const iconGeometries = useMemo(() => {
    switch (iconType) {
      case 'mobile':
        return (
          <group>
            <mesh geometry={new THREE.BoxGeometry(0.6, 1.1, 0.08)}>
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.05]} geometry={new THREE.PlaneGeometry(0.5, 0.9)}>
              <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.45, 0.05]} geometry={new THREE.CapsuleGeometry(0.08, 0.02, 4, 8)}>
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        );
      case 'laptop':
        return (
          <group>
            <mesh position={[0, -0.04, 0]} geometry={new THREE.BoxGeometry(0.9, 0.06, 0.6)}>
              <meshPhysicalMaterial color={color} metalness={0.2} roughness={0.3} clearcoat={0.5} />
            </mesh>
            <mesh position={[0, 0.3, -0.15]} rotation={[-0.3, 0, 0]} geometry={new THREE.BoxGeometry(0.8, 0.55, 0.04)}>
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.3} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0.3, -0.18]} rotation={[-0.3, 0, 0]} geometry={new THREE.PlaneGeometry(0.7, 0.5)}>
              <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      case 'tv':
      case 'electronics':
        return (
          <group>
            <mesh geometry={new THREE.BoxGeometry(1, 0.65, 0.08)}>
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.3} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0, 0.05]} geometry={new THREE.PlaneGeometry(0.9, 0.55)}>
              <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.35, 0.04]} geometry={new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16)}>
              <meshPhysicalMaterial color={color} metalness={0.2} roughness={0.3} />
            </mesh>
          </group>
        );
      case 'appliance':
        return (
          <group>
            <mesh geometry={new THREE.BoxGeometry(0.5, 0.7, 0.4)}>
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.4} clearcoat={0.5} />
            </mesh>
            <mesh position={[0, 0.2, 0.22]} geometry={new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16)}>
              <meshPhysicalMaterial color="#333" metalness={0.5} roughness={0.2} />
            </mesh>
            <mesh position={[0.1, 0, 0.22]} geometry={new THREE.BoxGeometry(0.08, 0.2, 0.05)}>
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        );
      case 'fashion':
        return (
          <group>
            <mesh geometry={new THREE.ConeGeometry(0.35, 0.7, 8)}>
              <meshPhysicalMaterial color={color} metalness={0} roughness={0.8} clearcoat={0.3} />
            </mesh>
            <mesh position={[0, 0.2, 0]} geometry={new THREE.TorusGeometry(0.2, 0.03, 8, 16)}>
              <meshStandardMaterial color="#fff" />
            </mesh>
          </group>
        );
      case 'shoe':
      case 'footwear':
        return (
          <group>
            <mesh position={[0, -0.1, 0]} geometry={new THREE.BoxGeometry(0.35, 0.1, 0.6)}>
              <meshStandardMaterial color="#fff" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0]} geometry={new THREE.BoxGeometry(0.32, 0.25, 0.5)}>
              <meshPhysicalMaterial color={color} metalness={0} roughness={0.8} clearcoat={0.3} />
            </mesh>
            <mesh position={[0.18, 0.05, 0.2]} geometry={new THREE.PlaneGeometry(0.08, 0.12)}>
              <meshBasicMaterial color="#fff" side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      case 'beauty':
        return (
          <group>
            <mesh geometry={new THREE.CylinderGeometry(0.12, 0.1, 0.6, 16)}>
              <meshPhysicalMaterial color={color} metalness={0.2} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>
            <mesh position={[0, 0.3, 0]} geometry={new THREE.CylinderGeometry(0.1, 0.08, 0.15, 16)}>
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.38, 0]} geometry={new THREE.SphereGeometry(0.08, 16, 16)}>
              <meshPhysicalMaterial color="#fff" metalness={0} roughness={0.8} />
            </mesh>
          </group>
        );
      case 'sports':
        return (
          <group>
            <mesh geometry={new THREE.SphereGeometry(0.3, 16, 16)}>
              <meshPhysicalMaterial color={color} metalness={0} roughness={0.7} clearcoat={0.3} />
            </mesh>
            <mesh position={[0.15, 0.15, 0.15]} geometry={new THREE.BoxGeometry(0.15, 0.03, 0.5)}>
              <meshStandardMaterial color="#fff" />
            </mesh>
            <mesh position={[-0.15, -0.15, 0.15]} rotation={[0, Math.PI / 4, 0]} geometry={new THREE.BoxGeometry(0.15, 0.03, 0.5)}>
              <meshStandardMaterial color="#fff" />
            </mesh>
          </group>
        );
      case 'toys':
        return (
          <group>
            <mesh geometry={new THREE.BoxGeometry(0.5, 0.5, 0.5)}>
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.4} clearcoat={0.5} />
            </mesh>
            <mesh position={[0.25, 0.25, 0.25]} geometry={new THREE.BoxGeometry(0.15, 0.15, 0.15)}>
              <meshPhysicalMaterial color="#fff" metalness={0} roughness={0.8} />
            </mesh>
            <mesh position={[-0.25, -0.25, 0.25]} geometry={new THREE.BoxGeometry(0.15, 0.15, 0.15)}>
              <meshPhysicalMaterial color="#fff" metalness={0} roughness={0.8} />
            </mesh>
            <mesh position={[0.25, -0.25, -0.25]} geometry={new THREE.BoxGeometry(0.15, 0.15, 0.15)}>
              <meshPhysicalMaterial color="#fff" metalness={0} roughness={0.8} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh geometry={new THREE.BoxGeometry(0.6, 0.6, 0.6)}>
            <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.4} clearcoat={0.5} />
          </mesh>
        );
    }
  }, [color, iconType]);

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {iconGeometries}
      {/* Glow ring on hover */}
      {hovered && (
        <mesh
          geometry={new THREE.RingGeometry(0.6, 0.7, 32)}
          material={
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity: 0.3,
              side: THREE.DoubleSide,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          }
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.1, 0]}
        />
      )}
    </group>
  );
}

// Particle burst effect
function ParticleBurst({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;

  const count = 30;
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.2 + Math.random() * 0.3;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.02 + Math.random() * 0.03;
    }

    return { positions, sizes };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes.position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes.size" args={[particles.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Scene for category card
function CategoryCard3DScene({ color, iconType, active }: { color: string; iconType: string; active: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 2]} intensity={1} color="#ffffff" />
      <directionalLight position={[-1, 2, -1]} intensity={0.3} color={color} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <CategoryIcon3D color={color} iconType={iconType} />
      </Float>
      <ParticleBurst color={color} active={active} />
    </>
  );
}

// Icon type mapping
function getIconType(categoryName: string): string {
  const name = categoryName.toLowerCase();
  if (name.includes('mobile') || name.includes('phone')) return 'mobile';
  if (name.includes('laptop') || name.includes('computer')) return 'laptop';
  if (name.includes('electronic') || name.includes('tv') || name.includes('audio')) return 'electronics';
  if (name.includes('appliance') || name.includes('home')) return 'appliance';
  if (name.includes('fashion') || name.includes('clothing') || name.includes('apparel')) return 'fashion';
  if (name.includes('shoe') || name.includes('footwear')) return 'footwear';
  if (name.includes('beauty') || name.includes('personal') || name.includes('care')) return 'beauty';
  if (name.includes('sport') || name.includes('fitness')) return 'sports';
  if (name.includes('toy') || name.includes('game')) return 'toys';
  return 'default';
}

// Main Category Card 3D Component
export function CategoryCard3D({
  name,
  icon,
  color,
  href,
  productCount,
  className = '',
  onClick,
}: Category3DProps) {
  const iconType = getIconType(name);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      setIsActive(true);
      setTimeout(() => setIsActive(false), 300);
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group w-full aspect-square min-h-[120px] max-w-[140px]
        rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        ${className}
      `}
      style={{
        background: `
          linear-gradient(135deg, ${color}15 0%, ${color}08 50%, transparent 100%),
          radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)
        `,
        border: isHovered ? `2px solid ${color}60` : '1px solid transparent',
        boxShadow: isHovered
          ? `0 20px 40px -12px ${color}40, 0 0 0 1px ${color}30`
          : '0 4px 16px -4px rgba(15, 23, 42, 0.08)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 35 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <Suspense fallback={null}>
            <CategoryCard3DScene color={color} iconType={iconType} active={isActive} />
          </Suspense>
        </Canvas>
      </div>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        {/* Icon emoji fallback for non-3D */}
        <div
          className="text-4xl md:text-5xl mb-2 filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          {icon}
        </div>

        <span className="category-title text-sm md:text-base font-extrabold text-slate-900 leading-snug">
          {name}
        </span>

        {productCount && (
          <span className="text-xs font-medium text-slate-500 mt-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200">
            {productCount} products
          </span>
        )}

        {/* Hover indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-primary font-bold text-xs px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-primary/20"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Explore
        </motion.div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        style={{ borderRadius: 'inherit' }}
      />
    </Link>
  );
}

// Grid of category cards
export interface CategoryGrid3DProps {
  categories: Array<{
    name: string;
    icon: string;
    color: string;
    href: string;
    productCount?: number;
  }>;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export function CategoryGrid3D({ categories, columns = 3, className = '' }: CategoryGrid3DProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  return (
    <div className={`grid gap-4 ${columnClasses[columns]} ${className}`}>
      {categories.map((cat, index) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
        >
          <CategoryCard3D {...cat} />
        </motion.div>
      ))}
    </div>
  );
}