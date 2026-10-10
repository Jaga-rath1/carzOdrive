import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Sleek Sports Car Mesh Fallback
export const ProceduralCarMesh = ({ color = '#1e3a8a' }) => {
  const group = useRef();

  // Premium automotive materials
  const bodyPaint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
      }),
    [color]
  );

  const carbonAero = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0d14',
        metalness: 0.8,
        roughness: 0.35,
      }),
    []
  );

  const tintedGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#020617',
        metalness: 0.95,
        roughness: 0.05,
        transmission: 0.5,
        thickness: 0.8,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const neonCyan = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        toneMapped: false,
      }),
    []
  );

  const neonRed = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ef4444',
        toneMapped: false,
      }),
    []
  );

  return (
    <group ref={group} position={[0, 0, 0]} scale={0.95}>
      {/* 1. Main Sculpted Body Fuselage */}
      <mesh position={[0, 0.35, 0]} material={bodyPaint} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.34, 1.6]} />
      </mesh>

      {/* Aerodynamic Low Hood Slope */}
      <mesh position={[1.2, 0.36, 0]} rotation={[0, 0, -0.1]} material={bodyPaint} castShadow>
        <boxGeometry args={[1.1, 0.25, 1.56]} />
      </mesh>
      {/* Front Nose Wedge */}
      <mesh position={[1.72, 0.28, 0]} rotation={[0, 0, -0.22]} material={bodyPaint}>
        <boxGeometry args={[0.3, 0.16, 1.52]} />
      </mesh>

      {/* Carbon Front Splitter */}
      <mesh position={[1.82, 0.15, 0]} material={carbonAero}>
        <boxGeometry args={[0.3, 0.04, 1.7]} />
      </mesh>

      {/* 2. Cockpit Glass Canopy */}
      <mesh position={[-0.15, 0.72, 0]} material={tintedGlass} castShadow>
        <boxGeometry args={[1.75, 0.44, 1.28]} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0.66, 0.62, 0]} rotation={[0, 0, -0.58]} material={tintedGlass}>
        <boxGeometry args={[0.75, 0.06, 1.24]} />
      </mesh>
      {/* Rear Fastback Window */}
      <mesh position={[-0.92, 0.62, 0]} rotation={[0, 0, 0.45]} material={tintedGlass}>
        <boxGeometry args={[0.9, 0.06, 1.24]} />
      </mesh>
      {/* Carbon Roof Plate */}
      <mesh position={[-0.15, 0.93, 0]} material={carbonAero}>
        <boxGeometry args={[1.35, 0.04, 1.15]} />
      </mesh>

      {/* 3. Side Aero Skirts & Venturi Tunnels */}
      <mesh position={[0, 0.16, 0.82]} material={carbonAero}>
        <boxGeometry args={[2.3, 0.07, 0.1]} />
      </mesh>
      <mesh position={[0, 0.16, -0.82]} material={carbonAero}>
        <boxGeometry args={[2.3, 0.07, 0.1]} />
      </mesh>

      {/* 4. Rear Wide Fenders & Diffuser */}
      <mesh position={[-1.25, 0.44, 0]} rotation={[0, 0, 0.08]} material={bodyPaint}>
        <boxGeometry args={[1.0, 0.32, 1.62]} />
      </mesh>
      <mesh position={[-1.7, 0.18, 0]} rotation={[0, 0, 0.14]} material={carbonAero}>
        <boxGeometry args={[0.3, 0.14, 1.66]} />
      </mesh>

      {/* Rear Carbon GT Wing */}
      <mesh position={[-1.65, 0.76, 0]} material={carbonAero}>
        <boxGeometry args={[0.36, 0.04, 1.68]} />
      </mesh>
      <mesh position={[-1.65, 0.82, 0.84]} material={bodyPaint}>
        <boxGeometry args={[0.4, 0.16, 0.03]} />
      </mesh>
      <mesh position={[-1.65, 0.82, -0.84]} material={bodyPaint}>
        <boxGeometry args={[0.4, 0.16, 0.03]} />
      </mesh>
      {/* Wing Struts */}
      <mesh position={[-1.56, 0.62, 0.48]} rotation={[0, 0, 0.2]} material={carbonAero}>
        <boxGeometry args={[0.06, 0.26, 0.03]} />
      </mesh>
      <mesh position={[-1.56, 0.62, -0.48]} rotation={[0, 0, 0.2]} material={carbonAero}>
        <boxGeometry args={[0.06, 0.26, 0.03]} />
      </mesh>

      {/* 5. Glowing Headlights & Taillight */}
      <mesh position={[1.76, 0.35, 0.58]} rotation={[0, -0.2, 0]} material={neonCyan}>
        <boxGeometry args={[0.1, 0.06, 0.38]} />
      </mesh>
      <mesh position={[1.76, 0.35, -0.58]} rotation={[0, 0.2, 0]} material={neonCyan}>
        <boxGeometry args={[0.1, 0.06, 0.38]} />
      </mesh>
      {/* Full-width rear OLED laser bar */}
      <mesh position={[-1.72, 0.42, 0]} material={neonRed}>
        <boxGeometry args={[0.04, 0.05, 1.58]} />
      </mesh>

      {/* 6. Four Alloy Wheels */}
      {[
        { pos: [1.1, 0.2, 0.88] },
        { pos: [1.1, 0.2, -0.88] },
        { pos: [-1.08, 0.2, 0.88] },
        { pos: [-1.08, 0.2, -0.88] },
      ].map((wheel, idx) => (
        <group key={idx} position={wheel.pos}>
          {/* Performance Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          {/* Silver Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.23, 20]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Spoke detail */}
          {[0, 1, 2, 3, 4].map((spoke) => (
            <mesh
              key={spoke}
              rotation={[0, 0, (spoke * 2 * Math.PI) / 5]}
              position={[0, 0, wheel.pos[2] > 0 ? 0.07 : -0.07]}
            >
              <boxGeometry args={[0.38, 0.045, 0.03]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          ))}
          {/* Blue Brake Caliper */}
          <mesh position={[0.08, 0.07, wheel.pos[2] > 0 ? 0.05 : -0.05]}>
            <boxGeometry args={[0.12, 0.14, 0.05]} />
            <meshStandardMaterial color="#2563eb" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Soft Ground Contact Shadow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.2]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

// GLTF Loader Component with Fallback
function GLTFCar({ url, fallbackColor }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={1.0} />;
}

export class CarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.info('Car GLTF not found or failed, using high-end procedural car model.');
  }
  render() {
    if (this.state.hasError) {
      return <ProceduralCarMesh color={this.props.color} />;
    }
    return this.props.children;
  }
}

export const CarModel = ({ color = '#1e3a8a', position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const [modelAvailable, setModelAvailable] = useState(false);

  useEffect(() => {
    // Check if /models/car.glb exists
    fetch('/models/car.glb', { method: 'HEAD' })
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
        <CarErrorBoundary color={color}>
          <React.Suspense fallback={<ProceduralCarMesh color={color} />}>
            <GLTFCar url="/models/car.glb" fallbackColor={color} />
          </React.Suspense>
        </CarErrorBoundary>
      ) : (
        <ProceduralCarMesh color={color} />
      )}
    </group>
  );
};
