"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  accent: string;
}

/** Standard glowy pedestal used under most section objects. */
export default function Pedestal({ accent }: Props) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0c0f1f",
        emissive: accent,
        emissiveIntensity: 0.25,
        metalness: 0.4,
        roughness: 0.5,
      }),
    [accent],
  );

  return (
    <group position={[0, 0.05, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.1, 32]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.95, 0.012, 8, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}
