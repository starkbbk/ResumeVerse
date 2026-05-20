"use client";

import { useRef, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function DatabaseZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const groupRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Rotate database cluster slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }

    // Animate query pulses up the data lines
    if (pulsesRef.current && isActive) {
      pulsesRef.current.children.forEach((pulse, idx) => {
        // Pulse goes from bottom y = 0.1 to top y = 0.9, then resets
        const progress = ((time * 1.2 + idx * 0.3) % 0.8) / 0.8;
        pulse.position.y = 0.1 + progress * 0.8;
        
        // Pulse glow scales slightly
        const scale = 0.7 + Math.sin(time * 8.0 + idx) * 0.3;
        pulse.scale.set(scale, scale, scale);
      });
    }
  });

  // Three database cluster coordinates (triangle layout)
  const silos = [
    { x: -0.4, z: -0.25, color: "#f97316" },
    { x: 0.4, z: -0.25, color: "#f97316" },
    { x: 0, z: 0.45, color: "#06b6d4" },
  ];

  return (
    <InteractiveGroup id="database" position={position}>
      {/* 1. Base Platform */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 24]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.012, 8, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.0} />
      </mesh>

      {/* 2. Database Silo Cluster */}
      <group ref={groupRef} position={[0, 0.08, 0]}>
        {silos.map((s, idx) => (
          <group key={idx} position={[s.x, 0, s.z]}>
            {/* Silo segmented chambers */}
            {[0.16, 0.46, 0.76].map((y, sidx) => (
              <mesh key={sidx} position={[0, y, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.22, 16]} />
                <meshStandardMaterial color="#0f132a" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}

            {/* Glowing neon rings separating chambers */}
            {[0.31, 0.61].map((y, ridx) => (
              <mesh key={ridx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.225, 0.015, 8, 32]} />
                <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={isActive ? 1.4 : 0.3} />
              </mesh>
            ))}

            {/* Top dome cap */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <sphereGeometry args={[0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#1a202c" metalness={0.9} />
            </mesh>
            {/* Top Indicator light */}
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.024, 8, 8]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={1.5} />
            </mesh>
          </group>
        ))}

        {/* 3. Vertical Data Lines & Pulse Queries */}
        {/* We place vertical glowing cables behind/around the database silos */}
        {[-0.2, 0.2, 0].map((xOffset, lidx) => {
          const zOffset = lidx === 2 ? -0.4 : 0.2;
          return (
            <group key={lidx} position={[xOffset, 0, zOffset]}>
              {/* Cable line */}
              <mesh>
                <cylinderGeometry args={[0.008, 0.008, 0.9, 6]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Query pulses group (stays aligned in global space coordinates relative to cluster) */}
      <group ref={pulsesRef} position={[0, 0.08, 0]}>
        {silos.map((s, idx) => (
          <mesh key={idx} position={[s.x + 0.28, 0.1, s.z]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={s.color} transparent opacity={isActive ? 0.95 : 0.1} />
          </mesh>
        ))}
      </group>

      <SectionLabel title="DATABASE STORAGE" accent={accent} position={[0, 1.7, 0]} />
    </InteractiveGroup>
  );
}
