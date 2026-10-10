import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Play, RotateCcw, ShieldCheck, Gauge, Compass } from 'lucide-react';

// Wind-tunnel Aerodynamic Particle Slipstream
function AerodynamicStreamlines({ speed = 1 }) {
  const pointsCount = 450;
  const meshRef = useRef();

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(pointsCount * 3);
    const initial = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const x = (Math.random() - 0.5) * 8 + 3; // Start from front
      const y = Math.random() * 1.6 + 0.1;
      const z = (Math.random() - 0.5) * 2.8;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initial[i * 3] = x;
      initial[i * 3 + 1] = y;
      initial[i * 3 + 2] = z;
    }
    return [pos, initial];
  }, [pointsCount]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const array = meshRef.current.geometry.attributes.position.array;
    const currentSpeed = delta * 12 * speed;

    for (let i = 0; i < pointsCount; i++) {
      // Move backwards along X axis
      array[i * 3] -= currentSpeed;

      // Aerodynamic curve over car roof
      const currentX = array[i * 3];
      if (currentX < 1.5 && currentX > -1.5) {
        array[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 4 + i) * 0.004;
      }

      // Reset when particle passes behind the car
      if (array[i * 3] < -5) {
        array[i * 3] = 4 + Math.random() * 2;
        array[i * 3 + 1] = initialPositions[i * 3 + 1];
        array[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#38bdf8"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Futuristic Holographic Radar HUD Ring around vehicle
function HolographicHUD({ boostActive }) {
  const innerRing = useRef();
  const outerRing = useRef();

  useFrame((state, delta) => {
    if (innerRing.current) {
      innerRing.current.rotation.z += delta * (boostActive ? 1.8 : 0.6);
    }
    if (outerRing.current) {
      outerRing.current.rotation.z -= delta * (boostActive ? 1.2 : 0.4);
    }
  });

  return (
    <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Inner Rotating HUD Ring */}
      <mesh ref={innerRing}>
        <ringGeometry args={[2.4, 2.45, 64]} />
        <meshBasicMaterial
          color={boostActive ? '#0284c7' : '#2563eb'}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Segmented HUD Ring */}
      <mesh ref={outerRing}>
        <ringGeometry args={[2.7, 2.73, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cybernetic Ground Grid Floor */}
      <gridHelper args={[7, 14, '#2563eb', '#93c5fd']} position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial transparent opacity={0.12} />
      </gridHelper>
    </group>
  );
}

// Sculpted Aerodynamic Hypercar Speedform Model
function AerodynamicSpeedform({ carColor, boostActive }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      // Gentle auto yaw rotation (slows slightly when user interacts)
      group.current.rotation.y += delta * (boostActive ? 0.6 : 0.22);
    }
  });

  // Metallic Clearcoat Paint Shader
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: carColor,
        metalness: 0.88,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.95,
      }),
    [carColor]
  );

  const carbonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090d16',
        metalness: 0.7,
        roughness: 0.35,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#020617',
        metalness: 0.9,
        roughness: 0.05,
        transmission: 0.65,
        thickness: 0.6,
        reflectivity: 1,
      }),
    []
  );

  const neonCyan = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: boostActive ? '#00f2fe' : '#38bdf8',
        toneMapped: false,
      }),
    [boostActive]
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
    <group ref={group} position={[0, 0.2, 0]} scale={1.2}>
      {/* 1. Low-Slung Aerodynamic Core Fuselage */}
      <mesh position={[0, 0.36, 0]} material={bodyMaterial} castShadow>
        <boxGeometry args={[3.8, 0.35, 1.7]} />
      </mesh>

      {/* Contoured Hood & Shark Nose */}
      <mesh position={[1.4, 0.38, 0]} rotation={[0, 0, -0.1]} material={bodyMaterial} castShadow>
        <boxGeometry args={[1.2, 0.26, 1.66]} />
      </mesh>
      {/* Downforce Nose Wedge */}
      <mesh position={[1.98, 0.3, 0]} rotation={[0, 0, -0.24]} material={bodyMaterial}>
        <boxGeometry args={[0.35, 0.16, 1.62]} />
      </mesh>

      {/* Front Carbon Ground Splitter */}
      <mesh position={[2.08, 0.16, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.35, 0.04, 1.84]} />
      </mesh>
      {/* Splitter Winglets */}
      <mesh position={[2.08, 0.24, 0.93]} material={carbonMaterial}>
        <boxGeometry args={[0.26, 0.14, 0.04]} />
      </mesh>
      <mesh position={[2.08, 0.24, -0.93]} material={carbonMaterial}>
        <boxGeometry args={[0.26, 0.14, 0.04]} />
      </mesh>

      {/* Dual Aerodynamic Hood Air Channels */}
      <mesh position={[1.15, 0.5, 0.42]} rotation={[0, 0, 0.12]} material={carbonMaterial}>
        <boxGeometry args={[0.55, 0.03, 0.3]} />
      </mesh>
      <mesh position={[1.15, 0.5, -0.42]} rotation={[0, 0, 0.12]} material={carbonMaterial}>
        <boxGeometry args={[0.55, 0.03, 0.3]} />
      </mesh>

      {/* 2. Cockpit Glass Canopy Dome */}
      <mesh position={[-0.15, 0.76, 0]} material={glassMaterial} castShadow>
        <boxGeometry args={[2.0, 0.48, 1.34]} />
      </mesh>
      {/* Windshield Slope */}
      <mesh position={[0.76, 0.65, 0]} rotation={[0, 0, -0.6]} material={glassMaterial}>
        <boxGeometry args={[0.85, 0.07, 1.3]} />
      </mesh>
      {/* Rear Fastback Engine Glass */}
      <mesh position={[-1.05, 0.66, 0]} rotation={[0, 0, 0.46]} material={glassMaterial}>
        <boxGeometry args={[1.05, 0.07, 1.3]} />
      </mesh>
      {/* Carbon Roof Spine */}
      <mesh position={[-0.15, 0.98, 0]} material={carbonMaterial}>
        <boxGeometry args={[1.5, 0.06, 1.2]} />
      </mesh>

      {/* 3. Side Venturi Tunnels & Ground Skirts */}
      <mesh position={[0, 0.18, 0.88]} material={carbonMaterial}>
        <boxGeometry args={[2.6, 0.08, 0.12]} />
      </mesh>
      <mesh position={[0, 0.18, -0.88]} material={carbonMaterial}>
        <boxGeometry args={[2.6, 0.08, 0.12]} />
      </mesh>
      {/* Side Ram Air Cooling Intakes */}
      <mesh position={[-0.55, 0.42, 0.88]} rotation={[0, -0.22, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.65, 0.24, 0.08]} />
      </mesh>
      <mesh position={[-0.55, 0.42, -0.88]} rotation={[0, 0.22, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.65, 0.24, 0.08]} />
      </mesh>

      {/* 4. Rear Wide Fenders, Diffuser & Active GT Wing */}
      <mesh position={[-1.4, 0.46, 0]} rotation={[0, 0, 0.1]} material={bodyMaterial}>
        <boxGeometry args={[1.1, 0.32, 1.72]} />
      </mesh>
      {/* Carbon Rear Diffuser */}
      <mesh position={[-1.9, 0.19, 0]} rotation={[0, 0, 0.16]} material={carbonMaterial}>
        <boxGeometry args={[0.34, 0.16, 1.76]} />
      </mesh>

      {/* Rear Quad Exhaust Barrels */}
      {[-0.5, -0.34, 0.34, 0.5].map((z, idx) => (
        <mesh key={idx} position={[-1.95, 0.28, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.14, 16]} />
          <meshStandardMaterial color={boostActive ? '#38bdf8' : '#64748b'} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Active Carbon Rear Wing & Endplates */}
      <mesh position={[-1.86, 0.82, 0]}>
        <boxGeometry args={[0.42, 0.05, 1.78]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-1.86, 0.88, 0.9]}>
        <boxGeometry args={[0.45, 0.18, 0.03]} />
        <meshStandardMaterial color={carColor} metalness={0.8} />
      </mesh>
      <mesh position={[-1.86, 0.88, -0.9]}>
        <boxGeometry args={[0.45, 0.18, 0.03]} />
        <meshStandardMaterial color={carColor} metalness={0.8} />
      </mesh>
      {/* Wing Struts */}
      <mesh position={[-1.76, 0.66, 0.55]} rotation={[0, 0, 0.25]} material={carbonMaterial}>
        <boxGeometry args={[0.08, 0.3, 0.04]} />
      </mesh>
      <mesh position={[-1.76, 0.66, -0.55]} rotation={[0, 0, 0.25]} material={carbonMaterial}>
        <boxGeometry args={[0.08, 0.3, 0.04]} />
      </mesh>

      {/* 5. Glowing Headlights & OLED Taillight Bars */}
      <mesh position={[2.02, 0.38, 0.62]} rotation={[0, -0.22, 0]} material={neonCyan}>
        <boxGeometry args={[0.12, 0.07, 0.42]} />
      </mesh>
      <mesh position={[2.02, 0.38, -0.62]} rotation={[0, 0.22, 0]} material={neonCyan}>
        <boxGeometry args={[0.12, 0.07, 0.42]} />
      </mesh>
      {/* Rear Full-Width Laser Taillight */}
      <mesh position={[-1.94, 0.44, 0]} material={neonRed}>
        <boxGeometry args={[0.05, 0.06, 1.68]} />
      </mesh>

      {/* 6. Four High-Speed Sports Alloy Wheels */}
      {[
        { pos: [1.25, 0.22, 0.96] },
        { pos: [1.25, 0.22, -0.96] },
        { pos: [-1.22, 0.22, 0.96] },
        { pos: [-1.22, 0.22, -0.96] },
      ].map((wheel, idx) => (
        <group key={idx} position={wheel.pos}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.85} />
          </mesh>
          {/* Alloy Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.25, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* 5-Spoke Star Rim */}
          {[0, 1, 2, 3, 4].map((spoke) => (
            <mesh
              key={spoke}
              rotation={[0, 0, (spoke * 2 * Math.PI) / 5]}
              position={[0, 0, wheel.pos[2] > 0 ? 0.08 : -0.08]}
            >
              <boxGeometry args={[0.42, 0.055, 0.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          ))}
          {/* Performance Caliper */}
          <mesh position={[0.1, 0.08, wheel.pos[2] > 0 ? 0.06 : -0.06]}>
            <boxGeometry args={[0.14, 0.15, 0.06]} />
            <meshStandardMaterial color="#2563eb" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 7. Soft Ground Ambient Shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 2.5]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const ThreeCanvas = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#1d4ed8');
  const [boostActive, setBoostActive] = useState(false);
  const [viewPreset, setViewPreset] = useState('angle'); // 'angle', 'front', 'side'

  const colorOptions = [
    { name: 'Royal Sapphire', color: '#1d4ed8' },
    { name: 'Obsidian Jet', color: '#090d16' },
    { name: 'Alpine Pearl', color: '#f8fafc' },
    { name: 'Hyper Cyan', color: '#0284c7' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const FallbackView = (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-lg aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-4">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop"
          alt="Carzo Drive Hyper Vehicle"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </div>
  );

  if (!mounted) return FallbackView;

  return (
    <div className={`relative w-full h-[400px] sm:h-[500px] lg:h-[580px] ${className}`}>
      {/* Background ambient aerodynamic blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Floating Telemetry Pills */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-900 pointer-events-auto">
          <span className={`w-2 h-2 rounded-full ${boostActive ? 'bg-cyan-500 animate-ping' : 'bg-blue-600'}`} />
          <span>AERO-DYNAMICS: {boostActive ? 'WIND TUNNEL MAX' : 'ACTIVE SIMULATION'}</span>
        </div>

        <button
          type="button"
          onClick={() => setBoostActive(!boostActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm pointer-events-auto cursor-pointer ${
            boostActive
              ? 'bg-blue-600 text-white shadow-glow-sm'
              : 'bg-white hover:bg-slate-50 text-blue-600 border border-blue-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{boostActive ? 'TURBO BOOSTED' : 'BOOST SLIPSTREAM'}</span>
        </button>
      </div>

      <CanvasErrorBoundary fallback={FallbackView}>
        <Canvas
          camera={{ position: [4.4, 2.2, 4.2], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          className="cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={1.1} />
          <directionalLight
            position={[8, 12, 7]}
            intensity={2.6}
            color="#ffffff"
            castShadow
          />
          <directionalLight
            position={[-8, 6, -6]}
            intensity={1.4}
            color="#93c5fd"
          />
          <pointLight position={[0, -2, 0]} intensity={1.8} color="#2563eb" />
          <pointLight position={[3, 2, -3]} intensity={1.2} color="#38bdf8" />

          <Suspense fallback={null}>
            <Float
              speed={boostActive ? 3.0 : 1.5}
              rotationIntensity={0.12}
              floatIntensity={0.2}
              floatingRange={[-0.06, 0.06]}
            >
              <AerodynamicSpeedform
                carColor={selectedColor}
                boostActive={boostActive}
              />
            </Float>

            {/* Aerodynamic Wind-Tunnel Streamlines */}
            <AerodynamicStreamlines speed={boostActive ? 2.5 : 1.0} />

            {/* Holographic Radar HUD Platform */}
            <HolographicHUD boostActive={boostActive} />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.15}
            minPolarAngle={Math.PI / 4.2}
            rotateSpeed={0.65}
            dampingFactor={0.05}
          />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Bottom Interactive Customizer & Drag Hint Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-card">
        <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">
          Finish:
        </span>
        <div className="flex items-center gap-1.5">
          {colorOptions.map((opt) => (
            <button
              key={opt.color}
              type="button"
              onClick={() => setSelectedColor(opt.color)}
              title={opt.name}
              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                selectedColor === opt.color
                  ? 'scale-125 border-blue-600 ring-2 ring-blue-400/40'
                  : 'border-slate-300 hover:scale-110'
              }`}
              style={{ backgroundColor: opt.color }}
            />
          ))}
        </div>
        <div className="h-3.5 w-[1px] bg-slate-200 hidden sm:block" />
        <span className="text-[11px] text-blue-600 font-bold hidden sm:inline flex items-center gap-1">
          <Compass className="w-3 h-3" />
          <span>360° Interactive Drag</span>
        </span>
      </div>
    </div>
  );
};
