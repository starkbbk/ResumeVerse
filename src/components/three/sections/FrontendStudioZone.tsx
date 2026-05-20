"use client";

import { useContext } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  accent: string;
}

const SWATCH_COLORS = ["#22d3ee", "#ec4899", "#a78bfa", "#f59e0b", "#34d399"];

export default function FrontendStudioZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  return (
    <InteractiveGroup id="frontend-studio" position={position}>
      {/* 1. Wood Desk Base Workspace */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.6, 0.05, 1.2]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 2. Curved Ultra-Wide Designer Monitor */}
      <group position={[0, 0.38, -0.3]}>
        {/* Support Stand */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.04]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.01, 0.06]} castShadow>
          <boxGeometry args={[0.34, 0.02, 0.22]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>

        {/* Wide Screen Frame */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.6, 0.72, 0.03]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing Screen display */}
        <mesh position={[0, 0.5, 0.016]}>
          <boxGeometry args={[1.56, 0.68, 0.005]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.12} />
        </mesh>

        {/* HTML Mock UI workspace */}
        <Html transform position={[0, 0.5, 0.02]} distanceFactor={1.9} style={{ pointerEvents: "none" }}>
          <div
            className="w-[200px] h-[92px] rounded p-2 text-left flex flex-col justify-between border border-white/5 font-sans select-none"
            style={{
              background: "rgba(6, 8, 24, 0.8)",
              opacity: isActive ? 1 : 0.25,
            }}
          >
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                <span className="w-1 h-1 rounded-full bg-yellow-500" />
                <span className="w-1 h-1 rounded-full bg-green-500" />
                <span className="text-[5px] text-white/40 ml-1 font-mono">responsive_preview.html</span>
              </div>
              <div className="h-3 w-1/3 rounded bg-cyan-500/20 border border-cyan-400/20 mb-2" />
              <div className="grid grid-cols-4 gap-1">
                <div className="h-6 rounded bg-pink-500/20 border border-pink-400/20 flex items-center justify-center text-[5px] text-pink-300">Hero</div>
                <div className="h-6 rounded bg-purple-500/20 border border-purple-400/20 flex items-center justify-center text-[5px] text-purple-300">Grid</div>
                <div className="h-6 rounded bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center text-[5px] text-emerald-300">Form</div>
                <div className="h-6 rounded bg-blue-500/20 border border-blue-400/20 flex items-center justify-center text-[5px] text-blue-300">Tabs</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[4.5px] text-white/40 border-t border-white/5 pt-1 mt-1 font-mono">
              <span>W: 1920px | H: 1080px</span>
              <span>GRID: FLEXBOX</span>
            </div>
          </div>
        </Html>
      </group>

      {/* 3. Detailed Smartphone Preview Dock */}
      <group position={[0.9, 0.38, 0.25]} rotation={[0, -Math.PI / 8, 0]}>
        {/* Metal Cradle stand */}
        <mesh position={[0, 0.08, -0.05]} castShadow>
          <boxGeometry args={[0.06, 0.16, 0.12]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} />
        </mesh>
        {/* Smartphone Chassis */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[0.26, 0.54, 0.024]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.24, 0.013]}>
          <boxGeometry args={[0.23, 0.51, 0.005]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.15} />
        </mesh>

        {/* Smartphone Screen UI */}
        <Html transform position={[0, 0.24, 0.016]} distanceFactor={1.38} style={{ pointerEvents: "none" }}>
          <div className="w-[45px] h-[95px] p-1 flex flex-col justify-between font-sans select-none text-white/80 bg-slate-950/80">
            <div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mx-auto mb-1" />
              <div className="h-1.5 rounded bg-pink-500/30 mb-1" />
              <div className="h-10 rounded bg-cyan-500/20 mb-1" />
              <div className="h-4 rounded bg-purple-500/20" />
            </div>
            <div className="h-2 rounded bg-slate-800" />
          </div>
        </Html>
      </group>

      {/* 4. Standing Neon Color Swatch Stand */}
      <group position={[-0.95, 0.38, 0.2]} rotation={[0, Math.PI / 10, 0]}>
        {/* Stand Base */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.02, 12]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
        {/* Stand rod */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        
        {/* Glowing Swatch Plates */}
        {SWATCH_COLORS.map((c, i) => {
          const y = 0.08 + i * 0.08;
          const rotY = i * (Math.PI / 6);
          return (
            <mesh key={c} position={[0, y, 0]} rotation={[0, rotY, 0]}>
              <boxGeometry args={[0.14, 0.02, 0.08]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isActive ? 1.0 : 0.2} />
            </mesh>
          );
        })}
      </group>

      <SectionLabel title="FRONTEND DESIGN STUDIO" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
