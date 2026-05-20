"use client";

import { useContext } from "react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedCloudConsole from "../objects/DetailedCloudConsole";
import DetailedMonitor from "../objects/DetailedMonitor";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function DevOpsCloudZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const screen = (
    <div className="w-full h-full p-2 font-mono text-[5.5px] text-cyan-300 leading-snug">
      <div className="flex justify-between border-b border-cyan-400/20 pb-0.5 mb-1">
        <span className="text-white font-bold tracking-widest">CI/CD PIPELINE //</span>
        <span className="text-emerald-300">DEPLOYING</span>
      </div>
      <div className="space-y-0.5">
        <div className="text-emerald-300">[STG1] BUILD: SUCCESS</div>
        <div className="text-emerald-300">[STG2] TEST: PASSED</div>
        <div className="text-cyan-300">[STG3] PUSH: DOCKER</div>
        <div className="text-amber-300 animate-pulse">[STG4] DEPLOY: ACTIVE...</div>
      </div>
      <div className="mt-1 grid grid-cols-4 gap-0.5">
        {["BUILD", "TEST", "PUSH", "DEPLOY"].map((s, i) => (
          <div
            key={s}
            className="rounded text-center py-[1px] text-[4.5px] font-bold border"
            style={{
              background: i < 3 ? "rgba(16,185,129,0.18)" : "rgba(245,158,11,0.18)",
              borderColor: i < 3 ? "rgba(16,185,129,0.4)" : "rgba(245,158,11,0.4)",
              color: i < 3 ? "#34d399" : "#fbbf24",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="devops-cloud" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.4} depth={1.15} accent={accent} />} />

      {/* Cloud + deployment rail floating above the desk */}
      <group position={[0, 0.7, 0]}>
        <Model
          src="/models/cloud.glb"
          fallback={<DetailedCloudConsole accent={accent} active={isActive} />}
        />
      </group>

      {/* CI/CD monitor */}
      <group position={[0, 0.89, -0.1]}>
        <DetailedMonitor
          width={0.95}
          accent={accent}
          highlighted={isActive}
          screen={screen}
        />
      </group>

      <SectionLabel title="DEVOPS CLOUD DEPLOY" accent={accent} position={[0, 3.2, 0]} />
    </InteractiveGroup>
  );
}
