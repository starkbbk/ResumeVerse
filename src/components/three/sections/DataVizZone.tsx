"use client";

import { useContext, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedMonitor from "../objects/DetailedMonitor";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function DataVizZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const barRefs = useRef<THREE.Mesh[]>([]);
  const baseHeights = useMemo(() => [0.35, 0.55, 0.78, 0.5, 0.92, 0.65], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    barRefs.current.forEach((m, i) => {
      if (!m) return;
      const target = baseHeights[i] + (isActive ? Math.sin(t * 1.5 + i) * 0.08 : 0);
      m.scale.y = THREE.MathUtils.lerp(m.scale.y, target / baseHeights[i], 0.12);
    });
  });

  const screen = (
    <div className="w-full h-full p-2 text-white">
      <div className="flex items-center justify-between border-b border-cyan-400/30 pb-1 mb-1">
        <span className="font-mono text-[7px] tracking-widest font-bold text-cyan-200">
          ANALYTICS
        </span>
        <span className="font-mono text-[6px] text-emerald-300">LIVE · 12k/s</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="rounded bg-cyan-500/12 border border-cyan-400/30 p-1">
          <div className="text-[5px] uppercase opacity-70">CONVERSION</div>
          <div className="text-[10px] font-bold text-cyan-200">+48.5%</div>
        </div>
        <div className="rounded bg-emerald-500/12 border border-emerald-400/30 p-1">
          <div className="text-[5px] uppercase opacity-70">REVENUE</div>
          <div className="text-[10px] font-bold text-emerald-200">$2.4M</div>
        </div>
        <div className="col-span-2 rounded bg-purple-500/12 border border-purple-400/30 p-1">
          <div className="text-[5px] uppercase opacity-70 mb-0.5">TRAFFIC</div>
          <div className="h-3 flex items-end gap-0.5">
            {[3, 5, 4, 6, 5, 7, 8, 6, 9, 7, 8, 10].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-purple-400/60"
                style={{ height: `${h * 8}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="dataviz" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.6} depth={1.2} accent={accent} />} />

      {/* 3D bar chart on top of the desk */}
      <group position={[0, 0.89, 0.05]}>
        {baseHeights.map((h, i) => {
          const x = -0.6 + i * 0.24;
          return (
            <group key={i} position={[x, h / 2, 0]}>
              {/* glass outer */}
              <mesh
                ref={(el) => {
                  if (el) barRefs.current[i] = el;
                }}
                castShadow
              >
                <boxGeometry args={[0.16, h, 0.16]} />
                <meshStandardMaterial
                  color="#1a1f33"
                  metalness={0.85}
                  roughness={0.1}
                  transparent
                  opacity={0.55}
                />
              </mesh>
              {/* glowing core */}
              <mesh>
                <boxGeometry args={[0.085, h * 0.94, 0.085]} />
                <meshStandardMaterial
                  color={accent}
                  emissive={accent}
                  emissiveIntensity={isActive ? 1.4 : 0.5}
                />
              </mesh>
              {/* metric label */}
              <Html
                transform
                position={[0, h / 2 + 0.05, 0]}
                distanceFactor={3}
                style={{ pointerEvents: "none" }}
              >
                <span className="text-[6px] font-mono font-bold text-cyan-200 bg-black/55 px-1 rounded whitespace-nowrap">
                  {(h * 100).toFixed(0)}%
                </span>
              </Html>
            </group>
          );
        })}
      </group>

      {/* Analytics dashboard monitor on the desk, behind the bars */}
      <group position={[0, 0.89, -0.4]}>
        <DetailedMonitor
          width={0.95}
          accent={accent}
          highlighted={isActive}
          screen={screen}
        />
      </group>

      <SectionLabel title="DATA VISUALIZATION" accent={accent} position={[0, 3.1, 0]} />
    </InteractiveGroup>
  );
}
