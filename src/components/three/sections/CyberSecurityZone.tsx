"use client";

import { useContext } from "react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedShield from "../objects/DetailedShield";
import DetailedMonitor from "../objects/DetailedMonitor";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function CyberSecurityZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const screen = (
    <div className="w-full h-full p-2 font-mono text-[5.5px] text-red-300 leading-snug">
      <div className="flex justify-between border-b border-red-400/30 pb-0.5 mb-1">
        <span className="text-white font-bold tracking-widest">CYBER SENTINEL</span>
        <span className="text-emerald-300">● SHIELD</span>
      </div>
      <div className="space-y-0.5">
        <div className="text-emerald-300">FIREWALL: ENGAGED</div>
        <div>STATUS: SECURED</div>
        <div className="text-emerald-300 font-bold">BLOCKED: 1,429</div>
        <div className="opacity-70">TLS: v1.3</div>
      </div>
      <div className="mt-1 grid grid-cols-3 gap-0.5">
        {[
          { l: "SAST", v: "OK", c: "#34d399" },
          { l: "DAST", v: "OK", c: "#34d399" },
          { l: "AUDIT", v: "OK", c: "#34d399" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded text-center py-[1px] text-[4.5px] font-bold border"
            style={{ background: `${s.c}22`, borderColor: `${s.c}55`, color: s.c }}
          >
            {s.l} · {s.v}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="cybersecurity" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.4} depth={1.15} accent="#ef4444" />} />

      {/* Shield emblem */}
      <group position={[0, 0.78, 0.05]}>
        <Model
          src="/models/shield.glb"
          fallback={<DetailedShield accent="#ef4444" active={isActive} />}
        />
      </group>

      {/* Monitor */}
      <group position={[0, 0.89, -0.1]}>
        <DetailedMonitor
          width={0.95}
          accent="#ef4444"
          highlighted={isActive}
          screen={screen}
        />
      </group>

      <SectionLabel title="SECURITY CONTROL" accent={accent} position={[0, 3.2, 0]} />
    </InteractiveGroup>
  );
}
