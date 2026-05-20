"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  accent: string;
  performanceMode: boolean;
}

/** Stylised floor with concentric glow rings — matches the room theme accent. */
export default function Floor({ accent, performanceMode }: Props) {
  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.5,
        transparent: true,
        opacity: 0.4,
      }),
    [accent],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#0a0c1a" metalness={0.6} roughness={0.55} />
      </mesh>

      {!performanceMode && (
        <>
          {[3.5, 5.5, 8].map((r) => (
            <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
              <ringGeometry args={[r, r + 0.04, 64]} />
              <primitive object={ringMat} attach="material" />
            </mesh>
          ))}
        </>
      )}

      {/* Center disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0, 1.2, 32]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.5}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}
