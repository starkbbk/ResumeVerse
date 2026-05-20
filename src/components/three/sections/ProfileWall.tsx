"use client";

import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Mail, Github, Linkedin, Globe } from "lucide-react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedHologramPedestal from "../objects/DetailedHologramPedestal";
import DetailedMonitor from "../objects/DetailedMonitor";
import Model from "@/components/3d/Model";
import type { ResumeProfile } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  profile: ResumeProfile;
  accent: string;
}

export default function ProfileWall({ position, profile, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const orbRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.4;
      orbRef.current.rotation.x += delta * 0.15;
    }
  });

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "ID";

  const screen = (
    <div className="w-full h-full flex flex-col p-3 text-white">
      <div className="flex items-center justify-between border-b border-cyan-400/20 pb-2">
        <span className="font-mono text-[8px] tracking-[0.3em] text-cyan-300/80">
          SECURE TERMINAL
        </span>
        <span className="font-mono text-[7px] text-emerald-400">● ONLINE</span>
      </div>
      <div className="mt-3 flex-1">
        <h3 className="font-bold text-[15px] leading-tight tracking-tight">
          {profile.name || "Identity Locked"}
        </h3>
        {profile.headline && (
          <p className="text-[10px] text-white/70 leading-snug mt-2 line-clamp-2">
            {profile.headline}
          </p>
        )}
        {profile.summary && (
          <p className="text-[8px] text-white/50 leading-relaxed mt-2 line-clamp-3">
            {profile.summary}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 text-[8px] font-mono text-cyan-300/70 border-t border-cyan-400/20 pt-2">
        {profile.location && <span>📍 {profile.location.toUpperCase()}</span>}
        {profile.email && <span className="ml-auto truncate max-w-[60%]">{profile.email}</span>}
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="profile" position={position} bobble={false}>
      <DetailedHologramPedestal accent={accent} />

      {/* Floating identity orb (3D wireframe + initials) */}
      <group ref={orbRef} position={[0, 1.95, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.34, 1]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.4}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>
        <Html transform center distanceFactor={1.4} style={{ pointerEvents: "none" }}>
          <span className="font-display text-[11px] font-black text-white tracking-widest bg-black/55 px-1.5 py-0.5 rounded select-none">
            {initials}
          </span>
        </Html>
      </group>

      {/* Real monitor presenting the identity terminal */}
      <group position={[0, 0.82, 0.05]}>
        <Model
          src="/models/monitor.glb"
          fallback={
            <DetailedMonitor
              width={1.4}
              accent={accent}
              highlighted={isActive}
              ultrawide
              screen={screen}
            />
          }
        />
      </group>

      {/* Floating contact chips */}
      {profile.email && (
        <Html transform position={[-1.1, 2.3, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "auto" }}>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/85 hover:text-white bg-black/45 border border-white/10 hover:border-cyan-300/50 backdrop-blur-md transition"
          >
            <Mail className="size-3 text-cyan-300" />
            <span>Email</span>
          </a>
        </Html>
      )}
      {profile.links.github && (
        <Html transform position={[-1.1, 2.0, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "auto" }}>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/85 hover:text-white bg-black/45 border border-white/10 hover:border-cyan-300/50 backdrop-blur-md transition"
          >
            <Github className="size-3 text-cyan-300" />
            <span>GitHub</span>
          </a>
        </Html>
      )}
      {profile.links.linkedin && (
        <Html transform position={[1.1, 2.3, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "auto" }}>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/85 hover:text-white bg-black/45 border border-white/10 hover:border-cyan-300/50 backdrop-blur-md transition"
          >
            <Linkedin className="size-3 text-cyan-300" />
            <span>LinkedIn</span>
          </a>
        </Html>
      )}
      {profile.links.portfolio && (
        <Html transform position={[1.1, 2.0, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "auto" }}>
          <a
            href={profile.links.portfolio}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/85 hover:text-white bg-black/45 border border-white/10 hover:border-cyan-300/50 backdrop-blur-md transition"
          >
            <Globe className="size-3 text-cyan-300" />
            <span>Portfolio</span>
          </a>
        </Html>
      )}

      <SectionLabel title="IDENTITY" accent={accent} position={[0, 3.4, 0]} />
    </InteractiveGroup>
  );
}
