"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { matChassis, matEmissive, matAluminum } from "./materials";

interface Props {
  accent?: string;
  /** Optional silo label. */
  label?: string;
  /** Number of segments stacked. */
  segments?: number;
  active?: boolean;
}

/**
 * Database silo: chamfered base, three stacked drum segments with neon
 * separator rings, dome top with status light, and a query pulse running
 * up the side.
 */
export default function DetailedDatabaseStack({
  accent = "#fb923c",
  label,
  segments = 3,
  active = true,
}: Props) {
  const chassisMat = useMemo(matChassis, []);
  const aluminum = useMemo(matAluminum, []);
  const ringMat = useMemo(() => matEmissive(accent, 1.4), [accent]);
  const pulseRef = useRef<THREE.Mesh>(null);

  const r = 0.22;
  const segH = 0.22;

  useFrame((state) => {
    if (!active || !pulseRef.current) return;
    const t = state.clock.elapsedTime;
    const totalH = segments * segH;
    pulseRef.current.position.y = (t * 0.5) % totalH;
  });

  return (
    <group>
      {/* Base plate */}
      <mesh position={[0, 0.018, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r * 1.18, r * 1.22, 0.036, 32]} />
        <primitive object={aluminum} attach="material" />
      </mesh>

      {/* Stacked segments */}
      {Array.from({ length: segments }).map((_, i) => {
        const y = 0.04 + i * segH + segH / 2;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[r, r, segH, 32]} />
              <primitive object={chassisMat} attach="material" />
            </mesh>
            {/* Bottom separator ring */}
            <mesh position={[0, -segH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r + 0.005, 0.012, 8, 32]} />
              <primitive object={ringMat} attach="material" />
            </mesh>
            {/* Vent slits around the drum */}
            {Array.from({ length: 8 }).map((_, j) => {
              const a = (j / 8) * Math.PI * 2;
              return (
                <mesh
                  key={j}
                  position={[Math.cos(a) * (r + 0.001), 0, Math.sin(a) * (r + 0.001)]}
                  rotation={[0, -a, 0]}
                >
                  <boxGeometry args={[0.001, segH * 0.6, 0.04]} />
                  <meshStandardMaterial color="#04060f" />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Top dome cap */}
      <mesh position={[0, 0.04 + segments * segH + 0.01, 0]} castShadow>
        <sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={chassisMat} attach="material" />
      </mesh>
      {/* Status light */}
      <mesh position={[0, 0.04 + segments * segH + r * 0.6, 0]}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <primitive object={ringMat} attach="material" />
      </mesh>

      {/* Query pulse traveling up the side */}
      <mesh ref={pulseRef} position={[r + 0.014, 0.04, 0]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} />
      </mesh>

      {/* Floating label */}
      {label && (
        <Html
          transform
          position={[0, 0.04 + segments * segH + r + 0.06, 0]}
          distanceFactor={3}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="px-2 py-0.5 rounded-md text-[7px] font-mono font-bold uppercase tracking-widest whitespace-nowrap"
            style={{
              background: "rgba(10,12,28,0.7)",
              color: accent,
              borderTop: `1px solid ${accent}55`,
              borderBottom: `1px solid ${accent}55`,
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
