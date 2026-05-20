"use client";

import { useRef, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function CyberSecurityZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const shieldRef = useRef<THREE.Mesh>(null);
  const lockRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Rotate shield dome and padlock
    if (shieldRef.current) {
      shieldRef.current.rotation.y += delta * 0.25;
    }
    if (lockRef.current) {
      lockRef.current.rotation.y -= delta * 0.4;
      // bobble padlock slightly
      lockRef.current.position.y = 0.54 + Math.sin(time * 2.0) * 0.03;
    }

    // Animate scanner line up/down
    if (scanLineRef.current) {
      scanLineRef.current.position.y = 0.54 + Math.sin(time * 3.0) * 0.2;
    }
  });

  return (
    <InteractiveGroup id="cybersecurity" position={position}>
      {/* 1. Base Platform */}
      <mesh receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.2, 0.08, 1.1]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.395, 0]}>
        <boxGeometry args={[2.16, 0.01, 1.06]} />
        <meshStandardMaterial color="#ef4444" wireframe />
      </mesh>

      {/* 2. Shield Dome & 3D Padlock Scanner */}
      <group position={[0, 0, 0.15]}>
        {/* Hemisphere Shield Dome */}
        <mesh ref={shieldRef} position={[0, 0.38, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={isActive ? 1.0 : 0.2}
            wireframe
            transparent
            opacity={isActive ? 0.65 : 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Scan line inside dome */}
        <mesh ref={scanLineRef} position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.01, 16, 1, true]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={isActive ? 0.8 : 0.05} side={THREE.DoubleSide} />
        </mesh>

        {/* 3D Padlock inside Shield */}
        <group ref={lockRef} position={[0, 0.54, 0]}>
          {/* Lock Body */}
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.14, 0.06]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Shackle (Torus) */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.065, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Lock Hole (Keyhole) */}
          <mesh position={[0, -0.01, 0.032]}>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          <mesh position={[0, -0.04, 0.032]}>
            <boxGeometry args={[0.01, 0.04, 0.01]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      </group>

      {/* 3. Threat Warning / Security Dashboard Monitor */}
      <group position={[0, 0.4, -0.3]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
          <meshStandardMaterial color="#1a1e3a" />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.62, 0.36, 0.03]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.32, 0.016]}>
          <boxGeometry args={[0.58, 0.32, 0.005]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
        </mesh>
        <Html transform position={[0, 0.32, 0.02]} distanceFactor={1.35} style={{ pointerEvents: "none" }}>
          <div className="w-[120px] p-2 font-mono text-[5px] text-red-400 leading-normal select-none">
            <div className="font-bold border-b border-red-500/20 pb-0.5 mb-1 text-white flex items-center justify-between">
              <span>CYBER SENTINEL v1.0</span>
              <span className="text-[4px] bg-red-950 px-1 py-0.2 rounded border border-red-500/30">SHIELD ENABLED</span>
            </div>
            <div>FIREWALL: ENGAGED</div>
            <div>STATUS: SECURED</div>
            <div className="text-emerald-400 font-semibold">ATTACKS BLOCKED: 1,429</div>
            <div className="opacity-60 truncate">IP: 185.220.101.4</div>
          </div>
        </Html>
      </group>

      <SectionLabel title="SECURITY CONTROL" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
