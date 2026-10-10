import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Superbike Mesh Fallback
export const ProceduralBikeMesh = ({ color = '#0284c7' }) => {
  const group = useRef();

  // Materials
  const fairingPaint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
    [color]
  );

  const frameBlack = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090d16',
        metalness: 0.8,
        roughness: 0.35,
      }),
    []
  );

  const chromeMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.95,
        roughness: 0.1,
      }),
    []
  );

  const tireRubber = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.92,
      }),
    []
  );

  const headlightGlow = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        toneMapped: false,
      }),
    []
  );

  return (
    <group ref={group} position={[0, 0, 0]} scale={0.78}>
      {/* 1. Main Trellis Frame & Engine Block */}
      <mesh position={[0, 0.46, 0]} material={frameBlack}>
        <boxGeometry args={[0.9, 0.42, 0.3]} />
      </mesh>
      {/* Engine Crankcase & Cylinders */}
      <mesh position={[0.05, 0.32, 0]} material={chromeMetal}>
        <boxGeometry args={[0.55, 0.3, 0.38]} />
      </mesh>

      {/* 2. Aerodynamic Fuel Tank & Fairing */}
      <mesh position={[0.1, 0.72, 0]} rotation={[0, 0, -0.15]} material={fairingPaint} castShadow>
        <boxGeometry args={[0.7, 0.32, 0.42]} />
      </mesh>
      {/* Front Nose Fairing & Windscreen */}
      <mesh position={[0.55, 0.82, 0]} rotation={[0, 0, -0.45]} material={fairingPaint}>
        <boxGeometry args={[0.42, 0.28, 0.38]} />
      </mesh>
      {/* Smoked Tint Windshield */}
      <mesh position={[0.62, 0.98, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.28, 0.18, 0.28]} />
        <meshPhysicalMaterial color="#020617" transmission={0.6} transparent opacity={0.8} />
      </mesh>
      {/* Dual Angel-Eye LED Headlight */}
      <mesh position={[0.74, 0.8, 0]} material={headlightGlow}>
        <boxGeometry args={[0.04, 0.08, 0.24]} />
      </mesh>

      {/* 3. Ergonomic Rider & Pillion Seat */}
      <mesh position={[-0.32, 0.68, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.5, 0.12, 0.28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.75} />
      </mesh>
      {/* Upswept Tail Fairing */}
      <mesh position={[-0.65, 0.74, 0]} rotation={[0, 0, 0.3]} material={fairingPaint}>
        <boxGeometry args={[0.45, 0.18, 0.24]} />
      </mesh>
      {/* Rear Taillight */}
      <mesh position={[-0.88, 0.78, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.18]} />
        <meshBasicMaterial color="#ef4444" toneMapped={false} />
      </mesh>

      {/* 4. Handlebars & Clip-ons */}
      <mesh position={[0.42, 0.94, 0]} material={frameBlack}>
        <boxGeometry args={[0.08, 0.06, 0.65]} />
      </mesh>
      {/* Grips */}
      <mesh position={[0.42, 0.94, 0.32]} material={frameBlack}>
        <boxGeometry args={[0.12, 0.05, 0.06]} />
      </mesh>
      <mesh position={[0.42, 0.94, -0.32]} material={frameBlack}>
        <boxGeometry args={[0.12, 0.05, 0.06]} />
      </mesh>

      {/* 5. Exhaust System */}
      <mesh position={[-0.3, 0.3, 0.24]} rotation={[0, 0, -0.2]} material={chromeMetal}>
        <cylinderGeometry args={[0.06, 0.07, 0.65, 16]} />
      </mesh>
      <mesh position={[-0.62, 0.42, 0.26]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.08, 0.09, 0.45, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 6. Front Fork & Front Wheel */}
      <group position={[0.72, 0.32, 0]}>
        {/* Dual Inverted Telescopic Golden Forks */}
        <mesh position={[0.05, 0.26, 0.12]} rotation={[0, 0, -0.32]}>
          <cylinderGeometry args={[0.035, 0.035, 0.75, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.05, 0.26, -0.12]} rotation={[0, 0, -0.32]}>
          <cylinderGeometry args={[0.035, 0.035, 0.75, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Front Tire */}
        <mesh position={[0.16, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={tireRubber}>
          <cylinderGeometry args={[0.32, 0.32, 0.14, 28]} />
        </mesh>
        {/* Front Rim */}
        <mesh position={[0.16, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={chromeMetal}>
          <cylinderGeometry args={[0.24, 0.24, 0.15, 20]} />
        </mesh>
        {/* Twin Wave Brake Discs */}
        <mesh position={[0.16, 0.0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.015, 20]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* 7. Rear Swingarm & Rear Wheel */}
      <group position={[-0.72, 0.32, 0]}>
        {/* Cast Aluminum Swingarm */}
        <mesh position={[0.3, 0.05, 0]} rotation={[0, 0, 0.15]} material={chromeMetal}>
          <boxGeometry args={[0.55, 0.08, 0.26]} />
        </mesh>
        {/* Rear Fat Performance Tire */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber}>
          <cylinderGeometry args={[0.32, 0.32, 0.22, 28]} />
        </mesh>
        {/* Rear Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeMetal}>
          <cylinderGeometry args={[0.24, 0.24, 0.23, 20]} />
        </mesh>
        {/* Rear Sprocket / Chain Disc */}
        <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 20]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      </group>

      {/* Soft Ground Contact Shadow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 0.8]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

function GLTFBike({ url, fallbackColor }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={0.85} />;
}

export class BikeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    console.info('Bike GLTF not found or failed, using high-end procedural bike model.');
  }
  render() {
    if (this.state.hasError) {
      return <ProceduralBikeMesh color={this.props.color} />;
    }
    return this.props.children;
  }
}

export const BikeModel = ({ color = '#0284c7', position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const [modelAvailable, setModelAvailable] = useState(false);

  useEffect(() => {
    fetch('/models/bike.glb', { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('gltf')) {
          setModelAvailable(true);
        }
      })
      .catch(() => setModelAvailable(false));
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {modelAvailable ? (
        <BikeErrorBoundary color={color}>
          <React.Suspense fallback={<ProceduralBikeMesh color={color} />}>
            <GLTFBike url="/models/bike.glb" fallbackColor={color} />
          </React.Suspense>
        </BikeErrorBoundary>
      ) : (
        <ProceduralBikeMesh color={color} />
      )}
    </group>
  );
};
