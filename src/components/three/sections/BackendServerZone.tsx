"use client";

import { useContext } from "react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedServerRack from "../objects/DetailedServerRack";
import DetailedMonitor from "../objects/DetailedMonitor";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function BackendServerZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const terminal = (
    <>
      <div className="font-bold text-cyan-200 border-b border-cyan-500/20 pb-0.5 mb-1">
        TELEMETRY //
      </div>
      <div className="text-emerald-300">GET /api 200 OK</div>
      <div className="text-cyan-300">POST /auth 201</div>
      <div className="text-amber-300">WARN pool 84%</div>
      <div className="text-white/60">CPU 18.5%</div>
    </>
  );

  const monitorScreen = (
    <div className="w-full h-full p-2 font-mono text-[6px] text-cyan-300 leading-snug">
      <div className="flex justify-between border-b border-cyan-400/20 pb-0.5 mb-1.5">
        <span className="text-white font-bold">DASHBOARD</span>
        <span className="text-emerald-400">● HEALTHY</span>
      </div>
      <div className="grid grid-cols-2 gap-1 text-[5.5px]">
        <div className="rounded bg-emerald-500/10 border border-emerald-400/30 p-1">
          <div className="opacity-70">RPS</div>
          <div className="text-emerald-300 font-bold text-[8px]">12,450</div>
        </div>
        <div className="rounded bg-cyan-500/10 border border-cyan-400/30 p-1">
          <div className="opacity-70">P95</div>
          <div className="text-cyan-300 font-bold text-[8px]">42ms</div>
        </div>
        <div className="rounded bg-purple-500/10 border border-purple-400/30 p-1">
          <div className="opacity-70">UPTIME</div>
          <div className="text-purple-300 font-bold text-[8px]">99.98%</div>
        </div>
        <div className="rounded bg-amber-500/10 border border-amber-400/30 p-1">
          <div className="opacity-70">ERRORS</div>
          <div className="text-amber-300 font-bold text-[8px]">0.02%</div>
        </div>
      </div>
      <div className="mt-1 h-3 flex items-end gap-0.5">
        {[3, 5, 4, 6, 5, 7, 6, 8, 7, 6, 5, 7].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-cyan-400/60"
            style={{ height: `${h * 10}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="backend-server" position={position}>
      {/* Two server racks flanking the platform */}
      <group position={[-0.85, 0.94, 0]}>
        <Model
          src="/models/server-rack.glb"
          fallback={
            <DetailedServerRack
              units={6}
              accent={accent}
              label="API-01"
              terminalScreen={terminal}
              active={isActive}
            />
          }
        />
      </group>
      <group position={[0.85, 0.94, 0]}>
        <Model
          src="/models/server-rack.glb"
          fallback={
            <DetailedServerRack
              units={6}
              accent="#3b82f6"
              label="DB-CACHE"
              active={isActive}
            />
          }
        />
      </group>

      {/* Floor underglow lighting between racks */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.7, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>

      {/* Telemetry monitor centered between the racks */}
      <group position={[0, 0.89, 0.2]}>
        <DetailedMonitor
          width={1.0}
          accent={accent}
          highlighted={isActive}
          screen={monitorScreen}
        />
      </group>

      <SectionLabel title="BACKEND INFRASTRUCTURE" accent={accent} position={[0, 3.2, 0]} />
    </InteractiveGroup>
  );
}
