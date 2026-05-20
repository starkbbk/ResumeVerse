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

export default function BackendServerZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const lightsRef = useRef<THREE.Group>(null);
  const pipeFlowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Blinking LEDs
    if (lightsRef.current && isActive) {
      lightsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = 0.4 + Math.sin(time * 6 + i * 1.5) * 0.6;
        }
      });
    }

    // Pipe pulse pulse flowing
    if (pipeFlowRef.current) {
      pipeFlowRef.current.position.x = Math.sin(time * 2.0) * 0.5;
    }
  });

  return (
    <InteractiveGroup id="backend-server" position={position}>
      {/* 1. Base platform */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 24]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 2. Dual Server Racks */}
      {[-0.65, 0.65].map((x) => (
        <group key={x} position={[x, 0.08, 0]}>
          {/* Server Outer Frame */}
          <mesh castShadow position={[0, 0.9, 0]}>
            <boxGeometry args={[0.55, 1.8, 0.45]} />
            <meshStandardMaterial color="#0f132a" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.57, 1.82, 0.46]} />
            <meshStandardMaterial color={accent} wireframe transparent opacity={0.15} />
          </mesh>

          {/* 5 Server Units inside rack */}
          {Array.from({ length: 5 }).map((_, i) => {
            const yOffset = 0.22 + i * 0.32;
            return (
              <group key={i} position={[0, yOffset, 0.02]}>
                {/* Unit Front Panel */}
                <mesh position={[0, 0, 0.21]}>
                  <boxGeometry args={[0.48, 0.22, 0.02]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.6} />
                </mesh>
                {/* Grille details */}
                <mesh position={[-0.05, 0, 0.222]}>
                  <boxGeometry args={[0.26, 0.08, 0.005]} />
                  <meshStandardMaterial color="#111827" />
                </mesh>
                {/* Metallic handles */}
                <mesh position={[-0.2, 0, 0.225]}>
                  <boxGeometry args={[0.015, 0.12, 0.02]} />
                  <meshStandardMaterial color="#9ca3af" metalness={0.9} />
                </mesh>
                <mesh position={[0.2, 0, 0.225]}>
                  <boxGeometry args={[0.015, 0.12, 0.02]} />
                  <meshStandardMaterial color="#9ca3af" metalness={0.9} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* 3. Blinking LED Lights */}
      <group ref={lightsRef}>
        {Array.from({ length: 10 }).map((_, i) => {
          const x = i % 2 === 0 ? -0.65 : 0.65;
          const y = 0.3 + Math.floor(i / 2) * 0.32;
          const z = 0.245;
          return (
            <mesh key={i} position={[x + 0.12, y, z]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#10b981" : "#3b82f6"}
                emissive={i % 2 === 0 ? "#10b981" : "#3b82f6"}
                emissiveIntensity={0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* 4. Horizontal Pipeline Connector */}
      <group position={[0, 1.3, -0.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        {/* Pulsing light flow on pipe */}
        <mesh ref={pipeFlowRef} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.15, 8]} />
          <meshBasicMaterial color="#34d399" transparent opacity={isActive ? 0.8 : 0.1} />
        </mesh>
      </group>

      {/* 5. Central Telemetry Log Screen */}
      <group position={[0, 0.44, 0.25]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color="#1a1e3a" />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.68, 0.42, 0.03]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.45, 0.016]}>
          <boxGeometry args={[0.64, 0.38, 0.005]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
        </mesh>
        <Html transform position={[0, 0.45, 0.02]} distanceFactor={1.32} style={{ pointerEvents: "none" }}>
          <div className="w-[130px] p-2 font-mono text-[5.5px] text-cyan-300 leading-normal select-none">
            <div className="font-bold border-b border-cyan-500/20 pb-0.5 mb-1 text-white">SERVER TELEMETRY //</div>
            <div className="text-emerald-400">GET /api/v1/projects 200 OK</div>
            <div className="text-blue-400">POST /api/auth/login 201 OK</div>
            <div className="text-amber-400">WARN: DB pool size 84%</div>
            <div>CPU: 18.5% | MEM: 4.2GB</div>
          </div>
        </Html>
      </group>

      <SectionLabel title="BACKEND INFRASTRUCTURE" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
