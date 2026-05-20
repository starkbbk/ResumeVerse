"use client";

import { useMemo, useContext } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import type { ResumeProject } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  projects: ResumeProject[];
  accent: string;
}

export default function ProjectZone({ position, projects, accent }: Props) {
  const cards = useMemo(() => projects.slice(0, 3), [projects]);
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  // Render curved gallery table pedestal
  return (
    <InteractiveGroup id="projects" position={position}>
      {/* 1. Curved Table Platform */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[3.2, 0.08, 1.4]} />
        <meshStandardMaterial color="#0b0e21" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Glow path running along table edge */}
      <mesh position={[0, 0.445, 0.65]}>
        <boxGeometry args={[3.0, 0.01, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      
      {/* Table Legs */}
      {[
        [-1.4, 0.2, 0.5],
        [1.4, 0.2, 0.5],
        [-1.4, 0.2, -0.5],
        [1.4, 0.2, -0.5],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#1a1e3a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* 2. Curved Arc of Laptop Mockups */}
      {cards.map((p, i) => {
        // Curve formula: place laptops on a slight circle segment pointing inwards
        const spacing = 1.05;
        const offset = (i - (cards.length - 1) / 2) * spacing;
        const radius = 6;
        const x = offset;
        const z = -Math.pow(offset, 2) / (radius * 1.5); // curved depth
        const rotY = -offset / radius; // angle looking inwards

        return (
          <group key={`${p.name}-${i}`} position={[x, 0.44, z]} rotation={[0, rotY, 0]}>
            {/* Laptop Base (keyboard deck) */}
            <mesh castShadow position={[0, 0.02, 0.15]}>
              <boxGeometry args={[0.82, 0.03, 0.54]} />
              <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Keyboard outline */}
            <mesh position={[0, 0.036, 0.18]}>
              <boxGeometry args={[0.7, 0.005, 0.24]} />
              <meshStandardMaterial color="#0f1228" roughness={0.8} />
            </mesh>
            {/* Trackpad outline */}
            <mesh position={[0, 0.036, 0.35]}>
              <boxGeometry args={[0.22, 0.005, 0.1]} />
              <meshStandardMaterial color="#2d3748" roughness={0.4} />
            </mesh>

            {/* Laptop Screen Frame (open lid) */}
            <mesh
              castShadow
              position={[0, 0.28, -0.1]}
              rotation={[Math.PI / 18, 0, 0]}
            >
              <boxGeometry args={[0.82, 0.52, 0.025]} />
              <meshStandardMaterial color="#1a202c" metalness={0.85} roughness={0.25} />
            </mesh>

            {/* Laptop Screen Inner Display Panel (glowing screen area) */}
            <mesh
              position={[0, 0.28, -0.08]}
              rotation={[Math.PI / 18, 0, 0]}
            >
              <boxGeometry args={[0.78, 0.48, 0.01]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.06} roughness={0.1} />
            </mesh>

            {/* Transformed HTML screen content */}
            <Html
              transform
              position={[0, 0.28, -0.065]}
              rotation={[Math.PI / 18, 0, 0]}
              distanceFactor={1.72}
              style={{ pointerEvents: "auto" }}
            >
              <div
                className="w-[200px] h-[126px] rounded p-2 text-left border flex flex-col justify-between transition-all duration-300 ease-out select-none border-white/5"
                style={{
                  background: "rgba(6, 8, 24, 0.8)",
                  opacity: isActive ? 1 : 0.2,
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[6.5px] text-cyan-300/80 tracking-wider font-bold">
                      PROJECT TERMINAL
                    </span>
                    <div className="flex gap-1.5" style={{ pointerEvents: "auto" }}>
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[6.5px] text-white/60 hover:text-cyan-300 font-bold bg-white/5 hover:bg-white/10 px-1 py-0.2 rounded border border-white/10 transition-colors"
                        >
                          Code
                        </a>
                      )}
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[6.5px] text-white/60 hover:text-cyan-300 font-bold bg-white/5 hover:bg-white/10 px-1 py-0.2 rounded border border-white/10 transition-colors"
                        >
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                  <h4 className="text-[10.5px] font-bold text-white leading-tight mt-1 line-clamp-1">
                    {p.name}
                  </h4>
                  {p.description && (
                    <p className="text-[8px] text-white/60 line-clamp-2 mt-1 leading-snug">
                      {p.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-0.5 mt-1 overflow-hidden h-[30px] items-start">
                  {p.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[6px] text-white/40 bg-white/5 border border-white/5 px-1 py-0.5 rounded font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      <SectionLabel title="PROJECT SHOWCASE" subtitle={`${projects.length}`} accent={accent} position={[0, 2.4, 0]} />
    </InteractiveGroup>
  );
}
