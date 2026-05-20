"use client";

import { useContext } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  certifications: string[];
  accent: string;
}

export default function CertificationGallery({ position, certifications, accent }: Props) {
  const display = certifications.slice(0, 3);
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  // Stand layout configuration: left, center, right
  const stands = [
    { x: -0.75, z: 0.15, rotY: Math.PI / 10 },
    { x: 0, z: 0.0, rotY: 0 },
    { x: 0.75, z: 0.15, rotY: -Math.PI / 10 },
  ];

  return (
    <InteractiveGroup id="certifications" position={position} bobble={false}>
      {/* 1. Wood Desk Base Workspace */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.4, 0.05, 1.1]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.395, 0]}>
        <boxGeometry args={[2.36, 0.005, 1.06]} />
        <meshStandardMaterial color={accent} wireframe />
      </mesh>

      {/* 2. Standalone Museum Plaque Stands */}
      {display.map((c, i) => {
        const stand = stands[i] || stands[0];
        return (
          <group key={i} position={[stand.x, 0.38, stand.z]} rotation={[0, stand.rotY, 0]}>
            {/* Stand Base */}
            <mesh castShadow position={[0, 0.02, 0]}>
              <boxGeometry args={[0.24, 0.04, 0.24]} />
              <meshStandardMaterial color="#1a202c" />
            </mesh>
            {/* Support column */}
            <mesh castShadow position={[0, 0.3, 0]}>
              <boxGeometry args={[0.04, 0.6, 0.04]} />
              <meshStandardMaterial color="#475569" metalness={0.9} />
            </mesh>

            {/* Plaque Mount (Angled backwards) */}
            <group position={[0, 0.62, 0]} rotation={[-Math.PI / 10, 0, 0]}>
              {/* Plaque backboard */}
              <mesh castShadow>
                <boxGeometry args={[0.55, 0.38, 0.025]} />
                <meshStandardMaterial color="#1f2937" roughness={0.7} />
              </mesh>
              {/* Plaque glass front */}
              <mesh position={[0, 0, 0.015]}>
                <boxGeometry args={[0.51, 0.34, 0.005]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.25}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              {/* Glowing inner border */}
              <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[0.52, 0.35, 0.002]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={isActive ? 1.0 : 0.15} />
              </mesh>

              {/* Certificate Diploma Text */}
              <Html
                transform
                position={[0, 0, 0.016]}
                distanceFactor={1.32}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="w-[110px] h-[72px] p-2 flex flex-col justify-between items-center text-center font-serif text-white/95 select-none transition-all duration-500 ease-out"
                  style={{
                    background: "rgba(10, 12, 28, 0.8)",
                    opacity: isActive ? 1 : 0.2,
                  }}
                >
                  <div>
                    <div className="text-[4px] uppercase tracking-[0.2em] font-sans text-cyan-300 font-bold mb-0.5">
                      Certificate of Achievement
                    </div>
                    <div className="w-8 h-0.5 bg-cyan-500/30 mx-auto mb-1.5" />
                    <div className="text-[5.5px] font-bold leading-tight font-sans tracking-wide truncate max-w-[95px] text-white">
                      {c}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full text-[3.5px] font-sans text-white/40 mt-1 border-t border-white/5 pt-1">
                    <span>ISSUED BY VERIFIED</span>
                    <span>ID: 9482-A</span>
                  </div>
                </div>
              </Html>
            </group>
          </group>
        );
      })}

      <SectionLabel
        title="CREDENTIALS"
        subtitle={`${certifications.length}`}
        accent={accent}
        position={[0, 2.0, 0]}
      />
    </InteractiveGroup>
  );
}
