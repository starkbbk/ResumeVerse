"use client";

import { ReactNode, useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { matGold, matMarble, matSilver } from "./materials";

interface Props {
  /** Optional engraved nameplate text. */
  plaque?: string;
  /** Spotlight glow accent below the cup. */
  accent?: string;
  /** silver / gold / bronze palette. */
  metal?: "gold" | "silver" | "bronze";
  /** Subtitle below the plaque (e.g. project / award name). */
  subtitle?: ReactNode;
  /** Make the cup bigger / smaller. 1 = default. */
  scale?: number;
}

/**
 * Procedural lathe-based trophy:
 *   - granite base with chamfered top
 *   - engraved gold nameplate
 *   - tapered cup body via lathe geometry
 *   - two looping handles
 *   - golden top star
 */
export default function DetailedTrophy({
  plaque,
  accent = "#facc15",
  metal = "gold",
  subtitle,
  scale = 1,
}: Props) {
  const metalMat = useMemo(() => (metal === "silver" ? matSilver() : matGold()), [metal]);
  const marble = useMemo(matMarble, []);

  // Build the cup as a lathe by sweeping a profile around the Y axis.
  const cupPoints = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0, 0.0));
    pts.push(new THREE.Vector2(0.045, 0.0));
    pts.push(new THREE.Vector2(0.06, 0.04));
    pts.push(new THREE.Vector2(0.05, 0.12));
    pts.push(new THREE.Vector2(0.07, 0.18));
    pts.push(new THREE.Vector2(0.115, 0.22));
    pts.push(new THREE.Vector2(0.13, 0.32));
    pts.push(new THREE.Vector2(0.125, 0.42));
    pts.push(new THREE.Vector2(0.115, 0.46));
    return pts;
  }, []);

  return (
    <group scale={scale}>
      {/* Pedestal halo (subtle accent on the floor) */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.26, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>

      {/* Granite base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.08, 0.32]} />
        <primitive object={marble} attach="material" />
      </mesh>
      {/* Top chamfer of base */}
      <mesh position={[0, 0.08 + 0.012, 0]} castShadow>
        <boxGeometry args={[0.32, 0.02, 0.28]} />
        <primitive object={marble} attach="material" />
      </mesh>

      {/* Gold plaque on the front of the base */}
      <mesh position={[0, 0.06, 0.165]}>
        <boxGeometry args={[0.26, 0.04, 0.004]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      {plaque && (
        <Html
          transform
          position={[0, 0.06, 0.169]}
          distanceFactor={2.4}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-[6.5px] font-serif font-bold uppercase tracking-[0.2em] text-amber-900 select-none whitespace-nowrap">
            {plaque}
          </div>
        </Html>
      )}

      {/* Stem (slim cylinder) */}
      <mesh position={[0, 0.155, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 0.06, 16]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {/* Cup body via lathe */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <latheGeometry args={[cupPoints, 32]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {/* Two handles */}
      {[-1, 1].map((sx) => (
        <mesh
          key={sx}
          position={[sx * 0.13, 0.34, 0]}
          rotation={[Math.PI / 2, 0, sx * Math.PI * 0.5]}
          castShadow
        >
          <torusGeometry args={[0.06, 0.014, 12, 24, Math.PI]} />
          <primitive object={metalMat} attach="material" />
        </mesh>
      ))}

      {/* Top star */}
      <mesh position={[0, 0.66, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.05, 0.1, 5]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {/* Inner cup glow */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={accent} transparent opacity={0.65} />
      </mesh>

      {subtitle && (
        <Html
          transform
          position={[0, -0.06, 0.18]}
          distanceFactor={3}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-[7px] uppercase tracking-widest text-amber-200/70 font-bold whitespace-nowrap">
            {subtitle}
          </div>
        </Html>
      )}
    </group>
  );
}
