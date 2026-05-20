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

export default function DevOpsCloudZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const cloudGroupRef = useRef<THREE.Group>(null);
  const containerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Floating cloud motion
    if (cloudGroupRef.current) {
      cloudGroupRef.current.position.y = 1.45 + Math.sin(time * 1.2) * 0.06;
      cloudGroupRef.current.rotation.y += delta * 0.1;
    }

    // Animate container moving along pipeline rail from x = -0.9 to x = 0.9
    if (containerRef.current && isActive) {
      // cycle from 0 to 1 every 3 seconds
      const progress = (time % 3.0) / 3.0;
      containerRef.current.position.x = -0.9 + progress * 1.8;
      
      // Rotational spin when building
      containerRef.current.rotation.y = time * 4.0;
    }
  });

  return (
    <InteractiveGroup id="devops-cloud" position={position}>
      {/* 1. Base Console Platform */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.2, 0.08, 1.1]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.395, 0]}>
        <boxGeometry args={[2.16, 0.01, 1.06]} />
        <meshStandardMaterial color={accent} wireframe />
      </mesh>

      {/* 2. Pipeline Rail System */}
      <group position={[0, 0.44, 0.2]}>
        {/* Track rail */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 1.9, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        
        {/* Track End Supports */}
        {[-0.95, 0.95].map((x) => (
          <mesh key={x} position={[x, -0.05, 0]}>
            <boxGeometry args={[0.04, 0.1, 0.04]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}

        {/* Traveling Pipeline Container Cube */}
        <mesh ref={containerRef} position={[-0.9, 0.08, 0]} castShadow>
          <boxGeometry args={[0.13, 0.13, 0.13]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} wireframe />
        </mesh>
      </group>

      {/* 3. Floating Holographic Wireframe Cloud */}
      <group ref={cloudGroupRef} position={[0, 1.45, -0.15]}>
        <mesh>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.2} transparent opacity={0.65} wireframe />
        </mesh>
        <mesh position={[0.24, -0.05, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.2} transparent opacity={0.5} wireframe />
        </mesh>
        <mesh position={[-0.24, -0.05, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.2} transparent opacity={0.5} wireframe />
        </mesh>
      </group>

      {/* 4. Pipeline Status Monitor */}
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
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
        </mesh>
        <Html transform position={[0, 0.32, 0.02]} distanceFactor={1.35} style={{ pointerEvents: "none" }}>
          <div className="w-[120px] p-2 font-mono text-[5px] text-cyan-300 leading-normal select-none">
            <div className="font-bold border-b border-cyan-500/20 pb-0.5 mb-1 text-white">CI/CD PIPELINE STACK //</div>
            <div>[STG1] BUILD: SUCCESS</div>
            <div>[STG2] TEST: PASSED</div>
            <div className="text-emerald-400 font-bold blink">[STG3] DEPLOY: ACTIVE...</div>
            <div className="text-slate-400">TARGET: AWS EKS / DOCKER</div>
          </div>
        </Html>
      </group>

      <SectionLabel title="DEVOPS CLOUD DEPLOY" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
