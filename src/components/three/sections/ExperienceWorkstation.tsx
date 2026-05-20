"use client";

import { useContext } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import type { ResumeExperience } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  experience: ResumeExperience[];
  accent: string;
}

export default function ExperienceWorkstation({ position, experience, accent }: Props) {
  const items = experience.slice(0, 3);
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  return (
    <InteractiveGroup id="experience" position={position}>
      {/* 1. Futuristic Dark Glass Desk */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.8, 0.06, 1.3]} />
        <meshStandardMaterial
          color="#060919"
          emissive="#101530"
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Desk Neon Border */}
      <mesh position={[0, 0.435, 0]}>
        <boxGeometry args={[2.76, 0.005, 1.26]} />
        <meshStandardMaterial color={accent} wireframe />
      </mesh>

      {/* Desk Leg Truss Supports */}
      {[
        [-1.2, 0.2, 0.45],
        [1.2, 0.2, 0.45],
        [-1.2, 0.2, -0.45],
        [1.2, 0.2, -0.45],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#1a1e3a" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 2. Timeline Rail */}
      <mesh position={[0, 0.44, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 2.2, 8]} />
        <meshStandardMaterial color="#fff" emissive={accent} emissiveIntensity={0.8} />
      </mesh>

      {/* 3. Workstation Monitor on Desk */}
      <group position={[0, 0.43, -0.3]}>
        {/* Stand */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.06]} />
          <meshStandardMaterial color="#11142a" />
        </mesh>
        {/* Monitor Screen Frame */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.9, 0.45, 0.03]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} />
        </mesh>
        {/* Glow Screen */}
        <mesh position={[0, 0.35, 0.016]}>
          <boxGeometry args={[0.86, 0.41, 0.005]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} transparent opacity={0.9} />
        </mesh>
        {/* Screen Console overlay */}
        <Html transform position={[0, 0.35, 0.02]} distanceFactor={1.5} style={{ pointerEvents: "none" }}>
          <div className="w-[180px] p-2 text-left font-mono text-[7px] text-cyan-300 select-none">
            <div className="border-b border-cyan-500/30 pb-1 mb-1 font-bold">SYSTEM WORKSTATION //</div>
            <div>STATUS: ONLINE</div>
            <div>JOBS RECOVERED: {experience.length}</div>
            <div className="mt-1 opacity-70">EXEC STACK DEPTH: OK</div>
          </div>
        </Html>
      </group>

      {/* 4. Timeline Nodes, Lasers, and Role Cards */}
      {items.map((e, i) => {
        const spacing = 0.85;
        const x = (i - (items.length - 1) / 2) * spacing;
        
        // Node coordinates
        const nodeY = 0.44;
        const nodeZ = 0.15;
        
        // Card coordinates
        const cardY = 1.35;
        const cardZ = 0.15;

        // Laser vector length
        const laserHeight = cardY - nodeY - 0.15;
        const laserY = nodeY + 0.08 + laserHeight / 2;

        return (
          <group key={i}>
            {/* Timeline Node Sphere */}
            <mesh position={[x, nodeY, nodeZ]} castShadow>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={isActive ? 1.5 : 0.4}
              />
            </mesh>

            {/* Glowing Neon Laser Connector Line */}
            <mesh position={[x, laserY, nodeZ]}>
              <cylinderGeometry args={[0.006, 0.006, laserHeight, 8]} />
              <meshBasicMaterial
                color={accent}
                transparent
                opacity={isActive ? 0.85 : 0.25}
              />
            </mesh>

            {/* Transformed Role Card */}
            <Html
              transform
              position={[x, cardY, cardZ]}
              distanceFactor={5.2}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="px-4 py-3 w-[170px] text-left rounded-xl backdrop-blur-sm border transition-all duration-500 ease-out select-none border-white/5"
                style={{
                  background: "rgba(6, 9, 25, 0.55)",
                  borderColor: `${accent}44`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
                  opacity: isActive ? 1 : 0.25,
                  transform: isActive ? "scale(1)" : "scale(0.85)",
                }}
              >
                <span className="text-[7.5px] uppercase tracking-[0.2em] text-cyan-300 font-bold">
                  EXPERIENCE
                </span>
                <p className="text-[11.5px] font-bold text-white leading-snug mt-1.5 line-clamp-1">
                  {e.role || "Developer"}
                </p>
                <p className="text-[10px] text-white/70 font-semibold mt-0.5 line-clamp-1">
                  {e.company}
                </p>
                {e.duration && (
                  <p className="text-[8px] text-cyan-300/70 mt-2 font-mono font-medium">
                    🗓️ {e.duration.toUpperCase()}
                  </p>
                )}
              </div>
            </Html>
          </group>
        );
      })}

      <SectionLabel title="WORK EXPERIENCE" subtitle={`${experience.length}`} accent={accent} position={[0, 2.5, 0]} />
    </InteractiveGroup>
  );
}
