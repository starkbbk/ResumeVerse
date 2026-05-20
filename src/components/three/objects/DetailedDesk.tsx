"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { matDarkMetal, matEmissive, matAluminum } from "./materials";

interface Props {
  width?: number;
  depth?: number;
  /** Top surface height (legs span 0 → topY). */
  topY?: number;
  accent?: string;
  /** Render as floating slab with metallic supports instead of legs. */
  floating?: boolean;
}

/**
 * Modern reception desk: thick top with bevel, drawer detail, four trim legs,
 * underglow, and a subtle metal accent rail. Used as the foundation for
 * Project / Frontend / Mobile / DataViz / Experience zones.
 *
 * Default `topY = 0.85` puts the desk surface at human waist height so
 * objects placed on top (laptops, monitors) end up at natural eye-line.
 */
export default function DetailedDesk({
  width = 3.2,
  depth = 1.4,
  topY = 0.85,
  accent = "#22d3ee",
  floating = false,
}: Props) {
  const top = useMemo(matDarkMetal, []);
  const aluminum = useMemo(matAluminum, []);
  const glow = useMemo(() => matEmissive(accent, 1.4), [accent]);

  const topThickness = 0.08;
  const legW = 0.06;

  return (
    <group>
      {/* Floor shadow plate (optional — adds visual weight) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width * 1.05, depth * 1.1]} />
        <meshStandardMaterial color="#04060f" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Tabletop with rounded edges */}
      <RoundedBox
        args={[width, topThickness, depth]}
        radius={0.022}
        smoothness={4}
        position={[0, topY, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={top} attach="material" />
      </RoundedBox>

      {/* Front lip (subtle inset for thickness reading) */}
      <mesh position={[0, topY - topThickness / 2 + 0.012, depth / 2 - 0.002]}>
        <boxGeometry args={[width * 0.99, 0.012, 0.004]} />
        <primitive object={aluminum} attach="material" />
      </mesh>

      {/* Underglow strip */}
      <mesh position={[0, topY - topThickness / 2 - 0.005, 0]}>
        <boxGeometry args={[width * 0.94, 0.004, depth * 0.94]} />
        <primitive object={glow} attach="material" />
      </mesh>

      {/* Accent rail along the top back edge */}
      <mesh position={[0, topY + topThickness / 2 + 0.004, -depth / 2 + 0.02]}>
        <boxGeometry args={[width * 0.94, 0.006, 0.012]} />
        <primitive object={glow} attach="material" />
      </mesh>

      {floating ? (
        // Floating supports — two angled brackets attached to the back
        <>
          {[-1, 1].map((sx) => (
            <group key={sx} position={[sx * (width / 2 - 0.3), topY / 2, -depth / 2 + 0.05]}>
              <mesh castShadow>
                <boxGeometry args={[0.04, topY, 0.04]} />
                <primitive object={top} attach="material" />
              </mesh>
              <mesh
                position={[0, -topY / 2 + 0.06, depth / 2 - 0.06]}
                rotation={[Math.PI / 2.6, 0, 0]}
              >
                <boxGeometry args={[0.04, 0.04, depth * 0.9]} />
                <primitive object={top} attach="material" />
              </mesh>
            </group>
          ))}
        </>
      ) : (
        // Four full-height legs with metallic trim
        <>
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sz], i) => {
            const x = sx * (width / 2 - 0.16);
            const z = sz * (depth / 2 - 0.16);
            return (
              <group key={i} position={[x, topY / 2, z]}>
                <mesh castShadow>
                  <boxGeometry args={[legW, topY, legW]} />
                  <primitive object={top} attach="material" />
                </mesh>
                {/* metallic foot cap */}
                <mesh position={[0, -topY / 2 + 0.012, 0]}>
                  <boxGeometry args={[legW * 1.5, 0.022, legW * 1.5]} />
                  <primitive object={aluminum} attach="material" />
                </mesh>
                {/* glowing trim ring near the top */}
                <mesh position={[0, topY / 2 - 0.05, 0]}>
                  <boxGeometry args={[legW * 1.1, 0.006, legW * 1.1]} />
                  <primitive object={glow} attach="material" />
                </mesh>
              </group>
            );
          })}
        </>
      )}
    </group>
  );
}
