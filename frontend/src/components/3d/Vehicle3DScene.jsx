import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { StudioEnvironment } from './Environment';
import { CarModel } from './CarModel';
import { BikeModel } from './BikeModel';
import { Sparkles, Compass } from 'lucide-react';

// Floating UI Badge in 3D Space
function FloatingTag({ position, label, subtext, delay = 0 }) {
  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[100, 0]}>
      <div className="pointer-events-none select-none transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.3)] text-white whitespace-nowrap animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-black tracking-wide text-white uppercase leading-none">
              {label}
            </span>
            {subtext && (
              <span className="text-[9px] font-medium text-blue-300 leading-none mt-0.5">
                {subtext}
              </span>
            )}
          </div>
        </div>
      </div>
    </Html>
  );
}

// Interactive Stage with Subtle Parallax & Slow Auto-Yaw
function VehicleStage({ carColor = '#1d4ed8', bikeColor = '#0284c7' }) {
  const stageRef = useRef();

  useFrame((state, delta) => {
    if (stageRef.current) {
      // Gentle floating auto-yaw
      stageRef.current.rotation.y += delta * 0.12;

      // Mouse Parallax tilt
      const mouseX = state.pointer.x * 0.15;
      const mouseY = state.pointer.y * 0.08;
      stageRef.current.rotation.x = THREE.MathUtils.lerp(stageRef.current.rotation.x, -mouseY, 0.05);
      stageRef.current.rotation.z = THREE.MathUtils.lerp(stageRef.current.rotation.z, mouseX * 0.5, 0.05);
    }
  });

  return (
    <group ref={stageRef} position={[0, -0.2, 0]}>
      <Float
        speed={1.6}
        rotationIntensity={0.08}
        floatIntensity={0.18}
        floatingRange={[-0.04, 0.04]}
      >
        {/* Main Object: Premium Sports Car */}
        <CarModel
          color={carColor}
          position={[0.2, 0, 0.3]}
          rotation={[0, 0.25, 0]}
        />

        {/* Secondary Object: Premium Superbike alongside/slightly behind */}
        <BikeModel
          color={bikeColor}
          position={[-1.75, 0, -0.85]}
          rotation={[0, 0.45, 0]}
        />

        {/* 3 Floating Badges in 3D Space */}
        <FloatingTag
          position={[1.6, 1.2, 0.5]}
          label="Self Drive"
          subtext="Instant Unlock"
        />
        <FloatingTag
          position={[-0.2, 1.6, 0.3]}
          label="Premium Fleet"
          subtext="Curated Luxury"
        />
        <FloatingTag
          position={[-1.8, 1.3, -0.6]}
          label="Professional Drivers"
          subtext="Verified Chauffeurs"
        />
      </Float>
    </group>
  );
}

class SceneErrorBoundary extends React.Component {
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

export const Vehicle3DScene = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const [activeCarColor, setActiveCarColor] = useState('#1e3a8a');

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorPalettes = [
    { name: 'Royal Sapphire', hex: '#1e3a8a' },
    { name: 'Midnight Onyx', hex: '#0f172a' },
    { name: 'Pure Pearl', hex: '#f8fafc' },
    { name: 'Electric Cyan', hex: '#0284c7' },
  ];

  const StaticFallback = (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10 p-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white">DRIVORA Studio Preview</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Interactive 3D vehicle showroom with real-time lighting and reflection physics.
        </p>
      </div>
    </div>
  );

  if (!mounted) return StaticFallback;

  return (
    <div className={`relative w-full h-[440px] sm:h-[500px] lg:h-[580px] select-none ${className}`}>
      {/* Studio ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#030712] via-[#081024] to-[#040816] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Soft Radial Center Studio Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[360px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[380px] h-[100px] bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Top Studio Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>DRIVORA 3D AUTOMOTIVE STUDIO</span>
        </div>

        {/* 3D Canvas */}
        <SceneErrorBoundary fallback={StaticFallback}>
          <Canvas
            camera={{ position: [3.8, 1.8, 4.2], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            className="cursor-grab active:cursor-grabbing w-full h-full"
          >
            <StudioEnvironment />

            <Suspense fallback={null}>
              <VehicleStage carColor={activeCarColor} bikeColor="#0284c7" />
            </Suspense>

            {/* Controlled Orbit Interaction */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={Math.PI / 4.5}
              rotateSpeed={0.6}
              dampingFactor={0.06}
            />
          </Canvas>
        </SceneErrorBoundary>

        {/* Bottom Color Picker & Hint Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/85 backdrop-blur-xl border border-white/15 shadow-xl">
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Finish:
          </span>
          <div className="flex items-center gap-2">
            {colorPalettes.map((opt) => (
              <button
                key={opt.hex}
                type="button"
                onClick={() => setActiveCarColor(opt.hex)}
                title={opt.name}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                  activeCarColor === opt.hex
                    ? 'scale-125 border-blue-400 ring-2 ring-blue-500/40'
                    : 'border-slate-500/80 hover:scale-110'
                }`}
                style={{ backgroundColor: opt.hex }}
              />
            ))}
          </div>

          <div className="h-3.5 w-[1px] bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Drag to Inspect</span>
          </div>
        </div>
      </div>
    </div>
  );
};
