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

export default function MobileDevZone({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  return (
    <InteractiveGroup id="mobile" position={position}>
      {/* 1. Base Console Desk */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.0, 0.05, 1.0]} />
        <meshStandardMaterial color="#0c0f1f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.395, 0]}>
        <boxGeometry args={[1.96, 0.005, 0.96]} />
        <meshStandardMaterial color={accent} wireframe />
      </mesh>

      {/* 2. Left Device: Landscape Tablet on Cradle */}
      <group position={[-0.6, 0.38, 0.1]} rotation={[0, Math.PI / 10, 0]}>
        {/* Metal stand */}
        <mesh position={[0, 0.06, -0.06]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.1]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} />
        </mesh>
        {/* Tablet Chassis */}
        <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 18, 0, 0]} castShadow>
          <boxGeometry args={[0.62, 0.42, 0.02]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.22, 0.012]} rotation={[-Math.PI / 18, 0, 0]}>
          <boxGeometry args={[0.58, 0.38, 0.005]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.12} />
        </mesh>
        {/* Tablet Screen HTML */}
        <Html transform position={[0, 0.22, 0.018]} rotation={[-Math.PI / 18, 0, 0]} distanceFactor={1.35} style={{ pointerEvents: "none" }}>
          <div className="w-[85px] h-[55px] p-1 flex flex-col justify-between font-sans text-white bg-slate-950/85 select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-1 text-[4px] font-bold text-cyan-300">
              <span>TABLET PORTAL v2.1</span>
              <span>BATTERY: 98%</span>
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              <div className="h-6 rounded bg-slate-800 flex items-center justify-center text-[4px] font-bold text-cyan-400">Charts</div>
              <div className="h-6 rounded bg-slate-800 flex items-center justify-center text-[4px] font-bold text-cyan-400">API Logs</div>
              <div className="h-6 rounded bg-slate-800 flex items-center justify-center text-[4px] font-bold text-cyan-400">Settings</div>
            </div>
            <div className="text-[3px] text-white/30 text-right mt-1">REACTIVE CORE v18.3</div>
          </div>
        </Html>
      </group>

      {/* 3. Center Device: Portrait Smartphone on Angled Dock */}
      <group position={[0, 0.38, 0.15]}>
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
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.15} />
        </mesh>
        {/* Smartphone Screen HTML */}
        <Html transform position={[0, 0.24, 0.016]} distanceFactor={1.38} style={{ pointerEvents: "none" }}>
          <div className="w-[45px] h-[95px] p-1.5 flex flex-col justify-between font-sans select-none text-white/80 bg-slate-950/85">
            <div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mx-auto mb-1" />
              <div className="h-1.5 rounded bg-cyan-500/25 mb-1" />
              <div className="h-10 rounded bg-cyan-500/10 mb-1 border border-cyan-500/25 flex flex-col justify-center items-center">
                <span className="text-[3px] text-cyan-300 font-bold">MOBILE TESTER</span>
                <span className="text-[2px] text-white/50">BUILD 94 SUCCESS</span>
              </div>
              <div className="h-4 rounded bg-slate-900 border border-white/5" />
            </div>
            <div className="h-2 rounded bg-slate-800" />
          </div>
        </Html>
      </group>

      {/* 4. Right Device: Slanted Smartphone */}
      <group position={[0.6, 0.38, 0.1]} rotation={[0, -Math.PI / 10, 0]}>
        {/* Metal stand */}
        <mesh position={[0, 0.06, -0.06]} castShadow>
          <boxGeometry args={[0.06, 0.12, 0.1]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} />
        </mesh>
        {/* Smartphone Chassis */}
        <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 18, 0, 0]} castShadow>
          <boxGeometry args={[0.24, 0.5, 0.02]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.24, 0.012]} rotation={[-Math.PI / 18, 0, 0]}>
          <boxGeometry args={[0.21, 0.47, 0.005]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.12} />
        </mesh>
        {/* Smartphone Screen HTML */}
        <Html transform position={[0, 0.24, 0.018]} rotation={[-Math.PI / 18, 0, 0]} distanceFactor={1.3} style={{ pointerEvents: "none" }}>
          <div className="w-[43px] h-[90px] p-1 flex flex-col justify-between font-mono text-emerald-400 bg-slate-950/85 select-none leading-tight">
            <div>
              <div className="text-[3px] border-b border-emerald-500/20 pb-0.5 mb-1 text-white">swiftui_preview.swift</div>
              <div className="text-[2.5px] opacity-80">struct ContentView: View &#123;</div>
              <div className="text-[2.5px] pl-1.5 opacity-80">var body: some View &#123;</div>
              <div className="text-[2.5px] pl-3 text-cyan-400">VStack &#123;</div>
              <div className="text-[2.5px] pl-4.5 opacity-80">Text("Mobile Lab")</div>
              <div className="text-[2.5px] pl-3 opacity-80">&#125;</div>
              <div className="text-[2.5px] pl-1.5 opacity-80">&#125;</div>
              <div className="text-[2.5px] opacity-80">&#125;</div>
            </div>
            <div className="text-[2px] text-white/30 text-right">COMPILE STATUS: OK</div>
          </div>
        </Html>
      </group>

      <SectionLabel title="MOBILE APPLICATION LAB" accent={accent} position={[0, 2.0, 0]} />
    </InteractiveGroup>
  );
}
