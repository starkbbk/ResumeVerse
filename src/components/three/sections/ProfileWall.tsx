"use client";

import { useContext, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Mail, Github, Linkedin, Globe } from "lucide-react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
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
  const scanLineRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Rotate the central initials orb
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.5;
      orbRef.current.rotation.z += delta * 0.2;
    }
    // Animate scan ring up and down
    if (scanLineRef.current) {
      scanLineRef.current.position.y = 1.3 + Math.sin(state.clock.elapsedTime * 2) * 0.45;
    }
  });

  // Get initials for the floating orb
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "ID";

  return (
    <InteractiveGroup id="profile" position={position} bobble={false}>
      {/* 1. Hologram Double-tiered Base */}
      <group position={[0, -0.05, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.3, 0.12, 32]} />
          <meshStandardMaterial color="#0b0e21" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[1.0, 1.1, 0.06, 32]} />
          <meshStandardMaterial color="#1a1e3a" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Glow rings */}
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.015, 8, 64]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.01, 8, 64]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 2. Holographic Screen Panel */}
      <mesh position={[0, 1.3, -0.15]} castShadow>
        <boxGeometry args={[2.0, 1.2, 0.04]} />
        <meshStandardMaterial
          color="#060919"
          emissive={accent}
          emissiveIntensity={0.15}
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Screen Frame border */}
      <mesh position={[0, 1.3, -0.15]}>
        <boxGeometry args={[2.04, 1.24, 0.02]} />
        <meshStandardMaterial color={accent} wireframe />
      </mesh>

      {/* 3. Animated Scan Line */}
      <mesh ref={scanLineRef} position={[0, 1.3, -0.12]}>
        <boxGeometry args={[1.9, 0.015, 0.05]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
      </mesh>

      {/* 4. Floating Initials Orb */}
      <group ref={orbRef} position={[0, 1.3, 0.25]}>
        {/* Wireframe outer shell */}
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.0}
            wireframe
          />
        </mesh>
        {/* Glowing solid inner core */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>
        {/* Floating initials text */}
        <Html transform center distanceFactor={1.4} style={{ pointerEvents: "none" }}>
          <span className="font-display text-[9px] font-bold text-white select-none tracking-widest bg-black/60 px-1 rounded-sm">
            {initials}
          </span>
        </Html>
      </group>

      {/* 5. Terminal HTML Screen Overlay */}
      <Html
        transform
        position={[0, 1.35, -0.12]}
        distanceFactor={6}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="px-6 py-5 w-[280px] rounded-xl text-center backdrop-blur-sm transition-all duration-500 ease-out select-none border border-white/5"
          style={{
            background: "rgba(6, 9, 25, 0.4)",
            opacity: isActive ? 1 : 0.2,
            transform: isActive ? "scale(1)" : "scale(0.9)",
          }}
        >
          <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-300/80 font-bold">
            SECURE TERMINAL
          </p>
          <h3 className="font-display font-bold text-white text-xl leading-tight mt-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            {profile.name || "Identity Locked"}
          </h3>
          {profile.headline && (
            <p className="text-[11px] text-white/70 mt-2 font-medium leading-snug line-clamp-2">
              {profile.headline}
            </p>
          )}
          {profile.location && (
            <p className="text-[9px] text-cyan-300/60 mt-3 font-semibold tracking-wider">
              📍 {profile.location.toUpperCase()}
            </p>
          )}
        </div>
      </Html>

      {/* 6. Satellite Links Floating Chips */}
      <group position={[0, 1.3, 0]}>
        {/* Left Satellites */}
        {profile.email && (
          <Html
            transform
            position={[-1.3, 0.3, 0.1]}
            distanceFactor={4.5}
            style={{ pointerEvents: "auto" }}
          >
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/80 hover:text-white glass border border-white/10 hover:border-cyan-300/40 transition-all duration-300 hover:scale-105"
            >
              <Mail className="size-3 text-cyan-300" />
              <span>Email</span>
            </a>
          </Html>
        )}
        {profile.links.github && (
          <Html
            transform
            position={[-1.35, -0.3, 0.15]}
            distanceFactor={4.5}
            style={{ pointerEvents: "auto" }}
          >
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/80 hover:text-white glass border border-white/10 hover:border-cyan-300/40 transition-all duration-300 hover:scale-105"
            >
              <Github className="size-3 text-cyan-300" />
              <span>GitHub</span>
            </a>
          </Html>
        )}

        {/* Right Satellites */}
        {profile.links.linkedin && (
          <Html
            transform
            position={[1.3, 0.3, 0.1]}
            distanceFactor={4.5}
            style={{ pointerEvents: "auto" }}
          >
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/80 hover:text-white glass border border-white/10 hover:border-cyan-300/40 transition-all duration-300 hover:scale-105"
            >
              <Linkedin className="size-3 text-cyan-300" />
              <span>LinkedIn</span>
            </a>
          </Html>
        )}
        {profile.links.portfolio && (
          <Html
            transform
            position={[1.35, -0.3, 0.15]}
            distanceFactor={4.5}
            style={{ pointerEvents: "auto" }}
          >
            <a
              href={profile.links.portfolio}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/80 hover:text-white glass border border-white/10 hover:border-cyan-300/40 transition-all duration-300 hover:scale-105"
            >
              <Globe className="size-3 text-cyan-300" />
              <span>Portfolio</span>
            </a>
          </Html>
        )}
      </group>

      <SectionLabel title="IDENTITY" accent={accent} position={[0, 2.6, 0]} />
    </InteractiveGroup>
  );
}
