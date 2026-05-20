"use client";

import { useRef, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  count: number;
  accent: string;
}

export default function TrophyShelf({ position, count, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const centerTrophyRef = useRef<THREE.Group>(null);
  const leftMedalRef = useRef<THREE.Group>(null);
  const rightPlaqueRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Slow rotational float for the trophies
    if (centerTrophyRef.current) {
      // In scroll mode / active, shift center trophy forward and make it rotate slightly
      const targetZ = isActive ? 0.24 : 0;
      const targetY = 0.9 + Math.sin(time * 2.5) * 0.04;
      
      centerTrophyRef.current.position.z += (targetZ - centerTrophyRef.current.position.z) * delta * 5;
      centerTrophyRef.current.position.y += (targetY - centerTrophyRef.current.position.y) * delta * 5;
      centerTrophyRef.current.rotation.y += delta * 0.45;
    }

    if (leftMedalRef.current) {
      leftMedalRef.current.position.y = 0.95 + Math.cos(time * 2.0) * 0.025;
      leftMedalRef.current.rotation.y = Math.sin(time * 1.5) * 0.15;
    }

    if (rightPlaqueRef.current) {
      rightPlaqueRef.current.position.y = 0.92 + Math.sin(time * 1.8) * 0.02;
    }
  });

  return (
    <InteractiveGroup id="achievements" position={position}>
      {/* 1. Sleek Floating Dark Glass Shelf */}
      <mesh receiveShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[2.2, 0.06, 0.7]} />
        <meshStandardMaterial
          color="#060919"
          emissive="#101530"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Shelf Rim Glow */}
      <mesh position={[0, 0.6, 0.36]}>
        <boxGeometry args={[2.22, 0.015, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      {/* Brackets */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} castShadow>
          <boxGeometry args={[0.04, 0.6, 0.6]} />
          <meshStandardMaterial color="#1a1e3a" metalness={0.6} />
        </mesh>
      ))}

      {/* 2. Main Center Trophy Cup */}
      <group ref={centerTrophyRef} position={[0, 0.9, 0]}>
        {/* Trophy Pedestal Base */}
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.4} />
        </mesh>
        {/* Trophy Stem */}
        <mesh castShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Trophy Bowl (Cut Sphere) */}
        <mesh castShadow position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#b45309"
            emissiveIntensity={isActive ? 0.6 : 0.1}
            metalness={0.95}
            roughness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Trophy Left Handle */}
        <mesh position={[-0.12, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[0.055, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Trophy Right Handle */}
        <mesh position={[0.12, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <torusGeometry args={[0.055, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Emissive center glow orb inside cup */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#fff" transparent opacity={isActive ? 0.8 : 0.1} />
        </mesh>

        {/* Trophy Label */}
        <Html transform position={[0, 0.3, 0]} distanceFactor={3.2} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[7px] font-bold text-amber-300 uppercase tracking-widest text-center whitespace-nowrap">
            Honor Core
          </div>
        </Html>
      </group>

      {/* 3. Left Hanging Medal */}
      <group ref={leftMedalRef} position={[-0.6, 0.95, 0.05]}>
        {/* Hanging Stand */}
        <mesh position={[0, 0.02, -0.05]} castShadow>
          <boxGeometry args={[0.08, 0.38, 0.04]} />
          <meshStandardMaterial color="#1a1e3a" />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>

        {/* V-Shape Ribbon */}
        <mesh position={[-0.025, 0.1, 0]} rotation={[0, 0, -Math.PI / 12]}>
          <boxGeometry args={[0.03, 0.16, 0.005]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.025, 0.1, 0]} rotation={[0, 0, Math.PI / 12]}>
          <boxGeometry args={[0.03, 0.16, 0.005]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>

        {/* Medal Disk */}
        <mesh castShadow position={[0, 0.01, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.012, 32]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Inner Gold Star */}
        <mesh position={[0, 0.01, 0.018]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.005, 5]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>

        {/* Medal Label */}
        <Html transform position={[0, -0.15, 0]} distanceFactor={3.2} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/30 text-[7px] font-bold text-slate-300 uppercase tracking-widest text-center whitespace-nowrap">
            Achievement
          </div>
        </Html>
      </group>

      {/* 4. Right Glass Achievement Plaque */}
      <group ref={rightPlaqueRef} position={[0.6, 0.92, 0.05]} rotation={[0, -Math.PI / 12, 0]}>
        {/* Plaque Base */}
        <mesh castShadow position={[0, -0.12, 0]}>
          <boxGeometry args={[0.26, 0.03, 0.14]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </mesh>
        {/* Wooden Backing */}
        <mesh castShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[0.22, 0.28, 0.02]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} />
        </mesh>
        {/* Golden Frontplate */}
        <mesh position={[0, 0.05, 0.014]}>
          <boxGeometry args={[0.18, 0.24, 0.01]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Plaque Label */}
        <Html transform position={[0, 0.22, 0.02]} distanceFactor={3.2} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[7px] font-bold text-cyan-300 uppercase tracking-widest text-center whitespace-nowrap">
            Plaque
          </div>
        </Html>
      </group>

      <SectionLabel title="RECOGNITION" subtitle={`${count}`} accent={accent} position={[0, 1.8, 0]} />
    </InteractiveGroup>
  );
}
