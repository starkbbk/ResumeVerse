"use client";

import { useContext } from "react";
import { Html } from "@react-three/drei";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedMonitor from "../objects/DetailedMonitor";
import Model from "@/components/3d/Model";
import type { ResumeExperience } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  experience: ResumeExperience[];
  accent: string;
}

/**
 * Workstation desk with a monitor showing a vertical timeline of recent roles,
 * plus floating cards above the desk for each position.
 */
export default function ExperienceWorkstation({ position, experience, accent }: Props) {
  const items = experience.slice(0, 4);
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const monitorContent = (
    <div className="w-full h-full p-3 text-white">
      <div className="flex items-center justify-between border-b border-cyan-400/20 pb-1.5">
        <span className="font-mono text-[8px] tracking-widest text-cyan-300">CAREER LOG</span>
        <span className="font-mono text-[7px] text-emerald-300">// {items.length} ROLES</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {items.slice(0, 4).map((e, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="mt-1 size-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_4px_#22d3ee]" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-bold leading-tight truncate">
                {e.role || "Engineer"}
              </div>
              <div className="text-[7.5px] text-white/65 truncate">
                {e.company} · {e.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="experience" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={3.0} depth={1.3} accent={accent} />} />

      {/* Center monitor showing the career log */}
      <group position={[0, 0.89, -0.05]}>
        <Model
          src="/models/monitor.glb"
          fallback={
            <DetailedMonitor
              width={0.95}
              accent={accent}
              highlighted={isActive}
              screen={monitorContent}
            />
          }
        />
      </group>

      {/* Timeline rail running along the front of the desk */}
      <mesh position={[0, 0.905, 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 2.6, 8]} />
        <meshStandardMaterial color="#fff" emissive={accent} emissiveIntensity={1.0} />
      </mesh>

      {/* Floating role cards above the desk */}
      {items.slice(0, 3).map((e, i) => {
        const x = (i - 1) * 1.0;
        return (
          <group key={i}>
            {/* Connector node + line */}
            <mesh position={[x, 0.905, 0.55]} castShadow>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={isActive ? 1.6 : 0.5}
              />
            </mesh>
            <mesh position={[x, 1.05, 0.55]}>
              <cylinderGeometry args={[0.005, 0.005, 1.05, 6]} />
              <meshBasicMaterial color={accent} transparent opacity={isActive ? 0.85 : 0.25} />
            </mesh>

            <Html
              transform
              position={[x, 1.65, 0.55]}
              distanceFactor={5}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="px-3 py-2 w-[175px] rounded-xl text-left bg-black/55 border backdrop-blur-md select-none"
                style={{
                  borderColor: `${accent}55`,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.55)`,
                  opacity: isActive ? 1 : 0.3,
                }}
              >
                <span className="text-[7.5px] uppercase tracking-[0.2em] text-cyan-300 font-bold">
                  EXPERIENCE
                </span>
                <p className="text-[11px] font-bold text-white leading-snug mt-1 line-clamp-1">
                  {e.role || "Developer"}
                </p>
                <p className="text-[9px] text-white/70 font-semibold line-clamp-1">
                  {e.company}
                </p>
                {e.duration && (
                  <p className="text-[8px] font-mono text-cyan-300/70 mt-1.5">
                    {e.duration.toUpperCase()}
                  </p>
                )}
              </div>
            </Html>
          </group>
        );
      })}

      <SectionLabel
        title="WORK EXPERIENCE"
        subtitle={`${experience.length}`}
        accent={accent}
        position={[0, 2.7, 0]}
      />
    </InteractiveGroup>
  );
}
