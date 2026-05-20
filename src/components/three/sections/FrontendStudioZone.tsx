"use client";

import { useContext } from "react";
import { Html } from "@react-three/drei";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedMonitor from "../objects/DetailedMonitor";
import DetailedPhoneMockup from "../objects/DetailedPhoneMockup";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

const SWATCHES = ["#22d3ee", "#ec4899", "#a78bfa", "#f59e0b", "#34d399", "#60a5fa"];

/**
 * Designer studio: ultrawide monitor showing layout grid, phone + tablet
 * mockups, color palette stand, and a layout grid board behind the desk.
 */
export default function FrontendStudioZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const monitorScreen = (
    <div className="w-full h-full text-white">
      <div className="flex items-center gap-1.5 px-2 py-1 border-b border-white/10 bg-black/30">
        <span className="size-1.5 rounded-full bg-red-500" />
        <span className="size-1.5 rounded-full bg-yellow-400" />
        <span className="size-1.5 rounded-full bg-emerald-400" />
        <span className="ml-2 font-mono text-[7px] text-cyan-300/80 truncate">
          design-system.tsx
        </span>
      </div>
      <div className="p-2 grid grid-cols-12 gap-1 h-[calc(100%-22px)]">
        <div className="col-span-3 row-span-2 rounded bg-cyan-500/15 border border-cyan-400/30 p-1.5">
          <div className="text-[6px] uppercase font-bold text-cyan-200">Hero</div>
          <div className="mt-1 h-1 rounded bg-cyan-400/40" />
          <div className="mt-1 h-1 rounded bg-cyan-400/30 w-2/3" />
        </div>
        <div className="col-span-9 rounded bg-pink-500/12 border border-pink-400/30 p-1.5">
          <div className="text-[6px] uppercase font-bold text-pink-200">Header Navigation</div>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1 w-6 rounded bg-pink-400/40" />
            ))}
          </div>
        </div>
        <div className="col-span-9 rounded bg-purple-500/12 border border-purple-400/30 p-1.5">
          <div className="text-[6px] uppercase font-bold text-purple-200">Content Grid</div>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 rounded bg-purple-400/35" />
            ))}
          </div>
        </div>
        <div className="col-span-12 rounded bg-emerald-500/12 border border-emerald-400/30 p-1.5">
          <div className="text-[6px] uppercase font-bold text-emerald-200">Footer / CTA</div>
        </div>
      </div>
    </div>
  );

  const phoneScreen = (
    <div className="w-full h-full p-2 flex flex-col justify-between text-white">
      <div>
        <div className="size-1.5 rounded-full bg-slate-700 mx-auto mb-2" />
        <div className="h-2 rounded bg-pink-400/40 mb-1.5" />
        <div className="h-12 rounded bg-cyan-500/15 border border-cyan-400/30 mb-1.5 flex items-center justify-center">
          <span className="text-[6px] font-mono text-cyan-200">PREVIEW</span>
        </div>
        <div className="h-4 rounded bg-purple-500/20 mb-1" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-3 rounded bg-emerald-500/20" />
          <div className="h-3 rounded bg-amber-500/20" />
          <div className="h-3 rounded bg-blue-500/20" />
        </div>
      </div>
      <div className="h-1.5 w-1/3 rounded bg-white/15 mx-auto" />
    </div>
  );

  const tabletScreen = (
    <div className="w-full h-full p-2 grid grid-cols-2 gap-1 text-white">
      <div className="rounded bg-cyan-500/15 border border-cyan-400/25 p-1">
        <div className="text-[6px] font-bold text-cyan-200">Charts</div>
        <div className="mt-1 h-6 flex items-end gap-0.5">
          {[3, 5, 7, 4, 6, 8].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-cyan-400/50"
              style={{ height: `${h * 10}%` }}
            />
          ))}
        </div>
      </div>
      <div className="rounded bg-purple-500/15 border border-purple-400/25 p-1">
        <div className="text-[6px] font-bold text-purple-200">Sessions</div>
        <div className="text-[10px] font-bold mt-1 text-white">12.4K</div>
        <div className="text-[5px] text-emerald-300">+18.2%</div>
      </div>
      <div className="col-span-2 rounded bg-pink-500/15 border border-pink-400/25 p-1">
        <div className="text-[6px] font-bold text-pink-200">Activity</div>
        <div className="mt-1 h-3 rounded bg-pink-400/30" />
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="frontend-studio" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.8} depth={1.25} accent={accent} />} />

      {/* Ultrawide monitor */}
      <group position={[0, 0.89, -0.05]}>
        <Model
          src="/models/monitor.glb"
          fallback={
            <DetailedMonitor
              width={1.5}
              accent={accent}
              ultrawide
              highlighted={isActive}
              screen={monitorScreen}
            />
          }
        />
      </group>

      {/* Phone on cradle, right */}
      <group position={[0.95, 0.89, 0.25]} rotation={[0, -Math.PI / 9, 0]}>
        <mesh position={[0, 0.06, -0.05]}>
          <boxGeometry args={[0.08, 0.12, 0.1]} />
          <meshStandardMaterial color="#1a1f33" metalness={0.85} roughness={0.3} />
        </mesh>
        <group position={[0, 0.27, 0]} rotation={[-Math.PI / 18, 0, 0]}>
          <Model
            src="/models/phone.glb"
            fallback={
              <DetailedPhoneMockup
                width={0.32}
                accent="#ec4899"
                highlighted={isActive}
                screen={phoneScreen}
              />
            }
          />
        </group>
      </group>

      {/* Tablet on cradle, left */}
      <group position={[-0.95, 0.89, 0.25]} rotation={[0, Math.PI / 9, 0]}>
        <mesh position={[0, 0.05, -0.06]}>
          <boxGeometry args={[0.1, 0.1, 0.12]} />
          <meshStandardMaterial color="#1a1f33" metalness={0.85} roughness={0.3} />
        </mesh>
        <group position={[0, 0.2, 0]} rotation={[-Math.PI / 14, 0, 0]}>
          <Model
            src="/models/tablet.glb"
            fallback={
              <DetailedPhoneMockup
                width={0.45}
                tablet
                accent={accent}
                highlighted={isActive}
                screen={tabletScreen}
              />
            }
          />
        </group>
      </group>

      {/* Color palette swatch stand at front-center of desk */}
      <group position={[0, 0.92, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.16, 0.025, 24]} />
          <meshStandardMaterial color="#1a1f33" metalness={0.85} roughness={0.3} />
        </mesh>
        {SWATCHES.map((c, i) => {
          const angle = (i / SWATCHES.length) * Math.PI * 2;
          const r = 0.09;
          return (
            <mesh
              key={c}
              position={[Math.cos(angle) * r, 0.018, Math.sin(angle) * r]}
              rotation={[0, -angle, Math.PI / 14]}
            >
              <boxGeometry args={[0.04, 0.014, 0.04]} />
              <meshStandardMaterial
                color={c}
                emissive={c}
                emissiveIntensity={isActive ? 0.9 : 0.3}
                metalness={0.4}
                roughness={0.35}
              />
            </mesh>
          );
        })}
        <Html
          transform
          position={[0, 0.06, 0]}
          distanceFactor={3}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-[6px] font-mono uppercase tracking-widest font-bold text-cyan-200 whitespace-nowrap">
            COLOR PALETTE
          </div>
        </Html>
      </group>

      <SectionLabel title="FRONTEND DESIGN STUDIO" accent={accent} position={[0, 3.1, 0]} />
    </InteractiveGroup>
  );
}
