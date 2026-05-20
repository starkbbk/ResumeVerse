"use client";

import { useRef, useMemo, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function AiLabZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const neuralNetRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Rotate neural network web
    if (neuralNetRef.current) {
      neuralNetRef.current.rotation.y += delta * 0.3;
      neuralNetRef.current.rotation.x = Math.sin(time * 0.5) * 0.15;
    }
    // Pulsing core scale
    if (coreRef.current) {
      const scale = 1.0 + Math.sin(time * 3.5) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  // Calculate mathematical coordinates for a dodecahedron neural web
  const nodes = useMemo(() => {
    const phi = (1 + Math.sqrt(5)) / 2;
    return [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      [0, 1 / phi, phi], [0, 1 / phi, -phi], [0, -1 / phi, phi], [0, -1 / phi, -phi],
      [1 / phi, phi, 0], [1 / phi, -phi, 0], [-1 / phi, phi, 0], [-1 / phi, -phi, 0],
      [phi, 0, 1 / phi], [phi, 0, -1 / phi], [-phi, 0, 1 / phi], [-phi, 0, -1 / phi]
    ].map(([x, y, z]) => [x * 0.35, y * 0.35, z * 0.35] as [number, number, number]);
  }, []);

  return (
    <InteractiveGroup id="ai-lab" position={position}>
      {/* 1. Base Terminal platform */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 24]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.012, 8, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>

      {/* 2. Neural Net 3D Node Web */}
      <group ref={neuralNetRef} position={[0, 1.2, 0]}>
        {/* Wireframe dodecahedron links */}
        <mesh>
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={isActive ? 1.0 : 0.25}
            wireframe
          />
        </mesh>
        {/* Internal pulsing energy core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.16, 1]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.5} />
        </mesh>
        
        {/* Glowing node sphere on each vertex */}
        {nodes.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#22d3ee" : accent}
              emissive={idx % 2 === 0 ? "#22d3ee" : accent}
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
      </group>

      {/* 3. Training Screen Terminal Console */}
      <group position={[0.7, 0.44, 0.35]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#1a1e3a" />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <boxGeometry args={[0.55, 0.34, 0.03]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.36, 0.016]}>
          <boxGeometry args={[0.52, 0.3, 0.005]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
        </mesh>
        <Html transform position={[0, 0.36, 0.02]} distanceFactor={1.2} style={{ pointerEvents: "none" }}>
          <div className="w-[110px] p-1.5 font-mono text-[5.5px] text-cyan-300 leading-normal select-none">
            <div className="font-bold border-b border-cyan-500/20 pb-0.5 mb-1 text-white">NEURAL NETWORK TRAIN //</div>
            <div>EPOCH: 45 / 100</div>
            <div>LOSS: 0.0234</div>
            <div className="text-emerald-400">ACCURACY: 98.42%</div>
            <div className="opacity-60 truncate">OPTIMIZER: AdamW</div>
          </div>
        </Html>
      </group>

      {/* 4. Dataset Storage Server Cubes */}
      <group position={[-0.7, 0.09, 0.3]} rotation={[0, Math.PI / 12, 0]}>
        <mesh castShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[0.22, 0.2, 0.22]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0.112]}>
          <boxGeometry args={[0.16, 0.14, 0.01]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
        </mesh>
        <Html transform position={[0, 0.1, 0.12]} distanceFactor={1.2} style={{ pointerEvents: "none" }}>
          <div className="text-[5px] font-mono text-cyan-300 font-bold bg-black/60 px-1 py-0.2 rounded border border-cyan-400/20 whitespace-nowrap">
            DATASET_01
          </div>
        </Html>
      </group>

      <SectionLabel title="AI / ML LABORATORY" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
