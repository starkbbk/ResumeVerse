"use client";

import { useMemo, useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function DataVizZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const chartGroupRef = useRef<THREE.Group>(null);

  // Pre-calculated heights for glass bar charts
  const barHeights = useMemo(() => [0.35, 0.55, 0.75, 0.5, 0.9, 0.65], []);

  // Pre-calculated coordinates for zigzagging neon line graph
  const lineNodes = useMemo(() => [
    { pos: new THREE.Vector3(-0.85, 0.25, 0.25), color: "#22d3ee" },
    { pos: new THREE.Vector3(-0.55, 0.6, 0.15), color: "#22d3ee" },
    { pos: new THREE.Vector3(-0.25, 0.45, 0.05), color: "#22d3ee" },
    { pos: new THREE.Vector3(0.05, 0.85, -0.05), color: "#ec4899" },
    { pos: new THREE.Vector3(0.35, 0.7, -0.15), color: "#ec4899" },
    { pos: new THREE.Vector3(0.65, 1.15, -0.25), color: "#ec4899" },
  ], []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Pulse the bar cores emissive intensity
    if (chartGroupRef.current && isActive) {
      chartGroupRef.current.children.forEach((bar, idx) => {
        // Find internal core cylinder
        if (bar.children.length > 1) {
          const coreMat = (bar.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (coreMat) {
            coreMat.opacity = 0.4 + Math.sin(time * 5.0 + idx) * 0.4;
          }
        }
      });
    }
  });

  return (
    <InteractiveGroup id="dataviz" position={position}>
      {/* 1. Base Circular Podium */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 24]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.012, 8, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.0} />
      </mesh>

      {/* 2. Glass Bar Charts with Glowing Cores */}
      <group ref={chartGroupRef} position={[0, 0.08, 0]}>
        {barHeights.map((h, i) => {
          const x = -0.75 + i * 0.28;
          const z = 0.15 - i * 0.05;
          return (
            <group key={i} position={[x, h / 2, z]}>
              {/* Translucent Glass Outer Sleeve */}
              <mesh castShadow>
                <boxGeometry args={[0.16, h, 0.16]} />
                <meshStandardMaterial
                  color="#1e293b"
                  roughness={0.05}
                  metalness={0.9}
                  transparent
                  opacity={0.5}
                />
              </mesh>
              {/* Glowing Inner Core */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.08, h * 0.9, 0.08]} />
                <meshBasicMaterial color={accent} transparent opacity={0.6} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 3. Zigzagging Neon Line Graph */}
      <group position={[0, 0.08, 0]}>
        {/* Render node spheres */}
        {lineNodes.map((node, i) => (
          <mesh key={i} position={node.pos.toArray() as [number, number, number]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={node.color} />
          </mesh>
        ))}

        {/* Connect nodes with thin cylinders to build the line segments */}
        {Array.from({ length: lineNodes.length - 1 }).map((_, i) => {
          const start = lineNodes[i].pos;
          const end = lineNodes[i + 1].pos;
          const dist = start.distanceTo(end);
          const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

          // Calculate cylinder rotation to align with start-to-end vector
          const direction = new THREE.Vector3().subVectors(end, start).normalize();
          const alignVector = new THREE.Vector3(0, 1, 0);
          const quaternion = new THREE.Quaternion().setFromUnitVectors(alignVector, direction);

          return (
            <mesh
              key={i}
              position={midPoint.toArray() as [number, number, number]}
              quaternion={quaternion}
            >
              <cylinderGeometry args={[0.008, 0.008, dist, 6]} />
              <meshBasicMaterial color={lineNodes[i].color} transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* 4. Holographic Analytical Dashboard Screen */}
      <group position={[0, 0.4, -0.3]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.04, 0.44, 0.04]} />
          <meshStandardMaterial color="#1a1e3a" />
        </mesh>
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[0.66, 0.42, 0.03]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.44, 0.016]}>
          <boxGeometry args={[0.62, 0.38, 0.005]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
        </mesh>
        <Html transform position={[0, 0.44, 0.02]} distanceFactor={1.35} style={{ pointerEvents: "none" }}>
          <div className="w-[125px] p-2 font-sans text-[5.5px] text-cyan-300 leading-normal select-none">
            <div className="font-mono font-bold border-b border-cyan-500/20 pb-0.5 mb-1 text-white">ANALYTICS SYSTEM //</div>
            <div>SHIELD CONVERSION: +48.5%</div>
            <div>ACTIVE QUERIES: 342/s</div>
            <div className="text-emerald-400 font-bold">REVENUE PROGRESS: OK</div>
            <div className="text-slate-400">DATA SOURCE: SPARK / LOOKER</div>
          </div>
        </Html>
      </group>

      <SectionLabel title="DATA VISUALIZATION" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
