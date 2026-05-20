"use client";

import { ReactNode, useMemo } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { matAluminum, matBlackPlastic, matEmissive } from "./materials";

interface Props {
  /** Optional title for the address bar. */
  title?: string;
  accent?: string;
  /** HTML content rendered inside the page area. */
  children?: ReactNode;
  width?: number;
  highlighted?: boolean;
}

/**
 * Floating browser-window mockup:
 *   - macOS-style window chrome (red/yellow/green dots)
 *   - address bar
 *   - large content area accepting children HTML
 *
 * Used for project showcase cards and the Frontend Studio main display.
 */
export default function DetailedBrowserMockup({
  title = "resumeverse.dev",
  accent = "#22d3ee",
  children,
  width = 1.4,
  highlighted = false,
}: Props) {
  const chassis = useMemo(matAluminum, []);
  const black = useMemo(matBlackPlastic, []);
  const led = useMemo(() => matEmissive(accent, 1.4), [accent]);

  const screenH = width * (9 / 16);
  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#04060f",
        emissive: new THREE.Color(accent),
        emissiveIntensity: highlighted ? 0.6 : 0.3,
        metalness: 0.6,
        roughness: 0.08,
        transparent: true,
        opacity: 0.97,
      }),
    [accent, highlighted],
  );

  return (
    <group>
      {/* Frame */}
      <RoundedBox
        args={[width, screenH, 0.04]}
        radius={0.02}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={chassis} attach="material" />
      </RoundedBox>

      {/* Inner bezel */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[width * 0.97, screenH * 0.94, 0.001]} />
        <primitive object={black} attach="material" />
      </mesh>

      {/* Glowing screen */}
      <mesh position={[0, 0, 0.024]}>
        <boxGeometry args={[width * 0.94, screenH * 0.9, 0.001]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

      {/* Underlit accent bar */}
      <mesh position={[0, -screenH / 2 - 0.012, 0.022]}>
        <boxGeometry args={[width * 0.6, 0.004, 0.001]} />
        <primitive object={led} attach="material" />
      </mesh>

      {/* Browser HTML chrome + content */}
      <Html
        transform
        position={[0, 0, 0.026]}
        distanceFactor={width * 1.6}
        occlude={false}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="rounded-md overflow-hidden select-none border border-white/10"
          style={{
            width: `${Math.round(width * 250)}px`,
            height: `${Math.round(screenH * 250)}px`,
            background: "linear-gradient(180deg, #07091a 0%, #0c1024 100%)",
          }}
        >
          <div className="flex items-center gap-1.5 px-2 py-1 border-b border-white/10 bg-black/40">
            <span className="size-1.5 rounded-full bg-red-500/90" />
            <span className="size-1.5 rounded-full bg-yellow-400/90" />
            <span className="size-1.5 rounded-full bg-emerald-400/90" />
            <div className="ml-2 flex-1 px-2 py-[1px] rounded-sm bg-white/5 border border-white/5 text-[8px] font-mono text-cyan-300 truncate">
              {title}
            </div>
          </div>
          <div className="p-2 text-white">{children}</div>
        </div>
      </Html>
    </group>
  );
}
