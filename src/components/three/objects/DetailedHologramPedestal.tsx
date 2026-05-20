"use client";

import { ReactNode, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { matChassis, matEmissive, matAluminum } from "./materials";

interface Props {
  accent?: string;
  /** Optional content rendered above the disc — typically a hologram body. */
  children?: ReactNode;
  /** Scale factor for the disc + base. */
  scale?: number;
}

/**
 * Modern hologram emitter pedestal:
 *   - chamfered metal base
 *   - inner emitter disc with rotating tick marks
 *   - upward light cone shaft
 */
export default function DetailedHologramPedestal({
  accent = "#22d3ee",
  children,
  scale = 1,
}: Props) {
  const chassis = useMemo(matChassis, []);
  const aluminum = useMemo(matAluminum, []);
  const ringMat = useMemo(() => matEmissive(accent, 1.6), [accent]);
  const tickRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (tickRef.current) tickRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group scale={scale}>
      {/* Floor halo */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.62, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.15} />
      </mesh>

      {/* Outer base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.62, 0.08, 48]} />
        <primitive object={chassis} attach="material" />
      </mesh>
      {/* Top step */}
      <mesh position={[0, 0.092, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.5, 0.025, 48]} />
        <primitive object={aluminum} attach="material" />
      </mesh>
      {/* Emitter disc */}
      <mesh position={[0, 0.108, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.006, 48]} />
        <meshStandardMaterial
          color="#04060f"
          emissive={accent}
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Glowing edge ring */}
      <mesh position={[0, 0.116, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.008, 8, 64]} />
        <primitive object={ringMat} attach="material" />
      </mesh>
      {/* Rotating emitter tick marks */}
      <group ref={tickRef} position={[0, 0.114, 0]}>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r = 0.36;
          return (
            <mesh key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
              <boxGeometry args={[0.012, 0.002, 0.04]} />
              <meshBasicMaterial color={accent} transparent opacity={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* Upward light shaft */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 1.2, 32, 1, true]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {children && <group position={[0, 0.13, 0]}>{children}</group>}
    </group>
  );
}
