"use client";

import { useContext, useMemo } from "react";
import { Html } from "@react-three/drei";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedLaptop from "../objects/DetailedLaptop";
import Model from "@/components/3d/Model";
import type { ResumeProject } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  projects: ResumeProject[];
  accent: string;
}

/**
 * Project gallery: long display desk with three laptops on it, each showing
 * a project demo terminal complete with title, description, tech chips,
 * and live links. Curved arrangement so screens face the camera.
 */
export default function ProjectZone({ position, projects, accent }: Props) {
  const cards = useMemo(() => projects.slice(0, 3), [projects]);
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const renderScreen = (p: ResumeProject) => (
    <div className="w-full h-full flex flex-col text-white">
      <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-red-500" />
          <span className="size-1.5 rounded-full bg-yellow-400" />
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-[7.5px] text-cyan-300/80 tracking-wider truncate max-w-[60%]">
          {p.name.toLowerCase().replace(/\s+/g, "-")}.app
        </span>
      </div>
      <div className="flex-1 p-2">
        <h4 className="text-[10px] font-bold leading-tight line-clamp-1">{p.name}</h4>
        {p.description && (
          <p className="text-[7.5px] text-white/65 mt-1 line-clamp-3 leading-snug">
            {p.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {p.techStack.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[6.5px] font-mono px-1.5 py-[1px] rounded bg-cyan-500/10 border border-cyan-400/20 text-cyan-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 border-t border-white/10 bg-black/30">
        {p.githubUrl && (
          <a
            href={p.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[7px] font-bold px-1.5 py-[1px] rounded bg-white/8 border border-white/10 text-white/85 hover:text-cyan-300 transition"
          >
            ▸ Code
          </a>
        )}
        {p.demoUrl && (
          <a
            href={p.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[7px] font-bold px-1.5 py-[1px] rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 hover:text-white transition"
          >
            ▸ Live
          </a>
        )}
        <span className="ml-auto font-mono text-[6px] text-white/35">v1.0.0</span>
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="projects" position={position}>
      {/* Display desk */}
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={3.4} depth={1.4} accent={accent} />} />

      {/* Three laptops arranged in a slight arc on top of the desk */}
      {cards.map((p, i) => {
        const offset = i - (cards.length - 1) / 2;
        const x = offset * 1.05;
        const z = 0.1 - Math.pow(offset, 2) * 0.1;
        const rotY = -offset * 0.18;
        return (
          <group key={`${p.name}-${i}`} position={[x, 0.89, z]} rotation={[0, rotY, 0]}>
            <Model
              src="/models/laptop.glb"
              fallback={
                <DetailedLaptop
                  width={0.95}
                  accent={accent}
                  highlighted={isActive}
                  screen={renderScreen(p)}
                  label={p.name.split(" ")[0]?.toUpperCase()}
                />
              }
            />
            {/* Tech name plaque under each laptop */}
            <Html
              transform
              position={[0, -0.04, 0.4]}
              rotation={[-Math.PI / 2.6, 0, 0]}
              distanceFactor={3.4}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="px-2 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-widest bg-black/55 border border-cyan-400/30 text-cyan-200 whitespace-nowrap"
                style={{ opacity: isActive ? 0.9 : 0.4 }}
              >
                {p.name}
              </div>
            </Html>
          </group>
        );
      })}

      <SectionLabel
        title="PROJECT SHOWCASE"
        subtitle={`${projects.length}`}
        accent={accent}
        position={[0, 3.1, 0]}
      />
    </InteractiveGroup>
  );
}
