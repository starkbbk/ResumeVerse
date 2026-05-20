"use client";

import { useMemo, useRef, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedHologramPedestal from "../objects/DetailedHologramPedestal";
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
}

const RING_CATEGORIES: RingCategory[] = [
  { key: "languages", label: "Languages", tilt: [0, 0, 0], radius: 0.85, color: "#22d3ee" },
  { key: "frontend", label: "Frontend", tilt: [Math.PI / 4, 0, 0], radius: 1.1, color: "#ec4899" },
  { key: "backend", label: "Backend", tilt: [-Math.PI / 4, 0, Math.PI / 6], radius: 1.35, color: "#34d399" },
  { key: "aiMl", label: "AI / ML", tilt: [Math.PI / 3, Math.PI / 6, 0], radius: 1.55, color: "#a78bfa" },
  { key: "databases", label: "Databases", tilt: [-Math.PI / 3, 0, Math.PI / 4], radius: 1.75, color: "#fb923c" },
  { key: "devops", label: "DevOps", tilt: [0, Math.PI / 3, Math.PI / 4], radius: 1.95, color: "#60a5fa" },
];

export default function SkillHologram({ position, skills, accent, secondary }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const coreInner = useRef<THREE.Mesh>(null);
  const coreOuter = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (coreInner.current) {
      coreInner.current.rotation.y += delta * 0.6;
      coreInner.current.rotation.x += delta * 0.25;
    }
    if (coreOuter.current) {
      coreOuter.current.rotation.y -= delta * 0.4;
      coreOuter.current.rotation.z -= delta * 0.3;
    }
    if (orbitRef.current) orbitRef.current.rotation.y += delta * 0.07;
  });

  const activeRings = useMemo(
    () => RING_CATEGORIES.filter((r) => (skills[r.key] as string[] || []).length > 0),
    [skills],
  );

  return (
    <InteractiveGroup id="skills" position={position}>
      <DetailedHologramPedestal accent={accent} />

      {/* Reactor core */}
      <group position={[0, 2.2, 0]}>
        <mesh ref={coreInner} castShadow>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.6}
            metalness={0.7}
            roughness={0.15}
            wireframe
          />
        </mesh>
        <mesh ref={coreOuter}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Orbital tech rings */}
      <group ref={orbitRef} position={[0, 2.2, 0]}>
        {activeRings.map((ring) => {
          const list = (skills[ring.key] as string[]) || [];
          return (
            <group key={ring.key} rotation={ring.tilt}>
              <mesh>
                <torusGeometry args={[ring.radius, 0.012, 8, 96]} />
                <meshStandardMaterial
                  color={ring.color}
                  emissive={ring.color}
                  emissiveIntensity={isActive ? 1.4 : 0.4}
                  transparent
                  opacity={isActive ? 0.9 : 0.35}
                />
              </mesh>

              {/* Ring label sticker */}
              <Html
                transform
                position={[ring.radius, 0, 0]}
                distanceFactor={5.5}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border whitespace-nowrap"
                  style={{
                    background: "rgba(8,10,24,0.85)",
                    color: ring.color,
                    borderColor: `${ring.color}66`,
                    boxShadow: `0 0 10px ${ring.color}55`,
                    opacity: isActive ? 1 : 0.4,
                  }}
                >
                  {ring.label}
                </div>
              </Html>

              {/* Skill chips orbiting on the ring */}
              {list.slice(0, 6).map((skill, si) => {
                const angle = (si / 6) * Math.PI * 2 + ring.radius;
                const x = Math.cos(angle) * ring.radius;
                const z = Math.sin(angle) * ring.radius;
                return (
                  <group key={skill} position={[x, 0, z]}>
                    {/* Tiny orb anchor */}
                    <mesh>
                      <sphereGeometry args={[0.024, 12, 12]} />
                      <meshStandardMaterial
                        color={ring.color}
                        emissive={ring.color}
                        emissiveIntensity={1.4}
                      />
                    </mesh>
                    <Html
                      transform
                      position={[0, 0.07, 0]}
                      distanceFactor={5}
                      style={{ pointerEvents: "none" }}
                    >
                      <div
                        className="px-2 py-0.5 rounded-full text-[8px] font-semibold text-white border whitespace-nowrap"
                        style={{
                          background: "rgba(8,10,24,0.78)",
                          borderColor: "rgba(255,255,255,0.12)",
                          boxShadow: `0 2px 8px rgba(0,0,0,0.5)`,
                          opacity: isActive ? 0.9 : 0,
                        }}
                      >
                        {skill}
                      </div>
                    </Html>
                  </group>
                );
              })}
            </group>
          );
        })}
      </group>

      <SectionLabel title="SKILL REACTOR" accent={accent} position={[0, 4.4, 0]} />
    </InteractiveGroup>
  );
}
