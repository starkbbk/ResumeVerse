"use client";

import { ReactNode, useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { matGold, matSilver } from "./materials";

interface Props {
  metal?: "gold" | "silver" | "bronze";
  ribbon1?: string;
  ribbon2?: string;
  /** Floating label to the right of the medal. */
  label?: ReactNode;
}

/**
 * Hanging medal: V-ribbon, scallop-edged disc with a star at center,
 * and an optional metal mounting hook.
 */
export default function DetailedMedal({
  metal = "gold",
  ribbon1 = "#ef4444",
  ribbon2 = "#3b82f6",
  label,
}: Props) {
  const metalMat = useMemo(() => (metal === "silver" ? matSilver() : matGold()), [metal]);
  const innerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: metal === "silver" ? "#f3f4f6" : "#fbbf24",
        emissive: metal === "silver" ? "#888" : "#7c2d12",
        emissiveIntensity: 0.25,
        metalness: 0.95,
        roughness: 0.15,
      }),
    [metal],
  );

  return (
    <group>
      {/* Mounting hook */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.022, 0.005, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#cdd2dc" metalness={0.95} roughness={0.18} />
      </mesh>

      {/* Ribbons forming a V */}
      <mesh position={[-0.025, 0.2, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.04, 0.22, 0.005]} />
        <meshStandardMaterial color={ribbon1} roughness={0.7} />
      </mesh>
      <mesh position={[0.025, 0.2, 0]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.04, 0.22, 0.005]} />
        <meshStandardMaterial color={ribbon2} roughness={0.7} />
      </mesh>

      {/* Medal disc */}
      <mesh castShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.014, 32]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      {/* Scallop edge */}
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[0.094, 0.012, 8, 32]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      {/* Inner ring */}
      <mesh position={[0, 0.04, 0.008]}>
        <cylinderGeometry args={[0.062, 0.062, 0.006, 32]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Engraved star */}
      <mesh position={[0, 0.04, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.028, 0.005, 5]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {label && (
        <Html
          transform
          position={[0.18, 0.04, 0]}
          distanceFactor={3.4}
          style={{ pointerEvents: "none" }}
        >
          <div className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-[7px] font-bold uppercase tracking-widest text-amber-200 whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
