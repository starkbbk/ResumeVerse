"use client";

import { useMemo, useRef, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import Pedestal from "../Pedestal";
import SectionLabel from "../SectionLabel";
import type { ResumeSkills } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  skills: ResumeSkills;
  accent: string;
  secondary: string;
}

interface RingCategory {
  key: keyof ResumeSkills;
  label: string;
  tilt: [number, number, number];
  radius: number;
  color: string;
  iconType: "code" | "browser" | "server" | "neural" | "database" | "container" | "gear";
}

const RING_CATEGORIES: RingCategory[] = [
  { key: "languages", label: "Languages", tilt: [0, 0, 0], radius: 0.95, color: "#22d3ee", iconType: "code" },
  { key: "frontend", label: "Frontend", tilt: [Math.PI / 4, 0, 0], radius: 1.25, color: "#ec4899", iconType: "browser" },
  { key: "backend", label: "Backend", tilt: [-Math.PI / 4, 0, Math.PI / 6], radius: 1.55, color: "#34d399", iconType: "server" },
  { key: "aiMl", label: "AI / ML", tilt: [Math.PI / 3, Math.PI / 6, 0], radius: 1.85, color: "#a78bfa", iconType: "neural" },
  { key: "databases", label: "Databases", tilt: [-Math.PI / 3, 0, Math.PI / 4], radius: 2.15, color: "#fb923c", iconType: "database" },
  { key: "devops", label: "DevOps", tilt: [0, Math.PI / 3, Math.PI / 4], radius: 2.45, color: "#60a5fa", iconType: "container" },
];

export default function SkillHologram({ position, skills, accent, secondary }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const coreRef1 = useRef<THREE.Mesh>(null);
  const coreRef2 = useRef<THREE.Mesh>(null);
  const reactorGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Rotate reactor core layers in opposite directions
    if (coreRef1.current) {
      coreRef1.current.rotation.y += delta * 0.6;
      coreRef1.current.rotation.x += delta * 0.25;
    }
    if (coreRef2.current) {
      coreRef2.current.rotation.y -= delta * 0.45;
      coreRef2.current.rotation.z -= delta * 0.3;
    }
    // General orbital rotation for rings and satelites
    if (reactorGroupRef.current) {
      reactorGroupRef.current.rotation.y += delta * 0.06;
    }
  });

  const activeRings = useMemo(
    () => RING_CATEGORIES.filter((r) => (skills[r.key] as string[] || []).length > 0),
    [skills],
  );

  return (
    <InteractiveGroup id="skills" position={position}>
      <Pedestal accent={accent} />

      {/* Reactor Energy Core */}
      <group position={[0, 1.1, 0]}>
        {/* Core Layer 1: Emissive Wireframe */}
        <mesh ref={coreRef1} castShadow>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.8}
            metalness={0.7}
            roughness={0.1}
            wireframe
          />
        </mesh>
        {/* Core Layer 2: Rotating Outer Cage */}
        <mesh ref={coreRef2}>
          <dodecahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Core Layer 3: Solid Pulsing Energy sphere */}
        <mesh>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
        {/* Ground light beam */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 1.0, 16, 1, true]} />
          <meshBasicMaterial color={accent} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Orbiting Tech Rings & Badges */}
      <group ref={reactorGroupRef} position={[0, 1.1, 0]}>
        {activeRings.map((ring, ri) => {
          const list = (skills[ring.key] as string[]) || [];
          return (
            <group key={ring.key} rotation={ring.tilt}>
              {/* 1. Orbit Ring path */}
              <mesh>
                <torusGeometry args={[ring.radius, 0.015, 8, 96]} />
                <meshStandardMaterial
                  color={ring.color}
                  emissive={ring.color}
                  emissiveIntensity={isActive ? 1.4 : 0.3}
                  transparent
                  opacity={isActive ? 0.95 : 0.3}
                />
              </mesh>

              {/* 2. Floating Category Tag */}
              <Html
                transform
                position={[ring.radius, 0, 0]}
                rotation={[0, 0, 0]}
                distanceFactor={5.5}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border text-center transition-all duration-300"
                  style={{
                    background: "rgba(10, 12, 28, 0.8)",
                    color: ring.color,
                    borderColor: `${ring.color}66`,
                    boxShadow: `0 0 8px ${ring.color}44`,
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  {ring.label}
                </div>
              </Html>

              {/* 3. Category Custom Geometric Mini-Model */}
              <group position={[0, 0, ring.radius]}>
                {ring.iconType === "code" && (
                  // Languages icon: Glowing Code Brackets tag
                  <Html transform distanceFactor={2.5}>
                    <div className="font-mono text-[10px] font-black text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-1 py-0.5 rounded select-none">
                      &lt;/&gt;
                    </div>
                  </Html>
                )}

                {ring.iconType === "browser" && (
                  // Frontend: Mini Browser Window
                  <group>
                    <mesh>
                      <boxGeometry args={[0.2, 0.14, 0.02]} />
                      <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} />
                    </mesh>
                    {/* Header bar */}
                    <mesh position={[0, 0.05, 0.012]}>
                      <boxGeometry args={[0.18, 0.03, 0.005]} />
                      <meshStandardMaterial color="#1a202c" />
                    </mesh>
                  </group>
                )}

                {ring.iconType === "server" && (
                  // Backend: Stacked Server Cylinders
                  <group>
                    {[0.05, 0, -0.05].map((yOffset, idx) => (
                      <mesh key={idx} position={[0, yOffset, 0]}>
                        <cylinderGeometry args={[0.07, 0.07, 0.03, 12]} />
                        <meshStandardMaterial
                          color="#34d399"
                          emissive={idx === 1 ? "#34d399" : undefined}
                          emissiveIntensity={0.8}
                          metalness={0.8}
                        />
                      </mesh>
                    ))}
                  </group>
                )}

                {ring.iconType === "neural" && (
                  // AI/ML: Neural Nodes connected
                  <group>
                    <mesh position={[0, 0.06, 0]}>
                      <sphereGeometry args={[0.035, 8, 8]} />
                      <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1.2} />
                    </mesh>
                    <mesh position={[-0.05, -0.04, 0]}>
                      <sphereGeometry args={[0.025, 8, 8]} />
                      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} />
                    </mesh>
                    <mesh position={[0.05, -0.04, 0]}>
                      <sphereGeometry args={[0.025, 8, 8]} />
                      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} />
                    </mesh>
                  </group>
                )}

                {ring.iconType === "database" && (
                  // Database: Storage Silo
                  <mesh>
                    <cylinderGeometry args={[0.06, 0.06, 0.14, 12]} />
                    <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
                  </mesh>
                )}

                {ring.iconType === "container" && (
                  // DevOps: Wireframe container cube
                  <mesh>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1.0} wireframe />
                  </mesh>
                )}
              </group>

              {/* 4. Orbiting Skill Badges (up to 5 per category) */}
              {list.slice(0, 5).map((skill, si) => {
                const angle = (si / 5) * Math.PI * 2 + ri; // staggered angle
                const x = Math.cos(angle) * ring.radius;
                const z = Math.sin(angle) * ring.radius;
                return (
                  <Html
                    key={skill}
                    transform
                    position={[x, 0, z]}
                    distanceFactor={5.5}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      className="px-2 py-0.5 rounded-full text-[8px] font-semibold text-white/95 border transition-all duration-300"
                      style={{
                        background: "rgba(10, 12, 28, 0.65)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        boxShadow: `0 2px 8px rgba(0,0,0,0.5)`,
                        opacity: isActive ? 0.85 : 0,
                      }}
                    >
                      {skill}
                    </div>
                  </Html>
                );
              })}
            </group>
          );
        })}
      </group>

      <SectionLabel title="SKILL REACTOR" accent={accent} position={[0, 2.9, 0]} />
    </InteractiveGroup>
  );
}
