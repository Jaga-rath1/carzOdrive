import React from 'react';
import * as THREE from 'three';

export const StudioEnvironment = () => {
  return (
    <>
      {/* Dark studio ambient baseline */}
      <ambientLight intensity={0.7} color="#94a3b8" />

      {/* Primary Key Light - sharp highlights on car body */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={2.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Deep Blue Rim Light - cinematic automotive accent */}
      <directionalLight
        position={[-7, 5, -5]}
        intensity={2.8}
        color="#2563eb"
      />

      {/* Cyan Fill Light from front low */}
      <directionalLight
        position={[2, 3, -6]}
        intensity={1.2}
        color="#38bdf8"
      />

      {/* Under-chassis soft neon glow */}
      <pointLight position={[0, 0.1, 0]} intensity={2.0} color="#1d4ed8" distance={6} />
      <pointLight position={[1.5, 0.8, -1.5]} intensity={1.5} color="#60a5fa" distance={5} />

      {/* Studio Floor Soft Circular Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#050811"
          roughness={0.25}
          metalness={0.8}
          dithering
        />
      </mesh>

      {/* Subtle Circular Studio Stage Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[3.2, 3.25, 64]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[3.5, 3.52, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
