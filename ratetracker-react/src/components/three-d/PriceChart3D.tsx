'use client';

import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export interface PriceDataPoint {
  label: string;
  price: number;
  date?: string;
}

export interface PriceChart3DProps {
  data: PriceDataPoint[];
  period: '1M' | '3M' | '6M' | '1Y';
  bestPrice: number;
  originalPrice: number;
  lowestEver: { price: number; date: string };
  className?: string;
  height?: number;
}

// 3D Line chart with tubes and particles
function PriceChart3DScene({
  data,
  lowestEver,
}: Pick<PriceChart3DProps, 'data' | 'lowestEver'>) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  // Calculate chart dimensions
  const chartWidth = 12;
  const chartHeight = 6;
  const padding = { left: 1.5, right: 0.5, top: 0.5, bottom: 1.5 };

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;

  // Generate 3D points for the line
  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = -chartWidth / 2 + padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right);
      const y = -chartHeight / 2 + padding.bottom + ((d.price - minPrice) / (maxPrice - minPrice)) * (chartHeight - padding.top - padding.bottom);
      return new THREE.Vector3(x, y, 0);
    });
  }, [data, chartWidth, chartHeight, padding, minPrice, maxPrice]);

  // Create smooth curve
  const curve = useMemo(() => {
    const catmullRom = new THREE.CatmullRomCurve3(points);
    return catmullRom;
  }, [points]);

  // Tube geometry for the line
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.04, 8, false);
  }, [curve]);

  // Area fill geometry
  const areaShape = useMemo(() => {
    const shape = new THREE.Shape();
    const firstPoint = points[0];
    shape.moveTo(firstPoint.x, firstPoint.y);
    points.slice(1).forEach(p => shape.lineTo(p.x, p.y));
    shape.lineTo(points[points.length - 1].x, -chartHeight / 2 + padding.bottom - 0.1);
    shape.lineTo(points[0].x, -chartHeight / 2 + padding.bottom - 0.1);
    shape.closePath();
    return shape;
  }, [points, chartHeight, padding]);

  const areaGeometry = useMemo(() => {
    return new THREE.ShapeGeometry(areaShape);
  }, [areaShape]);

  // Trigger animation on mount
  useState(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  });

  return (
    <group>
      {/* Grid lines */}
      <GridLines
        width={chartWidth}
        height={chartHeight}
        padding={padding}
      />

      {/* X-axis labels */}
      <XAxisLabels data={data} width={chartWidth} padding={padding} chartHeight={chartHeight} />

      {/* Y-axis labels */}
      <YAxisLabels minPrice={minPrice} maxPrice={maxPrice} height={chartHeight} padding={padding} />

      {/* Area fill (gradient) */}
      <mesh
        geometry={areaGeometry}
        position={[0, 0, -0.1]}
        material={
          new THREE.MeshBasicMaterial({
            color: '#1e62fe',
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        }
      />

      {/* Main line tube */}
      <mesh
        ref={tubeRef}
        geometry={tubeGeometry}
        material={
          new THREE.MeshPhysicalMaterial({
            color: '#1e62fe',
            metalness: 0,
            roughness: 0.2,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transparent: true,
            opacity: 1,
          })
        }
        scale={animated ? [1, 1, 1] : [0, 0, 0]}
      >
        <meshStandardMaterial
          attach="material"
          color="#1e62fe"
          emissive="#1e62fe"
          emissiveIntensity={0.3}
          metalness={0}
          roughness={0.2}
        />
      </mesh>

      {/* Glow line behind tube */}
      <mesh
        geometry={tubeGeometry}
        material={
          new THREE.MeshBasicMaterial({
            color: '#1e62fe',
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        }
        scale={animated ? [1.5, 1.5, 1.5] : [0, 0, 0]}
      />

      {/* Data points as spheres */}
      {points.map((point, index) => (
        <DataPointSphere
          key={index}
          point={point}
          data={data[index]}
          isCurrent={index === data.length - 1}
          isHovered={hoveredIndex === index}
          isLowest={data[index].price === lowestEver.price}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}

      {/* Lowest ever marker */}
      {lowestEver && (
        <LowestEverMarker
          price={lowestEver.price}
          date={lowestEver.date}
          x={points.findIndex(p => data[points.indexOf(p)]?.price === lowestEver.price) >= 0
            ? points[data.findIndex(d => d.price === lowestEver.price)].x
            : points[0].x}
          y={points.findIndex(p => data[points.indexOf(p)]?.price === lowestEver.price) >= 0
            ? points[data.findIndex(d => d.price === lowestEver.price)].y
            : points[0].y}
        />
      )}

      {/* Current price label */}
      <CurrentPriceLabel
        price={data[data.length - 1].price}
        x={points[points.length - 1].x}
        y={points[points.length - 1].y}
      />

      {/* Axis lines */}
      <AxisLines width={chartWidth} height={chartHeight} padding={padding} />
    </group>
  );
}

// Grid lines component
function GridLines({ width, height, padding }: {
  width: number;
  height: number;
  padding: { left: number; right: number; top: number; bottom: number };
}) {
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[] = [];
    const horizontalCount = 4;
    const verticalCount = 5;

    // Horizontal grid lines
    for (let i = 0; i <= horizontalCount; i++) {
      const y = -height / 2 + padding.bottom + (i / horizontalCount) * (height - padding.top - padding.bottom);
      lines.push(
        new THREE.Vector3(-width / 2 + padding.left, y, -0.2),
        new THREE.Vector3(width / 2 - padding.right, y, -0.2)
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= verticalCount; i++) {
      const x = -width / 2 + padding.left + (i / verticalCount) * (width - padding.left - padding.right);
      lines.push(
        new THREE.Vector3(x, -height / 2 + padding.bottom, -0.2),
        new THREE.Vector3(x, height / 2 - padding.top, -0.2)
      );
    }

    return lines;
  }, [width, height, padding]);

  const positions = useMemo(() => {
    const arr = new Float32Array(gridLines.length * 3);
    gridLines.forEach((v, i) => {
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    return arr;
  }, [gridLines]);

  return (
    <lineSegments>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes.position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#e2e8f0" transparent opacity={0.3} linewidth={1} />
    </lineSegments>
  );
}

// X-axis labels
function XAxisLabels({ data, width, padding, chartHeight }: {
  data: PriceDataPoint[];
  width: number;
  padding: { left: number; right: number; bottom: number };
  chartHeight: number;
}) {
  return (
    <group>
      {data.map((d, i) => (
        <Html
          key={i}
          transform
          position={[
            -width / 2 + padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right),
            -chartHeight / 2 + padding.bottom - 0.5,
            0
          ]}
          style={{
            transform: 'translate(-50%, 0)',
            pointerEvents: 'none',
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {d.label}
        </Html>
      ))}
    </group>
  );
}

// Y-axis labels
function YAxisLabels({ minPrice, maxPrice, height, padding }: {
  minPrice: number;
  maxPrice: number;
  height: number;
  padding: { left: number; right: number; top: number; bottom: number };
}) {
  const labels = useMemo(() => {
    const count = 4;
    const arr = [];
    for (let i = 0; i <= count; i++) {
      const price = minPrice + (i / count) * (maxPrice - minPrice);
      const y = -height / 2 + padding.bottom + (i / count) * (height - padding.top - padding.bottom);
      arr.push({ price, y });
    }
    return arr;
  }, [minPrice, maxPrice, height, padding]);

  return (
    <group>
      {labels.map((label, i) => (
        <Html
          key={i}
          transform
          position={[-padding.left + 0.1, label.y, 0]}
          style={{
            transform: 'translate(0, -50%)',
            pointerEvents: 'none',
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: 600,
            textAlign: 'right',
            width: '120px',
          }}
        >
          ₹{Math.round(label.price).toLocaleString('en-IN')}
        </Html>
      ))}
    </group>
  );
}

// Axis lines
function AxisLines({ width, height, padding }: {
  width: number;
  height: number;
  padding: { left: number; right: number; top: number; bottom: number };
}) {
  const yAxisPositions = useMemo(() => new Float32Array([
    -width / 2 + padding.left, -height / 2 + padding.bottom, 0,
    -width / 2 + padding.left, height / 2 - padding.top, 0,
  ]), [width, height, padding]);

  const xAxisPositions = useMemo(() => new Float32Array([
    -width / 2 + padding.left, -height / 2 + padding.bottom, 0,
    width / 2 - padding.right, -height / 2 + padding.bottom, 0,
  ]), [width, height, padding]);

  return (
    <group>
      {/* Y-axis */}
      <lineSegments>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes.position" args={[yAxisPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" linewidth={2} />
      </lineSegments>

      {/* X-axis */}
      <lineSegments>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes.position" args={[xAxisPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" linewidth={2} />
      </lineSegments>
    </group>
  );
}

// Individual data point sphere
function DataPointSphere({
  point,
  data,
  isCurrent,
  isHovered,
  isLowest,
  onHover,
  onLeave,
}: {
  point: THREE.Vector3;
  data: PriceDataPoint;
  isCurrent: boolean;
  isHovered: boolean;
  isLowest: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const size = isCurrent ? 0.12 : isHovered ? 0.1 : isLowest ? 0.11 : 0.07;
  const color = isLowest ? '#10b981' : isCurrent ? '#1e62fe' : '#3b82f6';

  return (
    <group
      onPointerOver={onHover}
      onPointerOut={onLeave}
    >
      {/* Pulse ring for current/lowest */}
      {(isCurrent || isLowest) && (
        <mesh
          geometry={new THREE.RingGeometry(size * 1.5, size * 2.5, 32)}
          material={
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity: 0.3,
              side: THREE.DoubleSide,
              depthWrite: false,
            })
          }
          position={point}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, 1, 1]}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'none' }}
          />
        </mesh>
      )}

      {/* Main sphere */}
      <mesh
        geometry={new THREE.SphereGeometry(size, 16, 16)}
        material={
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0,
            roughness: 0.2,
            clearcoat: 1,
            clearcoatRoughness: 0,
            emissive: isCurrent || isLowest ? color : '#000000',
            emissiveIntensity: isCurrent || isLowest ? 0.5 : 0,
          })
        }
        position={point}
        scale={isHovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      />

      {/* Tooltip */}
      {isHovered && (
        <Html
          transform
          position={[point.x, point.y + 0.5, 0]}
          style={{
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-medium whitespace-nowrap border border-slate-700"
          >
            <div className="font-bold text-primary">{data.label}</div>
            <div className="text-lg font-extrabold">₹{data.price.toLocaleString('en-IN')}</div>
            {isLowest && <div className="text-green-400 text-xs mt-1">● Lowest Ever</div>}
            {isCurrent && <div className="text-blue-400 text-xs mt-1">● Current Price</div>}
          </motion.div>
        </Html>
      )}
    </group>
  );
}

// Lowest ever marker
function LowestEverMarker({ price, date, x, y }: {
  price: number;
  date: string;
  x: number;
  y: number;
}) {
  return (
    <group position={[x, y, 0]}>
      {/* Diamond marker */}
      <mesh
        geometry={new THREE.OctahedronGeometry(0.12)}
        material={
          new THREE.MeshPhysicalMaterial({
            color: '#10b981',
            metalness: 0.3,
            roughness: 0.2,
            clearcoat: 1,
            emissive: '#10b981',
            emissiveIntensity: 0.5,
          })
        }
        rotation={[0, 0, Math.PI / 4]}
      >
        <motion.div
          initial={{ rotateZ: 0 }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'none' }}
        />
      </mesh>

      {/* Label */}
      <Html
        transform
        position={[0, -0.6, 0]}
        style={{
          transform: 'translate(-50%, 0)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-lg">
          <span>🏆</span>
          <span>Lowest: ₹{price.toLocaleString('en-IN')} ({date})</span>
        </div>
      </Html>
    </group>
  );
}

// Current price label
function CurrentPriceLabel({ price, x, y }: { price: number; x: number; y: number }) {
  return (
    <Html
      transform
      position={[x, y + 0.7, 0]}
      style={{
        transform: 'translate(-50%, 0)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-extrabold shadow-lg flex items-center gap-1">
        <span>💰</span>
        <span>Current: ₹{price.toLocaleString('en-IN')}</span>
      </div>
    </Html>
  );
}

// Lighting for chart
function ChartLights() {
  return (
    <>
      <ambientLight color="#ffffff" intensity={0.6} />
      <directionalLight position={[5, 10, 5]} color="#ffffff" intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} color="#1e62fe" intensity={0.2} />
    </>
  );
}

// Main export component
export function PriceChart3D({
  data,
  lowestEver,
  className = '',
  height = 350,
}: PriceChart3DProps) {
  // Filter data for selected period
  const periodData = data; // Assuming data is already filtered for the period

  return (
    <div className={`relative w-full ${className}`} style={{ height: `${height}px` }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 30 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={<ChartLoading />}>
          <ChartLights />
          <PriceChart3DScene
            data={periodData}
            lowestEver={lowestEver}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Loading fallback
function ChartLoading() {
  return (
    <Html
      transform
      position={[0, 0, 0]}
      style={{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
    >
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading 3D chart...</span>
      </div>
    </Html>
  );
}

// Hook for period data filtering (to be used in parent component)
export function usePeriodData(
  allData: Record<string, PriceDataPoint[]>,
  period: '1M' | '3M' | '6M' | '1Y'
): PriceDataPoint[] {
  return useMemo(() => allData[period] || allData['6M'] || [], [allData, period]);
}