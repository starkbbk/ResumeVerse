"use client";

import { ReactNode, useMemo } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { matGold, matWoodDark } from "./materials";

interface Props {
  title?: string;
  institute?: string;
  duration?: string;
  score?: string;
  /** Custom body content for the parchment. Falls back to title/institute. */
  body?: ReactNode;
  /** Frame width in world units. */
  width?: number;
  accent?: string;
}

/**
 * Wall-mounted diploma frame with thick wood molding, gold inner border,
 * cream parchment, embossed seal, ribbon ornament, and signature lines.
 */
export default function DetailedDiplomaFrame({
  title = "Bachelor of Science",
  institute,
  duration,
  score,
  body,
  width = 1.1,
  accent = "#fbbf24",
}: Props) {
  const wood = useMemo(matWoodDark, []);
  const gold = useMemo(matGold, []);
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.18,
        roughness: 0.05,
        transmission: 0.5,
        ior: 1.45,
      }),
    [],
  );
  const aspect = 0.72;
  const height = width * aspect;
  const frameThickness = 0.045;

  return (
    <group>
      {/* Wall-mount shadow */}
      <mesh position={[0, 0, -0.022]} receiveShadow>
        <planeGeometry args={[width * 1.08, height * 1.08]} />
        <meshStandardMaterial color="#04060f" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Outer wood frame */}
      <RoundedBox
        args={[width, height, frameThickness]}
        radius={0.012}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={wood} attach="material" />
      </RoundedBox>

      {/* Inner gold border */}
      <mesh position={[0, 0, frameThickness / 2 + 0.001]}>
        <boxGeometry args={[width * 0.94, height * 0.93, 0.005]} />
        <primitive object={gold} attach="material" />
      </mesh>

      {/* Parchment paper */}
      <mesh position={[0, 0, frameThickness / 2 + 0.0044]}>
        <boxGeometry args={[width * 0.88, height * 0.88, 0.002]} />
        <meshStandardMaterial color="#f5edd6" roughness={0.95} metalness={0} />
      </mesh>

      {/* Glass cover */}
      <mesh position={[0, 0, frameThickness / 2 + 0.007]}>
        <boxGeometry args={[width * 0.92, height * 0.91, 0.002]} />
        <primitive object={glass} attach="material" />
      </mesh>

      {/* Seal (gold disc with ribbon) */}
      <group position={[width * 0.32, -height * 0.28, frameThickness / 2 + 0.006]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.004, 32]} />
          <primitive object={gold} attach="material" />
        </mesh>
        {/* Ribbon tails */}
        <mesh position={[-0.02, -0.05, 0]} rotation={[0, 0, Math.PI / 12]}>
          <boxGeometry args={[0.022, 0.07, 0.001]} />
          <meshStandardMaterial color="#a01616" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, -0.05, 0]} rotation={[0, 0, -Math.PI / 12]}>
          <boxGeometry args={[0.022, 0.07, 0.001]} />
          <meshStandardMaterial color="#a01616" roughness={0.6} />
        </mesh>
      </group>

      {/* HTML certificate text */}
      <Html
        transform
        position={[0, 0, frameThickness / 2 + 0.008]}
        distanceFactor={width * 1.7}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="text-center font-serif select-none"
          style={{
            width: `${Math.round(width * 270)}px`,
            height: `${Math.round(height * 270)}px`,
            color: "#3a2410",
            padding: "12px",
          }}
        >
          {body ? (
            body
          ) : (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="text-[7px] uppercase tracking-[0.35em] text-amber-700 font-bold">
                  Diploma of Higher Education
                </div>
                <div className="w-12 h-px bg-amber-700/40 mx-auto mt-2" />
                <div className="text-[12px] font-bold mt-3 leading-tight">{title}</div>
                {institute && (
                  <div className="text-[9px] italic text-amber-900/80 mt-1.5">
                    awarded by {institute}
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between border-t border-amber-700/30 pt-2 text-[7px]">
                <div className="text-left">
                  <div className="border-t border-amber-900/40 w-14 mb-0.5" />
                  <span className="opacity-70">Director</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{score || "Awarded"}</div>
                  <div className="opacity-60">{duration}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Html>

      {/* Wall-mounting nails (decorative) */}
      <mesh position={[-width * 0.42, height * 0.42, frameThickness / 2 + 0.001]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <primitive object={gold} attach="material" />
      </mesh>
      <mesh position={[width * 0.42, height * 0.42, frameThickness / 2 + 0.001]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <primitive object={gold} attach="material" />
      </mesh>
    </group>
  );
}
