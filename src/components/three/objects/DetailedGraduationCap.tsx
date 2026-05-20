"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  /** Tassel color. */
  tassel?: string;
}

/**
 * Detailed mortarboard:
 *   - cylindrical skull
 *   - square board on top (slightly oversized, beveled)
 *   - braided tassel cord with golden cap
 */
export default function DetailedGraduationCap({ tassel = "#fbbf24" }: Props) {
  const black = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0d18",
        roughness: 0.55,
        metalness: 0.2,
      }),
    [],
  );
  const tasselMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: tassel,
        emissive: tassel,
        emissiveIntensity: 0.25,
        metalness: 0.6,
        roughness: 0.4,
      }),
    [tassel],
  );

  return (
    <group>
      {/* Skull cap */}
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.115, 0.07, 28]} />
        <primitive object={black} attach="material" />
      </mesh>
      {/* Skull rim trim */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.115, 0.005, 8, 28]} />
        <primitive object={black} attach="material" />
      </mesh>

      {/* Mortar board */}
      <mesh position={[0, 0.075, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.32, 0.012, 0.32]} />
        <primitive object={black} attach="material" />
      </mesh>
      {/* Bevel underside */}
      <mesh position={[0, 0.07, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.31, 0.005, 0.31]} />
        <meshStandardMaterial color="#1a1d2c" roughness={0.6} />
      </mesh>

      {/* Center button */}
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <primitive object={tasselMat} attach="material" />
      </mesh>

      {/* Tassel cord */}
      <mesh position={[0.07, 0.065, 0.07]} rotation={[0.4, 0, -0.3]}>
        <cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />
        <primitive object={tasselMat} attach="material" />
      </mesh>
      {/* Tassel head */}
      <mesh position={[0.13, -0.005, 0.13]}>
        <coneGeometry args={[0.022, 0.05, 8]} />
        <primitive object={tasselMat} attach="material" />
      </mesh>
    </group>
  );
}
